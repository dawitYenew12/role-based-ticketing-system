import express from 'express';
import {
  signup,
  signupBySelectingRole,
  login,
  // refreshToken,
  // validateToken,
} from '../controllers/auth.controller';

const router = express.Router();

router.post('/signup-with-role', signupBySelectingRole);
router.post('/signup', signup);
router.post('/login', login);
// router.post('/refresh-token', refreshToken);
// router.post('/validate-token', validateToken);

export default router;
