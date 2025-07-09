"use client"
import { Input } from "@/components/ui/input"

interface UnitAreaFilterProps {
  minUnitArea: string
  maxUnitArea: string
  onMinUnitAreaChange: (value: string) => void
  onMaxUnitAreaChange: (value: string) => void
}

export function UnitAreaFilter({
  minUnitArea,
  maxUnitArea,
  onMinUnitAreaChange,
  onMaxUnitAreaChange,
}: UnitAreaFilterProps) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min="0"
          placeholder="Min m²"
          value={minUnitArea}
          onChange={(e) => onMinUnitAreaChange(e.target.value)}
          className="flex-1 text-center border-gray-300 focus:border-blue-500 transition-colors duration-200"
        />
        <span className="text-sm font-medium text-gray-500 px-2">TO</span>
        <Input
          type="number"
          min="0"
          placeholder="Max m²"
          value={maxUnitArea}
          onChange={(e) => onMaxUnitAreaChange(e.target.value)}
          className="flex-1 text-center border-gray-300 focus:border-blue-500 transition-colors duration-200"
        />
      </div>
      {(minUnitArea !== "" || maxUnitArea !== "") && (
        <div className="mt-2 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
          Applied: {minUnitArea || "Min"} - {maxUnitArea || "Max"} m²
        </div>
      )}
    </div>
  )
}
