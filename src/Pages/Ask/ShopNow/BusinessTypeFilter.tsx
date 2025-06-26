
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface BusinessType {
  id: number
  code: string
  name: string
}

interface BusinessTypeFilterProps {
  businessTypes: BusinessType[]
  selectedBusinessTypeIds: number[]
  onBusinessTypeChange: (businessTypeId: number, checked: boolean) => void
  idPrefix: string
}

export const BusinessTypeFilter = ({ 
  businessTypes, 
  selectedBusinessTypeIds, 
  onBusinessTypeChange, 
  idPrefix 
}: BusinessTypeFilterProps) => {
  return (
    <div className="space-y-2">
      {businessTypes.map((businessType) => (
        <div key={businessType.id}>
          <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              id={`${idPrefix}-business-type-${businessType.id}`}
              checked={selectedBusinessTypeIds.includes(businessType.id)}
              onCheckedChange={(checked) => {
                onBusinessTypeChange(businessType.id, checked as boolean)
              }}
            />
            <Label
              htmlFor={`${idPrefix}-business-type-${businessType.id}`}
              className="text-sm cursor-pointer"
            >
              {businessType.name}
            </Label>
          </div>
        </div>
      ))}
    </div>
  )
}
