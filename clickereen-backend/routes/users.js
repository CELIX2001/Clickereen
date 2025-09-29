const express = require('express');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Mock users storage
const users = new Map();

// Initialize with mock users
const initializeUsers = () => {
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
    },
    {
      _id: 'user_3',
      username: 'alex_tech',
      displayName: 'Alex Johnson',
      email: 'alex@clickereen.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      verified: true,
      followersCount: 2100,
      followingCount: 456,
      bio: 'Tech enthusiast and developer',
      location: 'New York, NY',
      website: 'https://alexjohnson.dev',
      isPrivate: false,
      createdAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    }
  ];

  mockUsers.forEach(user => {
    users.set(user._id, user);
  });
};

// Initialize users
initializeUsers();

// Helper function to get user from token
const getUserFromToken = (req) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return null;
    
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'clickereen-secret-key-2024');
    return decoded.userId;
  } catch (error) {
    return null;
  }
};

// Get all users
router.get('/', (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    let allUsers = Array.from(users.values());
    
    // Search filter
    if (search) {
      const searchTerm = search.toLowerCase();
      allUsers = allUsers.filter(user => 
        user.displayName.toLowerCase().includes(searchTerm) ||
        user.username.toLowerCase().includes(searchTerm) ||
        user.bio.toLowerCase().includes(searchTerm)
      );
    }
    
    // Sort by followers count (most popular first)
    allUsers.sort((a, b) => b.followersCount - a.followersCount);
    
    // Pagination
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedUsers = allUsers.slice(startIndex, endIndex);
    
    res.json({
      users: paginatedUsers,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(allUsers.length / limitNum),
        totalUsers: allUsers.length,
        hasNext: endIndex < allUsers.length,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while fetching users' 
    });
  }
});

// Get user by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const user = users.get(id);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User with this ID does not exist'
      });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while fetching user' 
    });
  }
});

// Get user profile
router.get('/:id/profile', (req, res) => {
  try {
    const { id } = req.params;
    const user = users.get(id);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User with this ID does not exist'
      });
    }
    
    // Return public profile
    const { email, ...publicProfile } = user;
    res.json(publicProfile);
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while fetching user profile' 
    });
  }
});

// Search users
router.get('/search/:query', (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid query',
        message: 'Search query is required'
      });
    }

    const searchTerm = query.toLowerCase();
    const allUsers = Array.from(users.values());
    
    const filteredUsers = allUsers.filter(user => 
      user.displayName.toLowerCase().includes(searchTerm) ||
      user.username.toLowerCase().includes(searchTerm) ||
      user.bio.toLowerCase().includes(searchTerm) ||
      user.location.toLowerCase().includes(searchTerm)
    );
    
    // Sort by relevance (exact matches first, then by followers)
    filteredUsers.sort((a, b) => {
      const aExact = a.username.toLowerCase() === searchTerm || a.displayName.toLowerCase() === searchTerm;
      const bExact = b.username.toLowerCase() === searchTerm || b.displayName.toLowerCase() === searchTerm;
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return b.followersCount - a.followersCount;
    });
    
    // Pagination
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
    
    res.json({
      users: paginatedUsers,
      query: searchTerm,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(filteredUsers.length / limitNum),
        totalUsers: filteredUsers.length,
        hasNext: endIndex < filteredUsers.length,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while searching users' 
    });
  }
});

// Get suggested users
router.get('/suggestions/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = users.get(userId);
    
    if (!currentUser) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User with this ID does not exist'
      });
    }

    // Get users that the current user is not following
    const allUsers = Array.from(users.values());
    const suggestedUsers = allUsers
      .filter(user => user._id !== userId)
      .sort((a, b) => b.followersCount - a.followersCount)
      .slice(0, 5); // Top 5 suggestions
    
    res.json({
      suggestions: suggestedUsers
    });
  } catch (error) {
    console.error('Get suggested users error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while fetching suggested users' 
    });
  }
});

// Get trending users
router.get('/trending', (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const limitNum = parseInt(limit);
    
    const allUsers = Array.from(users.values());
    
    // Sort by followers count and activity
    const trendingUsers = allUsers
      .sort((a, b) => {
        // Combine followers count and recent activity
        const aScore = a.followersCount + (a.lastActive ? new Date(a.lastActive).getTime() / 1000000 : 0);
        const bScore = b.followersCount + (b.lastActive ? new Date(b.lastActive).getTime() / 1000000 : 0);
        return bScore - aScore;
      })
      .slice(0, limitNum);
    
    res.json({
      trending: trendingUsers
    });
  } catch (error) {
    console.error('Get trending users error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while fetching trending users' 
    });
  }
});

module.exports = router;