"use client"

import { motion } from "framer-motion"
import ProductContainer from "./ProductContainer"
import type { ApiProduct } from "../LandingPage"

interface RecommendedProps {
  products: ApiProduct[]
}

export default function Recommended({ products }: RecommendedProps) {
  return (
    <main className=" mx-auto py-8 w-full ">
      <div className="mb-8">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-black">RECOMMENDED</span> <span className="text-red-600">FOR YOU</span>
        </motion.h1>
      </div>

      <ProductContainer products={products} />
    </main>
  )
}
