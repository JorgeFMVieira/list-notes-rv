import express, { Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from "cors";
import router from './Routes/app';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI as string, {});

mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected');
});

app.get('', (req: Request, res: Response) => {
    res.send("Primeira pagina");
});

app.use(cors({credentials: true, origin: process.env.FRONTEND_URL}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', router);

app.listen(port, () => {
    console.log("Server good running");
});

export default app;