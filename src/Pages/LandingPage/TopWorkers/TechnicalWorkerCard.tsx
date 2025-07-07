"use client"

import type React from "react"

import { useState, useContext } from "react"
import { Star, MapPin, Briefcase, MessageCircle } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UserContext } from "@/Contexts/UserContext"
import { useNavigate } from "react-router-dom"
import { Engineer } from "../LandingPage"

// Technical Worker interfaces
interface WorkerType {
  id: number
  code: string
  name: string
  nameAr: string
  nameEn: string
}

interface WorkerService {
  id: number
  code: string
  name: string
  nameAr: string
  nameEn: string
}

interface UserType {
  id: number
  code: string
  name: string
}

interface Governorate {
  id: number
  code: string
  name: string
}

interface City {
  id: number
  code: string
  name: string
}

interface WorkerUser {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string | null
  personalPhoto: string | null
  coverPhoto: string | null
  userType: UserType
  governorate: Governorate
  city: City
  engineer: Engineer |null
  technicalWorker: TechnicalWorker | null
  engineeringOffice: unknown
  enabled: boolean
  business: unknown
}

export interface TechnicalWorker {
  id: number
  statusCode: number
  createdDate: string
  modifiedDate: string
  user: WorkerUser
  type: WorkerType
  yearsOfExperience: number
  workerServs: WorkerService[]
  bio: string
  facebookLink: string | null
  linkedinLink: string | null
  behanceLink: string | null
  averageRate: number
}

export default function TechnicalWorkerCard({ worker }: { worker: TechnicalWorker }) {
  const userContext = useContext(UserContext)
  const navigate = useNavigate()

  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }
  const { pathUrl } = userContext

  const [isHovered, setIsHovered] = useState(false)



  const handleCardClick = () => {
    navigate(`/technical-workers/${worker.id}`)
  }

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Handle contact action
    console.log("Contact technical worker:", worker.id)
  }

  // Safe property access with fallbacks
  const fullName = `${worker.user?.firstName || "Unknown"} ${worker.user?.lastName || "Worker"}`
  const profileImage = worker.user?.personalPhoto
    ? `${pathUrl}${worker.user.personalPhoto}`
    : worker.user.personalPhoto

  const workerType = worker.type?.name || worker.type?.nameEn || "Technical Worker"
  const cityName = worker.user?.city?.name || null
  const governorateName = worker.user?.governorate?.name || null
  const yearsOfExperience = worker.yearsOfExperience || 0
  const averageRate = worker.averageRate || 0
  const bio = worker.bio || ""
  const services = worker.workerServs || []

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col relative overflow-hidden cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Top Badge */}
      <div className="absolute top-3 left-3 z-10">
        <Badge className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">Top Worker</Badge>
      </div>


      {/* Profile Image */}
      <div className="flex-shrink-0 relative overflow-hidden p-4">
        <div className="relative h-48 w-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg flex items-center justify-center ${
                !profileImage ? "bg-gray-200 " : ""
              }`}
            >
              {profileImage ? (
                <img
                  src={profileImage || "/placeholder.svg"}
                  alt={fullName}
                  className="object-cover w-full h-full transition-transform duration-300"
                  style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
                />
              ) : (
                " N/A"
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Worker Info */}
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

        {/* Worker Type */}
        <p className="text-blue-600 font-medium text-sm mb-2">{workerType}</p>

        {/* Location */}
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <MapPin className="h-4 w-4 mr-1" />
{  governorateName || cityName?        <span>
            {cityName}, {governorateName}
          </span> : "N/A"}
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
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={handleContactClick}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Worker
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
