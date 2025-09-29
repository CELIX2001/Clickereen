'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ChartBarIcon, 
  UsersIcon, 
  DocumentTextIcon, 
  ExclamationTriangleIcon,
  ShieldCheckIcon,
  CogIcon,
  EyeIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline'

interface AdminStats {
  users: {
    total: number
    active: number
    newToday: number
    growth: number
  }
  content: {
    posts: number
    comments: number
    media: number
    growth: number
  }
  moderation: {
    pending: number
    flagged: number
    resolved: number
    growth: number
  }
  engagement: {
    totalLikes: number
    totalComments: number
    totalShares: number
    growth: number
  }
}

interface ModerationItem {
  _id: string
  contentId: string
  contentType: string
  content: {
    text: string
    media: Array<{
      type: string
      url: string
    }>
  }
  author: {
    _id: string
    username: string
    displayName: string
    avatar: string
  }
  status: string
  aiAnalysis: {
    toxicityScore: number
    categories: Array<{
      category: string
      confidence: number
      severity: string
    }>
    riskLevel: string
  }
  flags: Array<{
    user: string
    reason: string
    createdAt: string
  }>
  createdAt: string
}

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [moderationItems, setModerationItems] = useState<ModerationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('overview')
  const [selectedModerationItem, setSelectedModerationItem] = useState<ModerationItem | null>(null)

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    try {
      setLoading(true)
      
      // Load stats
      const statsResponse = await fetch('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('clickereen_token')}`
        }
      })
      const statsData = await statsResponse.json()
      setStats(statsData)

      // Load moderation items
      const moderationResponse = await fetch('/api/admin/moderation', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('clickereen_token')}`
        }
      })
      const moderationData = await moderationResponse.json()
      setModerationItems(moderationData.items)

    } catch (error) {
      console.error('Error loading admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleModerationAction = async (itemId: string, action: string, reason: string) => {
    try {
      const response = await fetch(`/api/admin/moderation/${itemId}/action`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('clickereen_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action, reason })
      })

      if (response.ok) {
        setModerationItems(prev => prev.filter(item => item._id !== itemId))
        setSelectedModerationItem(null)
        loadAdminData()
      }
    } catch (error) {
      console.error('Error performing moderation action:', error)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/30'
      case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30'
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600'
      case 'high': return 'text-orange-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your platform</p>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheckIcon className="w-8 h-8 text-green-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Admin</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'moderation', name: 'Content Moderation', icon: ShieldCheckIcon },
              { id: 'users', name: 'User Management', icon: UsersIcon },
              { id: 'analytics', name: 'Analytics', icon: ArrowTrendingUpIcon },
              { id: 'settings', name: 'Settings', icon: CogIcon }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  selectedTab === tab.id
                    ? 'border-green-500 text-green-600 dark:text-green-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Total Users</p>
                      <p className="text-3xl font-bold">{formatNumber(stats?.users.total || 0)}</p>
                      <p className="text-blue-100 text-sm">
                        {stats?.users.growth && stats.users.growth > 0 ? (
                          <span className="flex items-center">
                            <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
                            +{stats.users.growth}%
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
                            {stats?.users.growth}%
                          </span>
                        )}
                      </p>
                    </div>
                    <UsersIcon className="w-12 h-12 text-blue-200" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Active Users</p>
                      <p className="text-3xl font-bold">{formatNumber(stats?.users.active || 0)}</p>
                      <p className="text-green-100 text-sm">Online now</p>
                    </div>
                    <EyeIcon className="w-12 h-12 text-green-200" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Total Content</p>
                      <p className="text-3xl font-bold">{formatNumber(stats?.content.posts || 0)}</p>
                      <p className="text-purple-100 text-sm">Posts & Media</p>
                    </div>
                    <DocumentTextIcon className="w-12 h-12 text-purple-200" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">Pending Review</p>
                      <p className="text-3xl font-bold">{stats?.moderation.pending || 0}</p>
                      <p className="text-orange-100 text-sm">Items to review</p>
                    </div>
                    <ExclamationTriangleIcon className="w-12 h-12 text-orange-200" />
                  </div>
                </motion.div>
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { action: 'New user registered', user: 'john_doe', time: '2 minutes ago' },
                    { action: 'Content flagged for review', user: 'moderator_ai', time: '5 minutes ago' },
                    { action: 'Post published', user: 'jane_smith', time: '8 minutes ago' },
                    { action: 'User banned', user: 'admin', time: '15 minutes ago' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-gray-700 dark:text-gray-300">{activity.action}</span>
                        <span className="text-gray-500 dark:text-gray-400">by {activity.user}</span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'moderation' && (
            <div className="space-y-6">
              {/* Moderation Queue */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Content Moderation Queue</h3>
                <div className="space-y-4">
                  {moderationItems.map((item) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <img
                              src={item.author.avatar || '/default-avatar.png'}
                              alt={item.author.displayName}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                {item.author.displayName}
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                @{item.author.username}
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(item.aiAnalysis.riskLevel)}`}>
                              {item.aiAnalysis.riskLevel.toUpperCase()}
                            </span>
                          </div>
                          
                          <p className="text-gray-700 dark:text-gray-300 mb-3">
                            {item.content.text}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>Toxicity: {(item.aiAnalysis.toxicityScore * 100).toFixed(1)}%</span>
                            <span>Flags: {item.flags.length}</span>
                            <span>{new Date(item.createdAt).toLocaleString()}</span>
                          </div>
                          
                          {item.aiAnalysis.categories.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {item.aiAnalysis.categories.map((category, index) => (
                                <span
                                  key={index}
                                  className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(category.severity)}`}
                                >
                                  {category.category} ({category.confidence.toFixed(2)})
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => setSelectedModerationItem(item)}
                            className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleModerationAction(item._id, 'approve', 'Approved by admin')}
                            className="p-2 text-green-500 hover:text-green-600 transition-colors"
                          >
                            <CheckCircleIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleModerationAction(item._id, 'reject', 'Rejected by admin')}
                            className="p-2 text-red-500 hover:text-red-600 transition-colors"
                          >
                            <XCircleIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'users' && (
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Management</h3>
                <p className="text-gray-600 dark:text-gray-400">User management features coming soon...</p>
              </div>
            </div>
          )}

          {selectedTab === 'analytics' && (
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Platform Analytics</h3>
                <p className="text-gray-600 dark:text-gray-400">Advanced analytics coming soon...</p>
              </div>
            </div>
          )}

          {selectedTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Platform Settings</h3>
                <p className="text-gray-600 dark:text-gray-400">Settings management coming soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Moderation Detail Modal */}
      {selectedModerationItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Content Review</h3>
              <button
                onClick={() => setSelectedModerationItem(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <XCircleIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedModerationItem.author.avatar || '/default-avatar.png'}
                  alt={selectedModerationItem.author.displayName}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedModerationItem.author.displayName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    @{selectedModerationItem.author.username}
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-900 dark:text-white">{selectedModerationItem.content.text}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Toxicity Score</p>
                  <p className="text-lg font-bold text-red-600">
                    {(selectedModerationItem.aiAnalysis.toxicityScore * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Risk Level</p>
                  <p className={`text-lg font-bold ${getSeverityColor(selectedModerationItem.aiAnalysis.riskLevel)}`}>
                    {selectedModerationItem.aiAnalysis.riskLevel.toUpperCase()}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => handleModerationAction(selectedModerationItem._id, 'approve', 'Approved by admin')}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleModerationAction(selectedModerationItem._id, 'reject', 'Rejected by admin')}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleModerationAction(selectedModerationItem._id, 'flag', 'Flagged for further review')}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Flag
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
