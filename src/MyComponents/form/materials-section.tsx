"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { ErrorMessage } from "../product-form"
import type { IProductMaterial } from "@/interfaces"
import { useProductData } from "@/lib/product-data"

interface MaterialsSectionProps {
  materials: string[]
  addMaterial: (material: string) => boolean
  removeMaterial: (index: number) => void
}

export default function MaterialsSection({ materials, addMaterial, removeMaterial }: MaterialsSectionProps) {
  const { data, getMaterialDisplayName, getMaterialStyle } = useProductData()
  const [selectedMaterial, setSelectedMaterial] = useState("")
  const [materialError, setMaterialError] = useState<string | null>(null)

  const handleAddMaterial = () => {
    // Clear any previous errors
    setMaterialError(null)

    if (!selectedMaterial) {
      setMaterialError("Please select a material")
      return
    }

    // Check if material already exists
    if (materials.includes(selectedMaterial)) {
      setMaterialError(`"${getMaterialDisplayName(selectedMaterial)}" has already been added`)
      return
    }

    const success = addMaterial(selectedMaterial)
    if (success) {
      setSelectedMaterial("")
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="material">Materials</Label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Select
            value={selectedMaterial}
            onValueChange={(value) => {
              setSelectedMaterial(value)
              setMaterialError(null) // Clear error when selection changes
            }}
          >
            <SelectTrigger
              id="material"
              className={cn("w-full border-[#e5e7eb]", materialError ? "border-red-500" : "")}
            >
              <SelectValue placeholder="Materials" />
            </SelectTrigger>
            <SelectContent>
              {data?.productMaterial.map((material: IProductMaterial) => (
                <SelectItem key={material.id} value={material.code}>
                  {material.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        </div>
        <Button
          type="button"
          className="bg-[#4f5d95] hover:bg-[#3f4d85] text-white rounded-full px-6"
          onClick={handleAddMaterial}
        >
          Add
        </Button>
      </div>

      {/* Error Message */}
      <AnimatePresence>{materialError && <ErrorMessage message={materialError} />}</AnimatePresence>

      {/* Materials Display */}
      {materials.length > 0 && (
        <div className="pt-2">
          <p className="text-sm font-medium text-gray-500 mb-3">Selected Materials:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <AnimatePresence>
              {materials.map((material, index) => {
                const { bgColor, textColor } = getMaterialStyle(material)
                return (
                  <motion.div
                    key={`${material}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className={cn("relative group flex items-center p-3 rounded-lg border border-[#e5e7eb]", bgColor)}
                  >
                    <div className="flex-1">
                      <p className={cn("font-medium text-sm", textColor)}>{getMaterialDisplayName(material)}</p>
                    </div>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-gray-200"
                      onClick={() => removeMaterial(index)}
                    >
                      <X className="h-3 w-3 text-gray-500" />
                    </motion.button>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  )
}

