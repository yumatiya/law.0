import React from 'react'
import { cn } from '@/lib/utils'

interface LogoProps {
  variant?: 'full' | 'icon' | 'text'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  size = 'md',
  className
}) => {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16'
  }

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  }

  if (variant === 'icon') {
    return (
      <div className={cn(
        'flex items-center justify-center bg-brand-navy text-brand-white font-bold rounded-lg',
        sizeClasses[size],
        className
      )}>
        <span className="text-current">LG</span>
      </div>
    )
  }

  if (variant === 'text') {
    return (
      <div className={cn(
        'font-bold text-brand-navy',
        textSizeClasses[size],
        className
      )}>
        Law.Gen
      </div>
    )
  }

  // Full logo (icon + text)
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn(
        'flex items-center justify-center bg-brand-navy text-brand-white font-bold rounded-lg',
        sizeClasses[size]
      )}>
        <span className="text-current">LG</span>
      </div>
      <div className={cn(
        'font-bold text-brand-navy',
        textSizeClasses[size]
      )}>
        Law.Gen
      </div>
    </div>
  )
}

export default Logo
