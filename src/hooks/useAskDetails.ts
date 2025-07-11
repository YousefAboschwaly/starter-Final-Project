"use client"

import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import axios from "axios"
import { UserContext } from "../Contexts/UserContext"
import type { IBusinessType } from "@/interfaces"

// Base interfaces for common fields
export interface BaseUser {
  id: number
  statusCode: number
  createdDate: string
  modifiedDate: string
  username: string
  email: string
  phone: string | null
  userType: {
    id: number
    code: string
    name: string | null
  }
  governorate: {
    id: number
    code: string
    name: string
  } | null
  city: {
    id: number
    code: string
    name: string
  } | null
  business: IBusinessType | null
  personalPhoto: string | null
}

export interface BaseUnitType {
  id: number
  code: string
  name: string
  nameAr: string
  nameEn: string
}

export interface BaseGovernorate {
  id: number
  code: string
  name: string
}

export interface BaseCity {
  id: number
  code: string
  name: string
}

// Ask Worker specific interfaces
export interface WorkerType {
  id: number
  code: string
  name: string
  nameAr: string
  nameEn: string
}

export interface Material {
  id: number
  code: string
  name: string
}

export interface WorkerPhoto {
  id: number
  askWorkerId: number
  photoPath: string | null
}

export interface AskWorkerDetails {
  id: number
  statusCode: number
  createdDate: string
  modifiedDate: string
  projectName: string
  phoneNumber: string
  projectDescription: string
  workerType: WorkerType
  unitType: BaseUnitType
  city: BaseCity
  governorate: BaseGovernorate
  material: Material
  budget: number
  photos: WorkerPhoto[]
  user: BaseUser
  requestCount: number
  askStatus: string
}

// Ask Engineer specific interfaces
export interface EngineerType {
  id: number
  code: string
  name: string
  nameAr: string
  nameEn: string
}

export interface UrgencyLevel {
  id: number
  code: string
  name: string
  nameAr: string
  nameEn: string
}

export interface AskEngineerDetails {
  id: number
  statusCode: number
  createdDate: string
  modifiedDate: string
  phoneNumber: string
  projectName: string
  projectDescription: string
  engineerType: EngineerType
  unitType: BaseUnitType
  budget: number
  city: BaseCity
  governorate: BaseGovernorate
  urgencyLevel: UrgencyLevel
  deadline: string
  photos: string[]
  user: BaseUser
  requestCount: number
  askStatus: string
}

// Request Design specific interfaces
export interface RequestDesignDetails {
  id: number
  statusCode: number
  createdDate: string
  modifiedDate: string
  phoneNumber: string
  unitType: BaseUnitType
  governorate: BaseGovernorate
  unitArea: number
  budget: number
  requiredDuration: number
  notes: string
  user: BaseUser
  requestCount: number
  askStatus: string
}

// Home Renovate specific interfaces
export interface UnitStatus {
  id: number
  code: string
  name: string
  nameAr: string
  nameEn: string
}

export interface UnitWorkType {
  id: number
  code: string
  name: string
  nameAr: string
  nameEn: string
}

export interface WorkSkill {
  id: number
  code: string
  name: string
  nameAr: string
  nameEn: string
}

export interface HomeRenovateDetails {
  id: number
  statusCode: number
  createdDate: string
  modifiedDate: string
  user: BaseUser
  phoneNumber: string
  isInsideCompound: boolean
  unitType: BaseUnitType
  unitStatuses: UnitStatus
  unitWorkTypes: UnitWorkType
  workSkills: WorkSkill
  city: BaseCity
  governorate: BaseGovernorate
  unitArea: number
  budget: number
  region: number
  numberOfRooms: number
  numberOfBathrooms: number
  requiredDuration: number
  notes: string
  requestCount: number
  askStatus: string
}

// Custom Package specific interfaces
export interface CustomPackage {
  id: number
  statusCode: number
  createdDate: string
  modifiedDate: string
  name: string
  nameAr: string
  nameEn: string
  price: number
  details: string
  detailsAr: string
  detailsEn: string
}

export interface CustomPackageDetails {
  id: number
  statusCode: number
  createdDate: string
  modifiedDate: string
  phoneNumber: string
  isInsideCompound: boolean
  unitType: BaseUnitType
  customPackage: CustomPackage
  user: BaseUser
  requestCount: number
  askStatus: string
}

// Union type for all ask details
export type AskDetails =
  | AskWorkerDetails
  | AskEngineerDetails
  | RequestDesignDetails
  | HomeRenovateDetails
  | CustomPackageDetails

// Response interface
export interface AskDetailsResponse {
  success: boolean
  status: number
  data: AskDetails
}

export function useAskDetails(askType: string, askId: string | number, enabled = true) {
  console.log("useAskDetails called with type:", askType, "and ID:", askId)
  const userContext = useContext(UserContext)

  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }

  const { pathUrl, userToken } = userContext

  // Determine API endpoint based on ask type
  const getApiEndpoint = (type: string, id: string | number): string | null => {
    const normalizedType = type.toLowerCase().trim()

    console.log("Getting API endpoint for type:", normalizedType, "ID:", id)

    switch (normalizedType) {
      case "worker":
      case "ask-worker":
        return `/api/v1/ask-worker/${id}`
      case "engineer":
      case "ask-engineer":
        return `/api/v1/ask-engineer/${id}`
      case "request-design":
      case "requestdesign":
        return `/api/v1/request-design/${id}`
      case "home-renovate":
      case "homerenovate":
      case "home_renovate":
        return `/api/v1/home-renovate/${id}`
      case "custom-package":
      case "custompackage":
      case "custom_package":
        return `/api/v1/select-custom-package/${id}`
      default:
        console.error("Unknown ask type:", type)
        return null
    }
  }

  return useQuery<AskDetailsResponse, Error>(
    ["ask-details", askType, askId],
    async () => {
      // Validate all required parameters
      if (!askType) {
        throw new Error("Ask type is required")
      }

      if (!askId) {
        throw new Error("Ask ID is required")
      }

      if (!pathUrl) {
        throw new Error("Path URL is not available")
      }

      if (!userToken) {
        throw new Error("User token is not available")
      }

      const endpoint = getApiEndpoint(askType, askId)

      if (!endpoint) {
        throw new Error(
          `Invalid ask type: ${askType}. Supported types: worker, engineer, request-design, home-renovate, custom-package`,
        )
      }

      const fullUrl = `${pathUrl}${endpoint}`

      console.log("Making request to:", fullUrl)
      console.log("With headers:", {
        Authorization: `Bearer ${userToken ? "***" : "MISSING"}`,
        "Accept-Language": "en",
      })

      try {
        const response = await axios.get(fullUrl, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Accept-Language": "en",
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 second timeout
        })

        console.log("Response received:", response.status, response.data)
        return response.data
      } catch (error) {
        console.error("Request failed:", error)

        if (axios.isAxiosError(error)) {
          if (error.code === "ERR_NETWORK") {
            throw new Error(
              `Network error: Unable to connect to ${fullUrl}. Please check your internet connection and server status.`,
            )
          } else if (error.response) {
            throw new Error(`Server error: ${error.response.status} - ${error.response.statusText}`)
          } else if (error.request) {
            throw new Error("No response received from server. Please check your network connection.")
          }
        }

        throw error
      }
    },
    {
      enabled: enabled && !!askId && !!askType && !!pathUrl && !!userToken,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on certain errors
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404 || error.response?.status === 403) {
            return false
          }
        }
        return failureCount < 2
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      onError: (error) => {
        console.error("useAskDetails query error:", error)
      },
      onSuccess: (data) => {
        console.log("useAskDetails query success:", data)
      },
    },
  )
}
