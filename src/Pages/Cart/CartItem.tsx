"use client"
import { Minus, Plus, Trash2, AlertCircle, Truck, Loader2, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { useCart } from "@/Contexts/CartContext"
import { useContext } from "react"
import { UserContext } from "@/Contexts/UserContext"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import type { IProductById } from "@/interfaces"

interface CartItemProps {
  productId: number
  quantity: number
}

export function CartItem({ productId, quantity }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart()
  const userContext = useContext(UserContext)

  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }
  const { pathUrl, userToken } = userContext

  // Individual product query for this cart item
  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getProductById", productId],
    queryFn: () =>
      axios.get(`${pathUrl}/api/v1/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
          "Accept-Language": "en",
        },
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  const product = response?.data?.data as IProductById | undefined

  const handleRemoveFromCart = () => {
    removeFromCart(productId, "delete", product?.nameEn)
  }

  const handleUpdateQuantity = (newQuantity: number) => {
    updateQuantity(productId, newQuantity, product?.nameEn)
  }

  // Helper function to get delivery date (3 days from now)
  const getDeliveryDate = () => {
    const date = new Date()
    date.setDate(date.getDate() + 3)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  // Helper function to get current order time
  const getOrderTime = () => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    return `${hours} h ${minutes} m`
  }

  if (isLoading) {
    return (
      <motion.div
        className="p-6 border border-gray-200 rounded-lg mx-4 my-4 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex gap-4 items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Loading product...</span>
        </div>
      </motion.div>
    )
  }

  if (isError || !product) {
    return (
      <motion.div
        className="p-6 border border-red-200 rounded-lg mx-4 my-4 bg-red-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex gap-4 items-center justify-center py-8">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <span className="text-red-600">Error loading product</span>
          <Button variant="outline" size="sm" onClick={handleRemoveFromCart} className="ml-4">
            Remove from cart
          </Button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -100, scale: 0.8 }}
      transition={{ duration: 0.3, layout: { duration: 0.3 } }}
      whileHover={{
        scale: 1.02,
        y: -4,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        transition: { duration: 0.2 },
      }}
      className="p-4 md:p-6 border border-gray-200 rounded-lg mx-2 md:mx-4 my-2 md:my-4 bg-white cursor-pointer transition-all duration-200"
    >
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0 self-center sm:self-start">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 2 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
          >
            <Link to={`/products/${product.id}`}>
              <img
                src={pathUrl + product.imagePaths[0]?.imagePath || "/placeholder.svg?height=120&width=120"}
                alt={product.nameEn}
                width={120}
                height={120}
                className="w-32 h-32 sm:w-24 sm:h-24 md:w-[120px] md:h-[120px] rounded-lg object-cover"
              />
            </Link>
          </motion.div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
            <motion.h3
              className="text-base md:text-lg font-medium text-gray-900 leading-tight order-1 sm:order-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ color: "#3b82f6" }}
            >
              {product.nameEn}
            </motion.h3>

            {/* Price and Badges - Mobile: Top, Desktop: Right */}
            <div className="flex flex-row sm:flex-col items-start sm:items-end justify-between sm:justify-start gap-2 sm:gap-2 flex-shrink-0 order-0 sm:order-none">
              <motion.div
                className="text-xl md:text-2xl font-bold text-gray-900"
                key={product.price * quantity}
                initial={{ scale: 1.1, color: "#3b82f6" }}
                animate={{ scale: 1, color: "#111827" }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
              >
                EGP {(product.price * quantity).toLocaleString()}
              </motion.div>

              <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 sm:gap-1">
                <motion.div whileHover={{ scale: 1.05 }}>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                    express
                  </Badge>
                </motion.div>
                <motion.div
                  className="flex items-center gap-1 text-xs text-blue-600"
                  whileHover={{ scale: 1.05, color: "#2563eb" }}
                >
                  <Truck className="w-3 h-3" />
                  <span>Free Delivery</span>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Order and Delivery Info */}
          <motion.div
            className="space-y-1 md:space-y-2 text-xs md:text-sm mb-3 md:mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-gray-600">Order in {getOrderTime()}</p>
            <p>
              Get it by <span className="font-medium text-green-600">{getDeliveryDate()}</span>
            </p>
            <p className="text-blue-600">
              Business Type <span className="font-medium">{product.businessType.name}</span>
            </p>
          </motion.div>

          {/* Product Info */}
          <motion.div
            className="space-y-1 md:space-y-2 mb-3 md:mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              className="flex items-center gap-2 text-xs md:text-sm text-green-600"
              whileHover={{ x: 5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 text-xs">✓</span>
              </div>
              <span>1 year warranty</span>
            </motion.div>

            {/* Dimensions */}
            <div className="text-xs text-gray-500">
              Dimensions: {product.length} × {product.width} × {product.height} {product.baseUnit.name}
            </div>
          </motion.div>

          {/* Bottom Actions - Responsive Layout */}
          <div className="flex sm:flex-row items-center justify-between mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-100 gap-3 sm:gap-0">
            {/* Action Buttons */}
            <div className="flex items-center gap-2 md:gap-3 order-2 sm:order-1">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-600 border-gray-300 hover:text-red-500 hover:border-red-300 transition-colors duration-200 text-xs md:text-sm px-2 md:px-3"
                  onClick={handleRemoveFromCart}
                >
                  <Trash2 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  Remove
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-gray-600 border-gray-300 hover:text-blue-500 hover:border-blue-300 transition-colors duration-200 text-xs md:text-sm px-2 md:px-3"
                >
                  <Heart className="mr-1 md:mr-2 w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Move to Wishlist</span>
                  <span className="sm:hidden">Wishlist</span>
                </Button>
              </motion.div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center justify-between sm:justify-end gap-3 order-1 sm:order-2">
              <div className="flex items-center gap-2">
                <span className="text-xs md:text-sm text-gray-500">Qty</span>

                <div className="flex items-center border border-gray-300 rounded-md bg-white">
                  <motion.div whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 md:h-8 md:w-8 p-0 hover:bg-red-100 rounded-l-md"
                      onClick={() => handleUpdateQuantity(quantity - 1)}
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                  </motion.div>

                  <motion.div
                    className="min-w-[40px] md:min-w-[50px] text-center px-2 py-1 border-x border-gray-200"
                    key={quantity}
                    initial={{ scale: 1.3, color: "#3b82f6" }}
                    animate={{ scale: 1, color: "#000" }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-xs md:text-sm font-medium">{quantity}</span>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }} whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 md:h-8 md:w-8 p-0 hover:bg-green-100 rounded-r-md"
                      onClick={() => handleUpdateQuantity(quantity + 1)}
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
