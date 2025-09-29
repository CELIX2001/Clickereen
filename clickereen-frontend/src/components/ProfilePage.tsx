'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  UserIcon,
  PencilIcon,
  ShareIcon,
  EllipsisHorizontalIcon,
  CalendarIcon,
  MapPinIcon,
  LinkIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ArrowPathIcon,
  EyeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  BellIcon,
  BookmarkIcon,
  UserGroupIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid'

interface UserProfile {
  id: string
  name: string
  username: string
  email: string
  avatar: string
  coverImage?: string
  bio: string
  location: string
  website: string
  joinDate: string
  verified: boolean
  followersCount: number
  followingCount: number
  postsCount: number
  likesCount: number
  isFollowing: boolean
  isBlocked: boolean
}

interface UserPost {
  id: string
  content: string
  timestamp: string
  likes: number
  comments: number
  shares: number
  views: number
  media?: {
    type: 'image' | 'video'
    url: string
  }
}

export function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [posts, setPosts] = useState<UserPost[]>([])
  const [activeTab, setActiveTab] = useState('posts')
  const [showEditModal, setShowEditModal] = useState(false)

  const tabs = [
    { id: 'posts', name: 'Posts', count: 0, icon: DocumentTextIcon },
    { id: 'media', name: 'Media', count: 0, icon: PhotoIcon },
    { id: 'likes', name: 'Likes', count: 0, icon: HeartIcon },
    { id: 'bookmarks', name: 'Bookmarks', count: 0, icon: BookmarkIcon }
  ]

  // Mock data
  useEffect(() => {
    const mockProfile: UserProfile = {
      id: '1',
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=300&fit=crop',
      bio: 'Full-stack developer passionate about creating amazing user experiences. Love working with React, Node.js, and modern web technologies. Always learning and sharing knowledge with the community! 🚀',
      location: 'San Francisco, CA',
      website: 'https://johndoe.dev',
      joinDate: 'January 2023',
      verified: true,
      followersCount: 1250,
      followingCount: 340,
      postsCount: 89,
      likesCount: 5670,
      isFollowing: false,
      isBlocked: false
    }

    const mockPosts: UserPost[] = [
      {
        id: '1',
        content: 'Just shipped a new feature for our app! The real-time collaboration is working perfectly. Thanks to the amazing team for making this possible. #WebDev #TeamWork #Innovation',
        timestamp: '2 hours ago',
        likes: 45,
        comments: 12,
        shares: 8,
        views: 234,
        media: {
          type: 'image',
          url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop'
        }
      },
      {
        id: '2',
        content: 'Learning something new every day! Today I discovered this amazing CSS technique for creating glassmorphism effects. The possibilities are endless! #CSS #Learning #WebDesign',
        timestamp: '1 day ago',
        likes: 78,
        comments: 23,
        shares: 15,
        views: 456
      },
      {
        id: '3',
        content: 'Excited to be speaking at the upcoming React conference! Will be sharing insights about performance optimization and best practices. See you there! #React #Conference #Speaking',
        timestamp: '3 days ago',
        likes: 156,
        comments: 34,
        shares: 28,
        views: 789
      }
    ]

    setProfile(mockProfile)
    setPosts(mockPosts)
    
    // Update tab counts
    tabs[0].count = mockPosts.length
    tabs[1].count = mockPosts.filter(post => post.media).length
    tabs[2].count = mockProfile.likesCount
    tabs[3].count = 12 // Mock bookmarks count
  }, [])

  const handleFollow = () => {
    if (!profile) return
    setProfile(prev => prev ? {
      ...prev,
      isFollowing: !prev.isFollowing,
      followersCount: prev.isFollowing ? prev.followersCount - 1 : prev.followersCount + 1
    } : null)
  }

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ))
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {profile && (
        <>
          {/* Cover Image */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-4 overflow-hidden">
            {profile.coverImage && (
              <img
                src={profile.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Profile Header */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 -mt-12"
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name}</h1>
                  {profile.verified && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">@{profile.username}</p>
                <p className="text-gray-800 dark:text-gray-200 mb-4">{profile.bio}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {profile.location && (
                    <div className="flex items-center space-x-1">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-center space-x-1">
                      <LinkIcon className="w-4 h-4" />
                      <a href={profile.website} className="text-green-500 hover:text-green-600">
                        {profile.website.replace('https://', '')}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Joined {profile.joinDate}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold text-gray-900 dark:text-white">{profile.followingCount}</span>
                    <span className="text-gray-500 dark:text-gray-400">Following</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold text-gray-900 dark:text-white">{profile.followersCount}</span>
                    <span className="text-gray-500 dark:text-gray-400">Followers</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold text-gray-900 dark:text-white">{profile.postsCount}</span>
                    <span className="text-gray-500 dark:text-gray-400">Posts</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleFollow}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    profile.isFollowing
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                  }`}
                >
                  {profile.isFollowing ? 'Following' : 'Follow'}
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <ShareIcon className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <EllipsisHorizontalIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-green-600 border-b-2 border-green-600 dark:text-green-400 dark:border-green-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                  <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {activeTab === 'posts' && (
              <div className="space-y-6">
                {posts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <img
                        src={profile.avatar}
                        alt={profile.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-gray-900 dark:text-white">{profile.name}</span>
                          {profile.verified && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                          <span className="text-gray-500 dark:text-gray-400 text-sm">@{profile.username}</span>
                        </div>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">{post.timestamp}</span>
                      </div>
                    </div>

                    <p className="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed">{post.content}</p>

                    {post.media && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img
                          src={post.media.url}
                          alt="Post media"
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-6">
                        <button
                          onClick={() => handleLike(post.id)}
                          className="flex items-center space-x-1 hover:text-red-500 cursor-pointer"
                        >
                          <HeartIcon className="w-4 h-4" />
                          <span>{post.likes}</span>
                        </button>
                        <span className="flex items-center space-x-1">
                          <ChatBubbleLeftIcon className="w-4 h-4" />
                          <span>{post.comments}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <ArrowPathIcon className="w-4 h-4" />
                          <span>{post.shares}</span>
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <EyeIcon className="w-4 h-4" />
                          <span>{post.views}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <ChartBarIcon className="w-4 h-4" />
                          <span>Engagement</span>
                        </span>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}

            {activeTab === 'media' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.filter(post => post.media).map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700"
                  >
                    <img
                      src={post.media?.url}
                      alt="Post media"
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{post.content}</p>
                      <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{post.timestamp}</span>
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center space-x-1">
                            <HeartIcon className="w-3 h-3" />
                            <span>{post.likes}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <ChatBubbleLeftIcon className="w-3 h-3" />
                            <span>{post.comments}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'likes' && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HeartSolidIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Liked Posts</h3>
                <p className="text-gray-500 dark:text-gray-400">Posts you've liked will appear here</p>
              </div>
            )}

            {activeTab === 'bookmarks' && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookmarkSolidIcon className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Bookmarked Posts</h3>
                <p className="text-gray-500 dark:text-gray-400">Posts you've bookmarked will appear here</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
