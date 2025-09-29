'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  VideoCameraIcon,
  MicrophoneIcon,
  SpeakerXMarkIcon,
  VideoCameraSlashIcon,
  ShareIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  UserGroupIcon,
  XMarkIcon,
  Cog6ToothIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface LiveStream {
  id: string
  title: string
  description: string
  streamer: {
    name: string
    username: string
    avatar: string
    verified: boolean
  }
  viewers: number
  likes: number
  comments: number
  isLive: boolean
  thumbnail: string
  streamUrl?: string
  category: string
  tags: string[]
}

interface LiveStreamingProps {
  streams: LiveStream[]
  onStartStream?: () => void
  onJoinStream?: (streamId: string) => void
}

export function LiveStreaming({ streams, onStartStream, onJoinStream }: LiveStreamingProps) {
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [viewerCount, setViewerCount] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startStreaming = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
      
      streamRef.current = stream
      setIsStreaming(true)
      onStartStream?.()
    } catch (error) {
      console.error('Error starting stream:', error)
    }
  }

  const stopStreaming = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setIsStreaming(false)
    setSelectedStream(null)
  }

  const toggleMute = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks()
      audioTracks.forEach(track => {
        track.enabled = !track.enabled
      })
    }
    setIsMuted(!isMuted)
  }

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks()
      videoTracks.forEach(track => {
        track.enabled = !track.enabled
      })
    }
    setIsVideoOn(!isVideoOn)
  }

  const joinStream = (stream: LiveStream) => {
    setSelectedStream(stream)
    onJoinStream?.(stream.id)
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  // Simulate viewer count changes
  useEffect(() => {
    if (selectedStream) {
      const interval = setInterval(() => {
        setViewerCount(prev => prev + Math.floor(Math.random() * 3) - 1)
      }, 2000)
      return () => clearInterval(interval)
    }
  }, [selectedStream])

  return (
    <div className="space-y-6">
      {/* Live Streams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {streams.map((stream) => (
          <motion.div
            key={stream.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer"
            onClick={() => joinStream(stream)}
          >
            {/* Stream Thumbnail */}
            <div className="relative">
              <img
                src={stream.thumbnail}
                alt={stream.title}
                className="w-full h-48 object-cover"
              />
              
              {/* Live Badge */}
              <div className="absolute top-3 left-3 flex items-center space-x-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>LIVE</span>
              </div>

              {/* Viewer Count */}
              <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                <EyeIcon className="w-3 h-3" />
                <span>{stream.viewers.toLocaleString()}</span>
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center"
                >
                  <PlayIcon className="w-8 h-8 text-gray-800 ml-1" />
                </motion.div>
              </div>
            </div>

            {/* Stream Info */}
            <div className="p-4">
              <div className="flex items-start space-x-3 mb-3">
                <img
                  src={stream.streamer.avatar}
                  alt={stream.streamer.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                      {stream.streamer.name}
                    </h3>
                    {stream.streamer.verified && (
                      <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    @{stream.streamer.username}
                  </p>
                </div>
              </div>

              <h4 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
                {stream.title}
              </h4>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                  {stream.category}
                </span>
                <div className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1">
                    <HeartIcon className="w-4 h-4" />
                    <span>{stream.likes}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <ChatBubbleLeftIcon className="w-4 h-4" />
                    <span>{stream.comments}</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Start Streaming Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={startStreaming}
        disabled={isStreaming}
        className="w-full bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:from-red-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
      >
        <VideoCameraIcon className="w-6 h-6" />
        <span>{isStreaming ? 'Streaming...' : 'Start Live Stream'}</span>
      </motion.button>

      {/* Stream Modal */}
      <AnimatePresence>
        {selectedStream && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          >
            <div className="relative w-full h-full max-w-6xl mx-auto">
              {/* Close Button */}
              <button
                onClick={() => setSelectedStream(null)}
                className="absolute top-4 right-4 z-10 text-white hover:text-gray-300"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>

              {/* Stream Content */}
              <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
                {isStreaming ? (
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                  />
                ) : (
                  <img
                    src={selectedStream.thumbnail}
                    alt={selectedStream.title}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Stream Controls */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedStream.streamer.avatar}
                        alt={selectedStream.streamer.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="flex items-center space-x-1">
                          <span className="text-white font-semibold">
                            {selectedStream.streamer.name}
                          </span>
                          {selectedStream.streamer.verified && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        <p className="text-white/70 text-sm">
                          {viewerCount.toLocaleString()} viewers
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleLike}
                        className="flex items-center space-x-1 text-white hover:text-red-400 transition-colors"
                      >
                        {isLiked ? (
                          <HeartSolidIcon className="w-6 h-6 text-red-500" />
                        ) : (
                          <HeartIcon className="w-6 h-6" />
                        )}
                        <span>{selectedStream.likes}</span>
                      </button>

                      <button className="flex items-center space-x-1 text-white hover:text-blue-400 transition-colors">
                        <ChatBubbleLeftIcon className="w-6 h-6" />
                        <span>{selectedStream.comments}</span>
                      </button>

                      <button className="text-white hover:text-green-400 transition-colors">
                        <ShareIcon className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  {/* Stream Title */}
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {selectedStream.title}
                  </h3>

                  {/* Action Buttons */}
                  {isStreaming && (
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={toggleMute}
                        className={`p-2 rounded-full ${
                          isMuted ? 'bg-red-500' : 'bg-white/20'
                        } text-white hover:bg-white/30 transition-colors`}
                      >
                        {isMuted ? (
                          <SpeakerXMarkIcon className="w-5 h-5" />
                        ) : (
                          <MicrophoneIcon className="w-5 h-5" />
                        )}
                      </button>

                      <button
                        onClick={toggleVideo}
                        className={`p-2 rounded-full ${
                          !isVideoOn ? 'bg-red-500' : 'bg-white/20'
                        } text-white hover:bg-white/30 transition-colors`}
                      >
                        {isVideoOn ? (
                          <VideoCameraIcon className="w-5 h-5" />
                        ) : (
                          <VideoCameraSlashIcon className="w-5 h-5" />
                        )}
                      </button>

                      <button
                        onClick={stopStreaming}
                        className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                      >
                        <StopIcon className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                      >
                        <Cog6ToothIcon className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}