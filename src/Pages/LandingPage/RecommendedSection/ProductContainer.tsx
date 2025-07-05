"use client"

import { useState, useEffect } from "react"
import ProductCard from "./product-card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import type { ApiProduct } from "../LandingPage"

interface ProductContainerProps {
  products: ApiProduct[]
}

export default function ProductContainer({ products }: ProductContainerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Handle empty products array
  if (!products || products.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500 text-lg">No products available</p>
      </div>
    )
  }

  const visibleProducts = isMobile ? 1 : 5

  // If we have fewer products than visible slots, show all products
  if (products.length <= visibleProducts) {
    return (
      <div className="overflow-hidden">
        <div className="flex gap-4 justify-center">
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0" style={{ width: isMobile ? "100%" : "20%" }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Calculate proper boundaries for sliding
  const maxIndex = products.length - visibleProducts

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex >= maxIndex) {
        return 0 // Go back to start
      }
      return prevIndex + 1
    })
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex <= 0) {
        return maxIndex // Go to end
      }
      return prevIndex - 1
    })
  }

  return (
    <div className="relative">
      {/* Left Arrow - Always visible */}
      <motion.div
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={prevSlide}
          className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md transition-colors"
          aria-label="Previous products"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </motion.div>

      <div className="overflow-hidden mx-12">
        <motion.div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${(currentIndex * 100) / visibleProducts}%)`,
          }}
        >
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 px-2" style={{ width: `${100 / visibleProducts}%` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Right Arrow - Always visible */}
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={nextSlide}
          className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md transition-colors"
          aria-label="Next products"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </motion.div>

      {/* Optional: Add dots indicator */}
      {products.length > visibleProducts && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === index ? "w-6 bg-purple-500" : "w-2 bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
