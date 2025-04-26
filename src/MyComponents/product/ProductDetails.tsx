"use client"

import type React from "react"
import { useContext, useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  X,
  Edit,
  Star,
  Package,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Ruler,
  Tag,
  Layers,
  Palette,
  Info,
  Copy,
  ArrowUpRight,
  Sparkles,
  Check,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { UserContext } from "@/Contexts/UserContext"
import { useNavigate } from "react-router-dom"
import useProductById from "@/hooks/useProductById"

interface ProductDetailsProps {
  productId: number
  onClose: () => void
  onDelete?: (id: number) => void
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productId, onClose, onDelete }) => {
  const navigate = useNavigate()
  const userContext = useContext(UserContext)
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }
  const { pathUrl } = userContext

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState<number | null>(null)
  const [selectedTab, setSelectedTab] = useState("details")
  const [copied, setCopied] = useState(false)
  const detailsRef = useRef<HTMLDivElement>(null)

  // For the 3D rotation effect
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const cardRef = useRef<HTMLDivElement>(null)

const {product,isLoading,isError} = useProductById(productId)

  // Scroll to top when tab changes
  useEffect(() => {
    if (detailsRef.current) {
      detailsRef.current.scrollTop = 0
    }
  }, [selectedTab])



  // Handle mouse move for 3D effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateXValue = ((y - centerY) / centerY) * 5
    const rotateYValue = ((centerX - x) / centerX) * 5

    setRotateX(rotateXValue)
    setRotateY(rotateYValue)
  }

  const resetRotation = () => {
    setRotateX(0)
    setRotateY(0)
  }

  // Copy product ID to clipboard
  const copyProductId = () => {
    if (product) {
      navigator.clipboard.writeText(product.id.toString())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Handle loading state
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      >
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-purple-500 animate-spin"></div>
            <div className="absolute inset-2 rounded-full border-r-2 border-l-2 border-purple-300 animate-spin animation-delay-150"></div>
            <div className="absolute inset-4 rounded-full border-t-2 border-b-2 border-purple-200 animate-spin animation-delay-300"></div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">Loading product details...</p>
        </div>
      </motion.div>
    )
  }

  if (isError || !product) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <div className="bg-white rounded-2xl p-8 max-w-md w-full">
          <div className="flex items-center text-red-500 mb-4">
            <Info className="w-6 h-6 mr-2" />
            <h3 className="text-lg font-semibold">Error Loading Product</h3>
          </div>
          <p className="text-gray-600 mb-6">Unable to load product details. Please try again later.</p>
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </motion.div>
    )
  }

  // Get image URLs from product data
  const getImageUrls = () => {
    if (!product.imagePaths || product.imagePaths.length === 0 || !product.imagePaths[0].imagePath) {
      return ["/placeholder.svg?height=600&width=400"]
    }

    return product.imagePaths
      .filter((img) => img.imagePath)
      .map((img) => {
        // Handle relative paths by prepending the API base URL
        const path = img.imagePath!
        if (path.startsWith("./")) {
          return `${pathUrl}${path.substring(1)}`
        }
        return path
      })
  }

  const images = getImageUrls()

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(product.id)
      onClose()
    }
  }

  const totalStock = product.stocks.reduce((total, stock) => total + stock.amount, 0)
  const isOutOfStock = totalStock <= 0
  const isLowStock = totalStock > 0 && totalStock <= 10

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl overflow-hidden max-w-6xl w-full shadow-2xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetRotation}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image Section */}
          <div className="relative h-[400px] lg:h-full min-h-[500px] bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 z-0"></div>
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/40 to-transparent z-10"></div>
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/40 to-transparent z-10"></div>

            <motion.img
              key={currentImageIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              src={images[currentImageIndex]}
              alt={product.nameEn}
              className="w-full h-full object-cover z-0"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=600&width=400"
              }}
            />

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition-colors z-20 text-white border border-white/20"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition-colors z-20 text-white border border-white/20"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Image Indicators */}
            {images.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation()
                      setCurrentImageIndex(index)
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? "bg-white w-8" : "bg-white/30 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}

            <button
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-2 rounded-full hover:bg-white/20 transition-colors z-20 text-white border border-white/20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Status Badge */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
              <Badge
                variant="secondary"
                className="bg-white/10 backdrop-blur-md text-white border-white/20 hover:bg-white/20 capitalize px-3 py-1.5"
              >
                {product.businessType.name}
              </Badge>

              {isOutOfStock && (
                <Badge
                  variant="destructive"
                  className="bg-red-500/70 backdrop-blur-md text-white border-red-400/30 hover:bg-red-500/90 px-3 py-1.5"
                >
                  Out of Stock
                </Badge>
              )}

              {isLowStock && (
                <Badge
                  variant="outline"
                  className="bg-amber-500/70 backdrop-blur-md text-white border-amber-400/30 hover:bg-amber-500/90 px-3 py-1.5"
                >
                  Low Stock
                </Badge>
              )}
            </div>

            {/* Product ID Badge */}
            <div className="absolute bottom-6 left-6 z-20">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyProductId}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-sm border border-white/20 hover:bg-white/20 transition-colors"
              >
                ID: {product.id}
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </motion.button>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-0 lg:max-h-[90vh] lg:overflow-y-auto relative bg-white" ref={detailsRef}>
            {/* Tab Navigation */}
            <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-6 py-3">
              <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
                {["details", "colors", "materials"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                      selectedTab === tab ? "bg-purple-100 text-purple-800" : "text-gray-600 hover:bg-gray-100",
                    )}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    {product.nameEn}
                    {product.materials.some((m) => m.name === "Marble") && (
                      <Sparkles className="w-5 h-5 text-amber-500" />
                    )}
                  </h2>
                  <div className="flex gap-2">

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={()=>navigate(`/editproduct/${product.id}`)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <Edit className="w-5 h-5 text-gray-600" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, backgroundColor: "#FEE2E2" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleDelete}
                      className="p-2 hover:bg-red-100 rounded-full"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </motion.button>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">4.0 (24 reviews)</span>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">{product.descriptionEn}</p>

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      ${product.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
                    <Package className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700 text-sm font-medium">Stock: {totalStock}</span>
                  </div>
                </div>
              </div>

              <AnimatePresence mode="wait">
                {selectedTab === "details" && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                        <Ruler className="w-4 h-4 mr-2 text-purple-600" />
                        Dimensions
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                          <div className="text-lg font-semibold text-gray-900">{product.length}</div>
                          <div className="text-sm text-gray-500">Length ({product.baseUnit.name})</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                          <div className="text-lg font-semibold text-gray-900">{product.width}</div>
                          <div className="text-sm text-gray-500">Width ({product.baseUnit.name})</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
                          <div className="text-lg font-semibold text-gray-900">{product.height}</div>
                          <div className="text-sm text-gray-500">Height ({product.baseUnit.name})</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200">
                        <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                          <Tag className="w-4 h-4 mr-2 text-purple-600" />
                          Category
                        </h3>
                        <div className="flex items-center">
                          <Badge className="bg-white text-purple-800 hover:bg-white capitalize shadow-sm">
                            {product.businessType.name}
                          </Badge>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
                        <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                          <Info className="w-4 h-4 mr-2 text-blue-600" />
                          Base Unit
                        </h3>
                        <div className="flex items-center">
                          <Badge className="bg-white text-blue-800 hover:bg-white capitalize shadow-sm">
                            {product.baseUnit.name}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 py-6 text-gray-700 border-dashed"
                        onClick={() => setSelectedTab("materials")}
                      >
                        View Materials
                        <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {selectedTab === "colors" && (
                  <motion.div
                    key="colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                        <Palette className="w-4 h-4 mr-2 text-purple-600" />
                        Available Colors
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {product.stocks.map((stock) => (
                          <motion.button
                            key={stock.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedColor(stock.color.id)}
                            className={`flex items-center gap-3 p-4 rounded-xl ${
                              selectedColor === stock.color.id
                                ? "bg-white border-2 border-purple-500 shadow-md"
                                : "bg-white border border-gray-200 hover:border-purple-300 shadow-sm"
                            }`}
                          >
                            <div
                              className="w-12 h-12 rounded-lg shadow-inner flex items-center justify-center"
                              style={{
                                backgroundColor: stock.color.hexColor,
                                border: stock.color.hexColor.toLowerCase() === "#ffffff" ? "1px solid #e5e7eb" : "none",
                              }}
                            >
                              {selectedColor === stock.color.id && (
                                <Check
                                  className={`w-6 h-6 ${
                                    isLightColor(stock.color.hexColor) ? "text-gray-800" : "text-white"
                                  }`}
                                />
                              )}
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="text-base font-medium text-gray-900">{stock.color.name}</span>
                              <div className="flex items-center gap-1 mt-1">
                                <span
                                  className={`w-2 h-2 rounded-full ${stock.amount > 0 ? "bg-green-500" : "bg-red-500"}`}
                                ></span>
                                <span className="text-sm text-gray-500">
                                  {stock.amount > 0 ? `${stock.amount} in stock` : "Out of stock"}
                                </span>
                              </div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Info className="w-4 h-4 text-gray-400" />
                        <p>Select a color to see availability and stock information.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {selectedTab === "materials" && (
                  <motion.div
                    key="materials"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                        <Layers className="w-4 h-4 mr-2 text-purple-600" />
                        Materials
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        {product.materials.map((material) => (
                          <div
                            key={material.id}
                            className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-3"
                          >
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                              {getMaterialIcon(material.name)}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{material.name}</h4>
                              <p className="text-sm text-gray-500">Code: {material.code}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-amber-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-amber-800 mb-1">Premium Materials</h4>
                          <p className="text-sm text-amber-700">
                            This product is crafted with high-quality materials for durability and elegance.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Helper function to determine if a color is light or dark
function isLightColor(hexColor: string): boolean {
  // Remove the hash if it exists
  hexColor = hexColor.replace("#", "")

  // Convert to RGB
  const r = Number.parseInt(hexColor.substr(0, 2), 16)
  const g = Number.parseInt(hexColor.substr(2, 2), 16)
  const b = Number.parseInt(hexColor.substr(4, 2), 16)

  // Calculate brightness (YIQ formula)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  // Return true if the color is light
  return brightness > 128
}

// Function to get material icon
function getMaterialIcon(materialName: string) {
  const className = "w-5 h-5 text-gray-700"

  switch (materialName.toLowerCase()) {
    case "marble":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2v20" />
          <path d="M2 12h20" />
          <path d="M12 2a10 10 0 0 1 10 10" />
          <path d="M12 2a10 10 0 0 0-10 10" />
        </svg>
      )
    case "leather":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />
        </svg>
      )
    default:
      return <Layers className={className} />
  }
}

export default ProductDetails

