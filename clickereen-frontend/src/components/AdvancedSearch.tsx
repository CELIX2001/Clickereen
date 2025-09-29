'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MagnifyingGlassIcon,
  XMarkIcon,
  FunnelIcon,
  ClockIcon,
  UserIcon,
  HashtagIcon,
  PhotoIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  CalendarIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'

interface SearchSuggestion {
  id: string
  type: 'user' | 'hashtag' | 'trending' | 'recent'
  text: string
  subtitle?: string
  icon: React.ComponentType<{ className?: string }>
  count?: number
}

interface SearchFilter {
  type: 'all' | 'posts' | 'users' | 'hashtags' | 'media'
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface AdvancedSearchProps {
  isOpen: boolean
  onClose: () => void
  onSearch?: (query: string, filters: SearchFilter[]) => void
}

const searchFilters: SearchFilter[] = [
  { type: 'all', label: 'All', icon: MagnifyingGlassIcon },
  { type: 'posts', label: 'Posts', icon: DocumentTextIcon },
  { type: 'users', label: 'Users', icon: UserIcon },
  { type: 'hashtags', label: 'Hashtags', icon: HashtagIcon },
  { type: 'media', label: 'Media', icon: PhotoIcon }
]

const mockSuggestions: SearchSuggestion[] = [
  // Trending hashtags
  { id: '1', type: 'trending', text: '#Technology', subtitle: '125K posts', icon: HashtagIcon, count: 125000 },
  { id: '2', type: 'trending', text: '#Gaming', subtitle: '89K posts', icon: HashtagIcon, count: 89000 },
  { id: '3', type: 'trending', text: '#Music', subtitle: '67K posts', icon: HashtagIcon, count: 67000 },
  { id: '4', type: 'trending', text: '#Art', subtitle: '45K posts', icon: HashtagIcon, count: 45000 },
  { id: '5', type: 'trending', text: '#Sports', subtitle: '78K posts', icon: HashtagIcon, count: 78000 },
  
  // Popular users
  { id: '6', type: 'user', text: 'Alex Johnson', subtitle: '@alex_tech • 125K followers', icon: UserIcon },
  { id: '7', type: 'user', text: 'Sarah Chen', subtitle: '@sarah_creative • 89K followers', icon: UserIcon },
  { id: '8', type: 'user', text: 'Mike Rodriguez', subtitle: '@mike_gamer • 67K followers', icon: UserIcon },
  
  // Recent searches
  { id: '9', type: 'recent', text: 'React development', subtitle: 'Searched 2 hours ago', icon: ClockIcon },
  { id: '10', type: 'recent', text: 'Photography tips', subtitle: 'Searched yesterday', icon: ClockIcon },
  { id: '11', type: 'recent', text: 'Cooking recipes', subtitle: 'Searched 3 days ago', icon: ClockIcon }
]

export function AdvancedSearch({ isOpen, onClose, onSearch }: AdvancedSearchProps) {
  const [query, setQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<SearchFilter[]>([searchFilters[0]])
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('clickereen_search_history')
    if (saved) {
      setSearchHistory(JSON.parse(saved))
    }
  }, [])

  // Filter suggestions based on query
  useEffect(() => {
    if (query.length > 0) {
      const filtered = mockSuggestions.filter(suggestion =>
        suggestion.text.toLowerCase().includes(query.toLowerCase()) ||
        suggestion.subtitle?.toLowerCase().includes(query.toLowerCase())
      )
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions(mockSuggestions.slice(0, 8)) // Show trending when no query
      setShowSuggestions(true)
    }
  }, [query])

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      // Add to search history
      const newHistory = [searchQuery, ...searchHistory.filter(h => h !== searchQuery)].slice(0, 10)
      setSearchHistory(newHistory)
      localStorage.setItem('clickereen_search_history', JSON.stringify(newHistory))
      
      if (onSearch) {
        onSearch(searchQuery, activeFilters)
      }
      onClose()
    }
  }

  const handleFilterToggle = (filter: SearchFilter) => {
    if (filter.type === 'all') {
      setActiveFilters([filter])
    } else {
      setActiveFilters(prev => {
        const withoutAll = prev.filter(f => f.type !== 'all')
        const isActive = withoutAll.some(f => f.type === filter.type)
        
        if (isActive) {
          return withoutAll.filter(f => f.type !== filter.type)
        } else {
          return [...withoutAll, filter]
        }
      })
    }
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text)
    handleSearch(suggestion.text)
  }

  const clearSearch = () => {
    setQuery('')
    setActiveFilters([searchFilters[0]])
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch()
                } else if (e.key === 'Escape') {
                  onClose()
                }
              }}
              placeholder="Search Clickereen..."
              className="w-full pl-10 pr-10 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl border-0 focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-900 dark:text-white placeholder-gray-500"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-3">
            <FunnelIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchFilters.map((filter) => {
              const isActive = activeFilters.some(f => f.type === filter.type)
              const Icon = filter.icon
              
              return (
                <motion.button
                  key={filter.type}
                  onClick={() => handleFilterToggle(filter)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{filter.label}</span>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Suggestions */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {showSuggestions && (
            <div className="p-4">
              {query.length === 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Trending</h3>
                  <div className="space-y-1">
                    {suggestions.slice(0, 5).map((suggestion) => (
                      <motion.button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                        whileHover={{ x: 4 }}
                      >
                        <suggestion.icon className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{suggestion.text}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{suggestion.subtitle}</p>
                        </div>
                        {suggestion.count && (
                          <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                            {suggestion.count.toLocaleString()}
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {query.length > 0 && suggestions.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Suggestions</h3>
                  <div className="space-y-1">
                    {suggestions.map((suggestion) => (
                      <motion.button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                        whileHover={{ x: 4 }}
                      >
                        <suggestion.icon className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{suggestion.text}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{suggestion.subtitle}</p>
                        </div>
                        {suggestion.count && (
                          <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                            {suggestion.count.toLocaleString()}
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {query.length > 0 && suggestions.length === 0 && (
                <div className="text-center py-8">
                  <MagnifyingGlassIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No results found for "{query}"</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try a different search term</p>
                </div>
              )}

              {/* Search History */}
              {query.length === 0 && searchHistory.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Recent Searches</h3>
                  <div className="space-y-1">
                    {searchHistory.slice(0, 5).map((term, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleSuggestionClick({ id: `history-${index}`, type: 'recent', text: term, icon: ClockIcon })}
                        className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
                        whileHover={{ x: 4 }}
                      >
                        <ClockIcon className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{term}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Press <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-xs">Enter</kbd> to search
            </div>
            <button
              onClick={() => handleSearch()}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Search
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
