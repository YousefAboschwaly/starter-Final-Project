"use client"

import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import axios from "axios"
import { UserContext } from "../Contexts/UserContext"

// Home Renovate specific filter data interfaces
export interface HomeRenovateUnitType {
  id: number
  code: string
  name: string
  nameAr: string
  nameEn: string
}

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

export interface HomeRenovateGovernorate {
  id: number
  code: string
  name: string
}

export interface HomeRenovateFilterDataResponse {
  success: boolean
  status: number
  data: {
    unitTypes: HomeRenovateUnitType[]
    unitStatuses: UnitStatus[]
    unitWorkTypes: UnitWorkType[]
    workSkills: WorkSkill[]
    governorates: HomeRenovateGovernorate[]
  }
}

export function useHomeRenovateFilterData() {
  const userContext = useContext(UserContext)

  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }

  const { pathUrl, userToken } = userContext

  // Fetch home renovate filter lookup data
  const { data, isLoading, isError, error, isSuccess, refetch } = useQuery<HomeRenovateFilterDataResponse, Error>(
    ["home-renovate-filter-data"],
    async () => {
      const response = await axios.get(`${pathUrl}/api/v1/home-renovate/lkps`, {
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
    unitTypes: [],
    unitStatuses: [],
    unitWorkTypes: [],
    workSkills: [],
    governorates: [],
  }

  return {
    homeRenovateUnitTypes: filterData.unitTypes || [],
    unitStatuses: filterData.unitStatuses || [],
    unitWorkTypes: filterData.unitWorkTypes || [],
    workSkills: filterData.workSkills || [],
    homeRenovateGovernorates: filterData.governorates || [],
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
  }
}
