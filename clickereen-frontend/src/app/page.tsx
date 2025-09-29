'use client'

import { useAuth } from './providers'
import { LoginPage } from '@/components/LoginPage'
import { HomePage } from '@/components/HomePage'
import { Header } from '@/components/Header'
import { ExplorePage } from '@/components/ExplorePage'
import { MessagesPage } from '@/components/MessagesPage'
import { BookmarksPage } from '@/components/BookmarksPage'
import { CommunitiesPage } from '@/components/CommunitiesPage'
import { ProfilePage } from '@/components/ProfilePage'
import { SettingsPage } from '@/components/SettingsPage'
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'
import { LiveStreaming } from '@/components/LiveStreaming'
import { AdminDashboard } from '@/components/AdminDashboard'
import { StoriesSection } from '@/components/StoriesSection'
import { AIContentSuggestions } from '@/components/AIContentSuggestions'
import { useState } from 'react'

export default function Page() {
  const { user, isDarkMode, toggleDarkMode } = useAuth()
  const [activeTab, setActiveTab] = useState('home')
  const [showCompose, setShowCompose] = useState(false)

  if (!user) {
    return <LoginPage />
  }

  // Mock data for new features
  const mockStories = [
    {
      id: '1',
      user: {
        name: 'Sarah Chen',
        username: 'sarah_chen',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        verified: true
      },
      media: {
        type: 'image' as const,
        url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=600&fit=crop',
        duration: 5000
      },
      timestamp: '2h ago',
      views: 1250,
      likes: 89,
      comments: 23,
      isLiked: false
    },
    {
      id: '2',
      user: {
        name: 'Alex Rodriguez',
        username: 'alex_dev',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        verified: false
      },
      media: {
        type: 'video' as const,
        url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=600&fit=crop',
        duration: 8000
      },
      timestamp: '4h ago',
      views: 890,
      likes: 45,
      comments: 12,
      isLiked: true
    }
  ]

  const mockStreams = [
    {
      id: '1',
      title: 'Building Clickereen: Behind the Scenes',
      description: 'Join me as I show you how we built this amazing social media platform',
      streamer: {
        name: 'Clickereen Team',
        username: 'clickereen_dev',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        verified: true
      },
      viewers: 1250,
      likes: 89,
      comments: 23,
      isLive: true,
      thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
      category: 'Technology',
      tags: ['#coding', '#webdev', '#react']
    }
  ]

  const mockAnalytics = {
    totalViews: 125000,
    totalLikes: 8900,
    totalComments: 1200,
    totalShares: 450,
    totalFollowers: 2500,
    engagementRate: 4.2,
    reach: 45000,
    impressions: 180000,
    topPosts: [
      {
        id: '1',
        content: 'Just launched Clickereen! A modern social media platform built with Next.js and React.',
        views: 15000,
        likes: 1200,
        comments: 89,
        shares: 45,
        engagement: 8.9
      }
    ],
    dailyStats: [],
    audienceInsights: {
      ageGroups: [
        { range: '18-24', percentage: 35 },
        { range: '25-34', percentage: 40 },
        { range: '35-44', percentage: 20 },
        { range: '45+', percentage: 5 }
      ],
      topCountries: [
        { country: 'United States', percentage: 45 },
        { country: 'Canada', percentage: 20 },
        { country: 'United Kingdom', percentage: 15 },
        { country: 'Australia', percentage: 10 },
        { country: 'Others', percentage: 10 }
      ],
      deviceTypes: [
        { device: 'Mobile', percentage: 70 },
        { device: 'Desktop', percentage: 25 },
        { device: 'Tablet', percentage: 5 }
      ]
    }
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <StoriesSection stories={mockStories} />
            <HomePage />
            <AIContentSuggestions />
          </div>
        )
      case 'explore':
        return <ExplorePage />
      case 'notifications':
        return (
          <div className="max-w-4xl mx-auto py-6 px-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Notifications</h1>
            <p className="text-gray-600 dark:text-gray-400">Your notifications will appear here.</p>
          </div>
        )
      case 'messages':
        return <MessagesPage />
      case 'bookmarks':
        return <BookmarksPage />
      case 'communities':
        return <CommunitiesPage />
      case 'profile':
        return <ProfilePage />
      case 'settings':
        return <SettingsPage />
      case 'analytics':
        return <AnalyticsDashboard data={mockAnalytics} />
      case 'streaming':
        return <LiveStreaming streams={mockStreams} />
      case 'admin':
        return <AdminDashboard />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header 
        user={user} 
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode}
        onCompose={() => setShowCompose(true)}
        onNavigate={(page) => setActiveTab(page)}
      />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderContent()}
      </div>
    </div>
  )
}