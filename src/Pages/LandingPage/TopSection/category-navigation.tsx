"use client"

import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { useFilterContext } from "@/Contexts/FilterContext"

// Business type category interface
interface BusinessType {
  id: number
  code: string
  name: string
}

interface BusinessTypeCategory {
  id: number
  code: string
  name: string
  businessType: BusinessType
}

interface CategoryNavigationProps {
  businessTypeCategories: BusinessTypeCategory[]
}

// Map your EXACT category codes to images
const getImageForCategory = (code: string, businessTypeCode?: string): string => {
  const categoryImageMap: { [key: string]: string } = {
    // FURNITURE categories - specific images
    SOFA: "/BusinessCategories/sofa.jpg",
    WARDROBE: "/BusinessCategories/wardrobe.jpg",
    DINING_TABLE: "/BusinessCategories/dining-table.jpg",

    // KITCHENS_DRESSINGS categories - specific images
    KITCHEN_CABINET: "/BusinessCategories/kitchen-cabinet.jpg",
    STORAGE_SHELVES: "/BusinessCategories/storage-shelves.jpg",
    CUTLERY: "/BusinessCategories/cutlery.jpg",

    // ELECTRICAL_TOOLS categories - specific images
    ELECTRIC_DRILL: "/BusinessCategories/electric-drill.jpg",
    CIRCULAR_SAW: "/BusinessCategories/circular-saw.jpg",
    WIRE_CUTTER: "/BusinessCategories/wire-cutter.jpg",
    VOLTAGE_TESTER: "/BusinessCategories/voltage-tester.jpg",
    POWER_EXTENSION: "/BusinessCategories/power-extension.jpg",

    // FURNISHINGS categories - specific images
    CARPET: "/BusinessCategories/carpet.jpg",
    CURTAINS: "/BusinessCategories/curtains.jpg",
    BED_LINEN: "/BusinessCategories/bed-linen.jpg",
    BLANKETS: "/BusinessCategories/blankets.jpg",
    CUSHIONS: "/BusinessCategories/cushions.jpg",

    // PAINT_MATERIALS categories - specific images
    PAINT_BRUSH: "/BusinessCategories/paint-brush.jpg",
    PAINT_ROLLER: "/BusinessCategories/paint-roller.jpg",
    PAINT_CAN: "/BusinessCategories/paint-can.jpg",
  }

  // If specific category found, return it
  if (categoryImageMap[code]) {
    return categoryImageMap[code]
  }

  // Fallback to business type mapping for future categories
  const businessTypeImageMap: { [key: string]: string } = {
    FURNITURE: "/CategoriesImages/Furniture.jpg",
    KITCHENS_DRESSINGS: "/CategoriesImages/Kitchens.jpg",
    ELECTRICAL_TOOLS: "/CategoriesImages/electricalTools.jpg",
    FURNISHINGS: "/CategoriesImages/Furnish.jpg",
    PAINT_MATERIALS: "/CategoriesImages/paint.jpg",
  }

  if (businessTypeCode && businessTypeImageMap[businessTypeCode]) {
    return businessTypeImageMap[businessTypeCode]
  }

  // Final fallback for completely new business types
  return "/placeholder.svg?height=100&width=100"
}

// Generate a colored fallback for categories without images
const getColorFromName = (name: string) => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-pink-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
  ]

  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }

  return colors[Math.abs(hash) % colors.length]
}

export default function CategoryNavigation({ businessTypeCategories }: CategoryNavigationProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [screenSize, setScreenSize] = useState<"small" | "medium" | "large">("medium")
  const { setBusinessCategoryFilter } = useFilterContext()

  // Function to get visible categories based on screen size
  const getVisibleCategories = (size: "small" | "medium" | "large") => {
    switch (size) {
      case "small": // sm to md (< 768px)
        return 5
      case "medium": // md to xl (768px - 1279px)
        return 7
      case "large": // xl and above (≥ 1280px)
        return 10
      default:
        return 7
    }
  }

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      if (width < 768) {
        setScreenSize("small")
      } else if (width < 1280) {
        setScreenSize("medium")
      } else {
        setScreenSize("large")
      }
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  // Handle category click using context
  const handleCategoryClick = (category: BusinessTypeCategory) => {
    setBusinessCategoryFilter(category.businessType, category)
  }

  const visibleCategories = getVisibleCategories(screenSize)

  // Handle empty categories
  if (!businessTypeCategories || businessTypeCategories.length === 0) {
    return (
      <div className="relative py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
            <p className="text-lg text-gray-600">Discover our wide range of products</p>
          </div>
          <div className="flex justify-center space-x-4">
            {[...Array(visibleCategories)].map((_, i) => (
              <div key={i} className="flex flex-col items-center animate-pulse">
                <div className="w-20 h-20 bg-gray-200 rounded-full mb-2"></div>
                <div className="w-16 h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // If we have fewer categories than visible slots, show all categories
  if (businessTypeCategories.length <= visibleCategories) {
    return (
      <div className="relative pt-2 pb-6 bg-white">
        <div className="px-2">
          {/* Categories */}
          <div className="flex justify-center gap-4">
            {businessTypeCategories.map((category) => {
              const imgSrc = getImageForCategory(category.code, category.businessType.code)

              return (
                <Link
                  key={category.id}
                  to="/Ask?type=shop"
                  onClick={() => handleCategoryClick(category)}
                  className="flex flex-col items-center text-center group"
                  aria-label={`Browse ${category.name} category`}
                >
                  {/* Category Image */}
                  <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full mb-2 shadow-md bg-white border-2 border-gray-100">
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                      <img
                        src={imgSrc || "/placeholder.svg"}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 will-change-transform"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          // Hide the image and show colored fallback
                          target.style.display = "none"
                          const parent = target.parentElement
                          if (parent && !parent.querySelector(".fallback-bg")) {
                            const fallback = document.createElement("div")
                            fallback.className = `fallback-bg w-full h-full rounded-full flex items-center justify-center text-white font-bold text-xs ${getColorFromName(category.name)}`
                            const initials = category.name
                              .split(" ")
                              .map((word) => word[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)
                            fallback.textContent = initials
                            parent.appendChild(fallback)
                          }
                        }}
                      />
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                  </div>

                  {/* Category Name */}
                  <h3 className="text-sm md:text-base font-medium text-gray-800 capitalize leading-tight max-w-20 md:max-w-24 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                    {category.name}
                  </h3>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Calculate proper boundaries for sliding
  const maxIndex = businessTypeCategories.length - visibleCategories

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
    <div className="relative pt-2 pb-6 bg-white">
      <div className="px-2">
        {/* Slider Container */}
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
              aria-label="Previous categories"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          </motion.div>

          <div className="overflow-hidden">
            <motion.div
              className="flex transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${(currentIndex * 100) / visibleCategories}%)`,
              }}
            >
              {businessTypeCategories.map((category) => {
                const imgSrc = getImageForCategory(category.code, category.businessType.code)

                return (
                  <div
                    key={category.id}
                    className="flex-shrink-0 px-2"
                    style={{ width: `${100 / visibleCategories}%` }}
                  >
                    <Link
                      to="/Ask?type=shop"
                      onClick={() => handleCategoryClick(category)}
                      className="flex flex-col items-center text-center group"
                      aria-label={`Browse ${category.name} category`}
                    >
                      {/* Category Image */}
                      <div className="relative w-20 h-20 md:w-28 md:h-28 rounded-full mb-2 shadow-md bg-white border-2 border-gray-100 mx-auto">
                        <div className="absolute inset-0 rounded-full overflow-hidden">
                          <img
                            src={imgSrc || "/placeholder.svg"}
                            alt={category.name}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 will-change-transform"
                            loading="lazy"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              // Hide the image and show colored fallback
                              target.style.display = "none"
                              const parent = target.parentElement
                              if (parent && !parent.querySelector(".fallback-bg")) {
                                const fallback = document.createElement("div")
                                fallback.className = `fallback-bg w-full h-full rounded-full flex items-center justify-center text-white font-bold text-xs ${getColorFromName(category.name)}`
                                const initials = category.name
                                  .split(" ")
                                  .map((word) => word[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)
                                fallback.textContent = initials
                                parent.appendChild(fallback)
                              }
                            }}
                          />
                        </div>

                        {/* Hover overlay */}
                        <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                      </div>

                      {/* Category Name */}
                      <h3 className="text-sm md:text-base font-medium text-gray-800 capitalize leading-tight max-w-20 md:max-w-24 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                        {category.name}
                      </h3>
                    </Link>
                  </div>
                )
              })}
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
              aria-label="Next categories"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </motion.div>
        </div>

        {/* Dots indicator */}
        {businessTypeCategories.length > visibleCategories && (
          <div className="flex justify-center mt-7 space-x-2">
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
    </div>
  )
}
