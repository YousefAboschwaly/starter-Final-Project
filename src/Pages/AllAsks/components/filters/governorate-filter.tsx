import { Checkbox } from "@/components/ui/checkbox"
import type { Governorate } from "@/hooks/useFilterData"

interface GovernorateFilterProps {
  governorates: Governorate[]
  selectedGovernorateIds: number[]
  onGovernorateChange: (governorateId: number, checked: boolean) => void
  idPrefix: string
}

export function GovernorateFilter({
  governorates,
  selectedGovernorateIds,
  onGovernorateChange,
  idPrefix,
}: GovernorateFilterProps) {
  return (
    <div className="space-y-2">
      {governorates.map((governorate) => (
        <div key={governorate.id} className="flex items-center space-x-2">
          <Checkbox
            id={`${idPrefix}-governorate-${governorate.id}`}
            checked={selectedGovernorateIds.includes(governorate.id)}
            onCheckedChange={(checked) => onGovernorateChange(governorate.id, checked as boolean)}
          />
          <label
            htmlFor={`${idPrefix}-governorate-${governorate.id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {governorate.name}
          </label>
        </div>
      ))}
    </div>
  )
}
