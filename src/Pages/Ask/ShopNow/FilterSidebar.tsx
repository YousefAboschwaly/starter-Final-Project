import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FilterSection } from "./FilterSection"
import { PriceFilter } from "./PriceFilter"
import { ColorFilter } from "./ColorFilter"
import { MaterialFilter } from "./MaterialFilter"
import { BusinessTypeFilter } from "./BusinessTypeFilter"
import { BusinessCategoryFilter } from "./BusinessCategoryFilter"
import { IBusinessType, IBusinessTypeCategories, IColor, IProductMaterial } from "@/interfaces"

interface FilterSidebarProps {
  // Filter states
  minPrice: string
  maxPrice: string
  selectedColorIds: number[]
  selectedMaterialIds: number[]
  selectedBusinessTypeIds: number[]
  selectedBusinessCategoryIds: number[]
  
  // Data arrays
  colors: IColor[]
  materials: IProductMaterial[]
  businessTypes: IBusinessType[]
  availableBusinessCategories: IBusinessTypeCategories[]
  
  // Handler functions
  onMinPriceChange: (value: string) => void
  onMaxPriceChange: (value: string) => void
  onPriceFilter: () => void
  onColorChange: (colorId: number, checked: boolean) => void
  onMaterialChange: (materialId: number, checked: boolean) => void
  onBusinessTypeChange: (businessTypeId: number, checked: boolean) => void
  onBusinessCategoryChange: (businessCategoryId: number, checked: boolean) => void
  onClearFilters: () => void
  
  // Utilities
  activeFiltersCount: number
  idPrefix: string
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
  idPrefix
}: FilterSidebarProps) => {
  return (
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30 animate-in slide-in-from-left-4 duration-700 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
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
              <FilterSection title="Business Types">
                <BusinessTypeFilter
                  businessTypes={businessTypes}
                  selectedBusinessTypeIds={selectedBusinessTypeIds}
                  onBusinessTypeChange={onBusinessTypeChange}
                  idPrefix={idPrefix}
                />
              </FilterSection>

              {/* Business Type Categories */}
              <FilterSection title="Business Type Categories">
                <BusinessCategoryFilter
                  businessCategories={availableBusinessCategories}
                  selectedBusinessCategoryIds={selectedBusinessCategoryIds}
                  onBusinessCategoryChange={onBusinessCategoryChange}
                  idPrefix={idPrefix}
                />
              </FilterSection>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
