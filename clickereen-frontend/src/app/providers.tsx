'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { Socket, io } from 'socket.io-client'
import { ToastContainer, useToast } from '../components/Toast'

interface User {
  _id: string
  username: string
  displayName: string
  email: string
  avatar: string
  bio: string
  verified: boolean
  followersCount: number
  followingCount: number
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (user: User, token: string) => void
  logout: () => void
  socket: Socket | null
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const { toasts, removeToast, success, error } = useToast()
  const socketRef = useRef<Socket | null>(null)

  // Initialize auth state from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('clickereen_user')
    const savedToken = localStorage.getItem('clickereen_token')
    const savedDarkMode = localStorage.getItem('clickereen_darkMode')

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser))
      setToken(savedToken)
    } else {
      // Auto-login with demo user if no user is stored
      const demoUser = {
        _id: 'demo_user_123',
        username: 'demo_user',
        displayName: 'Demo User',
        email: 'demo@clickereen.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        bio: 'Welcome to Clickereen! This is a demo account to showcase the platform.',
        verified: true,
        followersCount: 1250,
        followingCount: 340
      }

      const demoToken = 'demo_token_123'

      // Auto-login immediately
      login(demoUser, demoToken)
    }

    if (savedDarkMode) {
      setIsDarkMode(JSON.parse(savedDarkMode))
    }
  }, [])

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('clickereen_darkMode', JSON.stringify(isDarkMode))
  }, [isDarkMode])

  // Initialize socket connection
  useEffect(() => {
    if (user && token && !socketRef.current) {
      const newSocket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001', {
        auth: { token }
      })
      
      // Set up socket event listeners
      newSocket.on('connect', () => {
        console.log('🔌 Connected to Clickereen server')
        success('Connected to real-time updates!')
      })

      newSocket.on('disconnect', () => {
        console.log('🔌 Disconnected from Clickereen server')
      })

      newSocket.on('notification', (notification) => {
        console.log('🔔 New notification:', notification)
        success(`New notification: ${notification.message}`)
      })

      newSocket.on('postLiked', (data) => {
        console.log('❤️ Post liked:', data)
        success(`Post liked by ${data.user}`)
      })

      newSocket.on('postCommented', (data) => {
        console.log('💬 Post commented:', data)
        success(`New comment from ${data.user}`)
      })

      socketRef.current = newSocket
      setSocket(newSocket)

      return () => {
        if (socketRef.current) {
          socketRef.current.close()
          socketRef.current = null
        }
      }
    }
  }, [user, token]) // Removed 'success' from dependencies to prevent infinite re-renders

  // Cleanup socket on unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close()
        socketRef.current = null
      }
    }
  }, [])

  const login = (userData: User, userToken: string) => {
    setUser(userData)
    setToken(userToken)
    localStorage.setItem('clickereen_user', JSON.stringify(userData))
    localStorage.setItem('clickereen_token', userToken)
  }

  const logout = () => {
    if (socketRef.current) {
      socketRef.current.close()
      socketRef.current = null
    }
    setUser(null)
    setToken(null)
    setSocket(null)
    localStorage.removeItem('clickereen_user')
    localStorage.removeItem('clickereen_token')
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      socket,
      isDarkMode,
      toggleDarkMode
    }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a Providers')
  }
  return context
}

