
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface Color {
  id: number
  code: string
  name: string
  hexColor: string
}

interface ColorFilterProps {
  colors: Color[]
  selectedColorIds: number[]
  onColorChange: (colorId: number, checked: boolean) => void
  idPrefix: string
}

export const ColorFilter = ({ colors, selectedColorIds, onColorChange, idPrefix }: ColorFilterProps) => {
  return (
    <div className="space-y-2">
      {colors.map((color) => (
        <div key={color.id}>
          <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              id={`${idPrefix}-color-${color.id}`}
              checked={selectedColorIds.includes(color.id)}
              onCheckedChange={(checked) => {
                onColorChange(color.id, checked as boolean)
              }}
            />
            <div
              className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
              style={{ backgroundColor: color.hexColor }}
            />
            <Label htmlFor={`${idPrefix}-color-${color.id}`} className="text-sm cursor-pointer">
              {color.name}
            </Label>
          </div>
        </div>
      ))}
    </div>
  )
}
