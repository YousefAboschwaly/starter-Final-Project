"use client"

import { useState, useEffect, useRef, useContext, useCallback } from "react"
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import type { ApiProduct } from "../LandingPage"
import { UserContext } from "@/Contexts/UserContext"
import { Link } from "react-router-dom"
import { useCart } from "@/Contexts/CartContext"
import { Button } from "@/components/ui/button"

export default function ProductCard({ product }: { product: ApiProduct }) {
    const { cartData, addToCart, removeFromCart } = useCart()
    
  // Check if this product is in the cart
  const isInCart = cartData.cartProducts.some((item) => item.id === product.id)

  const handleCartToggle = (productId: number) => {
    if (isInCart) {
      // Product is in cart, remove it
      removeFromCart(productId, "delete", product.name)
    } else {
      // Product is not in cart, add it
      addToCart(productId, product.price, product.name)
    }
  }
  
  const userContext = useContext(UserContext)
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }
  const { pathUrl } = userContext
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeText, setActiveText] = useState(0)
  const animationRef = useRef<NodeJS.Timeout | null>(null)

  // Optimized text rotation with useCallback
  const runAnimation = useCallback(() => {
    setActiveText(0)
    
    const timer1 = setTimeout(() => {
      setActiveText(1)
      
      const timer2 = setTimeout(() => {
        runAnimation()
      }, 2500)
      
      animationRef.current = timer2
    }, 2500)
    
    animationRef.current = timer1
  }, [])

  useEffect(() => {
    runAnimation()
    
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [runAnimation])

  const toggleWishlist = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }, [isWishlisted])

  const nextImage = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex(prev => (prev === product.images.length - 1 ? 0 : prev + 1))
  }, [product.images.length])

  const prevImage = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex(prev => (prev === 0 ? product.images.length - 1 : prev - 1))
  }, [product.images.length])

  const goToImage = useCallback((index: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setCurrentImageIndex(index)
  }, [])



  const animatedTexts = [
    {
      text: `#${product.productRankBySales} in ${product.categoryName}`,
      color: "text-purple-700",
      dotColor: "text-purple-700",
    },
    {
      text: product.numberOfSales ? `${product.numberOfSales}+ sold recently` : "Free Delivery",
      color: "text-green-600",
      dotColor: "text-green-600",
    },
  ]

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {product.bestSeller && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-gray-700 text-white text-xs font-medium px-2 py-1 rounded-full">
            {product.bestSeller ? "Best Seller" : "Featured"}
          </Badge>
        </div>
      )}

      <motion.button
        className="absolute top-3 right-3 z-10 bg-white rounded-full p-1.5 shadow-sm"
        onClick={toggleWishlist}
        whileTap={{ scale: 0.9 }}
      >
        <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
      </motion.button>

      <Link to={`/products/${product.id}`} className="flex flex-col flex-grow">
        <div className="flex-grow flex items-center justify-center relative overflow-hidden p-1">
          {/* Image slider */}
          <div className="relative h-64 w-full">
            <div className="absolute inset-0">
              <img
                src={`${pathUrl}${product.images[currentImageIndex]}` || "/placeholder.svg"}
                alt={`${product.name} - view ${currentImageIndex + 1}`}
                className="object-cover w-full h-full rounded-md transition-opacity duration-300"
                style={{ opacity: isHovered ? 0.95 : 1 }}
              />
            </div>

            {/* Navigation arrows - only show on hover */}
            {isHovered && product.images.length > 1 && (
              <>
                <motion.button
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-sm z-20"
                  onClick={prevImage}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft className="h-4 w-4 text-gray-700" />
                </motion.button>

                <motion.button
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow-sm z-20"
                  onClick={nextImage}
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight className="h-4 w-4 text-gray-700" />
                </motion.button>
              </>
            )}

            {/* Pagination dots */}
            {product.images.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-1 pb-1 z-20">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => goToImage(index, e)}
                    className={`h-1.5 rounded-full transition-all ${
                      currentImageIndex === index ? "w-3 bg-gray-800" : "w-1.5 bg-gray-300"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center mb-1">
            <div className="flex items-center">
              <span className="text-gray-800 font-medium mr-1">{product.rate.toFixed(1)}</span>
              <span className="text-yellow-400">★</span>
            </div>
            {product.countRates > 0 && <span className="text-gray-500 text-sm ml-1">({product.countRates})</span>}
          </div>

          <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 h-10">{product.name}</h3>

          {/* Price section */}
          <div className="flex items-center mb-3">
            <div className="flex items-baseline">
              <span className="text-sm font-medium">EGP</span>
              <span className="text-lg font-bold ml-1">{product.price.toFixed(0)}</span>
            </div>

            {product.originalPrice && (
              <div className="flex items-center ml-2">
                <span className="text-gray-500 text-xs line-through">{product.originalPrice.toFixed(0)}</span>
                {discountPercentage && <span className="text-green-600 text-xs ml-1">-{discountPercentage}%</span>}
              </div>
            )}
          </div>

          {/* Animated text section with only 2 texts */}
          <div className="flex items-center justify-between mb-2">
            <div className="h-5 relative overflow-hidden w-36 border-l-2 border-transparent">
              {animatedTexts.map((textObj, index) => (
                <div
                  key={index}
                  className={`flex items-center text-xs ${textObj.color} absolute left-0 w-full transition-all duration-500 ${
                    activeText === index ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                  }`}
                >
                  <span className={`mr-1 ${textObj.dotColor}`}>●</span>
                  <span>{textObj.text}</span>
                </div>
              ))}
            </div>

        <Button
            variant="ghost"
            size="icon"
            className={`absolute bottom-3 right-3 transition-all duration-300 hover:scale-110 shadow-lg animate-in slide-in-from-right-2 ${
              isInCart ? "bg-blue-500/90 hover:bg-blue-600" : "bg-white/90 hover:bg-white"
            }`}
            style={{ animationDelay: `${1 * 100 + 300}ms` }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleCartToggle(product.id)
            }}
          >
            <ShoppingCart
              className={`w-4 h-4 transition-all duration-300 ${
                isInCart ? "fill-white text-white scale-110" : "text-gray-600 hover:text-blue-400 hover:scale-110"
              }`}
            />
          </Button>
          </div>

          {product.express && (
            <div className="mt-1">
              <span className="bg-yellow-400 text-xs font-medium px-2 py-0.5 rounded text-black">express</span>
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}