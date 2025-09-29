const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'), false);
    }
  }
});

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

// Upload media
router.post('/upload', upload.single('media'), (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        error: 'No file uploaded',
        message: 'Please select a file to upload'
      });
    }

    // In a real application, you would:
    // 1. Upload to cloud storage (AWS S3, Cloudinary, etc.)
    // 2. Process the image/video (resize, compress, etc.)
    // 3. Generate thumbnails for videos
    // 4. Store metadata in database

    // For demo purposes, return mock URLs
    const mediaId = uuidv4();
    const fileExtension = req.file.originalname.split('.').pop();
    const mockUrl = `https://example.com/media/${mediaId}.${fileExtension}`;
    const mockThumbnail = req.file.mimetype.startsWith('video/') 
      ? `https://example.com/thumbnails/${mediaId}.jpg` 
      : null;

    const mediaData = {
      _id: mediaId,
      userId,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: mockUrl,
      thumbnail: mockThumbnail,
      type: req.file.mimetype.startsWith('video/') ? 'video' : 'image',
      createdAt: new Date().toISOString()
    };

    res.status(201).json({
      message: 'Media uploaded successfully',
      media: mediaData
    });
  } catch (error) {
    console.error('Upload media error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while uploading media' 
    });
  }
});

// Upload multiple media files
router.post('/upload-multiple', upload.array('media', 5), (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        error: 'No files uploaded',
        message: 'Please select files to upload'
      });
    }

    const mediaFiles = req.files.map(file => {
      const mediaId = uuidv4();
      const fileExtension = file.originalname.split('.').pop();
      const mockUrl = `https://example.com/media/${mediaId}.${fileExtension}`;
      const mockThumbnail = file.mimetype.startsWith('video/') 
        ? `https://example.com/thumbnails/${mediaId}.jpg` 
        : null;

      return {
        _id: mediaId,
        userId,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: mockUrl,
        thumbnail: mockThumbnail,
        type: file.mimetype.startsWith('video/') ? 'video' : 'image',
        createdAt: new Date().toISOString()
      };
    });

    res.status(201).json({
      message: 'Media files uploaded successfully',
      media: mediaFiles,
      count: mediaFiles.length
    });
  } catch (error) {
    console.error('Upload multiple media error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while uploading media files' 
    });
  }
});

// Get media by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock media data
    const mediaData = {
      _id: id,
      url: `https://example.com/media/${id}.jpg`,
      thumbnail: `https://example.com/thumbnails/${id}.jpg`,
      type: 'image',
      createdAt: new Date().toISOString()
    };

    res.json(mediaData);
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while fetching media' 
    });
  }
});

// Delete media
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
    
    // In a real application, you would:
    // 1. Verify the user owns the media
    // 2. Delete from cloud storage
    // 3. Remove from database

    res.json({
      message: 'Media deleted successfully'
    });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while deleting media' 
    });
  }
});

// Get user's media
router.get('/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, type } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Mock user media data
    const mockMedia = [
      {
        _id: 'media_1',
        userId,
        url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
        thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        type: 'image',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'media_2',
        userId,
        url: 'https://example.com/video1.mp4',
        thumbnail: 'https://example.com/thumbnails/video1.jpg',
        type: 'video',
        createdAt: new Date().toISOString()
      }
    ];

    let filteredMedia = mockMedia;
    if (type) {
      filteredMedia = mockMedia.filter(media => media.type === type);
    }

    // Pagination
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedMedia = filteredMedia.slice(startIndex, endIndex);

    res.json({
      media: paginatedMedia,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(filteredMedia.length / limitNum),
        totalMedia: filteredMedia.length,
        hasNext: endIndex < filteredMedia.length,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Get user media error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while fetching user media' 
    });
  }
});

// Process media (resize, compress, etc.)
router.post('/:id/process', (req, res) => {
  try {
    const userId = getUserFromToken(req);
    if (!userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }

    const { id } = req.params;
    const { operations } = req.body; // e.g., { resize: { width: 800, height: 600 }, compress: 80 }

    // In a real application, you would:
    // 1. Process the media based on operations
    // 2. Generate different sizes/qualities
    // 3. Update the media record

    res.json({
      message: 'Media processing started',
      mediaId: id,
      operations,
      status: 'processing'
    });
  } catch (error) {
    console.error('Process media error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Server error while processing media' 
    });
  }
});

module.exports = router;