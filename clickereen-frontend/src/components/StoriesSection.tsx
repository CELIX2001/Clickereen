'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PlayIcon, 
  PauseIcon, 
  XMarkIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface Story {
  id: string
  user: {
    name: string
    username: string
    avatar: string
    verified: boolean
  }
  media: {
    type: 'image' | 'video'
    url: string
    duration?: number
  }
  timestamp: string
  views: number
  likes: number
  comments: number
  isLiked: boolean
}

interface StoriesSectionProps {
  stories: Story[]
}

export function StoriesSection({ stories }: StoriesSectionProps) {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [progress, setProgress] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressInterval = useRef<NodeJS.Timeout | null>(null)

  const handleStoryClick = (story: Story, index: number) => {
    setSelectedStory(story)
    setCurrentStoryIndex(index)
    setIsPlaying(true)
    setProgress(0)
  }

  const closeStory = () => {
    setSelectedStory(null)
    setIsPlaying(false)
    setProgress(0)
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
    }
  }

  const nextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1)
      setProgress(0)
    } else {
      closeStory()
    }
  }

  const previousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1)
      setProgress(0)
    }
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
    if (selectedStory?.media.type === 'video' && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  // Progress animation
  useEffect(() => {
    if (selectedStory && isPlaying) {
      const duration = selectedStory.media.duration || 5000
      const interval = 50
      const increment = (interval / duration) * 100

      progressInterval.current = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            nextStory()
            return 0
          }
          return prev + increment
        })
      }, interval)

      return () => {
        if (progressInterval.current) {
          clearInterval(progressInterval.current)
        }
      }
    }
  }, [selectedStory, isPlaying, currentStoryIndex])

  return (
    <>
      {/* Stories Horizontal Scroll */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
          {/* Add Story Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0 cursor-pointer"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-lg">
              <PlusIcon className="w-6 h-6 text-white" />
            </div>
            <p className="text-xs text-center mt-1 text-gray-600 dark:text-gray-400">Add Story</p>
          </motion.div>

          {/* Story Items */}
          {stories.map((story, index) => (
            <motion.div
              key={story.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 cursor-pointer"
              onClick={() => handleStoryClick(story, index)}
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white dark:bg-gray-800 p-0.5">
                    <img
                      src={story.user.avatar}
                      alt={story.user.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              </div>
              <p className="text-xs text-center mt-1 text-gray-600 dark:text-gray-400 max-w-16 truncate">
                {story.user.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Story Modal */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={closeStory}
          >
            <div className="relative w-full h-full max-w-md mx-auto">
              {/* Progress Bar */}
              <div className="absolute top-4 left-4 right-4 z-10">
                <div className="flex space-x-1">
                  {stories.map((_, index) => (
                    <div
                      key={index}
                      className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
                    >
                      <motion.div
                        className="h-full bg-white rounded-full"
                        initial={{ width: 0 }}
                        animate={{ 
                          width: index === currentStoryIndex ? `${progress}%` : 
                                 index < currentStoryIndex ? '100%' : '0%'
                        }}
                        transition={{ duration: 0.1 }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={closeStory}
                className="absolute top-4 right-4 z-10 text-white hover:text-gray-300"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              {/* Story Content */}
              <div className="relative w-full h-full">
                {selectedStory.media.type === 'image' ? (
                  <img
                    src={selectedStory.media.url}
                    alt="Story"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    ref={videoRef}
                    src={selectedStory.media.url}
                    className="w-full h-full object-cover"
                    loop
                    muted
                    autoPlay={isPlaying}
                    onEnded={nextStory}
                  />
                )}

                {/* Play/Pause Overlay */}
                <div
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  onClick={togglePlayPause}
                >
                  {!isPlaying && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
                    >
                      <PlayIcon className="w-8 h-8 text-white ml-1" />
                    </motion.div>
                  )}
                </div>

                {/* Story Info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="flex items-center space-x-3 mb-3">
                    <img
                      src={selectedStory.user.avatar}
                      alt={selectedStory.user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="text-white font-semibold text-sm">
                          {selectedStory.user.name}
                        </span>
                        {selectedStory.user.verified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <span className="text-white/70 text-xs">
                        {selectedStory.timestamp}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handleLike}
                        className="flex items-center space-x-1 text-white hover:text-red-400 transition-colors"
                      >
                        {isLiked ? (
                          <HeartSolidIcon className="w-6 h-6 text-red-500" />
                        ) : (
                          <HeartIcon className="w-6 h-6" />
                        )}
                        <span className="text-sm">{selectedStory.likes}</span>
                      </button>

                      <button className="flex items-center space-x-1 text-white hover:text-blue-400 transition-colors">
                        <ChatBubbleLeftIcon className="w-6 h-6" />
                        <span className="text-sm">{selectedStory.comments}</span>
                      </button>

                      <button className="flex items-center space-x-1 text-white hover:text-green-400 transition-colors">
                        <ShareIcon className="w-6 h-6" />
                      </button>
                    </div>

                    <div className="text-white/70 text-sm">
                      {selectedStory.views} views
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="absolute inset-y-0 left-0 w-1/2" onClick={previousStory} />
              <div className="absolute inset-y-0 right-0 w-1/2" onClick={nextStory} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
