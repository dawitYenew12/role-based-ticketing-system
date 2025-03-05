import ticketService from '../services/ticket.service';
import { Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import logger from '../config/logger';
import { catchAsync } from '../utils/catchAsync';
import { AuthenticatedRequest } from '../types';
import { TicketStatus } from '../models/ticket.model';

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
  logger.info('Tickets: ', JSON.stringify(tickets));
  res.status(httpStatus.OK).json({ sucess: true, data: tickets });
});

export const updateTicketStatus = catchAsync(
  async (req: Request, res: Response) => {
    const authenticatedReq = req as AuthenticatedRequest;
    if (!authenticatedReq.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'User not authenticated');
    }
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(TicketStatus).includes(status)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid ticket status');
    }
    const updatedTicket = await ticketService.updateTicketStatus(id, status);
    res.status(httpStatus.OK).json({ success: true, data: updatedTicket });
  },
);
