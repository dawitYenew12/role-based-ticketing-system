import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  generateTicket,
  getAllTickets,
  getOwnTickets,
  updateTicketStatus,
} from '../controllers/ticket.controller';

const router = express.Router();

router.post('/', authenticate, generateTicket);
router.get('/own', authenticate, getOwnTickets);
router.get('/all', authenticate, getAllTickets);
router.put('/:id', authenticate, updateTicketStatus);

export default router;
