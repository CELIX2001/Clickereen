'use client'

import { useState } from 'react'
import { useAuth } from '../app/providers'
import { motion } from 'framer-motion'
import { Logo } from './Logo'

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    displayName: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // INSTANT LOGIN - No credentials required at all!
      // Create a mock user with any input or default values
      const mockUser = {
        _id: 'user_' + Math.random().toString(36).substr(2, 9),
        username: formData.username || formData.email?.split('@')[0] || 'testuser',
        displayName: formData.displayName || formData.email?.split('@')[0] || 'Test User',
        email: formData.email || 'test@clickereen.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        verified: Math.random() < 0.3, // 30% chance of being verified
        followersCount: Math.floor(Math.random() * 1000),
        followingCount: Math.floor(Math.random() * 500),
        bio: 'Welcome to Clickereen!',
        location: 'Worldwide',
        website: '',
        createdAt: new Date().toISOString()
      }

      const mockToken = 'mock_token_' + Math.random().toString(36).substr(2, 9)

      // Very short delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300))

      // Log in with mock user
      login(mockUser, mockToken)

        } catch {
          setError('Something went wrong. Please try again.')
        } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-green-500 to-green-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="xl" showText={false} />
          </div>
        <h1 className="text-3xl font-bold text-black">Clickereen</h1>
        <p className="text-gray-800 mt-2 font-medium">
          {isLogin ? 'Welcome back!' : 'Join the conversation'}
        </p>
        <p className="text-green-600 text-sm font-semibold mt-1">
          🚀 Testing Mode - No credentials required!
        </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Display Name <span className="text-gray-500 text-sm font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-black font-medium"
                  placeholder="Your display name (or leave empty)"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-2">
                  Username <span className="text-gray-500 text-sm font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-black font-medium"
                  placeholder="@username (or leave empty)"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Email <span className="text-gray-500 text-sm font-normal">(Optional)</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-black font-medium"
              placeholder="your@email.com (or leave empty)"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-2">
              Password <span className="text-gray-500 text-sm font-normal">(Optional)</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-400 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-black font-medium"
              placeholder="•••••••• (Leave empty for instant access)"
            />
          </div>

          {/* Remember me and Forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-800">Remember me</span>
            </label>
            <button
              type="button"
              className="text-sm font-medium text-green-600 hover:text-green-700"
            >
              Forgot password?
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 text-lg"
          >
            {loading ? 'Entering...' : '🚀 Enter Clickereen (No Credentials Required!)'}
          </button>

          {/* Quick Access Button */}
          <button
            type="button"
            onClick={() => {
              setFormData({
                username: 'demo_user',
                email: 'demo@clickereen.com',
                password: '',
                displayName: 'Demo User'
              })
              handleSubmit({ preventDefault: () => {} } as React.FormEvent)
            }}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 text-lg mt-3"
          >
            🚀 Quick Access (No Password Required)
          </button>
        </form>

        {/* Social Login */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-800 font-medium">or</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              className="w-full flex justify-center items-center px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white text-gray-800 font-medium hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <button
              type="button"
              className="w-full flex justify-center items-center px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white text-gray-800 font-medium hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="#1DA1F2" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
              Continue with Twitter
            </button>
          </div>
        </div>

        {/* Toggle */}
        <div className="mt-6 text-center">
          <p className="text-gray-800 font-medium">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-green-600 hover:text-green-700 font-bold ml-1 text-lg"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

