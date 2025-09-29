# 🚀 Clickereen - Modern Social Media Platform

A professional-grade social media platform built with modern technologies, featuring real-time interactions, analytics, and live streaming capabilities.

## 🏗️ Architecture

### Frontend (Next.js 14 + React 18)
- **Framework**: Next.js 14 with App Router
- **UI Library**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **Animations**: Framer Motion for smooth interactions
- **Icons**: Heroicons for consistent iconography
- **State Management**: React Context with custom hooks

### Backend (Node.js + Express)
- **Runtime**: Node.js with Express.js
- **Authentication**: JWT-based authentication
- **Real-time**: Socket.io for live features
- **Security**: Helmet, rate limiting, CORS
- **Storage**: In-memory storage (no database required)
- **File Upload**: Multer for media handling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/CELIX2001/Clickereen.git
   cd Clickereen
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd clickereen-backend
   npm install
   
   # Install frontend dependencies
   cd ../clickereen-frontend
   npm install
   ```

3. **Start the development servers**
   ```bash
   # From root directory
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5001`
   - Frontend server on `http://localhost:3002`

### Individual Server Commands

**Backend only:**
```bash
cd clickereen-backend
npm run dev
```

**Frontend only:**
```bash
cd clickereen-frontend
npm run dev
```

## 📁 Project Structure

```
clickereen/
├── clickereen-backend/          # Node.js/Express backend
│   ├── routes/                  # API route handlers
│   │   ├── auth.js             # Authentication endpoints
│   │   ├── posts.js            # Posts management
│   │   ├── users.js            # User management
│   │   ├── analytics.js        # Analytics dashboard
│   │   ├── notifications.js    # Notifications system
│   │   ├── livestreams.js      # Live streaming
│   │   ├── search.js           # Search functionality
│   │   └── media.js            # Media upload/processing
│   ├── server.js               # Main server file
│   ├── package.json            # Backend dependencies
│   └── env.example             # Environment variables template
│
├── clickereen-frontend/         # Next.js/React frontend
│   ├── src/
│   │   ├── app/                # Next.js app directory
│   │   │   ├── layout.tsx      # Root layout
│   │   │   ├── page.tsx        # Home page
│   │   │   └── providers.tsx   # Context providers
│   │   ├── components/         # React components
│   │   │   ├── LoginPage.tsx   # Authentication
│   │   │   ├── HomePage.tsx    # Main dashboard
│   │   │   ├── EndlessFeed.tsx # Social media feed
│   │   │   ├── AnalyticsDashboard.tsx # Analytics
│   │   │   ├── LiveStreaming.tsx # Live streaming
│   │   │   ├── AdminDashboard.tsx # Admin panel
│   │   │   ├── CommentsModal.tsx # Comments system
│   │   │   ├── NotificationsPanel.tsx # Notifications
│   │   │   └── ...             # Other components
│   │   ├── utils/              # Utility functions
│   │   │   └── mockData.ts     # Mock data generation
│   │   └── types/              # TypeScript type definitions
│   ├── public/                 # Static assets
│   ├── package.json            # Frontend dependencies
│   └── next.config.ts          # Next.js configuration
│
└── README.md                   # This file
```

## 🎯 Features

### 🔐 Authentication
- JWT-based authentication
- Passwordless demo access
- User registration and login
- Profile management
- Social login integration (UI ready)

### 📱 Social Media Core
- **Posts**: Create, like, comment, retweet, share
- **Feed**: Infinite scroll with real-time updates
- **Users**: Follow/unfollow, user discovery
- **Notifications**: Real-time notification system
- **Comments**: Nested comment system with replies
- **Media**: Image and video upload support

### 📊 Analytics Dashboard
- **Engagement Metrics**: Likes, comments, shares, views
- **Audience Insights**: Demographics, interests, locations
- **Content Performance**: Top posts, hashtag analytics
- **Growth Tracking**: Follower growth, engagement trends
- **Real-time Updates**: Live analytics data

### 📺 Live Streaming
- **Stream Management**: Create, start, end streams
- **Viewer Tracking**: Real-time viewer counts
- **Stream Discovery**: Find and join live streams
- **Streamer Profiles**: Streamer information and stats

### 🔍 Search & Discovery
- **Global Search**: Search posts, users, hashtags
- **Trending Topics**: Real-time trending topics
- **Advanced Filters**: Search by type, date, popularity
- **Smart Suggestions**: AI-powered content suggestions

### ⚙️ Admin Features
- **User Management**: User administration and moderation
- **Content Moderation**: Post and comment moderation
- **Analytics Overview**: Platform-wide analytics
- **System Monitoring**: Health checks and performance metrics

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/quick-access` - Passwordless access
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Posts
- `GET /api/posts` - Get all posts (paginated)
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get specific post
- `POST /api/posts/:id/like` - Like/unlike post
- `POST /api/posts/:id/retweet` - Retweet post
- `POST /api/posts/:id/bookmark` - Bookmark post
- `DELETE /api/posts/:id` - Delete post

### Analytics
- `GET /api/analytics/overview` - Analytics overview
- `GET /api/analytics/detailed` - Detailed analytics
- `GET /api/analytics/engagement` - Engagement metrics
- `GET /api/analytics/audience` - Audience insights
- `GET /api/analytics/content` - Content performance

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/mark-all-read` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get specific user
- `GET /api/users/search/:query` - Search users
- `GET /api/users/suggestions/:userId` - Get suggestions
- `GET /api/users/trending` - Get trending users

### Live Streaming
- `GET /api/livestreams` - Get all streams
- `GET /api/livestreams/live` - Get live streams
- `POST /api/livestreams` - Create stream
- `POST /api/livestreams/:id/start` - Start stream
- `POST /api/livestreams/:id/end` - End stream

### Search
- `GET /api/search` - Global search
- `GET /api/search/posts` - Search posts
- `GET /api/search/users` - Search users
- `GET /api/search/hashtags` - Search hashtags
- `GET /api/search/trending` - Get trending topics

### Media
- `POST /api/media/upload` - Upload single file
- `POST /api/media/upload-multiple` - Upload multiple files
- `GET /api/media/:id` - Get media info
- `DELETE /api/media/:id` - Delete media

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the `clickereen-backend` directory:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key

# CORS Configuration
FRONTEND_URL=http://localhost:3002

# Optional: MongoDB (if you want to use a database)
MONGODB_URI=mongodb://localhost:27017/clickereen
```

### Frontend Configuration

The frontend is configured to connect to the backend automatically. No additional configuration is needed for development.

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables
2. Install dependencies: `npm install`
3. Start the server: `npm start`

### Frontend Deployment
1. Build the application: `npm run build`
2. Start the production server: `npm start`

## 🧪 Testing

### Backend Testing
```bash
cd clickereen-backend
npm test
```

### Frontend Testing
```bash
cd clickereen-frontend
npm test
```

## 📝 Development

### Adding New Features
1. Backend: Add new routes in the `routes/` directory
2. Frontend: Add new components in the `src/components/` directory
3. Update types in `src/types/` if needed
4. Test thoroughly before committing

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Use Tailwind CSS for styling
- Write clean, readable code
- Add comments for complex logic

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

**Built with ❤️ using Next.js, React, Node.js, and Express**
