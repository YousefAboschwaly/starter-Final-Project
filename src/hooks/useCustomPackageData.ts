"use client"

import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import axios from "axios"
import { UserContext } from "../Contexts/UserContext"

// Custom Package interfaces
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

export interface CustomPackageResponse {
  success: boolean
  status: number
  data: CustomPackage[]
}

export function useCustomPackageData() {
  const userContext = useContext(UserContext)

  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }

  const { pathUrl, userToken } = userContext

  // Fetch custom packages
  const { data, isLoading, isError, error, isSuccess, refetch } = useQuery<CustomPackageResponse, Error>(
    ["custom-packages"],
    async () => {
      const response = await axios.get(`${pathUrl}/api/v1/custom-package`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Accept-Language": "en",
          "Content-Type": "application/json",
        },
      })
      return response.data
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
    },
  )

  return {
    customPackages: data?.data || [],
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
  }
}
