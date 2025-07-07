"use client"

import TechnicalWorkersContainer from "./TechnicalWorkersContainer"
import type { TechnicalWorker } from "./TechnicalWorkerCard"
import { motion } from 'framer-motion';

interface TopTechnicalWorkersSectionProps {
  workers: TechnicalWorker[]
}

export default function TopTechnicalWorkersSection({ workers }: TopTechnicalWorkersSectionProps) {
  // Don't render the section if there are no workers
  if (!workers || workers.length === 0) {
    return null
  }

  return (
    <div className="mx-auto py-8 w-full">
      <div className="mb-8">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-black">TOP</span> <span className="text-red-600">WORKERS</span>
        </motion.h1>
      </div>


      <TechnicalWorkersContainer workers={workers} />
    </div>
  )
}
