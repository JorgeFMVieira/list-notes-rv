import dotenv from 'dotenv';
import express, { Request, Response, Application } from 'express';
import cors from "cors";
import UserController from '../Controllers/Users/UserController';
import Auth from '../Middleware/Users/Auth';
const router = express.Router();

dotenv.config();

router.post("/register", UserController.Register);

router.post("/login", UserController.UserLogin);

router.post('/ForgotPassword', UserController.ForgotPassword);

router.post('/ResetPassword', UserController.ResetPassword);

export default router;