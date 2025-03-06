import axios from 'axios';
import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import logger from '../config/logger';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import {
  getCachedTicket,
  cacheTicketData,
} from '../services/tickets.catche.service';

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

    res.status(response.status).json(response.data);
  },
);

export const getAllTickets = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
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
      // Check Redis cache first
      const cachedTickets = await getCachedTicket('allTickets');
      if (cachedTickets) {
        logger.info('Serving tickets from cache');
        res.status(httpStatus.OK).json(cachedTickets);
        return;
      }

      // Fetch from the ticket service if not in cache
      const response = await axios.get('http://localhost:3002/v1/tickets/all', {
        headers: {
          'x-user-id': userId,
          'x-user-role': userRole,
          Authorization: authorization,
        },
      });

      // Cache the result in Redis
      await cacheTicketData('allTickets', response.data);

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
    res.status(response.status).json(response.data);
  },
);

export const updateTicketStatus = catchAsync(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }
    const userId = req.user.userId;
    const userRole = req.user.role;
    const authorization = req.headers.authorization;
    const { id } = req.params;

    try {
      const response = await axios.put(
        `http://localhost:3002/v1/tickets/${id}`,
        req.body,
        {
          headers: {
            'x-user-id': userId,
            'x-user-role': userRole,
            Authorization: authorization,
          },
        },
      );

      logger.info(`Ticket ${id} status updated successfully`);
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
