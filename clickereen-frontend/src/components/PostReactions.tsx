'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HeartIcon,
  FaceSmileIcon,
  FaceFrownIcon,
  FireIcon,
  HandThumbUpIcon,
  HandThumbDownIcon
} from '@heroicons/react/24/outline'
import {
  HeartIcon as HeartSolidIcon,
  FaceSmileIcon as FaceSmileSolidIcon,
  FaceFrownIcon as FaceFrownSolidIcon,
  FireIcon as FireSolidIcon,
  HandThumbUpIcon as HandThumbUpSolidIcon,
  HandThumbDownIcon as HandThumbDownSolidIcon
} from '@heroicons/react/24/solid'

interface Reaction {
  type: 'like' | 'love' | 'laugh' | 'angry' | 'fire' | 'dislike'
  count: number
  active: boolean
}

interface PostReactionsProps {
  postId: string
  initialReactions?: Reaction[]
  onReactionChange?: (postId: string, reaction: Reaction) => void
}

const reactionConfig = {
  like: {
    icon: HeartIcon,
    solidIcon: HeartSolidIcon,
    color: 'text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    label: 'Like'
  },
  love: {
    icon: HeartIcon,
    solidIcon: HeartSolidIcon,
    color: 'text-pink-500',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    label: 'Love'
  },
  laugh: {
    icon: FaceSmileIcon,
    solidIcon: FaceSmileSolidIcon,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    label: 'Laugh'
  },
  angry: {
    icon: FaceFrownIcon,
    solidIcon: FaceFrownSolidIcon,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    label: 'Angry'
  },
  fire: {
    icon: FireIcon,
    solidIcon: FireSolidIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    label: 'Fire'
  },
  dislike: {
    icon: HandThumbDownIcon,
    solidIcon: HandThumbDownSolidIcon,
    color: 'text-gray-500',
    bgColor: 'bg-gray-50 dark:bg-gray-900/20',
    label: 'Dislike'
  }
}

export function PostReactions({ postId, initialReactions = [], onReactionChange }: PostReactionsProps) {
  const [reactions, setReactions] = useState<Reaction[]>(initialReactions)
  const [showReactionPicker, setShowReactionPicker] = useState(false)

  const handleReaction = (reactionType: Reaction['type']) => {
    setReactions(prev => {
      const existingReaction = prev.find(r => r.type === reactionType)
      const otherReactions = prev.filter(r => r.type !== reactionType)
      
      if (existingReaction) {
        // Toggle existing reaction
        const updatedReaction = {
          ...existingReaction,
          active: !existingReaction.active,
          count: existingReaction.active ? existingReaction.count - 1 : existingReaction.count + 1
        }
        
        if (updatedReaction.count > 0) {
          return [...otherReactions, updatedReaction]
        } else {
          return otherReactions
        }
      } else {
        // Add new reaction
        const newReaction: Reaction = {
          type: reactionType,
          count: 1,
          active: true
        }
        return [...otherReactions, newReaction]
      }
    })

    if (onReactionChange) {
      const reaction = reactions.find(r => r.type === reactionType) || {
        type: reactionType,
        count: 0,
        active: false
      }
      onReactionChange(postId, reaction)
    }
  }

  const getTotalReactions = () => {
    return reactions.reduce((total, reaction) => total + reaction.count, 0)
  }

  const getActiveReaction = () => {
    return reactions.find(r => r.active)
  }

  return (
    <div className="relative">
      {/* Reaction Button */}
      <motion.button
        onClick={() => setShowReactionPicker(!showReactionPicker)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-200 ${
          getActiveReaction()
            ? `${reactionConfig[getActiveReaction()!.type].bgColor} ${reactionConfig[getActiveReaction()!.type].color}`
            : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {getActiveReaction() ? (
          <>
            {getActiveReaction()!.type === 'like' && <HeartSolidIcon className="w-5 h-5" />}
            {getActiveReaction()!.type === 'love' && <HeartSolidIcon className="w-5 h-5" />}
            {getActiveReaction()!.type === 'laugh' && <FaceSmileSolidIcon className="w-5 h-5" />}
            {getActiveReaction()!.type === 'angry' && <FaceFrownSolidIcon className="w-5 h-5" />}
            {getActiveReaction()!.type === 'fire' && <FireSolidIcon className="w-5 h-5" />}
            {getActiveReaction()!.type === 'dislike' && <HandThumbDownSolidIcon className="w-5 h-5" />}
            <span className="font-medium">{getActiveReaction()!.count}</span>
          </>
        ) : (
          <>
            <HandThumbUpIcon className="w-5 h-5" />
            <span className="font-medium">{getTotalReactions() || 'React'}</span>
          </>
        )}
      </motion.button>

      {/* Reaction Picker */}
      <AnimatePresence>
        {showReactionPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex space-x-1"
          >
            {Object.entries(reactionConfig).map(([type, config]) => {
              const reaction = reactions.find(r => r.type === type as Reaction['type'])
              const isActive = reaction?.active || false
              const Icon = isActive ? config.solidIcon : config.icon
              
              return (
                <motion.button
                  key={type}
                  onClick={() => {
                    handleReaction(type as Reaction['type'])
                    setShowReactionPicker(false)
                  }}
                  className={`p-2 rounded-full transition-all duration-200 ${
                    isActive
                      ? `${config.bgColor} ${config.color}`
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  title={config.label}
                >
                  <Icon className="w-5 h-5" />
                </motion.button>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reaction Summary */}
      {reactions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {reactions
            .filter(r => r.count > 0)
            .sort((a, b) => b.count - a.count)
            .map((reaction) => {
              const config = reactionConfig[reaction.type]
              const Icon = reaction.active ? config.solidIcon : config.icon
              
              return (
                <motion.div
                  key={reaction.type}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${
                    reaction.active
                      ? `${config.bgColor} ${config.color}`
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{reaction.count}</span>
                </motion.div>
              )
            })}
        </div>
      )}
    </div>
  )
}
