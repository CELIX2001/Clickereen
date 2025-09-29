'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  SparklesIcon,
  LightBulbIcon,
  HashtagIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface ContentSuggestion {
  id: string
  type: 'hashtag' | 'trending' | 'content' | 'timing' | 'visual'
  title: string
  description: string
  confidence: number
  category: string
  tags?: string[]
  imageUrl?: string
  videoUrl?: string
  suggestedTime?: string
  engagement?: {
    likes: number
    comments: number
    shares: number
  }
}

interface AIContentSuggestionsProps {
  onSuggestionSelect?: (suggestion: ContentSuggestion) => void
  onDismiss?: (suggestionId: string) => void
}

export function AIContentSuggestions({ onSuggestionSelect, onDismiss }: AIContentSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)

  // Mock AI suggestions
  useEffect(() => {
    const mockSuggestions: ContentSuggestion[] = [
      {
        id: '1',
        type: 'hashtag',
        title: 'Trending Hashtags',
        description: '#Clickereen #SocialMedia #Tech #Innovation #Community',
        confidence: 95,
        category: 'engagement',
        tags: ['#Clickereen', '#SocialMedia', '#Tech', '#Innovation', '#Community']
      },
      {
        id: '2',
        type: 'trending',
        title: 'AI & Technology',
        description: 'Share insights about AI developments and their impact on social media',
        confidence: 88,
        category: 'content',
        engagement: {
          likes: 1250,
          comments: 89,
          shares: 156
        }
      },
      {
        id: '3',
        type: 'content',
        title: 'Behind the Scenes',
        description: 'Show your development process and team culture',
        confidence: 82,
        category: 'content',
        imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop'
      },
      {
        id: '4',
        type: 'timing',
        title: 'Optimal Posting Time',
        description: 'Post between 2-4 PM for maximum engagement with your audience',
        confidence: 76,
        category: 'timing',
        suggestedTime: '2:30 PM'
      },
      {
        id: '5',
        type: 'visual',
        title: 'Video Content',
        description: 'Create a short video showcasing Clickereen features',
        confidence: 91,
        category: 'content',
        videoUrl: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop'
      },
      {
        id: '6',
        type: 'trending',
        title: 'User Stories',
        description: 'Share success stories from your community members',
        confidence: 85,
        category: 'engagement',
        engagement: {
          likes: 2100,
          comments: 234,
          shares: 189
        }
      }
    ]

    setTimeout(() => {
      setSuggestions(mockSuggestions)
      setIsLoading(false)
    }, 1500)
  }, [])

  const categories = [
    { id: 'all', name: 'All', count: suggestions.length },
    { id: 'engagement', name: 'Engagement', count: suggestions.filter(s => s.category === 'engagement').length },
    { id: 'content', name: 'Content', count: suggestions.filter(s => s.category === 'content').length },
    { id: 'timing', name: 'Timing', count: suggestions.filter(s => s.category === 'timing').length }
  ]

  const filteredSuggestions = selectedCategory === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.category === selectedCategory)

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-500 bg-green-50 dark:bg-green-900/20'
    if (confidence >= 75) return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
    return 'text-orange-500 bg-orange-50 dark:bg-orange-900/20'
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hashtag':
        return <HashtagIcon className="w-5 h-5" />
      case 'trending':
        return <ArrowTrendingUpIcon className="w-5 h-5" />
      case 'content':
        return <DocumentTextIcon className="w-5 h-5" />
      case 'timing':
        return <ClockIcon className="w-5 h-5" />
      case 'visual':
        return <PhotoIcon className="w-5 h-5" />
      default:
        return <LightBulbIcon className="w-5 h-5" />
    }
  }

  const handleSuggestionSelect = (suggestion: ContentSuggestion) => {
    onSuggestionSelect?.(suggestion)
  }

  const handleDismiss = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId))
    onDismiss?.(suggestionId)
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Content Suggestions</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Analyzing your content patterns...</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
          <SparklesIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Content Suggestions</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Powered by machine learning</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 mb-6 overflow-x-auto scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.id
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {category.name}
            <span className="ml-2 text-xs opacity-75">({category.count})</span>
          </button>
        ))}
      </div>

      {/* Suggestions */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredSuggestions.map((suggestion, index) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="text-purple-500">
                      {getTypeIcon(suggestion.type)}
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {suggestion.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(suggestion.confidence)}`}>
                      {suggestion.confidence}% match
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {suggestion.description}
                  </p>

                  {/* Tags */}
                  {suggestion.tags && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {suggestion.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Engagement Stats */}
                  {suggestion.engagement && (
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>❤️ {suggestion.engagement.likes.toLocaleString()}</span>
                      <span>💬 {suggestion.engagement.comments.toLocaleString()}</span>
                      <span>🔄 {suggestion.engagement.shares.toLocaleString()}</span>
                    </div>
                  )}

                  {/* Suggested Time */}
                  {suggestion.suggestedTime && (
                    <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <ClockIcon className="w-4 h-4" />
                      <span>Best time: {suggestion.suggestedTime}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    title="Use this suggestion"
                  >
                    <CheckIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDismiss(suggestion.id)}
                    className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    title="Dismiss suggestion"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Media Preview */}
              {(suggestion.imageUrl || suggestion.videoUrl) && (
                <div className="mt-3">
                  <div className="w-full h-32 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden">
                    <img
                      src={suggestion.imageUrl || suggestion.videoUrl}
                      alt="Suggestion preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Refresh Button */}
      <div className="mt-6 text-center">
        <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors">
          Refresh Suggestions
        </button>
      </div>
    </div>
  )
}
