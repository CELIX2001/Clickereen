'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { TrendingTopics } from './TrendingTopics'
import { FollowSuggestions } from './FollowSuggestions'
import { AdvancedSearch } from './AdvancedSearch'

export function RightSidebar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)

  return (
    <div className="space-y-6">
      {/* Search */}
      <motion.div 
        className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl p-4 shadow-sm border border-gray-200/50 dark:border-gray-700/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search Clickereen"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowAdvancedSearch(true)}
            className="w-full pl-10 pr-4 py-3 bg-gray-100/80 dark:bg-gray-700/80 rounded-xl border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 backdrop-blur-sm transition-all duration-200 focus:ring-2 focus:ring-green-500/50 focus:bg-white dark:focus:bg-gray-700 cursor-pointer"
          />
        </div>
      </motion.div>

      {/* Trending Topics */}
      <TrendingTopics />

      {/* Follow Suggestions */}
      <FollowSuggestions />

      {/* Advanced Search Modal */}
      <AdvancedSearch
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        onSearch={(query, filters) => {
          console.log('Search:', query, 'Filters:', filters)
          setSearchQuery(query)
          setShowAdvancedSearch(false)
        }}
      />
    </div>
  )
}