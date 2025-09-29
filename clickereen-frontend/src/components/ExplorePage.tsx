'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  FireIcon,
  ClockIcon,
  UserGroupIcon,
  HashtagIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

interface TrendingTopic {
  id: string
  name: string
  category: string
  posts: number
  trend: 'up' | 'down' | 'stable'
  change: number
}

interface TrendingPost {
  id: string
  content: string
  author: {
    name: string
    username: string
    avatar: string
    verified: boolean
  }
  likes: number
  comments: number
  shares: number
  timestamp: string
  media?: {
    type: 'image' | 'video'
    url: string
  }
  trending: boolean
}

export function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('trending')
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
  const [trendingPosts, setTrendingPosts] = useState<TrendingPost[]>([])

  const filters = [
    { id: 'trending', name: 'Trending', icon: FireIcon },
    { id: 'recent', name: 'Recent', icon: ClockIcon },
    { id: 'people', name: 'People', icon: UserGroupIcon },
    { id: 'photos', name: 'Photos', icon: PhotoIcon },
    { id: 'videos', name: 'Videos', icon: VideoCameraIcon }
  ]

  // Mock data
  useEffect(() => {
    const mockTopics: TrendingTopic[] = [
      { id: '1', name: '#Clickereen', category: 'Technology', posts: 12500, trend: 'up', change: 15.2 },
      { id: '2', name: '#WebDevelopment', category: 'Technology', posts: 8900, trend: 'up', change: 8.7 },
      { id: '3', name: '#ReactJS', category: 'Technology', posts: 15600, trend: 'up', change: 12.3 },
      { id: '4', name: '#NextJS', category: 'Technology', posts: 7200, trend: 'up', change: 22.1 },
      { id: '5', name: '#TypeScript', category: 'Technology', posts: 9800, trend: 'up', change: 6.4 },
      { id: '6', name: '#AI', category: 'Technology', posts: 23400, trend: 'up', change: 18.9 },
      { id: '7', name: '#Design', category: 'Creative', posts: 11200, trend: 'up', change: 9.2 },
      { id: '8', name: '#Startup', category: 'Business', posts: 6800, trend: 'down', change: -2.1 }
    ]

    const mockPosts: TrendingPost[] = [
      {
        id: '1',
        content: 'Just discovered Clickereen and I\'m blown away by the modern UI! The real-time features are incredible. #Clickereen #WebDev',
        author: {
          name: 'Sarah Chen',
          username: 'sarah_dev',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          verified: true
        },
        likes: 1250,
        comments: 89,
        shares: 156,
        timestamp: '2h ago',
        trending: true
      },
      {
        id: '2',
        content: 'Building my next project with Next.js 15 and TypeScript. The developer experience is amazing! #NextJS #TypeScript',
        author: {
          name: 'Alex Rodriguez',
          username: 'alex_codes',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          verified: false
        },
        likes: 890,
        comments: 45,
        shares: 78,
        timestamp: '4h ago',
        trending: true
      },
      {
        id: '3',
        content: 'The future of web development is here! Real-time collaboration tools are changing everything. #WebDev #Future',
        author: {
          name: 'Maria Garcia',
          username: 'maria_tech',
          avatar: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4cf687?w=150&h=150&fit=crop&crop=face',
          verified: true
        },
        likes: 2100,
        comments: 234,
        shares: 189,
        timestamp: '6h ago',
        trending: true
      }
    ]

    setTrendingTopics(mockTopics)
    setTrendingPosts(mockPosts)
  }, [])

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <FireIcon className="w-4 h-4 text-red-500" />
      case 'down':
        return <ClockIcon className="w-4 h-4 text-gray-500" />
      default:
        return <ClockIcon className="w-4 h-4 text-gray-500" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-red-500'
      case 'down':
        return 'text-gray-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Explore</h1>
        <p className="text-gray-600 dark:text-gray-400">Discover what's happening around the world</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-xl leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-900 dark:text-white"
          placeholder="Search Clickereen..."
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <FunnelIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === filter.id
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <filter.icon className="w-4 h-4" />
            <span>{filter.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trending Topics */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-6">
              <SparklesIcon className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Trending Topics</h2>
            </div>
            
            <div className="space-y-4">
              {trendingTopics.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">#{index + 1}</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{topic.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                        {topic.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>{topic.posts.toLocaleString()} posts</span>
                      <div className={`flex items-center space-x-1 ${getTrendColor(topic.trend)}`}>
                        {getTrendIcon(topic.trend)}
                        <span>{topic.change > 0 ? '+' : ''}{topic.change}%</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Trending Posts */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {trendingPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-bold text-gray-900 dark:text-white">{post.author.name}</span>
                      {post.author.verified && (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                      <span className="text-gray-500 dark:text-gray-400 text-sm">@{post.author.username}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">·</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm">{post.timestamp}</span>
                      {post.trending && (
                        <span className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs px-2 py-1 rounded-full font-medium">
                          Trending
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed">{post.content}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-6">
                        <span className="flex items-center space-x-1 hover:text-red-500 cursor-pointer">
                          <span>❤️</span>
                          <span>{post.likes.toLocaleString()}</span>
                        </span>
                        <span className="flex items-center space-x-1 hover:text-blue-500 cursor-pointer">
                          <span>💬</span>
                          <span>{post.comments.toLocaleString()}</span>
                        </span>
                        <span className="flex items-center space-x-1 hover:text-green-500 cursor-pointer">
                          <span>🔄</span>
                          <span>{post.shares.toLocaleString()}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
