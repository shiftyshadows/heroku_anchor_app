import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js"; // Adjust the path based on your project structure

const router = express.Router();

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

    // Check if the email is already registered
    const existingEmail = await User.findOne({
      email
    });
    if (existingEmail) {
      return res.status(400).json({
        message: "Email already registered."
      });
    }

    // Check if the username is already taken
    const existingUsername = await User.findOne({
      username
    });
    if (existingUsername) {
      return res.status(400).json({
        message: "Username already taken."
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check if this is the first user and make them admin
    const isFirstUser = (await User.countDocuments()) === 0;

    // Create the user
    const newUser = new User({
      email,
      password: hashedPassword,
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
export default router;