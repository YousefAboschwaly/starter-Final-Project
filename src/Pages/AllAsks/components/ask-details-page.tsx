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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useContext } from "react"
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

  const { data: askDetailsData, isLoading, isError, error } = useAskDetails(askType || "", askId || "", true)

  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }

  const { pathUrl } = userContext
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
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold">
                    <Phone className="w-5 h-5 mr-3" />
                    Call Now
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent py-3 text-lg font-semibold border-2">
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
                          {askDetails.isInsideCompound ? "Inside Compound" : "Outside Compound"}
                        </p>
                      </div>
                    </>
                  )}

                  {/* Custom Package Location */}
                  {isCustomPackageDetails(askDetails) && (
                    <div className="bg-pink-50 rounded-xl p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-pink-100 rounded-lg">
                          <Home className="w-4 h-4 text-pink-600" />
                        </div>
                        <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Location</span>
                      </div>
                      <p className="text-xl font-bold text-gray-900">
                        {askDetails.isInsideCompound ? "Inside Compound" : "Outside Compound"}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Deadline (for Engineer) */}
            {isEngineerDetails(askDetails) && askDetails.deadline && (
              <Card className="animate-in fade-in slide-in-from-right-4 duration-700 delay-300 shadow-lg border-0 bg-gradient-to-r from-red-500 to-orange-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center gap-3 text-white">
                    <Clock className="w-6 h-6" />
                    <span className="text-xl font-bold">Deadline: {askDetails.deadline}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
