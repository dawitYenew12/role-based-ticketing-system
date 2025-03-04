import express from 'express';
import {
  signup,
  login,
  signupBySelectingRole,
} from '../controllers/auth.controller';
import { validateToken } from '../controllers/auth.controller';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/validate', validateToken);
router.post('/register', signupBySelectingRole);

export default router;
