"use client"

import type React from "react"

import { useState, useContext } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Edit, Trash2, AlertCircle, Armchair, PoundSterling, PackageOpen } from "lucide-react"
import { UserContext } from "@/Contexts/UserContext"
import { useNavigate } from "react-router-dom"
import type { IProduct } from "@/interfaces"
import ProductDetails from "./ProductDetails"

interface ProductCardProps {
  product: IProduct
  onDelete?: (id: number) => void
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
  const navigate = useNavigate()
  const [showDetails, setShowDetails] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const status = !product.inStock ? "Out of Stock" : product.stockAmount <= 10 ? "Low Stock" : undefined

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDelete) {
      onDelete(product.id)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(`/editproduct/${product.id}`)
  }



  const userContext = useContext(UserContext)
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }
  const { pathUrl } = userContext

  // Check if there's a valid image path
  const imageSrc = product.imagePath
    ? pathUrl + product.imagePath.substring(1)
    : "/placeholder.svg?height=300&width=400"

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setShowDetails(true)}
        className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer"
      >
        {/* Product Image with Status Badge */}
        <div className="relative overflow-hidden">
          {/* Status badge - positioned exactly like in the image */}
          {status && (
            <div className="absolute top-3 right-3 z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-2 rounded-[16px] text-[16px] font-medium flex items-center gap-1.5 ${
                  status === "Low Stock"
                    ? "bg-[#FDFBCB] text-amber-800"
                    : "bg-red-50 text-red-800"
                }`}
              >
                <AlertCircle />
                {status}
              </motion.div>
            </div>
          )}

          {/* Product image */}
          <img
            src={imageSrc || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "/placeholder.svg?height=300&width=400";
            }}
          />

          {/* Hover overlay with action buttons */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-black/40 flex items-center justify-center gap-3 z-20"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.div
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.1, type: "spring" }}
                >
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "#FFF" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleEdit}
                    className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg"
                  >
                    <Edit className="w-5 h-5 text-blue-600" />
                  </motion.button>
                </motion.div>

                <motion.div
                  initial={{ scale: 0, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "#FFF" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleDelete}
                    className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </motion.button>
                </motion.div>


              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Title and Action Buttons */}
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              {product.name}
            </h3>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleEdit}
                className="text-gray-400 hover:text-blue-600"
              >
                <Edit className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Category */}
          <div className="flex items-center gap-1.5 mb-3 text-gray-600 text-base">
            <Armchair className="w-5 h-5  text-gray-500 text-base" />
            <span>{product.type}</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-1.5 mb-3">
            <PoundSterling className="w-5 h-5  text-gray-500 text-base"/>
            <span className="text-xl font-bold text-blue-600">
              ${product.price.toLocaleString()}
            </span>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-1.5 mb-3 text-gray-600 text-base">
          <PackageOpen className="w-5 h-5  text-gray-500 text-base"/>
            <span>Stock: {product.stockAmount}</span>
          </div>

          {/* Dimensions */}
          <div className="mb-4 text-gray-600 text-base">
            Dimensions: {product.length}*{product.width}*{product.height}cm
          </div>

          {/* Colors and Rating */}
          <div className="flex items-center justify-between">
            {/* Color circles instead of text */}
            <div className="flex flex-wrap items-center gap-2 max-w-[70%]">
              {product.colors.slice(0, 6).map((color, index) => (
                <motion.div
                  key={color.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative"
                >
                  <div
                    className="w-7 h-7 rounded-full border-2 border-white shadow-md cursor-pointer"
                    style={{ backgroundColor: color.hexColor }}
                    title={color.name}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity z-10">
                    {color.name}
                  </div>
                </motion.div>
              ))}
              {product.colors.length > 6 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-bold border-2 border-white shadow-md"
                >
                  +{product.colors.length - 6}
                </motion.div>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <span className="text-base font-medium">
                {product.rate.toFixed(1)}
              </span>
              <svg
                className="w-5 h-5 text-yellow-400 fill-yellow-400"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Product details modal */}
      {showDetails && (
        <ProductDetails
          productId={product.id}
          onClose={() => setShowDetails(false)}
          onDelete={onDelete}
        />
      )}
    </>
  );
}

export default ProductCard

