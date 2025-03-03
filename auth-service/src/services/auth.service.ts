import { User } from '../models/user.model';
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
}

export const generateToken = (
  userId: string,
  expires: dayjs.Dayjs,
  type: string,
  secret: string = config.jwt.secretKey,
): string => {
  const payload: TokenPayload = {
    subject: userId, // The 'subject' field typically represents the user ID
    issueDate: dayjs().unix(), // Issue date as a Unix timestamp
    expTime: expires.unix(), // Expiration time as a Unix timestamp
    type,
  };

  return jwt.sign(payload, secret);
};

const generateAuthTokens = async (
  userId: string,
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
    );

    const refreshTokenExpires = dayjs().add(
      config.jwt.refreshTokenDays,
      'days',
    );
    const refreshToken = generateToken(
      userId,
      refreshTokenExpires,
      tokenTypes.REFRESH,
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

    return await generateAuthTokens(user._id.toString());
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

const authenticateUser = async (
  email: string,
  password: string,
): Promise<{
  success: boolean;
  message: string;
  tokens?: AuthTokensResponse;
}> => {
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.isPasswordMatch(password))) {
      return { success: false, message: 'Invalid credentials' };
    }

    const tokens = await generateAuthTokens(user._id.toString());
    logger.info(`User logged in: ${email}`);
    return { success: true, message: 'Login successful', tokens: tokens };
  } catch (error: any) {
    logger.error(`Authentication error: ${error.message}`);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to authenticate user',
    );
  }
};

export default { registerUser, authenticateUser, refreshAuthToken };
