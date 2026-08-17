const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Enable CORS for frontend connection (works locally & in production)
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(express.json());

// Initialize Socket.IO with CORS enabled
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Store active connected users mapped by socket.id
// Example format: { socketId: { userName: "John", domain: "healthcare" } }
const activeConnectedUsers = new Map();

// Helper to count active users across each domain dynamically
const calculateDomainCounts = () => {
  const counts = {
    total: activeConnectedUsers.size,
    healthcare: 0,
    agri: 0,
    location: 0,
    service: 0,
    analytics: 0,
    dashboard: 0
  };

  activeConnectedUsers.forEach((userInfo) => {
    const domain = userInfo.domain;
    if (counts.hasOwnProperty(domain)) {
      counts[domain] += 1;
    }
  });

  return counts;
};

// Real-Time Socket Event Handling
io.on('connection', (socket) => {
  console.log(`⚡ New user connected: Socket ID ${socket.id}`);

  // Handle domain switching event from frontend
  socket.on('switch_domain', ({ userName, domain }) => {
    const userDisplayName = userName || 'Anonymous User';
    
    // Register or update current socket's user and active domain
    activeConnectedUsers.set(socket.id, {
      userName: userDisplayName,
      domain: domain || 'dashboard',
      joinedAt: new Date()
    });

    console.log(`👤 User "${userDisplayName}" switched to domain: ${domain}`);

    // Broadcast updated live counts to ALL connected clients
    const updatedCounts = calculateDomainCounts();
    io.emit('realtime_domain_counts', updatedCounts);
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    const disconnectedUser = activeConnectedUsers.get(socket.id);
    if (disconnectedUser) {
      console.log(`❌ User "${disconnectedUser.userName}" disconnected`);
      activeConnectedUsers.delete(socket.id);
    }

    // Broadcast updated live counts after disconnect
    const updatedCounts = calculateDomainCounts();
    io.emit('realtime_domain_counts', updatedCounts);
  });
});

// Basic Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    activeUsers: activeConnectedUsers.size,
    timestamp: new Date()
  });
});

// Start Express Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 ConnectX 2.0 Backend & Socket Server running on port ${PORT}`);
});