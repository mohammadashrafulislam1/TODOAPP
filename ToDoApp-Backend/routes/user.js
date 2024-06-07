import express from "express";
import { auth } from "../middleware/auth.js";
import { getCurrentUser, googleLogin, logIn, logout, requestPasswordReset, resetPassword, signUp, updateUser } from "../controllers/userController.js";

export const userRouter = express.Router()

// ----- user signUp routes: ------
// POST API
userRouter.post('/signup', signUp)

// ----- user login routes: ------
// POST API
userRouter.post('/login', logIn)

// user Logout routes:
userRouter.post('/logout', logout)

// google Login Router:
userRouter.post('/google', googleLogin)

// Get current user route (protected)
userRouter.get('/me', auth, getCurrentUser);

// Update user route
userRouter.put('/update/:id', auth, updateUser);

// reset password request
userRouter.post('/request-password-reset', requestPasswordReset);

// Reset password route
userRouter.post('/reset-password', resetPassword);