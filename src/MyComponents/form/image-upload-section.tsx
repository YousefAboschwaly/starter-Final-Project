"use client"

import type React from "react"

import { motion } from "framer-motion"
import { Upload, Plus, X } from "lucide-react"
import { Label } from "@/components/ui/label"

interface ImageUploadSectionProps {
  newImageFiles: string[] // New images being added
  existingImageFiles: { id: number; url: string }[] // Existing images from API
  fileInputRef: React.RefObject<HTMLInputElement>
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleDragOver: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent) => void
  removeNewImage: (index: number) => void
  removeExistingImage: (id: number) => void
  isEditMode?: boolean
}

export default function ImageUploadSection({
  newImageFiles,
  existingImageFiles,
  fileInputRef,
  handleImageUpload,
  handleDragOver,
  handleDrop,
  removeNewImage,
  removeExistingImage,
  isEditMode = false,
}: ImageUploadSectionProps) {
  const hasImages = newImageFiles.length > 0 || existingImageFiles.length > 0

  return (
    <div className="space-y-2">
      <Label>Product Images</Label>
      {!hasImages ? (
        <div
          className="border-2 border-dashed border-[#e5e7eb] rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
            multiple
          />
          <Upload className="w-12 h-12 text-gray-400 mb-2 animate-bounce " />
          <p className="text-sm font-medium text-gray-900">Upload Image</p>
          <p className="text-xs text-gray-500">Or drop and drag</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Add more images button */}
          <div
            className="border-2 border-dashed border-[#1e90ff] rounded-lg p-3 flex items-center justify-center cursor-pointer transition-colors hover:bg-blue-50"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              className="hidden"
              accept="image/*"
              multiple
            />
            <Plus className="h-5 w-5 mr-2 text-gray-500 " />
            <span className="text-sm font-medium text-gray-700">Add More Images</span>
          </div>

          {/* Image Gallery */}
          <div className="space-y-3">
            {/* Section title for existing images if in edit mode */}
            {isEditMode && existingImageFiles.length > 0 && (
              <div className="text-sm font-medium text-gray-700 border-b pb-2">Existing Images</div>
            )}

            {/* Existing images from API */}
            {existingImageFiles.map((img) => (
              <motion.div
                key={`existing-${img.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative rounded-lg overflow-hidden border border-gray-200"
              >
                <motion.button
                  type="button"
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md z-10"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeExistingImage(img.id)
                  }}
                >
                  <X className="h-4 w-4 text-gray-500" />
                </motion.button>
                <img
                  src={img.url || "/placeholder.svg"}
                  alt={`Existing product image ${img.id}`}
                  className="w-full h-48 object-cover"
                />
              </motion.div>
            ))}

            {/* Section title for new images if there are any */}
            {newImageFiles.length > 0 && existingImageFiles.length > 0 && (
              <div className="text-sm font-medium text-gray-700 border-b pb-2 mt-4">New Images</div>
            )}

            {/* Newly uploaded images */}
            {newImageFiles.map((src, index) => (
              <motion.div
                key={`new-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative rounded-lg overflow-hidden border border-gray-200"
              >
                <motion.button
                  type="button"
                  className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md z-10"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeNewImage(index)
                  }}
                >
                  <X className="h-4 w-4 text-gray-500" />
                </motion.button>
                <img
                  src={src || "/placeholder.svg"}
                  alt={`New product image ${index + 1}`}
                  className="w-full h-48 object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

