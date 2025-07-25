"use client"

import { motion } from "framer-motion"
import { User } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="p-4 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.h1
          className="text-3xl font-bold text-gray-900 mb-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          Profile
        </motion.h1>
        <motion.p
          className="text-gray-600 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Manage your account information
        </motion.p>

        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Profile Settings</h3>
          <p className="text-gray-500">Update your personal information and preferences</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
