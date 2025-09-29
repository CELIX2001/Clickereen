'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  UserGroupIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  UsersIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,
  GlobeAltIcon,
  LockClosedIcon,
  FireIcon,
  TrendingUpIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

interface Community {
  id: string
  name: string
  description: string
  avatar: string
  coverImage?: string
  members: number
  posts: number
  category: string
  isPrivate: boolean
  isJoined: boolean
  isVerified: boolean
  trending: boolean
  tags: string[]
  recentActivity: string
  rules: string[]
  moderators: Array<{
    name: string
    username: string
    avatar: string
  }>
}

export function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const categories = [
    { id: 'all', name: 'All Communities' },
    { id: 'technology', name: 'Technology' },
    { id: 'design', name: 'Design' },
    { id: 'business', name: 'Business' },
    { id: 'lifestyle', name: 'Lifestyle' },
    { id: 'education', name: 'Education' },
    { id: 'entertainment', name: 'Entertainment' }
  ]

  // Mock data
  useEffect(() => {
    const mockCommunities: Community[] = [
      {
        id: '1',
        name: 'React Developers',
        description: 'A community for React developers to share knowledge, ask questions, and collaborate on projects.',
        avatar: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=150&h=150&fit=crop&crop=face',
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=300&fit=crop',
        members: 12500,
        posts: 8900,
        category: 'technology',
        isPrivate: false,
        isJoined: true,
        isVerified: true,
        trending: true,
        tags: ['React', 'JavaScript', 'Frontend', 'Web Development'],
        recentActivity: '2 hours ago',
        rules: [
          'Be respectful and constructive',
          'Share relevant content only',
          'No spam or self-promotion',
          'Use appropriate tags'
        ],
        moderators: [
          { name: 'Sarah Chen', username: 'sarah_dev', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' },
          { name: 'Alex Rodriguez', username: 'alex_codes', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' }
        ]
      },
      {
        id: '2',
        name: 'UI/UX Designers',
        description: 'Connect with fellow designers, share your work, get feedback, and stay updated with the latest design trends.',
        avatar: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=150&h=150&fit=crop&crop=face',
        coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=300&fit=crop',
        members: 8900,
        posts: 5600,
        category: 'design',
        isPrivate: false,
        isJoined: false,
        isVerified: true,
        trending: false,
        tags: ['UI', 'UX', 'Design', 'Figma', 'Adobe'],
        recentActivity: '4 hours ago',
        rules: [
          'Showcase your best work',
          'Provide constructive feedback',
          'Respect intellectual property',
          'Use descriptive titles'
        ],
        moderators: [
          { name: 'Maria Garcia', username: 'maria_design', avatar: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4cf687?w=150&h=150&fit=crop&crop=face' }
        ]
      },
      {
        id: '3',
        name: 'Startup Founders',
        description: 'Exclusive community for startup founders to share experiences, seek advice, and network with fellow entrepreneurs.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        coverImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=300&fit=crop',
        members: 3400,
        posts: 2100,
        category: 'business',
        isPrivate: true,
        isJoined: true,
        isVerified: true,
        trending: false,
        tags: ['Startup', 'Entrepreneurship', 'Funding', 'Business'],
        recentActivity: '1 day ago',
        rules: [
          'Confidentiality is key',
          'Share real experiences',
          'No competitor bashing',
          'Help fellow founders'
        ],
        moderators: [
          { name: 'David Kim', username: 'david_startup', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face' }
        ]
      },
      {
        id: '4',
        name: 'Web3 & Blockchain',
        description: 'Exploring the future of the internet with blockchain technology, DeFi, NFTs, and decentralized applications.',
        avatar: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=150&h=150&fit=crop&crop=face',
        coverImage: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=300&fit=crop',
        members: 15600,
        posts: 12300,
        category: 'technology',
        isPrivate: false,
        isJoined: false,
        isVerified: true,
        trending: true,
        tags: ['Web3', 'Blockchain', 'DeFi', 'NFT', 'Crypto'],
        recentActivity: '30 minutes ago',
        rules: [
          'Stay updated with latest trends',
          'Share valuable insights',
          'No financial advice',
          'Respect different opinions'
        ],
        moderators: [
          { name: 'Elena Petrov', username: 'elena_web3', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' }
        ]
      }
    ]

    setCommunities(mockCommunities)
  }, [])

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         community.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         community.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'all' || community.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const handleJoinCommunity = (communityId: string) => {
    setCommunities(prev => prev.map(community => 
      community.id === communityId 
        ? { ...community, isJoined: !community.isJoined, members: community.isJoined ? community.members - 1 : community.members + 1 }
        : community
    ))
  }

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <UserGroupIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Communities</h1>
              <p className="text-gray-600 dark:text-gray-400">Discover and join communities that interest you</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Create Community</span>
          </button>
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
              placeholder="Search communities..."
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Communities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCommunities.map((community, index) => (
          <motion.div
            key={community.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Cover Image */}
            {community.coverImage && (
              <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                <img
                  src={community.coverImage}
                  alt={community.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
                {community.trending && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                    <FireIcon className="w-3 h-3" />
                    <span>Trending</span>
                  </div>
                )}
              </div>
            )}

            <div className="p-6">
              {/* Community Header */}
              <div className="flex items-start space-x-3 mb-4">
                <img
                  src={community.avatar}
                  alt={community.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-800 -mt-6"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-bold text-gray-900 dark:text-white">{community.name}</h3>
                    {community.isVerified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                    {community.isPrivate && (
                      <LockClosedIcon className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {community.description}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <UsersIcon className="w-4 h-4" />
                    <span>{community.members.toLocaleString()}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <ChatBubbleLeftIcon className="w-4 h-4" />
                    <span>{community.posts.toLocaleString()}</span>
                  </span>
                </div>
                <span className="text-xs">{community.recentActivity}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {community.tags.slice(0, 3).map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
                {community.tags.length > 3 && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                    +{community.tags.length - 3}
                  </span>
                )}
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleJoinCommunity(community.id)}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                  community.isJoined
                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {community.isJoined ? 'Joined' : 'Join Community'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCommunities.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserGroupIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No communities found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery ? 'Try adjusting your search terms' : 'Create a new community to get started'}
          </p>
        </div>
      )}
    </div>
  )
}
