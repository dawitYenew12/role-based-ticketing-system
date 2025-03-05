import { Request, Response, NextFunction } from 'express';
import authService from '../services/auth.service';
import httpStatus from 'http-status';
import { catchAsync } from '../utils/catchAsync';
import ApiError from '../utils/ApiError';
import logger from '../config/logger';
import config from '../config/config';
import jwt from 'jsonwebtoken';
import { tokenTypes } from '../config/token';
import { getUserById } from '../services/auth.service';

export const signup = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const result = await authService.registerUser(email, password);
    if (result.success) {
      res
        .status(httpStatus.CREATED)
        .json({ success: true, message: 'User registered successfully' });
    } else {
      res
        .status(httpStatus.BAD_REQUEST)
        .json({ success: false, message: result.message });
    }
  },
);

export const signupBySelectingRole = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password, role } = req.body;
    const result = await authService.registerUserWithRole(
      email,
      password,
      role,
    );
    if (result.success) {
      res
        .status(httpStatus.CREATED)
        .json({ success: true, message: 'User registered successfully' });
    } else {
      res
        .status(httpStatus.BAD_REQUEST)
        .json({ success: false, message: result.message });
    }
  },
);

export const login = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const result = await authService.authenticateUser(email, password);
    if (result.success) {
      res.status(httpStatus.OK).json({ success: true, token: result.tokens });
    } else {
      res
        .status(httpStatus.UNAUTHORIZED)
        .json({ success: false, message: 'user is unauthorized' });
    }
  },
);

export const refreshToken = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshAuthToken(refreshToken);

    res.status(httpStatus.OK).json({
      success: true,
      accessToken: tokens.access.token,
      refreshToken: tokens.refresh.token,
      expiresIn: tokens.access.expires,
    });
  },
);

export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Token is required'));
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secretKey);
    if ((decoded as any).type !== tokenTypes.ACCESS) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token type');
    }
    const userId = (decoded as any).subject;

    const user = await getUserById(userId);

    if (!user) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: 'Invalid token' });
    }

    return res.status(httpStatus.OK).json({ success: true, user });
  } catch (error) {
    logger.info(error);
    return next(
      new ApiError(httpStatus.UNAUTHORIZED, 'Token validation failed'),
    );
  }
};
