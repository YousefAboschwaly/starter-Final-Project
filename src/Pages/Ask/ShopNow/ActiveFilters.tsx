import { X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { IColor } from "@/interfaces"

interface ActiveFiltersProps {
  searchName: string
  selectedColorIds: number[]
  colors: IColor[]
  onClearSearch: () => void
  onClearColor: (colorId: number) => void
}

export const ActiveFilters = ({
  searchName,
  selectedColorIds,
  colors,
  onClearSearch,
  onClearColor
}: ActiveFiltersProps) => {
  const hasActiveFilters = searchName || selectedColorIds.length > 0

  if (!hasActiveFilters) return null

  return (
    <div className="mb-6 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-500">
      {searchName && (
        <Badge variant="secondary" className="px-3 py-1 bg-purple-50 text-purple-700 border-purple-200">
          Search: {searchName}
          <Button
            variant="ghost"
            size="sm"
            className="ml-2 h-auto p-0 text-purple-500 hover:text-purple-700"
            onClick={onClearSearch}
          >
            <X className="w-3 h-3" />
          </Button>
        </Badge>
      )}
      {selectedColorIds.map((colorId) => {
        const color = colors.find((c) => c.id === colorId)
        return color ? (
          <Badge
            key={colorId}
            variant="secondary"
            className="px-3 py-1 bg-green-50 text-green-700 border-green-200"
          >
            {color.name}
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 h-auto p-0 text-green-500 hover:text-green-700"
              onClick={() => onClearColor(colorId)}
            >
              <X className="w-3 h-3" />
            </Button>
          </Badge>
        ) : null
      })}
    </div>
  )
}
