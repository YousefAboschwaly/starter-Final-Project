"use client"

import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import axios from "axios"
import { UserContext } from "../Contexts/UserContext"

// Filter data interfaces
export interface UnitType {
  id: number
  code: string
  name: string
  nameAr: string
  nameEn: string
}

export interface Governorate {
  id: number
  code: string
  name: string
}

export interface City {
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

export interface EngineerType {
  id: number
  code: string
  name: string
  nameAr: string
  nameEn: string
}

export interface FilterDataResponse {
  success: boolean
  status: number
  data: {
    unitType: UnitType[]
    governorate: Governorate[]
    urgencyLevel: UrgencyLevel[]
    engineerType: EngineerType[]
  }
}

export interface CityResponse {
  success: boolean
  status: number
  data: City[]
}

export function useFilterData() {
  const userContext = useContext(UserContext)

  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }

  const { pathUrl, userToken } = userContext

  // Fetch filter lookup data
  const { data, isLoading, isError, error, isSuccess, refetch } = useQuery<FilterDataResponse, Error>(
    ["filter-data"],
    async () => {
      const response = await axios.get(`${pathUrl}/api/v1/ask-engineer/lkps`, {
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

  const filterData = data?.data || {
    unitType: [],
    governorate: [],
    urgencyLevel: [],
    engineerType: [],
  }

  return {
    unitTypes: filterData.unitType || [],
    governorates: filterData.governorate || [],
    urgencyLevels: filterData.urgencyLevel || [],
    engineerTypes: filterData.engineerType || [],
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
  }
}

export function useCities(governorateId: number | null) {
  const userContext = useContext(UserContext)

  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }

  const { pathUrl, userToken } = userContext

  return useQuery<CityResponse, Error>(
    ["cities", governorateId],
    async () => {
      if (!governorateId) return { success: true, status: 200, data: [] }

      const response = await axios.get(`${pathUrl}/api/v1/cities/governorate/${governorateId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Accept-Language": "en",
          "Content-Type": "application/json",
        },
      })
      return response.data
    },
    {
      enabled: !!governorateId,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  )
}
