"use client"

import { Outlet, useNavigate } from "react-router-dom"
import Navbar from "./Navbar"
import { useBusinessConfig } from "@/hooks/useBusinessConfig"
import BusinessTypeNavigation from "@/Pages/LandingPage/TopSection/BusinessTypeNavigation"
import { UserContext } from "@/Contexts/UserContext"
import { useContext, useEffect } from "react"
import { Brain } from "lucide-react"

export default function Layout() {
  const navigate = useNavigate();
  const userContext = useContext(UserContext)
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }

  const { userToken } = userContext
  const { businessTypeCategories, businessTypes, isLoading, isError, error, refetch, isFetching, isSuccess } =
    useBusinessConfig()

  // Debug logging
  useEffect(() => {
    console.log("Layout - Business Config State:", {
      userToken: !!userToken,
      isLoading,
      isError,
      isFetching,
      isSuccess,
      businessTypesCount: businessTypes.length,
      categoriesCount: businessTypeCategories.length,
      error: error?.message,
    })
  }, [userToken, isLoading, isError, isFetching, isSuccess, businessTypes.length, businessTypeCategories.length, error])

  // Show loading state only when initially loading and user is authenticated
  const showLoading = userToken && isLoading && !isSuccess

  // Show error state only when there's an error and user is authenticated
  const showError = userToken && isError && !isLoading

  // Show navigation when:
  // 1. User is authenticated
  // 2. Not in initial loading state
  // 3. Has business types data (even if categories are empty)
  const showNavigation = userToken && !showLoading && businessTypes.length > 0

  return (
    <>
      <div className="sticky inset-0 z-40">
        {/* Navbar - Always show */}
        <Navbar />

        {/* Loading State */}
        {showLoading && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded mx-4 my-2">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700 mr-2"></div>
              <p className="text-sm">Loading business categories...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {showError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mx-4 my-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="text-red-500 mr-2">⚠️</div>
                <p className="text-sm">Failed to load categories: {error?.message}</p>
              </div>
              <button
                onClick={() => refetch()}
                className="ml-4 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 text-xs rounded transition-colors"
                disabled={isFetching}
              >
                {isFetching ? "Retrying..." : "Retry"}
              </button>
            </div>
          </div>
        )}

        {/* Business Type Navigation - Show when data is available */}
        {showNavigation && (
          <BusinessTypeNavigation businessTypeCategories={businessTypeCategories} businessTypes={businessTypes} />
        )}

      </div>

      <div className="">
        <Outlet />
      </div>

          {/* AI Button */}
      <button
        onClick={() => navigate("/TryAI")}
        className="fixed bottom-6 right-6 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-white p-4 rounded-full shadow-xl hover:brightness-110 transition-all duration-300 z-[100000] animate-pulseGrow"
        title="Ask AI"
      >
        <Brain className="w-6 h-6" />
      </button>
    </>
  )
}
