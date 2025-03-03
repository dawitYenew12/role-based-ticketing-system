import { Request, Response } from 'express';
import authService from '../services/auth.service';
import logger from '../config/logger';
import httpStatus from 'http-status';

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
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
  } catch (error) {
    logger.error(`Error registering user: ${(error as Error).message}`);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await authService.authenticateUser(email, password);
    logger.info('result: ');
    logger.info(result);
    if (result.success) {
      res.status(httpStatus.OK).json({ success: true, token: result.tokens });
    } else {
      res
        .status(httpStatus.UNAUTHORIZED)
        .json({ success: false, message: result.message });
    }
  } catch (error) {
    logger.error(`Error logging in user: ${(error as Error).message}`);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'Internal server error' });
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshAuthToken(refreshToken);

    res.status(httpStatus.OK).json({
      success: true,
      accessToken: tokens.access.token,
      refreshToken: tokens.refresh.token,
      expiresIn: tokens.access.expires,
    });
  } catch (error) {
    logger.error(`Error refreshing auth token: ${(error as Error).message}`);
    res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: 'Failed to refresh token' });
  }
};
