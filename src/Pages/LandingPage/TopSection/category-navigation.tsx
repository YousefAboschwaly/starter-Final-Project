"use client"

import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

// Business type interface
interface BusinessType {
  id: number
  code: string
  name: string
}

interface CategoryNavigationProps {
  businessTypes: BusinessType[]
}

// Map business codes to image names (using .jpg extension)
const getImageForBusinessType = (code: string): string => {
  const imageMap: { [key: string]: string } = {
    FURNITURE: "/CategoriesImages/Furniture.jpg",
    KITCHENS_DRESSINGS: "/CategoriesImages/Kitchens.jpg",
    ELECTRICAL_TOOLS: "/CategoriesImages/electricalTools.jpg",
    FURNISHINGS: "/CategoriesImages/Furnish.jpg",
    PAINT_MATERIALS: "/CategoriesImages/paint.jpg",
  }
  return imageMap[code] || "/placeholder.svg"
}

export default function CategoryNavigation({ businessTypes }: CategoryNavigationProps) {
  const [loadedImages, setLoadedImages] = useState<{[key: string]: boolean}>({})
  
  // Preload images
  useEffect(() => {
    const preloadImages = async () => {
      const newLoaded: {[key: string]: boolean} = {}
      
      await Promise.all(
        businessTypes.map(async (category) => {
          const imgSrc = getImageForBusinessType(category.code)
          if (imgSrc && !loadedImages[imgSrc]) {
            try {
              await new Promise((resolve, reject) => {
                const img = new Image()
                img.src = imgSrc
                img.onload = () => {
                  newLoaded[imgSrc] = true
                  resolve(true)
                }
                img.onerror = reject
              })
            } catch (e) {
              console.error(`Failed to load image: ${imgSrc}`, e)
            }
          }
        })
      )
      
      setLoadedImages(prev => ({ ...prev, ...newLoaded }))
    }
    
    if (businessTypes.length > 0) {
      preloadImages()
    }
  }, [businessTypes, loadedImages])

  if (businessTypes.length === 0) {
    return (
      <div className="relative py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
            <p className="text-lg text-gray-600">Discover our wide range of products</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col items-center animate-pulse">
                <div className="w-40 h-40 md:w-40 md:h-40 bg-gray-200 rounded-full mb-4"></div>
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop by Category</h2>
          <p className="text-lg text-gray-600">Discover our wide range of products</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 text-center">
          {businessTypes.map((category) => {
            const imgSrc = getImageForBusinessType(category.code)
            const isLoaded = loadedImages[imgSrc]
            
            return (
              <Link 
                key={category.id} 
                to="/Ask?type=shop" 
                className="flex flex-col items-center text-center group"
                aria-label={`Browse ${category.name} category`}
              >
                {/* Category Image */}
                <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full mb-4 shadow-lg bg-white border-4 border-gray-100">
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    {isLoaded ? (
                      <img
                        src={imgSrc}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 will-change-transform"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 animate-pulse rounded-full" />
                    )}
                  </div>
                  
                  {/* Hover overlay - using pseudo-element instead of transform */}
                  <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300 pointer-events-none"></div>
                </div>

                {/* Category Name */}
                <h3 className="text-lg md:text-lg font-semibold text-gray-800 capitalize leading-tight relative">
                  {category.name}
                  {/* Underline effect on hover using pseudo-element */}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300 ease-out will-change-transform"></span>
                </h3>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}