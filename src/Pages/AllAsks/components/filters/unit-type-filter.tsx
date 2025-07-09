import { Checkbox } from "@/components/ui/checkbox"
import type { UnitType } from "@/hooks/useFilterData"

interface UnitTypeFilterProps {
  unitTypes: UnitType[]
  selectedUnitTypeIds: number[]
  onUnitTypeChange: (unitTypeId: number, checked: boolean) => void
  idPrefix: string
}

export function UnitTypeFilter({ unitTypes, selectedUnitTypeIds, onUnitTypeChange, idPrefix }: UnitTypeFilterProps) {
  return (
    <div className="space-y-2">
      {unitTypes.map((unitType) => (
        <div key={unitType.id} className="flex items-center space-x-2">
          <Checkbox
            id={`${idPrefix}-unit-type-${unitType.id}`}
            checked={selectedUnitTypeIds.includes(unitType.id)}
            onCheckedChange={(checked) => onUnitTypeChange(unitType.id, checked as boolean)}
          />
          <label
            htmlFor={`${idPrefix}-unit-type-${unitType.id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {unitType.name}
          </label>
        </div>
      ))}
    </div>
  )
}
