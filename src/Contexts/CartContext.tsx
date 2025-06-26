"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { UserContext } from "./UserContext"
import toast from "react-hot-toast"

interface CartProduct {
  id: number
  amount: number
  price: number // Add price to store individual product price
  name?: string // Optional: store product name for better UX
}

interface CartData {
  cartProducts: CartProduct[]
}

interface CartContextType {
  cartData: CartData
  addToCart: (productId: number, productPrice: number, productName?: string) => void
  removeFromCart: (productId: number, mode: "reduce" | "delete", productName?: string) => void
  updateQuantity: (productId: number, quantity: number, productName?: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function CartProvider({ children }: { children: React.ReactNode }) {
  const userContext = useContext(UserContext)

  if (!userContext) {
    throw new Error("CartProvider must be used within a UserContextProvider")
  }
  const { userId } = userContext

  // Initialize state with data from localStorage if available
  const [cartData, setCartData] = useState<CartData>(() => {
    if (userId === undefined) return { cartProducts: [] }

    const storageKey = `cart-${userId}`
    const cart = localStorage.getItem(storageKey)

    if (cart) {
      try {
        const parsedCart = JSON.parse(cart)
        // Ensure backward compatibility - add price: 0 if missing
        if (parsedCart.cartProducts) {
          parsedCart.cartProducts = parsedCart.cartProducts.map((item: CartProduct) => ({
            ...item,
            price: item.price || 0, // Default to 0 if price is missing
          }))
        }
        return parsedCart
      } catch (error) {
        console.error("Error parsing cart data:", error)
        localStorage.removeItem(storageKey)
      }
    }
    return { cartProducts: [] }
  })

  // Save cart data to localStorage whenever it changes
  useEffect(() => {
    if (userId === undefined) return

    const storageKey = `cart-${userId}`
    localStorage.setItem(storageKey, JSON.stringify(cartData))
  }, [cartData, userId])

  function addToCart(productId: number, productPrice: number, productName?: string) {
    let wasUpdated = false
    let isNewProduct = false
    let newQuantity = 0

    setCartData((prevCart) => {
      const existingIndex = prevCart.cartProducts.findIndex((p) => p.id === productId)

      if (existingIndex >= 0) {
        // Product already exists, increase quantity
        const updatedProducts = [...prevCart.cartProducts]
        newQuantity = updatedProducts[existingIndex].amount + 1
        updatedProducts[existingIndex] = {
          ...updatedProducts[existingIndex],
          amount: newQuantity,
          price: productPrice, // Update price in case it changed
          name: productName,
        }
        wasUpdated = true
        return { cartProducts: updatedProducts }
      }

      // New product
      isNewProduct = true
      newQuantity = 1
      return {
        cartProducts: [...prevCart.cartProducts, { id: productId, amount: 1, price: productPrice, name: productName }],
      }
    })

    // Show toast notification
    if (isNewProduct) {
      toast.success(productName ? `${productName} added Successfully to cart!` : "Product added to cart!", {
        duration: 3000,
        position: "top-right",
        icon: "🛒",
      })
    } else if (wasUpdated) {
      toast.success(
        productName
          ? `${productName} Updated Successfully New quantity: ${newQuantity}`
          : `Product quantity: ${newQuantity}`,
        {
          duration: 2500,
          position: "top-right",
          icon: "📦",
        },
      )
    }
  }

  function removeFromCart(productId: number, mode: "reduce" | "delete", productName?: string) {
    let wasRemoved = false
    let wasReduced = false
    let newQuantity = 0

    setCartData((prevCart) => {
      const existingIndex = prevCart.cartProducts.findIndex((p) => p.id === productId)

      if (existingIndex === -1) return prevCart

      const currentAmount = prevCart.cartProducts[existingIndex].amount

      if (mode === "delete" || currentAmount === 1) {
        wasRemoved = true
        return {
          cartProducts: prevCart.cartProducts.filter((p) => p.id !== productId),
        }
      }

      const updatedProducts = [...prevCart.cartProducts]
      newQuantity = currentAmount - 1
      updatedProducts[existingIndex] = {
        ...updatedProducts[existingIndex],
        amount: newQuantity,
      }
      wasReduced = true

      return { cartProducts: updatedProducts }
    })

    // Show toast notification
    if (wasRemoved) {
      toast.success(
        productName ? `${productName} Removed Successfully from cart` : "Product Removed Successfully from cart",
        {
          duration: 3000,
          position: "top-right",
          icon: "🗑️",
        },
      )
    } else if (wasReduced) {
      toast(
        productName
          ? `${productName} Reduced Successfully New quantity: ${newQuantity}`
          : `Product Reduced Successfully New quantity: ${newQuantity}`,
        {
          duration: 2500,
          position: "top-right",
          icon: "📦",
        },
      )
    }
  }

  function updateQuantity(productId: number, quantity: number, productName?: string) {
    if (quantity < 1) {
      removeFromCart(productId, "delete", productName)
      return
    }

    let oldQuantity = 0
    let wasUpdated = false

    setCartData((prevCart) => {
      const existingIndex = prevCart.cartProducts.findIndex((p) => p.id === productId)

      if (existingIndex === -1) {
        // Product doesn't exist, can't update quantity without price
        console.warn("Cannot update quantity for non-existent product")
        return prevCart
      }

      oldQuantity = prevCart.cartProducts[existingIndex].amount

      // Only update if quantity is different
      if (oldQuantity !== quantity) {
        const updatedProducts = [...prevCart.cartProducts]
        updatedProducts[existingIndex] = {
          ...updatedProducts[existingIndex],
          amount: quantity,
        }
        wasUpdated = true

        return { cartProducts: updatedProducts }
      }

      return prevCart
    })

    // Show toast notification only if quantity actually changed
    if (wasUpdated && oldQuantity !== quantity) {
      const isIncrease = quantity > oldQuantity
      toast(
        productName
          ? `${productName} quantity ${isIncrease ? "increased" : "decreased"} to ${quantity}`
          : `Product quantity ${isIncrease ? "increased" : "decreased"} to ${quantity}`,
        {
          duration: 2500,
          position: "top-right",
          icon: isIncrease ? "⬆️" : "⬇️",
        },
      )
    }
  }

  function clearCart() {
    const itemCount = cartData.cartProducts.length

    setCartData({ cartProducts: [] })

    // Show toast notification
    if (itemCount > 0) {
      toast.success(`Cart cleared! ${itemCount} item${itemCount !== 1 ? "s" : ""} removed`, {
        duration: 4000,
        position: "top-right",
        icon: "🧹",
      })
    }
  }

  return (
    <CartContext.Provider
      value={{
        cartData,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

// eslint-disable-next-line react-refresh/only-export-components
export { CartProvider, useCart }
export type { CartProduct, CartData }
