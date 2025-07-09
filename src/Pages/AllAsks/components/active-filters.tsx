"use client"

import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface ActiveFiltersProps {
  searchName: string
  selectedUnitTypeIds: number[]
  selectedGovernorateIds: number[]
  selectedCityIds: number[]
  selectedUrgencyLevelIds: number[]
  selectedEngineerTypeIds: number[]
  minPrice: string
  maxPrice: string
  unitTypes: Array<{ id: number; name: string }>
  governorates: Array<{ id: number; name: string }>
  cities: Array<{ id: number; name: string }>
  urgencyLevels: Array<{ id: number; name: string }>
  engineerTypes: Array<{ id: number; name: string }>
  onClearSearch: () => void
  onClearUnitType: (id: number) => void
  onClearGovernorate: (id: number) => void
  onClearCity: (id: number) => void
  onClearUrgencyLevel: (id: number) => void
  onClearEngineerType: (id: number) => void
  onClearPriceRange: () => void
  onClearAllFilters: () => void
}

export function ActiveFilters({
  searchName,
  selectedUnitTypeIds,
  selectedGovernorateIds,
  selectedCityIds,
  selectedUrgencyLevelIds,
  selectedEngineerTypeIds,
  minPrice,
  maxPrice,
  unitTypes,
  governorates,
  cities,
  urgencyLevels,
  engineerTypes,
  onClearSearch,
  onClearUnitType,
  onClearGovernorate,
  onClearCity,
  onClearUrgencyLevel,
  onClearEngineerType,
  onClearPriceRange,
  onClearAllFilters,
}: ActiveFiltersProps) {
  const hasActiveFilters =
    searchName ||
    selectedUnitTypeIds.length > 0 ||
    selectedGovernorateIds.length > 0 ||
    selectedCityIds.length > 0 ||
    selectedUrgencyLevelIds.length > 0 ||
    selectedEngineerTypeIds.length > 0 ||
    minPrice ||
    maxPrice

  if (!hasActiveFilters) return null

  return (
    <div className="mb-4 md:mb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="flex flex-wrap gap-2">
        {/* Search Filter */}
        {searchName && (
          <Badge
            variant="secondary"
            className="px-2 sm:px-3 py-1 bg-purple-50 text-purple-700 border-purple-200 text-xs sm:text-sm"
          >
            Search: {searchName}
            <Button
              variant="ghost"
              size="sm"
              className="ml-1 sm:ml-2 h-auto p-0 text-purple-500 hover:text-purple-700"
              onClick={onClearSearch}
            >
              <X className="w-3 h-3" />
            </Button>
          </Badge>
        )}

        {/* Unit Type Filters */}
        {selectedUnitTypeIds.map((unitTypeId) => {
          const unitType = unitTypes.find((u) => u.id === unitTypeId)
          return unitType ? (
            <Badge
              key={unitTypeId}
              variant="secondary"
              className="px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 border-blue-200 text-xs sm:text-sm"
            >
              Unit: {unitType.name}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 sm:ml-2 h-auto p-0 text-blue-500 hover:text-blue-700"
                onClick={() => onClearUnitType(unitTypeId)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ) : null
        })}

        {/* Governorate Filters */}
        {selectedGovernorateIds.map((governorateId) => {
          const governorate = governorates.find((g) => g.id === governorateId)
          return governorate ? (
            <Badge
              key={governorateId}
              variant="secondary"
              className="px-2 sm:px-3 py-1 bg-green-50 text-green-700 border-green-200 text-xs sm:text-sm"
            >
              Gov: {governorate.name}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 sm:ml-2 h-auto p-0 text-green-500 hover:text-green-700"
                onClick={() => onClearGovernorate(governorateId)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ) : null
        })}

        {/* City Filters */}
        {selectedCityIds.map((cityId) => {
          const city = cities.find((c) => c.id === cityId)
          return city ? (
            <Badge
              key={cityId}
              variant="secondary"
              className="px-2 sm:px-3 py-1 bg-teal-50 text-teal-700 border-teal-200 text-xs sm:text-sm"
            >
              City: {city.name}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 sm:ml-2 h-auto p-0 text-teal-500 hover:text-teal-700"
                onClick={() => onClearCity(cityId)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ) : null
        })}

        {/* Urgency Level Filters */}
        {selectedUrgencyLevelIds.map((urgencyLevelId) => {
          const urgencyLevel = urgencyLevels.find((u) => u.id === urgencyLevelId)
          return urgencyLevel ? (
            <Badge
              key={urgencyLevelId}
              variant="secondary"
              className="px-2 sm:px-3 py-1 bg-orange-50 text-orange-700 border-orange-200 text-xs sm:text-sm"
            >
              Urgency: {urgencyLevel.name}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 sm:ml-2 h-auto p-0 text-orange-500 hover:text-orange-700"
                onClick={() => onClearUrgencyLevel(urgencyLevelId)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ) : null
        })}

        {/* Engineer Type Filters */}
        {selectedEngineerTypeIds.map((engineerTypeId) => {
          const engineerType = engineerTypes.find((e) => e.id === engineerTypeId)
          return engineerType ? (
            <Badge
              key={engineerTypeId}
              variant="secondary"
              className="px-2 sm:px-3 py-1 bg-indigo-50 text-indigo-700 border-indigo-200 text-xs sm:text-sm"
            >
              Engineer: {engineerType.name}
              <Button
                variant="ghost"
                size="sm"
                className="ml-1 sm:ml-2 h-auto p-0 text-indigo-500 hover:text-indigo-700"
                onClick={() => onClearEngineerType(engineerTypeId)}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          ) : null
        })}

        {/* Price Range Filter */}
        {(minPrice || maxPrice) && (
          <Badge
            variant="secondary"
            className="px-2 sm:px-3 py-1 bg-pink-50 text-pink-700 border-pink-200 text-xs sm:text-sm"
          >
            Price: {minPrice || "Min"} - {maxPrice || "Max"} EGP
            <Button
              variant="ghost"
              size="sm"
              className="ml-1 sm:ml-2 h-auto p-0 text-pink-500 hover:text-pink-700"
              onClick={onClearPriceRange}
            >
              <X className="w-3 h-3" />
            </Button>
          </Badge>
        )}
      </div>

      {/* Clear All Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onClearAllFilters}
        className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors duration-200 bg-transparent text-xs sm:text-sm"
      >
        <X className="w-3 sm:w-4 h-3 sm:h-4 mr-1" />
        Clear All Filters
      </Button>
    </div>
  )
}
