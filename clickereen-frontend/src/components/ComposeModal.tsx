'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon,
  PhotoIcon,
  VideoCameraIcon,
  FaceSmileIcon,
  MapPinIcon,
  ListBulletIcon
} from '@heroicons/react/24/outline'

interface ComposeModalProps {
  isOpen: boolean
  onClose: () => void
  user: any
}

export function ComposeModal({ isOpen, onClose, user }: ComposeModalProps) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)
    
    // Simulate posting
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setContent('')
    setIsSubmitting(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Create Post
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <XMarkIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-4">
            <div className="flex space-x-3">
              <img
                src={user?.avatar || '/default-avatar.png'}
                alt={user?.displayName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's happening?"
                  className="w-full h-32 resize-none border-none outline-none text-gray-900 dark:text-white bg-transparent placeholder-gray-500 dark:placeholder-gray-400"
                  maxLength={280}
                />
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <PhotoIcon className="w-5 h-5 text-green-500" />
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <VideoCameraIcon className="w-5 h-5 text-green-500" />
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <FaceSmileIcon className="w-5 h-5 text-green-500" />
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <MapPinIcon className="w-5 h-5 text-green-500" />
                    </button>
                    <button
                      type="button"
                      className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <ListBulletIcon className="w-5 h-5 text-green-500" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {content.length}/280
                    </span>
                    <button
                      type="submit"
                      disabled={!content.trim() || isSubmitting}
                      className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
                    >
                      {isSubmitting ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}







