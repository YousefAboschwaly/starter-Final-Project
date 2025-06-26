import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
  searchName: string
  onSearchChange: (value: string) => void
}

export const SearchBar = ({ searchName, onSearchChange }: SearchBarProps) => {
  return (
    <div className="mb-12 flex justify-center animate-in fade-in slide-in-from-top-2 duration-700">
      <div className="relative w-full max-w-2xl">
        <div className="relative group">
          {/* Animated background gradient */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-500 opacity-40 group-hover:opacity-60 animate-pulse"></div>
          
          {/* Main search container */}
          <div className="relative bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-white/80 overflow-hidden group-hover:shadow-xl transition-all duration-500">
            <div className="flex items-center px-2 py-2">
              <div className="pl-4 pr-3">
                <Search className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-all duration-300 group-hover:scale-110" />
              </div>
              <Input
                type="text"
                placeholder="What are you looking for?"
                value={searchName}
                onChange={(e) => onSearchChange(e.target.value)}
                className="flex-1 border-none bg-transparent text-base placeholder:text-gray-400 focus:ring-0 focus-visible:ring-0 focus:outline-none py-3 pr-4 placeholder:font-normal"
              />
              {searchName && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSearchChange("")}
                  className="mr-2 h-8 w-8 p-0 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
                >
                  <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                </Button>
              )}
            </div>
            
            {/* Search indicator when active */}
            {searchName && (
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    Searching...
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
