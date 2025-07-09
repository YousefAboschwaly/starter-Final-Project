"use client"

import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import axios from "axios"
import { UserContext } from "../Contexts/UserContext"

// Worker-specific filter data interfaces
export interface Material {
  id: number
  code: string
  name: string
}

export interface WorkerType {
  id: number
  code: string
  name: string
  nameAr: string
  nameEn: string
}

export interface WorkerUnitType {
  id: number
  code: string
  name: string
  nameAr: string
  nameEn: string
}

export interface WorkerGovernorate {
  id: number
  code: string
  name: string
}

export interface WorkerFilterDataResponse {
  success: boolean
  status: number
  data: {
    material: Material[]
    workerType: WorkerType[]
    unitType: WorkerUnitType[]
    governorate: WorkerGovernorate[]
  }
}

export function useWorkerFilterData() {
  const userContext = useContext(UserContext)

  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }

  const { pathUrl, userToken } = userContext

  // Fetch worker filter lookup data
  const { data, isLoading, isError, error, isSuccess, refetch } = useQuery<WorkerFilterDataResponse, Error>(
    ["worker-filter-data"],
    async () => {
      const response = await axios.get(`${pathUrl}/api/v1/ask-worker/lkps`, {
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
    material: [],
    workerType: [],
    unitType: [],
    governorate: [],
  }

  return {
    materials: filterData.material || [],
    workerTypes: filterData.workerType || [],
    workerUnitTypes: filterData.unitType || [],
    workerGovernorates: filterData.governorate || [],
    isLoading,
    isError,
    error,
    isSuccess,
    refetch,
  }
}
