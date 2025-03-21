"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2, Info } from "lucide-react"
import { useProductData } from "@/lib/product-data"
import { cn } from "@/lib/utils"

interface ProductPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  formData: {
    businessType: string
    productNameEn: string
    productNameAr: string
    price: string
    baseUnit: string
    descriptionEn: string
    descriptionAr: string
    length: string
    width: string
    height: string
  }
  materials: string[]
  colorRows: { color: string; stock: string; id?: number }[]
  newImageFiles: string[]
  existingImageFiles: { id: number; url: string }[]
}

export default function ProductPreviewModal({
  isOpen,
  onClose,
  formData,
  materials,
  colorRows,
  newImageFiles,
  existingImageFiles,
}: ProductPreviewModalProps) {
  const { data, getMaterialDisplayName, getMaterialStyle ,businessTypes} = useProductData()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [language, setLanguage] = useState<"en" | "ar">("en")
  const [fullscreen, setFullscreen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  // Combine all images for the gallery
  const allImages = [...existingImageFiles.map((img) => img.url), ...newImageFiles]

  // Reset image index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0)
    }
  }, [isOpen])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "Escape":
          onClose()
          break
        case "ArrowLeft":
          setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
          break
        case "ArrowRight":
          setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
          break
        case "f":
          setFullscreen((prev) => !prev)
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, allImages.length, onClose])

  // Get business type name
  const getBusinessTypeName = (code: string) => {
    const businessType = businessTypes?.find((type) => type.code === code)
    return businessType?.name || code
  }

  // Get base unit name
  const getBaseUnitName = (code: string) => {
    const baseUnit = data?.productBaseUnits.find((unit) => unit.code === code)
    return baseUnit?.name || code
  }

  // Get color data
  const getColorData = (code: string) => {
    return data?.colors.find((color) => color.code === code)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/60",
          fullscreen ? "p-0" : "p-4",
        )}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={cn(
            "bg-white rounded-xl overflow-hidden shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col",
            fullscreen ? "rounded-none max-w-none max-h-screen h-screen" : "",
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <h2 className="text-lg font-semibold ml-2">Product Preview</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFullscreen(!fullscreen)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                {fullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
              {/* Image Gallery */}
              <div className="relative bg-gray-50 flex items-center justify-center min-h-[300px] lg:min-h-[500px]">
                {allImages.length > 0 ? (
                  <>
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentImageIndex}
                        src={allImages[currentImageIndex]}
                        alt={formData.productNameEn}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=500&width=500"
                        }}
                      />
                    </AnimatePresence>

                    {/* Image Navigation */}
                    {allImages.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
                          }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        {/* Image Indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {allImages.map((_, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation()
                                setCurrentImageIndex(index)
                              }}
                              className={`w-2 h-2 rounded-full transition-all ${
                                index === currentImageIndex ? "bg-purple-600 w-6" : "bg-gray-300 hover:bg-gray-400"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-400">
                    <Info className="w-12 h-12 mb-2" />
                    <p>No images available</p>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="p-6 overflow-y-auto">
                {/* Language Toggle */}
                <div className="flex justify-end mb-4">
                  <div className="bg-gray-100 rounded-full p-1 flex">
                    <button
                      onClick={() => setLanguage("en")}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        language === "en" ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => setLanguage("ar")}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        language === "ar" ? "bg-white shadow-sm" : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      العربية
                    </button>
                  </div>
                </div>

                {/* Product Name and Price */}
                <div className="mb-6">
                  <motion.h1
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-3xl font-bold text-gray-900 mb-2 ${language === "ar" ? "text-right" : ""}`}
                  >
                    {language === "en" ? formData.productNameEn : formData.productNameAr}
                  </motion.h1>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-2xl font-bold text-purple-600">
                      ${Number(formData.price).toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 capitalize">
                      {getBusinessTypeName(formData.businessType)}
                    </span>
                  </motion.div>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                  <div className="flex border-b">
                    <button
                      onClick={() => setActiveTab("overview")}
                      className={`px-4 py-2 font-medium text-sm transition-colors ${
                        activeTab === "overview"
                          ? "text-purple-600 border-b-2 border-purple-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setActiveTab("details")}
                      className={`px-4 py-2 font-medium text-sm transition-colors ${
                        activeTab === "details"
                          ? "text-purple-600 border-b-2 border-purple-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Details
                    </button>
                    <button
                      onClick={() => setActiveTab("colors")}
                      className={`px-4 py-2 font-medium text-sm transition-colors ${
                        activeTab === "colors"
                          ? "text-purple-600 border-b-2 border-purple-600"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Colors & Stock
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <AnimatePresence mode="wait">
                  {activeTab === "overview" && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Description */}
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                        <p className={`text-gray-600 ${language === "ar" ? "text-right" : ""}`}>
                          {language === "en" ? formData.descriptionEn : formData.descriptionAr}
                        </p>
                      </div>

                      {/* Dimensions */}
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Dimensions</h3>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="bg-gray-50 p-3 rounded-lg text-center">
                            <div className="text-lg font-semibold">{formData.length || "0"}</div>
                            <div className="text-xs text-gray-500">Length ({getBaseUnitName(formData.baseUnit)})</div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg text-center">
                            <div className="text-lg font-semibold">{formData.width || "0"}</div>
                            <div className="text-xs text-gray-500">Width ({getBaseUnitName(formData.baseUnit)})</div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg text-center">
                            <div className="text-lg font-semibold">{formData.height || "0"}</div>
                            <div className="text-xs text-gray-500">Height ({getBaseUnitName(formData.baseUnit)})</div>
                          </div>
                        </div>
                      </div>

                      {/* Materials */}
                      <div className="mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Materials</h3>
                        <div className="flex flex-wrap gap-2">
                          {materials.length > 0 ? (
                            materials.map((material, index) => {
                              const style = getMaterialStyle(material)
                              return (
                                <motion.span
                                  key={material}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.05 }}
                                  className={`${style.bgColor} ${style.textColor} px-3 py-1.5 rounded-full text-sm font-medium`}
                                >
                                  {getMaterialDisplayName(material)}
                                </motion.span>
                              )
                            })
                          ) : (
                            <span className="text-gray-400 italic">No materials specified</span>
                          )}
                        </div>
                      </div>

                      {/* Quick Color Overview */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Available Colors</h3>
                        <div className="flex flex-wrap gap-2">
                          {colorRows.length > 0 ? (
                            colorRows.map((row, index) => {
                              const colorData = getColorData(row.color)
                              return (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg"
                                >
                                  <div
                                    className="w-4 h-4 rounded-full border border-gray-200"
                                    style={{ backgroundColor: colorData?.hexColor || "#CCCCCC" }}
                                  ></div>
                                  <span className="text-sm font-medium">{colorData?.name || row.color}</span>
                                </motion.div>
                              )
                            })
                          ) : (
                            <span className="text-gray-400 italic">No colors specified</span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "details" && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      {/* Product Information Table */}
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <tbody>
                            <tr className="border-b">
                              <td className="px-4 py-3 bg-gray-50 font-medium text-gray-600 w-1/3">
                                Product Name (EN)
                              </td>
                              <td className="px-4 py-3">{formData.productNameEn}</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-3 bg-gray-50 font-medium text-gray-600">Product Name (AR)</td>
                              <td className="px-4 py-3 text-right">{formData.productNameAr}</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-3 bg-gray-50 font-medium text-gray-600">Price</td>
                              <td className="px-4 py-3">${Number(formData.price).toLocaleString()}</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-3 bg-gray-50 font-medium text-gray-600">Category</td>
                              <td className="px-4 py-3 capitalize">{getBusinessTypeName(formData.businessType)}</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-3 bg-gray-50 font-medium text-gray-600">Base Unit</td>
                              <td className="px-4 py-3">{getBaseUnitName(formData.baseUnit)}</td>
                            </tr>
                            <tr className="border-b">
                              <td className="px-4 py-3 bg-gray-50 font-medium text-gray-600">Dimensions</td>
                              <td className="px-4 py-3">
                                {formData.length || "0"} × {formData.width || "0"} × {formData.height || "0"}{" "}
                                {getBaseUnitName(formData.baseUnit)}
                              </td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3 bg-gray-50 font-medium text-gray-600">Total Stock</td>
                              <td className="px-4 py-3">
                                {colorRows.reduce((total, row) => total + Number(row.stock), 0)} units
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Description Sections */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">English Description</h3>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-700">{formData.descriptionEn || "No description provided"}</p>
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Arabic Description</h3>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-700 text-right">
                              {formData.descriptionAr || "No description provided"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Materials Detail */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Materials</h3>
                        {materials.length > 0 ? (
                          <div className="grid grid-cols-2 gap-3">
                            {materials.map((material, index) => {
                              const style = getMaterialStyle(material)
                              return (
                                <motion.div
                                  key={material}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className={`${style.bgColor} p-3 rounded-lg flex items-center gap-3`}
                                >
                                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                                    <span className={`text-lg font-bold ${style.textColor}`}>
                                      {getMaterialDisplayName(material).charAt(0)}
                                    </span>
                                  </div>
                                  <span className={`${style.textColor} font-medium`}>
                                    {getMaterialDisplayName(material)}
                                  </span>
                                </motion.div>
                              )
                            })}
                          </div>
                        ) : (
                          <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                            No materials have been specified for this product
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "colors" && (
                    <motion.div
                      key="colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {colorRows.length > 0 ? (
                        <div className="space-y-4">
                          {/* Color Stock Table */}
                          <div className="border rounded-lg overflow-hidden">
                            <table className="w-full">
                              <thead>
                                <tr className="bg-gray-50 border-b">
                                  <th className="px-4 py-3 text-left font-medium text-gray-600">Color</th>
                                  <th className="px-4 py-3 text-left font-medium text-gray-600">Stock</th>
                                </tr>
                              </thead>
                              <tbody>
                                {colorRows.map((row, index) => {
                                  const colorData = getColorData(row.color)
                                  return (
                                    <motion.tr
                                      key={index}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ delay: index * 0.05 }}
                                      className="border-b last:border-b-0"
                                    >
                                      <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                          <div
                                            className="w-6 h-6 rounded-full border border-gray-200"
                                            style={{ backgroundColor: colorData?.hexColor || "#CCCCCC" }}
                                          ></div>
                                          <span>{colorData?.name || row.color}</span>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3">{row.stock} units</td>
                                    </motion.tr>
                                  )
                                })}
                                <tr className="bg-gray-50 font-medium">
                                  <td className="px-4 py-3">Total</td>
                                  <td className="px-4 py-3">
                                    {colorRows.reduce((total, row) => total + Number(row.stock), 0)} units
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          {/* Color Visualization */}
                          <div>
                            <h3 className="text-lg font-medium text-gray-900 mb-3">Color Visualization</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                              {colorRows.map((row, index) => {
                                const colorData = getColorData(row.color)
                                const stockPercentage = Math.min(
                                  100,
                                  (Number(row.stock) /
                                    colorRows.reduce((max, r) => Math.max(max, Number(r.stock)), 1)) *
                                    100,
                                )
                                return (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white border rounded-lg overflow-hidden shadow-sm"
                                  >
                                    <div
                                      className="h-24 w-full"
                                      style={{ backgroundColor: colorData?.hexColor || "#CCCCCC" }}
                                    ></div>
                                    <div className="p-3">
                                      <div className="font-medium mb-1">{colorData?.name || row.color}</div>
                                      <div className="text-sm text-gray-500 mb-2">{row.stock} units</div>
                                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <motion.div
                                          initial={{ width: 0 }}
                                          animate={{ width: `${stockPercentage}%` }}
                                          transition={{ delay: 0.3, duration: 0.5 }}
                                          className="h-2.5 rounded-full"
                                          style={{
                                            backgroundColor: colorData?.hexColor || "#CCCCCC",
                                            opacity: 0.7,
                                          }}
                                        ></motion.div>
                                      </div>
                                    </div>
                                  </motion.div>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 p-8 rounded-lg text-center">
                          <div className="text-gray-400 mb-2">
                            <Info className="w-12 h-12 mx-auto mb-2" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-700 mb-1">No Colors Added</h3>
                          <p className="text-gray-500">You haven't added any colors or stock information yet.</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t p-4 flex justify-between items-center bg-gray-50">
            <div className="text-sm text-gray-500">
              <span className="font-medium">Preview Mode</span> • Changes won't be saved until you submit the form
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Close Preview
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

