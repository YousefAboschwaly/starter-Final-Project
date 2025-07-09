import { Checkbox } from "@/components/ui/checkbox"
import type { UrgencyLevel } from "@/hooks/useFilterData"

interface UrgencyLevelFilterProps {
  urgencyLevels: UrgencyLevel[]
  selectedUrgencyLevelIds: number[]
  onUrgencyLevelChange: (urgencyLevelId: number, checked: boolean) => void
  idPrefix: string
}

export function UrgencyLevelFilter({
  urgencyLevels,
  selectedUrgencyLevelIds,
  onUrgencyLevelChange,
  idPrefix,
}: UrgencyLevelFilterProps) {
  return (
    <div className="space-y-2">
      {urgencyLevels.map((urgencyLevel) => (
        <div key={urgencyLevel.id} className="flex items-center space-x-2">
          <Checkbox
            id={`${idPrefix}-urgency-level-${urgencyLevel.id}`}
            checked={selectedUrgencyLevelIds.includes(urgencyLevel.id)}
            onCheckedChange={(checked) => onUrgencyLevelChange(urgencyLevel.id, checked as boolean)}
          />
          <label
            htmlFor={`${idPrefix}-urgency-level-${urgencyLevel.id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {urgencyLevel.name}
          </label>
        </div>
      ))}
    </div>
  )
}
