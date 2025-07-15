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

  // Get the appropriate endpoint for accept/reject/finish actions (same as Add Offer)
  const getActionEndpoint = (type: string): string | null => {
    const normalizedType = type.toLowerCase().trim()

    switch (normalizedType) {
      case "worker":
      case "ask-worker":
        return `/api/v1/request-ask-worker`
      case "engineer":
      case "ask-engineer":
        return `/api/v1/request-ask-engineer`
      case "request-design":
      case "requestdesign":
        return `/api/v1/request-request-design`
      case "home-renovate":
      case "homerenovate":
      case "home_renovate":
        return `/api/v1/request-home-renovate`
      case "custom-package":
      case "custompackage":
      case "custom_package":
        return `/api/v1/request-select-custom-package`
      default:
        console.error("Unknown ask type for actions:", type)
        return null
    }
  }

  // Create request body based on ask type and action
  const createRequestBody = (requestId: number, action: "accept" | "reject" | "finish") => {
    const normalizedType = askType.toLowerCase().trim()

    const baseBody = {
      id: requestId, // Keep the top-level request ID
      comment: "", // Comment is not typically updated on accept/reject/finish
      isAccepted: action === "accept" ? true : null,
      isFinished: action === "finish" ? true : null,
      isRejected: action === "reject" ? true : null,
    }

    // The nested object structure depends on the askType
    let nestedAskObject: { [key: string]: { id: number } } = {}
    const askIdNum = Number.parseInt(askId.toString())

    switch (normalizedType) {
      case "engineer":
      case "ask-engineer":
        nestedAskObject = { askEngineer: { id: askIdNum } }
        break
      case "worker":
      case "ask-worker":
        nestedAskObject = { askWorker: { id: askIdNum } }
        break
      case "home-renovate":
      case "homerenovate":
      case "home_renovate":
        nestedAskObject = { homeRenovate: { id: askIdNum } }
        break
      case "custom-package":
      case "custompackage":
      case "custom_package":
        nestedAskObject = { selectCustomPackage: { id: askIdNum } }
        break
      case "request-design":
      case "requestdesign":
        nestedAskObject = { requestDesign: { id: askIdNum } }
        break
      default:
        throw new Error(`Unsupported ask type: ${askType}`)
    }

    return {
      ...baseBody,
      ...nestedAskObject,
    }
  }

  const acceptRequest = useMutation({
    mutationFn: async (requestId: number) => {
      const endpoint = getActionEndpoint(askType)
      if (!endpoint) {
        throw new Error(`Invalid ask type for accept action: ${askType}`)
      }

      const requestBody = createRequestBody(requestId, "accept")

      console.log("Accept request - Endpoint:", `${pathUrl}${endpoint}`)
      console.log("Accept request - Body:", requestBody)

      const response = await axios.post(`${pathUrl}${endpoint}`, requestBody, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Accept-Language": "en",
          "Content-Type": "application/json",
        },
      })

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
      const endpoint = getActionEndpoint(askType)
      if (!endpoint) {
        throw new Error(`Invalid ask type for reject action: ${askType}`)
      }

      const requestBody = createRequestBody(requestId, "reject")

      console.log("Reject request - Endpoint:", `${pathUrl}${endpoint}`)
      console.log("Reject request - Body:", requestBody)

      const response = await axios.post(`${pathUrl}${endpoint}`, requestBody, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Accept-Language": "en",
          "Content-Type": "application/json",
        },
      })

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

  const finishRequest = useMutation({
    mutationFn: async (requestId: number) => {
      const endpoint = getActionEndpoint(askType)
      if (!endpoint) {
        throw new Error(`Invalid ask type for finish action: ${askType}`)
      }

      const requestBody = createRequestBody(requestId, "finish")

      console.log("Finish request - Endpoint:", `${pathUrl}${endpoint}`)
      console.log("Finish request - Body:", requestBody)

      const response = await axios.post(`${pathUrl}${endpoint}`, requestBody, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Accept-Language": "en",
          "Content-Type": "application/json",
        },
      })

      return response.data
    },
    onSuccess: () => {
      // Invalidate and refetch the requests
      queryClient.invalidateQueries(["ask-requests", askType, askId])
      queryClient.invalidateQueries(["ask-details", askType, askId])
    },
    onError: (error) => {
      console.error("Finish request failed:", error)
    },
  })

  return {
    acceptRequest: (requestId: number, options?: { onSuccess?: () => void; onError?: () => void }) => {
      acceptRequest.mutate(requestId, {
        onSuccess: options?.onSuccess,
        onError: options?.onError,
      })
    },
    rejectRequest: (requestId: number, options?: { onSuccess?: () => void; onError?: () => void }) => {
      rejectRequest.mutate(requestId, {
        onSuccess: options?.onSuccess,
        onError: options?.onError,
      })
    },
    finishRequest: (requestId: number, options?: { onSuccess?: () => void; onError?: () => void }) => {
      finishRequest.mutate(requestId, {
        onSuccess: options?.onSuccess,
        onError: options?.onError,
      })
    },
    isAccepting: acceptRequest.isLoading,
    isRejecting: rejectRequest.isLoading,
    isFinishing: finishRequest.isLoading,
    acceptError: acceptRequest.error,
    rejectError: rejectRequest.error,
    finishError: finishRequest.error,
  }
}
