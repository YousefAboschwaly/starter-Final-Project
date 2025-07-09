import { Checkbox } from "@/components/ui/checkbox"
import type { CustomPackage } from "@/hooks/useCustomPackageData"

interface CustomPackageFilterProps {
  customPackages: CustomPackage[]
  selectedCustomPackageId: number | null
  onCustomPackageChange: (customPackageId: number, checked: boolean) => void
  idPrefix: string
}

export function CustomPackageFilter({
  customPackages,
  selectedCustomPackageId,
  onCustomPackageChange,
  idPrefix,
}: CustomPackageFilterProps) {
  return (
    <div className="space-y-2">
      {customPackages.map((customPackage) => (
        <div key={customPackage.id} className="flex items-center space-x-2">
          <Checkbox
            id={`${idPrefix}-custom-package-${customPackage.id}`}
            checked={selectedCustomPackageId === customPackage.id}
            onCheckedChange={(checked) => onCustomPackageChange(customPackage.id, checked as boolean)}
          />
          <div className="flex flex-col">
            <label
              htmlFor={`${idPrefix}-custom-package-${customPackage.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {customPackage.name}
            </label>
            <span className="text-xs text-green-600 font-semibold">{customPackage.price.toLocaleString()} EGP</span>
          </div>
        </div>
      ))}
    </div>
  )
}
