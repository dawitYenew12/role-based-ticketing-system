import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  generateTicket,
  getAllTickets,
  getOwnTickets,
} from '../controllers/ticket.controller';

const router = express.Router();

router.post('/', authenticate, generateTicket);
router.get('/own', authenticate, getOwnTickets);
router.get('/all', authenticate, getAllTickets);

export default router;
