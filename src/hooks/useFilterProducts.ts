"use client"

import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import axios from "axios"
import { UserContext } from "../Contexts/UserContext"
import { IBusinessType } from "@/interfaces"

export interface FilterParams {
  pageSize?: number
  pageNumber?: number
  searchCriteria?: {
    userId?: number | null
    unitTypeId?: number | null
    governorateId?: number | null
    cityId?: number | null
    urgencyLevelId?: number | null
    projectName?: string | null
    engineerTypeId?: number | null
    budgetFrom?: number | null
    budgetTo?: number | null
    // Worker-specific fields
    materialId?: number | null
    workerTypeId?: number | null
    // Request Design specific fields
    requiredDurationFrom?: number | null
    requiredDurationTo?: number | null
    unitAreaFrom?: number | null
    unitAreaTo?: number | null
    // Home Renovate specific fields
    unitStatusId?: number | null
    unitWorkTypeId?: number | null
    workSkillId?: number | null
    // Custom Package specific fields
    customPackageId?: number | null
    isInsideCompound?: boolean | null
  }
}

// Updated interfaces to match real API response
export interface EngineerType {
  id: number
  code: string
  name: string
  nameAr: string
  nameEn: string
}

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

export interface UnitType {
  id: number
  code: string
  name: string
  nameAr: string
  nameEn: string
}

export interface City {
  id: number
  code: string
  name: string
}

export interface Governorate {
  id: number
  code: string
  name: string
}

export interface UrgencyLevel {
  id: number
  code: string
  name: string
  nameAr: string
  nameEn: string
}

export interface UserType {
  id: number
  code: string
  name: string | null
}

export interface User {
  id: number
  statusCode: number
  createdDate: string
  modifiedDate: string
  username: string
  email: string
  phone: string | null
  userType: UserType
  governorate: Governorate
  city: City
  business: IBusinessType | null
  personalPhoto: string | null
}

export interface Photo {
  id: number
  askEngineerId: number
  photoPath: string | null
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

export interface Product {
  id: number
  statusCode: number
  createdDate: string
  modifiedDate: string
  phoneNumber: string
  // Common fields
  unitType: UnitType
  budget?: number
  governorate: Governorate
  user: User
  requestCount: number
  askStatus: string

  // Engineer-specific fields (optional)
  projectName?: string
  projectDescription?: string
  engineerType?: EngineerType
  urgencyLevel?: UrgencyLevel
  deadline?: string
  city?: City
  photos?: Photo[]

  // Worker-specific fields (optional)
  workerType?: WorkerType
  material?: Material

  // Request Design specific fields (optional)
  unitArea?: number
  requiredDuration?: number
  notes?: string

  // Home Renovate specific fields (optional)
  isInsideCompound?: boolean
  unitStatuses?: UnitStatus
  unitWorkTypes?: UnitWorkType
  workSkills?: WorkSkill
  region?: number
  numberOfRooms?: number
  numberOfBathrooms?: number

  // Custom Package specific fields (optional)
  customPackage?: CustomPackage
}

export interface FilterProductsResponse {
  success: boolean
  status: number
  data: {
    content: Product[]
    pageable: {
      pageNumber: number
      pageSize: number
      sort: {
        empty: boolean
        unsorted: boolean
        sorted: boolean
      }
      offset: number
      unpaged: boolean
      paged: boolean
    }
    totalPages: number
    totalElements: number
    last: boolean
    size: number
    number: number
    sort: {
      empty: boolean
      unsorted: boolean
      sorted: boolean
    }
    numberOfElements: number
    first: boolean
    empty: boolean
  }
}

export function useFilterProducts(businessTypeCode: string, filters: FilterParams) {
  console.log(filters)
  const userContext = useContext(UserContext)

  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }

  const { pathUrl, userToken } = userContext

  // Determine API endpoint based on business type
  const getApiEndpoint = (businessType: string) => {
    switch (businessType.toLowerCase()) {
      case "ask_engineer":
        return "/api/v1/ask-engineer/filter"
      case "technical_worker":
        return "/api/v1/ask-worker/filter"
      case "kitchens":
        return "/api/v1/kitchens/filter"
      case "home_furnishing":
        return "/api/v1/home-furnishing/filter"
      case "design_request":
        return "/api/v1/request-design/filter"
      case "home_renovate":
        return "/api/v1/home-renovate/filter"
      case "custom_package":
        return "/api/v1/select-custom-package/filter"
      default:
        return "/api/v1/ask-engineer/filter" // Default fallback
    }
  }

  return useQuery<FilterProductsResponse, Error>(
    ["filter-products", businessTypeCode, filters],
    async () => {
      const endpoint = getApiEndpoint(businessTypeCode)

      const response = await axios.post(`${pathUrl}${endpoint}`, filters, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Accept-Language": "en",
          "Content-Type": "application/json",
        },
      })
      return response.data
    },
    {
      staleTime: 30 * 1000, // 30 seconds
      cacheTime: 2 * 60 * 1000, // 2 minutes
      retry: 2,
    },
  )
}
