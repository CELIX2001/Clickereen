const express = require('express');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Mock livestreams storage
const livestreams = new Map();

// Initialize with mock livestreams
const initializeLivestreams = () => {
  const mockLivestreams = [
    {
      _id: 'stream_1',
      title: 'Live Coding Session - Building Clickereen',
      description: 'Join me as I build new features for Clickereen live!',
      streamer: {
        _id: 'user_1',
        username: 'demo_user',
        displayName: 'Demo User',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        verified: true
      },
      status: 'live',
      viewers: 156,
      thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop',
      streamUrl: 'rtmp://example.com/live/stream1',
      createdAt: new Date().toISOString(),
      startedAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
      endedAt: null
    },
    {
      _id: 'stream_2',
      title: 'Photography Tips & Tricks',
      description: 'Learn professional photography techniques',
      streamer: {
        _id: 'user_2',
        username: 'sarah_creative',
        displayName: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        verified: true
      },
      status: 'scheduled',
      viewers: 0,
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=450&fit=crop',
      streamUrl: null,
      createdAt: new Date().toISOString(),
      startedAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      endedAt: null
    }
  ];

  mockLivestreams.forEach(stream => {
    livestreams.set(stream._id, stream);
  });
};

// Initialize livestreams
initializeLivestreams();

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

// Get all livestreams
router.get('/', (req, res) => {
  try {
    const { status = 'all', page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    let allStreams = Array.from(livestreams.values());
    
    // Filter by status
    if (status !== 'all') {
      allStreams = allStreams.filter(stream => stream.status === status);
    }
    
    // Sort by viewers (live streams first, then by viewers)
    allStreams.sort((a, b) => {
      if (a.status === 'live' && b.status !== 'live') return -1;
      if (a.status !== 'live' && b.status === 'live') return 1;
      return b.viewers - a.viewers;
    });
    
    // Pagination
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedStreams = allStreams.slice(startIndex, endIndex);
    
    res.json({
      livestreams: paginatedStreams,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(allStreams.length / limitNum),
        totalStreams: allStreams.length,
        hasNext: endIndex < allStreams.length,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Get livestreams error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while fetching livestreams' 
    });
  }
});

// Get live streams
router.get('/live', (req, res) => {
  try {
    const liveStreams = Array.from(livestreams.values())
      .filter(stream => stream.status === 'live')
      .sort((a, b) => b.viewers - a.viewers);
    
    res.json({
      livestreams: liveStreams,
      count: liveStreams.length
    });
  } catch (error) {
    console.error('Get live streams error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while fetching live streams' 
    });
  }
});

// Get livestream by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stream = livestreams.get(id);
    
    if (!stream) {
      return res.status(404).json({
        error: 'Livestream not found',
        message: 'Livestream with this ID does not exist'
      });
    }
    
    res.json(stream);
  } catch (error) {
    console.error('Get livestream error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while fetching livestream' 
    });
  }
});

// Create livestream
router.post('/', (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    const { title, description, scheduledAt } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Title and description are required'
      });
    }

    const newStream = {
      _id: uuidv4(),
      title,
      description,
      streamer: {
        _id: userId,
        username: 'demo_user',
        displayName: 'Demo User',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        verified: true
      },
      status: scheduledAt ? 'scheduled' : 'live',
      viewers: 0,
      thumbnail: `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=10b981&color=fff&size=800x450`,
      streamUrl: scheduledAt ? null : `rtmp://example.com/live/${uuidv4()}`,
      createdAt: new Date().toISOString(),
      startedAt: scheduledAt || new Date().toISOString(),
      endedAt: null
    };

    livestreams.set(newStream._id, newStream);

    res.status(201).json({
      message: 'Livestream created successfully',
      livestream: newStream
    });
  } catch (error) {
    console.error('Create livestream error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while creating livestream' 
    });
  }
});

// Start livestream
router.post('/:id/start', (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    const { id } = req.params;
    const stream = livestreams.get(id);
    
    if (!stream) {
      return res.status(404).json({
        error: 'Livestream not found',
        message: 'Livestream with this ID does not exist'
      });
    }

    if (stream.streamer._id !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only start your own livestreams'
      });
    }

    stream.status = 'live';
    stream.startedAt = new Date().toISOString();
    stream.streamUrl = `rtmp://example.com/live/${id}`;
    livestreams.set(id, stream);

    res.json({
      message: 'Livestream started successfully',
      livestream: stream
    });
  } catch (error) {
    console.error('Start livestream error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while starting livestream' 
    });
  }
});

// End livestream
router.post('/:id/end', (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    const { id } = req.params;
    const stream = livestreams.get(id);
    
    if (!stream) {
      return res.status(404).json({
        error: 'Livestream not found',
        message: 'Livestream with this ID does not exist'
      });
    }

    if (stream.streamer._id !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only end your own livestreams'
      });
    }

    stream.status = 'ended';
    stream.endedAt = new Date().toISOString();
    livestreams.set(id, stream);

    res.json({
      message: 'Livestream ended successfully',
      livestream: stream
    });
  } catch (error) {
    console.error('End livestream error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while ending livestream' 
    });
  }
});

// Join livestream (increment viewer count)
router.post('/:id/join', (req, res) => {
  try {
    const { id } = req.params;
    const stream = livestreams.get(id);
    
    if (!stream) {
      return res.status(404).json({
        error: 'Livestream not found',
        message: 'Livestream with this ID does not exist'
      });
    }

    if (stream.status !== 'live') {
      return res.status(400).json({
        error: 'Livestream not live',
        message: 'This livestream is not currently live'
      });
    }

    stream.viewers += 1;
    livestreams.set(id, stream);

    res.json({
      message: 'Joined livestream successfully',
      viewers: stream.viewers
    });
  } catch (error) {
    console.error('Join livestream error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while joining livestream' 
    });
  }
});

// Leave livestream (decrement viewer count)
router.post('/:id/leave', (req, res) => {
  try {
    const { id } = req.params;
    const stream = livestreams.get(id);
    
    if (!stream) {
      return res.status(404).json({
        error: 'Livestream not found',
        message: 'Livestream with this ID does not exist'
      });
    }

    stream.viewers = Math.max(0, stream.viewers - 1);
    livestreams.set(id, stream);

    res.json({
      message: 'Left livestream successfully',
      viewers: stream.viewers
    });
  } catch (error) {
    console.error('Leave livestream error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while leaving livestream' 
    });
  }
});

module.exports = router;