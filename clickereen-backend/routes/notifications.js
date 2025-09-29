const express = require('express');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Mock notifications storage
const notifications = new Map();

// Initialize with mock notifications
const initializeNotifications = () => {
  const mockNotifications = [
    {
      _id: 'notif_1',
      userId: 'user_1',
      type: 'like',
      fromUser: {
        _id: 'user_2',
        username: 'sarah_creative',
        displayName: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        verified: true
      },
      content: 'liked your post about "Amazing sunset at the beach"',
      postId: 'post_1',
      read: false,
      createdAt: new Date(Date.now() - 120000).toISOString() // 2 minutes ago
    },
    {
      _id: 'notif_2',
      userId: 'user_1',
      type: 'comment',
      fromUser: {
        _id: 'user_2',
        username: 'sarah_creative',
        displayName: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        verified: true
      },
      content: 'commented: "This is incredible! Where was this taken?"',
      postId: 'post_1',
      read: false,
      createdAt: new Date(Date.now() - 300000).toISOString() // 5 minutes ago
    },
    {
      _id: 'notif_3',
      userId: 'user_1',
      type: 'retweet',
      fromUser: {
        _id: 'user_2',
        username: 'sarah_creative',
        displayName: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        verified: true
      },
      content: 'retweeted your post',
      postId: 'post_2',
      read: true,
      createdAt: new Date(Date.now() - 600000).toISOString() // 10 minutes ago
    },
    {
      _id: 'notif_4',
      userId: 'user_1',
      type: 'follow',
      fromUser: {
        _id: 'user_2',
        username: 'sarah_creative',
        displayName: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        verified: true
      },
      content: 'started following you',
      postId: null,
      read: true,
      createdAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
    },
    {
      _id: 'notif_5',
      userId: 'user_1',
      type: 'mention',
      fromUser: {
        _id: 'user_2',
        username: 'sarah_creative',
        displayName: 'Sarah Chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        verified: true
      },
      content: 'mentioned you in a post',
      postId: 'post_3',
      read: false,
      createdAt: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
    }
  ];

  mockNotifications.forEach(notification => {
    notifications.set(notification._id, notification);
  });
};

// Initialize notifications
initializeNotifications();

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

// Get all notifications for user
router.get('/', (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    
    let userNotifications = Array.from(notifications.values())
      .filter(notif => notif.userId === userId);
    
    if (unreadOnly === 'true') {
      userNotifications = userNotifications.filter(notif => !notif.read);
    }
    
    // Sort by creation date (newest first)
    userNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Pagination
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedNotifications = userNotifications.slice(startIndex, endIndex);
    
    const unreadCount = userNotifications.filter(notif => !notif.read).length;
    
    res.json({
      notifications: paginatedNotifications,
      unreadCount,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(userNotifications.length / limitNum),
        totalNotifications: userNotifications.length,
        hasNext: endIndex < userNotifications.length,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while fetching notifications' 
    });
  }
});

// Get unread notifications count
router.get('/unread-count', (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    const userNotifications = Array.from(notifications.values())
      .filter(notif => notif.userId === userId && !notif.read);
    
    res.json({
      unreadCount: userNotifications.length
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while fetching unread count' 
    });
  }
});

// Mark notification as read
router.put('/:id/read', (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    const { id } = req.params;
    const notification = notifications.get(id);
    
    if (!notification) {
      return res.status(404).json({
        error: 'Notification not found',
        message: 'Notification with this ID does not exist'
      });
    }

    if (notification.userId !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only modify your own notifications'
      });
    }

    notification.read = true;
    notifications.set(id, notification);

    res.json({
      message: 'Notification marked as read',
      notification
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while marking notification as read' 
    });
  }
});

// Mark all notifications as read
router.put('/mark-all-read', (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    const userNotifications = Array.from(notifications.values())
      .filter(notif => notif.userId === userId && !notif.read);
    
    let updatedCount = 0;
    userNotifications.forEach(notification => {
      notification.read = true;
      notifications.set(notification._id, notification);
      updatedCount++;
    });

    res.json({
      message: 'All notifications marked as read',
      updatedCount
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while marking all notifications as read' 
    });
  }
});

// Delete notification
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
    const notification = notifications.get(id);
    
    if (!notification) {
      return res.status(404).json({
        error: 'Notification not found',
        message: 'Notification with this ID does not exist'
      });
    }

    if (notification.userId !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only delete your own notifications'
      });
    }

    notifications.delete(id);

    res.json({
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while deleting notification' 
    });
  }
});

// Create notification
router.post('/', (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    const { type, fromUserId, content, postId } = req.body;
    
    if (!type || !fromUserId || !content) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Type, fromUserId, and content are required'
      });
    }

    // Mock fromUser data (in real app, get from user service)
    const fromUser = {
      _id: fromUserId,
      username: 'sarah_creative',
      displayName: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      verified: true
    };

    const newNotification = {
      _id: uuidv4(),
      userId,
      type,
      fromUser,
      content,
      postId: postId || null,
      read: false,
      createdAt: new Date().toISOString()
    };

    notifications.set(newNotification._id, newNotification);

    res.status(201).json({
      message: 'Notification created successfully',
      notification: newNotification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while creating notification' 
    });
  }
});

// Get notification by ID
router.get('/:id', (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    const { id } = req.params;
    const notification = notifications.get(id);
    
    if (!notification) {
      return res.status(404).json({
        error: 'Notification not found',
        message: 'Notification with this ID does not exist'
      });
    }

    if (notification.userId !== userId) {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You can only view your own notifications'
      });
    }

    res.json(notification);
  } catch (error) {
    console.error('Get notification error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while fetching notification' 
    });
  }
});

module.exports = router;