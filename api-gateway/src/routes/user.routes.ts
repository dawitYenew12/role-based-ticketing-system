import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getAllUsers, getUserProfile } from '../controllers/user.controller';

const router = express.Router();

router.get('/:id', authenticate, getUserProfile);
router.get('/getAll', authenticate, getAllUsers);

export default router;
