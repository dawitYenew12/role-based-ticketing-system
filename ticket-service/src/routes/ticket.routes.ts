import express from 'express';
import {
  createTicket,
  getOwnTickets,
  getAllTickets,
} from '../controllers/ticket.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/tickets', authenticate, createTicket);
router.get('/tickets/own', authenticate, getOwnTickets);
router.get('/tickets/all', authenticate, getAllTickets);

export default router;
