import ticketService from '../services/ticket.service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import logger from '../config/logger';
import { catchAsync } from '../utils/catchAsync';
import { AuthenticatedRequest } from '../types';

export const createTicket = catchAsync(async (req: Request, res: Response) => {
  const authenticatedReq = req as AuthenticatedRequest;
  const { title, description, createdBy } = authenticatedReq.body;
  const ticket = await ticketService.createTicket(
    title,
    description,
    createdBy,
  );
  res.status(httpStatus.CREATED).send(ticket);
});

export const getOwnTickets = catchAsync(async (req: Request, res: Response) => {
  const authenticatedReq = req as AuthenticatedRequest;
  if (!authenticatedReq.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }
  const userId = authenticatedReq.user.userId;
  const tickets = await ticketService.getOwnTickets(userId);
  res.status(httpStatus.OK).json({ sucess: true, data: tickets });
});

export const getAllTickets = catchAsync(async (req: Request, res: Response) => {
  const authenticatedReq = req as AuthenticatedRequest;
  if (!authenticatedReq.user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }
  const userRole = authenticatedReq.user.role;
  if (userRole !== 'admin201') {
    throw new ApiError(httpStatus.FORBIDDEN, 'User not authorized');
  }
  const tickets = await ticketService.getAllTickets();
  logger.info(`Tickets: ${tickets}`);
  res.status(httpStatus.OK).json({ sucess: true, data: tickets });
});
