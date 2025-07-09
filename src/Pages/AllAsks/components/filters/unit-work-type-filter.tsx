import { Checkbox } from "@/components/ui/checkbox"
import type { UnitWorkType } from "@/hooks/useHomeRenovateFilterData"

interface UnitWorkTypeFilterProps {
  unitWorkTypes: UnitWorkType[]
  selectedUnitWorkTypeId: number | null
  onUnitWorkTypeChange: (unitWorkTypeId: number, checked: boolean) => void
  idPrefix: string
}

export function UnitWorkTypeFilter({
  unitWorkTypes,
  selectedUnitWorkTypeId,
  onUnitWorkTypeChange,
  idPrefix,
}: UnitWorkTypeFilterProps) {
  return (
    <div className="space-y-2">
      {unitWorkTypes.map((unitWorkType) => (
        <div key={unitWorkType.id} className="flex items-center space-x-2">
          <Checkbox
            id={`${idPrefix}-unit-work-type-${unitWorkType.id}`}
            checked={selectedUnitWorkTypeId === unitWorkType.id}
            onCheckedChange={(checked) => onUnitWorkTypeChange(unitWorkType.id, checked as boolean)}
          />
          <label
            htmlFor={`${idPrefix}-unit-work-type-${unitWorkType.id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {unitWorkType.name}
          </label>
        </div>
      ))}
    </div>
  )
}
