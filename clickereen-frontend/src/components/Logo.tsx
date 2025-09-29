'use client'

import { useState } from 'react'

interface LogoProps {
  variant?: 'default' | 'white' | 'icon'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  showText?: boolean
}

export function Logo({ 
  variant = 'default', 
  size = 'md', 
  className = '',
  showText = true 
}: LogoProps) {
  const [imageError, setImageError] = useState(false)

  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8', 
    lg: 'h-12',
    xl: 'h-16'
  }

  const getLogoSrc = () => {
    if (variant === 'white') return '/logos/logo-white.png'
    if (variant === 'icon') return '/logos/Logo.png'
    return '/logos/Logo.png'
  }

  const getFallbackIcon = () => {
    const iconSizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-8 h-8', 
      xl: 'w-10 h-10'
    }

    return (
      <div className={`${sizeClasses[size]} ${size === 'xl' ? 'w-16' : 'w-8'} bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg`}>
        <svg className={`${iconSizes[size]} text-white`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
    )
  }

  const getFallbackText = () => {
    if (!showText) return null
    
    const textSizes = {
      sm: 'text-lg',
      md: 'text-xl',
      lg: 'text-2xl',
      xl: 'text-3xl'
    }

    return (
      <span className={`${textSizes[size]} font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent`}>
        Clickereen
      </span>
    )
  }

  if (imageError) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {getFallbackIcon()}
        {getFallbackText()}
      </div>
    )
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <img 
        src={getLogoSrc()} 
        alt="Clickereen Logo" 
        className={`${sizeClasses[size]} w-auto`}
        onError={() => setImageError(true)}
      />
      {showText && variant !== 'icon' && (
        <span className={`${sizeClasses[size]} w-auto`}>
          {/* This will be hidden if the image loads successfully */}
        </span>
      )}
    </div>
  )
}
