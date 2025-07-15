"use client"

import type React from "react"

import { Suspense } from "react"
import { LoadingSpinner } from "./loading-spinner"
import { ErrorBoundary } from "./error-boundary"

interface RouteLoadingProps {
  children: React.ReactNode
  loadingMessage?: string
}

export function RouteLoading({ children, loadingMessage }: RouteLoadingProps) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner message={loadingMessage} />}>{children}</Suspense>
    </ErrorBoundary>
  )
}
