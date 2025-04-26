"use client"

import type React from "react"

import { useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, FileText, Eye, Download, CheckCircle, AlertCircle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EnhancedDocumentUploadProps {
  label: string
  newFile: File | null
  existingFileUrl: string | null
  handleFileUpload: (file: File | null) => void
  acceptedFileTypes?: string
  icon?: React.ReactNode
  description?: string
  maxSizeMB?: number
  documentType?: string
}

export default function EnhancedDocumentUpload({
  label,
  newFile,
  existingFileUrl,
  handleFileUpload,
  acceptedFileTypes = ".pdf,.jpg,.jpeg,.png",
  icon = <FileText className="w-8 h-8 text-gray-400" />,
  description,
  maxSizeMB = 10
 
}: EnhancedDocumentUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error" | "uploading">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [uploadProgress] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null

    if (file) {
      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setErrorMessage(`File size exceeds ${maxSizeMB}MB limit`)
        setUploadStatus("error")
        return
      }

      // Check file type
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`
      if (!acceptedFileTypes.includes(fileExtension)) {
        setErrorMessage(
          `File type not supported. Please upload ${acceptedFileTypes.replace(/\./g, "").replace(/,/g, ", ")}`,
        )
        setUploadStatus("error")
        return
      }

      // Pass the file to the parent component
      handleFileUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]

      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setErrorMessage(`File size exceeds ${maxSizeMB}MB limit`)
        setUploadStatus("error")
        return
      }

      // Check file type
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`
      if (!acceptedFileTypes.includes(fileExtension)) {
        setErrorMessage(
          `File type not supported. Please upload ${acceptedFileTypes.replace(/\./g, "").replace(/,/g, ", ")}`,
        )
        setUploadStatus("error")
        return
      }

      // Pass the file to the parent component
      handleFileUpload(file)
      e.dataTransfer.clearData()
    }
  }

  const removeFile = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    handleFileUpload(null)
    setUploadStatus("idle")
    setErrorMessage("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const hasFile = newFile || existingFileUrl
  const isImage = newFile ? newFile.type.startsWith("image/") : existingFileUrl?.match(/\.(jpg|jpeg|png|gif)$/i)
  const isPdf = newFile ? newFile.type === "application/pdf" : existingFileUrl?.endsWith(".pdf")

  const openPreview = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsPreviewOpen(true)
    setZoomLevel(1) // Reset zoom level when opening preview
  }

  const closePreview = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsPreviewOpen(false)
  }

  const downloadFile = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (existingFileUrl) {
      const link = document.createElement("a")
      link.href = existingFileUrl
      link.download = existingFileUrl.split("/").pop() || "download"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const getFilePreview = () => {
    if (!hasFile) return null

    if (isImage) {
      const imageUrl = newFile ? URL.createObjectURL(newFile) : existingFileUrl
      return (
        <div
          className="relative group cursor-pointer overflow-hidden rounded-lg"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={(e) => {
            e.preventDefault()
            openPreview(e)
          }}
        >
          <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: isHovering ? 1.05 : 1 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <img src={imageUrl || "/placeholder.svg"} alt={label} className="w-full h-56 object-cover rounded-lg" />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovering ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col items-center justify-end p-4 rounded-lg"
            >
              <p className="text-white font-medium mb-2">
                {newFile ? newFile.name : existingFileUrl?.split("/").pop() || "Image"}
              </p>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="text-xs bg-white/90 hover:bg-white text-gray-800"
                  onClick={(e) => {
                    e.stopPropagation()
                    openPreview(e)
                  }}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  Preview
                </Button>
                {existingFileUrl && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="text-xs bg-white/90 hover:bg-white text-gray-800"
                    onClick={downloadFile}
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>

          {uploadStatus === "success" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-3 right-3 bg-green-500 text-white rounded-full p-1"
            >
              <CheckCircle className="h-5 w-5" />
            </motion.div>
          )}
        </div>
      )
    } else {
      return (
        <motion.div
          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div
            className={cn(
              "p-6 rounded-full mb-3 shadow-md",
              isPdf ? "bg-red-50 dark:bg-red-900/20" : "bg-blue-50 dark:bg-blue-900/20",
            )}
          >
            {isPdf ? (
              <FileText
                className={cn(
                  "w-12 h-12 transition-colors duration-300",
                  isPdf ? "text-red-500 dark:text-red-400" : "text-blue-500 dark:text-blue-400",
                )}
              />
            ) : (
              icon
            )}
          </div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-full mb-2">
            {newFile ? newFile.name : existingFileUrl?.split("/").pop() || "Document"}
          </p>
          <div className="flex space-x-2 mt-3">
            {isPdf && existingFileUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  window.open(existingFileUrl, "_blank")
                }}
              >
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
            )}
            {existingFileUrl && (
              <Button type="button" variant="outline" size="sm" className="text-xs" onClick={downloadFile}>
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
            )}
          </div>

          {uploadStatus === "success" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 flex items-center text-green-600 dark:text-green-400 text-xs"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Successfully uploaded
            </motion.div>
          )}
        </motion.div>
      )
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Label className="text-base font-medium">{label}</Label>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>

      <AnimatePresence mode="wait">
        {!hasFile ? (
          <motion.div
            key="upload-area"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "relative border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200",
              isDragging
                ? "border-primary bg-primary/5 dark:bg-primary/10"
                : "border-gray-300 dark:border-gray-600 hover:border-primary/70 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleChange}
              className="hidden"
              accept={acceptedFileTypes}
            />

            {uploadStatus === "error" ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center"
              >
                <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full inline-flex mb-3">
                  <AlertCircle className="w-8 h-8 text-red-500 dark:text-red-400" />
                </div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">
                  Upload Failed
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs text-center">
                  {errorMessage}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-3 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadStatus("idle");
                    setErrorMessage("");
                  }}
                >
                  Try Again
                </Button>
              </motion.div>
            ) : (
              <>
                <motion.div
                  animate={{
                    y: isDragging ? -10 : 0,
                    scale: isDragging ? 1.1 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={cn(
                    "p-4 rounded-full mb-4",
                    isDragging
                      ? "bg-primary/10 dark:bg-primary/20"
                      : "bg-gray-100 dark:bg-gray-800"
                  )}
                >
                  <Upload
                    className={cn(
                      "w-10 h-10 transition-colors duration-300",
                      isDragging
                        ? "text-primary"
                        : "text-gray-400 dark:text-gray-500"
                    )}
                  />
                </motion.div>
                <motion.p
                  animate={{ scale: isDragging ? 1.05 : 1 }}
                  className={cn(
                    "text-base font-medium mb-1 transition-colors duration-300",
                    isDragging
                      ? "text-primary"
                      : "text-gray-700 dark:text-gray-300"
                  )}
                >
                  {isDragging ? "Drop to upload" : `Upload ${label}`}
                </motion.p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Drag and drop or click to browse
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                  {acceptedFileTypes
                    .replace(/\./g, "")
                    .toUpperCase()
                    .replace(/,/g, ", ")}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                  Max size: {maxSizeMB}MB
                </p>
              </>
            )}

            {/* Animated border effect when dragging */}
            {isDragging && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(var(--primary), 0.1), transparent)",
                  backgroundSize: "200% 100%",
                }}
              />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="file-preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="relative rounded-lg overflow-hidden"
          >
            {/* Upload progress indicator */}
            {uploadStatus === "uploading" && (
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: `${uploadProgress}%` }}
                className="absolute top-0 left-0 h-1 bg-primary z-10"
              />
            )}

            <motion.button
              whileHover={{ scale: 1.1, backgroundColor: "#ef4444" }}
              whileTap={{ scale: 0.9 }}
              type="button"
              className="absolute top-3 right-3 bg-white/90 dark:bg-gray-800/90 text-gray-500 hover:text-white rounded-full p-1.5 shadow-md z-20 transition-colors duration-200"
              onClick={removeFile}
            >
              <X className="h-4 w-4" />
            </motion.button>

            {getFilePreview()}

            {/* Enhanced Image Preview Modal */}
            <AnimatePresence>
              {isImage && isPreviewOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 z-[9999] flex items-center justify-center"
                  onClick={closePreview}
                >
                  {/* Blurred background */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                    style={{
                      backgroundImage:
                        newFile || existingFileUrl
                          ? `url(${
                              newFile
                                ? URL.createObjectURL(newFile)
                                : existingFileUrl
                            })`
                          : undefined,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "blur(20px) brightness(0.4)",
                    }}
                  />

                  <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: -20 }}
                    transition={{ type: "spring", damping: 25 }}
                    className="relative w-full md:p-8 p-4 overflow-hidden z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Beautiful close button */}
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{
                        scale: 1.1,
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 17,
                      }}
                      className="absolute md:top-10 md:right-10 top-4 right-4 z-20 bg-black/40 backdrop-blur-md text-white rounded-full p-2.5 shadow-lg border border-white/20"
                      onClick={closePreview}
                    >
                      <X className="h-5 w-5" />
                    </motion.button>

                    <div className="overflow-auto w-full h-full relative flex items-center justify-center">
                      <motion.img
                        src={
                          newFile
                            ? URL.createObjectURL(newFile)
                            : existingFileUrl || ""
                        }
                        alt={label}
                        className="w-full h-full object-contain rounded-md shadow-2xl"
                        style={{
                          transform: `scale(${zoomLevel})`,
                          transition: "transform 0.2s ease-out",
                        }}
                        drag
                        dragConstraints={{
                          left: -500,
                          right: 500,
                          top: -500,
                          bottom: 500,
                        }}
                        dragElastic={0.1}
                      />
                    </div>


                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
