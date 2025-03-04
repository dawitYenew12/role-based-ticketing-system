import logger from '../config/logger';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import Ticket from '../models/ticket.model';

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

const getOwnTickets = async (userId: string): Promise<any> => {
  try {
    const tickets = await Ticket.find({ createdBy: userId });
    return tickets;
  } catch (error) {
    logger.error(`Error getting tickets: ${error}`);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error getting tickets',
    );
  }
};

const getAllTickets = async (): Promise<any> => {
  try {
    const tickets = await Ticket.find({});
    return tickets;
  } catch (error) {
    logger.error(`Error getting tickets: ${error}`);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Error getting tickets',
    );
  }
};
export default { createTicket, getOwnTickets, getAllTickets };
