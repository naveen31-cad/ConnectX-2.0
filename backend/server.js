const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// User Schema / Model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  domain: String,
  selectedDomain: String
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

// ==========================================
// API ROUTES
// ==========================================

// Login Route
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.password && user.password !== password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    
    // Broadcast login notification via Socket.io
    io.emit('live-notification', { message: `User ${user.name} logged in!`, type: 'login' });

    res.json({ message: "Login successful", success: true, user });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login" });
  }
});

// Register Route
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, domain, selectedDomain } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });
    
    const assignedDomain = domain || selectedDomain || 'Other';
    const newUser = new User({
      name,
      email,
      password,
      domain: assignedDomain,
      selectedDomain: assignedDomain
    });
    await newUser.save();

    // Broadcast registration notification to all connected clients via Socket.io
    io.emit('live-notification', { 
      message: `New user registered: ${name} (${assignedDomain})`, 
      type: 'register' 
    });

    res.status(201).json({ message: "User registered successfully", success: true, user: newUser });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error during registration" });
  }
});

// Agriculture Users Route
app.get('/api/agri/users', async (req, res) => {
  try {
    const users = await User.find({ 
      $or: [{ domain: /agri/i }, { selectedDomain: /agri/i }] 
    }).select('name email createdAt');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch agri users" });
  }
});

// Healthcare Users Route
app.get('/api/healthcare/users', async (req, res) => {
  try {
    const users = await User.find({ 
      $or: [{ domain: /health/i }, { selectedDomain: /health/i }] 
    }).select('name email createdAt');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch healthcare users" });
  }
});

// Home Services Users Route
app.get('/api/homeservices/users', async (req, res) => {
  try {
    const users = await User.find({ 
      $or: [{ domain: /home/i }, { selectedDomain: /home/i }] 
    }).select('name email createdAt');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch home service users" });
  }
});

// Other Users Route
app.get('/api/other/users', async (req, res) => {
  try {
    const users = await User.find({ 
      $or: [
        { domain: /other/i }, 
        { selectedDomain: /other/i },
        { domain: { $exists: false } },
        { domain: null },
        { domain: "" }
      ] 
    }).select('name email createdAt');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch other domain users" });
  }
});

app.get('/', (req, res) => {
  res.send('ConnectX 2.0 Backend Server is running.');
});

// Socket.io Connection Handler
io.on('connection', (socket) => {
  console.log(`⚡ New client connected: ${socket.id}`);

  socket.on('switch-domain', (data) => {
    const username = data?.username || "A user";
    const domain = data?.domain || "unknown";
    console.log(`👤 User "${username}" switched domain to: ${domain}`);
    
    // Broadcast domain switch event
    io.emit('live-notification', { 
      message: `${username} switched to ${domain} domain`, 
      type: 'domain-switch' 
    });
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/connectx';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('📦 Connected to MongoDB database successfully');
    // Updated to '0.0.0.0' to accept external requests from mobile devices on the same network
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.error('❌ Database error:', err));