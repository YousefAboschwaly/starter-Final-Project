"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  Star,
  MapPin,
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

// Technical Worker data structure based on your API
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
  governorate: Governorate | null
  city: City | null
  enabled: boolean
}

interface TechnicalWorkerData {
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

export default function TechnicalWorkerDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const userContext = useContext(UserContext)

  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }
  const { pathUrl, userToken } = userContext

  const [worker, setWorker] = useState<TechnicalWorkerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch technical worker details
  useEffect(() => {
    const fetchWorkerDetails = async () => {
      if (!id || !pathUrl || !userToken) return

      try {
        setLoading(true)
        const response = await fetch(`${pathUrl}/api/v1/technical-workers/${id}`, {
          headers: {
            "Accept-Language": "en",
            Authorization: `Bearer ${userToken}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch technical worker details")
        }

        const data = await response.json()
        setWorker(data.data || data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch technical worker details")
      } finally {
        setLoading(false)
      }
    }

    fetchWorkerDetails()
  }, [id, pathUrl, userToken])

  const handleSendMessage = () => {
    if (worker?.user?.email) {
      const subject = `Inquiry about ${worker.type.name} services`
      const body = `Hello ${worker.user.firstName},

I am interested in your ${worker.type.name} services. I found your profile and would like to discuss a potential project.

Please let me know your availability for a consultation.

Best regards`

      const mailtoLink = `mailto:${worker.user.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      window.open(mailtoLink, "_blank")
    } else {
      alert("Email address not available for this technical worker.")
    }
  }

  const handleCall = () => {
    if (worker?.user?.phone) {
      // Clean the phone number (remove spaces, dashes, etc.)
      const cleanPhone = worker.user.phone.replace(/[\s\-$$$$]/g, "")

      // Check if it's a mobile device
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

      if (isMobile) {
        // On mobile devices, use tel: protocol
        window.location.href = `tel:${cleanPhone}`
      } else {
        // On desktop, show the phone number and offer to copy it
        if (navigator.clipboard) {
          navigator.clipboard
            .writeText(cleanPhone)
            .then(() => {
              alert(
                `Phone number copied to clipboard: ${worker.user.phone}\n\nYou can now paste it into your phone app or calling software.`,
              )
            })
            .catch(() => {
              alert(
                `Technical worker's phone number: ${worker.user.phone}\n\nPlease use your phone or calling software to dial this number.`,
              )
            })
        } else {
          alert(
            `Technical worker's phone number: ${worker.user.phone}\n\nPlease use your phone or calling software to dial this number.`,
          )
        }
      }
    } else {
      alert("Phone number not available for this technical worker.")
    }
  }

  const handleEmail = () => {
    if (worker?.user?.email) {
      const subject = `Professional Inquiry - ${worker.type.name}`
      const body = `Dear ${worker.user.firstName} ${worker.user.lastName},

I hope this email finds you well. I am reaching out regarding your professional services as a ${worker.type.name}.

I would appreciate the opportunity to discuss my project requirements with you.

Thank you for your time.

Best regards`

      const mailtoLink = `mailto:${worker.user.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      window.open(mailtoLink, "_blank")
    } else {
      alert("Email address not available for this technical worker.")
    }
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading technical worker details...</p>
        </motion.div>
      </div>
    )
  }

  if (error || !worker) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Technical Worker Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The technical worker you're looking for doesn't exist."}</p>
          <Button onClick={() => navigate(-1)} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </motion.div>
      </div>
    )
  }

  const fullName = `${worker.user.firstName} ${worker.user.lastName}`
  const profileImage = worker.user.personalPhoto
    ? `${pathUrl}${worker.user.personalPhoto}`
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Button - Only back button, no header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Button onClick={() => navigate(-1)} variant="ghost" size="sm" className="hover:bg-gray-100">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </motion.div>

          {/* Main Content - Better proportions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card - Smaller and more compact (1/3 width on large screens) */}
            <motion.div variants={fadeInUp} initial="initial" animate="animate" className="lg:col-span-1">
              <Card className="shadow-lg border-0 bg-white ">
                <CardContent className="p-8 text-center  flex flex-col">
                  {/* Profile Image - More reasonable size */}
                  <motion.div variants={scaleIn} className="relative inline-block mb-6">
                    <Avatar className="w-36 h-36 mx-auto border-4 border-gray-100 shadow-lg">
                      <AvatarImage src={profileImage || "/placeholder.svg"} alt={fullName} />
                      <AvatarFallback className="text-4xl font-bold bg-gradient-to-br from-blue-500 to-teal-600 text-white">
                        {worker.user.firstName[0]}
                        {worker.user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>

                    {/* Status Badge */}
                    {worker.user.enabled && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-3"
                      >
                        <CheckCircle className="h-6 w-6 text-white" />
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Basic Info - Larger text */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h1 className="text-2xl font-bold text-gray-800 mb-3">{fullName}</h1>
                    <p className="text-green-600 font-medium mb-4 text-base">{worker.type.name}</p>

                    {/* Rating - Larger */}
                    <div className="flex items-center justify-center mb-6">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-6 w-6 ${
                              i < Math.floor(worker.averageRate) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-3 text-lg text-gray-600">
                        {worker.averageRate > 0 ? worker.averageRate.toFixed(1) : "New"}
                      </span>
                    </div>

                    {/* Location - Larger */}
                    <div className="flex items-center justify-center text-gray-600 text-lg mb-4">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>
                        {[worker.user.city?.name, worker.user.governorate?.name].filter(Boolean).join(", ") ||
                          "Location not specified"}
                      </span>
                    </div>

                    {/* Experience - Larger */}
                    <div className="flex items-center justify-center text-gray-600 text-lg mb-8">
                      <Briefcase className="h-5 w-5 mr-2" />
                      <span>{worker.yearsOfExperience} years experience</span>
                    </div>
                  </motion.div>

                  <Separator className="my-8" />

                  {/* Contact Buttons - Larger */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-4"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSendMessage}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors flex items-center justify-center text-base"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Send Message
                    </motion.button>

                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleCall}
                        className="bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
                        disabled={!worker.user.phone}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleEmail}
                        className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Social Links - Larger */}
                  {(worker.facebookLink || worker.linkedinLink || worker.behanceLink) && (
                    <>
                      <Separator className="my-8" />
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Connect</h3>
                        <div className="flex justify-center space-x-4">
                          {worker.facebookLink && (
                            <motion.a
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              href={worker.facebookLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                            >
                              <Facebook className="h-6 w-6" />
                            </motion.a>
                          )}
                          {worker.linkedinLink && (
                            <motion.a
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              href={worker.linkedinLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white hover:bg-blue-800 transition-colors"
                            >
                              <Linkedin className="h-6 w-6" />
                            </motion.a>
                          )}
                          {worker.behanceLink && (
                            <motion.a
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              href={worker.behanceLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition-colors"
                            >
                              <Globe className="h-6 w-6" />
                            </motion.a>
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Details Section - Takes 2/3 of the width on large screens */}
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
                    <CardTitle className="flex items-center text-xl">
                      <User className="h-6 w-6 mr-3 text-blue-600" />
                      About {worker.user.firstName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {worker.bio || "Professional technical worker with expertise in various technical domains."}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Services Section */}
              <motion.div variants={slideIn}>
                <Card className="shadow-lg border-0 bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <Briefcase className="h-6 w-6 mr-3 text-blue-600" />
                      Services & Expertise ({worker.workerServs.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {worker.workerServs.map((service, index) => (
                        <motion.div
                          key={service.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          whileHover={{ scale: 1.02 }}
                          className="p-4 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-lg border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all"
                        >
                          <h4 className="font-semibold text-gray-800 ">{service.name}</h4>
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
                    <CardTitle className="flex items-center text-xl">
                      <Award className="h-6 w-6 mr-3 text-blue-600" />
                      Professional Information
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-600 font-medium">Worker Type:</span>
                          <Award className="h-5 w-5 text-green-600" />
                        </div>
                        <span className="font-bold text-green-700">{worker.type.name}</span>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-600 font-medium">Experience:</span>
                          <Briefcase className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="font-bold text-blue-700">{worker.yearsOfExperience} years</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600 font-medium">Status:</span>
                        <CheckCircle className="h-5 w-5 text-purple-600" />
                      </div>
                      <Badge variant={worker.user.enabled ? "default" : "secondary"} className="font-bold">
                        {worker.user.enabled ? "Active" : "Inactive"}
                      </Badge>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center text-lg">
                        <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                        Timeline
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600 font-medium">Joined:</span>
                          <span className="font-semibold">{formatDate(worker.createdDate)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600 font-medium">Last Updated:</span>
                          <span className="font-semibold">{formatDate(worker.modifiedDate)}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center text-lg">
                        <User className="h-5 w-5 mr-2 text-blue-600" />
                        Contact Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600 font-medium">Email:</span>
                          <span className="font-semibold text-sm">{worker.user.email}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600 font-medium">Phone:</span>
                          <span className="font-semibold">{worker.user.phone || "Not provided"}</span>
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
