import logger from '../config/logger';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import Ticket, { TicketStatus } from '../models/ticket.model';
import mongoose from 'mongoose';
import { getUserDetails } from './user.service';

const createTicket = async (
  title: string,
  description: string,
  createdBy: string,
): Promise<any> => {
  try {
    const ticket = new Ticket({ title, description, createdBy });
    const tickets = await ticket.save();
    logger.info(JSON.stringify(tickets));
    return tickets;
  } catch (error) {
    logger.error(`Error creating ticket: ${error}`);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error creating ticket',
    );
  }
};

const getOwnTickets = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
): Promise<any> => {
  try {
    const skip = (page - 1) * limit;
    const tickets = await Ticket.find({ createdBy: userId })
      .skip(skip)
      .limit(limit);
    const total = await Ticket.countDocuments({ createdBy: userId });

    // Add creator email to each ticket
    const ticketsWithCreatorEmail = await Promise.all(
      tickets.map(async (ticket) => {
        const ticketObj = ticket.toObject();
        const userDetails = await getUserDetails(String(ticket.createdBy));
        return {
          ...ticketObj,
          createdByEmail: userDetails?.email || 'Unknown',
        };
      }),
    );

    return {
      tickets: ticketsWithCreatorEmail,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTickets: total,
    };
  } catch (error) {
    logger.error(`Error getting tickets: ${error}`);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error getting tickets',
    );
  }
};

const getAllTickets = async (
  page: number = 1,
  limit: number = 10,
): Promise<any> => {
  try {
    const skip = (page - 1) * limit;
    const tickets = await Ticket.find({}).skip(skip).limit(limit);
    const total = await Ticket.countDocuments({});

    // Add creator email to each ticket
    const ticketsWithCreatorEmail = await Promise.all(
      tickets.map(async (ticket) => {
        const ticketObj = ticket.toObject();
        const userDetails = await getUserDetails(String(ticket.createdBy));
        logger.info(userDetails);
        return {
          ...ticketObj,
          createdByEmail: userDetails?.email || 'Unknown',
        };
      }),
    );

    return {
      tickets: ticketsWithCreatorEmail,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTickets: total,
    };
  } catch (error) {
    logger.error(`Error getting tickets: ${error}`);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error getting tickets',
    );
  }
};

const updateTicketStatus = async (
  ticketId: string,
  status: TicketStatus,
): Promise<any> => {
  try {
    logger.info('seriv');
    const ticketIdObj = new mongoose.Types.ObjectId(ticketId);
    logger.info(ticketIdObj);
    const ticket = await Ticket.findById(ticketIdObj);
    if (!ticket) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Ticket not found');
    }

    ticket.status = status;
    ticket.updatedAt = new Date();
    const updatedTicket = await ticket.save();
    return updatedTicket;
  } catch (error) {
    logger.error(`Error updating ticket status: ${error}`);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error updating ticket status',
    );
  }
};

export default {
  createTicket,
  getOwnTickets,
  getAllTickets,
  updateTicketStatus,
};
