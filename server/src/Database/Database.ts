import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const Database = exports.connect = () => {
  // Connecting to the database
  mongoose
    .connect(process.env.MONGODB_URI as string)
    .then(() => {
        console.log("Successfully connected to database");
    })
    .catch((error) => {
        console.log("Failed connection to database ", error);
        process.exit(1);
    });
};

export default Database;