import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface Material {
  id: number
  code: string
  name: string
}

interface MaterialFilterProps {
  materials: Material[]
  selectedMaterialIds: number[]
  onMaterialChange: (materialId: number, checked: boolean) => void
  idPrefix: string
}

export const MaterialFilter = ({ materials, selectedMaterialIds, onMaterialChange, idPrefix }: MaterialFilterProps) => {
  return (
    <div className="space-y-2">
      {materials.map((material) => (
        <div key={material.id}>
          <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              id={`${idPrefix}-material-${material.id}`}
              checked={selectedMaterialIds.includes(material.id)}
              onCheckedChange={(checked) => {
                onMaterialChange(material.id, checked as boolean)
              }}
            />
            <Label htmlFor={`${idPrefix}-material-${material.id}`} className="text-sm cursor-pointer">
              {material.name}
            </Label>
          </div>
        </div>
      ))}
    </div>
  )
}
