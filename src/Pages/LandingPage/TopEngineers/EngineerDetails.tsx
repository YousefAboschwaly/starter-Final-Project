"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Star,
  MapPin,
  Heart,
  MessageCircle,
  Phone,
  Mail,
  ArrowLeft,
  Award,
  Calendar,
  User,
  Briefcase,
  Facebook,
  Linkedin,
  Globe,
  CheckCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { UserContext } from "@/Contexts/UserContext"

// Engineer data structure based on your API
interface EngineerType {
  id: number
  code: string
  name: string
  nameAr: string
  nameEn: string
}

interface EngineerService {
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

interface EngineerUser {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  personalPhoto: string | null
  coverPhoto: string | null
  userType: UserType
  governorate: Governorate
  city: City
  enabled: boolean
}

interface EngineerData {
  id: number
  statusCode: number
  createdDate: string
  modifiedDate: string
  user: EngineerUser
  type: EngineerType
  yearsOfExperience: number
  engineerServ: EngineerService[]
  bio: string
  facebookLink: string | null
  linkedinLink: string | null
  behanceLink: string | null
  averageRate: number
}

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const slideIn = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
}

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
}

export default function EngineerDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const userContext = useContext(UserContext)

  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }
  const { pathUrl, userToken } = userContext

  const [engineer, setEngineer] = useState<EngineerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isWishlisted, setIsWishlisted] = useState(false)

  // Fetch engineer details
  useEffect(() => {
    const fetchEngineerDetails = async () => {
      if (!id || !pathUrl || !userToken) return

      try {
        setLoading(true)
        const response = await fetch(`${pathUrl}/api/v1/engineers/${id}`, {
          headers: {
            "Accept-Language": "en",
            Authorization: `Bearer ${userToken}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch engineer details")
        }

        const data = await response.json()
        setEngineer(data.data || data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch engineer details")
      } finally {
        setLoading(false)
      }
    }

    fetchEngineerDetails()
  }, [id, pathUrl, userToken])

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  const handleContact = () => {
    console.log("Contact engineer:", engineer?.id)
  }

  const handleCall = () => {
    if (engineer?.user?.phone) {
      window.open(`tel:${engineer.user.phone}`)
    }
  }

  const handleEmail = () => {
    if (engineer?.user?.email) {
      window.open(`mailto:${engineer.user.email}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading engineer details...</p>
        </motion.div>
      </div>
    )
  }

  if (error || !engineer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Engineer Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The engineer you're looking for doesn't exist."}</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </motion.div>
      </div>
    )
  }

  const fullName = `${engineer.user.firstName} ${engineer.user.lastName}`
  const profileImage = engineer.user.personalPhoto
    ? `${pathUrl}${engineer.user.personalPhoto}`
    : "/placeholder.svg?height=200&width=200"

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-sm border-b"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button onClick={() => navigate(-1)} variant="ghost" size="sm" className="hover:bg-gray-100">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleWishlist}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <motion.div variants={fadeInUp} initial="initial" animate="animate" className="lg:col-span-1">
              <Card className="shadow-lg border-0 bg-white">
                <CardContent className="p-6 text-center">
                  {/* Profile Image */}
                  <motion.div variants={scaleIn} className="relative inline-block mb-4">
                    <Avatar className="w-32 h-32 mx-auto border-4 border-gray-100 shadow-lg">
                      <AvatarImage src={profileImage || "/placeholder.svg"} alt={fullName} />
                      <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {engineer.user.firstName[0]}
                        {engineer.user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>

                    {/* Status Badge */}
                    {engineer.user.enabled && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2"
                      >
                        <CheckCircle className="h-4 w-4 text-white" />
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Basic Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">{fullName}</h1>
                    <p className="text-blue-600 font-medium mb-2">{engineer.type.name}</p>

                    {/* Rating */}
                    <div className="flex items-center justify-center mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(engineer.averageRate) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {engineer.averageRate > 0 ? engineer.averageRate.toFixed(1) : "New"}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center justify-center text-gray-600 text-sm mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>
                        {engineer.user.city.name}, {engineer.user.governorate.name}
                      </span>
                    </div>

                    {/* Experience */}
                    <div className="flex items-center justify-center text-gray-600 text-sm mb-6">
                      <Briefcase className="h-4 w-4 mr-1" />
                      <span>{engineer.yearsOfExperience} years experience</span>
                    </div>
                  </motion.div>

                  <Separator className="my-6" />

                  {/* Contact Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-3"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleContact}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Send Message
                    </motion.button>

                    <div className="grid grid-cols-2 gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCall}
                        className="bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-center text-sm"
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleEmail}
                        className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-3 rounded-lg font-medium transition-colors flex items-center justify-center text-sm"
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Email
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Social Links */}
                  {(engineer.facebookLink || engineer.linkedinLink || engineer.behanceLink) && (
                    <>
                      <Separator className="my-6" />
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Connect</h3>
                        <div className="flex justify-center space-x-3">
                          {engineer.facebookLink && (
                            <motion.a
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              href={engineer.facebookLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                            >
                              <Facebook className="h-5 w-5" />
                            </motion.a>
                          )}
                          {engineer.linkedinLink && (
                            <motion.a
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              href={engineer.linkedinLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white hover:bg-blue-800 transition-colors"
                            >
                              <Linkedin className="h-5 w-5" />
                            </motion.a>
                          )}
                          {engineer.behanceLink && (
                            <motion.a
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              href={engineer.behanceLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition-colors"
                            >
                              <Globe className="h-5 w-5" />
                            </motion.a>
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Details Section */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="lg:col-span-2 space-y-6"
            >
              {/* About Section */}
              <motion.div variants={slideIn}>
                <Card className="shadow-lg border-0 bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2 text-blue-600" />
                      About
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed">
                      {engineer.bio || "Professional engineer with expertise in various technical domains."}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Services Section */}
              <motion.div variants={slideIn}>
                <Card className="shadow-lg border-0 bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Briefcase className="h-5 w-5 mr-2 text-blue-600" />
                      Services ({engineer.engineerServ.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {engineer.engineerServ.map((service, index) => (
                        <motion.div
                          key={service.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                        >
                          <h4 className="font-medium text-gray-800 text-sm">{service.name}</h4>
                          <p className="text-xs text-gray-600 mt-1">{service.nameAr}</p>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Professional Info */}
              <motion.div variants={slideIn}>
                <Card className="shadow-lg border-0 bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="h-5 w-5 mr-2 text-blue-600" />
                      Professional Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Engineer Type:</span>
                        <span className="font-medium">{engineer.type.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Experience:</span>
                        <span className="font-medium">{engineer.yearsOfExperience} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <Badge variant={engineer.user.enabled ? "default" : "secondary"}>
                          {engineer.user.enabled ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Member Since:</span>
                        <span className="font-medium">{formatDate(engineer.createdDate)}</span>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Timeline
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Joined:</span>
                          <span>{formatDate(engineer.createdDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Last Updated:</span>
                          <span>{formatDate(engineer.modifiedDate)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
