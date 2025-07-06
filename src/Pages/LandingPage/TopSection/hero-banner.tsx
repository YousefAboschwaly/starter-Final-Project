"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"

// Banner slides data with the 7 images from your screenshots
const bannerSlides = [
  {
    id: 1,
    image: "/bannerImages/AskEngineer.jpg", // Ask to Engineer
    title: "ASK TO",
    highlightedTitle: "ENGINEER",
    buttonLink: "/Ask?type=engineer",
  },
  {
    id: 2,
    image: "/bannerImages/AskWorker.jpg", // Ask Worker
    title: "ASK TO",
    highlightedTitle: "WORKER",
  
    buttonLink: "/Ask?type=worker",
  },
  {
    id: 3,
    image: "/bannerImages/FurnishHome.png", // Furnish Home
    title: "",
    highlightedTitle: "",

    buttonLink: "/Ask?type=furnish-house",
  },
  {
    id: 4,
    image: "/bannerImages/Kitchen.jpg", // Kitchen
    title: "MODERN",
    highlightedTitle: "KITCHEN",
    
    buttonLink: "/Ask?type=kitchen",
  },
  {
    id: 5,
    image: "/bannerImages/RequestDesign.png", // Request Design
    title: "",
    highlightedTitle: "",

    buttonLink: "/Ask?type=request-design",
  },
  {
    id: 6,
    image: "/bannerImages/RevonateHome.png", // Renovate Home
    title: "",
    highlightedTitle: "",
    buttonLink: "/Ask?type=home-renovate",
  },
  {
    id: 7,
    image: "/bannerImages/ShopNow.jpg", // Shop Now
    title: "SHOP",
    highlightedTitle: "NOW",

    buttonLink: "/Ask?type=shop",
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
    intervalRef.current = setInterval(() => {
      if (!isPaused) {
        nextSlide()
      }
    }, 5000) // Change slide every 5 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPaused, nextSlide])

  const currentSlide = bannerSlides[activeSlide]

  return (
    <div className="w-full relative ">
      <div
        className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[85vh] xl:h-[90vh] overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background images with perfect coverage */}
        <div className="absolute inset-0 flex items-center justify-center ">
          {bannerSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={cn(
                "absolute inset-0 transition-all duration-1000 ease-in-out flex items-center justify-center overflow-hidden",
                index === activeSlide ? "opacity-100 scale-100" : "opacity-0 scale-105",
              )}
            >
              {/* PRESERVED SECTION - DO NOT CHANGE */}
              <Link to={currentSlide.buttonLink} className="relative w-[95%] h-[90%] mx-auto rounded-2xl overflow-hidden">
              
                <img
                  src={slide.image || "/placeholder.svg"}
                  alt={`${slide.title} ${slide.highlightedTitle}`}
                  className={`w-full h-full  ${slide.image === "/bannerImages/AskWorker.jpg" ? " " : ""}`}
                />
                {/* Enhanced gradient overlay for better text readability */}
                              {/* END PRESERVED SECTION */}
               <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              </Link>

            </div>
          ))}
          
        </div>

        {/* Text content positioned on the left with blue background like in your image */}
        <div className="absolute left-8 sm:left-12 md:left-16 lg:left-20 top-8 sm:top-12 md:top-20 z-30 p-4 sm:p-6 md:p-8">
          <div className="max-w-md sm:max-w-lg md:max-w-xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white mb-2 sm:mb-3 md:mb-4 leading-tight tracking-tight">
              <span className="block">
                {currentSlide.title} {currentSlide.highlightedTitle}
              </span>
            </h1>

         { currentSlide.title &&  <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 sm:px-12 py-4 sm:py-6 text-sm sm:text-base md:text-lg rounded-full shadow-lg transition-all duration-300 hover:scale-105 border-0">
              <Link to={currentSlide.buttonLink} className="text-white">
                Try Now
              </Link>
            </Button>}
          </div>
        </div>

        {/* Improved navigation arrows positioned better */}
        <button
          onClick={prevSlide}
          className="absolute left-[2.8%] top-1/2 -translate-y-1/2 z-40 bg-white/80 hover:bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-gray-800" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-[2.8%] top-1/2 -translate-y-1/2 z-40 bg-white/80 hover:bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-gray-800" />
        </button>

        {/* Dots navigation only */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-2 sm:space-x-3">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={cn(
                "h-2 sm:h-3 w-2 sm:w-3 rounded-full transition-all duration-300 hover:scale-125",
                activeSlide === index ? "bg-purple-500 w-6 sm:w-8" : "bg-white/60 hover:bg-white/80",
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
