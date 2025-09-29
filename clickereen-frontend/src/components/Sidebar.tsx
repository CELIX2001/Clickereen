'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  HomeIcon,
  UserGroupIcon,
  BellIcon,
  BookmarkIcon,
  UserIcon,
  Cog6ToothIcon,
  PlusIcon,
  HashtagIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline'

interface SidebarProps {
  user: {
    _id: string
    username: string
    displayName: string
    avatar: string
    verified: boolean
    followersCount: number
    followingCount: number
  }
}

export function Sidebar({ user }: SidebarProps) {
  const [activeTab, setActiveTab] = useState('home')

  const navigationItems = [
    { id: 'home', name: 'Home', icon: HomeIcon },
    { id: 'explore', name: 'Explore', icon: HashtagIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'messages', name: 'Messages', icon: ChatBubbleLeftIcon },
    { id: 'bookmarks', name: 'Bookmarks', icon: BookmarkIcon },
    { id: 'communities', name: 'Communities', icon: UserGroupIcon },
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'settings', name: 'Settings', icon: Cog6ToothIcon }
  ]

  return (
    <div className="w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 h-screen overflow-y-auto">
      <div className="p-4">
        {/* Logo */}
        <motion.div 
          className="flex items-center space-x-2 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-white font-bold text-lg">C</span>
          </motion.div>
          <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
            Clickereen
          </span>
        </motion.div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigationItems.map((item, index) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </motion.button>
            )
          })}
        </nav>

        {/* Compose Button */}
        <motion.button
          className="w-full mt-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <PlusIcon className="w-5 h-5" />
          <span>Compose</span>
        </motion.button>

        {/* User Profile */}
        <motion.div 
          className="mt-8 p-4 bg-gray-50/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-600/50"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center space-x-3">
            <motion.img
              src={user?.avatar || '/default-avatar.png'}
              alt={user?.displayName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-green-500/20 hover:ring-green-500/40 transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.displayName || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                @{user?.username || 'username'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
