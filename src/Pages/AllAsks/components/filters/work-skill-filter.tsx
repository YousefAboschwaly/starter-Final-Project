import { Checkbox } from "@/components/ui/checkbox"
import type { WorkSkill } from "@/hooks/useHomeRenovateFilterData"

interface WorkSkillFilterProps {
  workSkills: WorkSkill[]
  selectedWorkSkillId: number | null
  onWorkSkillChange: (workSkillId: number, checked: boolean) => void
  idPrefix: string
}

export function WorkSkillFilter({
  workSkills,
  selectedWorkSkillId,
  onWorkSkillChange,
  idPrefix,
}: WorkSkillFilterProps) {
  return (
    <div className="space-y-2">
      {workSkills.map((workSkill) => (
        <div key={workSkill.id} className="flex items-center space-x-2">
          <Checkbox
            id={`${idPrefix}-work-skill-${workSkill.id}`}
            checked={selectedWorkSkillId === workSkill.id}
            onCheckedChange={(checked) => onWorkSkillChange(workSkill.id, checked as boolean)}
          />
          <label
            htmlFor={`${idPrefix}-work-skill-${workSkill.id}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {workSkill.name}
          </label>
        </div>
      ))}
    </div>
  )
}
