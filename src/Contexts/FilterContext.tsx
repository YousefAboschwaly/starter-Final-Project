"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Types
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

export interface AppliedFilters {
  businessType?: BusinessType
  businessCategory?: BusinessTypeCategory
  source?: "navigation" | "user" // Track where the filter came from
}

interface FilterContextType {
  appliedFilters: AppliedFilters
  setBusinessTypeFilter: (businessType: BusinessType) => void
  setBusinessCategoryFilter: (businessType: BusinessType, category: BusinessTypeCategory) => void
  clearAppliedFilters: () => void
  clearSpecificFilter: (filterType: "businessType" | "businessCategory") => void
  hasAppliedFilters: boolean
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

// Session storage key
const FILTER_STORAGE_KEY = "shopAppliedFilters"

interface FilterProviderProps {
  children: ReactNode
}

export function FilterProvider({ children }: FilterProviderProps) {
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({})

  // Load filters from session storage on mount
  useEffect(() => {
    try {
      const savedFilters = sessionStorage.getItem(FILTER_STORAGE_KEY)
      if (savedFilters) {
        const parsed = JSON.parse(savedFilters)
        setAppliedFilters(parsed)
      }
    } catch (error) {
      console.error("Error loading filters from session storage:", error)
    }
  }, [])

  // Save filters to session storage whenever they change
  useEffect(() => {
    try {
      if (Object.keys(appliedFilters).length > 0) {
        sessionStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(appliedFilters))
      } else {
        sessionStorage.removeItem(FILTER_STORAGE_KEY)
      }
    } catch (error) {
      console.error("Error saving filters to session storage:", error)
    }
  }, [appliedFilters])

  const setBusinessTypeFilter = (businessType: BusinessType) => {
    setAppliedFilters({
      businessType,
      source: "navigation",
    })
  }

  const setBusinessCategoryFilter = (businessType: BusinessType, category: BusinessTypeCategory) => {
    setAppliedFilters({
      businessType,
      businessCategory: category,
      source: "navigation",
    })
  }

  const clearAppliedFilters = () => {
    setAppliedFilters({})
  }

  const clearSpecificFilter = (filterType: "businessType" | "businessCategory") => {
    setAppliedFilters((prev) => {
      const newFilters = { ...prev }
      if (filterType === "businessType") {
        delete newFilters.businessType
        delete newFilters.businessCategory // Clear category when business type is cleared
      } else if (filterType === "businessCategory") {
        delete newFilters.businessCategory
      }
      return newFilters
    })
  }

  const hasAppliedFilters = Object.keys(appliedFilters).length > 0

  const value: FilterContextType = {
    appliedFilters,
    setBusinessTypeFilter,
    setBusinessCategoryFilter,
    clearAppliedFilters,
    clearSpecificFilter,
    hasAppliedFilters,
  }

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFilterContext() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error("useFilterContext must be used within a FilterProvider")
  }
  return context
}
