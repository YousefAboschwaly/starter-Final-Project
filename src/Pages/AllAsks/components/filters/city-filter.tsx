import { Checkbox } from "@/components/ui/checkbox"
import type { City } from "@/hooks/useFilterData"

interface CityFilterProps {
  cities: City[]
  selectedCityIds: number[]
  onCityChange: (cityId: number, checked: boolean) => void
  idPrefix: string
  isLoading?: boolean
}

export function CityFilter({ cities, selectedCityIds, onCityChange, idPrefix, isLoading }: CityFilterProps) {
  if (isLoading) {
    return <div className="text-sm text-gray-500">Loading cities...</div>
  }

  if (cities.length === 0) {
    return <div className="text-sm text-gray-500">Select a governorate first</div>
  }

  return (
    <div className="space-y-2">
      {cities.map((city) => (
        <div key={city.id} className="flex items-center space-x-2">
          <Checkbox
            id={`${idPrefix}-city-${city.id}`}
            checked={selectedCityIds.includes(city.id)}
            onCheckedChange={(checked) => onCityChange(city.id, checked as boolean)}
          />
          <label
            htmlFor={`${idPrefix}-city-${city.id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {city.name}
          </label>
        </div>
      ))}
    </div>
  )
}
