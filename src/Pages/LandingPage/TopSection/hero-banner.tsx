"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Banner slides data with beautiful images
const bannerSlides = [
  {
    id: 1,
    image: "/ProductImages/prod1.jpg",
    title: "FIND YOUR",
    highlightedTitle: "TREADMILL",
    subtitle: "MOVE. SWEAT. REPEAT.",
    buttonText: "SHOP NOW",
    buttonLink: "/treadmills",
  },
  {
    id: 2,
    image: "/ProductImages/prod2.jpg",
    title: "T-SHIRTS &",
    highlightedTitle: "POLOS",
    subtitle: "EVERYDAY ESSENTIALS",
    buttonText: "SHOP NOW",
    buttonLink: "/clothing",
  },
  {
    id: 3,
    image: "/ProductImages/prod3.jpg",
    title: "LATEST",
    highlightedTitle: "GADGETS",
    subtitle: "UPGRADE YOUR TECH",
    buttonText: "EXPLORE NOW",
    buttonLink: "/electronics",
  },
]

export default function HeroBanner() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const totalSlides = bannerSlides.length

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % totalSlides)
  }, [totalSlides])

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }, [totalSlides])

  // Auto-rotate functionality
  useEffect(() => {
    // Start the auto-rotation
    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        nextSlide()
      }
    }, 5000) // Change slide every 5 seconds

    // Cleanup function to clear the interval when component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPaused,nextSlide]) // Only re-run if isPaused changes

  const currentSlide = bannerSlides[activeSlide]

  return (
    <div
      className="relative w-full h-[500px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dark overlay to ensure text visibility */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>

      {/* Background image with transition */}
      <div className="absolute inset-0">
        {bannerSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-1000",
              index === activeSlide ? "opacity-100" : "opacity-0"
            )}
          >
            <img
              src={slide.image || "/placeholder.svg"}
              alt={`${slide.title} ${slide.highlightedTitle}`}
              className="object-cover w-full h-full"
            />
          </div>
        ))}
      </div>

      {/* Content with transition */}
      <div className="relative z-20 h-full flex flex-col justify-center items-start px-12 md:px-24 max-w-7xl mx-auto">
        <div className="transition-all duration-500 transform">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
            {currentSlide.title} <br />
            <span className="text-amber-500">
              {currentSlide.highlightedTitle}
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white font-medium mt-2 mb-8">
            {currentSlide.subtitle}
          </p>
          <Button className="bg-white text-black hover:bg-gray-200 font-semibold px-8 py-6 text-lg">
            {currentSlide.buttonText}
          </Button>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-md transition-all focus:outline-none"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-gray-800" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white rounded-full w-12 h-12 flex items-center justify-center shadow-md transition-all focus:outline-none"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-gray-800" />
      </button>

      {/* Dots navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveSlide(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              activeSlide === index ? "w-6 bg-amber-500" : "bg-white/60"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
