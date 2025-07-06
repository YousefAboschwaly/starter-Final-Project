"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FilterSection } from "./FilterSection"
import { PriceFilter } from "./PriceFilter"
import { ColorFilter } from "./ColorFilter"
import { MaterialFilter } from "./MaterialFilter"
import { BusinessTypeFilter } from "./BusinessTypeFilter"
import { BusinessCategoryFilter } from "./BusinessCategoryFilter"

interface Color {
  id: number
  code: string
  name: string
  hexColor: string
}

interface Material {
  id: number
  code: string
  name: string
}

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

interface AppliedFilters {
  businessType?: BusinessType
  businessCategory?: BusinessTypeCategory
  source?: "navigation" | "user"
}

interface FilterSidebarProps {
  minPrice: string
  maxPrice: string
  selectedColorIds: number[]
  selectedMaterialIds: number[]
  selectedBusinessTypeIds: number[]
  selectedBusinessCategoryIds: number[]
  colors: Color[]
  materials: Material[]
  businessTypes: BusinessType[]
  availableBusinessCategories: BusinessTypeCategory[]
  onMinPriceChange: (value: string) => void
  onMaxPriceChange: (value: string) => void
  onPriceFilter: () => void
  onColorChange: (colorId: number, checked: boolean) => void
  onMaterialChange: (materialId: number, checked: boolean) => void
  onBusinessTypeChange: (businessTypeId: number, checked: boolean) => void
  onBusinessCategoryChange: (businessCategoryId: number, checked: boolean) => void
  onClearFilters: () => void
  activeFiltersCount: number
  idPrefix: string
  appliedFilters: AppliedFilters
}

export const FilterSidebar = ({
  minPrice,
  maxPrice,
  selectedColorIds,
  selectedMaterialIds,
  selectedBusinessTypeIds,
  selectedBusinessCategoryIds,
  colors,
  materials,
  businessTypes,
  availableBusinessCategories,
  onMinPriceChange,
  onMaxPriceChange,
  onPriceFilter,
  onColorChange,
  onMaterialChange,
  onBusinessTypeChange,
  onBusinessCategoryChange,
  onClearFilters,
  activeFiltersCount,
  idPrefix,
  appliedFilters,
}: FilterSidebarProps) => {
  const hasAppliedFilters = appliedFilters.businessType || appliedFilters.businessCategory

  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Filters</h3>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
              >
                Clear All
              </Button>
            )}
          </div>

          {/* Applied Filters Section */}
          {hasAppliedFilters && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm font-medium text-blue-800 mb-2">Applied Filters:</div>
              <div className="flex flex-wrap gap-2">
                {appliedFilters.businessType && (
                  <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-700 border-blue-300 cursor-pointer hover:bg-blue-200 transition-colors"
                    onClick={() => onBusinessTypeChange(appliedFilters.businessType!.id, false)}
                  >
                    {appliedFilters.businessType.name}
                  </Badge>
                )}
                {appliedFilters.businessCategory && (
                  <Badge
                    variant="outline"
                    className="bg-blue-100 text-blue-700 border-blue-300 cursor-pointer hover:bg-blue-200 transition-colors"
                    onClick={() => onBusinessCategoryChange(appliedFilters.businessCategory!.id, false)}
                  >
                    {appliedFilters.businessCategory.name}
                  </Badge>
                )}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                These filters are automatically applied. Click to remove or add more filters below.
              </div>
            </div>
          )}

          <div className="space-y-2">
            {/* Price Range */}
            <FilterSection title="Price Range">
              <PriceFilter
                minPrice={minPrice}
                maxPrice={maxPrice}
                onMinPriceChange={onMinPriceChange}
                onMaxPriceChange={onMaxPriceChange}
                onApplyFilter={onPriceFilter}
              />
            </FilterSection>

            {/* Colors */}
            <FilterSection title="Colors">
              <ColorFilter
                colors={colors}
                selectedColorIds={selectedColorIds}
                onColorChange={onColorChange}
                idPrefix={idPrefix}
              />
            </FilterSection>

            {/* Materials */}
            <FilterSection title="Materials">
              <MaterialFilter
                materials={materials}
                selectedMaterialIds={selectedMaterialIds}
                onMaterialChange={onMaterialChange}
                idPrefix={idPrefix}
              />
            </FilterSection>

            {/* Business Types */}
            <FilterSection title="Business Types" defaultOpen={!!appliedFilters.businessType}>
              <BusinessTypeFilter
                businessTypes={businessTypes}
                selectedBusinessTypeIds={selectedBusinessTypeIds}
                onBusinessTypeChange={onBusinessTypeChange}
                idPrefix={idPrefix}
                appliedFilters={appliedFilters}
              />
            </FilterSection>

            {/* Business Type Categories */}
            <FilterSection title="Business Type Categories" defaultOpen={!!appliedFilters.businessCategory}>
              <BusinessCategoryFilter
                businessCategories={availableBusinessCategories}
                selectedBusinessCategoryIds={selectedBusinessCategoryIds}
                onBusinessCategoryChange={onBusinessCategoryChange}
                idPrefix={idPrefix}
                appliedFilters={appliedFilters}
              />
            </FilterSection>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
