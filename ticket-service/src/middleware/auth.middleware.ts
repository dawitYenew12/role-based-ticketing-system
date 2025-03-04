import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import { AuthenticatedRequest } from '../types';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authenticatedReq = req as AuthenticatedRequest;
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required');
    }
    const response = await axios.post(
      'http://localhost:3001/v1/auth/validate',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.status !== httpStatus.OK) {
      throw new ApiError(response.status, 'User not authenticated');
    }
    authenticatedReq.user = {
      userId: response.data.user._id,
      role: response.data.user.role,
    };
    next();
  } catch (error) {
    next(error);
  }
};
