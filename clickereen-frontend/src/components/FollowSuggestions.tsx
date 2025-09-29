'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  UserPlusIcon,
  XMarkIcon,
  CheckIcon,
  UserGroupIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

interface SuggestedUser {
  id: string
  name: string
  username: string
  avatar: string
  bio: string
  location?: string
  occupation?: string
  education?: string
  followersCount: number
  followingCount: number
  mutualFollowers: number
  verified: boolean
  reason: 'mutual_friends' | 'similar_interests' | 'location' | 'popular' | 'trending'
  interests: string[]
}

interface FollowSuggestionsProps {
  className?: string
  onFollow?: (userId: string) => void
  onUnfollow?: (userId: string) => void
}

const mockSuggestions: SuggestedUser[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    username: 'sarah_creative',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'Digital artist & UI/UX designer. Creating beautiful experiences one pixel at a time ✨',
    location: 'San Francisco, CA',
    occupation: 'UI/UX Designer at TechCorp',
    education: 'Stanford University',
    followersCount: 125000,
    followingCount: 890,
    mutualFollowers: 12,
    verified: true,
    reason: 'mutual_friends',
    interests: ['Design', 'Art', 'Technology', 'Photography']
  },
  {
    id: '2',
    name: 'Alex Rodriguez',
    username: 'alex_tech',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'Full-stack developer passionate about open source and AI. Building the future with code 🚀',
    location: 'Austin, TX',
    occupation: 'Senior Developer at StartupXYZ',
    education: 'MIT',
    followersCount: 89000,
    followingCount: 1200,
    mutualFollowers: 8,
    verified: false,
    reason: 'similar_interests',
    interests: ['Programming', 'AI', 'Open Source', 'Startups']
  },
  {
    id: '3',
    name: 'Emma Wilson',
    username: 'emma_writer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'Award-winning journalist covering climate change and social justice. Truth seeker 📰',
    location: 'New York, NY',
    occupation: 'Senior Reporter at Global News',
    education: 'Columbia University',
    followersCount: 156000,
    followingCount: 2100,
    mutualFollowers: 5,
    verified: true,
    reason: 'popular',
    interests: ['Journalism', 'Climate', 'Social Justice', 'Writing']
  },
  {
    id: '4',
    name: 'Mike Johnson',
    username: 'mike_gamer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    bio: 'Professional gamer & content creator. Streaming the best games and building community 🎮',
    location: 'Los Angeles, CA',
    occupation: 'Content Creator & Streamer',
    education: 'UCLA',
    followersCount: 234000,
    followingCount: 450,
    mutualFollowers: 15,
    verified: true,
    reason: 'trending',
    interests: ['Gaming', 'Streaming', 'Esports', 'Entertainment']
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    username: 'lisa_artist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    bio: 'Contemporary artist exploring the intersection of technology and human emotion 🎨',
    location: 'Berlin, Germany',
    occupation: 'Independent Artist',
    education: 'Royal College of Art',
    followersCount: 67000,
    followingCount: 890,
    mutualFollowers: 3,
    verified: false,
    reason: 'location',
    interests: ['Art', 'Technology', 'Innovation', 'Culture']
  }
]

export function FollowSuggestions({ className = '', onFollow, onUnfollow }: FollowSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([])
  const [following, setFollowing] = useState<Set<string>>(new Set())
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Simulate loading suggestions
    const timer = setTimeout(() => {
      setSuggestions(mockSuggestions)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleFollow = (userId: string) => {
    setFollowing(prev => new Set([...prev, userId]))
    if (onFollow) {
      onFollow(userId)
    }
  }

  const handleUnfollow = (userId: string) => {
    setFollowing(prev => {
      const newSet = new Set(prev)
      newSet.delete(userId)
      return newSet
    })
    if (onUnfollow) {
      onUnfollow(userId)
    }
  }

  const handleDismiss = (userId: string) => {
    setDismissed(prev => new Set([...prev, userId]))
  }

  const getReasonText = (reason: string) => {
    switch (reason) {
      case 'mutual_friends':
        return 'Followed by people you know'
      case 'similar_interests':
        return 'Similar interests to you'
      case 'location':
        return 'In your area'
      case 'popular':
        return 'Popular in your network'
      case 'trending':
        return 'Trending now'
      default:
        return 'Suggested for you'
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

  const visibleSuggestions = suggestions.filter(suggestion => !dismissed.has(suggestion.id))

  if (visibleSuggestions.length === 0) {
    return null
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <UserGroupIcon className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Who to Follow</h2>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Discover interesting people and expand your network
        </p>
      </div>

      {/* Suggestions List */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {visibleSuggestions.map((user, index) => {
          const isFollowing = following.has(user.id)
          
          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-start space-x-3">
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {user.verified && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckIcon className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {user.name}
                    </h3>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      @{user.username}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {user.bio}
                  </p>

                  {/* Additional Info */}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {user.location && (
                      <div className="flex items-center space-x-1">
                        <MapPinIcon className="w-3 h-3" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    {user.occupation && (
                      <div className="flex items-center space-x-1">
                        <BriefcaseIcon className="w-3 h-3" />
                        <span>{user.occupation}</span>
                      </div>
                    )}
                    {user.education && (
                      <div className="flex items-center space-x-1">
                        <AcademicCapIcon className="w-3 h-3" />
                        <span>{user.education}</span>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span>{formatNumber(user.followersCount)} followers</span>
                    <span>{formatNumber(user.followingCount)} following</span>
                    {user.mutualFollowers > 0 && (
                      <span>{user.mutualFollowers} mutual followers</span>
                    )}
                  </div>

                  {/* Interests */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {user.interests.slice(0, 3).map((interest, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>

                  {/* Reason */}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {getReasonText(user.reason)}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <motion.button
                      onClick={() => isFollowing ? handleUnfollow(user.id) : handleFollow(user.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        isFollowing
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isFollowing ? (
                        <>
                          <CheckIcon className="w-4 h-4" />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <UserPlusIcon className="w-4 h-4" />
                          <span>Follow</span>
                        </>
                      )}
                    </motion.button>

                    <motion.button
                      onClick={() => handleDismiss(user.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
        <button className="w-full text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
          Show more suggestions
        </button>
      </div>
    </div>
  )
}
