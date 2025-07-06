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

interface BusinessCategoryFilterProps {
  businessCategories: BusinessTypeCategory[]
  selectedBusinessCategoryIds: number[]
  onBusinessCategoryChange: (businessCategoryId: number, checked: boolean) => void
  idPrefix: string
  appliedFilters: AppliedFilters
}

export const BusinessCategoryFilter = ({
  businessCategories,
  selectedBusinessCategoryIds,
  onBusinessCategoryChange,
  idPrefix,
  appliedFilters,
}: BusinessCategoryFilterProps) => {
  return (
    <div className="space-y-2">
      {businessCategories.map((businessCategory) => {
        const isFromAppliedFilters = appliedFilters.businessCategory?.id === businessCategory.id
        const isUserSelected = selectedBusinessCategoryIds.includes(businessCategory.id)
        const isChecked = isFromAppliedFilters || isUserSelected

        return (
          <div key={businessCategory.id}>
            <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
              <Checkbox
                id={`${idPrefix}-business-category-${businessCategory.id}`}
                checked={isChecked}
                onCheckedChange={(checked) => {
                  onBusinessCategoryChange(businessCategory.id, checked as boolean)
                }}
              />
              <Label
                htmlFor={`${idPrefix}-business-category-${businessCategory.id}`}
                className={`text-sm cursor-pointer ${isFromAppliedFilters ? "text-blue-600 font-medium" : ""}`}
              >
                {businessCategory.name}
              </Label>
            </div>
          </div>
        )
      })}
    </div>
  )
}
