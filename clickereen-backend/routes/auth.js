const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Mock user storage (in production, this would be a database)
const users = new Map();
const sessions = new Map();

// Initialize with demo users
const initializeUsers = () => {
  const demoUsers = [
    {
      _id: 'user_1',
      username: 'demo_user',
      displayName: 'Demo User',
      email: 'demo@clickereen.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      verified: true,
      followersCount: 1250,
      followingCount: 340,
      bio: 'Welcome to Clickereen! This is a demo account.',
      location: 'Worldwide',
      website: 'https://clickereen.com',
      isPrivate: false,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    },
    {
      _id: 'user_2',
      username: 'sarah_creative',
      displayName: 'Sarah Chen',
      email: 'sarah@clickereen.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      verified: true,
      followersCount: 890,
      followingCount: 234,
      bio: 'Creative designer and photographer',
      location: 'San Francisco, CA',
      website: 'https://sarahchen.design',
      isPrivate: false,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    }
  ];

  demoUsers.forEach(user => {
    users.set(user._id, user);
  });
};

// Initialize users
initializeUsers();

// Helper function to get user by email or username
const findUser = (identifier) => {
  for (const user of users.values()) {
    if (user.email === identifier || user.username === identifier) {
      return user;
    }
  }
  return null;
};

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'clickereen-secret-key-2024',
    { expiresIn: '7d' }
  );
};

// Helper function to get public user profile
const getPublicProfile = (user) => {
  const { password, ...publicProfile } = user;
  return publicProfile;
};

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, displayName } = req.body;

    // Validation
    if (!username || !email || !password || !displayName) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Username, email, password, and display name are required'
      });
    }

    // Check if user already exists
    const existingUser = findUser(email) || findUser(username);
    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        message: 'User with this email or username already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      _id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      displayName,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=10b981&color=fff`,
      verified: false,
      followersCount: 0,
      followingCount: 0,
      bio: '',
      location: '',
      website: '',
      isPrivate: false,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };

    users.set(newUser._id, newUser);

    // Generate JWT token
    const token = generateToken(newUser._id);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: getPublicProfile(newUser)
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error during registration' 
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = findUser(email);
    if (!user) {
      return res.status(400).json({ 
        error: 'Invalid credentials',
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ 
        error: 'Invalid credentials',
        message: 'Invalid email or password' 
      });
    }

    // Update last active
    user.lastActive = new Date().toISOString();
    users.set(user._id, user);

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: getPublicProfile(user)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error during login' 
    });
  }
});

// Quick access (no credentials required)
router.post('/quick-access', (req, res) => {
  try {
    const demoUser = users.get('user_1');
    if (!demoUser) {
      return res.status(500).json({
        error: 'Demo user not found',
        message: 'Demo user not available'
      });
    }

    // Generate JWT token
    const token = generateToken(demoUser._id);

    res.json({
      message: 'Quick access successful',
      token,
      user: getPublicProfile(demoUser)
    });
  } catch (error) {
    console.error('Quick access error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error during quick access' 
    });
  }
});

// Get current user
router.get('/me', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Access token is required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'clickereen-secret-key-2024');
    const user = users.get(decoded.userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found'
      });
    }

    res.json(getPublicProfile(user));
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ 
      error: 'Invalid token',
      message: 'Invalid or expired token' 
    });
  }
});

// Update profile
router.put('/profile', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Access token is required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'clickereen-secret-key-2024');
    const user = users.get(decoded.userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found'
      });
    }

    const { displayName, bio, location, website, isPrivate } = req.body;
    
    // Update fields
    if (displayName) user.displayName = displayName;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (website !== undefined) user.website = website;
    if (isPrivate !== undefined) user.isPrivate = isPrivate;

    users.set(user._id, user);

    res.json({
      message: 'Profile updated successfully',
      user: getPublicProfile(user)
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error during profile update' 
    });
  }
});

// Follow user
router.post('/follow/:userId', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Access token is required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'clickereen-secret-key-2024');
    const currentUser = users.get(decoded.userId);
    const { userId } = req.params;

    if (!currentUser) {
      return res.status(404).json({
        error: 'User not found',
        message: 'Current user not found'
      });
    }

    if (userId === currentUser._id) {
      return res.status(400).json({ 
        error: 'Invalid action',
        message: 'Cannot follow yourself' 
      });
    }

    const userToFollow = users.get(userId);
    if (!userToFollow) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'User to follow not found' 
      });
    }

    // Check if already following
    if (currentUser.following && currentUser.following.includes(userId)) {
      return res.status(400).json({ 
        error: 'Already following',
        message: 'Already following this user' 
      });
    }

    // Add to following/followers
    if (!currentUser.following) currentUser.following = [];
    if (!userToFollow.followers) userToFollow.followers = [];

    currentUser.following.push(userId);
    userToFollow.followers.push(currentUser._id);

    // Update counts
    currentUser.followingCount = currentUser.following.length;
    userToFollow.followersCount = userToFollow.followers.length;

    users.set(currentUser._id, currentUser);
    users.set(userToFollow._id, userToFollow);

    res.json({
      message: 'Successfully followed user',
      followingCount: currentUser.followingCount,
      followersCount: userToFollow.followersCount
    });
  } catch (error) {
    console.error('Follow error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error during follow action' 
    });
  }
});

// Unfollow user
router.post('/unfollow/:userId', (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Access token is required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'clickereen-secret-key-2024');
    const currentUser = users.get(decoded.userId);
    const { userId } = req.params;

    if (!currentUser) {
      return res.status(404).json({
        error: 'User not found',
        message: 'Current user not found'
      });
    }

    const userToUnfollow = users.get(userId);
    if (!userToUnfollow) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'User to unfollow not found' 
      });
    }

    // Remove from following/followers
    if (currentUser.following) {
      currentUser.following = currentUser.following.filter(id => id !== userId);
    }
    if (userToUnfollow.followers) {
      userToUnfollow.followers = userToUnfollow.followers.filter(id => id !== currentUser._id);
    }

    // Update counts
    currentUser.followingCount = currentUser.following ? currentUser.following.length : 0;
    userToUnfollow.followersCount = userToUnfollow.followers ? userToUnfollow.followers.length : 0;

    users.set(currentUser._id, currentUser);
    users.set(userToUnfollow._id, userToUnfollow);

    res.json({
      message: 'Successfully unfollowed user',
      followingCount: currentUser.followingCount,
      followersCount: userToUnfollow.followersCount
    });
  } catch (error) {
    console.error('Unfollow error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error during unfollow action' 
    });
  }
});

// Get all users (for demo purposes)
router.get('/users', (req, res) => {
  try {
    const allUsers = Array.from(users.values()).map(user => getPublicProfile(user));
    res.json({
      users: allUsers,
      count: allUsers.length
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while fetching users' 
    });
  }
});

module.exports = router;