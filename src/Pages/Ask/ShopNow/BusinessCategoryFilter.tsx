
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

interface BusinessCategoryFilterProps {
  businessCategories: BusinessTypeCategory[]
  selectedBusinessCategoryIds: number[]
  onBusinessCategoryChange: (businessCategoryId: number, checked: boolean) => void
  idPrefix: string
}

export const BusinessCategoryFilter = ({ 
  businessCategories, 
  selectedBusinessCategoryIds, 
  onBusinessCategoryChange, 
  idPrefix 
}: BusinessCategoryFilterProps) => {
  return (
    <div className="space-y-2">
      {businessCategories.map((businessCategory) => (
        <div key={businessCategory.id}>
          <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              id={`${idPrefix}-business-category-${businessCategory.id}`}
              checked={selectedBusinessCategoryIds.includes(businessCategory.id)}
              onCheckedChange={(checked) => {
                onBusinessCategoryChange(businessCategory.id, checked as boolean)
              }}
            />
            <Label
              htmlFor={`${idPrefix}-business-category-${businessCategory.id}`}
              className="text-sm cursor-pointer"
            >
              {businessCategory.name}
            </Label>
          </div>
        </div>
      ))}
    </div>
  )
}
