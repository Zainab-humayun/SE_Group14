// import { Router, Request, Response } from "express";
// import { refreshTokenFunc, loginFunc, signupFunc, logoutFunc, getAuthenticatedUser } from "../controllers/authControllers.js";
// import verify from "../middleware/protectRoute.js";


// const router = Router();

// //These routes are not protected
// router.post("/login", loginFunc);
// router.post("/signup", signupFunc);

// //These routes are protected
// router.post("/refresh", verify, refreshTokenFunc);
// router.post("/logout", verify, logoutFunc);
// router.get("/me", verify, getAuthenticatedUser);

// export default router;


// src/routes/auth.routes.ts
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

// public
router.post('/signup', signupFunc);
router.post('/login', loginFunc);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

// protected
router.post('/refresh', verify, refreshTokenFunc);
router.post('/logout', verify, logoutFunc);
router.get('/me', verify, getAuthenticatedUser);

export default router;
