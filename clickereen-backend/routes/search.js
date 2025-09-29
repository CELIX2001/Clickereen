const express = require('express');

const router = express.Router();

// Global search endpoint
router.get('/', (req, res) => {
  try {
    const { q, type = 'all', page = 1, limit = 20 } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid query',
        message: 'Search query is required'
      });
    }

    const searchTerm = q.toLowerCase();
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Mock search results
    const mockResults = {
      posts: [
        {
          _id: 'post_1',
          content: `Found post about ${searchTerm}`,
          author: {
            _id: 'user_1',
            username: 'demo_user',
            displayName: 'Demo User',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
          },
          createdAt: new Date().toISOString(),
          likes: 42,
          comments: 8
        }
      ],
      users: [
        {
          _id: 'user_1',
          username: 'demo_user',
          displayName: 'Demo User',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          verified: true,
          followersCount: 1250
        }
      ],
      hashtags: [
        {
          name: searchTerm,
          posts: 156,
          trending: true
        }
      ]
    };

    let results = {};
    
    if (type === 'all' || type === 'posts') {
      results.posts = mockResults.posts;
    }
    if (type === 'all' || type === 'users') {
      results.users = mockResults.users;
    }
    if (type === 'all' || type === 'hashtags') {
      results.hashtags = mockResults.hashtags;
    }

    res.json({
      query: searchTerm,
      type,
      results,
      pagination: {
        currentPage: pageNum,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while searching' 
    });
  }
});

// Search posts
router.get('/posts', (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid query',
        message: 'Search query is required'
      });
    }

    res.json({
      query: q,
      posts: [],
      pagination: {
        currentPage: parseInt(page),
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      }
    });
  } catch (error) {
    console.error('Search posts error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while searching posts' 
    });
  }
});

// Search users
router.get('/users', (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid query',
        message: 'Search query is required'
      });
    }

    res.json({
      query: q,
      users: [],
      pagination: {
        currentPage: parseInt(page),
        totalPages: 0,
        hasNext: false,
        hasPrev: false
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

// Search hashtags
router.get('/hashtags', (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid query',
        message: 'Search query is required'
      });
    }

    res.json({
      query: q,
      hashtags: [],
      pagination: {
        currentPage: parseInt(page),
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      }
    });
  } catch (error) {
    console.error('Search hashtags error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while searching hashtags' 
    });
  }
});

// Get trending topics
router.get('/trending', (req, res) => {
  try {
    const trending = [
      { topic: 'AI Innovations', posts: '120K posts' },
      { topic: 'WebDev Trends', posts: '98K posts' },
      { topic: 'GreenTech', posts: '75K posts' },
      { topic: 'FutureOfWork', posts: '62K posts' },
      { topic: 'Art', posts: '45K posts' },
      { topic: 'Sports', posts: '78K posts' }
    ];

    res.json({
      trending,
      count: trending.length
    });
  } catch (error) {
    console.error('Get trending topics error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while fetching trending topics' 
    });
  }
});

module.exports = router;