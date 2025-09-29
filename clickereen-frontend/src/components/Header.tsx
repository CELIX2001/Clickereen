'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  HomeIcon, 
  MagnifyingGlassIcon, 
  BellIcon, 
  EnvelopeIcon,
  BookmarkIcon,
  UserIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline'
import { NotificationsPanel } from './NotificationsPanel'
import { Logo } from './Logo'
import { AdvancedSearch } from './AdvancedSearch'

interface User {
  _id: string
  username: string
  displayName: string
  avatar: string
  verified: boolean
}

interface HeaderProps {
  user: User | null
  isDarkMode: boolean
  toggleDarkMode: () => void
  onCompose: () => void
  onNavigate?: (page: string) => void
}

export function Header({ user, isDarkMode, toggleDarkMode, onCompose, onNavigate }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const [activeNav, setActiveNav] = useState('Home')

  const navItems = [
    { name: 'Home', icon: HomeIcon, active: activeNav === 'Home', page: 'home' },
    { name: 'Explore', icon: MagnifyingGlassIcon, active: activeNav === 'Explore', page: 'explore' },
    { name: 'Notifications', icon: BellIcon, active: activeNav === 'Notifications', page: 'notifications' },
    { name: 'Messages', icon: EnvelopeIcon, active: activeNav === 'Messages', page: 'messages' },
    { name: 'Bookmarks', icon: BookmarkIcon, active: activeNav === 'Bookmarks', page: 'bookmarks' },
    { name: 'Communities', icon: UserGroupIcon, active: activeNav === 'Communities', page: 'communities' },
    { name: 'Profile', icon: UserIcon, active: activeNav === 'Profile', page: 'profile' },
  ]

  const handleNavClick = (item: any) => {
    setActiveNav(item.name)
    if (onNavigate) {
      onNavigate(item.page)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Logo size="md" />
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-2">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => handleNavClick(item)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    item.active
                      ? 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </motion.button>
              ))}
            </nav>
          </motion.div>

          {/* Right Side */}
          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Notifications */}
            <motion.button
              onClick={() => setShowNotifications(true)}
              className="relative p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <BellIcon className="w-5 h-5" />
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </motion.button>

            {/* Dark Mode Toggle */}
            <motion.button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.div
                animate={{ rotate: isDarkMode ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isDarkMode ? (
                  <SunIcon className="w-5 h-5" />
                ) : (
                  <MoonIcon className="w-5 h-5" />
                )}
              </motion.div>
            </motion.button>

            {/* Compose Button */}
            <motion.button
              onClick={onCompose}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-full font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <span className="flex items-center space-x-2">
                <span>Click</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                </svg>
              </span>
            </motion.button>

            {/* User Menu */}
            <div className="relative">
              <motion.button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={user?.avatar || '/default-avatar.png'}
                  alt={user?.displayName}
                  className="w-8 h-8 rounded-full ring-2 ring-green-500/20 hover:ring-green-500/40 transition-all duration-200"
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.displayName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    @{user?.username}
                  </p>
                </div>
              </motion.button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 py-2"
                >
                  <motion.button 
                    onClick={() => {
                      setShowUserMenu(false)
                      handleNavClick({ name: 'Profile', page: 'profile' })
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Profile</span>
                  </motion.button>
                  <motion.button 
                    onClick={() => {
                      setShowUserMenu(false)
                      handleNavClick({ name: 'Settings', page: 'settings' })
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <Cog6ToothIcon className="w-4 h-4" />
                    <span>Settings</span>
                  </motion.button>
                  <hr className="my-2 border-gray-200 dark:border-gray-700" />
                  <motion.button 
                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    whileHover={{ x: 4 }}
                  >
                    <span>Sign out</span>
                  </motion.button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Notifications Panel */}
      <NotificationsPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* Advanced Search Modal */}
      <AdvancedSearch
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        onSearch={(query, filters) => {
          console.log('Search:', query, 'Filters:', filters)
          setShowAdvancedSearch(false)
        }}
      />
    </header>
  )
}

