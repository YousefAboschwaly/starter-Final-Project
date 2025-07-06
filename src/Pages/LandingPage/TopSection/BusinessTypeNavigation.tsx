"use client"

import { useFilterContext } from "@/Contexts/FilterContext"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

interface BusinessType {
  id: number
  code: string
  name: string
}

interface BusinessTypeCategory {
  id: number
  code: string
  name: string
  businessType: {
    id: number
    code: string
    name: string
  }
}

interface BusinessTypeNavigationProps {
  businessTypes: BusinessType[]
  businessTypeCategories: BusinessTypeCategory[]
}

export default function BusinessTypeNavigation({ businessTypes, businessTypeCategories }: BusinessTypeNavigationProps) {
  const [hoveredBusinessType, setHoveredBusinessType] = useState<number | null>(null)
  const navigate = useNavigate()
  const { setBusinessTypeFilter, setBusinessCategoryFilter } = useFilterContext()

  if (businessTypes.length === 0) {
    return null
  }

  // Navigate to shop with business type filter using context
  const handleBusinessTypeClick = (businessType: BusinessType) => {
    setBusinessTypeFilter(businessType)
    navigate("/Ask?type=shop")
  }

  // Navigate to shop with business type and category filters using context
  const handleCategoryClick = (category: BusinessTypeCategory) => {
    const businessType: BusinessType = {
      id: category.businessType.id,
      code: category.businessType.code,
      name: category.businessType.name,
    }

    const businessCategory = {
      id: category.id,
      code: category.code,
      name: category.name,
      businessType: businessType,
    }

    setBusinessCategoryFilter(businessType, businessCategory)
    navigate("/Ask?type=shop")
  }

  // Get categories for a specific business type
  const getCategoriesForBusinessType = (businessTypeId: number): BusinessTypeCategory[] => {
    return businessTypeCategories.filter((category) => category.businessType.id === businessTypeId)
  }

  // Organize categories into 3 columns
  const organizeIntoColumns = (categories: BusinessTypeCategory[]) => {
    const totalCategories = categories.length
    const categoriesPerColumn = Math.ceil(totalCategories / 3)

    return {
      column1: categories.slice(0, categoriesPerColumn),
      column2: categories.slice(categoriesPerColumn, categoriesPerColumn * 2),
      column3: categories.slice(categoriesPerColumn * 2),
    }
  }

  return (
    <div className="relative hidden md:block" onMouseLeave={() => setHoveredBusinessType(null)}>
      {/* Business Type Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm relative z-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center space-x-8 px-4 py-4">
            {businessTypes.map((businessType) => (
              <button
                key={businessType.id}
                className={`text-gray-700 hover:text-blue-600 font-medium text-sm transition-colors duration-200 px-4 py-2 ${
                  hoveredBusinessType === businessType.id ? "text-blue-600 underline" : ""
                }`}
                onMouseEnter={() => setHoveredBusinessType(businessType.id)}
                onClick={() => handleBusinessTypeClick(businessType)}
              >
                {businessType.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dropdown Section */}
      {hoveredBusinessType && (
        <>
          {/* Background Blur Overlay */}
          <div
            className="fixed left-0 right-0 bottom-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
            style={{ top: "var(--nav-height, 120px)" }}
            onMouseEnter={() => setHoveredBusinessType(null)}
            onClick={() => setHoveredBusinessType(null)}
          ></div>

          <div className="absolute top-full left-0 right-0 z-50">
            {/* Dropdown Content */}
            <div className="bg-white border border-gray-200 shadow-xl relative z-50">
              <div className="max-w-7xl mx-auto p-8">
                {(() => {
                  const relatedCategories = getCategoriesForBusinessType(hoveredBusinessType)
                  if (relatedCategories.length === 0) return null

                  const { column1, column2, column3 } = organizeIntoColumns(relatedCategories)

                  return (
                    <div className="grid grid-cols-3 gap-12">
                      {/* Column 1 */}
                      <div className="space-y-4">
                        {column1.length > 0 && (
                          <div>
                            <h3 className="font-semibold text-blue-600 text-sm mb-3 border-b border-gray-200 pb-1">
                              {businessTypes.find((bt) => bt.id === hoveredBusinessType)?.name} Categories
                            </h3>
                            <div className="space-y-2">
                              {column1.map((category) => (
                                <button
                                  key={category.id}
                                  onClick={() => handleCategoryClick(category)}
                                  className="block text-gray-700 hover:text-blue-600 text-sm py-1 transition-colors duration-150 text-left w-full"
                                >
                                  {category.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Column 2 */}
                      <div className="space-y-4">
                        {column2.length > 0 && (
                          <div>
                            <h3 className="font-semibold text-blue-600 text-sm mb-3 border-b border-gray-200 pb-1">
                              More {businessTypes.find((bt) => bt.id === hoveredBusinessType)?.name}
                            </h3>
                            <div className="space-y-2">
                              {column2.map((category) => (
                                <button
                                  key={category.id}
                                  onClick={() => handleCategoryClick(category)}
                                  className="block text-gray-700 hover:text-blue-600 text-sm py-1 transition-colors duration-150 text-left w-full"
                                >
                                  {category.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Column 3 */}
                      <div className="space-y-4">
                        {column3.length > 0 && (
                          <div>
                            <h3 className="font-semibold text-blue-600 text-sm mb-3 border-b border-gray-200 pb-1">
                              Popular {businessTypes.find((bt) => bt.id === hoveredBusinessType)?.name}
                            </h3>
                            <div className="space-y-2">
                              {column3.map((category) => (
                                <button
                                  key={category.id}
                                  onClick={() => handleCategoryClick(category)}
                                  className="block text-gray-700 hover:text-blue-600 text-sm py-1 transition-colors duration-150 text-left w-full"
                                >
                                  {category.name}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })()}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
