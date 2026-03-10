const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_kitchen_key_123';

// --- REGISTER ---
router.post('/register', async (req, res) => {
  try {
    const { username, mobile, password } = req.body;

    // 1. Validate Input
    if (!username || !mobile || !password) {
      console.log("❌ Missing Fields in Backend");
      return res.status(400).json({ message: "All fields are required (username, mobile, password)" });
    }

    // 2. Check for Duplicate Mobile
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      console.log("❌ User already exists");
      return res.status(400).json({ message: "Mobile number already exists" });
    }

    // 3. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Save New User
    const newUser = new User({
      username,
      mobile,
      password: hashedPassword
    });

    await newUser.save();
    console.log("✅ User Registered:", username);
    
    res.status(201).json({ message: "Registration Successful! Please Login." });

  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ message: "Server Error: " + err.message });
  }
});

// --- LOGIN ---
router.post('/login', async (req, res) => {
  try {
    const { mobile, password } = req.body;

    // 1. Check User
    const user = await User.findOne({ mobile });
    if (!user) return res.status(400).json({ message: "User not found" });

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // 3. Generate Token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ 
      token, 
      user: { id: user._id, username: user.username, mobile: user.mobile } 
    });

  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;