const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // or 'jsonwebtoken'

// In-Memory User Database (Replace with MongoDB/PostgreSQL model in production)
const users = [];

const JWT_SECRET = process.env.JWT_SECRET || 'connectx_super_secret_jwt_key_2026';

// ------------------------------------------------------------------
// 1. POST /api/auth/register - Register a Real New User
// ------------------------------------------------------------------
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password.' });
    }

    // Check if user already exists
    const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    // Hash the password securely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create real user object
    const newUser = {
      id: Date.now().toString(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      createdAt: new Date()
    };

    users.push(newUser);

    // Generate JWT Auth Token
    const payload = { id: newUser.id, email: newUser.email };
    const token = jwt.sign(payload, JWT_SECRET);

    // Return real user data (excluding password) and auth token
    return res.status(201).json({
      message: 'User registered successfully!',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ message: 'Internal Server Error during registration.' });
  }
});

// ------------------------------------------------------------------
// 2. POST /api/auth/login - Authenticate Real User
// ------------------------------------------------------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password.' });
    }

    // Find user in database
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Verify password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate JWT Auth Token
    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, JWT_SECRET);

    // Return user info and token
    return res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Internal Server Error during login.' });
  }
});

module.exports = router;