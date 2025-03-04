import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import userService from '../services/user.service';
import httpStatus from 'http-status';

export const getUserProfile = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;
    if (!req.user) {
      res
        .status(httpStatus.UNAUTHORIZED)
        .json({ success: false, message: 'Unauthorized' });
      return;
    }
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
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      res
        .status(httpStatus.UNAUTHORIZED)
        .json({ success: false, message: 'Unauthorized' });
      return;
    }
    const userRole = req.user.role;
    const users = await userService.getAllUsers(userRole);
    res.status(httpStatus.OK).json({ success: true, users });
  },
);
