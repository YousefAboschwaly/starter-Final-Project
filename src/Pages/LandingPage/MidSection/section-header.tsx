"use client"

import { motion } from "framer-motion"

interface SectionHeaderProps {
  text: string
}

export default function SectionHeader({ text }: SectionHeaderProps) {
  return (
    <motion.div
      className="mb-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative">
        <div className="text-2xl font-bold text-gray-700 ">{text}</div>

      </div>
    </motion.div>
  )
}
