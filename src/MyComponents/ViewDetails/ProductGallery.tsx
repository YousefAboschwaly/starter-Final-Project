"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { useCart } from "@/Contexts/CartContext"

type ProductGalleryProps = {
  images: string[]
  id: number
  price:number
  name?: string
}

export default function ProductGallery({ images ,id,price,name}: ProductGalleryProps) {
    const { addToCart } = useCart();

  const [mainImg, setMainImg] = useState(images[0])
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 100
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Fallback image if the API image fails to load
    e.currentTarget.src = "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c"
  }

  return (
    <div className="w-full space-y-4">
      {/* Main Image */}
      <div className="relative">
        <img
          src={mainImg || "/placeholder.svg"}
          alt="Main product"
          className="w-full h-[430px] object-cover rounded-xl border"
          onError={handleImageError}
        />
        <button className="absolute top-2 right-2 bg-white p-2 rounded shadow hover:bg-gray-100">
          <Heart className="w-5 h-5 text-red-500" />
        </button>
      </div>

      {/* Thumbnails with Arrows */}
      <div className="relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-1 rounded-full shadow z-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-6"
        >
          {images.map((img, index) => (
            <img
              key={index}
              src={img || "/placeholder.svg"}
              alt={`Thumbnail ${index + 1}`}
              className={`h-[120px] w-[90px] object-cover rounded-md border cursor-pointer ${
                mainImg === img
                  ? "ring-2 ring-blue-500"
                  : "ring-1 ring-transparent"
              } transition-all duration-200 ease-in-out`}
              onClick={() => setMainImg(img)}
              onError={handleImageError}
            />
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-1 rounded-full shadow z-10"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Add to Cart */}
      <Button
        className="w-full bg-blue-900 text-white hover:bg-blue-800 rounded-xl primary-grad"
        onClick={() => addToCart(Number(id), Number(price) , name)}
      >
        Add to Cart
      </Button>
    </div>
  );
}
