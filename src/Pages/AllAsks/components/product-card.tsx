"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useContext } from "react"
import { UserContext } from "@/Contexts/UserContext"
import { useNavigate, useLocation } from "react-router-dom"
import {
  MapPin,
  DollarSign,
  Clock,
  User,
  Building,
  Zap,
  Wrench,
  Package,
  Ruler,
  Calendar,
  Home,
  Star,
} from "lucide-react"
import type { Product } from "@/hooks/useFilterProducts"

interface ProductCardProps {
  product: Product
}

// Helper function to format date
const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  const diffInMonths = Math.floor(diffInDays / 30)

  if (diffInMonths > 0) {
    return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`
  } else if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
  } else {
    return "Today"
  }
}

// Helper function to get status color and badge
const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "available":
      return { color: "bg-green-100 text-green-800", text: "Available" }
    case "pending":
      return { color: "bg-yellow-100 text-yellow-800", text: "Pending" }
    case "finished":
      return { color: "bg-blue-100 text-blue-800", text: "Finished" }
    default:
      return { color: "bg-gray-100 text-gray-800", text: status }
  }
}

// Helper function to determine ask type from product data
const getAskTypeFromProduct = (product: Product): string => {
  if (product.workerType) return "worker"
  if (product.engineerType) return "engineer"
  if (product.unitStatuses || product.unitWorkTypes || product.workSkills) return "home-renovate"
  if (product.unitArea && product.requiredDuration && !product.customPackage) return "request-design"
  if (product.customPackage) return "custom-package"
  return "engineer" // default
}

export function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate()
  const location = useLocation()
  console.log(product)

  const userContext = useContext(UserContext)
  const timeAgo = formatTimeAgo(product.createdDate)
  const statusBadge = getStatusBadge(product.askStatus)

  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }

  const { pathUrl } = userContext

  // Build full image URL if personalPhoto exists
  const getAvatarImageSrc = () => {
    if (product.user.personalPhoto) {
      return `${pathUrl}${product.user.personalPhoto}`
    }
    return null
  }

  const avatarImageSrc = getAvatarImageSrc()

  // Check request type
  const isWorkerRequest = !!product.workerType
  const isEngineerRequest = !!product.engineerType
  const isDesignRequest = !!product.unitArea && !!product.requiredDuration && !product.customPackage
  const isHomeRenovateRequest = !!product.unitStatuses || !!product.unitWorkTypes || !!product.workSkills
  const isCustomPackageRequest = !!product.customPackage

  const handleCardClick = () => {
    const askType = getAskTypeFromProduct(product)
    // Pass the current location as state so we can navigate back properly
    navigate(`/${askType}/${product.id}`, {
      state: { from: location.pathname },
    })
  }

  return (
    <Card
      className="group relative overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 ease-out bg-white border-0 rounded-2xl hover:border-blue-300 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Elegant gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 opacity-60"></div>

      {/* Bookmark Badge */}
      <div className="absolute -top-0.5 right-4 z-20 group-hover:scale-105 transition-transform duration-300">
        <div className="relative">
          <img src="/bookmark.png" alt="Bookmark" className="w-[36px] h-[63px] drop-shadow-lg" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-bold pt-1 px-0.5">
            <span className="text-[14px] leading-none">{product.requestCount}</span>
            <span className="text-[9px] leading-none mt-0.5 text-center">
              Order{product.requestCount > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      <CardContent className="relative p-6 space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <h3 className="font-bold text-xl text-gray-900 leading-tight pr-8 group-hover:text-blue-700 transition-colors duration-300">
            {product.projectName || "Untitled Project"}
          </h3>

          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <Badge
              className={`${statusBadge.color} px-3 py-1 text-xs font-semibold rounded-full hover:${statusBadge.color.split(" ")[0]}`}
            >
              {statusBadge.text}
            </Badge>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeAgo}
            </span>
          </div>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-4">
          <Avatar className="w-14 h-14 ring-2 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300">
            {avatarImageSrc ? (
              <AvatarImage src={avatarImageSrc || "/placeholder.svg"} alt={product.user.username} />
            ) : null}
            <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-lg">
              {product.user.username?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-bold text-blue-700 text-base">{product.user.username || "Unknown User"}</p>
            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {product?.city?.name ||
                product.user.city.code
                  .toLowerCase()
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
              {product.user.governorate ? "," : null}{" "}
              {product?.governorate?.name ||
                product.user.governorate.code
                  .toLowerCase()
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
            </p>
          </div>
        </div>

        {/* Custom Package Section (if applicable) */}
        {isCustomPackageRequest && product.customPackage && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-800">Custom Package</span>
            </div>
            <p className="font-bold text-lg text-purple-700">{product.customPackage?.name || ""}</p>
            <p className="text-lg font-bold text-green-600 mt-1">{product.customPackage.price.toLocaleString()} EGP</p>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Unit Type */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Building className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Unit</span>
            </div>
            <p className="text-sm font-semibold text-gray-900 pl-6">{product?.unitType?.name}</p>
          </div>

          {/* Compound Status (for custom package requests) */}
          {isCustomPackageRequest && product.isInsideCompound !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Home className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Location</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 pl-6">
                {product.isInsideCompound ? "Inside Compound" : "Outside Compound"}
              </p>
            </div>
          )}

          {/* Worker Type or Engineer Type or Unit Area */}
          {isWorkerRequest && product?.workerType && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Wrench className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Worker</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 pl-6">{product?.workerType?.name}</p>
            </div>
          )}

          {isEngineerRequest && product?.engineerType && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Engineer</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 pl-6">{product?.engineerType?.name}</p>
            </div>
          )}

          {isDesignRequest && product.unitArea && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Ruler className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Area</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 pl-6">{product.unitArea} m²</p>
            </div>
          )}

          {/* Budget (only if not custom package) */}
          {!isCustomPackageRequest && product.budget && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Budget</span>
              </div>
              <p className="text-lg font-bold text-green-600 pl-6">{product.budget.toLocaleString()} EGP</p>
            </div>
          )}

          {/* Material (for worker requests) or Urgency (for engineer requests) or Duration (for design requests) */}
          {isWorkerRequest && product.material && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Package className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Material</span>
              </div>
              <p className="text-sm font-semibold text-orange-600 pl-6">{product.material?.name}</p>
            </div>
          )}

          {isEngineerRequest && product.urgencyLevel && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Zap className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Urgency</span>
              </div>
              <p className="text-sm font-semibold text-orange-600 pl-6">{product.urgencyLevel?.name}</p>
            </div>
          )}

          {isDesignRequest && product.requiredDuration && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Duration</span>
              </div>
              <p className="text-sm font-semibold text-orange-600 pl-6">{product.requiredDuration} days</p>
            </div>
          )}

          {/* Unit Status (for home renovate requests) */}
          {isHomeRenovateRequest && product.unitStatuses && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Building className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Status</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 pl-6">{product.unitStatuses?.name}</p>
            </div>
          )}

          {/* Unit Work Type (for home renovate requests) */}
          {isHomeRenovateRequest && product.unitWorkTypes && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Wrench className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Work Type</span>
              </div>
              <p className="text-sm font-semibold text-gray-900 pl-6">{product.unitWorkTypes?.name}</p>
            </div>
          )}

          {/* Work Skills (for home renovate requests) */}
          {isHomeRenovateRequest && product.workSkills && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Zap className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Skills</span>
              </div>
              <p className="text-sm font-semibold text-green-600 pl-6">{product.workSkills?.name}</p>
            </div>
          )}
        </div>

        {/* Deadline Section (only for engineer requests) */}
        {isEngineerRequest && product.deadline && (
          <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: "#2D2D4C" }}>
            <div className="flex items-center justify-center gap-2 text-white">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-semibold">Deadline: {new Date(product.deadline).toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </CardContent>

      {/* Subtle hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"></div>
    </Card>
  )
}
