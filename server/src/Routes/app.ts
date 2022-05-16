import dotenv from 'dotenv';
import express, { Request, Response, Application } from 'express';
import cors from "cors";
import UserController from '../Controllers/Users/UserController';
import Auth from '../Middleware/Users/Auth';
import NotesController from '../Controllers/Notes/NotesController';
const router = express.Router();

dotenv.config();

// User Routes
router.post("/register", UserController.Register);

router.post("/login", UserController.UserLogin);

router.post('/ForgotPassword', UserController.ForgotPassword);

router.post('/ResetPassword', UserController.ResetPassword);

router.post("/getUser", UserController.GetUser);

router.post("/updateUser", UserController.UpdateUser);

router.post("/changeCurrentPassword", UserController.ChangeCurrentPassword);


// Notes Routes
router.post("/createNote", NotesController.CreateNote);

router.post("/listNotes", NotesController.ListNotes);

router.post("/updateNotes", NotesController.UpdateNotes);

export default router;