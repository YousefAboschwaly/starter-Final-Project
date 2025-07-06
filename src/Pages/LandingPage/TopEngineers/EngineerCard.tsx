"use client"

import type React from "react"

import { useState, useContext } from "react"
import { Star, MapPin, Briefcase, Heart, MessageCircle } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Engineer } from "../LandingPage"
import { UserContext } from "@/Contexts/UserContext"
import { Link } from "react-router-dom"

export default function EngineerCard({ engineer }: { engineer: Engineer }) {
  const userContext = useContext(UserContext)
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }
  const { pathUrl } = userContext

  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  // Safe property access with fallbacks
  const fullName = `${engineer.user?.firstName || "Unknown"} ${engineer.user?.lastName || "Engineer"}`
  const profileImage = engineer.user?.personalPhoto
    ? `${pathUrl}${engineer.user.personalPhoto}`
    : "/placeholder.svg?height=200&width=200"

  const engineerType = engineer.type?.name || engineer.type?.nameEn || "Engineer"
  const cityName = engineer.user?.city?.name || "Unknown City"
  const governorateName = engineer.user?.governorate?.name || "Unknown Location"
  const yearsOfExperience = engineer.yearsOfExperience || 0
  const averageRate = engineer.averageRate || 0
  const bio = engineer.bio || ""
  const services = engineer.engineerServ || []

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Top Badge */}
      <div className="absolute top-3 left-3 z-10">
        <Badge className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">Top Engineer</Badge>
      </div>

      {/* Wishlist Button */}
      <motion.button
        className="absolute top-3 right-3 z-10 bg-white rounded-full p-1.5 shadow-sm"
        onClick={toggleWishlist}
        whileTap={{ scale: 0.9 }}
      >
        <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
      </motion.button>

      <Link to={`/engineers/${engineer.id}`} className="flex flex-col flex-grow">
        {/* Profile Image */}
        <div className="flex-shrink-0 relative overflow-hidden p-4">
          <div className="relative h-48 w-full">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg">
                <img
                  src={profileImage || "/placeholder.svg"}
                  alt={fullName}
                  className="object-cover w-full h-full transition-transform duration-300"
                  style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=200&width=200"
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Engineer Info */}
        <div className="p-4 pt-0 flex-grow flex flex-col">
          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-gray-800 font-medium ml-1">{averageRate > 0 ? averageRate.toFixed(1) : "New"}</span>
            </div>
            <span className="text-gray-500 text-sm ml-2">({yearsOfExperience} years exp.)</span>
          </div>

          {/* Name */}
          <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">{fullName}</h3>

          {/* Engineer Type */}
          <p className="text-blue-600 font-medium text-sm mb-2">{engineerType}</p>

          {/* Location */}
          <div className="flex items-center text-gray-600 text-sm mb-3">
            <MapPin className="h-4 w-4 mr-1" />
            <span>
              {cityName}, {governorateName}
            </span>
          </div>

          {/* Services */}
          <div className="mb-3 flex-grow">
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <Briefcase className="h-4 w-4 mr-1" />
              <span>Services ({services.length})</span>
            </div>
            {services.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {services.slice(0, 2).map((service, index) => (
                  <Badge
                    key={service?.id || index}
                    variant="outline"
                    className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600 border-gray-200"
                  >
                    {service?.name || service?.nameEn || `Service ${index + 1}`}
                  </Badge>
                ))}
                {services.length > 2 && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600 border-gray-200">
                    +{services.length - 2} more
                  </Badge>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-xs">No services listed</p>
            )}
          </div>

          {/* Bio */}
          {bio && <p className="text-gray-600 text-sm line-clamp-2 mb-3">{bio}</p>}

          {/* Contact Button */}
          <div className="mt-auto">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                // Handle contact action
                console.log("Contact engineer:", engineer.id)
              }}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Engineer
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
