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

    if (result.success) {
      res.status(httpStatus.OK).json({ success: true, token: result.token });
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
