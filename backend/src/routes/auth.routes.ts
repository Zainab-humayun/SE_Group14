import { Router } from 'express';
import {
  refreshTokenFunc,
  loginFunc,
  signupFunc,
  logoutFunc,
  sendOTP,
  verifyOTP,
  getAuthenticatedUser
} from '../controllers/authControllers.js';
import verify from '../middleware/protectRoute.js';

const router = Router();

router.post('/signup', signupFunc);
router.post('/login', loginFunc);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

router.post('/refresh', verify, refreshTokenFunc);
router.post('/logout', verify, logoutFunc);
router.get('/me', verify, getAuthenticatedUser);

export default router;
