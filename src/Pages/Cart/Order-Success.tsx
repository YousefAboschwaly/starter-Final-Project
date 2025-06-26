"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function OrderSuccess() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
  
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="max-w-md w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-12">
              Order Completed
            </h2>
          </motion.div>

          {/* Shopping bag icon with checkmark */}
          <motion.div
            className="mb-12 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img
              src="./OrderSuccess.svg"
              alt="Shopping bag with checkmark"
              className="w-36 h-36"
            />
          </motion.div>

          {/* Success message */}
          <motion.div
            className="mb-12 space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <p className="text-gray-600">Thank you for your purchase.</p>
            <p className="text-gray-600">
              You can view your order in 'My Orders' section.
            </p>
          </motion.div>

          {/* Continue shopping button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="w-full"
          >
            <Button
              onClick={() => navigate("/")}
              className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-full text-base font-medium"
            >
              Continue shopping
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
