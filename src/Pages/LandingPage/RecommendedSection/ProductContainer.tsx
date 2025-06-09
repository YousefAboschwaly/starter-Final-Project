"use client"

import { useState, useEffect } from "react"
import ProductCard from "./product-card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

export default function ProductContainer() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  const products = [
    {
      id: 1,
      title: "JOYROOM 10000 mAh 22.5W LED Display Battery Status Monitoring Power Bank 3-Output",
      images: ["/ProductImages/prod4.png", "/ProductImages/prod5.png", "/ProductImages/prod6.png"],
      rating: 4.4,
      reviews: "1.9K",
      price: 535,
      originalPrice: 699,
      discount: "23%",
      rank: "#1 in Power Banks",
      express: true,
    },
    {
      id: 2,
      title: "Xiaomi Redmi 13C Dual SIM Midnight Black 6GB RAM 128GB 4G",
      images: ["/ProductImages/prod7.png", "/ProductImages/prod8.png", "/ProductImages/prod9.png"],
      rating: 4.9,
      reviews: "",
      price: 5822,
      originalPrice: 8888,
      discount: "34%",
      rank: "#2 in Smartphones",
      express: true,
    },
    {
      id: 3,
      title: "Lipton Black Tea 500g",
      images: ["/ProductImages/prod10.png", "/ProductImages/prod11.png", "/ProductImages/prod12.png"],
      rating: 4.5,
      reviews: "1.9K",
      price: 89.95,
      originalPrice: 120,
      discount: "25%",
      rank: "#1 in Leaf & Dust Tea",
      express: true,
    },
    {
      id: 4,
      title: "Xiaomi Redmi 13C Dual SIM Navy Blue 6GB RAM 128GB 4G",
      images: ["/ProductImages/prod13.png", "/ProductImages/prod10.png", "/ProductImages/prod14.png"],
      rating: 4.4,
      reviews: "312",
      price: 5822,
      originalPrice: 8888,
      discount: "34%",
      rank: "#1 in Smartphones",
      sellingFast: true,
      express: true,
    },
    {
      id: 5,
      title: "Oraimo Watch 5 Bluetooth Call Smart Watch 2.01inch HD Display Fitness Watch, 300 mAh, Scratch Resistant",
      images: ["/ProductImages/prod15.png"," /ProductImages/prod6.png", "/ProductImages/prod7.png"],
      rating: 4.2,
      reviews: "1.8K",
      price: 979,
      originalPrice: 1399,
      discount: "30%",
      rank: "#1 in Smartwatches",
      express: true,
    },
    {
      id: 6,
      title: "Anker Anker 333 Ultra-Durable Cable USB-C to USB-C Cable ( 3.3 ft Braided ) 100W USB C PD Fast Charging",
      images: ["/ProductImages/prod6.png", "/ProductImages/prod7.png", "/ProductImages/prod15.png"],
      rating: 4.7,
      reviews: "1.5K",
      price: 146,
      originalPrice: null,
      discount: null,
      rank: "#1 in Cables",
      recentlySold: "2200+ sold recently",
      express: true,
    },
  ]

  const visibleProducts = isMobile ? 1 : 5
  const maxIndex = products.length - visibleProducts

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex <= 0 ? maxIndex : prevIndex - 1))
  }

  return (


      <div className="relative">
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={prevSlide}
            className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md transition-colors"
            aria-label="Previous products"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        </motion.div>

        <div className="overflow-hidden">
          <motion.div
            className="flex transition-all duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / visibleProducts)}%)`,
              width: `${(products.length / visibleProducts) * 100}%`,
            }}
          >
            {products.map((product) => (
              <div key={product.id} className="px-2" style={{ width: `${(100 / products.length) * visibleProducts}%` }}>
                <ProductCard product={product} />
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={nextSlide}
            className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md transition-colors"
            aria-label="Next products"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </motion.div>
      </div>
  )
}
