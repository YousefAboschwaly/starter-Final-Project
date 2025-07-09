import { Checkbox } from "@/components/ui/checkbox"
import type { UnitStatus } from "@/hooks/useHomeRenovateFilterData"

interface UnitStatusFilterProps {
  unitStatuses: UnitStatus[]
  selectedUnitStatusId: number | null
  onUnitStatusChange: (unitStatusId: number, checked: boolean) => void
  idPrefix: string
}

export function UnitStatusFilter({
  unitStatuses,
  selectedUnitStatusId,
  onUnitStatusChange,
  idPrefix,
}: UnitStatusFilterProps) {
  return (
    <div className="space-y-2">
      {unitStatuses.map((unitStatus) => (
        <div key={unitStatus.id} className="flex items-center space-x-2">
          <Checkbox
            id={`${idPrefix}-unit-status-${unitStatus.id}`}
            checked={selectedUnitStatusId === unitStatus.id}
            onCheckedChange={(checked) => onUnitStatusChange(unitStatus.id, checked as boolean)}
          />
          <label
            htmlFor={`${idPrefix}-unit-status-${unitStatus.id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {unitStatus.name}
          </label>
        </div>
      ))}
    </div>
  )
}
