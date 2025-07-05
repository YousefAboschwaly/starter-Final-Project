

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Brand data structure
interface Brand {
  id: number
  name: string
  imageUrl: string
}

// Furniture brand data with placeholder images that will work
const brands: Brand[] = [
  { id: 1, name: "IKEA", imageUrl: "/ProductImages/prod4.png" },
  { id: 2, name: "Ashley Furniture", imageUrl: "/ProductImages/prod5.png" },
  { id: 3, name: "La-Z-Boy", imageUrl: "/ProductImages/prod6.png" },
  { id: 4, name: "Pottery Barn", imageUrl: "/ProductImages/prod7.png" },
  { id: 5, name: "Crate & Barrel", imageUrl: "/ProductImages/prod8.png" },
  { id: 6, name: "West Elm", imageUrl: "/ProductImages/prod9.png" },
  { id: 7, name: "Restoration Hardware", imageUrl: "/ProductImages/prod10.png" },
  { id: 8, name: "Herman Miller", imageUrl: "/ProductImages/prod11.png" },
  { id: 9, name: "Ethan Allen", imageUrl: "/ProductImages/prod12.png" },
  { id: 10, name: "Steelcase", imageUrl: "/ProductImages/prod13.png" },
  { id: 11, name: "Knoll", imageUrl: "/ProductImages/prod14.png" },
  { id: 12, name: "Room & Board", imageUrl: "/ProductImages/prod15.png" },
  { id: 13, name: "IKEA", imageUrl: "/ProductImages/prod4.png" },
  { id: 14, name: "Ashley Furniture", imageUrl: "/ProductImages/prod5.png" },
  { id: 15, name: "La-Z-Boy", imageUrl: "/ProductImages/prod6.png" },
  { id: 16, name: "Pottery Barn", imageUrl: "/ProductImages/prod7.png" },
  { id: 17, name: "Crate & Barrel", imageUrl: "/ProductImages/prod8.png" },
  { id: 18, name: "West Elm", imageUrl: "/ProductImages/prod9.png" },
  { id: 19, name: "Restoration Hardware", imageUrl: "/ProductImages/prod10.png" },
  { id: 20, name: "Herman Miller", imageUrl: "/ProductImages/prod11.png" },
  { id: 21, name: "Ethan Allen", imageUrl: "/ProductImages/prod12.png" },
  { id: 22, name: "Steelcase", imageUrl: "/ProductImages/prod13.png" },
  { id: 23, name: "Knoll", imageUrl: "/ProductImages/prod14.png" },
  { id: 24, name: "Room & Board", imageUrl: "/ProductImages/prod15.png" },
]

export default function BrandSection() {
  const [currentPage, setCurrentPage] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Update items per page based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(4)
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(8)
      } else {
        setItemsPerPage(12)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const totalPages = Math.ceil(brands.length / itemsPerPage)

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const visibleBrands = brands.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <div className="w-full mx-auto  py-12 overflow-hidden">
      <div className="mb-8">
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-black">EXPLORE</span>{" "}
          <span className="text-red-600">OFFICIAL BRANDS STORES</span>
        </motion.h1>
      </div>

      <div className="relative">
        {/* Navigation buttons */}
                  {/* {currentPage > 0 && (
          <button
            onClick={prevPage}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-all -ml-4"
            aria-label="Previous categories"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        )} */}
        <button
          onClick={prevPage}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-all"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>



        <div className="overflow-hidden  " ref={carouselRef}>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4  p-2 "
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={currentPage} // Re-render animation when page changes
          >
            {visibleBrands.map((brand) => (
              <motion.div
                key={brand.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                className="flex justify-center"
              >
                <div className="  flex items-center w-[340px] h-[140px] justify-center rounded-lg overflow-hidden shadow-md cursor-pointer">
                  <img
                    src={brand.imageUrl || "/placeholder.svg"}
                    alt={`${brand.name} logo`}
                    className="object-cover w-full h-full"
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <button
          onClick={nextPage}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-all"
          aria-label="Next page"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center mt-8 space-x-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentPage === index ? "w-6 bg-purple-500" : "w-2 bg-gray-300"
            }`}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
