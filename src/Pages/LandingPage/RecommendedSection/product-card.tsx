"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

interface ProductProps {
  id: number
  title: string
  images: string[]
  rating: number
  reviews: string
  price: number
  originalPrice: number | null
  discount: string | null
  rank?: string
  sellingFast?: boolean
  recentlySold?: string
  express: boolean
}

export default function ProductCard({ product }: { product: ProductProps }) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeText, setActiveText] = useState(0)
  const [, setPrevActiveText] = useState(0)
  const animationRef = useRef<NodeJS.Timeout | null>(null)

  // Text rotation animation with precise timing
  useEffect(() => {
    const runAnimation = () => {
      // Show first text for 500ms
      setActiveText(0)

      // After 500ms, switch to second text
      const timer1 = setTimeout(() => {
        setPrevActiveText(0)
        setActiveText(1)

        // After another 500ms, go back to first text
        const timer2 = setTimeout(() => {
          setPrevActiveText(1)
          runAnimation() // Restart the cycle
        }, 2500)

        // Store the second timer
        animationRef.current = timer2
      }, 2500)

      // Store the first timer
      animationRef.current = timer1
    }

    // Start the animation cycle
    runAnimation()

    // Clean up timers on unmount
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [])

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prevIndex) => (prevIndex === product.images.length - 1 ? 0 : prevIndex + 1))
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? product.images.length - 1 : prevIndex - 1))
  }

  const goToImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="absolute top-3 left-3 z-10">
        <Badge className="bg-gray-700 text-white text-xs font-medium px-2 py-1 rounded-full">Best Seller</Badge>
      </div>

      <motion.button
        className="absolute top-3 right-3 z-10 bg-white rounded-full p-1.5 shadow-sm"
        onClick={toggleWishlist}
        whileTap={{ scale: 0.9 }}
      >
        <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
      </motion.button>

      <div className=" flex-grow flex items-center justify-center relative overflow-hidden p-1">
        {/* Image slider */}
        <div className="relative h-64 w-full">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0"
          >
            <img
              src={product.images[currentImageIndex] || "/placeholder.svg"}
              alt={`${product.title} - view ${currentImageIndex + 1}`}
              
              className="object-cover w-full h-full rounded-md"
            />
          </motion.div>

          {/* Navigation arrows - only show on hover */}
          {isHovered && (
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
                  onClick={() => goToImage(index)}
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
            <span className="text-gray-800 font-medium mr-1">{product.rating}</span>
            <span className="text-yellow-400">★</span>
          </div>
          {product.reviews && <span className="text-gray-500 text-sm ml-1">({product.reviews})</span>}
        </div>

        <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 h-10">{product.title}</h3>

        {/* Price section */}
        <div className="flex items-center mb-3">
          <div className="flex items-baseline">
            <span className="text-sm font-medium">EGP</span>
            <span className="text-lg font-bold ml-1">{product.price}</span>
          </div>

          {product.originalPrice && (
            <div className="flex items-center ml-2">
              <span className="text-gray-500 text-xs line-through">{product.originalPrice}</span>
              {product.discount && <span className="text-green-600 text-xs ml-1">{product.discount}</span>}
            </div>
          )}
        </div>

        {/* Animated text section - DIRECTLY UNDER PRICE */}
        <div className="flex items-center justify-between mb-2">
          <div className="h-5 relative overflow-hidden w-36 border-l-2 border-transparent">
            {/* First text - Rank */}
            <motion.div
              className="flex items-center text-xs text-purple-700 absolute left-0 w-full"
              initial={{
                y: activeText === 0 ? 20 : 0,
                opacity: activeText === 0 ? 0 : 1,
              }}
              animate={{
                y: activeText === 0 ? 0 : -20,
                opacity: activeText === 0 ? 1 : 0,
              }}
              transition={{ duration: 0.5 }}
            >
              <span className="mr-1 text-purple-700">●</span>
              <span>{product.rank || "#1 in Power Banks"}</span>
            </motion.div>

            {/* Second text - Free Delivery */}
            <motion.div
              className="flex items-center text-xs text-green-600 absolute left-0 w-full"
              initial={{
                y: activeText === 1 ? 20 : 0,
                opacity: activeText === 1 ? 0 : 1,
              }}
              animate={{
                y: activeText === 1 ? 0 : -20,
                opacity: activeText === 1 ? 1 : 0,
              }}
              transition={{ duration: 0.5 }}
            >
              <span className="mr-1 text-green-600">●</span>
              <span>Free Delivery</span>
            </motion.div>
          </div>

          <motion.button
            className="bg-white border border-gray-200 rounded-full p-1.5 shadow-sm"
            whileHover={{ scale: 1.1, backgroundColor: "#f3f4f6" }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingCart className="h-5 w-5 text-gray-600" />
          </motion.button>
        </div>

        {product.express && (
          <div className="mt-1">
            <span className="bg-yellow-400 text-xs font-medium px-2 py-0.5 rounded text-black">express</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
