"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import { motion } from "framer-motion"

interface FileUploadProps {
  onFileChange: (files: File[]) => void
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<{ file: File; preview: string }[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      const updatedFiles = [...files, ...newFiles]
      setFiles(updatedFiles)
      onFileChange(updatedFiles)

      // Create previews for images
      const newPreviews = newFiles
        .filter((file) => file.type.startsWith("image/"))
        .map((file) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          return new Promise<{ file: File; preview: string }>((resolve) => {
            reader.onload = (event) => {
              resolve({
                file,
                preview: event.target?.result as string,
              })
            }
          })
        })

      Promise.all(newPreviews).then((results) => {
        setPreviews((prev) => [...prev, ...results])
      })
    }
  }

  const handleRemoveFile = (fileToRemove: File) => {
    const updatedFiles = files.filter((file) => file !== fileToRemove)
    setFiles(updatedFiles)
    onFileChange(updatedFiles)
    setPreviews((prev) => prev.filter((item) => item.file !== fileToRemove))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files)
      const updatedFiles = [...files, ...newFiles]
      setFiles(updatedFiles)
      onFileChange(updatedFiles)

      // Create previews for images
      const newPreviews = newFiles
        .filter((file) => file.type.startsWith("image/"))
        .map((file) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          return new Promise<{ file: File; preview: string }>((resolve) => {
            reader.onload = (event) => {
              resolve({
                file,
                preview: event.target?.result as string,
              })
            }
          })
        })

      Promise.all(newPreviews).then((results) => {
        setPreviews((prev) => [...prev, ...results])
      })
    }
  }

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
        multiple
      />

      <motion.div
        className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isDragging ? "bg-blue-50 border-blue-400" : "hover:bg-gray-50"
        }`}
        onClick={handleButtonClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01, borderColor: "#3b82f6" }}
        whileTap={{ scale: 0.99 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative w-16 h-16 mb-3">
          <motion.div
            className={`absolute inset-0 flex items-center justify-center rounded-full ${
              isDragging ? "bg-blue-100" : "bg-gray-100"
            }`}
            initial={{ scale: 0 }}
            animate={{
              scale: 1,
              backgroundColor: isDragging ? "#dbeafe" : "#f3f4f6",
            }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.1,
            }}
          >
            <Upload className={`h-8 w-8 ${isDragging ? "text-blue-500" : "text-gray-400"} animate-bounce`} />
          </motion.div>
        </div>
        <motion.p
          className={`text-sm text-center font-medium ${isDragging ? "text-blue-600" : "text-gray-500"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Attach Photo & Attachments Here
        </motion.p>
        <motion.p
          className={`text-xs text-center mt-1 ${isDragging ? "text-blue-500" : "text-gray-400"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {isDragging ? "Drop files here" : "Click to browse or drag and drop"}
        </motion.p>
        <motion.p
          className={`text-xs text-center mt-1 ${isDragging ? "text-blue-500" : "text-gray-400"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Supports: Images, PDF, DOC, DOCX, XLS, XLSX, TXT
        </motion.p>
      </motion.div>

      {/* Only show image previews, not the file list */}
      {previews.length > 0 && (
        <motion.div
          className="mt-3 grid grid-cols-3 gap-2"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          {previews.map((item, index) => (
            <motion.div
              key={`preview-${index}`}
              className="relative aspect-square rounded-md overflow-hidden"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <img
                src={item.preview || "/placeholder.svg"}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRemoveFile(item.file)}
                className="absolute top-1 right-1 h-5 w-5 p-0 rounded-full"
              >
                <X className="h-3 w-3" />
              </Button>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default FileUpload
