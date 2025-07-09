import { Checkbox } from "@/components/ui/checkbox"
import type { Material } from "@/hooks/useWorkerFilterData"

interface MaterialFilterProps {
  materials: Material[]
  selectedMaterialId: number | null
  onMaterialChange: (materialId: number, checked: boolean) => void
  idPrefix: string
}

export function MaterialFilter({ materials, selectedMaterialId, onMaterialChange, idPrefix }: MaterialFilterProps) {
  return (
    <div className="space-y-2">
      {materials.map((material) => (
        <div key={material.id} className="flex items-center space-x-2">
          <Checkbox
            id={`${idPrefix}-material-${material.id}`}
            checked={selectedMaterialId === material.id}
            onCheckedChange={(checked) => onMaterialChange(material.id, checked as boolean)}
          />
          <label
            htmlFor={`${idPrefix}-material-${material.id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {material.name}
          </label>
        </div>
      ))}
    </div>
  )
}
