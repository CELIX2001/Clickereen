const express = require('express');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Mock posts storage (in production, this would be a database)
const posts = new Map();

// Initialize with some mock posts
const initializePosts = () => {
  const mockPosts = [
    {
      _id: 'post_1',
      author: {
        _id: 'user_1',
        username: 'demo_user',
        displayName: 'Demo User',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        verified: true
      },
      content: 'Welcome to Clickereen! This is an amazing social media platform built with modern technologies. 🚀 #welcome #clickereen #socialmedia',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 42,
      comments: 8,
      retweets: 12,
      shares: 5,
      views: 156,
      hashtags: ['welcome', 'clickereen', 'socialmedia'],
      mentions: [],
      media: [],
      isLiked: false,
      isRetweeted: false,
      isBookmarked: false,
      engagement: {
        totalLikes: 42,
        totalComments: 8,
        totalRetweets: 12,
        totalShares: 5,
        totalViews: 156
      }
    },
    {
      _id: 'post_2',
      author: {
        _id: 'user_2',
        username: 'sarah_creative',
        displayName: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        verified: true
      },
      content: 'Just finished an amazing photoshoot! The lighting was perfect today. 📸✨ #photography #art #creative',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
      likes: 156,
      comments: 23,
      retweets: 34,
      shares: 12,
      views: 892,
      hashtags: ['photography', 'art', 'creative'],
      mentions: [],
      media: [{
        type: 'image',
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
      }],
      isLiked: false,
      isRetweeted: false,
      isBookmarked: false,
      engagement: {
        totalLikes: 156,
        totalComments: 23,
        totalRetweets: 34,
        totalShares: 12,
        totalViews: 892
      }
    },
    {
      _id: 'post_3',
      author: {
        _id: 'user_1',
        username: 'demo_user',
        displayName: 'Demo User',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        verified: true
      },
      content: 'Building something amazing with @sarah_creative! The future of social media is here. 🚀 #collaboration #innovation #tech',
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      updatedAt: new Date(Date.now() - 7200000).toISOString(),
      likes: 89,
      comments: 15,
      retweets: 28,
      shares: 7,
      views: 445,
      hashtags: ['collaboration', 'innovation', 'tech'],
      mentions: ['sarah_creative'],
      media: [],
      isLiked: false,
      isRetweeted: false,
      isBookmarked: false,
      engagement: {
        totalLikes: 89,
        totalComments: 15,
        totalRetweets: 28,
        totalShares: 7,
        totalViews: 445
      }
    }
  ];

  mockPosts.forEach(post => {
    posts.set(post._id, post);
  });
};

// Initialize posts
initializePosts();

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

// Get all posts (with pagination)
router.get('/', (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'newest' } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    let allPosts = Array.from(posts.values());
    
    // Sort posts
    switch (sort) {
      case 'newest':
        allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        allPosts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'popular':
        allPosts.sort((a, b) => (b.likes + b.comments + b.retweets) - (a.likes + a.comments + a.retweets));
        break;
      default:
        allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    // Pagination
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedPosts = allPosts.slice(startIndex, endIndex);
    
    res.json({
      posts: paginatedPosts,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(allPosts.length / limitNum),
        totalPosts: allPosts.length,
        hasNext: endIndex < allPosts.length,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while fetching posts' 
    });
  }
});

// Get single post
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const post = posts.get(id);
    
    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
        message: 'Post with this ID does not exist'
      });
    }
    
    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while fetching post' 
    });
  }
});

// Create new post
router.post('/', (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    const { content, media = [], hashtags = [], mentions = [] } = req.body;
    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid content',
        message: 'Post content is required'
      });
    }

    // Extract hashtags and mentions from content
    const extractedHashtags = content.match(/#\w+/g)?.map(tag => tag.slice(1)) || [];
    const extractedMentions = content.match(/@\w+/g)?.map(mention => mention.slice(1)) || [];
    
    const allHashtags = [...new Set([...hashtags, ...extractedHashtags])];
    const allMentions = [...new Set([...mentions, ...extractedMentions])];

    const newPost = {
      _id: uuidv4(),
      author: {
        _id: userId,
        username: 'demo_user', // In real app, get from user data
        displayName: 'Demo User',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        verified: true
      },
      content: content.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      retweets: 0,
      shares: 0,
      views: 0,
      hashtags: allHashtags,
      mentions: allMentions,
      media: media,
      isLiked: false,
      isRetweeted: false,
      isBookmarked: false,
      engagement: {
        totalLikes: 0,
        totalComments: 0,
        totalRetweets: 0,
        totalShares: 0,
        totalViews: 0
      }
    };

    posts.set(newPost._id, newPost);

    res.status(201).json({
      message: 'Post created successfully',
      post: newPost
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while creating post' 
    });
  }
});

// Like/Unlike post
router.post('/:id/like', (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    const { id } = req.params;
    const post = posts.get(id);
    
    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
        message: 'Post with this ID does not exist'
      });
    }

    // Toggle like
    if (post.isLiked) {
      post.likes = Math.max(0, post.likes - 1);
      post.isLiked = false;
    } else {
      post.likes += 1;
      post.isLiked = true;
    }
    
    post.engagement.totalLikes = post.likes;
    post.updatedAt = new Date().toISOString();
    posts.set(id, post);

    res.json({
      message: post.isLiked ? 'Post liked' : 'Post unliked',
      isLiked: post.isLiked,
      totalLikes: post.likes
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while liking post' 
    });
  }
});

// Retweet post
router.post('/:id/retweet', (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    const { id } = req.params;
    const post = posts.get(id);
    
    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
        message: 'Post with this ID does not exist'
      });
    }

    // Toggle retweet
    if (post.isRetweeted) {
      post.retweets = Math.max(0, post.retweets - 1);
      post.isRetweeted = false;
    } else {
      post.retweets += 1;
      post.isRetweeted = true;
    }
    
    post.engagement.totalRetweets = post.retweets;
    post.updatedAt = new Date().toISOString();
    posts.set(id, post);

    res.json({
      message: post.isRetweeted ? 'Post retweeted' : 'Post unretweeted',
      isRetweeted: post.isRetweeted,
      totalRetweets: post.retweets
    });
  } catch (error) {
    console.error('Retweet post error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while retweeting post' 
    });
  }
});

// Bookmark post
router.post('/:id/bookmark', (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    const { id } = req.params;
    const post = posts.get(id);
    
    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
        message: 'Post with this ID does not exist'
      });
    }

    // Toggle bookmark
    post.isBookmarked = !post.isBookmarked;
    post.updatedAt = new Date().toISOString();
    posts.set(id, post);

    res.json({
      message: post.isBookmarked ? 'Post bookmarked' : 'Post unbookmarked',
      isBookmarked: post.isBookmarked
    });
  } catch (error) {
    console.error('Bookmark post error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while bookmarking post' 
    });
  }
});

// Delete post
router.delete('/:id', (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    const { id } = req.params;
    const post = posts.get(id);
    
    if (!post) {
      return res.status(404).json({
        error: 'Post not found',
        message: 'Post with this ID does not exist'
      });
    }

    // Check if user owns the post
    if (post.author._id !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only delete your own posts'
      });
    }

    posts.delete(id);

    res.json({
      message: 'Post deleted successfully'
    });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while deleting post' 
    });
  }
});

// Search posts
router.get('/search/:query', (req, res) => {
  try {
    const { query } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid query',
        message: 'Search query is required'
      });
    }

    const searchTerm = query.toLowerCase();
    const allPosts = Array.from(posts.values());
    
    const filteredPosts = allPosts.filter(post => 
      post.content.toLowerCase().includes(searchTerm) ||
      post.hashtags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      post.mentions.some(mention => mention.toLowerCase().includes(searchTerm))
    );
    
    // Sort by relevance (most recent first)
    filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Pagination
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    
    res.json({
      posts: paginatedPosts,
      query: searchTerm,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(filteredPosts.length / limitNum),
        totalPosts: filteredPosts.length,
        hasNext: endIndex < filteredPosts.length,
        hasPrev: pageNum > 1
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

module.exports = router;