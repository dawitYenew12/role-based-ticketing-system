import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../utils/types';
import { catchAsync } from '../utils/catchAsync';
import userService from '../services/user.service';
import httpStatus from 'http-status';

export const getUserProfile = catchAsync(
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.params.id;
    const requestingUserId = req.user.userId;
    const userRole = req.user.role;

    const userProfile = await userService.getUserProfile(
      userId,
      requestingUserId,
      userRole,
    );
    res.status(httpStatus.OK).json({ success: true, profile: userProfile });
  },
);

export const getAllUsers = catchAsync(
  async (_req: Request, res: Response): Promise<void> => {
    const users = await userService.getAllUsers();
    res.status(httpStatus.OK).json({ success: true, users });
  },
);
