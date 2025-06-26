
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  onClearFilters: () => void
}

export const EmptyState = ({ onClearFilters }: EmptyStateProps) => {
  return (
    <div className="flex items-center justify-center min-h-[500px]">
      <div className="text-center py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-8xl mb-6 animate-bounce">🔍</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
        <p className="text-muted-foreground mb-6">Try adjusting your filters to see more results</p>
        <Button
          onClick={onClearFilters}
          className="hover:scale-105 transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
        >
          Clear All Filters
        </Button>
      </div>
    </div>
  )
}
