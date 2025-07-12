"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useContext } from "react"
import axios from "axios"
import { UserContext } from "../Contexts/UserContext"

export function useRequestActions(askType: string, askId: string | number) {
  const userContext = useContext(UserContext)
  const queryClient = useQueryClient()

  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }

  const { pathUrl, userToken } = userContext

  // Get the appropriate endpoint for accept/reject actions
  const getActionEndpoint = (type: string, action: "accept" | "reject"): string | null => {
    const normalizedType = type.toLowerCase().trim()

    switch (normalizedType) {
      case "worker":
      case "ask-worker":
        return `/api/v1/request-ask-worker/${action}`
      case "engineer":
      case "ask-engineer":
        return `/api/v1/request-ask-engineer/${action}`
      case "request-design":
      case "requestdesign":
        return `/api/v1/request-request-design/${action}`
      case "home-renovate":
      case "homerenovate":
      case "home_renovate":
        return `/api/v1/request-home-renovate/${action}`
      case "custom-package":
      case "custompackage":
      case "custom_package":
        return `/api/v1/request-select-custom-package/${action}`
      default:
        console.error("Unknown ask type for actions:", type)
        return null
    }
  }

  const acceptRequest = useMutation({
    mutationFn: async (requestId: number) => {
      const endpoint = getActionEndpoint(askType, "accept")
      if (!endpoint) {
        throw new Error(`Invalid ask type for accept action: ${askType}`)
      }

      const response = await axios.post(
        `${pathUrl}${endpoint}`,
        { requestId },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Accept-Language": "en",
            "Content-Type": "application/json",
          },
        },
      )

      return response.data
    },
    onSuccess: () => {
      // Invalidate and refetch the requests
      queryClient.invalidateQueries(["ask-requests", askType, askId])
      queryClient.invalidateQueries(["ask-details", askType, askId])
    },
    onError: (error) => {
      console.error("Accept request failed:", error)
    },
  })

  const rejectRequest = useMutation({
    mutationFn: async (requestId: number) => {
      const endpoint = getActionEndpoint(askType, "reject")
      if (!endpoint) {
        throw new Error(`Invalid ask type for reject action: ${askType}`)
      }

      const response = await axios.post(
        `${pathUrl}${endpoint}`,
        { requestId },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Accept-Language": "en",
            "Content-Type": "application/json",
          },
        },
      )

      return response.data
    },
    onSuccess: () => {
      // Invalidate and refetch the requests
      queryClient.invalidateQueries(["ask-requests", askType, askId])
      queryClient.invalidateQueries(["ask-details", askType, askId])
    },
    onError: (error) => {
      console.error("Reject request failed:", error)
    },
  })
  

  return {
    acceptRequest: acceptRequest.mutate,
    rejectRequest: rejectRequest.mutate,
    isAccepting: acceptRequest?.isPaused,
    isRejecting: rejectRequest?.isPaused  ,
    acceptError: acceptRequest.error,
    rejectError: rejectRequest.error,
  }
}
