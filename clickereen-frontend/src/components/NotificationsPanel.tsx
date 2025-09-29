'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BellIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ArrowPathIcon,
  UserPlusIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import {
  HeartIcon as HeartSolidIcon,
  BellIcon as BellSolidIcon
} from '@heroicons/react/24/solid'
import { useAuth } from '../app/providers'

interface Notification {
  id: string
  type: 'like' | 'comment' | 'retweet' | 'follow' | 'mention'
  user: {
    name: string
    username: string
    avatar: string
    verified: boolean
  }
  content: string
  timestamp: string
  read: boolean
  postId?: string
}

interface NotificationsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const { socket } = useAuth()

  // Generate mock notifications
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'like',
        user: {
          name: 'Sarah Chen',
          username: 'sarah_creative',
          avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          verified: true
        },
        content: 'liked your post about "Amazing sunset at the beach"',
        timestamp: '2m ago',
        read: false,
        postId: 'post_1'
      },
      {
        id: '2',
        type: 'comment',
        user: {
          name: 'Mike Rodriguez',
          username: 'mike_gamer',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          verified: false
        },
        content: 'commented: "This is incredible! Where was this taken?"',
        timestamp: '5m ago',
        read: false,
        postId: 'post_2'
      },
      {
        id: '3',
        type: 'retweet',
        user: {
          name: 'Alex Johnson',
          username: 'alex_tech',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
          verified: true
        },
        content: 'retweeted your post',
        timestamp: '10m ago',
        read: true,
        postId: 'post_3'
      },
      {
        id: '4',
        type: 'follow',
        user: {
          name: 'Emma Wilson',
          username: 'emma_designer',
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          verified: false
        },
        content: 'started following you',
        timestamp: '1h ago',
        read: true,
        postId: undefined
      },
      {
        id: '5',
        type: 'mention',
        user: {
          name: 'David Kim',
          username: 'david_photographer',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
          verified: true
        },
        content: 'mentioned you in a post',
        timestamp: '2h ago',
        read: false,
        postId: 'post_4'
      }
    ]
    setNotifications(mockNotifications)
  }, [])

  // Real-time notification handling
  useEffect(() => {
    if (socket) {
      const handleNewNotification = (notification: Notification) => {
        setNotifications(prev => [notification, ...prev])
      }

      const handlePostLiked = (data: any) => {
        const newNotification: Notification = {
          id: `like_${Date.now()}`,
          type: 'like',
          user: data.user,
          content: 'liked your post',
          timestamp: 'now',
          read: false,
          postId: data.postId
        }
        setNotifications(prev => [newNotification, ...prev])
      }

      const handlePostCommented = (data: any) => {
        const newNotification: Notification = {
          id: `comment_${Date.now()}`,
          type: 'comment',
          user: data.user,
          content: 'commented on your post',
          timestamp: 'now',
          read: false,
          postId: data.postId
        }
        setNotifications(prev => [newNotification, ...prev])
      }

      socket.on('notification', handleNewNotification)
      socket.on('postLiked', handlePostLiked)
      socket.on('postCommented', handlePostCommented)

      return () => {
        socket.off('notification', handleNewNotification)
        socket.off('postLiked', handlePostLiked)
        socket.off('postCommented', handlePostCommented)
      }
    }
  }, [socket])

  const filteredNotifications = notifications.filter(notification => 
    filter === 'all' || !notification.read
  )

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <HeartSolidIcon className="w-5 h-5 text-red-500" />
      case 'comment':
        return <ChatBubbleLeftIcon className="w-5 h-5 text-blue-500" />
      case 'retweet':
        return <ArrowPathIcon className="w-5 h-5 text-green-500" />
      case 'follow':
        return <UserPlusIcon className="w-5 h-5 text-purple-500" />
      case 'mention':
        return <BellIcon className="w-5 h-5 text-yellow-500" />
      default:
        return <BellIcon className="w-5 h-5 text-gray-500" />
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-hidden"
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border-l border-gray-200/50 dark:border-gray-700/50"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <BellSolidIcon className="w-6 h-6 text-green-500" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Notifications
                  </h2>
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex space-x-1 mt-4">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'all'
                      ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === 'unread'
                      ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                  <BellIcon className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No notifications
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {filter === 'unread' ? 'All caught up!' : 'You\'ll see notifications here when you get them.'}
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer group ${
                        notification.read
                          ? 'bg-gray-50/50 dark:bg-gray-800/50 border-gray-200/50 dark:border-gray-700/50'
                          : 'bg-white dark:bg-gray-800 border-green-200 dark:border-green-800 shadow-sm'
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <img
                              src={notification.user.avatar}
                              alt={notification.user.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-1">
                                <span className="font-medium text-gray-900 dark:text-white truncate">
                                  {notification.user.name}
                                </span>
                                {notification.user.verified && (
                                  <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                  </svg>
                                )}
                                <span className="text-gray-500 dark:text-gray-400 text-sm">
                                  @{notification.user.username}
                                </span>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                                {notification.content}
                              </p>
                              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                                {notification.timestamp}
                              </p>
                            </div>
                          </div>
                        </div>
                        {!notification.read && (
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}







