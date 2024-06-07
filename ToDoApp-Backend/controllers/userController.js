import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { userModel } from "../models/User.js";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

export const signUp = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ msg: "Required fields are missing." });
    }
    try {
      //  Check if a user with the same email already exists
      const existingUserWithEmail = await userModel.findOne({
        email: req.body.email,
      });
      if (existingUserWithEmail) {
        return res
          .status(400)
          .json({ error: "User with the same email already exists." });
      }

        const hashedPassword = await bcrypt.hash(password, 10);

        const saveUser = new userModel({ 
          firstName, 
          lastName, 
          email, 
          password: hashedPassword });

        const newUser = await saveUser.save();

        // Generate JWT
        const token = jwt.sign(
            { email: newUser.email, id: newUser._id },
            process.env.ACCESS_TOKEN,
            { expiresIn: "4d" }
        );
        // Send both newUser and token in the response
        console.log(newUser, token);
        return res.status(200).json({ newUser, token });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message });
    }
};

// login controller:
export const logIn = async(req, res)=>{
  try {
    const { email, password } = req.body;
    //  Find user using email
    const user = await userModel.findOne({ email });

    // Check if the user exist with condition
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare Secured (hashed) Password with provided password
    const passwordMatch = await bcrypt.compare(password, user.password);

    // check is the provided password match with user password
    if (!passwordMatch) {
      return res.status(404).json({ error: "Invalid password" });
    }
    //  JWT
    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.ACCESS_TOKEN,
      { expiresIn: "4d" }
    );

    // Send token in the response
    return res.status(200).json({ token, message: "Login Successful" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
}
  }

// logout controller:
export const logout = (req, res) => {
    try {
      // after log out successfully
      return res.status(200).json({ message: "Logout Successfully" });
    } catch (error) {
      console.error;
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };

// google controller:
 console.log("Google", process.env.GoogleID)
const client = new OAuth2Client(process.env.GoogleID);

export const googleLogin = async (req, res) => {
  const { tokenId } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GoogleID,
    });
    const { email_verified, name, email } = ticket.getPayload();
    if (email_verified) {
      let user = await userModel.findOne({ email });
      if (!user) {
        user = new userModel({
          firstName: name.split(' ')[0],
          lastName: name.split(' ')[1],
          email,
          password: 'N/A', // You can set a default password or handle it differently
        });
        await user.save();
      }
      const payload = { userId: user._id };
      const token = jwt.sign(payload, process.env.ACCESS_TOKEN, { expiresIn: '4h' });
      console.log(token, user)
      res.status(201).json({ token, user });
    } else {
      res.status(400).json({ message: 'Google login failed. Try again.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user:
export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.decoded.id || req.decoded.userId);
    console.log("user", req.decoded)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update user details controller
export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, email, oldPassword, newPassword } = req.body;

  try {
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate old password
    if (oldPassword) {
      const passwordMatch = await bcrypt.compare(oldPassword, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ message: "Old password is incorrect." });
      }
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



dotenv.config();

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    console.log('Email Address:', process.env.EMAIL_ADDRESS);
    console.log('App Password:', process.env.EMAIL_PASSWORD);
    console.log(req.headers.host,token);

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD, // Ensure this is the app-specific password
      },
    });
    const baseUrl = process.env.NODE_ENV === 'production' ? process.env.PROD_URL : process.env.DEV_URL;
    const resetUrl = `${baseUrl}/reset-password/${token}`;
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_ADDRESS,
      subject: 'Password Reset -To-Do APP.',
      html: `
        <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click on the following button, or paste this into your browser to complete the process within one hour of receiving it:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-align: center; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      `,
    };

    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        console.error('There was an error: ', err);
        return res.status(500).json({ message: 'Error sending email' });
      }
      res.status(200).json({ message: 'Password reset email sent successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



// Reset password controller
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const user = await userModel.findOne({ 
      resetPasswordToken: token, 
      resetPasswordExpires: { $gt: Date.now() } 
    });

    if (!user) {
      return res.status(400).json({ message: "Password reset token is invalid or has expired." });
    }

    // Compare new password with the existing hashed password
    const passwordMatch = await bcrypt.compare(newPassword, user.password);
    if (passwordMatch) {
      return res.status(400).json({ message: "New password cannot be the same as the old password." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

