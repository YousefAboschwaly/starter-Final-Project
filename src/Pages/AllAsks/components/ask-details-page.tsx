"use client"

import { useParams, useNavigate, useLocation } from "react-router-dom"
import {
  ArrowLeft,
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
  Phone,
  FileText,
  Users,
  Layers,
  Loader2,
  Mail,
  CheckCircle,
  XCircle,
  MessageSquare,
  ImageIcon,
  Plus,
  Send,
  X,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useContext, useState, useEffect } from "react"
import { UserContext } from "@/Contexts/UserContext"
import {
  useAskDetails,
  type AskDetails,
  type AskWorkerDetails,
  type AskEngineerDetails,
  type RequestDesignDetails,
  type HomeRenovateDetails,
  type CustomPackageDetails,
} from "@/hooks/useAskDetails"

import axios from "axios"
import { useAskRequests } from "@/hooks/use-ask-requests"
import { useRequestActions } from "@/hooks/use-request-actions"

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Helper function to get status color and badge
const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "available":
      return { color: "bg-green-100 text-green-800 border-green-200", text: "Available" }
    case "pending":
      return { color: "bg-yellow-100 text-yellow-800 border-yellow-200", text: "Pending" }
    case "finished":
      return { color: "bg-blue-100 text-blue-800 border-blue-200", text: "Finished" }
    default:
      return { color: "bg-gray-100 text-gray-800 border-gray-200", text: status }
  }
}

// Helper function to get photos from ask details
const getPhotosFromAskDetails = (askDetails: AskDetails | null) => {
  if (!askDetails) return []

  // Handle different photo structures based on ask type
  if ("photos" in askDetails && Array.isArray(askDetails.photos)) {
    // For worker requests - photos are objects with id, askWorkerId, photoPath
    if (
      askDetails.photos.length > 0 &&
      typeof askDetails.photos[0] === "object" &&
      "photoPath" in askDetails.photos[0]
    ) {
      return (askDetails.photos as Array<{ photoPath: string | null | undefined }>)
        .filter((photo) => photo.photoPath !== null && photo.photoPath !== undefined)
        .map((photo) => ({
          id: (photo as unknown as { id: number }).id,
          photoPath: photo.photoPath as string,
        }))
    }

    // For engineer requests - photos are strings
    if (askDetails.photos.length > 0 && typeof askDetails.photos[0] === "string") {
      return (askDetails.photos as Array<string | null | undefined>)
        .filter((photoPath): photoPath is string => photoPath !== null && photoPath !== undefined)
        .map((photoPath, index) => ({
          id: index,
          photoPath: photoPath,
        }))
    }
  }

  return []
}
// Helper function to format request user name
interface User {
  firstName?: string;
  lastName?: string;
  username?: string;
}

const getRequestUserName = (user: User) => {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`
  }
  return user.username || "Unknown User"
}


// Helper function to check if ask status allows actions
const canShowActions = (askDetails: AskDetails | null) => {
  return askDetails?.askStatus?.toLowerCase() === "available"
}

// Type guards
const isWorkerDetails = (data: AskDetails): data is AskWorkerDetails => {
  return "workerType" in data && "material" in data
}

const isEngineerDetails = (data: AskDetails): data is AskEngineerDetails => {
  return "engineerType" in data && "urgencyLevel" in data
}

const isRequestDesignDetails = (data: AskDetails): data is RequestDesignDetails => {
  return "unitArea" in data && "requiredDuration" in data && !("customPackage" in data)
}

const isHomeRenovateDetails = (data: AskDetails): data is HomeRenovateDetails => {
  return "unitStatuses" in data && "unitWorkTypes" in data && "workSkills" in data
}

const isCustomPackageDetails = (data: AskDetails): data is CustomPackageDetails => {
  return "customPackage" in data
}

export function AskDetailsPage() {
  const { askType, askId } = useParams<{ askType: string; askId: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const userContext = useContext(UserContext)

  // Add Offer Modal States
  const [showOfferModal, setShowOfferModal] = useState(false)
  const [offerComment, setOfferComment] = useState("")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isSubmittingOffer, setIsSubmittingOffer] = useState(false)
  const [userType, setUserType] = useState<string | null>(null)

  const { data: askDetailsData, isLoading, isError, error } = useAskDetails(askType || "", askId || "", true)
  const {
    data: requestsData,
    isLoading: requestsLoading,
    isError: requestsError,
    refetch: refetchRequests,
  } = useAskRequests(askType || "", askId || "", true)
  const { acceptRequest, rejectRequest, isAccepting, isRejecting } = useRequestActions(askType || "", askId || "")

  const requests = requestsData?.data || []

  // Check user type from localStorage
  useEffect(() => {
    const storedUserType = localStorage.getItem("user-type")
    setUserType(storedUserType)
  }, [])

  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }

  const { pathUrl, userToken } = userContext
  const askDetails = askDetailsData?.data

  // Build full image URL if personalPhoto exists
  const getAvatarImageSrc = () => {
    if (askDetails?.user.personalPhoto) {
      return `${pathUrl}${askDetails.user.personalPhoto}`
    }
    return null
  }

  const avatarImageSrc = getAvatarImageSrc()

  const handleBack = () => {
    // Check if we came from a MyAsks page by looking at the referrer or state
    const referrer = document.referrer
    const isFromMyAsks = referrer.includes("/MyAsks/") || location.state?.from?.includes("/MyAsks/")

    if (isFromMyAsks) {
      // Go back to the specific MyAsks page
      navigate(-1)
    } else {
      // Go to All-Asks
      navigate("/All-Asks")
    }
  }

  // Enhanced contact functions
  const handleCall = (phoneNumber: string | null) => {
    if (phoneNumber) {
      // Clean the phone number (remove spaces, dashes, etc.)
      const cleanPhone = phoneNumber.replace(/[\s\-$$$$]/g, "")

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
                `Phone number copied to clipboard: ${phoneNumber}\n\nYou can now paste it into your phone app or calling software.`,
              )
            })
            .catch(() => {
              alert(
                `Client's phone number: ${phoneNumber}\n\nPlease use your phone or calling software to dial this number.`,
              )
            })
        } else {
          alert(
            `Client's phone number: ${phoneNumber}\n\nPlease use your phone or calling software to dial this number.`,
          )
        }
      }
    } else {
      alert("Phone number not available.")
    }
  }

  const handleSendMessage = (email: string | null, username: string | null, askType: string | undefined) => {
    if (email) {
      const subject = `Regarding your ${askType || "service"} request`
      const body = `Hello ${username || "Client"},

I saw your ${askType || "service"} request and I'm interested in helping you with your project.

I would like to discuss the details and provide you with a quote for the work.

Please let me know when would be a good time to talk.

Best regards`

      const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
      window.open(mailtoLink, "_blank")
    } else {
      alert("Email address not available.")
    }
  }

  // Add Offer Functions
  const handleAddOffer = () => {
    setShowOfferModal(true)
    setOfferComment("")
  }

  const handleCancelOffer = () => {
    setShowOfferModal(false)
    setOfferComment("")
    setShowConfirmation(false)
  }

  const handleSubmitOffer = () => {
    if (!offerComment.trim()) {
      alert("Please enter a comment for your offer.")
      return
    }
    setShowConfirmation(true)
  }

  const handleConfirmOffer = async () => {
    if (!askDetails || !askId || !pathUrl || !userToken) return

    setIsSubmittingOffer(true)

    try {
      let endpoint = ""
      let requestBody = {}

      // Determine API endpoint and body based on ask type
      const normalizedAskType = askType?.toLowerCase().trim()

      switch (normalizedAskType) {
        case "engineer":
        case "ask-engineer":
          endpoint = `${pathUrl}/api/v1/request-ask-engineer`
          requestBody = {
            askEngineer: { id: Number.parseInt(askId) },
            comment: offerComment,
            isAccepted: null,
            isFinished: null,
            isRejected: null,
          }
          break

        case "worker":
        case "ask-worker":
          endpoint = `${pathUrl}/api/v1/request-ask-worker`
          requestBody = {
            askWorker: { id: Number.parseInt(askId) },
            comment: offerComment,
            isAccepted: null,
            isFinished: null,
            isRejected: null,
          }
          break

        case "home-renovate":
        case "homerenovate":
        case "home_renovate":
          endpoint = `${pathUrl}/api/v1/request-home-renovate`
          requestBody = {
            homeRenovate: { id: Number.parseInt(askId) },
            comment: offerComment,
            isAccepted: null,
            isFinished: null,
            isRejected: null,
          }
          break

        case "custom-package":
        case "custompackage":
        case "custom_package":
          endpoint = `${pathUrl}/api/v1/request-select-custom-package`
          requestBody = {
            selectCustomPackage: { id: Number.parseInt(askId) },
            comment: offerComment,
            isAccepted: null,
            isFinished: null,
            isRejected: null,
          }
          break

        case "request-design":
        case "requestdesign":
          endpoint = `${pathUrl}/api/v1/request-request-design`
          requestBody = {
            askWorker: { id: Number.parseInt(askId) },
            comment: offerComment,
            isAccepted: null,
            isFinished: null,
            isRejected: null,
          }
          break

        default:
          throw new Error(`Unsupported ask type: ${askType}`)
      }

      const response = await axios.post(endpoint, requestBody, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Accept-Language": "en",
          "Content-Type": "application/json",
        },
      })

      if (response.status === 200 || response.status === 201) {
        alert("Your offer has been submitted successfully!")
        setShowOfferModal(false)
        setShowConfirmation(false)
        setOfferComment("")
        // Refresh the requests list
        refetchRequests()
      }
    } catch (error) {
      console.error("Error submitting offer:", error)
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          alert("Invalid request. Please check your offer details.")
        } else if (error.response?.status === 401) {
          alert("You are not authorized to make this offer. Please log in again.")
        } else if (error.response?.status === 409) {
          alert("You have already made an offer for this request.")
        } else {
          alert("Failed to submit offer. Please try again later.")
        }
      } else {
        alert("Network error. Please check your connection and try again.")
      }
    } finally {
      setIsSubmittingOffer(false)
    }
  }

  // Check if user can make offers (not general-user)
  const canMakeOffer = userType && userType !== "general user"
  console.log(userType , canMakeOffer)

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
          <p className="text-gray-500 text-lg">Loading ask details...</p>
        </div>
      </div>
    )
  }

  if (isError || !askDetails) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center py-12">
          <p className="text-red-500 mb-2 text-lg">Error loading ask details</p>
          <p className="text-gray-500 text-sm mb-4">{error?.message || "Please try again later"}</p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const statusBadge = getStatusBadge(askDetails.askStatus)

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2 hover:bg-gray-50 transition-colors duration-200 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>

          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {isWorkerDetails(askDetails) || isEngineerDetails(askDetails)
                ? askDetails.projectName
                : `${askType?.charAt(0).toUpperCase()}${askType?.slice(1)} Request`}
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Badge className={`${statusBadge.color} px-4 py-2 text-sm font-semibold rounded-full border`}>
                {statusBadge.text}
              </Badge>
              <span className="text-gray-500 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {formatDate(askDetails.createdDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - User Info & Contact */}
          <div className="space-y-6">
            {/* User Information */}
            <Card className="animate-in fade-in slide-in-from-left-4 duration-700 delay-100 shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  Client Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20 ring-4 ring-blue-100">
                    {avatarImageSrc ? (
                      <AvatarImage src={avatarImageSrc || "/placeholder.svg"} alt={askDetails.user.username} />
                    ) : null}
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-bold text-2xl">
                      {askDetails.user.username?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-bold text-2xl text-blue-700 mb-1">
                      {askDetails.user.username || "Unknown User"}
                    </p>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {askDetails.user.email}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Phone className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium">{askDetails.phoneNumber}</span>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <MapPin className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700 font-medium">
                      {isWorkerDetails(askDetails) || isEngineerDetails(askDetails)
                        ? `${askDetails.city.name}, ${askDetails.governorate.name}`
                        : isRequestDesignDetails(askDetails)
                          ? askDetails.governorate.name
                          : isHomeRenovateDetails(askDetails)
                            ? `${askDetails.city.name}, ${askDetails.governorate.name}`
                            : "Location not specified"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Request Statistics */}
            <Card className="animate-in fade-in slide-in-from-left-4 duration-700 delay-200 shadow-lg border-0 bg-gradient-to-br from-orange-50 to-red-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Zap className="w-5 h-5 text-orange-600" />
                  </div>
                  Request Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-5xl font-bold text-orange-600 mb-3">{askDetails.requestCount}</div>
                  <p className="text-gray-600 font-medium">Total Requests</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Actions */}
            <Card className="animate-in fade-in slide-in-from-left-4 duration-700 delay-300 shadow-lg border-0">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold"
                    onClick={() => handleCall(askDetails.phoneNumber)}
                  >
                    <Phone className="w-5 h-5 mr-3" />
                    Call Now
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent py-3 text-lg font-semibold border-2"
                    onClick={() =>
                      handleSendMessage(
                        askDetails.user.email,
                        askDetails.user.username || "Client",
                        askType || "service",
                      )
                    }
                  >
                    <User className="w-5 h-5 mr-3" />
                    Send Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Main Details */}
          <div className="xl:col-span-2 space-y-6">
            {/* Project Description (for Worker and Engineer) */}
            {(isWorkerDetails(askDetails) || isEngineerDetails(askDetails)) && (
              <Card className="animate-in fade-in slide-in-from-right-4 duration-700 delay-100 shadow-lg border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    Project Description
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed text-lg">{askDetails.projectDescription}</p>
                </CardContent>
              </Card>
            )}

            {/* Notes (for Request Design and Home Renovate) */}
            {(isRequestDesignDetails(askDetails) || isHomeRenovateDetails(askDetails)) && askDetails.notes && (
              <Card className="animate-in fade-in slide-in-from-right-4 duration-700 delay-100 shadow-lg border-0">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed text-lg">{askDetails.notes}</p>
                </CardContent>
              </Card>
            )}

            {/* Custom Package Details */}
            {isCustomPackageDetails(askDetails) && (
              <Card className="animate-in fade-in slide-in-from-right-4 duration-700 delay-100 shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Star className="w-5 h-5 text-purple-600" />
                    </div>
                    {askDetails.customPackage.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    <span className="text-3xl font-bold text-green-600">
                      {askDetails.customPackage.price.toLocaleString()} EGP
                    </span>
                  </div>
                  <div
                    className="prose prose-sm max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: askDetails.customPackage.details }}
                  />
                </CardContent>
              </Card>
            )}

            {/* Technical Specifications */}
            <Card className="animate-in fade-in slide-in-from-right-4 duration-700 delay-200 shadow-lg border-0">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Layers className="w-5 h-5 text-blue-600" />
                  </div>
                  Technical Specifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Unit Type */}
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Building className="w-4 h-4 text-blue-600" />
                      </div>
                      <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Unit Type</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{askDetails.unitType.name}</p>
                  </div>

                  {/* Budget */}
                  {"budget" in askDetails && (
                    <div className="bg-green-50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <DollarSign className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Budget</span>
                      </div>
                      <p className="text-xl font-bold text-green-600">{askDetails.budget.toLocaleString()} EGP</p>
                    </div>
                  )}

                  {/* Worker Type */}
                  {isWorkerDetails(askDetails) && (
                    <div className="bg-orange-50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Wrench className="w-4 h-4 text-orange-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                          Worker Type
                        </span>
                      </div>
                      <p className="text-xl font-bold text-gray-900">{askDetails.workerType.name}</p>
                    </div>
                  )}

                  {/* Material */}
                  {isWorkerDetails(askDetails) && (
                    <div className="bg-purple-50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Package className="w-4 h-4 text-purple-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Material</span>
                      </div>
                      <p className="text-xl font-bold text-purple-600">{askDetails.material.name}</p>
                    </div>
                  )}

                  {/* Engineer Type */}
                  {isEngineerDetails(askDetails) && (
                    <div className="bg-indigo-50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <User className="w-4 h-4 text-indigo-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                          Engineer Type
                        </span>
                      </div>
                      <p className="text-xl font-bold text-gray-900">{askDetails.engineerType.name}</p>
                    </div>
                  )}

                  {/* Urgency Level */}
                  {isEngineerDetails(askDetails) && (
                    <div className="bg-red-50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 rounded-lg">
                          <Zap className="w-4 h-4 text-red-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Urgency</span>
                      </div>
                      <p className="text-xl font-bold text-red-600">{askDetails.urgencyLevel.name}</p>
                    </div>
                  )}

                  {/* Unit Area */}
                  {(isRequestDesignDetails(askDetails) || isHomeRenovateDetails(askDetails)) && (
                    <div className="bg-teal-50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-100 rounded-lg">
                          <Ruler className="w-4 h-4 text-teal-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Unit Area</span>
                      </div>
                      <p className="text-xl font-bold text-teal-600">{askDetails.unitArea} m²</p>
                    </div>
                  )}

                  {/* Required Duration */}
                  {(isRequestDesignDetails(askDetails) || isHomeRenovateDetails(askDetails)) && (
                    <div className="bg-amber-50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <Calendar className="w-4 h-4 text-amber-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Duration</span>
                      </div>
                      <p className="text-xl font-bold text-amber-600">{askDetails.requiredDuration} days</p>
                    </div>
                  )}

                  {/* Home Renovate specific fields */}
                  {isHomeRenovateDetails(askDetails) && (
                    <>
                      <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded-lg">
                            <Building className="w-4 h-4 text-slate-600" />
                          </div>
                          <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                            Unit Status
                          </span>
                        </div>
                        <p className="text-xl font-bold text-gray-900">{askDetails.unitStatuses.name}</p>
                      </div>

                      <div className="bg-cyan-50 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-cyan-100 rounded-lg">
                            <Wrench className="w-4 h-4 text-cyan-600" />
                          </div>
                          <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                            Work Type
                          </span>
                        </div>
                        <p className="text-xl font-bold text-gray-900">{askDetails.unitWorkTypes.name}</p>
                      </div>

                      <div className="bg-emerald-50 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-emerald-100 rounded-lg">
                            <Zap className="w-4 h-4 text-emerald-600" />
                          </div>
                          <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                            Work Skills
                          </span>
                        </div>
                        <p className="text-xl font-bold text-emerald-600">{askDetails.workSkills.name}</p>
                      </div>

                      <div className="bg-rose-50 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-rose-100 rounded-lg">
                            <Users className="w-4 h-4 text-rose-600" />
                          </div>
                          <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Rooms</span>
                        </div>
                        <p className="text-xl font-bold text-gray-900">{askDetails.numberOfRooms} rooms</p>
                      </div>

                      <div className="bg-violet-50 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-violet-100 rounded-lg">
                            <Home className="w-4 h-4 text-violet-600" />
                          </div>
                          <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                            Bathrooms
                          </span>
                        </div>
                        <p className="text-xl font-bold text-gray-900">{askDetails.numberOfBathrooms} bathrooms</p>
                      </div>

                      <div className="bg-lime-50 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-lime-100 rounded-lg">
                            <Home className="w-4 h-4 text-lime-600" />
                          </div>
                          <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Location</span>
                        </div>
                        <p className="text-xl font-bold text-gray-900">
                          {askDetails.city.name}, {askDetails.governorate.name}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Add Offer Button - Only show for non-general users */}
            {canMakeOffer && canShowActions(askDetails) && (
              <Card className="animate-in fade-in slide-in-from-right-4 duration-700 delay-250 shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardContent className="p-6 text-center">
                  <Button
                    onClick={handleAddOffer}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <Plus className="w-5 h-5 mr-3" />
                    Add Offer
                  </Button>
                  <p className="text-gray-600 text-sm mt-3">Submit your professional offer for this project</p>
                </CardContent>
              </Card>
            )}

            {/* Photos Section */}
            {(() => {
              const photos = getPhotosFromAskDetails(askDetails)
              if (photos.length === 0) return null

              return (
                <Card className="animate-in fade-in slide-in-from-right-4 duration-700 delay-150 shadow-lg border-0">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-3 text-xl">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <ImageIcon className="w-5 h-5 text-purple-600" />
                      </div>
                      Project Photos ({photos.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {photos.map((photo, index) => (
                        <div key={photo.id || index} className="relative group">
                          <img
                            src={`${pathUrl}${photo.photoPath}`}
                            alt={`Project photo ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow duration-300"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg?height=200&width=300"
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
                            <button
                              onClick={() => window.open(`${pathUrl}${photo.photoPath}`, "_blank")}
                              className="opacity-0 group-hover:opacity-100 bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium transition-opacity duration-300"
                            >
                              View Full Size
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })()}

            {/* Requests Section */}
            <Card className="animate-in fade-in slide-in-from-right-4 duration-700 delay-200 shadow-lg border-0 overflow-hidden">
              <CardHeader className="pb-4 bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  Service Requests
                  <Badge className="ml-auto bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold">
                    {requests.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {requestsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                      <span className="text-gray-600 text-lg">Loading requests...</span>
                      <p className="text-gray-400 text-sm mt-2">Please wait while we fetch the latest requests</p>
                    </div>
                  </div>
                ) : requestsError ? (
                  <div className="text-center py-12 px-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <XCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="text-red-500 mb-2 text-lg font-semibold">Error loading requests</p>
                    <p className="text-gray-500 text-sm">Please try again later or contact support</p>
                  </div>
                ) : requests.length === 0 ? (
                  <div className="text-center py-16 px-6">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <MessageSquare className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">No requests yet</h3>
                    <p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed">
                      When professionals are interested in your project, their requests will appear here. Make sure your
                      project description is detailed to attract more requests.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {requests.map((request) => (
                      <div
                        key={request.id}
                        className="p-6 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-300 group"
                      >
                        {/* Request Header */}
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-start gap-4">
                            <div className="relative">
                              <Avatar className="w-16 h-16 ring-3 ring-white shadow-lg group-hover:ring-blue-200 transition-all duration-300">
                                {request.user.personalPhoto ? (
                                  <AvatarImage
                                    src={`${pathUrl}${request.user.personalPhoto}`}
                                    alt={getRequestUserName(request.user)}
                                    className="object-cover"
                                  />
                                ) : null}
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-xl">
                                  {getRequestUserName(request.user).charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              {/* Online indicator */}
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-bold text-xl text-gray-900 group-hover:text-blue-700 transition-colors">
                                  {getRequestUserName(request.user)}
                                </h4>
                                <Badge variant="outline" className="text-xs px-2 py-1">
                                  {request.user.userType?.name || "Professional"}
                                </Badge>
                              </div>

                              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4 text-blue-500" />
                                  <span className="font-medium">
                                    {request.user.city?.name || request.user.city?.nameEn},{" "}
                                    {request.user.governorate?.name || request.user.governorate?.nameEn}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>Requested {formatDate(request.createdDate)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Status badges */}
                          <div className="flex flex-col gap-2 items-end">
                            {request.isAccepted === true && (
                              <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1 font-semibold">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Accepted
                              </Badge>
                            )}
                            {request.isRejected === true && (
                              <Badge className="bg-red-100 text-red-800 border-red-200 px-3 py-1 font-semibold">
                                <XCircle className="w-4 h-4 mr-2" />
                                Rejected
                              </Badge>
                            )}
                            {request.isFinished === true && (
                              <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1 font-semibold">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Completed
                              </Badge>
                            )}
                            {request.isAccepted === null && request.isRejected === null && (
                              <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 px-3 py-1 font-semibold animate-pulse">
                                <Clock className="w-4 h-4 mr-2" />
                                Pending
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Comment Section */}
                        {request.comment && (
                          <div className="mb-6">
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl p-4 border-l-4 border-blue-400">
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg mt-1">
                                  <MessageSquare className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-semibold text-gray-700 mb-2">Professional's Message:</p>
                                  <p className="text-gray-800 leading-relaxed">{request.comment}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Contact Information */}
                        <div className="mb-6">
                          <h5 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-green-600" />
                            Contact Information
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <Mail className="w-4 h-4 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-gray-500 font-medium">Email</p>
                                <p className="text-sm text-gray-900 truncate">{request.user.email}</p>
                              </div>
                            </div>

                            {request.user.phone && (
                              <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
                                <div className="p-2 bg-green-100 rounded-lg">
                                  <Phone className="w-4 h-4 text-green-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-xs text-gray-500 font-medium">Phone</p>
                                  <p className="text-sm text-gray-900">{request.user.phone}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        {canShowActions(askDetails) && request.isAccepted === null && request.isRejected === null && (
                          <div className="flex gap-3 pt-4 border-t border-gray-200">
                            <Button
                              onClick={() => acceptRequest(request.id)}
                              disabled={isAccepting || isRejecting}
                              className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                            >
                              {isAccepting ? (
                                <>
                                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                  Accepting Request...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-5 h-5 mr-2" />
                                  Accept Request
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={() => rejectRequest(request.id)}
                              disabled={isAccepting || isRejecting}
                              variant="outline"
                              className="flex-1 border-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 py-3 font-semibold transition-all duration-300 transform hover:scale-[1.02]"
                            >
                              {isRejecting ? (
                                <>
                                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                  Rejecting Request...
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-5 h-5 mr-2" />
                                  Decline Request
                                </>
                              )}
                            </Button>
                          </div>
                        )}

                        {/* Quick Actions for Accepted Requests */}
                        {request.isAccepted === true && !request.isFinished && (
                          <div className="flex gap-3 pt-4 border-t border-gray-200">
                            <Button
                              onClick={() => handleCall(request.user.phone)}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2"
                            >
                              <Phone className="w-4 h-4 mr-2" />
                              Call Professional
                            </Button>
                            <Button
                              onClick={() =>
                                handleSendMessage(request.user.email, getRequestUserName(request.user), askType)
                              }
                              variant="outline"
                              className="flex-1 py-2"
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Send Message
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Offer Modal */}
        {showOfferModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Send className="w-6 h-6 text-blue-600" />
                    </div>
                    Add Your Offer
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelOffer}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="offer-comment" className="block text-sm font-semibold text-gray-700 mb-2">
                      Your Professional Offer
                    </label>
                    <Textarea
                      id="offer-comment"
                      placeholder="Describe your offer, timeline, pricing, and why you're the best choice for this project..."
                      value={offerComment}
                      onChange={(e) => setOfferComment(e.target.value)}
                      rows={6}
                      className="w-full resize-none border-2 border-gray-200 focus:border-blue-500 rounded-xl p-4"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Be specific about your timeline, pricing, and what makes your offer unique.
                    </p>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSubmitOffer}
                      disabled={!offerComment.trim()}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 font-semibold"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Offer
                    </Button>
                    <Button onClick={handleCancelOffer} variant="outline" className="flex-1 py-3 bg-transparent">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full">
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Your Offer</h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to submit this offer? This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <Button
                    onClick={handleConfirmOffer}
                    disabled={isSubmittingOffer}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 font-semibold"
                  >
                    {isSubmittingOffer ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Yes, Submit
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowConfirmation(false)}
                    disabled={isSubmittingOffer}
                    variant="outline"
                    className="flex-1 py-3"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
