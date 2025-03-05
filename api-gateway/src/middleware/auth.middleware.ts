import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import logger from '../config/logger';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    logger.info(token);
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
      throw new ApiError(response.status, response.data.message);
    }
    const user = {
      userId: response.data.user._id,
      role: response.data.user.role,
    };
    req.headers['Authorization'] = `Bearer ${token}`;
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
