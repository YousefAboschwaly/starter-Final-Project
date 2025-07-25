"use client"

import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import axios from "axios"
import { UserContext } from "../Contexts/UserContext"

// Base interfaces for all business config data types
export interface Color {
  id: number
  code: string
  name: string
  hexColor: string
}

export interface ProductBaseUnit {
  id: number
  code: string
  name: string
}

export interface ProductMaterial {
  id: number
  code: string
  name: string
}

export interface BusinessType {
  id: number
  code: string
  name: string
}

export interface BusinessTypeCategory {
  id: number
  code: string
  name: string
  businessType: BusinessType
}

export interface HomeFurnishingRequestType {
  id: number
  code: string
  name: string
}

export interface FurnitureType {
  id: number
  code: string
  name: string
}

export interface DeviceAttached {
  id: number
  code: string
  name: string
}

export interface KitchenType {
  id: number
  code: string
  name: string
}

// Main business config response interface
export interface BusinessConfigResponse {
  success: boolean
  status: number
  data: {
    colors: Color[]
    productBaseUnits: ProductBaseUnit[]
    productMaterial: ProductMaterial[]
    businessTypes: BusinessType[]
    businessTypeCategories: BusinessTypeCategory[]
    homeFurnishingRequestTypes: HomeFurnishingRequestType[]
    furnitureTypes: FurnitureType[]
    devicesAttacheds: DeviceAttached[]
    kitchenTypes: KitchenType[]
  }
}

// Hook return type
export interface UseBusinessConfigReturn {
  // Data
  colors: Color[]
  productBaseUnits: ProductBaseUnit[]
  productMaterial: ProductMaterial[]
  businessTypes: BusinessType[]
  businessTypeCategories: BusinessTypeCategory[]
  homeFurnishingRequestTypes: HomeFurnishingRequestType[]
  furnitureTypes: FurnitureType[]
  devicesAttacheds: DeviceAttached[]
  kitchenTypes: KitchenType[]

  // React Query states
  isLoading: boolean
  isError: boolean
  error: Error | null
  isSuccess: boolean
  refetch: () => void
  isFetching: boolean
}

export function useBusinessConfig(): UseBusinessConfigReturn {
  const userContext = useContext(UserContext)

  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }

  const { pathUrl, userToken } = userContext

  // React Query for fetching business config
  const { data, isLoading, isError, error, isSuccess, refetch, isFetching } = useQuery<BusinessConfigResponse, Error>(
    ["business-config", userToken], // Include userToken in query key
    async () => {
      if (!userToken) {
        throw new Error("No authentication token available")
      }

      console.log("Fetching business config with token:", userToken ? "Present" : "Missing")

      const response = await axios.get(`${pathUrl}/api/v1/business-config`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Accept-Language": "en",
          "Content-Type": "application/json",
        },
      })

      console.log("Business config response:", response.data)
      return response.data
    },
    {
      enabled: !!userToken, // Only run query when userToken exists
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false, // Prevent unnecessary refetches
      refetchOnMount: true,
      onSuccess: (data) => {
        console.log("Business config loaded successfully:", {
          businessTypes: data?.data?.businessTypes?.length || 0,
          categories: data?.data?.businessTypeCategories?.length || 0,
        })
      },
      onError: (error) => {
        console.error("Business config fetch error:", error)
      },
    },
  )

  // Extract data with fallbacks
  const businessConfigData: BusinessConfigResponse["data"] = data?.data || {
    colors: [],
    productBaseUnits: [],
    productMaterial: [],
    businessTypes: [],
    businessTypeCategories: [],
    homeFurnishingRequestTypes: [],
    furnitureTypes: [],
    devicesAttacheds: [],
    kitchenTypes: [],
  }

  return {
    // Data arrays with fallbacks
    colors: businessConfigData.colors || [],
    productBaseUnits: businessConfigData.productBaseUnits || [],
    productMaterial: businessConfigData.productMaterial || [],
    businessTypes: businessConfigData.businessTypes || [],
    businessTypeCategories: businessConfigData.businessTypeCategories || [],
    homeFurnishingRequestTypes: businessConfigData.homeFurnishingRequestTypes || [],
    furnitureTypes: businessConfigData.furnitureTypes || [],
    devicesAttacheds: businessConfigData.devicesAttacheds || [],
    kitchenTypes: businessConfigData.kitchenTypes || [],

    // React Query states
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
    isFetching,
  }
}
