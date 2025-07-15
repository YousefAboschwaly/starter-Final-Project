"use client"

import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  message?: string
  size?: "sm" | "md" | "lg"
  fullScreen?: boolean
}

export function LoadingSpinner({ message = "Loading...", size = "md", fullScreen = true }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  const containerClasses = fullScreen
    ? "min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30"
    : "flex items-center justify-center py-8"

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center justify-center">
        <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-600 mb-4`} />
        <p className="text-gray-500 text-lg">{message}</p>
      </div>
    </div>
  )
}
