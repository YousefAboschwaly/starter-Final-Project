"use client"

import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import axios from "axios"
import { UserContext } from "../Contexts/UserContext"

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
  business: any | null
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
  photos: any[]
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
  const userContext = useContext(UserContext)

  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }

  const { pathUrl, userToken } = userContext

  // Determine API endpoint based on ask type
  const getApiEndpoint = (type: string, id: string | number) => {
    switch (type.toLowerCase()) {
      case "worker":
        return `/api/v1/ask-worker/${id}`
      case "engineer":
        return `/api/v1/ask-engineer/${id}`
      case "request-design":
        return `/api/v1/request-design/${id}`
      case "home-renovate":
        return `/api/v1/home-renovate/${id}`
      case "custom-package":
        return `/api/v1/select-custom-package/${id}`
      default:
        return `/api/v1/ask-engineer/${id}` // Default fallback
    }
  }

  return useQuery<AskDetailsResponse, Error>(
    ["ask-details", askType, askId],
    async () => {
      const endpoint = getApiEndpoint(askType, askId)

      const response = await axios.get(`${pathUrl}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Accept-Language": "en",
          "Content-Type": "application/json",
        },
      })
      return response.data
    },
    {
      enabled: enabled && !!askId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
    },
  )
}
