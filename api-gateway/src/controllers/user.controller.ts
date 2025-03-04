import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import httpStatus from 'http-status';
import axios from 'axios';
import { UserRole } from '../models/userProfile.model';
import logger from '../config/logger';

export const getUserProfile = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;
    if (!req.user) {
      res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }
    const requestingUserId = req.user.userId;
    const userRole = req.user.role;

    if (userId !== requestingUserId && userRole !== UserRole.ADMIN) {
      logger.warn(
        `User ${requestingUserId} is not authorized to access user ${userId}`,
      );
      res.status(httpStatus.FORBIDDEN).json({
        success: false,
        message: 'You are not authorized to access this resource',
      });
      return;
    }

    const response = await axios.get(
      `http://user-service:4002/users/${userId}`,
      {
        headers: {
          'x-user-id': requestingUserId,
          'x-user-role': userRole,
        },
      },
    );
    res.status(response.status).json(response.data);
  },
);

export const getAllUsers = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    const requestingUserId = req.user?.userId;
    const userRole = req.user?.role;

    if (requestingUserId && userRole === UserRole.ADMIN) {
      const response = await axios.get('http://user-service:4002/users');
      res.status(response.status).json(response.data);
      return;
    } else {
      res.status(httpStatus.FORBIDDEN).json({
        success: false,
        message: 'You are not authorized to access this resource',
      });
    }
  },
);
