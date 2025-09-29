'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ChartBarIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface AnalyticsData {
  totalViews: number
  totalLikes: number
  totalComments: number
  totalShares: number
  totalFollowers: number
  engagementRate: number
  reach: number
  impressions: number
  topPosts: Array<{
    id: string
    content: string
    views: number
    likes: number
    comments: number
    shares: number
    engagement: number
  }>
  dailyStats: Array<{
    date: string
    views: number
    likes: number
    comments: number
    shares: number
  }>
  audienceInsights: {
    ageGroups: Array<{ range: string; percentage: number }>
    topCountries: Array<{ country: string; percentage: number }>
    deviceTypes: Array<{ device: string; percentage: number }>
  }
}

interface AnalyticsDashboardProps {
  data: AnalyticsData
}

export function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('7d')
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'engagement' | 'reach' | 'growth'>('all')

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const getEngagementColor = (rate: number) => {
    if (rate >= 5) return 'text-green-500'
    if (rate >= 3) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
    return <ArrowTrendingDownIcon className="w-4 h-4 text-red-500" />
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <ChartBarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Track your performance</p>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex space-x-2">
          {(['7d', '30d', '90d'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Views</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {formatNumber(data.totalViews)}
              </p>
            </div>
            <EyeIcon className="w-8 h-8 text-blue-500" />
          </div>
          <div className="flex items-center mt-2">
            {getTrendIcon(data.totalViews, data.totalViews * 0.9)}
            <span className="text-sm text-green-600 dark:text-green-400 ml-1">+12%</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">Total Likes</p>
              <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                {formatNumber(data.totalLikes)}
              </p>
            </div>
            <HeartIcon className="w-8 h-8 text-red-500" />
          </div>
          <div className="flex items-center mt-2">
            {getTrendIcon(data.totalLikes, data.totalLikes * 0.85)}
            <span className="text-sm text-green-600 dark:text-green-400 ml-1">+8%</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">Comments</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                {formatNumber(data.totalComments)}
              </p>
            </div>
            <ChatBubbleLeftIcon className="w-8 h-8 text-green-500" />
          </div>
          <div className="flex items-center mt-2">
            {getTrendIcon(data.totalComments, data.totalComments * 0.92)}
            <span className="text-sm text-green-600 dark:text-green-400 ml-1">+15%</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Engagement</p>
              <p className={`text-2xl font-bold ${getEngagementColor(data.engagementRate)}`}>
                {data.engagementRate.toFixed(1)}%
              </p>
            </div>
            <UserGroupIcon className="w-8 h-8 text-purple-500" />
          </div>
          <div className="flex items-center mt-2">
            {getTrendIcon(data.engagementRate, data.engagementRate * 0.88)}
            <span className="text-sm text-green-600 dark:text-green-400 ml-1">+3%</span>
          </div>
        </motion.div>
      </div>

      {/* Top Performing Posts */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Performing Posts</h3>
        <div className="space-y-3">
          {data.topPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white font-medium mb-2 line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center space-x-1">
                      <EyeIcon className="w-4 h-4" />
                      <span>{formatNumber(post.views)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <HeartIcon className="w-4 h-4" />
                      <span>{formatNumber(post.likes)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <ChatBubbleLeftIcon className="w-4 h-4" />
                      <span>{formatNumber(post.comments)}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <ShareIcon className="w-4 h-4" />
                      <span>{formatNumber(post.shares)}</span>
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {post.engagement.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Engagement</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Audience Insights */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Age Groups */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Age Groups</h4>
          <div className="space-y-2">
            {data.audienceInsights.ageGroups.map((group, index) => (
              <div key={group.range} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{group.range}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${group.percentage}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                    {group.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Countries */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Top Countries</h4>
          <div className="space-y-2">
            {data.audienceInsights.topCountries.map((country, index) => (
              <div key={country.country} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{country.country}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${country.percentage}%` }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                    {country.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Device Types */}
        <div>
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Device Types</h4>
          <div className="space-y-2">
            {data.audienceInsights.deviceTypes.map((device, index) => (
              <div key={device.device} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">{device.device}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${device.percentage}%` }}
                      transition={{ delay: 0.9 + index * 0.1, duration: 0.8 }}
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                    {device.percentage}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}