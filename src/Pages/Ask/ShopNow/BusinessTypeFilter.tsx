"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

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

interface BusinessTypeFilterProps {
  businessTypes: BusinessType[]
  selectedBusinessTypeIds: number[]
  onBusinessTypeChange: (businessTypeId: number, checked: boolean) => void
  idPrefix: string
  appliedFilters: AppliedFilters
}

export const BusinessTypeFilter = ({
  businessTypes,
  selectedBusinessTypeIds,
  onBusinessTypeChange,
  idPrefix,
  appliedFilters,
}: BusinessTypeFilterProps) => {
  return (
    <div className="space-y-2">
      {businessTypes.map((businessType) => {
        const isFromAppliedFilters = appliedFilters.businessType?.id === businessType.id
        const isUserSelected = selectedBusinessTypeIds.includes(businessType.id)
        const isChecked = isFromAppliedFilters || isUserSelected

        return (
          <div key={businessType.id}>
            <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
              <Checkbox
                id={`${idPrefix}-business-type-${businessType.id}`}
                checked={isChecked}
                onCheckedChange={(checked) => {
                  onBusinessTypeChange(businessType.id, checked as boolean)
                }}
              />
              <Label
                htmlFor={`${idPrefix}-business-type-${businessType.id}`}
                className={`text-sm cursor-pointer ${isFromAppliedFilters ? "text-blue-600 font-medium" : ""}`}
              >
                {businessType.name}
              </Label>
            </div>
          </div>
        )
      })}
    </div>
  )
}
