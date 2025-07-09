import type { ReactNode } from "react"
import { ChevronDown } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface FilterSectionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export function FilterSection({ title, children, defaultOpen = false }: FilterSectionProps) {
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200 group">
        <span className="font-medium text-gray-700 group-hover:text-gray-900">{title}</span>
        <ChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-3 pb-3">
        <div className="pt-2">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  )
}
