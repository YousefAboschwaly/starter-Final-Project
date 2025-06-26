

interface LoadingSpinnerProps {
  message: string
  isOverlay?: boolean
}

export const LoadingSpinner = ({ message, isOverlay = false }: LoadingSpinnerProps) => {
  const containerClass = isOverlay 
    ? "absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center animate-in fade-in duration-300"
    : "flex items-center justify-center min-h-screen"

  return (
    <div className={containerClass}>
      <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-xl shadow-lg border animate-in zoom-in-50 duration-300">
        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-medium text-gray-700">{message}</span>
      </div>
    </div>
  )
}
