import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { userRouter } from "./routes/user.js";
import { todoRouter } from "./routes/todo.js";
// dotenv conf
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors())
app.use('/user', userRouter)
app.use('/todo', todoRouter)
const PORT = process.env.PORT || 5000;

const dbUser = process.env.MongoDB_USER;
const dbPass = process.env.MongoDB_PASS;

const dbUri = `mongodb+srv://${dbUser}:${dbPass}@cluster0.l6657mu.mongodb.net/todoapp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(dbUri)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Connection error', err);
  });
