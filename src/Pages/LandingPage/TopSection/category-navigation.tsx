"use client"

import { useState, useRef } from "react"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"

// Categories with beautiful images
const categories = [
  {
    name: "Donate For Gaza",
    icon: "/CategoriesImages/furniture.avif",
    href: "/donate",
  },
  {
    name: "Installments & Discounts",
    icon: "/CategoriesImages/act2.avif",
    href: "/installments",
  },
  {
    name: "Shop Local",
    icon: "/CategoriesImages/cat3.avif",
    href: "/local",
  },
  {
    name: "Bestsellers",
    icon: "/CategoriesImages/furniture.avif",
    href: "/bestsellers",
  },
  {
    name: "Men's Fashion",
    icon: "/CategoriesImages/furniture.avif",
    href: "/mens",
  },
  {
    name: "Women's Fashion",
    icon: "/CategoriesImages/furniture.avif",
    href: "/womens",
  },
  {
    name: "Kids' Fashion",
    icon: "/CategoriesImages/toys.avif",
    href: "/kids",
  },
  {
    name: "Home & Kitchen",
    icon: "/CategoriesImages/furniture.avif",
    href: "/home",
  },
  {
    name: "Mobiles",
    icon: "/CategoriesImages/furniture.avif",
    href: "/mobiles",
  },
  {
    name: "Televisions",
    icon: "/CategoriesImages/furniture.avif",
    href: "/televisions",
  },
  {
    name: "Appliances",
    icon: "/CategoriesImages/furniture.avif",
    href: "/appliances",
  },
  {
    name: "Beauty",
    icon: "/CategoriesImages/furniture.avif",
    href: "/beauty",
  },
]

export default function CategoryNavigation() {
  const [activePage, setActivePage] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const totalPages = Math.ceil(categories.length / 8)

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollContainerRef.current.clientWidth,
        behavior: "smooth",
      })

      setActivePage((prev) => Math.min(prev + 1, totalPages - 1))
    }
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollContainerRef.current.clientWidth,
        behavior: "smooth",
      })

      setActivePage((prev) => Math.max(prev - 1, 0))
    }
  }

  return (
    <div className="relative py-6 ">
      <div className="max-w-[87rem] mx-auto px-4 relative ">
        <div ref={scrollContainerRef} className="flex overflow-x-auto gap-4 pb-6 scrollbar-hide">
          {categories.map((category, index) => (
            <Link key={index} to={category.href} className="flex flex-col items-center min-w-[100px] text-center">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 mb-2">
                <img
                  src={category.icon || "/placeholder.svg"}
                  alt={category.name}
                  width={80}
                  height={80}
                  className="object-cover"
                />
              </div>
              <span className="text-sm text-gray-800 font-medium">
                {category.name.includes(" ")
                  ? category.name.split(" ").map((word, i) => (
                      <span key={i} className="block leading-tight">
                        {word}
                      </span>
                    ))
                  : category.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Left scroll button */}
        <button
          onClick={scrollLeft}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md z-10 transition-all focus:outline-none"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5 text-gray-800" />
        </button>

        {/* Right scroll button */}
        <button
          onClick={scrollRight}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md z-10 transition-all focus:outline-none"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5 text-gray-800" />
        </button>

        {/* Dots navigation */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex space-x-1">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setActivePage(index)
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollTo({
                    left: index * scrollContainerRef.current.clientWidth,
                    behavior: "smooth",
                  })
                }
              }}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                activePage === index ? "w-6 bg-gray-800" : "bg-gray-300",
              )}
              aria-label={`Go to category page ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
