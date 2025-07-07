"use client"

import { useState, useEffect } from "react"
import TechnicalWorkerCard from "./TechnicalWorkerCard"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import type { TechnicalWorker } from "./TechnicalWorkerCard"

interface TechnicalWorkersContainerProps {
  workers: TechnicalWorker[]
}

export default function TechnicalWorkersContainer({ workers }: TechnicalWorkersContainerProps) {
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

  // Handle empty or invalid workers array
  if (!workers || !Array.isArray(workers) || workers.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500 text-lg">No technical workers available</p>
      </div>
    )
  }

  // Filter out any invalid worker objects
  const validWorkers = workers.filter(
    (worker) => worker && worker.id && worker.user && (worker.user.firstName || worker.user.lastName),
  )

  if (validWorkers.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500 text-lg">No valid technical workers found</p>
      </div>
    )
  }

  const visibleWorkers = isMobile ? 1 : 4

  // If we have fewer workers than visible slots, show all workers
  if (validWorkers.length <= visibleWorkers) {
    return (
      <div className="overflow-hidden">
        <div className="flex gap-4 justify-center">
          {validWorkers.map((worker) => (
            <div key={worker.id} className="flex-shrink-0" style={{ width: isMobile ? "100%" : "25%" }}>
              <TechnicalWorkerCard worker={worker} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Calculate proper boundaries for sliding
  const maxIndex = validWorkers.length - visibleWorkers

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
          aria-label="Previous workers"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </motion.div>

      <div className="overflow-hidden mx-12">
        <motion.div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${(currentIndex * 100) / visibleWorkers}%)`,
          }}
        >
          {validWorkers.map((worker) => (
            <div key={worker.id} className="flex-shrink-0 px-2" style={{ width: `${100 / visibleWorkers}%` }}>
              <TechnicalWorkerCard worker={worker} />
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
          aria-label="Next workers"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </motion.div>

      {/* Optional: Add dots indicator */}
      {validWorkers.length > visibleWorkers && (
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
