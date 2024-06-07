import express from "express";
import { addToDo, deleteToDo, getToDo, updateToDo } from "../controllers/todoController.js";
import { auth } from "../middleware/auth.js";

export const todoRouter = express.Router();

// POST API to add TO DO:
todoRouter.post('/:userId', auth, addToDo)

// GET API to get TO DO:
todoRouter.get('/:userId', auth, getToDo)

// PUT API to update TO DO:
todoRouter.put('/:id', auth, updateToDo)

// delete API to delete To Do:
todoRouter.delete('/:id', auth, deleteToDo)