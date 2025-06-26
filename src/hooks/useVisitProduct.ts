"use client"

import { UserContext } from "@/Contexts/UserContext"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { useContext } from "react"

export default function useVisitProduct() {
  const userContext = useContext(UserContext)
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }
  const { pathUrl, userToken } = userContext

  const visitProductMutation = useMutation({
    mutationFn: (productId: number) => {
      return axios.post(
        `${pathUrl}/api/v1/product-visits/${productId}`,
        {}, // Empty body for POST request
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
            "Accept-Language": "en",
          },
        },
      )
    },
    onSuccess: (data, productId) => {
      console.log(`Successfully tracked visit for product ${productId}:`, data.data)
    },
    onError: (error, productId) => {
      console.error(`Failed to track visit for product ${productId}:`, error)
    },
  })

  return {
    visitProduct: visitProductMutation.mutate,
    isVisiting: visitProductMutation.isLoading,
    visitError: visitProductMutation.error,
    visitData: visitProductMutation.data?.data,
  }
}
