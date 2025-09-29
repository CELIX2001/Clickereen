'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BookmarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CalendarIcon,
  TagIcon,
  ShareIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ArrowPathIcon,
  EllipsisHorizontalIcon,
  EyeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface BookmarkedPost {
  id: string
  content: string
  author: {
    name: string
    username: string
    avatar: string
    verified: boolean
  }
  timestamp: string
  bookmarkedAt: string
  likes: number
  comments: number
  shares: number
  views: number
  media?: {
    type: 'image' | 'video'
    url: string
    thumbnail?: string
  }
  tags: string[]
  category: string
}

export function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedPost[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('recent')

  const categories = [
    { id: 'all', name: 'All', count: 0 },
    { id: 'technology', name: 'Technology', count: 0 },
    { id: 'design', name: 'Design', count: 0 },
    { id: 'business', name: 'Business', count: 0 },
    { id: 'lifestyle', name: 'Lifestyle', count: 0 }
  ]

  const sortOptions = [
    { id: 'recent', name: 'Most Recent' },
    { id: 'oldest', name: 'Oldest First' },
    { id: 'popular', name: 'Most Popular' },
    { id: 'alphabetical', name: 'Alphabetical' }
  ]

  // Mock data
  useEffect(() => {
    const mockBookmarks: BookmarkedPost[] = [
      {
        id: '1',
        content: 'Just discovered this amazing CSS technique for creating glassmorphism effects! The combination of backdrop-filter and semi-transparent backgrounds creates such beautiful depth. Perfect for modern web design! #CSS #WebDesign #Glassmorphism',
        author: {
          name: 'Sarah Chen',
          username: 'sarah_dev',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          verified: true
        },
        timestamp: '2 days ago',
        bookmarkedAt: '1 day ago',
        likes: 1250,
        comments: 89,
        shares: 156,
        views: 8900,
        tags: ['CSS', 'WebDesign', 'Glassmorphism'],
        category: 'design',
        media: {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=400&fit=crop'
        }
      },
      {
        id: '2',
        content: 'Building a real-time chat application with Next.js and Socket.io. The performance is incredible! Here\'s what I learned about optimizing WebSocket connections for scale. #NextJS #SocketIO #RealTime #WebSockets',
        author: {
          name: 'Alex Rodriguez',
          username: 'alex_codes',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          verified: false
        },
        timestamp: '1 week ago',
        bookmarkedAt: '3 days ago',
        likes: 890,
        comments: 45,
        shares: 78,
        views: 5600,
        tags: ['NextJS', 'SocketIO', 'RealTime', 'WebSockets'],
        category: 'technology'
      },
      {
        id: '3',
        content: 'The psychology of color in UI design: How different colors affect user behavior and decision-making. This research completely changed how I approach color selection in my projects. #UI #UX #Design #Psychology #ColorTheory',
        author: {
          name: 'Maria Garcia',
          username: 'maria_tech',
          avatar: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4cf687?w=150&h=150&fit=crop&crop=face',
          verified: true
        },
        timestamp: '2 weeks ago',
        bookmarkedAt: '1 week ago',
        likes: 2100,
        comments: 234,
        shares: 189,
        views: 12300,
        tags: ['UI', 'UX', 'Design', 'Psychology', 'ColorTheory'],
        category: 'design'
      },
      {
        id: '4',
        content: 'Startup funding strategies: A comprehensive guide to raising capital in 2024. From pre-seed to Series A, here\'s everything you need to know about the current investment landscape. #Startup #Funding #Investment #Business #Entrepreneurship',
        author: {
          name: 'David Kim',
          username: 'david_startup',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
          verified: true
        },
        timestamp: '3 weeks ago',
        bookmarkedAt: '2 weeks ago',
        likes: 3400,
        comments: 456,
        shares: 567,
        views: 18900,
        tags: ['Startup', 'Funding', 'Investment', 'Business', 'Entrepreneurship'],
        category: 'business'
      }
    ]

    setBookmarks(mockBookmarks)
    
    // Update category counts
    const updatedCategories = categories.map(cat => ({
      ...cat,
      count: cat.id === 'all' ? mockBookmarks.length : mockBookmarks.filter(b => b.category === cat.id).length
    }))
    categories.splice(0, categories.length, ...updatedCategories)
  }, [])

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = bookmark.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bookmark.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bookmark.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || bookmark.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const sortedBookmarks = [...filteredBookmarks].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.bookmarkedAt).getTime() - new Date(a.bookmarkedAt).getTime()
      case 'oldest':
        return new Date(a.bookmarkedAt).getTime() - new Date(b.bookmarkedAt).getTime()
      case 'popular':
        return b.likes - a.likes
      case 'alphabetical':
        return a.author.name.localeCompare(b.author.name)
      default:
        return 0
    }
  })

  const handleRemoveBookmark = (bookmarkId: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== bookmarkId))
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
            <BookmarkSolidIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bookmarks</h1>
            <p className="text-gray-600 dark:text-gray-400">{bookmarks.length} saved posts</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-white"
              placeholder="Search bookmarks..."
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bookmarks Grid */}
      <div className="space-y-6">
        {sortedBookmarks.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookmarkIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No bookmarks found</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery ? 'Try adjusting your search terms' : 'Start bookmarking posts you want to save for later'}
            </p>
          </div>
        ) : (
          sortedBookmarks.map((bookmark, index) => (
            <motion.article
              key={bookmark.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start space-x-3 mb-4">
                <img
                  src={bookmark.author.avatar}
                  alt={bookmark.author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-bold text-gray-900 dark:text-white">{bookmark.author.name}</span>
                    {bookmark.author.verified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    <span className="text-gray-500 dark:text-gray-400 text-sm">@{bookmark.author.username}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">·</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">{bookmark.timestamp}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center space-x-1">
                      <BookmarkSolidIcon className="w-4 h-4 text-green-500" />
                      <span>Bookmarked {bookmark.bookmarkedAt}</span>
                    </span>
                    <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full text-xs">
                      {bookmark.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveBookmark(bookmark.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                >
                  <BookmarkSolidIcon className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed">{bookmark.content}</p>

              {bookmark.media && (
                <div className="mb-4 rounded-lg overflow-hidden">
                  <img
                    src={bookmark.media.url}
                    alt="Post media"
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {bookmark.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <HeartIcon className="w-4 h-4" />
                    <span>{bookmark.likes.toLocaleString()}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <ChatBubbleLeftIcon className="w-4 h-4" />
                    <span>{bookmark.comments.toLocaleString()}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <ArrowPathIcon className="w-4 h-4" />
                    <span>{bookmark.shares.toLocaleString()}</span>
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <EyeIcon className="w-4 h-4" />
                    <span>{bookmark.views.toLocaleString()}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <ChartBarIcon className="w-4 h-4" />
                    <span>Engagement</span>
                  </span>
                </div>
              </div>
            </motion.article>
          ))
        )}
      </div>
    </div>
  )
}
