"use client"
import { Input } from "@/components/ui/input"

interface DurationFilterProps {
  minDuration: string
  maxDuration: string
  onMinDurationChange: (value: string) => void
  onMaxDurationChange: (value: string) => void
}

export function DurationFilter({
  minDuration,
  maxDuration,
  onMinDurationChange,
  onMaxDurationChange,
}: DurationFilterProps) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min="0"
          placeholder="Min days"
          value={minDuration}
          onChange={(e) => onMinDurationChange(e.target.value)}
          className="flex-1 text-center border-gray-300 focus:border-blue-500 transition-colors duration-200"
        />
        <span className="text-sm font-medium text-gray-500 px-2">TO</span>
        <Input
          type="number"
          min="0"
          placeholder="Max days"
          value={maxDuration}
          onChange={(e) => onMaxDurationChange(e.target.value)}
          className="flex-1 text-center border-gray-300 focus:border-blue-500 transition-colors duration-200"
        />
      </div>
      {(minDuration !== "" || maxDuration !== "") && (
        <div className="mt-2 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
          Applied: {minDuration || "Min"} - {maxDuration || "Max"} days
        </div>
      )}
    </div>
  )
}
