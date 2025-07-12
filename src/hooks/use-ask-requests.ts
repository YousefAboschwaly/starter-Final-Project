"use client"

import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import axios from "axios"
import { UserContext } from "../Contexts/UserContext"
import { IBusinessType } from "@/interfaces"

// Base interfaces for request user data
export interface RequestUser {
  id: number
  statusCode: number
  createdDate: string
  modifiedDate: string
  firstName?: string
  lastName?: string
  username: string
  email: string
  phone: string | null
  userType: {
    id: number
    code: string
    name: string
    nameAr?: string
    nameEn?: string
    statusCode?: number
  }
  governorate: {
    id: number
    code: string
    name?: string
    nameAr?: string
    nameEn?: string
    statusCode?: number
  }
  city: {
    id: number
    code: string
    name?: string
    nameAr?: string
    nameEn?: string
    statusCode?: number
    governorate?: {
      id: number
      code: string
      nameAr?: string
      nameEn?: string
      statusCode?: number
    }
  }
  business?: IBusinessType
  personalPhoto: string | null
  coverPhoto?: string | null
  accountNonLocked?: boolean
  accountNonExpired?: boolean
  credentialsNonExpired?: boolean
  authorities?: Array<{ authority: string }>
}

// Base request interface
export interface BaseRequest {
  id: number
  statusCode: number
  createdDate: string
  modifiedDate: string
  user: RequestUser
  comment: string
  isAccepted: boolean | null
  isFinished: boolean | null
  isRejected: boolean | null
}

// Engineer request interface
export interface EngineerRequest extends BaseRequest {
  askEngineer: {
    id: number
    statusCode: number
    createdDate: string
    modifiedDate: string
    phoneNumber: string
    projectName: string
    projectDescription: string
    engineerType: {
      id: number
      code: string
      name: string
      nameAr: string
      nameEn: string
    }
    unitType: {
      id: number
      code: string
      name: string
      nameAr: string
      nameEn: string
    }
    budget: number
    city: {
      id: number
      code: string
      name: string
    }
    governorate: {
      id: number
      code: string
      name: string
    }
    urgencyLevel: {
      id: number
      code: string
      name: string
      nameAr: string
      nameEn: string
    }
    deadline: string
    photos: Array<{
      id: number
      askEngineerId: number
      photoPath: string
    }>
    user: RequestUser
    requestCount: number
    askStatus: string
  }
}

// Worker request interface
export interface WorkerRequest extends BaseRequest {
  askWorker: {
    id: number
    statusCode: number
    createdDate: string
    modifiedDate: string
    projectName: string
    phoneNumber: string
    projectDescription: string
    workerType: {
      id: number
      code: string
      name: string
      nameAr: string
      nameEn: string
    }
    unitType: {
      id: number
      code: string
      name: string
      nameAr: string
      nameEn: string
    }
    city: {
      id: number
      code: string
      name: string
    }
    governorate: {
      id: number
      code: string
      name: string
    }
    material: {
      id: number
      code: string
      name: string
    }
    budget: number
    photos:  Array<{
      id: number
      askWorkerId: number
      photoPath: string
    }>
    user: RequestUser
    requestCount: number
    askStatus: string
  }
}

// Home renovate request interface
export interface HomeRenovateRequest extends BaseRequest {
  homeRenovate: {
    id: number
  }
}

// Custom package request interface
export interface CustomPackageRequest extends BaseRequest {
  selectCustomPackage: {
    id: number
  }
}

// Request design interface
export interface RequestDesignRequest extends BaseRequest {
  requestDesign: {
    id: number
    statusCode: number
    createdDate: string
    modifiedDate: string
    user: RequestUser
    phoneNumber: string
    unitType: {
      id: number
      code: string
      nameAr: string
      nameEn: string
      statusCode: number
    }
    governorate: {
      id: number
      code: string
      nameAr: string
      nameEn: string
      statusCode: number
    }
    unitArea: number
    budget: number
    requiredDuration: number
    notes: string
    requestCount: number
    askStatus: string
  }
}

// Union type for all request types
export type AskRequest =
  | EngineerRequest
  | WorkerRequest
  | HomeRenovateRequest
  | CustomPackageRequest
  | RequestDesignRequest

// Response interface
export interface AskRequestsResponse {
  success: boolean
  status: number
  data: AskRequest[]
}

export function useAskRequests(askType: string, askId: string | number, enabled = true) {
  const userContext = useContext(UserContext)

  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }

  const { pathUrl, userToken } = userContext

  // Determine API endpoint based on ask type
  const getRequestsEndpoint = (type: string, id: string | number): string | null => {
    const normalizedType = type.toLowerCase().trim()

    console.log("Getting requests endpoint for type:", normalizedType, "ID:", id)

    switch (normalizedType) {
      case "worker":
      case "ask-worker":
        return `/api/v1/request-ask-worker/my-asks?askId=${id}`
      case "engineer":
      case "ask-engineer":
        return `/api/v1/request-ask-engineer/my-asks?askId=${id}`
      case "request-design":
      case "requestdesign":
        return `/api/v1/request-request-design?askId=${id}`
      case "home-renovate":
      case "homerenovate":
      case "home_renovate":
        return `/api/v1/request-home-renovate/my-asks?askId=${id}`
      case "custom-package":
      case "custompackage":
      case "custom_package":
        return `/api/v1/request-select-custom-package/my-asks?askId=${id}`
      default:
        console.error("Unknown ask type for requests:", type)
        return null
    }
  }

  return useQuery<AskRequestsResponse, Error>(
    ["ask-requests", askType, askId],
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

      const endpoint = getRequestsEndpoint(askType, askId)

      if (!endpoint) {
        throw new Error(
          `Invalid ask type for requests: ${askType}. Supported types: worker, engineer, request-design, home-renovate, custom-package`,
        )
      }

      const fullUrl = `${pathUrl}${endpoint}`

      console.log("Making requests API call to:", fullUrl)

      try {
        const response = await axios.get(fullUrl, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Accept-Language": "en",
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 second timeout
        })

        console.log("Requests response received:", response.status, response.data)
        return response.data
      } catch (error) {
        console.error("Requests API failed:", error)

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
      staleTime: 2 * 60 * 1000, // 2 minutes
      cacheTime: 5 * 60 * 1000, // 5 minutes
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
        console.error("useAskRequests query error:", error)
      },
      onSuccess: (data) => {
        console.log("useAskRequests query success:", data)
      },
    },
  )
}
