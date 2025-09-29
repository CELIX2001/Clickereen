const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3002",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for development
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Compression middleware
app.use(compression());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3002",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.status(200).json({
    message: 'Clickereen API is running!',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    features: [
      'Posts Management',
      'User Authentication',
      'Real-time Notifications',
      'Analytics Dashboard',
      'Live Streaming',
      'Search & Discovery',
      'Media Processing'
    ]
  });
});

// Mock data storage (in-memory for demo purposes)
const mockData = {
  users: new Map(),
  posts: new Map(),
  notifications: new Map(),
  analytics: new Map()
};

// Initialize with some mock data
const initializeMockData = () => {
  // Mock users
  const mockUsers = [
    {
      _id: 'user_1',
      username: 'demo_user',
      displayName: 'Demo User',
      email: 'demo@clickereen.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      verified: true,
      followersCount: 1250,
      followingCount: 340,
      bio: 'Welcome to Clickereen! This is a demo account.',
      createdAt: new Date().toISOString()
    },
    {
      _id: 'user_2',
      username: 'sarah_creative',
      displayName: 'Sarah Chen',
      email: 'sarah@clickereen.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      verified: true,
      followersCount: 890,
      followingCount: 234,
      bio: 'Creative designer and photographer',
      createdAt: new Date().toISOString()
    }
  ];

  mockUsers.forEach(user => {
    mockData.users.set(user._id, user);
  });

  // Mock posts
  const mockPosts = [
    {
      _id: 'post_1',
      author: mockUsers[0],
      content: 'Welcome to Clickereen! This is an amazing social media platform built with modern technologies. 🚀',
      createdAt: new Date().toISOString(),
      likes: 42,
      comments: 8,
      retweets: 12,
      shares: 5,
      hashtags: ['#welcome', '#clickereen', '#socialmedia'],
      media: []
    },
    {
      _id: 'post_2',
      author: mockUsers[1],
      content: 'Just finished an amazing photoshoot! The lighting was perfect today. 📸✨',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      likes: 156,
      comments: 23,
      retweets: 34,
      shares: 12,
      hashtags: ['#photography', '#art', '#creative'],
      media: [{
        type: 'image',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop'
      }]
    }
  ];

  mockPosts.forEach(post => {
    mockData.posts.set(post._id, post);
  });

  console.log('✅ Mock data initialized');
};

// Initialize mock data
initializeMockData();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/users', require('./routes/users'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/livestreams', require('./routes/livestreams'));
app.use('/api/search', require('./routes/search'));
app.use('/api/media', require('./routes/media'));

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`👤 User ${userId} joined their room`);
  });

  socket.on('like', (data) => {
    console.log('❤️ Post liked:', data);
    socket.broadcast.emit('postLiked', data);
  });

  socket.on('comment', (data) => {
    console.log('💬 Post commented:', data);
    socket.broadcast.emit('postCommented', data);
  });

  socket.on('follow', (data) => {
    console.log('👥 User followed:', data);
    socket.broadcast.emit('userFollowed', data);
  });

  socket.on('share', (data) => {
    console.log('📤 Post shared:', data);
    socket.broadcast.emit('postShared', data);
  });

  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The requested route ${req.originalUrl} does not exist`,
    timestamp: new Date().toISOString()
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    error: true,
    message,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Clickereen Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API status: http://localhost:${PORT}/api/status`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Export for testing
module.exports = { app, server, io, mockData };