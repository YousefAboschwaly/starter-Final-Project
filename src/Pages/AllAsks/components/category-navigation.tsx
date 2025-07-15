"use client"
import { ChevronLeft, ChevronRight, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Service {
  iconSrc: string
  label: string
  link: string
  type: string
}

interface CategoryNavigationProps {
  onCategoryChange?: (serviceType: string) => void
  onMyAsksClick?: (serviceType: string) => void
  showMyAsksButton?: boolean
  activeServiceType?: string
}

// Helper function to normalize service type for comparison
const normalizeServiceType = (type: string): string => {
  switch (type) {
    case "ask-engineer":
    case "engineer":
      return "engineer"
    case "ask-worker":
    case "worker":
      return "worker"
    case "home-renovate":
    case "homerenovate":
    case "home_renovate":
      return "home-renovate"
    case "request-design":
    case "requestdesign":
      return "request-design"
    case "custom-package":
    case "custompackage":
    case "custom_package":
      return "custom-package"
    default:
      return type
  }
}

const services: Service[] = [
  {
    iconSrc: "/Icons/AskEngineer.png",
    label: "Ask to Engineer",
    link: "/Ask?type=engineer",
    type: "engineer",
  },
  {
    iconSrc: "/Icons/AskTechnichal.png",
    label: "Ask to Technical",
    link: "/Ask?type=worker",
    type: "worker",
  },
  {
    iconSrc: "/Icons/RevonateHome.png",
    label: "Renovate Your Home",
    link: "/Ask?type=home-renovate",
    type: "home-renovate",
  },
  {
    iconSrc: "/Icons/RequestDesign.png",
    label: "Request design",
    link: "/Ask?type=request-design",
    type: "request-design",
  },
  {
    iconSrc: "/Icons/RevonateHome.png", // Same icon as Renovate Home
    label: "Custom Package",
    link: "/Ask?type=custom-package",
    type: "custom-package",
  },
]

export function CategoryNavigation({
  onCategoryChange,
  onMyAsksClick,
  showMyAsksButton = true,
  activeServiceType,
}: CategoryNavigationProps) {
  const handleCategoryClick = (serviceType: string) => {
    onCategoryChange?.(serviceType)
  }

  const handleMyAsksClick = () => {
    if (activeServiceType) {
      onMyAsksClick?.(activeServiceType)
    }
  }

  const scrollLeft = () => {
    const container = document.getElementById("category-container")
    if (container) {
      container.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    const container = document.getElementById("category-container")
    if (container) {
      container.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  return (
    <div className="space-y-4">
      {/* Categories Section */}
      <div className="relative w-full">
        {/* Left Arrow */}
        <Button
          variant="ghost"
          size="sm"
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 hover:bg-gray-700 rounded-full w-8 h-8 p-0 shadow-lg"
        >
          <ChevronLeft className="w-4 h-4 text-white" />
        </Button>

        {/* Categories Container */}
        <div
          id="category-container"
          className="flex gap-4 sm:gap-5 lg:gap-6 xl:gap-8 2xl:gap-10 overflow-x-auto scrollbar-hide px-12 py-3"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {services.map((service) => (
            <button
              key={service.type}
              onClick={() => handleCategoryClick(service.type)}
              className={`flex items-center gap-2 whitespace-nowrap transition-all duration-300 hover:scale-105 min-w-fit px-4 py-3 rounded-full font-medium ${
                normalizeServiceType(activeServiceType || "") === normalizeServiceType(service.type)
                  ? "bg-[#2D2D4C] text-white shadow-lg transform scale-105"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <img
                src={service.iconSrc || "/placeholder.svg"}
                alt={service.label}
                className="w-5 h-5 object-contain"
                onError={(e) => {
                  // Fallback to placeholder if icon fails to load
                  e.currentTarget.src = "/placeholder.svg?height=20&width=20"
                }}
              />
              <span
                className={`text-sm lg:text-base font-medium ${
                  normalizeServiceType(activeServiceType || "") === normalizeServiceType(service.type)
                    ? "text-white"
                    : ""
                }`}
              >
                {service.label}
              </span>
            </button>
          ))}
        </div>

        {/* Right Arrow */}
        <Button
          variant="ghost"
          size="sm"
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 hover:bg-gray-700 rounded-full w-8 h-8 p-0 shadow-lg"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </Button>
      </div>

      {/* My Asks Button */}
      {showMyAsksButton && (
        <div className="flex justify-end">
          <Button
            onClick={handleMyAsksClick}
            className="bg-[#2D2D4C] hover:bg-[#1f1f35] text-white px-6 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            My Asks
          </Button>
        </div>
      )}
    </div>
  )
}
