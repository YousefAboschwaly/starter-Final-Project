import { Checkbox } from "@/components/ui/checkbox"
import type { WorkerType } from "@/hooks/useWorkerFilterData"

interface WorkerTypeFilterProps {
  workerTypes: WorkerType[]
  selectedWorkerTypeId: number | null
  onWorkerTypeChange: (workerTypeId: number, checked: boolean) => void
  idPrefix: string
}

export function WorkerTypeFilter({
  workerTypes,
  selectedWorkerTypeId,
  onWorkerTypeChange,
  idPrefix,
}: WorkerTypeFilterProps) {
  return (
    <div className="space-y-2">
      {workerTypes.map((workerType) => (
        <div key={workerType.id} className="flex items-center space-x-2">
          <Checkbox
            id={`${idPrefix}-worker-type-${workerType.id}`}
            checked={selectedWorkerTypeId === workerType.id}
            onCheckedChange={(checked) => onWorkerTypeChange(workerType.id, checked as boolean)}
          />
          <label
            htmlFor={`${idPrefix}-worker-type-${workerType.id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {workerType.name}
          </label>
        </div>
      ))}
    </div>
  )
}
