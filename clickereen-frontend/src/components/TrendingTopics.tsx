'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FireIcon,
  TrendingUpIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
  HashtagIcon,
  EyeIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline'

interface TrendingTopic {
  id: string
  title: string
  type: 'hashtag' | 'topic' | 'event'
  posts: number
  trend: 'up' | 'down' | 'stable'
  change: number
  category: string
  description?: string
  relatedTopics?: string[]
}

interface TrendingTopicsProps {
  className?: string
}

const mockTrendingTopics: TrendingTopic[] = [
  {
    id: '1',
    title: 'AI Revolution',
    type: 'hashtag',
    posts: 125000,
    trend: 'up',
    change: 15.2,
    category: 'Technology',
    description: 'Latest developments in artificial intelligence',
    relatedTopics: ['Machine Learning', 'ChatGPT', 'Robotics']
  },
  {
    id: '2',
    title: 'Climate Action',
    type: 'topic',
    posts: 89000,
    trend: 'up',
    change: 8.7,
    category: 'Environment',
    description: 'Global climate change initiatives and solutions',
    relatedTopics: ['Renewable Energy', 'Sustainability', 'Green Tech']
  },
  {
    id: '3',
    title: 'SpaceX Launch',
    type: 'event',
    posts: 67000,
    trend: 'up',
    change: 45.3,
    category: 'Space',
    description: 'Successful rocket launch to Mars mission',
    relatedTopics: ['Mars', 'Elon Musk', 'Space Exploration']
  },
  {
    id: '4',
    title: 'Remote Work',
    type: 'hashtag',
    posts: 45000,
    trend: 'down',
    change: -3.2,
    category: 'Work',
    description: 'Future of remote and hybrid work',
    relatedTopics: ['Productivity', 'Work Life Balance', 'Digital Nomad']
  },
  {
    id: '5',
    title: 'Crypto Market',
    type: 'topic',
    posts: 78000,
    trend: 'stable',
    change: 0.8,
    category: 'Finance',
    description: 'Cryptocurrency market updates and analysis',
    relatedTopics: ['Bitcoin', 'Blockchain', 'DeFi']
  },
  {
    id: '6',
    title: 'Mental Health',
    type: 'hashtag',
    posts: 56000,
    trend: 'up',
    change: 12.5,
    category: 'Health',
    description: 'Importance of mental health awareness',
    relatedTopics: ['Wellness', 'Self Care', 'Therapy']
  },
  {
    id: '7',
    title: 'Electric Vehicles',
    type: 'topic',
    posts: 34000,
    trend: 'up',
    change: 6.8,
    category: 'Automotive',
    description: 'Latest in electric vehicle technology',
    relatedTopics: ['Tesla', 'Battery Tech', 'Clean Energy']
  },
  {
    id: '8',
    title: 'Gaming Industry',
    type: 'hashtag',
    posts: 92000,
    trend: 'up',
    change: 22.1,
    category: 'Entertainment',
    description: 'Gaming industry news and updates',
    relatedTopics: ['Esports', 'VR Gaming', 'Game Development']
  }
]

export function TrendingTopics({ className = '' }: TrendingTopicsProps) {
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [timeframe, setTimeframe] = useState<'1h' | '24h' | '7d'>('24h')

  useEffect(() => {
    // Simulate loading and randomizing trends
    const timer = setTimeout(() => {
      setTrendingTopics(mockTrendingTopics)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const categories = ['All', ...Array.from(new Set(trendingTopics.map(topic => topic.category)))]

  const filteredTopics = trendingTopics.filter(topic => 
    selectedCategory === 'All' || topic.category === selectedCategory
  )

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUpIcon className="w-4 h-4 text-green-500" />
      case 'down':
        return <ArrowDownIcon className="w-4 h-4 text-red-500" />
      default:
        return <MinusIcon className="w-4 h-4 text-gray-500" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-500'
      case 'down':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <FireIcon className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Trending Topics</h2>
          </div>
          <div className="flex space-x-1">
            {(['1h', '24h', '7d'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  timeframe === tf
                    ? 'bg-green-500 text-white'
                    : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                selectedCategory === category
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Trending List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredTopics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  {topic.type === 'hashtag' && <HashtagIcon className="w-4 h-4 text-blue-500" />}
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {topic.title}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    {topic.category}
                  </span>
                </div>
                
                {topic.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {topic.description}
                  </p>
                )}

                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <EyeIcon className="w-4 h-4" />
                    <span>{formatNumber(topic.posts)} posts</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(topic.trend)}
                    <span className={getTrendColor(topic.trend)}>
                      {topic.change > 0 ? '+' : ''}{topic.change}%
                    </span>
                  </div>
                </div>

                {topic.relatedTopics && topic.relatedTopics.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {topic.relatedTopics.slice(0, 3).map((related, idx) => (
                      <span
                        key={idx}
                        className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full"
                      >
                        {related}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    #{index + 1}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Trending
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Updated {timeframe === '1h' ? '1 hour' : timeframe === '24h' ? '24 hours' : '7 days'} ago
          </div>
          <button className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium">
            View All Trends
          </button>
        </div>
      </div>
    </div>
  )
}
