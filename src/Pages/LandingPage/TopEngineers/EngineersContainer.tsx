"use client"

import { useState, useEffect } from "react"
import EngineerCard from "./EngineerCard"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import type { Engineer } from "../LandingPage"

interface EngineersContainerProps {
  engineers: Engineer[]
}

export default function EngineersContainer({ engineers }: EngineersContainerProps) {
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

  // Handle empty or invalid engineers array
  if (!engineers || !Array.isArray(engineers) || engineers.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500 text-lg">No engineers available</p>
      </div>
    )
  }

  // Filter out any invalid engineer objects
  const validEngineers = engineers.filter(
    (engineer) => engineer && engineer.id && engineer.user && (engineer.user.firstName || engineer.user.lastName),
  )

  if (validEngineers.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500 text-lg">No valid engineers found</p>
      </div>
    )
  }

  const visibleEngineers = isMobile ? 1 : 4

  // If we have fewer engineers than visible slots, show all engineers
  if (validEngineers.length <= visibleEngineers) {
    return (
      <div className="overflow-hidden">
        <div className="flex gap-4 justify-center">
          {validEngineers.map((engineer) => (
            <div key={engineer.id} className="flex-shrink-0" style={{ width: isMobile ? "100%" : "25%" }}>
              <EngineerCard engineer={engineer} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Calculate proper boundaries for sliding
  const maxIndex = validEngineers.length - visibleEngineers

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
          aria-label="Previous engineers"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </motion.div>

      <div className="overflow-hidden mx-12">
        <motion.div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${(currentIndex * 100) / visibleEngineers}%)`,
          }}
        >
          {validEngineers.map((engineer) => (
            <div key={engineer.id} className="flex-shrink-0 px-2" style={{ width: `${100 / visibleEngineers}%` }}>
              <EngineerCard engineer={engineer} />
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
          aria-label="Next engineers"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </motion.div>

      {/* Optional: Add dots indicator */}
      {validEngineers.length > visibleEngineers && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === index ? "w-6 bg-blue-500" : "w-2 bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
