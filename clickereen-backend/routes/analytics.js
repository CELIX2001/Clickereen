const express = require('express');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Mock analytics storage
const analytics = new Map();

// Initialize with mock analytics data
const initializeAnalytics = () => {
  const mockAnalytics = {
    _id: 'analytics_1',
    userId: 'user_1',
    period: '30d',
    metrics: {
      totalPosts: 45,
      totalLikes: 1250,
      totalComments: 340,
      totalRetweets: 180,
      totalShares: 95,
      totalViews: 15600,
      followersGained: 120,
      followingGained: 45,
      engagementRate: 8.5,
      reach: 12500,
      impressions: 18900
    },
    dailyStats: [
      { date: '2024-01-01', posts: 2, likes: 45, comments: 12, retweets: 8, views: 520 },
      { date: '2024-01-02', posts: 1, likes: 38, comments: 9, retweets: 5, views: 480 },
      { date: '2024-01-03', posts: 3, likes: 67, comments: 18, retweets: 12, views: 720 },
      { date: '2024-01-04', posts: 1, likes: 42, comments: 11, retweets: 6, views: 580 },
      { date: '2024-01-05', posts: 2, likes: 55, comments: 15, retweets: 9, views: 650 },
      { date: '2024-01-06', posts: 1, likes: 33, comments: 8, retweets: 4, views: 420 },
      { date: '2024-01-07', posts: 2, likes: 48, comments: 13, retweets: 7, views: 560 }
    ],
    topPosts: [
      {
        postId: 'post_1',
        content: 'Welcome to Clickereen! This is an amazing social media platform...',
        likes: 42,
        comments: 8,
        retweets: 12,
        views: 156,
        engagementRate: 12.5
      },
      {
        postId: 'post_2',
        content: 'Just finished an amazing photoshoot! The lighting was perfect...',
        likes: 156,
        comments: 23,
        retweets: 34,
        views: 892,
        engagementRate: 15.8
      }
    ],
    audienceInsights: {
      ageGroups: [
        { range: '18-24', percentage: 35 },
        { range: '25-34', percentage: 40 },
        { range: '35-44', percentage: 20 },
        { range: '45+', percentage: 5 }
      ],
      genderDistribution: [
        { gender: 'Male', percentage: 45 },
        { gender: 'Female', percentage: 50 },
        { gender: 'Other', percentage: 5 }
      ],
      topLocations: [
        { location: 'United States', percentage: 35 },
        { location: 'United Kingdom', percentage: 15 },
        { location: 'Canada', percentage: 12 },
        { location: 'Australia', percentage: 10 },
        { location: 'Germany', percentage: 8 }
      ],
      interests: [
        { interest: 'Technology', percentage: 45 },
        { interest: 'Photography', percentage: 30 },
        { interest: 'Design', percentage: 25 },
        { interest: 'Travel', percentage: 20 },
        { interest: 'Food', percentage: 15 }
      ]
    },
    hashtagPerformance: [
      { hashtag: '#clickereen', posts: 12, reach: 2500, engagement: 180 },
      { hashtag: '#photography', posts: 8, reach: 1800, engagement: 150 },
      { hashtag: '#tech', posts: 6, reach: 1200, engagement: 95 },
      { hashtag: '#design', posts: 5, reach: 900, engagement: 70 },
      { hashtag: '#innovation', posts: 4, reach: 800, engagement: 60 }
    ],
    bestPostingTimes: [
      { hour: 9, engagement: 85 },
      { hour: 12, engagement: 95 },
      { hour: 15, engagement: 78 },
      { hour: 18, engagement: 92 },
      { hour: 21, engagement: 88 }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  analytics.set('analytics_1', mockAnalytics);
};

// Initialize analytics
initializeAnalytics();

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

// Get analytics overview
router.get('/overview', (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    const userAnalytics = analytics.get('analytics_1');
    if (!userAnalytics) {
      return res.status(404).json({
        error: 'Analytics not found',
        message: 'No analytics data found for this user'
      });
    }

    res.json({
      overview: userAnalytics.metrics,
      period: userAnalytics.period,
      lastUpdated: userAnalytics.updatedAt
    });
  } catch (error) {
    console.error('Get analytics overview error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while fetching analytics overview' 
    });
  }
});

// Get detailed analytics
router.get('/detailed', (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    const userAnalytics = analytics.get('analytics_1');
    if (!userAnalytics) {
      return res.status(404).json({
        error: 'Analytics not found',
        message: 'No analytics data found for this user'
      });
    }

    res.json({
      metrics: userAnalytics.metrics,
      dailyStats: userAnalytics.dailyStats,
      topPosts: userAnalytics.topPosts,
      audienceInsights: userAnalytics.audienceInsights,
      hashtagPerformance: userAnalytics.hashtagPerformance,
      bestPostingTimes: userAnalytics.bestPostingTimes,
      period: userAnalytics.period,
      lastUpdated: userAnalytics.updatedAt
    });
  } catch (error) {
    console.error('Get detailed analytics error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while fetching detailed analytics' 
    });
  }
});

// Get engagement metrics
router.get('/engagement', (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    const userAnalytics = analytics.get('analytics_1');
    if (!userAnalytics) {
      return res.status(404).json({
        error: 'Analytics not found',
        message: 'No analytics data found for this user'
      });
    }

    const engagementData = {
      totalEngagement: userAnalytics.metrics.totalLikes + userAnalytics.metrics.totalComments + userAnalytics.metrics.totalRetweets,
      engagementRate: userAnalytics.metrics.engagementRate,
      averageEngagementPerPost: (userAnalytics.metrics.totalLikes + userAnalytics.metrics.totalComments + userAnalytics.metrics.totalRetweets) / userAnalytics.metrics.totalPosts,
      engagementBreakdown: {
        likes: userAnalytics.metrics.totalLikes,
        comments: userAnalytics.metrics.totalComments,
        retweets: userAnalytics.metrics.totalRetweets,
        shares: userAnalytics.metrics.totalShares
      },
      dailyEngagement: userAnalytics.dailyStats.map(day => ({
        date: day.date,
        engagement: day.likes + day.comments + day.retweets
      }))
    };

    res.json(engagementData);
  } catch (error) {
    console.error('Get engagement metrics error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while fetching engagement metrics' 
    });
  }
});

// Get audience insights
router.get('/audience', (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    const userAnalytics = analytics.get('analytics_1');
    if (!userAnalytics) {
      return res.status(404).json({
        error: 'Analytics not found',
        message: 'No analytics data found for this user'
      });
    }

    res.json({
      audienceInsights: userAnalytics.audienceInsights,
      totalFollowers: userAnalytics.metrics.followersGained,
      reach: userAnalytics.metrics.reach,
      impressions: userAnalytics.metrics.impressions
    });
  } catch (error) {
    console.error('Get audience insights error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while fetching audience insights' 
    });
  }
});

// Get content performance
router.get('/content', (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    const userAnalytics = analytics.get('analytics_1');
    if (!userAnalytics) {
      return res.status(404).json({
        error: 'Analytics not found',
        message: 'No analytics data found for this user'
      });
    }

    res.json({
      topPosts: userAnalytics.topPosts,
      hashtagPerformance: userAnalytics.hashtagPerformance,
      bestPostingTimes: userAnalytics.bestPostingTimes,
      totalPosts: userAnalytics.metrics.totalPosts
    });
  } catch (error) {
    console.error('Get content performance error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while fetching content performance' 
    });
  }
});

// Get growth metrics
router.get('/growth', (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    const userAnalytics = analytics.get('analytics_1');
    if (!userAnalytics) {
      return res.status(404).json({
        error: 'Analytics not found',
        message: 'No analytics data found for this user'
      });
    }

    const growthData = {
      followersGained: userAnalytics.metrics.followersGained,
      followingGained: userAnalytics.metrics.followingGained,
      reachGrowth: 15.2, // Mock percentage
      engagementGrowth: 8.5, // Mock percentage
      postsGrowth: 12.3, // Mock percentage
      dailyGrowth: userAnalytics.dailyStats.map(day => ({
        date: day.date,
        followersGained: Math.floor(Math.random() * 10) + 1,
        engagement: day.likes + day.comments + day.retweets
      }))
    };

    res.json(growthData);
  } catch (error) {
    console.error('Get growth metrics error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while fetching growth metrics' 
    });
  }
});

// Update analytics (simulate real-time updates)
router.post('/update', (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    const { action, data } = req.body;
    
    // Simulate analytics update based on action
    const userAnalytics = analytics.get('analytics_1');
    if (userAnalytics) {
      switch (action) {
        case 'post_created':
          userAnalytics.metrics.totalPosts += 1;
          break;
        case 'post_liked':
          userAnalytics.metrics.totalLikes += 1;
          break;
        case 'post_commented':
          userAnalytics.metrics.totalComments += 1;
          break;
        case 'post_retweeted':
          userAnalytics.metrics.totalRetweets += 1;
          break;
        case 'post_shared':
          userAnalytics.metrics.totalShares += 1;
          break;
        case 'post_viewed':
          userAnalytics.metrics.totalViews += 1;
          break;
        case 'user_followed':
          userAnalytics.metrics.followersGained += 1;
          break;
      }
      
      userAnalytics.updatedAt = new Date().toISOString();
      analytics.set('analytics_1', userAnalytics);
    }

    res.json({
      message: 'Analytics updated successfully',
      action,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Update analytics error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while updating analytics' 
    });
  }
});

module.exports = router;