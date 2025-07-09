"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FilterSection } from "./filter-section"
import { PriceFilter } from "./filters/price-filter"
import { UnitTypeFilter } from "./filters/unit-type-filter"
import { GovernorateFilter } from "./filters/governorate-filter"
import { CityFilter } from "./filters/city-filter"
import { UrgencyLevelFilter } from "./filters/urgency-level-filter"
import { EngineerTypeFilter } from "./filters/engineer-type-filter"
import { MaterialFilter } from "./filters/material-filter"
import { WorkerTypeFilter } from "./filters/worker-type-filter"
import { useFilterData, useCities } from "@/hooks/useFilterData"
import { useWorkerFilterData } from "@/hooks/useWorkerFilterData"
import type { BusinessType } from "@/hooks/useBusinessConfig"
import { UnitAreaFilter } from "./filters/unit-area-filter"
import { DurationFilter } from "./filters/duration-filter"
import { UnitStatusFilter } from "./filters/unit-status-filter"
import { UnitWorkTypeFilter } from "./filters/unit-work-type-filter"
import { WorkSkillFilter } from "./filters/work-skill-filter"
import { useHomeRenovateFilterData } from "@/hooks/useHomeRenovateFilterData"
import { CompoundFilter } from "./filters/compound-filter"
import { CustomPackageFilter } from "./filters/custom-package-filter"
import { useCustomPackageData } from "@/hooks/useCustomPackageData"

interface DynamicFilterSidebarProps {
  minUnitArea: string
  maxUnitArea: string
  minDuration: string
  maxDuration: string
  onMinUnitAreaChange: (value: string) => void
  onMaxUnitAreaChange: (value: string) => void
  onMinDurationChange: (value: string) => void
  onMaxDurationChange: (value: string) => void
  selectedBusinessType: BusinessType | null
  minPrice: string
  maxPrice: string
  selectedUnitTypeId: number | null
  selectedGovernorateId: number | null
  selectedCityId: number | null
  selectedUrgencyLevelId: number | null
  selectedEngineerTypeId: number | null
  selectedMaterialId: number | null
  selectedWorkerTypeId: number | null
  onMinPriceChange: (value: string) => void
  onMaxPriceChange: (value: string) => void
  onUnitTypeChange: (unitTypeId: number, checked: boolean) => void
  onGovernorateChange: (governorateId: number, checked: boolean) => void
  onCityChange: (cityId: number, checked: boolean) => void
  onUrgencyLevelChange: (urgencyLevelId: number, checked: boolean) => void
  onEngineerTypeChange: (engineerTypeId: number, checked: boolean) => void
  onMaterialChange: (materialId: number, checked: boolean) => void
  onWorkerTypeChange: (workerTypeId: number, checked: boolean) => void
  onClearFilters: () => void
  activeFiltersCount: number
  idPrefix: string
  selectedUnitStatusId: number | null
  selectedUnitWorkTypeId: number | null
  selectedWorkSkillId: number | null
  onUnitStatusChange: (unitStatusId: number, checked: boolean) => void
  onUnitWorkTypeChange: (unitWorkTypeId: number, checked: boolean) => void
  onWorkSkillChange: (workSkillId: number, checked: boolean) => void
  selectedCustomPackageId: number | null
  selectedCompoundValue: boolean | null
  onCustomPackageChange: (customPackageId: number, checked: boolean) => void
  onCompoundChange: (value: boolean | null) => void
}

export function DynamicFilterSidebar({
  selectedBusinessType,
  minPrice,
  maxPrice,
  selectedUnitTypeId,
  selectedGovernorateId,
  selectedCityId,
  selectedUrgencyLevelId,
  selectedEngineerTypeId,
  selectedMaterialId,
  selectedWorkerTypeId,
  onMinPriceChange,
  onMaxPriceChange,
  onUnitTypeChange,
  onGovernorateChange,
  onCityChange,
  onUrgencyLevelChange,
  onEngineerTypeChange,
  onMaterialChange,
  onWorkerTypeChange,
  onClearFilters,
  activeFiltersCount,
  idPrefix,
  minUnitArea,
  maxUnitArea,
  minDuration,
  maxDuration,
  onMinUnitAreaChange,
  onMaxUnitAreaChange,
  onMinDurationChange,
  onMaxDurationChange,
  selectedUnitStatusId,
  selectedUnitWorkTypeId,
  selectedWorkSkillId,
  onUnitStatusChange,
  onUnitWorkTypeChange,
  onWorkSkillChange,
  selectedCustomPackageId,
  selectedCompoundValue,
  onCustomPackageChange,
  onCompoundChange,
}: DynamicFilterSidebarProps) {
  const { unitTypes, governorates, urgencyLevels, engineerTypes, isLoading: isFilterDataLoading } = useFilterData()
  const {
    materials,
    workerTypes,
    workerUnitTypes,
    workerGovernorates,
    isLoading: isWorkerDataLoading,
  } = useWorkerFilterData()

  const {
    homeRenovateUnitTypes,
    unitStatuses,
    unitWorkTypes,
    workSkills,
    homeRenovateGovernorates,
    isLoading: isHomeRenovateDataLoading,
  } = useHomeRenovateFilterData()

  const { customPackages, isLoading: isCustomPackageDataLoading } = useCustomPackageData()

  // Get cities based on selected governorate
  const { data: citiesData, isLoading: isCitiesLoading } = useCities(selectedGovernorateId)
  const cities = citiesData?.data || []

  if (isFilterDataLoading || isWorkerDataLoading || isHomeRenovateDataLoading || isCustomPackageDataLoading) {
    return (
      <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Render filters based on business type
  const renderFiltersForBusinessType = () => {
    if (!selectedBusinessType) return null

    const businessTypeCode = selectedBusinessType.code.toLowerCase()

    switch (businessTypeCode) {
      case "ask_engineer":
        return (
          <>
            <FilterSection title="Unit Type">
              <UnitTypeFilter
                unitTypes={unitTypes}
                selectedUnitTypeIds={selectedUnitTypeId ? [selectedUnitTypeId] : []}
                onUnitTypeChange={onUnitTypeChange}
                idPrefix={idPrefix}
              />
            </FilterSection>

            <FilterSection title="Governorate">
              <GovernorateFilter
                governorates={governorates}
                selectedGovernorateIds={selectedGovernorateId ? [selectedGovernorateId] : []}
                onGovernorateChange={onGovernorateChange}
                idPrefix={idPrefix}
              />
            </FilterSection>

            <FilterSection title="City">
              <CityFilter
                cities={cities}
                selectedCityIds={selectedCityId ? [selectedCityId] : []}
                onCityChange={onCityChange}
                idPrefix={idPrefix}
                isLoading={isCitiesLoading}
              />
            </FilterSection>

            <FilterSection title="Urgency Level">
              <UrgencyLevelFilter
                urgencyLevels={urgencyLevels}
                selectedUrgencyLevelIds={selectedUrgencyLevelId ? [selectedUrgencyLevelId] : []}
                onUrgencyLevelChange={onUrgencyLevelChange}
                idPrefix={idPrefix}
              />
            </FilterSection>

            <FilterSection title="Engineer Type">
              <EngineerTypeFilter
                engineerTypes={engineerTypes}
                selectedEngineerTypeIds={selectedEngineerTypeId ? [selectedEngineerTypeId] : []}
                onEngineerTypeChange={onEngineerTypeChange}
                idPrefix={idPrefix}
              />
            </FilterSection>
          </>
        )

      case "technical_worker":
        return (
          <>
            <FilterSection title="Unit Type">
              <UnitTypeFilter
                unitTypes={workerUnitTypes}
                selectedUnitTypeIds={selectedUnitTypeId ? [selectedUnitTypeId] : []}
                onUnitTypeChange={onUnitTypeChange}
                idPrefix={idPrefix}
              />
            </FilterSection>

            <FilterSection title="Governorate">
              <GovernorateFilter
                governorates={workerGovernorates}
                selectedGovernorateIds={selectedGovernorateId ? [selectedGovernorateId] : []}
                onGovernorateChange={onGovernorateChange}
                idPrefix={idPrefix}
              />
            </FilterSection>

            <FilterSection title="City">
              <CityFilter
                cities={cities}
                selectedCityIds={selectedCityId ? [selectedCityId] : []}
                onCityChange={onCityChange}
                idPrefix={idPrefix}
                isLoading={isCitiesLoading}
              />
            </FilterSection>

            <FilterSection title="Material">
              <MaterialFilter
                materials={materials}
                selectedMaterialId={selectedMaterialId}
                onMaterialChange={onMaterialChange}
                idPrefix={idPrefix}
              />
            </FilterSection>

            <FilterSection title="Worker Type">
              <WorkerTypeFilter
                workerTypes={workerTypes}
                selectedWorkerTypeId={selectedWorkerTypeId}
                onWorkerTypeChange={onWorkerTypeChange}
                idPrefix={idPrefix}
              />
            </FilterSection>
          </>
        )




      case "design_request":
        return (
          <>
            <FilterSection title="Unit Type">
              <UnitTypeFilter
                unitTypes={unitTypes}
                selectedUnitTypeIds={selectedUnitTypeId ? [selectedUnitTypeId] : []}
                onUnitTypeChange={onUnitTypeChange}
                idPrefix={idPrefix}
              />
            </FilterSection>

            <FilterSection title="Unit Area (m²)">
              <UnitAreaFilter
                minUnitArea={minUnitArea}
                maxUnitArea={maxUnitArea}
                onMinUnitAreaChange={onMinUnitAreaChange}
                onMaxUnitAreaChange={onMaxUnitAreaChange}
              />
            </FilterSection>

            <FilterSection title="Required Duration (days)">
              <DurationFilter
                minDuration={minDuration}
                maxDuration={maxDuration}
                onMinDurationChange={onMinDurationChange}
                onMaxDurationChange={onMaxDurationChange}
              />
            </FilterSection>

            <FilterSection title="Governorate">
              <GovernorateFilter
                governorates={governorates}
                selectedGovernorateIds={selectedGovernorateId ? [selectedGovernorateId] : []}
                onGovernorateChange={onGovernorateChange}
                idPrefix={idPrefix}
              />
            </FilterSection>
          </>
        )

      case "home_renovate":
        return (
          <>
            <FilterSection title="Unit Type">
              <UnitTypeFilter
                unitTypes={homeRenovateUnitTypes}
                selectedUnitTypeIds={selectedUnitTypeId ? [selectedUnitTypeId] : []}
                onUnitTypeChange={onUnitTypeChange}
                idPrefix={idPrefix}
              />
            </FilterSection>

            <FilterSection title="Unit Area (m²)">
              <UnitAreaFilter
                minUnitArea={minUnitArea}
                maxUnitArea={maxUnitArea}
                onMinUnitAreaChange={onMinUnitAreaChange}
                onMaxUnitAreaChange={onMaxUnitAreaChange}
              />
            </FilterSection>

            <FilterSection title="Required Duration (days)">
              <DurationFilter
                minDuration={minDuration}
                maxDuration={maxDuration}
                onMinDurationChange={onMinDurationChange}
                onMaxDurationChange={onMaxDurationChange}
              />
            </FilterSection>

            <FilterSection title="Unit Status">
              <UnitStatusFilter
                unitStatuses={unitStatuses}
                selectedUnitStatusId={selectedUnitStatusId}
                onUnitStatusChange={onUnitStatusChange}
                idPrefix={idPrefix}
              />
            </FilterSection>

            <FilterSection title="Unit Work Type">
              <UnitWorkTypeFilter
                unitWorkTypes={unitWorkTypes}
                selectedUnitWorkTypeId={selectedUnitWorkTypeId}
                onUnitWorkTypeChange={onUnitWorkTypeChange}
                idPrefix={idPrefix}
              />
            </FilterSection>

            <FilterSection title="Work Skills">
              <WorkSkillFilter
                workSkills={workSkills}
                selectedWorkSkillId={selectedWorkSkillId}
                onWorkSkillChange={onWorkSkillChange}
                idPrefix={idPrefix}
              />
            </FilterSection>

            <FilterSection title="Governorate">
              <GovernorateFilter
                governorates={homeRenovateGovernorates}
                selectedGovernorateIds={selectedGovernorateId ? [selectedGovernorateId] : []}
                onGovernorateChange={onGovernorateChange}
                idPrefix={idPrefix}
              />
            </FilterSection>

            <FilterSection title="City">
              <CityFilter
                cities={cities}
                selectedCityIds={selectedCityId ? [selectedCityId] : []}
                onCityChange={onCityChange}
                idPrefix={idPrefix}
                isLoading={isCitiesLoading}
              />
            </FilterSection>
          </>
        )

      case "custom_package":
        return (
          <>
            <FilterSection title="Unit Type">
              <UnitTypeFilter
                unitTypes={homeRenovateUnitTypes}
                selectedUnitTypeIds={selectedUnitTypeId ? [selectedUnitTypeId] : []}
                onUnitTypeChange={onUnitTypeChange}
                idPrefix={idPrefix}
              />
            </FilterSection>

            <FilterSection title="Custom Package">
              <CustomPackageFilter
                customPackages={customPackages}
                selectedCustomPackageId={selectedCustomPackageId}
                onCustomPackageChange={onCustomPackageChange}
                idPrefix={idPrefix}
              />
            </FilterSection>

            <FilterSection title="Compound Location">
              <CompoundFilter
                selectedCompoundValue={selectedCompoundValue}
                onCompoundChange={onCompoundChange}
                idPrefix={idPrefix}
              />
            </FilterSection>

         
          </>
        )

      default:
        return (
          <div className="text-sm text-gray-500 text-center py-4">
            No specific filters available for this business type
          </div>
        )
    }
  }

  // Extract businessTypeCode for use in JSX
  const businessTypeCode = selectedBusinessType?.code?.toLowerCase() ?? "";

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

          <div className="space-y-2">
            {/* Price Range - Always available */}
            {businessTypeCode !== 'custom_package' ? (
              <FilterSection title="Price Range">
                <PriceFilter
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  onMinPriceChange={onMinPriceChange}
                  onMaxPriceChange={onMaxPriceChange}
                />
              </FilterSection>
            ) : null}

            {/* Dynamic filters based on business type */}
            {renderFiltersForBusinessType()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
