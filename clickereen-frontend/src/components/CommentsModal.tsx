'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  XMarkIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ArrowPathIcon,
  ShareIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline'
import {
  HeartIcon as HeartSolidIcon
} from '@heroicons/react/24/solid'

interface Comment {
  id: string
  user: {
    name: string
    username: string
    avatar: string
    verified: boolean
  }
  content: string
  timestamp: string
  likes: number
  isLiked: boolean
  replies?: Comment[]
}

interface Post {
  id: string
  author: {
    name: string
    username: string
    avatar: string
    verified: boolean
  }
  content: string
  timestamp: string
  likes: number
  comments: number
  retweets: number
  shares: number
  isLiked: boolean
  isRetweeted: boolean
  media?: Array<{
    type: string
    url: string
  }>
}

interface CommentsModalProps {
  post: Post | null
  isOpen: boolean
  onClose: () => void
  currentUser: any
}

export function CommentsModal({ post, isOpen, onClose, currentUser }: CommentsModalProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Generate mock comments
  useEffect(() => {
    if (post) {
      const mockComments: Comment[] = [
        {
          id: '1',
          user: {
            name: 'Sarah Chen',
            username: 'sarah_creative',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
            verified: true
          },
          content: 'This is absolutely amazing! The colors are so vibrant. Where was this taken?',
          timestamp: '2h ago',
          likes: 12,
          isLiked: false,
          replies: [
            {
              id: '1-1',
              user: {
                name: 'Mike Rodriguez',
                username: 'mike_gamer',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
                verified: false
              },
              content: 'I was wondering the same thing! The lighting is perfect.',
              timestamp: '1h ago',
              likes: 3,
              isLiked: true
            }
          ]
        },
        {
          id: '2',
          user: {
            name: 'Alex Johnson',
            username: 'alex_tech',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
            verified: true
          },
          content: 'Incredible work! The composition is spot on. What camera did you use?',
          timestamp: '3h ago',
          likes: 8,
          isLiked: false
        },
        {
          id: '3',
          user: {
            name: 'Emma Wilson',
            username: 'emma_designer',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
            verified: false
          },
          content: 'Love the mood in this shot! The way the light hits the water is magical ✨',
          timestamp: '4h ago',
          likes: 15,
          isLiked: true
        }
      ]
      setComments(mockComments)
    }
  }, [post])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || isSubmitting) return

    setIsSubmitting(true)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const comment: Comment = {
      id: Date.now().toString(),
      user: {
        name: currentUser?.displayName || 'You',
        username: currentUser?.username || 'you',
        avatar: currentUser?.avatar || '/default-avatar.png',
        verified: currentUser?.verified || false
      },
      content: newComment,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false
    }

    setComments(prev => [comment, ...prev])
    setNewComment('')
    setIsSubmitting(false)
  }

  const handleLikeComment = (commentId: string) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId
        ? {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1
          }
        : comment
    ))
  }

  const formatTimeAgo = (timestamp: string) => {
    return timestamp
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  if (!post) return null

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
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-4 md:inset-8 lg:inset-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 flex flex-col"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 p-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Comments ({comments.length})
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Post Preview */}
            <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-start space-x-3">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {post.author.name}
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
                      {post.timestamp}
                    </span>
                  </div>
                  <p className="text-gray-900 dark:text-white mt-1">
                    {post.content}
                  </p>
                  
                  {/* Post Actions */}
                  <div className="flex items-center space-x-6 mt-3">
                    <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                      <HeartIcon className="w-4 h-4" />
                      <span className="text-sm">{formatNumber(post.likes)}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                      <ChatBubbleLeftIcon className="w-4 h-4" />
                      <span className="text-sm">{formatNumber(post.comments)}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                      <ArrowPathIcon className="w-4 h-4" />
                      <span className="text-sm">{formatNumber(post.retweets)}</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                      <ShareIcon className="w-4 h-4" />
                      <span className="text-sm">{formatNumber(post.shares)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto">
              {comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                  <ChatBubbleLeftIcon className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No comments yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Be the first to comment on this post!
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {comments.map((comment, index) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-200/50 dark:border-gray-700/50 pb-4 last:border-b-0"
                    >
                      <div className="flex items-start space-x-3">
                        <img
                          src={comment.user.avatar}
                          alt={comment.user.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                              {comment.user.name}
                            </h4>
                            {comment.user.verified && (
                              <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                              </svg>
                            )}
                            <span className="text-gray-500 dark:text-gray-400 text-xs">
                              @{comment.user.username}
                            </span>
                            <span className="text-gray-400 dark:text-gray-500 text-xs">·</span>
                            <span className="text-gray-500 dark:text-gray-400 text-xs">
                              {comment.timestamp}
                            </span>
                          </div>
                          <p className="text-gray-900 dark:text-white text-sm mt-1">
                            {comment.content}
                          </p>
                          
                          {/* Comment Actions */}
                          <div className="flex items-center space-x-4 mt-2">
                            <button
                              onClick={() => handleLikeComment(comment.id)}
                              className={`flex items-center space-x-1 text-xs transition-colors ${
                                comment.isLiked
                                  ? 'text-red-500'
                                  : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
                              }`}
                            >
                              {comment.isLiked ? (
                                <HeartSolidIcon className="w-3 h-3" />
                              ) : (
                                <HeartIcon className="w-3 h-3" />
                              )}
                              <span>{formatNumber(comment.likes)}</span>
                            </button>
                            <button className="text-gray-500 dark:text-gray-400 hover:text-blue-500 text-xs transition-colors">
                              Reply
                            </button>
                            <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 text-xs transition-colors">
                              <EllipsisHorizontalIcon className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Replies */}
                          {comment.replies && comment.replies.length > 0 && (
                            <div className="mt-3 ml-4 space-y-3">
                              {comment.replies.map((reply) => (
                                <div key={reply.id} className="flex items-start space-x-3">
                                  <img
                                    src={reply.user.avatar}
                                    alt={reply.user.name}
                                    className="w-6 h-6 rounded-full object-cover"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-2">
                                      <h5 className="font-medium text-gray-900 dark:text-white text-xs">
                                        {reply.user.name}
                                      </h5>
                                      {reply.user.verified && (
                                        <svg className="w-2 h-2 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                      )}
                                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                                        @{reply.user.username}
                                      </span>
                                      <span className="text-gray-400 dark:text-gray-500 text-xs">·</span>
                                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                                        {reply.timestamp}
                                      </span>
                                    </div>
                                    <p className="text-gray-700 dark:text-gray-300 text-xs mt-1">
                                      {reply.content}
                                    </p>
                                    <div className="flex items-center space-x-3 mt-1">
                                      <button
                                        onClick={() => handleLikeComment(reply.id)}
                                        className={`flex items-center space-x-1 text-xs transition-colors ${
                                          reply.isLiked
                                            ? 'text-red-500'
                                            : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
                                        }`}
                                      >
                                        {reply.isLiked ? (
                                          <HeartSolidIcon className="w-3 h-3" />
                                        ) : (
                                          <HeartIcon className="w-3 h-3" />
                                        )}
                                        <span>{formatNumber(reply.likes)}</span>
                                      </button>
                                      <button className="text-gray-500 dark:text-gray-400 hover:text-blue-500 text-xs transition-colors">
                                        Reply
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Comment Form */}
            <div className="sticky bottom-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-700/50 p-4 rounded-b-2xl">
              <form onSubmit={handleSubmitComment} className="flex items-end space-x-3">
                <img
                  src={currentUser?.avatar || '/default-avatar.png'}
                  alt="Your avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    rows={2}
                    disabled={isSubmitting}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!newComment.trim() || isSubmitting}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Posting...' : 'Post'}
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}







