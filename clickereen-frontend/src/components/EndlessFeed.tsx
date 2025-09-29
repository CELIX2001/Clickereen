'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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
import { generateMockPosts, MockPost } from '../utils/mockData'
import { CommentsModal } from './CommentsModal'
import { LoadingSpinner, LoadingCard } from './LoadingSpinner'
import { PostReactions } from './PostReactions'
import { ShareModal } from './ShareModal'

interface EndlessFeedProps {
  user: any
}

export function EndlessFeed({ user }: EndlessFeedProps) {
  const [posts, setPosts] = useState<MockPost[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [selectedPost, setSelectedPost] = useState<MockPost | null>(null)
  const [showMediaModal, setShowMediaModal] = useState(false)
  const [showCommentsModal, setShowCommentsModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)
  const observerRef = useRef<HTMLDivElement>(null)

  // Load initial posts
  useEffect(() => {
    loadPosts(1, true)
  }, [])

  // Load more posts
  const loadPosts = useCallback(async (pageNum: number, reset = false) => {
    if (loading) return
    
    setLoading(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Generate mock posts
    const newPosts = generateMockPosts(10)
    
    if (reset) {
      setPosts(newPosts)
    } else {
      setPosts(prev => [...prev, ...newPosts])
    }
    
    setHasMore(true) // Always has more in endless feed
    setLoading(false)
  }, [loading])

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage(prev => {
            const nextPage = prev + 1
            loadPosts(nextPage, false)
            return nextPage
          })
        }
      },
      { threshold: 0.1 }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, loading, loadPosts])

  // Handle like
  const handleLike = (postId: string) => {
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

  // Handle retweet
  const handleRetweet = (postId: string) => {
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

  // Handle bookmark
  const handleBookmark = (postId: string) => {
    setPosts(prev => prev.map(post =>
      post._id === postId
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ))
  }

  // Handle comment
  const handleComment = (post: MockPost) => {
    setSelectedPost(post)
    setShowCommentsModal(true)
  }

  // Handle share
  const handleShare = (post: MockPost) => {
    setSelectedPost(post)
    setShowShareModal(true)
  }

  // Handle reaction change
  const handleReactionChange = (postId: string, reaction: any) => {
    console.log(`Reaction changed for post ${postId}:`, reaction)
    // Implement actual reaction logic
  }

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const postDate = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return postDate.toLocaleDateString()
  }

  // Format numbers
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  // Render media
  const renderMedia = (media: MockPost['media']) => {
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
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Home Feed</h2>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <ChartBarIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <EllipsisHorizontalIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Discover amazing content from creators around the world
        </p>
      </div>

      {/* Posts */}
      <AnimatePresence>
        {posts.map((post, index) => (
          <motion.article
            key={post._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Post Header */}
            <div className="p-6 pb-4">
              <div className="flex items-start space-x-3">
                <img
                  src={post.author.avatar}
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
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formatNumber(post.author.followersCount)} followers
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
                  {/* Advanced Reactions */}
                  <PostReactions
                    postId={post._id}
                    onReactionChange={handleReactionChange}
                    initialReactions={[
                      { type: 'like', count: post.engagement.totalLikes, active: post.isLiked },
                      { type: 'love', count: Math.floor(post.engagement.totalLikes * 0.3), active: false },
                      { type: 'laugh', count: Math.floor(post.engagement.totalLikes * 0.2), active: false },
                      { type: 'fire', count: Math.floor(post.engagement.totalLikes * 0.1), active: false }
                    ]}
                  />

                  {/* Comment */}
                  <button 
                    onClick={() => handleComment(post)}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 transition-colors group"
                  >
                    <ChatBubbleLeftIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">
                      {formatNumber(post.engagement.totalComments)}
                    </span>
                  </button>

                  {/* Retweet */}
                  <button
                    onClick={() => handleRetweet(post._id)}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors group"
                  >
                    <ArrowPathIcon className={`w-5 h-5 group-hover:scale-110 transition-transform ${post.isRetweeted ? 'text-green-500' : ''}`} />
                    <span className="text-sm font-medium">
                      {formatNumber(post.engagement.totalRetweets)}
                    </span>
                  </button>

                  {/* Share */}
                  <button 
                    onClick={() => handleShare(post)}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-purple-500 transition-colors group"
                  >
                    <ShareIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </button>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Views */}
                  <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                    <EyeIcon className="w-4 h-4" />
                    <span className="text-sm">{formatNumber(post.engagement.totalViews)}</span>
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
        <div className="space-y-4">
          <div className="flex justify-center py-8">
            <div className="flex items-center space-x-2">
              <LoadingSpinner size="md" />
              <span className="text-gray-600 dark:text-gray-400">Loading more posts...</span>
            </div>
          </div>
          {/* Loading skeleton cards */}
          <div className="space-y-4">
            <LoadingCard />
            <LoadingCard />
          </div>
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

           {/* Comments Modal */}
           <CommentsModal
             post={selectedPost}
             isOpen={showCommentsModal}
             onClose={() => setShowCommentsModal(false)}
             currentUser={user}
           />

           {/* Share Modal */}
           {showShareModal && selectedPost && (
             <ShareModal 
               post={{
                 id: selectedPost._id,
                 content: selectedPost.content,
                 author: {
                   name: selectedPost.author.displayName,
                   username: selectedPost.author.username,
                   avatar: selectedPost.author.avatar
                 },
                 media: selectedPost.media?.[0] ? {
                   type: selectedPost.media[0].type,
                   url: selectedPost.media[0].url
                 } : undefined
               }}
               isOpen={showShareModal}
               onClose={() => setShowShareModal(false)}
               onShare={(method, message) => {
                 console.log(`Sharing via ${method}:`, message)
               }}
             />
           )}
         </div>
       )
     }
