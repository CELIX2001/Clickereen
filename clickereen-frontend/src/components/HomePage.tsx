'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../app/providers'
import { Sidebar } from './Sidebar'
import { EndlessFeed } from './EndlessFeed'
import { RightSidebar } from './RightSidebar'
import { ComposeModal } from './ComposeModal'

export function HomePage() {
  const { user, isDarkMode, toggleDarkMode } = useAuth()
  const [showCompose, setShowCompose] = useState(false)

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Main Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-3">
              <Sidebar 
                user={user}
                onCompose={() => setShowCompose(true)}
              />
            </div>

            {/* Main Feed */}
            <div className="lg:col-span-6">
              <EndlessFeed user={user} />
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-3">
              <RightSidebar />
            </div>
          </div>
        </div>

        {/* Compose Modal */}
        {showCompose && (
          <ComposeModal 
            user={user}
            onClose={() => setShowCompose(false)}
          />
        )}
      </div>
    </div>
  )
}
