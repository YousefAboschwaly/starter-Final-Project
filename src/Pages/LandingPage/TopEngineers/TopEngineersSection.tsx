"use client"

import { Link } from "react-router-dom"
import EngineersContainer from "./EngineersContainer"
import type { Engineer } from "../LandingPage"

interface TopEngineersSectionProps {
  engineers: Engineer[]
}

export default function TopEngineersSection({ engineers }: TopEngineersSectionProps) {
  // Don't render the section if there are no engineers
  if (!engineers || engineers.length === 0) {
    return null
  }

  return (
    <div className="mx-auto py-8 w-full">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">Top Engineers</h2>
        <Link
          to="/Ask?type=engineer"
          className="border border-gray-800 px-6 py-2 text-gray-800 hover:bg-gray-800 hover:text-white transition-colors duration-300"
        >
          VIEW ALL
        </Link>
      </div>

      <EngineersContainer engineers={engineers} />
    </div>
  )
}
