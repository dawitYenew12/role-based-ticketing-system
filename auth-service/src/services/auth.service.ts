import { User, IUser } from '../models/user.model';
import logger from '../config/logger';
import { getChannel } from '../config/rabbitmq';
import dayjs from 'dayjs';
import config from '../config/config';
import jwt from 'jsonwebtoken';
import { tokenTypes } from '../config/token';
import { Token } from '../models/token.model';
import { IToken } from '../models/token.model';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { UserRole } from '../models/user.model';

interface RegisterUserResponse {
  success: boolean;
  message: string;
  userId?: string;
}

interface TokenInfo {
  token: string;
  expires: Date;
}
interface AuthTokensResponse {
  access: TokenInfo;
  refresh: TokenInfo;
}

interface TokenPayload {
  subject: string;
  issueDate: number;
  expTime: number;
  type: string;
  role: string;
}

export const generateToken = (
  userId: string,
  expires: dayjs.Dayjs,
  type: string,
  userRole: string,
  secret: string = config.jwt.secretKey,
): string => {
  const payload: TokenPayload = {
    subject: userId, // The 'subject' field typically represents the user ID
    role: userRole,
    issueDate: dayjs().unix(), // Issue date as a Unix timestamp
    expTime: expires.unix(),
    type,
  };

  return jwt.sign(payload, secret);
};

const generateAuthTokens = async (
  userId: string,
  userRole: string,
): Promise<AuthTokensResponse> => {
  try {
    const accessTokenExpires = dayjs().add(
      config.jwt.accessTokenMinutes,
      'minutes',
    );
    const accessToken = generateToken(
      userId,
      accessTokenExpires,
      tokenTypes.ACCESS,
      userRole,
    );

    const refreshTokenExpires = dayjs().add(
      config.jwt.refreshTokenDays,
      'days',
    );
    const refreshToken = generateToken(
      userId,
      refreshTokenExpires,
      tokenTypes.REFRESH,
      userRole,
    );

    await Token.create({
      token: refreshToken,
      user: userId,
      type: tokenTypes.REFRESH,
      expires: refreshTokenExpires,
      blacklisted: false,
    });

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpires.toDate(),
      },
      refresh: {
        token: refreshToken,
        expires: refreshTokenExpires.toDate(),
      },
    };
  } catch (error) {
    logger.error(`Error generating auth tokens: ${(error as Error).message}`);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to generate auth tokens',
    );
  }
};

const verifyToken = async (token: string, type: string): Promise<IToken> => {
  try {
    const payload = jwt.verify(token, config.jwt.secretKey) as TokenPayload;

    const tokenDoc = await Token.findOne({
      token,
      type,
      user: payload.subject,
      blacklisted: false,
    });

    if (!tokenDoc) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
    }

    return tokenDoc;
  } catch (error) {
    logger.error(`Error verifying token: ${(error as Error).message}`);
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token');
  }
};

const refreshAuthToken = async (
  refreshToken: string,
): Promise<AuthTokensResponse> => {
  try {
    const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH);
    const user = await User.findById(refreshTokenDoc.user);

    if (!user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
    }

    await refreshTokenDoc.deleteOne();

    return await generateAuthTokens(user._id.toString(), user.role);
  } catch (error) {
    logger.error(`Error refreshing auth token: ${(error as Error).message}`);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to refresh token',
    );
  }
};

const registerUser = async (
  email: string,
  password: string,
): Promise<RegisterUserResponse> => {
  try {
    // Check if email is already registered
    if (await User.isEmailRegistered(email)) {
      return { success: false, message: 'Email already registered' };
    }

    // Create new user
    const user = new User({ email, password });
    await user.save();

    // Send user-created event to RabbitMQ
    const channel = getChannel();
    if (channel) {
      channel.sendToQueue(
        'user-created',
        Buffer.from(
          JSON.stringify({
            userId: user._id,
            email: user.email,
            role: user.role,
          }),
        ),
      );
    }

    logger.info(`User registered: ${user.email}`);
    return {
      success: true,
      message: 'User registered successfully',
      userId: user._id.toString(),
    };
  } catch (error: any) {
    logger.error(`Error registering user: ${error.message}`);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to register user',
    );
  }
};

const registerUserWithRole = async (
  email: string,
  password: string,
  role: string,
): Promise<RegisterUserResponse> => {
  try {
    if (await User.isEmailRegistered(email)) {
      return { success: false, message: 'Email already registered' };
    }
    let modifiedRole: string = role;
    if (role) {
      if (role === 'admin') {
        modifiedRole = UserRole.ADMIN;
      } else if (role === 'user') {
        modifiedRole = UserRole.USER;
      }
    }
    const user = new User({ email, password, role: modifiedRole });
    await user.save();

    const channel = getChannel();
    if (channel) {
      channel.sendToQueue(
        'user-created',
        Buffer.from(
          JSON.stringify({
            userId: user._id,
            email: user.email,
            role: user.role,
          }),
        ),
      );
    }
    logger.info(`User registered: ${user.email}`);
    return {
      success: true,
      message: 'User registered successfully',
      userId: user._id.toString(),
    };
  } catch (error: any) {
    logger.error(`Error registering user: ${error.message}`);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to register user',
    );
  }
};

const authenticateUser = async (
  email: string,
  password: string,
): Promise<{
  success: boolean;
  message: string;
  tokens?: AuthTokensResponse;
  statusCode?: number;
}> => {
  try {
    const user = await User.findOne({ email });
    logger.info(password);
    if (!user || !(await user.isPasswordMatch(password))) {
      logger.info('Invalid credentials');
      return {
        success: false,
        message: 'Invalid credentials',
        statusCode: 401,
      };
    }
    const tokens = await generateAuthTokens(
      user._id.toString(),
      user.role.toString(),
    );
    return { success: true, message: 'Login successful', tokens: tokens };
  } catch (error: any) {
    logger.error(`Authentication error: ${error.message}`);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to authenticate user',
    );
  }
};

export const getUserById = async (userId: string): Promise<IUser | null> => {
  const id = new mongoose.Types.ObjectId(userId);
  const user = await User.findById(id);
  return user;
};

export default {
  registerUser,
  authenticateUser,
  refreshAuthToken,
  registerUserWithRole,
};
