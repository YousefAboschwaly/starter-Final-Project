import { Star, Eye } from "lucide-react"

export function PortfolioGrid() {
  const items = Array(12)
    .fill(null)
    .map((_, i) => ({
      id: i,
      image: "../../public/Rectangle.png",
      views: "9k",
      likes: "9k",
    }))

  return (
    <div className="grid grid-cols-1  gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.id} className="group relative aspect-square overflow-hidden rounded-2xl bg-gray-100 cursor-pointer">
          <img
            src={item.image || "/placeholder.svg"}
            alt={`Portfolio item ${item.id}`}
            
            className="object-cover transition-transform duration-700 w-full h-full  ease-out group-hover:scale-125"
          />
          {/* Stats container - bottom right corner */}
          <div className="absolute bottom-4 right-4 flex items-center space-x-2">
            <div className="flex items-center space-x-1 rounded-lg bg-white/90 px-3 py-1">
              <Star className="h-4 w-4 text-yellow-400" />
              <span className="text-sm font-medium text-gray-900">{item.likes}</span>
            </div>
            <div className="flex items-center space-x-1 rounded-lg bg-white/90 px-3 py-1">
              <Eye className="h-4 w-4 text-gray-900" />
              <span className="text-sm font-medium text-gray-900">{item.views}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

