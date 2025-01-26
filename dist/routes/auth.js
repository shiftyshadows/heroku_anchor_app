import express from "express";
import argon2 from "argon2"; // Replacing bcryptjs with argon2
import User from "../models/User.js"; // Adjust the path based on your project structure
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;

// Signup route
router.post("/signup", async (req, res) => {
  const {
    email,
    password,
    username
  } = req.body;
  try {
    // Validate input
    if (!email || !password || !username) {
      return res.status(400).json({
        message: "All fields are required."
      });
    }

    // Check if the email already exists
    const existingUserByEmail = await User.findOne({
      email
    });
    if (existingUserByEmail) {
      return res.status(400).json({
        message: "Email already registered."
      });
    }

    // Check if the username already exists
    const existingUserByUsername = await User.findOne({
      username
    });
    if (existingUserByUsername) {
      return res.status(400).json({
        message: "Username already taken."
      });
    }

    // Create the user without manually hashing the password
    const isFirstUser = (await User.countDocuments()) === 0;
    const newUser = new User({
      email,
      password,
      // Don't hash the password here, as the pre-save hook will do it
      username,
      isAdmin: isFirstUser // Grant admin access to the first user
    });
    await newUser.save();

    // Send response
    res.status(201).json({
      message: "User registered successfully.",
      isAdmin: newUser.isAdmin
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error. Please try again later."
    });
  }
});

// POST: /api/auth/signin
router.post("/signin", async (req, res) => {
  const {
    email,
    password
  } = req.body;
  try {
    // Check if user exists
    const user = await User.findOne({
      email
    });
    if (!user) {
      console.log("User not found with email:", email);
      return res.status(400).json({
        message: "Invalid email or password."
      });
    }

    // Log the found user (to debug the issue)
    console.log("User found:", user);

    // Verify password using Argon2
    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password."
      });
    }

    // Generate token
    const token = jwt.sign({
      id: user._id,
      isAdmin: user.isAdmin
    }, SECRET_KEY, {
      expiresIn: "1h"
    });

    // Send token as a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" // Secure cookies in production
    });

    // Determine redirect URL based on role
    const redirectUrl = user.isAdmin ? "/admin-dashboard" : "/user-dashboard";

    // Respond with user role and redirect URL
    res.status(200).json({
      token,
      redirectUrl,
      message: "Login successful."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error. Please try again later."
    });
  }
});
export default router;