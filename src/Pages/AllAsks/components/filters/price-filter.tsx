"use client"
import { Input } from "@/components/ui/input"

interface PriceFilterProps {
  minPrice: string
  maxPrice: string
  onMinPriceChange: (value: string) => void
  onMaxPriceChange: (value: string) => void
}

export function PriceFilter({ minPrice, maxPrice, onMinPriceChange, onMaxPriceChange }: PriceFilterProps) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Input
          type="number"
          min="0"
          placeholder="Min"
          value={minPrice}
          onChange={(e) => onMinPriceChange(e.target.value)}
          className="flex-1 text-center border-gray-300 focus:border-blue-500 transition-colors duration-200"
        />
        <span className="text-sm font-medium text-gray-500 px-2">TO</span>
        <Input
          type="number"
          min="0"
          placeholder="Max"
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(e.target.value)}
          className="flex-1 text-center border-gray-300 focus:border-blue-500 transition-colors duration-200"
        />
      </div>
      {(minPrice !== "" || maxPrice !== "") && (
        <div className="mt-2 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
          Applied: {minPrice || "Min"} - {maxPrice || "Max"}
        </div>
      )}
    </div>
  )
}
