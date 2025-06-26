"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

type ProductFeaturesProps = {
  images: string[]
}

const ProductFeatures = ({ images }: ProductFeaturesProps) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="bg-white shadow-md p-4 w-full max-w-full mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">Product Features</h1>
      <div
        className={`relative overflow-hidden transition-all duration-500 ${expanded ? "h-auto" : "h-[500px]"} bg-black`}
      >
        <div className="space-y-3 p-2">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img || "/placeholder.svg"}
              alt={`Product feature ${idx + 1}`}
              className={`rounded-md transition-transform transform ${
                idx === 0 ? "object-cover w-5/6 mx-auto " : "object-contain  mx-auto"
              }`}
              onError={(e) => {
                // Fallback image if the API image fails to load
                e.currentTarget.src = "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c"
              }}
            />
          ))}
        </div>

        {!expanded && (
          <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-white to-transparent pointer-events-none" />
        )}
      </div>

      <CardContent className="text-center mt-4">
        <Button  onClick={() => setExpanded(!expanded)}>{expanded ? "Show Less" : "View full Product Features"}</Button>
      </CardContent>
    </Card>
  )
}

export default ProductFeatures
