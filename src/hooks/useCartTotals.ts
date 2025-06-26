"use client"

import { useMemo } from "react"
import { useCart } from "@/Contexts/CartContext"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useContext } from "react"
import { UserContext } from "@/Contexts/UserContext"
import type { IProductById } from "@/interfaces"

export function useCartTotals() {
  const { cartData } = useCart()
  const userContext = useContext(UserContext)

  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }

  const { pathUrl, userToken } = userContext

  // Get all product IDs and their quantities
  const cartItems = useMemo(() => {
    return cartData.cartProducts || []
  }, [cartData.cartProducts])

  const productIds = useMemo(() => {
    return cartItems.map((item) => item.id)
  }, [cartItems])

  // Single query to fetch all cart products
  const {
    data: productsData,
    isLoading,
  } = useQuery({
    queryKey: ["cartProducts", productIds],
    queryFn: async () => {
      if (productIds.length === 0) return []

      // Fetch all products in parallel
      const productPromises = productIds.map(async (productId) => {
        try {
          const response = await axios.get(`${pathUrl}/api/v1/products/${productId}`, {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
              "Accept-Language": "en",
            },
          })
          return {
            id: productId,
            data: response.data.data as IProductById,
            success: true,
            error: null,
          }
        } catch (error) {
          return {
            id: productId,
            data: null,
            success: false,
            error,
          }
        }
      })

      return Promise.all(productPromises)
    },
    enabled: productIds.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Calculate totals
  const totals = useMemo(() => {
    let subtotal = 0
    let hasErrors = false
    // Only show calculating when we have items AND we're loading
    const isCalculating = isLoading && cartItems.length > 0

    if (productsData && cartItems.length > 0) {
      for (const cartItem of cartItems) {
        const productResult = productsData.find((p) => p.id === cartItem.id)

        if (!productResult || !productResult.success || !productResult.data) {
          hasErrors = true
          continue
        }

        subtotal += productResult.data.price * cartItem.amount
      }
    }

    const shippingFee = cartItems.length > 0 ? 85 : 0
    const total = subtotal + shippingFee

    return {
      subtotal,
      shippingFee,
      total,
      isCalculating,
      hasErrors,
      itemCount: cartItems.length,
    }
  }, [productsData, cartItems, isLoading])

  return totals
}
