import axios from 'axios';
import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import logger from '../config/logger';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

export const generateTicket = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }
    const userId = req.user.userId;
    const userRole = req.user.role;
    const authorization = req.headers.authorization;
    const response = await axios.post(
      'http://localhost:3002/v1/tickets',
      req.body,
      {
        headers: {
          'x-user-id': userId,
          'x-user-role': userRole,
          Authorization: authorization,
        },
      },
    );

    logger.info(JSON.stringify(response.data));
    res.status(response.status).json(response.data);
  },
);

export const getAllTickets = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    logger.info('before');

    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }

    const userId = req.user.userId;
    const userRole = req.user.role;
    const authorization = req.headers.authorization;

    if (userRole !== 'admin201') {
      logger.info(`Unauthorized access attempt by user ${req.user.userId}`);
      res
        .status(httpStatus.FORBIDDEN)
        .json({ success: false, message: 'User not authorized' });
      return;
    }

    try {
      const response = await axios.get('http://localhost:3002/v1/tickets/all', {
        headers: {
          'x-user-id': userId,
          'x-user-role': userRole,
          Authorization: authorization,
        },
      });

      logger.info(JSON.stringify(response.data));
      res.status(response.status).json(response.data);
    } catch (error: any) {
      if (error.response) {
        logger.error(
          `Error response from ticket service: ${JSON.stringify(error.response.data)}`,
        );
        res.status(error.response.status).json(error.response.data);
      } else if (error.request) {
        logger.error(
          `No response received from ticket service: ${error.message}`,
        );
        res
          .status(httpStatus.SERVICE_UNAVAILABLE)
          .json({ success: false, message: 'Ticket service is unavailable' });
      } else {
        logger.error(`Unexpected error: ${error.message}`);
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({ success: false, message: 'Something went wrong' });
      }
    }
  },
);

export const getOwnTickets = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }
    const userId = req.user.userId;
    const userRole = req.user.role;
    const authorization = req.headers.authorization;
    const response = await axios.get('http://localhost:3002/v1/tickets/own', {
      headers: {
        'x-user-id': userId,
        'x-user-role': userRole,
        Authorization: authorization,
      },
    });

    logger.info(JSON.stringify(response.data));
    logger.info(`Tickets retrieved for user ${userId}`);
    res.status(response.status).json(response.data);
  },
);
