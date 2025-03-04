import express from 'express';
import { getUserProfile, getAllUsers } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/:id', authenticate, getUserProfile);
router.get('/', authenticate, getAllUsers);

export default router;
