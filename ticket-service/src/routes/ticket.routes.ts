import express from 'express';
import {
  createTicket,
  getOwnTickets,
  getAllTickets,
  updateTicketStatus,
} from '../controllers/ticket.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/tickets', authenticate, createTicket);
router.get('/tickets/own', authenticate, getOwnTickets);
router.get('/tickets/all', authenticate, getAllTickets);
router.put('/tickets/:id', authenticate, updateTicketStatus);

export default router;
