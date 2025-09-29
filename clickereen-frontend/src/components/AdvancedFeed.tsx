'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HeartIcon, 
  ChatBubbleLeftIcon, 
  ArrowPathIcon, 
  ShareIcon,
  BookmarkIcon,
  EllipsisHorizontalIcon,
  PlayIcon,
  SpeakerWaveIcon,
  EyeIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { 
  HeartIcon as HeartSolidIcon,
  BookmarkIcon as BookmarkSolidIcon
} from '@heroicons/react/24/solid'

interface Post {
  _id: string
  author: {
    _id: string
    username: string
    displayName: string
    avatar: string
    verified: boolean
  }
  content: string
  media: Array<{
    type: 'image' | 'video' | 'audio' | 'gif'
    url: string
    thumbnail?: string
    duration?: number
  }>
  engagement: {
    totalLikes: number
    totalComments: number
    totalRetweets: number
    totalViews: number
  }
  hashtags: string[]
  mentions: string[]
  createdAt: string
  isLiked?: boolean
  isRetweeted?: boolean
  isBookmarked?: boolean
}

interface AdvancedFeedProps {
  user: any
}

export function AdvancedFeed({ user }: AdvancedFeedProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [showMediaModal, setShowMediaModal] = useState(false)
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)
  const observerRef = useRef<HTMLDivElement>(null)

  // Load posts
  const loadPosts = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/posts/feed?page=${pageNum}&limit=10`)
      const data = await response.json()
      
      if (reset) {
        setPosts(data.posts)
      } else {
        setPosts(prev => [...prev, ...data.posts])
      }
      
      setHasMore(data.posts.length === 10)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => prev + 1)
        }
      },
      { threshold: 0.1 }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, loading])

  // Load more posts when page changes
  useEffect(() => {
    if (page > 1) {
      loadPosts(page, false)
    }
  }, [page])

  // Initial load
  useEffect(() => {
    loadPosts(1, true)
  }, [])

  // Handle like
  const handleLike = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('clickereen_token')}`
        }
      })
      
      if (response.ok) {
        setPosts(prev => prev.map(post => 
          post._id === postId 
            ? {
                ...post,
                isLiked: !post.isLiked,
                engagement: {
                  ...post.engagement,
                  totalLikes: post.isLiked 
                    ? post.engagement.totalLikes - 1 
                    : post.engagement.totalLikes + 1
                }
              }
            : post
        ))
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  // Handle retweet
  const handleRetweet = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/retweet`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('clickereen_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: '' })
      })
      
      if (response.ok) {
        setPosts(prev => prev.map(post => 
          post._id === postId 
            ? {
                ...post,
                isRetweeted: !post.isRetweeted,
                engagement: {
                  ...post.engagement,
                  totalRetweets: post.isRetweeted 
                    ? post.engagement.totalRetweets - 1 
                    : post.engagement.totalRetweets + 1
                }
              }
            : post
        ))
      }
    } catch (error) {
      console.error('Error retweeting post:', error)
    }
  }

  // Handle bookmark
  const handleBookmark = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/bookmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('clickereen_token')}`
        }
      })
      
      if (response.ok) {
        setPosts(prev => prev.map(post => 
          post._id === postId 
            ? { ...post, isBookmarked: !post.isBookmarked }
            : post
        ))
      }
    } catch (error) {
      console.error('Error bookmarking post:', error)
    }
  }

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const postDate = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d`
    return postDate.toLocaleDateString()
  }

  // Render media
  const renderMedia = (media: Post['media']) => {
    if (!media || media.length === 0) return null

    return (
      <div className="mt-3 rounded-xl overflow-hidden">
        {media.map((item, index) => (
          <div key={index} className="relative group">
            {item.type === 'image' && (
              <img
                src={item.url}
                alt="Post media"
                className="w-full h-auto max-h-96 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => {
                  setSelectedPost(posts.find(p => p.media.includes(item)) || null)
                  setShowMediaModal(true)
                }}
              />
            )}
            {item.type === 'video' && (
              <div className="relative">
                <video
                  src={item.url}
                  poster={item.thumbnail}
                  className="w-full h-auto max-h-96 object-cover cursor-pointer"
                  controls
                  onPlay={() => setPlayingVideo(item.url)}
                  onPause={() => setPlayingVideo(null)}
                />
                {!playingVideo && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <PlayIcon className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>
            )}
            {item.type === 'audio' && (
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <SpeakerWaveIcon className="w-8 h-8 text-green-500" />
                  <div className="flex-1">
                    <audio src={item.url} controls className="w-full" />
                  </div>
                </div>
              </div>
            )}
            {item.type === 'gif' && (
              <img
                src={item.url}
                alt="GIF"
                className="w-full h-auto max-h-96 object-cover"
              />
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Feed Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Home</h2>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <ChartBarIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <EllipsisHorizontalIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Posts */}
      <AnimatePresence>
        {posts.map((post, index) => (
          <motion.article
            key={post._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Post Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start space-x-3">
                <img
                  src={post.author.avatar || '/default-avatar.png'}
                  alt={post.author.displayName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {post.author.displayName}
                    </h3>
                    {post.author.verified && (
                      <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    )}
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      @{post.author.username}
                    </span>
                    <span className="text-gray-400 dark:text-gray-500">·</span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      {formatTimeAgo(post.createdAt)}
                    </span>
                  </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <EllipsisHorizontalIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Post Content */}
            <div className="px-6 pb-4">
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>

              {/* Hashtags and Mentions */}
              {(post.hashtags.length > 0 || post.mentions.length > 0) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.hashtags.map((hashtag, index) => (
                    <span
                      key={index}
                      className="text-green-600 dark:text-green-400 hover:underline cursor-pointer"
                    >
                      #{hashtag}
                    </span>
                  ))}
                  {post.mentions.map((mention, index) => (
                    <span
                      key={index}
                      className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      @{mention}
                    </span>
                  ))}
                </div>
              )}

              {/* Media */}
              {renderMedia(post.media)}
            </div>

            {/* Post Actions */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  {/* Like */}
                  <button
                    onClick={() => handleLike(post._id)}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors group"
                  >
                    {post.isLiked ? (
                      <HeartSolidIcon className="w-5 h-5 text-red-500" />
                    ) : (
                      <HeartIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    )}
                    <span className="text-sm font-medium">
                      {post.engagement.totalLikes}
                    </span>
                  </button>

                  {/* Comment */}
                  <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors group">
                    <ChatBubbleLeftIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">
                      {post.engagement.totalComments}
                    </span>
                  </button>

                  {/* Retweet */}
                  <button
                    onClick={() => handleRetweet(post._id)}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors group"
                  >
                    <ArrowPathIcon className={`w-5 h-5 group-hover:scale-110 transition-transform ${post.isRetweeted ? 'text-green-500' : ''}`} />
                    <span className="text-sm font-medium">
                      {post.engagement.totalRetweets}
                    </span>
                  </button>

                  {/* Share */}
                  <button className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-purple-500 transition-colors group">
                    <ShareIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Views */}
                  <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                    <EyeIcon className="w-4 h-4" />
                    <span className="text-sm">{post.engagement.totalViews}</span>
                  </div>

                  {/* Bookmark */}
                  <button
                    onClick={() => handleBookmark(post._id)}
                    className="text-gray-600 dark:text-gray-400 hover:text-yellow-500 transition-colors"
                  >
                    {post.isBookmarked ? (
                      <BookmarkSolidIcon className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <BookmarkIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </AnimatePresence>

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      <div ref={observerRef} className="h-4" />

      {/* Media Modal */}
      {showMediaModal && selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="max-w-4xl max-h-full p-4">
            <button
              onClick={() => setShowMediaModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {renderMedia(selectedPost.media)}
          </div>
        </div>
      )}
    </div>
  )
}








