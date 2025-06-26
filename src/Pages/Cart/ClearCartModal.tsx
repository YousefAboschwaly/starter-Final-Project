"use client"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X } from "lucide-react"
import { Toaster } from "react-hot-toast"

interface ClearCartModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  itemCount: number
}

export function ClearCartModal({ isOpen, onClose, onConfirm, itemCount }: ClearCartModalProps) {
  const handleConfirm = () => {
    onConfirm() // This will now trigger the toast from CartContext
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon */}
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Clear Cart</h3>

              {/* Message */}
              <p className="text-gray-600 text-center mb-6">
                Are you sure you want to remove all {itemCount} item{itemCount !== 1 ? "s" : ""} from your cart? This
                action cannot be undone.
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  Cancel
                </Button>
                <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white" onClick={handleConfirm}>
                  Clear Cart
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}

            <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#333",
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "12px 16px",
          },
          success: {
            style: {
              background: "#D1FAE5",
              border: "1px solid #10B981",
              color: "#065F46",
            },
            iconTheme: {
              primary: "#10B981",
              secondary: "#D1FAE5",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </AnimatePresence>
  )
}
