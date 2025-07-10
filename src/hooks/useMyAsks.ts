"use client"

import { useQuery } from "@tanstack/react-query"
import { useContext } from "react"
import axios from "axios"
import { UserContext } from "../Contexts/UserContext"
import type { Product } from "./useFilterProducts"

export interface MyAsksResponse {
  success: boolean
  status: number
  data: Product[]
}

export function useMyAsks(businessTypeCode: string, enabled = true) {
  console.log("useMyAsks called with businessTypeCode:", businessTypeCode)
  const userContext = useContext(UserContext)

  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }

  const { pathUrl, userToken } = userContext

  // Determine API endpoint based on business type
  const getApiEndpoint = (businessType: string) => {
    switch (businessType.toLowerCase()) {
      case "ask_engineer":
        return "/api/v1/ask-engineer/my-asks"
      case "technical_worker":
        return "/api/v1/ask-worker/my-asks"
      case "design_request":
        return "/api/v1/request-design/my-request-design"
      case "home_renovate":
        return "/api/v1/home-renovate/my-home-renovate"
      case "custom_package":
        return "/api/v1/select-custom-package/my-select-package"
      default:
        return "/api/v1/ask-engineer/my-asks" // Default fallback
    }
  }

  return useQuery<MyAsksResponse, Error>(
    ["my-asks", businessTypeCode],
    async () => {
      const endpoint = getApiEndpoint(businessTypeCode)

      const response = await axios.get(`${pathUrl}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Accept-Language": "en",
          "Content-Type": "application/json",
        },
      })
      console.log("API response:", response)
      return response.data
    },
    {
      enabled,
      staleTime: 30 * 1000, // 30 seconds
      cacheTime: 2 * 60 * 1000, // 2 minutes
      retry: 2,
    },
  )
}
