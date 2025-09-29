'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  XMarkIcon,
  ShareIcon,
  LinkIcon,
  ChatBubbleLeftIcon,
  EnvelopeIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  UserGroupIcon,
  GlobeAltIcon,
  LockClosedIcon
} from '@heroicons/react/24/outline'

interface ShareOption {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  description: string
}

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  post: {
    id: string
    content: string
    author: {
      name: string
      username: string
      avatar: string
    }
    media?: {
      type: 'image' | 'video'
      url: string
    }
  }
  onShare?: (method: string, message: string) => void
}

const shareOptions: ShareOption[] = [
  {
    id: 'repost',
    name: 'Repost',
    icon: ShareIcon,
    color: 'text-green-500',
    description: 'Share with your followers'
  },
  {
    id: 'quote',
    name: 'Quote Post',
    icon: ChatBubbleLeftIcon,
    color: 'text-blue-500',
    description: 'Add your own comment'
  },
  {
    id: 'message',
    name: 'Send Message',
    icon: EnvelopeIcon,
    color: 'text-purple-500',
    description: 'Share via direct message'
  },
  {
    id: 'copy',
    name: 'Copy Link',
    icon: LinkIcon,
    color: 'text-gray-500',
    description: 'Copy link to clipboard'
  }
]

const privacyOptions = [
  { id: 'public', name: 'Public', icon: GlobeAltIcon, description: 'Anyone can see this' },
  { id: 'followers', name: 'Followers', icon: UserGroupIcon, description: 'Only your followers' },
  { id: 'private', name: 'Private', icon: LockClosedIcon, description: 'Only you can see this' }
]

export function ShareModal({ isOpen, onClose, post, onShare }: ShareModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [message, setMessage] = useState('')
  const [privacy, setPrivacy] = useState('public')
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    if (selectedMethod === 'copy') {
      const url = `${window.location.origin}/post/${post.id}`
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } else if (onShare) {
      onShare(selectedMethod, message)
    }
    onClose()
  }

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId)
    if (methodId === 'copy') {
      handleShare()
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Share Post</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Post Preview */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start space-x-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1">
                <span className="font-semibold text-gray-900 dark:text-white">{post.author.name}</span>
                <span className="text-gray-500 dark:text-gray-400">@{post.author.username}</span>
              </div>
              <p className="text-gray-800 dark:text-gray-200 text-sm mt-1 line-clamp-2">
                {post.content}
              </p>
              {post.media && (
                <div className="mt-2 rounded-lg overflow-hidden">
                  {post.media.type === 'image' && (
                    <img
                      src={post.media.url}
                      alt="Post media"
                      className="w-full h-32 object-cover"
                    />
                  )}
                  {post.media.type === 'video' && (
                    <video
                      src={post.media.url}
                      className="w-full h-32 object-cover"
                      muted
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Share Options */}
        <div className="p-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Share Options</h3>
          <div className="space-y-2">
            {shareOptions.map((option) => {
              const Icon = option.icon
              return (
                <motion.button
                  key={option.id}
                  onClick={() => handleMethodSelect(option.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
                    selectedMethod === option.id
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className={`w-5 h-5 ${option.color}`} />
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900 dark:text-white">{option.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{option.description}</div>
                  </div>
                  {option.id === 'copy' && copied && (
                    <CheckIcon className="w-5 h-5 text-green-500" />
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Message Input (for repost and quote) */}
        {(selectedMethod === 'repost' || selectedMethod === 'quote') && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {selectedMethod === 'quote' ? 'Add your comment' : 'Add a message (optional)'}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={selectedMethod === 'quote' ? 'What are your thoughts?' : 'Add a message...'}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
              rows={3}
            />
          </div>
        )}

        {/* Privacy Settings (for repost and quote) */}
        {(selectedMethod === 'repost' || selectedMethod === 'quote') && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Privacy
            </label>
            <div className="space-y-2">
              {privacyOptions.map((option) => {
                const Icon = option.icon
                return (
                  <label
                    key={option.id}
                    className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                      privacy === option.id
                        ? 'bg-green-50 dark:bg-green-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="privacy"
                      value={option.id}
                      checked={privacy === option.id}
                      onChange={(e) => setPrivacy(e.target.value)}
                      className="text-green-500 focus:ring-green-500"
                    />
                    <Icon className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{option.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{option.description}</div>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {(selectedMethod === 'repost' || selectedMethod === 'quote') && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleShare}
                className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                {selectedMethod === 'quote' ? 'Quote Post' : 'Repost'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
