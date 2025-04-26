"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, Tag, ChevronDown, Palette, Search, RefreshCw, DollarSign, Filter } from "lucide-react"
import type { IBusinessType, IColor } from "@/interfaces"

interface FilterState {
  minPrice: number | null
  maxPrice: number | null
  colorsIds: number[] | null
  businessTypeIds: number[] | null
}

interface FilterPanelProps {
  filters: FilterState
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>
  colors: IColor[]
  businessTypes: IBusinessType[]
  onClose: () => void
}

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, setFilters, colors, businessTypes, onClose }) => {
  // State for dropdowns
  const [colorsOpen, setColorsOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [colorSearchQuery, setColorSearchQuery] = useState("")
  const [categorySearchQuery, setCategorySearchQuery] = useState("")

  // Refs for dropdown click outside detection
  const colorsDropdownRef = useRef<HTMLDivElement>(null)
  const categoriesDropdownRef = useRef<HTMLDivElement>(null)

  // Handle color selection
  const handleColorToggle = (colorId: number) => {
    setFilters((prev) => ({
      ...prev,
      colorsIds:
        prev.colorsIds === null
          ? [colorId]
          : prev.colorsIds.includes(colorId)
            ? prev.colorsIds.filter((id) => id !== colorId)
            : [...prev.colorsIds, colorId],
    }))
  }

  // Handle category selection
  const handleBusinessTypeToggle = (typeId: number) => {
    setFilters((prev) => ({
      ...prev,
      businessTypeIds:
        prev.businessTypeIds === null
          ? [typeId]
          : prev.businessTypeIds.includes(typeId)
            ? prev.businessTypeIds.filter((id) => id !== typeId)
            : [...prev.businessTypeIds, typeId],
    }))
  }

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      minPrice: null,
      maxPrice: null,
      colorsIds: null,
      businessTypeIds: null,
    })
    setColorSearchQuery("")
    setCategorySearchQuery("")
  }

  // Get color object by ID
  const getColorById = (id: number) => {
    return colors.find((color) => color.id === id)
  }

  // Filter colors based on search query
  const filteredColors = colors.filter((color) => color.name.toLowerCase().includes(colorSearchQuery.toLowerCase()))

  // Filter categories based on search query
  const filteredCategories = businessTypes.filter((type) =>
    type.name.toLowerCase().includes(categorySearchQuery.toLowerCase()),
  )

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorsDropdownRef.current && !colorsDropdownRef.current.contains(event.target as Node)) {
        setColorsOpen(false)
      }
      if (categoriesDropdownRef.current && !categoriesDropdownRef.current.contains(event.target as Node)) {
        setCategoriesOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Get selected colors count
  const selectedColorsCount = filters.colorsIds?.length || 0

  // Get selected categories count
  const selectedCategoriesCount = filters.businessTypeIds?.length || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-white border-b border-gray-200 shadow-lg rounded-b-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header with title and actions */}
        <div className="flex items-center justify-between mb-6">
          <motion.h2
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl font-semibold text-gray-900 flex items-center gap-2"
          >
            <Filter className="w-5 h-5 text-purple-600" />
            Filters
          </motion.h2>
          <div className="flex items-center gap-4">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              onClick={resetFilters}
              className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset all
            </motion.button>
            <motion.button
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ rotate: 90, scale: 1.1 }}
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Active Filters section */}
        {(filters.minPrice || filters.maxPrice || filters.colorsIds?.length || filters.businessTypeIds?.length) && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Active Filters:</h3>
            <div className="flex flex-wrap gap-2">
              {filters.minPrice && (
                <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                  Min Price: ${filters.minPrice}
                </div>
              )}
              {filters.maxPrice && (
                <div className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                  Max Price: ${filters.maxPrice}
                </div>
              )}
              {filters.colorsIds?.map((colorId) => {
                const color = getColorById(colorId)
                return color ? (
                  <div
                    key={`active-${colorId}`}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700 flex items-center gap-1"
                  >
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color.hexColor }} />
                    {color.name}
                  </div>
                ) : null
              })}
              {filters.businessTypeIds?.map((typeId) => {
                const type = businessTypes.find((t) => t.id === typeId)
                return type ? (
                  <div key={`active-${typeId}`} className="bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700">
                    {type.name}
                  </div>
                ) : null
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Price Range */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200 shadow-sm"
          >
            <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              Price Range
            </h3>
            <div className="flex gap-2 items-center">
              <div className="relative w-full">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minPrice: e.target.value ? Number(e.target.value) : null,
                    }))
                  }
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pl-8"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              </div>
              <span className="text-gray-500">-</span>
              <div className="relative w-full">
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxPrice: e.target.value ? Number(e.target.value) : null,
                    }))
                  }
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pl-8"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              </div>
            </div>
          </motion.div>

          {/* Colors Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative"
            ref={colorsDropdownRef}
          >
            <div
              className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200 shadow-sm cursor-pointer h-full"
              onClick={() => setColorsOpen(!colorsOpen)}
            >
              <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-purple-600" />
                  Colors
                  {selectedColorsCount > 0 && (
                    <span className="bg-purple-600 text-white text-xs rounded-full px-2 py-0.5 ml-2">
                      {selectedColorsCount}
                    </span>
                  )}
                </span>
                <motion.div animate={{ rotate: colorsOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-4  text-gray-500" />
                </motion.div>
              </h3>

            </div>

            {/* Colors dropdown content */}
            <AnimatePresence>
              {colorsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-30 overflow-hidden"
                >
                  <div className="p-3 border-b border-gray-100">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search colors..."
                        value={colorSearchQuery}
                        onChange={(e) => setColorSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="max-h-60 overflow-y-auto p-2">
                    {filteredColors.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">No colors found</div>
                    ) : (
                      filteredColors.map((color, index) => (
                        <motion.div
                          key={color.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          onClick={() => handleColorToggle(color.id)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer ${
                            filters.colorsIds?.includes(color.id) ? "bg-purple-50" : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className="w-6 h-6 rounded-full shadow-sm"
                              style={{ backgroundColor: color.hexColor }}
                            />
                            <span className="text-sm">{color.name}</span>
                          </div>
                          {filters.colorsIds?.includes(color.id) && <Check className="w-4 h-4 text-purple-600" />}
                        </motion.div>
                      ))
                    )}
                  </div>

                  <div className="p-3 border-t border-gray-100 bg-gray-50 flex justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setFilters((prev) => ({ ...prev, colorsIds: null }))
                      }}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Clear selection
                    </button>
                    <button
                      onClick={() => setColorsOpen(false)}
                      className="text-sm text-purple-600 font-medium hover:text-purple-800"
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Categories Dropdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative"
            ref={categoriesDropdownRef}
          >
            <div
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200 shadow-sm cursor-pointer h-full"
              onClick={() => setCategoriesOpen(!categoriesOpen)}
            >
              <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-blue-600" />
                  Categories
                  {selectedCategoriesCount > 0 && (
                    <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 ml-2">
                      {selectedCategoriesCount}
                    </span>
                  )}
                </span>
                <motion.div animate={{ rotate: categoriesOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </motion.div>
              </h3>
            </div>

            {/* Categories dropdown content */}
            <AnimatePresence>
              {categoriesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 z-30 overflow-hidden"
                >
                  <div className="p-3 border-b border-gray-100">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search categories..."
                        value={categorySearchQuery}
                        onChange={(e) => setCategorySearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="max-h-60 overflow-y-auto p-2">
                    {filteredCategories.length === 0 ? (
                      <div className="text-center py-4 text-gray-500">No categories found</div>
                    ) : (
                      filteredCategories.map((type, index) => (
                        <motion.div
                          key={type.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03 }}
                          onClick={() => handleBusinessTypeToggle(type.id)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer ${
                            filters.businessTypeIds?.includes(type.id) ? "bg-blue-50" : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                filters.businessTypeIds?.includes(type.id) ? "bg-blue-200" : "bg-gray-100"
                              }`}
                            >
                              <CategoryIcon
                                type={type.name}
                                selected={filters.businessTypeIds?.includes(type.id) || false}
                              />
                            </div>
                            <span className="text-sm font-medium">{type.name}</span>
                          </div>
                          {filters.businessTypeIds?.includes(type.id) && <Check className="w-4 h-4 text-blue-600" />}
                        </motion.div>
                      ))
                    )}
                  </div>

                  <div className="p-3 border-t border-gray-100 bg-gray-50 flex justify-between">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setFilters((prev) => ({ ...prev, businessTypeIds: null }))
                      }}
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Clear selection
                    </button>
                    <button
                      onClick={() => setCategoriesOpen(false)}
                      className="text-sm text-blue-600 font-medium hover:text-blue-800"
                    >
                      Done
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

// Component to display category icons
function CategoryIcon({ type, selected }: { type: string; selected: boolean }) {
  const className = `w-4 h-4 ${selected ? "text-blue-600" : "text-gray-500"}`

  switch (type.toLowerCase()) {
    case "furniture":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="4" width="16" height="6" rx="2" />
          <rect x="4" y="14" width="16" height="6" rx="2" />
          <line x1="12" y1="10" x2="12" y2="14" />
        </svg>
      )
    case "kitchens and dressing":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
          <path d="M7 2v20" />
          <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </svg>
      )
    case "electrical tools":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      )
    case "furnishings":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3" />
          <path d="M5 8h14" />
          <path d="M17 8v13H7V8" />
        </svg>
      )
    case "paint materials":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z" />
          <path d="m5 2 5 5" />
          <path d="M2 13h15" />
          <path d="M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z" />
        </svg>
      )
    default:
      return <Tag className={className} />
  }
}

export default FilterPanel

