import { Checkbox } from "@/components/ui/checkbox"

interface CompoundFilterProps {
  selectedCompoundValue: boolean | null
  onCompoundChange: (value: boolean | null) => void
  idPrefix: string
}

export function CompoundFilter({ selectedCompoundValue, onCompoundChange, idPrefix }: CompoundFilterProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${idPrefix}-compound-true`}
          checked={selectedCompoundValue === true}
          onCheckedChange={(checked) => onCompoundChange(checked ? true : null)}
        />
        <label
          htmlFor={`${idPrefix}-compound-true`}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Inside Compound
        </label>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${idPrefix}-compound-false`}
          checked={selectedCompoundValue === false}
          onCheckedChange={(checked) => onCompoundChange(checked ? false : null)}
        />
        <label
          htmlFor={`${idPrefix}-compound-false`}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          Outside Compound
        </label>
      </div>
    </div>
  )
}
