"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, AlertCircle, CalendarIcon, ArrowRight, ArrowLeft } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { motion, AnimatePresence } from "framer-motion"
import { useNavigate } from "react-router-dom"
import FileUpload from "./file-upload"
import { cn } from "@/lib/utils"
import { Toaster } from "react-hot-toast"
import toast from "react-hot-toast"

interface LookupItem {
  id: number
  name: string
}

interface EngineerLookupData {
  engineerType: LookupItem[]
  unitType: LookupItem[]
  governorate: LookupItem[]
  urgencyLevel: LookupItem[]
}

interface WorkerLookupData {
  workerType: LookupItem[]
  unitType: LookupItem[]
  governorate: LookupItem[]
  material: LookupItem[]
}

interface City {
  id: number
  name: string
  governorate: {
    id: number
    name: string
  }
}

interface RequestFormProps {
  formType: "engineer" | "worker"
  pathUrl: string
  userToken: string | null
  onStepChange?: (step: number) => void
}

const ErrorMessage = ({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
    className="text-red-500 text-sm flex items-center mt-1"
  >
    <AlertCircle className="w-4 h-4 mr-1" />
    {message}
  </motion.div>
)

const AskEngWorker: React.FC<RequestFormProps> = ({ formType, pathUrl, userToken, onStepChange }) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [engineerLookupData, setEngineerLookupData] = useState<EngineerLookupData | null>(null)
  const [workerLookupData, setWorkerLookupData] = useState<WorkerLookupData | null>(null)
  const [cities, setCities] = useState<City[]>([])
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [step, setStep] = useState(1)
  console.log("Selected Files ", selectedFiles)
  // Notify parent component when step changes
  useEffect(() => {
    if (onStepChange) {
      onStepChange(step)
    }
  }, [step, onStepChange])

  useEffect(() => {
    const fetchLookupData = async () => {
      try {
        if (formType === "engineer") {
          const response = await axios.get(`${pathUrl}/api/v1/ask-engineer/lkps`, {
            headers: {
              "Accept-Language": "en",
              Authorization: `Bearer ${userToken}`,
            },
          })
          if (response.data.success) {
            setEngineerLookupData(response.data.data)
          }
        } else {
          const response = await axios.get(`${pathUrl}/api/v1/ask-worker/lkps`, {
            headers: {
              "Accept-Language": "en",
              Authorization: `Bearer ${userToken}`,
            },
          })
          if (response.data.success) {
            setWorkerLookupData(response.data.data)
          }
        }
      } catch (error) {
        console.error("Error fetching lookup data:", error)
      }
    }

    fetchLookupData()
  }, [formType, pathUrl, userToken])

  const fetchCities = useCallback(
    async (governorateId: number) => {
      try {
        const response = await axios.get(`${pathUrl}/api/v1/cities/governorate/${governorateId}`, {
          headers: {
            "Accept-Language": "en",
            Authorization: `Bearer ${userToken}`,
          },
        })
        if (response.data.success) {
          setCities(response.data.data)
        }
      } catch (error) {
        console.error("Error fetching cities:", error)
      }
    },
    [pathUrl, userToken],
  )

  // Common validation schema for both forms
  const baseValidationSchema = {
    projectName: Yup.string().required("Project name is required"),
    phoneNumber: Yup.string()
      .matches(/^01[0125][0-9]{8}$/, "Invalid phone number")
      .required("Phone number is required"),
    projectDescription: Yup.string().required("Project description is required"),
    unitTypeId: Yup.number().min(1, "Unit type is required").required("Unit type is required"),
    budget: Yup.number()
      .typeError("Budget must be a number")
      .positive("Budget must be positive")
      .required("Budget is required"),
    governorateId: Yup.number().min(1, "Governorate is required").required("Governorate is required"),
    cityId: Yup.number().min(1, "City is required").required("City is required"),
  }

  // Form-specific validation schemas
  const engineerValidationSchema = Yup.object({
    ...baseValidationSchema,
    engineerTypeId: Yup.number().min(1, "Engineer type is required").required("Engineer type is required"),
    urgencyLevelId: Yup.number().min(1, "Urgency level is required").required("Urgency level is required"),
    deadline: Yup.string().required("Deadline is required"),
  })

  const workerValidationSchema = Yup.object({
    ...baseValidationSchema,
    workerTypeId: Yup.number().min(1, "Worker type is required").required("Worker type is required"),
    materialId: Yup.number().min(1, "Material is required").required("Material is required"),
  })

  // Initialize formik with the appropriate validation schema
  const formik = useFormik({
    initialValues: {
      projectName:"",
      phoneNumber: "",
      projectDescription: "",
      engineerTypeId: 0,
      workerTypeId: 0,
      unitTypeId: 0,
      budget: "",
      governorateId: 0,
      cityId: 0,
      urgencyLevelId: 0,
      materialId: 0,
      deadline: "",
    },
    validationSchema: formType === "engineer" ? engineerValidationSchema : workerValidationSchema,
    onSubmit: async (values) => {
      setIsLoading(true)
      try {
        let formData: any = {}

        if (formType === "engineer") {
          formData = {
            phoneNumber: values.phoneNumber,
            projectName: values.projectName,
            projectDescription: values.projectDescription,
            engineerType: {
              id: values.engineerTypeId,
            },
            unitType: {
              id: values.unitTypeId,
            },
            budget: Number(values.budget),
            city: {
              id: values.cityId,
            },
            governorate: {
              id: values.governorateId,
            },
            urgencyLevel: {
              id: values.urgencyLevelId,
            },
            deadline: values.deadline,
          }
        } else {
          formData = {
            projectName: values.projectName,
            phoneNumber: values.phoneNumber,
            projectDescription: values.projectDescription,
            workerType: {
              id: values.workerTypeId,
            },
            unitType: {
              id: values.unitTypeId,
            },
            budget: Number(values.budget),
            city: {
              id: values.cityId,
            },
            governorate: {
              id: values.governorateId,
            },
            material: {
              id: values.materialId,
            },
          }
        }

        // If there are files, handle file upload first
        if (selectedFiles.length > 0) {
          // This is a placeholder for the file upload API
          // Replace with your actual file upload endpoint
          const fileFormData = new FormData()
          selectedFiles.forEach((file, index) => {
            fileFormData.append(`file${index}`, file)
          })
          // await axios.post(`${pathUrl}/api/v1/upload`, fileFormData);
          console.log("Files would be uploaded:", selectedFiles.map((f) => f.name).join(", "))
        }

        // Submit the form data
        const endpoint = formType === "engineer" ? "ask-engineer" : "ask-worker"
        const { data } = await axios.post(`${pathUrl}/api/v1/${endpoint}`, formData, {
          headers: {
            "Accept-Language": "en",
            Authorization: `Bearer ${userToken}`,
          },
        })
        console.log(`Response:`, data)
        if (data.success) {
          await uploadImages(data.data.id)
          // Don't navigate here, as navigation is now handled in uploadImages
        }
      } catch (error) {
        console.error("Error submitting form:", error)
        alert("Failed to submit request. Please try again.")
      } finally {
        setIsLoading(false)
      }
    },
  })

  useEffect(() => {
    if (formik.values.governorateId > 0) {
      fetchCities(formik.values.governorateId)
    }
  }, [fetchCities, formik.values.governorateId])

  // Fix for the date handling
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate)
    if (selectedDate) {
      // Format the date as a string in the format expected by the API
      const formattedDate = format(selectedDate, "yyyy-MM-dd")
      formik.setFieldValue("deadline", formattedDate)
    } else {
      formik.setFieldValue("deadline", "")
    }
  }

  const handleFileChange = (files: File[]) => {
    setSelectedFiles(files)
  }

  const handleNextStep = () => {
    // Validate first step fields
    const firstStepFields = ["projectName", "projectDescription", "phoneNumber", "unitTypeId"]

    // Add form-specific fields to first step validation
    if (formType === "engineer") {
      firstStepFields.push("engineerTypeId")
    } else {
      firstStepFields.push("workerTypeId")
    }

    // Touch all fields to trigger validation and show errors
    firstStepFields.forEach((field) => {
      formik.setFieldTouched(field, true, false)
    })

    // Force validation to run and update errors
    formik.validateForm().then((errors) => {
      // Check if any of the first step fields have errors
      const hasErrors = firstStepFields.some((field) => Object.keys(errors).includes(field))

      if (!hasErrors) {
        setStep(2)
      }
    })
  }
  async function uploadImages(id: number) {
    try {
      // Skip if no files to upload
      if (selectedFiles.length === 0) {
        toast.success(`${formType.charAt(0).toUpperCase() + formType.slice(1)} request submitted successfully!`, {
          duration: 2000,
          position: "top-center",
        })
        setTimeout(() => {
          navigate("/")
        }, 2000)
        return
      }

      // Step 1: Create an array of objects with the appropriate ID field based on form type
      const uploadedIndex = selectedFiles.map(() => {
        if (formType === "engineer") {
          return { askEngineerId: id }
        } else {
          return { askWorkerId: id }
        }
      })

      console.log("Preparing to upload images:", uploadedIndex)

      // Step 2: Call the first API to create image records
      const firstApiEndpoint =
        formType === "engineer"
          ? `${pathUrl}/api/v1/ask-engineer-photos/all`
          : `${pathUrl}/api/v1/ask-worker-photos/all`

      const { data } = await axios.post(firstApiEndpoint, uploadedIndex, {
        headers: {
          "Accept-Language": "en",
          Authorization: `Bearer ${userToken}`,
        },
      })

      if (data.success) {
        console.log("First API response:", data)

        // Step 3: For each returned image record, upload the actual file
        await Promise.all(
          data.data.map(async (fileRecord: { id: number }, index: number) => {
            const formData = new FormData()
            formData.append("file", selectedFiles[index])

            const pathId = formType === "engineer" ? "ASK_ENGINEER" : "ASK_WORKER"

            console.log(`Uploading file ${index + 1} to ID: ${fileRecord.id}`)

            const uploadResponse = await axios.post(
              `${pathUrl}/api/v1/file?pathId=${pathId}&id=${fileRecord.id}`,
              formData,
              {
                headers: {
                  "Accept-Language": "en",
                  Authorization: `Bearer ${userToken}`,
                  "Content-Type": "multipart/form-data",
                },
              },
            )

            console.log(`File ${index + 1} upload response:`, uploadResponse.data)
            return uploadResponse
          }),
        )

        // Show success toast notification
        toast.success(`${formType.charAt(0).toUpperCase() + formType.slice(1)} request submitted successfully!`, {
          duration: 2000,
          position: "top-center",
        })

        // Navigate after a short delay to allow the user to see the toast
        setTimeout(() => {
          navigate("/")
        }, 2000)
      }
    } catch (error) {
      console.error("Error uploading images:", error)
      toast.error("Error uploading images. Please try again.", {
        duration: 3000,
        position: "top-center",
      })
    }
  }

  const handleSubmitForm = () => {
    // Validate second step fields
    const secondStepFields = ["budget", "governorateId", "cityId"]

    // Add form-specific fields to second step validation
    if (formType === "engineer") {
      secondStepFields.push("urgencyLevelId", "deadline")
    } else {
      secondStepFields.push("materialId")
    }

    // Touch all fields to trigger validation and show errors
    secondStepFields.forEach((field) => {
      formik.setFieldTouched(field, true, false)
    })

    // Force validation to run and update errors
    formik.validateForm().then((errors) => {
      // Check if any of the second step fields have errors
      const hasErrors = secondStepFields.some((field) => Object.keys(errors).includes(field))

      if (!hasErrors) {
        formik.handleSubmit()
      }
    })
  }

  const handlePrevStep = () => {
    setStep(1)
  }

  // Animation variants
  const formVariants = {
    hidden: { opacity: 0, x: 0 },
    visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
    exit: { opacity: 0, x: 0 },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  // Render first step fields
  const renderStep1 = () => (
    <motion.div variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="projectName">Project Name</Label>
        <Input
          id="projectName"
          name="projectName"
          placeholder="Enter project name"
          value={formik.values.projectName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.projectName && formik.errors.projectName ? "border-red-500" : ""}
        />
        <AnimatePresence>
          {formik.touched.projectName && formik.errors.projectName && (
            <ErrorMessage message={formik.errors.projectName as string} />
          )}
        </AnimatePresence>
      </motion.div>

      {formType === "engineer" ? (
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="engineerTypeId">Engineering Type</Label>
          <Select
            name="engineerTypeId"
            onValueChange={(value) => formik.setFieldValue("engineerTypeId", Number(value))}
            value={formik.values.engineerTypeId ? formik.values.engineerTypeId.toString() : ""}
            onOpenChange={() => formik.setFieldTouched("engineerTypeId", true)}
          >
            <SelectTrigger
              className={formik.touched.engineerTypeId && formik.errors.engineerTypeId ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Select engineering type" />
            </SelectTrigger>
            <SelectContent>
              {engineerLookupData?.engineerType.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AnimatePresence>
            {formik.touched.engineerTypeId && formik.errors.engineerTypeId && (
              <ErrorMessage message={formik.errors.engineerTypeId as string} />
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="workerTypeId">Worker Type</Label>
          <Select
            name="workerTypeId"
            onValueChange={(value) => formik.setFieldValue("workerTypeId", Number(value))}
            value={formik.values.workerTypeId ? formik.values.workerTypeId.toString() : ""}
            onOpenChange={() => formik.setFieldTouched("workerTypeId", true)}
          >
            <SelectTrigger
              className={formik.touched.workerTypeId && formik.errors.workerTypeId ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Select worker type" />
            </SelectTrigger>
            <SelectContent>
              {workerLookupData?.workerType.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AnimatePresence>
            {formik.touched.workerTypeId && formik.errors.workerTypeId && (
              <ErrorMessage message={formik.errors.workerTypeId as string} />
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="unitTypeId">Unit Type</Label>
        <Select
          name="unitTypeId"
          onValueChange={(value) => formik.setFieldValue("unitTypeId", Number(value))}
          value={formik.values.unitTypeId ? formik.values.unitTypeId.toString() : ""}
          onOpenChange={() => formik.setFieldTouched("unitTypeId", true)}
        >
          <SelectTrigger className={formik.touched.unitTypeId && formik.errors.unitTypeId ? "border-red-500" : ""}>
            <SelectValue placeholder="Select unit type" />
          </SelectTrigger>
          <SelectContent>
            {formType === "engineer"
              ? engineerLookupData?.unitType.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))
              : workerLookupData?.unitType.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
          </SelectContent>
        </Select>
        <AnimatePresence>
          {formik.touched.unitTypeId && formik.errors.unitTypeId && (
            <ErrorMessage message={formik.errors.unitTypeId as string} />
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="projectDescription">Project Description</Label>
        <Textarea
          id="projectDescription"
          name="projectDescription"
          placeholder="Enter project description"
          value={formik.values.projectDescription}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.projectDescription && formik.errors.projectDescription ? "border-red-500" : ""}
        />
        <AnimatePresence>
          {formik.touched.projectDescription && formik.errors.projectDescription && (
            <ErrorMessage message={formik.errors.projectDescription as string} />
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input
          id="phoneNumber"
          name="phoneNumber"
          placeholder="Enter phone number"
          value={formik.values.phoneNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.phoneNumber && formik.errors.phoneNumber ? "border-red-500" : ""}
        />
        <AnimatePresence>
          {formik.touched.phoneNumber && formik.errors.phoneNumber && (
            <ErrorMessage message={formik.errors.phoneNumber as string} />
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div variants={itemVariants} className="pt-4">
        <Button
          type="button"
          className="w-full h-12 text-base font-medium btn primary-grad"
          onClick={handleNextStep}
        >
          Next
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>
    </motion.div>
  )

  // Render second step fields
  const renderStep2 = () => (
    <motion.div variants={formVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="budget">Budget</Label>
        <Input
          id="budget"
          name="budget"
          type="text"
          placeholder="Enter budget"
          value={formik.values.budget}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.budget && formik.errors.budget ? "border-red-500" : ""}
        />
        <AnimatePresence>
          {formik.touched.budget && formik.errors.budget && <ErrorMessage message={formik.errors.budget as string} />}
        </AnimatePresence>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="governorateId">Governorate</Label>
        <Select
          name="governorateId"
          onValueChange={(value) => {
            formik.setFieldValue("governorateId", Number(value))
            formik.setFieldValue("cityId", 0) // Reset city when governorate changes
          }}
          value={formik.values.governorateId ? formik.values.governorateId.toString() : ""}
          onOpenChange={() => formik.setFieldTouched("governorateId", true)}
        >
          <SelectTrigger
            className={formik.touched.governorateId && formik.errors.governorateId ? "border-red-500" : ""}
          >
            <SelectValue placeholder="Select governorate" />
          </SelectTrigger>
          <SelectContent>
            {formType === "engineer"
              ? engineerLookupData?.governorate.map((gov) => (
                  <SelectItem key={gov.id} value={gov.id.toString()}>
                    {gov.name}
                  </SelectItem>
                ))
              : workerLookupData?.governorate.map((gov) => (
                  <SelectItem key={gov.id} value={gov.id.toString()}>
                    {gov.name}
                  </SelectItem>
                ))}
          </SelectContent>
        </Select>
        <AnimatePresence>
          {formik.touched.governorateId && formik.errors.governorateId && (
            <ErrorMessage message={formik.errors.governorateId as string} />
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-2">
        <Label htmlFor="cityId">City</Label>
        <Select
          name="cityId"
          onValueChange={(value) => formik.setFieldValue("cityId", Number(value))}
          value={formik.values.cityId ? formik.values.cityId.toString() : ""}
          onOpenChange={() => formik.setFieldTouched("cityId", true)}
          disabled={!formik.values.governorateId || cities.length === 0}
        >
          <SelectTrigger className={formik.touched.cityId && formik.errors.cityId ? "border-red-500" : ""}>
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
        <AnimatePresence>
          {formik.touched.cityId && formik.errors.cityId && <ErrorMessage message={formik.errors.cityId as string} />}
        </AnimatePresence>
      </motion.div>

      {formType === "engineer" ? (
        <>
          <motion.div variants={itemVariants} className="space-y-2">
            <Label htmlFor="urgencyLevelId">Urgency Level</Label>
            <Select
              name="urgencyLevelId"
              onValueChange={(value) => formik.setFieldValue("urgencyLevelId", Number(value))}
              value={formik.values.urgencyLevelId ? formik.values.urgencyLevelId.toString() : ""}
              onOpenChange={() => formik.setFieldTouched("urgencyLevelId", true)}
            >
              <SelectTrigger
                className={formik.touched.urgencyLevelId && formik.errors.urgencyLevelId ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select urgency level" />
              </SelectTrigger>
              <SelectContent>
                {engineerLookupData?.urgencyLevel.map((level) => (
                  <SelectItem key={level.id} value={level.id.toString()}>
                    {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <AnimatePresence>
              {formik.touched.urgencyLevelId && formik.errors.urgencyLevelId && (
                <ErrorMessage message={formik.errors.urgencyLevelId as string} />
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div variants={itemVariants} className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="deadline"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                    formik.touched.deadline && formik.errors.deadline ? "border-red-500" : "",
                  )}
                  onClick={() => formik.setFieldTouched("deadline", true)}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            <AnimatePresence>
              {formik.touched.deadline && formik.errors.deadline && (
                <ErrorMessage message={formik.errors.deadline as string} />
              )}
            </AnimatePresence>
          </motion.div>
        </>
      ) : (
        <motion.div variants={itemVariants} className="space-y-2">
          <Label htmlFor="materialId">Material</Label>
          <Select
            name="materialId"
            onValueChange={(value) => formik.setFieldValue("materialId", Number(value))}
            value={formik.values.materialId ? formik.values.materialId.toString() : ""}
            onOpenChange={() => formik.setFieldTouched("materialId", true)}
          >
            <SelectTrigger className={formik.touched.materialId && formik.errors.materialId ? "border-red-500" : ""}>
              <SelectValue placeholder="Select material" />
            </SelectTrigger>
            <SelectContent>
              {workerLookupData?.material.map((mat) => (
                <SelectItem key={mat.id} value={mat.id.toString()}>
                  {mat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <AnimatePresence>
            {formik.touched.materialId && formik.errors.materialId && (
              <ErrorMessage message={formik.errors.materialId as string} />
            )}
          </AnimatePresence>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="space-y-2">
        <Label>Attach Photos & Attachments</Label>
        <FileUpload onFileChange={handleFileChange} />
      </motion.div>

      <motion.div variants={itemVariants} className="flex gap-2 pt-4">
        <Button type="button" variant="outline" className="w-1/2 h-12 text-base font-medium" onClick={handlePrevStep}>
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </Button>
        <Button
          type="button"
          className="w-1/2 h-12 text-base font-medium btn primary-grad"
          onClick={handleSubmitForm}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </motion.div>
    </motion.div>
  )

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        formik.handleSubmit()
      }}
    >
      <Toaster />
      <AnimatePresence mode="wait">{step === 1 ? renderStep1() : renderStep2()}</AnimatePresence>
    </form>
  )
}

export default AskEngWorker
