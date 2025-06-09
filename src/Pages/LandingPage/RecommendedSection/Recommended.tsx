"use client"

import { motion } from "framer-motion"
import ProductContainer from "./ProductContainer"

export default function Recommended() {


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

    <ProductContainer/>
      
    </main>
  )
}
