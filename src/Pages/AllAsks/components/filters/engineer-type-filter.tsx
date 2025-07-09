import { Checkbox } from "@/components/ui/checkbox"
import type { EngineerType } from "@/hooks/useFilterData"

interface EngineerTypeFilterProps {
  engineerTypes: EngineerType[]
  selectedEngineerTypeIds: number[]
  onEngineerTypeChange: (engineerTypeId: number, checked: boolean) => void
  idPrefix: string
}

export function EngineerTypeFilter({
  engineerTypes,
  selectedEngineerTypeIds,
  onEngineerTypeChange,
  idPrefix,
}: EngineerTypeFilterProps) {
  return (
    <div className="space-y-2">
      {engineerTypes.map((engineerType) => (
        <div key={engineerType.id} className="flex items-center space-x-2">
          <Checkbox
            id={`${idPrefix}-engineer-type-${engineerType.id}`}
            checked={selectedEngineerTypeIds.includes(engineerType.id)}
            onCheckedChange={(checked) => onEngineerTypeChange(engineerType.id, checked as boolean)}
          />
          <label
            htmlFor={`${idPrefix}-engineer-type-${engineerType.id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {engineerType.name}
          </label>
        </div>
      ))}
    </div>
  )
}
