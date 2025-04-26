"use client"

import type React from "react"

import { useState, useRef, useContext, useEffect, type FormEvent } from "react"
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  Menu,
  Building,
  FileText,
  CreditCard,
  UserSquare,
  ImageIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Toaster } from "react-hot-toast"
import toast from "react-hot-toast"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { UserContext } from "@/Contexts/UserContext"
import { ImageUpload } from "@/MyComponents/image-upload"
import EnhancedDocumentUpload from "./document-upload-section"

interface EngineeringOfficeField {
  id: number
  name?: string
  code?: string
}

interface EngineeringOfficeDepartment {
  id: number
  name?: string
  code?: string
}

interface EngineeringOfficeData {
  id: number
  statusCode: number
  user: {
    id: number
    firstName: string
    lastName: string
    email: string
    phone: string | null
    personalPhoto: string | null
    coverPhoto: string | null
    userType: {
      id: number
    }
    governorate: {
      id: number
      name?: string
      code?: string
    } | null
    city: {
      id: number
      name?: string
      code?: string
    } | null
    engineer: null
    technicalWorker: null
    engineeringOffice: null
    enabled: boolean
    business: null
  }
  tradeName: string
  description: string
  commercialRegisterPath: string | null
  taxCardPath: string | null
  personalCardPath: string | null
  engineeringOfficeField: EngineeringOfficeField
  engineeringOfficeDepartments: EngineeringOfficeDepartment[]
}

const EngineeringOfficeEditor = () => {
  const navigate = useNavigate()
  const userContext = useContext(UserContext)
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }
  const { userId, userToken, pathUrl } = userContext

  const [activeTab, setActiveTab] = useState("basic")
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Form Data
  const [officeData, setOfficeData] = useState<EngineeringOfficeData | null>(null)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [tradeName, setTradeName] = useState("")
  const [description, setDescription] = useState("")
  const [governates, setGovernates] = useState<{ id: number; name: string }[]>([])
  const [selectedGovernorate, setSelectedGovernorate] = useState<{
    id: number | null
    name: string
  } | null>(null)
  const [cities, setCities] = useState<{ id: number; name: string }[]>([])
  const [selectedCity, setSelectedCity] = useState<{
    id: number | null
    name: string
  } | null>(null)
  const [officeFields, setOfficeFields] = useState<EngineeringOfficeField[]>([])
  const [selectedOfficeField, setSelectedOfficeField] = useState<EngineeringOfficeField | null>(null)
  const [officeDepartments, setOfficeDepartments] = useState<EngineeringOfficeDepartment[]>([])
  const [selectedOfficeDepartments, setSelectedOfficeDepartments] = useState<EngineeringOfficeDepartment[]>([])

  // Document files
  const [personalPhoto, setPersonalPhoto] = useState<File | null>(null)
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null)
  const [commercialRegister, setCommercialRegister] = useState<File | null>(null)
  const [taxCard, setTaxCard] = useState<File | null>(null)
  const [personalCard, setPersonalCard] = useState<File | null>(null)

  // Document preview URLs
  const [previewImage, setPreviewImage] = useState<string | undefined>(undefined)
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | undefined>(undefined)
  const [commercialRegisterPreview, setCommercialRegisterPreview] = useState<string | undefined>(undefined)
  const [taxCardPreview, setTaxCardPreview] = useState<string | undefined>(undefined)
  const [personalCardPreview, setPersonalCardPreview] = useState<string | undefined>(undefined)

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    tradeName: "",
    description: "",
    city: "",
    officeField: "",
    officeDepartments: "",
    commercialRegister: "",
    taxCard: "",
    personalCard: "",
    personalPhoto: "",
    coverPhoto: "",
  })

  const basicRef = useRef<HTMLDivElement>(null)
  const officeDetailsRef = useRef<HTMLDivElement>(null)
  const documentsRef = useRef<HTMLDivElement>(null)

  // Upload documents function using the new API endpoint
  const uploadDocuments = async (engineeringOfficeId: number) => {
    try {
      const documentsToUpload = []

      // Collect all documents that need to be uploaded
      if (commercialRegister) {
        documentsToUpload.push({
          file: commercialRegister,
          pathId: "COMMERCIAL_REGISTER",
        })
      }

      if (taxCard) {
        documentsToUpload.push({
          file: taxCard,
          pathId: "TAX_CARD",
        })
      }

      if (personalCard) {
        documentsToUpload.push({
          file: personalCard,
          pathId: "PERSONAL_CARD",
        })
      }

      if (coverPhoto) {
        documentsToUpload.push({
          file: coverPhoto,
          pathId: "COVER_PHOTO",
        })
      }

      // Skip if no documents to upload
      if (documentsToUpload.length === 0) {
        return true
      }

      // Upload each document directly using the specified API endpoint
      const uploadResults = await Promise.all(
        documentsToUpload.map(async (doc) => {
          try {
            const formData = new FormData()
            formData.append("file", doc.file)

            const response = await axios.post(
              `${pathUrl}/api/v1/file?pathId=${doc.pathId}&id=${doc.pathId === "COVER_PHOTO" ? userId : engineeringOfficeId}`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${userToken}`,
                  "Content-Type": "multipart/form-data",
                },
              },
            )

            return response.data.success
          } catch (error) {
            console.error(`Error uploading file for ${doc.pathId}:`, error)
            return false
          }
        }),
      )

      // Check if all uploads were successful
      return uploadResults.every((result) => result === true)
    } catch (error) {
      console.error("Error uploading documents:", error)
      return false
    }
  }

  // Upload personal photo using the specific API endpoint
  const uploadPersonalPhoto = async () => {
    if (!personalPhoto) return true

    try {
      const formData = new FormData()
      formData.append("image", personalPhoto)

      const response = await axios.post(`${pathUrl}/api/v1/users/personal_photo`, formData, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      })

      return response.data.success
    } catch (error) {
      console.error("Error uploading personal photo:", error)
      return false
    }
  }

  const scrollToSection = (id: string) => {
    setActiveTab(id)
    const targetElement = document.getElementById(id)
    if (targetElement) {
      const yOffset = -80
      const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
      setIsOpen(false)
    }
  }

  const NavButton = ({
    id,
    label,
    icon: Icon,
  }: {
    id: string
    label: string
    icon: React.ComponentType<{ className?: string }>
  }) => (
    <Button
      variant={activeTab === id ? "secondary" : "ghost"}
      className="w-full justify-start mb-1"
      onClick={() => scrollToSection(id)}
    >
      <Icon className="w-4 h-4 mr-2" />
      {label}
    </Button>
  )

  const SidebarContent = () => (
    <nav className="space-y-1 p-2">
      <NavButton id="basic" label="Basic Information" icon={User} />
      <NavButton id="officeDetails" label="Office Details" icon={Building} />
      <NavButton id="documents" label="Documents" icon={FileText} />
    </nav>
  )

  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return re.test(email)
  }

  const validatePhone = (phone: string) => {
    const re = /^01[0125][0-9]{8}/
    return re.test(phone)
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = { ...errors }

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required"
      isValid = false
    } else {
      newErrors.firstName = ""
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required"
      isValid = false
    } else {
      newErrors.lastName = ""
    }

    if (!email.trim()) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email format"
      isValid = false
    } else {
      newErrors.email = ""
    }

    if (phone && !validatePhone(phone)) {
      newErrors.phone = "Invalid phone number format"
      isValid = false
    } else {
      newErrors.phone = ""
    }

    if (!tradeName.trim()) {
      newErrors.tradeName = "Trade name is required"
      isValid = false
    } else {
      newErrors.tradeName = ""
    }

    if (!description.trim()) {
      newErrors.description = "Description is required"
      isValid = false
    } else {
      newErrors.description = ""
    }

    if (selectedGovernorate?.id && !selectedCity?.id) {
      newErrors.city = "City is required when governorate is selected"
      isValid = false
    } else {
      newErrors.city = ""
    }

    if (!selectedOfficeField) {
      newErrors.officeField = "Office field is required"
      isValid = false
    } else {
      newErrors.officeField = ""
    }

    if (selectedOfficeDepartments.length === 0) {
      newErrors.officeDepartments = "At least one department is required"
      isValid = false
    } else {
      newErrors.officeDepartments = ""
    }

    // Only validate documents if they're not already uploaded
    if (!officeData?.commercialRegisterPath && !commercialRegister) {
      newErrors.commercialRegister = "Commercial register is required"
      isValid = false
    } else {
      newErrors.commercialRegister = ""
    }

    if (!officeData?.taxCardPath && !taxCard) {
      newErrors.taxCard = "Tax card is required"
      isValid = false
    } else {
      newErrors.taxCard = ""
    }

    if (!officeData?.personalCardPath && !personalCard) {
      newErrors.personalCard = "Personal card is required"
      isValid = false
    } else {
      newErrors.personalCard = ""
    }

    setErrors(newErrors)
    return isValid
  }

  const handleConfirmEdit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    const dataToSend = {
      id: officeData?.id,
      statusCode: officeData?.statusCode,
      user: {
        id: officeData?.user.id,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : null,
        personalPhoto: null, // Set to null as we'll upload it separately
        coverPhoto: null, // Set to null as we'll upload it separately
        userType: officeData?.user.userType,
        governorate: selectedGovernorate
          ? {
              id: selectedGovernorate.id,
              code: selectedGovernorate.name.toUpperCase(),
              name: selectedGovernorate.name,
            }
          : null,
        city: selectedCity
          ? {
              id: selectedCity.id,
              code: selectedCity.name.toUpperCase(),
              name: selectedCity.name,
            }
          : null,
        engineer: null,
        technicalWorker: null,
        engineeringOffice: null,
        enabled: true,
        business: null,
      },
      tradeName: tradeName.trim(),
      description: description.trim(),
      commercialRegisterPath: commercialRegisterPreview?.replace("https://home4u.gosoftcloud.com/", ""),
      taxCardPath: taxCardPreview?.replace("https://home4u.gosoftcloud.com/", ""),
      personalCardPath: personalCardPreview?.replace("https://home4u.gosoftcloud.com/", ""),
      engineeringOfficeField: selectedOfficeField,
      engineeringOfficeDepartments: selectedOfficeDepartments,
    }

    const cleanDataToSend = JSON.parse(JSON.stringify(dataToSend))

    console.log("Data to send to API ---->", cleanDataToSend)

    try {
      // Step 1: Update profile data
      const response = await axios.put(`${pathUrl}/api/v1/engineering-office`, cleanDataToSend, {
        headers: {
          "Accept-Language": "en",
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      })

      if (response.data.success) {
        const engineeringOfficeId = response.data.data.id || officeData?.id
        let uploadSuccess = true

        // Step 2: Upload personal photo if changed
        if (personalPhoto) {
          const photoSuccess = await uploadPersonalPhoto()
          if (!photoSuccess) {
            uploadSuccess = false
            toast.error("Failed to upload personal photo.")
          }
        }

        // Step 3: Upload all documents if changed
        if (commercialRegister || taxCard || personalCard || coverPhoto) {
          const documentsSuccess = await uploadDocuments(engineeringOfficeId)
          if (!documentsSuccess) {
            uploadSuccess = false
            toast.error("Failed to upload one or more documents.")
          }
        }

        if (uploadSuccess) {
          toast.success("Profile updated successfully!", {
            duration: 2000,
            position: "top-center",
          })

          setTimeout(() => {
            navigate("/profile")
            window.scrollTo({ top: 0, behavior: "smooth" })
          }, 2000)
        } else {
          toast.error("Profile updated but some files failed to upload.", {
            duration: 3000,
            position: "top-center",
          })
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      if (axios.isAxiosError(error) && error.response) {
        console.error("API Error Response:", error.response.data)
        toast.error(`Failed to update profile: ${error.response.data.message || "Please try again."}`)
      } else {
        toast.error("Failed to update profile. Please try again.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Fetch office data
  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    async function getOfficeData() {
      setIsLoading(true)
      try {
        const { data } = await axios.get(
          `${pathUrl}/api/v1/engineering-office/user?userId=${userId || localStorage.getItem("user-id")}`,
          {
            headers: {
              "Accept-Language": "en",
              Authorization: `Bearer ${userToken}`,
            },
            signal,
          },
        )

        const officeData = data.data
        setOfficeData(officeData)

        // Set form fields
        setFirstName(officeData.user.firstName)
        setLastName(officeData.user.lastName)
        setPhone(officeData.user.phone === "null" ? "" : officeData.user.phone)
        setEmail(officeData.user.email)
        setTradeName(officeData.tradeName || "")
        setDescription(officeData.description || "")

        // Set governorate and city
        if (officeData.user.governorate) {
          setSelectedGovernorate({
            id: officeData.user.governorate.id,
            name: officeData.user.governorate.name || officeData.user.governorate.code?.toLowerCase() || "",
          })
        }

        if (officeData.user.city) {
          setSelectedCity({
            id: officeData.user.city.id,
            name: officeData.user.city.name || officeData.user.city.code?.toLowerCase() || "",
          })
        }

        // Set office field
        if (officeData.engineeringOfficeField) {
          setSelectedOfficeField({
            id: officeData.engineeringOfficeField.id,
            name: officeData.engineeringOfficeField.name,
            code: officeData.engineeringOfficeField.code,
          })
        }

        // Set office departments
        if (officeData.engineeringOfficeDepartments && officeData.engineeringOfficeDepartments.length > 0) {
          setSelectedOfficeDepartments([...officeData.engineeringOfficeDepartments])
        }

        // Set preview images
        if (officeData.user.personalPhoto) {
          const imageUrl = `${pathUrl}/${officeData.user.personalPhoto}`
          setPreviewImage(imageUrl)
        }

        if (officeData.user.coverPhoto) {
          const imageUrl = `${pathUrl}/${officeData.user.coverPhoto}`
          setCoverPhotoPreview(imageUrl)
        }

        if (officeData.commercialRegisterPath) {
          const imageUrl = `${pathUrl}/${officeData.commercialRegisterPath}`
          setCommercialRegisterPreview(imageUrl)
        }

        if (officeData.taxCardPath) {
          const imageUrl = `${pathUrl}/${officeData.taxCardPath}`
          setTaxCardPreview(imageUrl)
        }

        if (officeData.personalCardPath) {
          const imageUrl = `${pathUrl}/${officeData.personalCardPath}`
          setPersonalCardPreview(imageUrl)
        }
      }  finally {
        setIsLoading(false)
      }
    }

    getOfficeData()

    return () => {
      controller.abort()
    }
  }, [userId, userToken, pathUrl])

  // Fetch governorates
  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    async function getGovernates() {
      try {
        const { data } = await axios.get(`${pathUrl}/api/v1/governorates`, {
          headers: {
            "Accept-Language": "en",
          },
          signal,
        })
        setGovernates(data.data)
      } catch (error) {
        console.error("Error fetching governorates:", error)
      }
    }

    getGovernates()

    return () => {
      controller.abort()
    }
  }, [pathUrl])

  // Fetch cities based on selected governorate
  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    async function getCities() {
      if (!selectedGovernorate?.id) return

      try {
        const { data } = await axios.get(`${pathUrl}/api/v1/cities/governorate/${selectedGovernorate.id}`, {
          headers: {
            "Accept-Language": "en",
          },
          signal,
        })
        setCities(data.data)
      } catch (error) {
        console.error("Error fetching cities:", error)
      }
    }

    getCities()

    return () => {
      controller.abort()
    }
  }, [pathUrl, selectedGovernorate?.id])

  // Fetch office fields
  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    async function getOfficeFields() {
      try {
        const { data } = await axios.get(`${pathUrl}/api/v1/engineering-office-field`, {
          headers: {
            "Accept-Language": "en",
          },
          signal,
        })
        setOfficeFields(data.data)
      } catch (error) {
        console.error("Error fetching office fields:", error)
      }
    }

    getOfficeFields()

    return () => {
      controller.abort()
    }
  }, [pathUrl])

  // Fetch office departments based on selected field
  useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    async function getOfficeDepartments() {
      if (!selectedOfficeField?.id) return

      try {
        const { data } = await axios.get(
          `${pathUrl}/api/v1/engineering-office-department/field/${selectedOfficeField.id}`,
          {
            headers: {
              "Accept-Language": "en",
            },
            signal,
          },
        )
        setOfficeDepartments(data.data)
      } catch (error) {
        console.error("Error fetching office departments:", error)
      }
    }

    getOfficeDepartments()

    return () => {
      controller.abort()
    }
  }, [pathUrl, selectedOfficeField?.id])

  // Ensure selected fields are updated when officeData changes
  useEffect(() => {
    if (!officeData) return

    // Only update office field if it's not already set (initial load)
    if (officeData.engineeringOfficeField && officeData.engineeringOfficeField.id && !selectedOfficeField) {
      console.log("Initial setting of office field from officeData:", officeData.engineeringOfficeField)
      setSelectedOfficeField({
        id: officeData.engineeringOfficeField.id,
        name: officeData.engineeringOfficeField.name || "",
        code: officeData.engineeringOfficeField.code || "",
      })
    }

    // Only update office departments if they're not already set (initial load)
    if (
      officeData.engineeringOfficeDepartments &&
      officeData.engineeringOfficeDepartments.length > 0 &&
      selectedOfficeDepartments.length === 0
    ) {
      console.log("Initial setting of office departments from officeData:", officeData.engineeringOfficeDepartments)
      const departmentsWithFullData = officeData.engineeringOfficeDepartments.map((dept) => ({
        id: dept.id,
        name: dept.name || "",
        code: dept.code || "",
      }))
      setSelectedOfficeDepartments(departmentsWithFullData)
    }
    // Only run this effect when officeData changes, not when selectedOfficeField or selectedOfficeDepartments change
  }, [officeData, selectedOfficeDepartments.length, selectedOfficeField])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8 pt-20">
      <div className="md:hidden fixed top-14 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 py-4 px-4 md:px-8 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to={"/profile"}>
            <Button
              variant="ghost"
              className="hover:bg-white/50 dark:hover:bg-gray-800/50 backdrop-blur-sm"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to profile
            </Button>
          </Link>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[280px]">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <Toaster />
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-[240px,1fr] gap-6">
          <Card className="h-fit backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-0 sticky top-28 shadow-lg hidden md:block">
            <Link to={"/profile"} className="secondary-grad rounded-md hidden md:block">
              <Button
                variant="ghost"
                className="hover:bg-transparent backdrop-blur-sm w-full justify-start"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <ChevronLeft className="w-4 h-4 mr-4" />
                Back to profile
              </Button>
            </Link>
            <SidebarContent />
          </Card>

          <form onSubmit={handleConfirmEdit}>
            <div className="space-y-6">
              <Card
                ref={basicRef}
                id="basic"
                className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-0 shadow-lg overflow-hidden pt-20"
              >
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-[200px,1fr] gap-8">
                    <div className="flex flex-col items-center space-y-4 mx-auto md:mx-0">
                      <div className="flex flex-col items-center gap-3">
                        <ImageUpload
                          defaultImage={previewImage}
                          onChange={(file) => {
                            if (file) {
                              setPersonalPhoto(file)
                              const imageUrl = URL.createObjectURL(file)
                              setPreviewImage(imageUrl)
                            } else {
                              setPersonalPhoto(null)
                              setPreviewImage(undefined)
                            }
                            setErrors((prev) => ({
                              ...prev,
                              personalPhoto: "",
                            }))
                          }}
                          className="w-32 h-32 md:w-40 md:h-40"
                        />
                        <span className="text-sm text-muted-foreground">Click to change profile picture</span>
                      </div>
                      {errors.personalPhoto && <p className="text-red-500 text-sm">{errors.personalPhoto}</p>}
                    </div>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            placeholder="Enter first name"
                            className={`mt-1 ${errors.firstName ? "border-red-500" : ""}`}
                            value={firstName}
                            onChange={(e) => {
                              setFirstName(e.target.value)
                              setErrors((prev) => ({ ...prev, firstName: "" }))
                            }}
                          />
                          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                        </div>

                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            placeholder="Enter last name"
                            className={`mt-1 ${errors.lastName ? "border-red-500" : ""}`}
                            value={lastName}
                            onChange={(e) => {
                              setLastName(e.target.value)
                              setErrors((prev) => ({ ...prev, lastName: "" }))
                            }}
                          />
                          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            className={`pl-10 mt-1 ${errors.email ? "border-red-500" : ""}`}
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value)
                              setErrors((prev) => ({ ...prev, email: "" }))
                            }}
                          />
                        </div>
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="Enter phone number"
                            className={`pl-10 mt-1 ${errors.phone ? "border-red-500" : ""}`}
                            value={phone ?? ""}
                            onChange={(e) => {
                              setPhone(e.target.value)
                              setErrors((prev) => ({ ...prev, phone: "" }))
                            }}
                          />
                        </div>
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                      </div>

                      <div>
                        <EnhancedDocumentUpload
                          label="Cover Photo"
                          newFile={coverPhoto}
                          existingFileUrl={coverPhotoPreview || null}
                          handleFileUpload={(file) => {
                            setCoverPhoto(file)
                            if (!file) {
                              setCoverPhotoPreview(undefined)
                            }
                            setErrors((prev) => ({
                              ...prev,
                              coverPhoto: "",
                            }))
                          }}
                          icon={<ImageIcon className="w-8 h-8 text-gray-400" />}
                          acceptedFileTypes=".jpg,.jpeg,.png"
                          description="Upload your cover photo"
                          documentType="cover-photo"
                        />
                        {errors.coverPhoto && <p className="text-red-500 text-sm mt-1">{errors.coverPhoto}</p>}
                      </div>

                      <div>
                        <Label htmlFor="governate">Governate</Label>
                        <Select
                          value={selectedGovernorate?.id?.toString() ?? ""}
                          onValueChange={(id) => {
                            const selected = governates.find((gov) => gov.id.toString() === id)

                            if (selected && selectedGovernorate?.id !== selected.id) {
                              setSelectedCity(null)
                            }

                            setSelectedGovernorate((prev) =>
                              selected ? { id: selected.id, name: selected.name } : prev,
                            )

                            setErrors((prev) => ({ ...prev, city: "" }))
                          }}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select governorate" />
                          </SelectTrigger>
                          <SelectContent>
                            {governates.map((gover) => (
                              <SelectItem key={gover.id} value={gover.id.toString()}>
                                {gover.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="city">City</Label>
                        <Select
                          value={selectedCity?.id?.toString() ?? ""}
                          onValueChange={(id) => {
                            const selected = cities.find((city) => city.id.toString() === id)
                            setSelectedCity((prev) => (selected ? { id: selected.id, name: selected.name } : prev))
                            setErrors((prev) => ({ ...prev, city: "" }))
                          }}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select city" />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem key={city.id} value={city.id.toString()}>
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                ref={officeDetailsRef}
                id="officeDetails"
                className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-0 shadow-lg pt-20"
              >
                <CardHeader>
                  <h2 className="text-xl font-semibold">Office Details</h2>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="tradeName">Trade Name</Label>
                    <Input
                      id="tradeName"
                      placeholder="Enter office trade name"
                      className={`mt-1 ${errors.tradeName ? "border-red-500" : ""}`}
                      value={tradeName}
                      onChange={(e) => {
                        setTradeName(e.target.value)
                        setErrors((prev) => ({ ...prev, tradeName: "" }))
                      }}
                    />
                    {errors.tradeName && <p className="text-red-500 text-sm mt-1">{errors.tradeName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter office description"
                      className={`min-h-[100px] mt-1 ${errors.description ? "border-red-500" : ""}`}
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value)
                        setErrors((prev) => ({ ...prev, description: "" }))
                      }}
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </div>

                  <div>
                    <Label htmlFor="officeField">Office Field</Label>
                    <Select
                      value={selectedOfficeField?.id?.toString() || ""}
                      onValueChange={(id) => {
                        const selected = officeFields.find((field) => field.id.toString() === id)

                        // Clear selected departments if field changes
                        if (selected && selectedOfficeField?.id !== selected.id) {
                          setSelectedOfficeDepartments([])
                        }

                        setSelectedOfficeField(selected || null)
                        setErrors((prev) => ({ ...prev, officeField: "" }))
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select office field" />
                      </SelectTrigger>
                      <SelectContent>
                        {officeFields.map((field) => (
                          <SelectItem key={field.id} value={field.id.toString()}>
                            {field.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.officeField && <p className="text-red-500 text-sm mt-1">{errors.officeField}</p>}
                  </div>

                  <div>
                    <Label htmlFor="officeDepartments">Office Departments</Label>
                    {errors.officeDepartments && (
                      <p className="text-red-500 text-sm mt-1">{errors.officeDepartments}</p>
                    )}
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {officeDepartments.map((department) => {
                        const isSelected = selectedOfficeDepartments.some((d) => d.id === department.id)
                        return (
                          <div
                            key={department.id}
                            onClick={() => {
                              if (isSelected) {
                                setSelectedOfficeDepartments(
                                  selectedOfficeDepartments.filter((d) => d.id !== department.id),
                                )
                              } else {
                                setSelectedOfficeDepartments([...selectedOfficeDepartments, department])
                              }
                              setErrors((prev) => ({
                                ...prev,
                                officeDepartments: "",
                              }))
                            }}
                            className={`relative cursor-pointer rounded-lg p-4 transition-all duration-200 ${
                              isSelected
                                ? "bg-primary/10 border-2 border-primary shadow-md"
                                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary/50"
                            }`}
                          >
                            <div className="flex items-center">
                              <div
                                className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                                  isSelected ? "bg-primary" : "border-2 border-gray-300"
                                }`}
                              >
                                {isSelected && <span className="text-white text-xs">✓</span>}
                              </div>
                              <span
                                className={`text-sm font-medium ${isSelected ? "text-primary" : "text-gray-700 dark:text-gray-300"}`}
                              >
                                {department.name}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    {officeDepartments.length === 0 && selectedOfficeField && (
                      <div className="mt-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <p className="text-sm text-amber-800 dark:text-amber-400">
                          Please select an office field to see available departments.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card
                ref={documentsRef}
                id="documents"
                className="backdrop-blur-sm bg-white/50 dark:bg-gray-800/50 border-0 shadow-lg pt-20"
              >
                <CardHeader>
                  <h2 className="text-xl font-semibold">Documents</h2>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <EnhancedDocumentUpload
                      label="Commercial Register"
                      newFile={commercialRegister}
                      existingFileUrl={commercialRegisterPreview || null}
                      handleFileUpload={(file) => {
                        setCommercialRegister(file)
                        if (!file) {
                          setCommercialRegisterPreview(undefined)
                        }
                        setErrors((prev) => ({
                          ...prev,
                          commercialRegister: "",
                        }))
                      }}
                      icon={<FileText className="w-8 h-8 text-gray-400" />}
                      acceptedFileTypes=".pdf,.jpg,.jpeg,.png"
                      description="Upload your commercial register document"
                      documentType="commercial-register"
                    />
                    {errors.commercialRegister && (
                      <p className="text-red-500 text-sm mt-1">{errors.commercialRegister}</p>
                    )}
                  </div>

                  <div className="mt-6">
                    <EnhancedDocumentUpload
                      label="Tax Card"
                      newFile={taxCard}
                      existingFileUrl={taxCardPreview || null}
                      handleFileUpload={(file) => {
                        setTaxCard(file)
                        if (!file) {
                          setTaxCardPreview(undefined)
                        }
                        setErrors((prev) => ({
                          ...prev,
                          taxCard: "",
                        }))
                      }}
                      icon={<CreditCard className="w-8 h-8 text-gray-400" />}
                      acceptedFileTypes=".pdf,.jpg,.jpeg,.png"
                      description="Upload your tax card document"
                      documentType="tax-card"
                    />
                    {errors.taxCard && <p className="text-red-500 text-sm mt-1">{errors.taxCard}</p>}
                  </div>

                  <div className="mt-6">
                    <EnhancedDocumentUpload
                      label="Personal Card"
                      newFile={personalCard}
                      existingFileUrl={personalCardPreview || null}
                      handleFileUpload={(file) => {
                        setPersonalCard(file)
                        if (!file) {
                          setPersonalCardPreview(undefined)
                        }
                        setErrors((prev) => ({
                          ...prev,
                          personalCard: "",
                        }))
                      }}
                      icon={<UserSquare className="w-8 h-8 text-gray-400" />}
                      acceptedFileTypes=".pdf,.jpg,.jpeg,.png"
                      description="Upload your personal ID card"
                      documentType="personal-card"
                    />
                    {errors.personalCard && <p className="text-red-500 text-sm mt-1">{errors.personalCard}</p>}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 text-lg font-semibold shadow-lg transition-all duration-200 ease-in-out hover:scale-105"
                  disabled={Object.values(errors).some((error) => error !== "") || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="mr-2">Saving...</span>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EngineeringOfficeEditor
