"use client"
import { ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "./product-card"
import { useMyAsks } from "@/hooks/useMyAsks"
import { useNavigate } from "react-router-dom"

interface MyAsksPageProps {
  selectedServiceType: string
  onBack?: () => void
}

// Map service types to display names
const getServiceDisplayName = (serviceType: string): string => {
  switch (serviceType) {
    case "engineer":
      return "Ask Engineer"
    case "worker":
      return "Ask Worker"
    case "request-design":
      return "Request Design"
    case "home-renovate":
      return "Renovate Home"
    case "custom-package":
      return "Custom Package"
    default:
      return "My Asks"
  }
}

// Map service types to business type codes for API calls
const getBusinessTypeFromService = (serviceType: string): string => {
  switch (serviceType) {
    case "engineer":
      return "ask_engineer"
    case "worker":
      return "technical_worker"
    case "request-design":
      return "design_request"
    case "home-renovate":
      return "home_renovate"
    case "custom-package":
      return "custom_package"
    default:
      return "ask_engineer"
  }
}

export function MyAsksPage({ selectedServiceType, onBack }: MyAsksPageProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    // Call the callback to reset My Asks state
    onBack?.()
    // Navigate to All-Asks with the service type preserved
    navigate("/All-Asks", {
      state: {
        activeServiceType: selectedServiceType,
        preserveCategory: true,
      },
      replace: true,
    })
  }

  const businessTypeCode = getBusinessTypeFromService(selectedServiceType)
  const serviceDisplayName = getServiceDisplayName(selectedServiceType)

  const { data: myAsksData, isLoading, isError, error } = useMyAsks(businessTypeCode, true)

  const myAsks = myAsksData?.data
  const totalElements = myAsksData?.data?.length || 0

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 2xl:px-12 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2 hover:bg-gray-50 transition-colors duration-200 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Browse
            </Button>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My {serviceDisplayName} Requests</h1>
            <p className="text-gray-600">
              {totalElements > 0
                ? `You have ${totalElements} ${serviceDisplayName.toLowerCase()} request${totalElements > 1 ? "s" : ""}`
                : `You haven't made any ${serviceDisplayName.toLowerCase()} requests yet`}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-500">Loading your requests...</p>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="text-center py-12">
              <p className="text-red-500 mb-2">Error loading your requests</p>
              <p className="text-gray-500 text-sm">{error?.message || "Please try again later"}</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && myAsks?.length === 0 && (
            <div className="text-center py-12">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No {serviceDisplayName} Requests Yet</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  You haven't created any {serviceDisplayName.toLowerCase()} requests yet. Click "Back to Browse" to
                  start creating your first request.
                </p>
              </div>
            </div>
          )}

          {/* My Asks Grid */}
          {!isLoading && !isError && (myAsks?.length ?? 0) > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 xl:gap-7">
              {myAsks?.map((ask, index) => (
                <div
                  key={ask.id}
                  className="animate-in fade-in slide-in-from-bottom-8 duration-700"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard product={ask} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
