import { Request, Response } from 'express';
import authService from '../services/auth.service';
import httpStatus from 'http-status';
import { catchAsync } from '../utils/catchAsync';

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
