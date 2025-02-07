"use client"

import { useState, useRef, useEffect } from "react"
import { Upload } from "lucide-react"

interface ImageUploadProps {
  defaultImage?: string
  onChange?: (file: File) => void
  className?: string
}

export function ImageUpload({ defaultImage, onChange, className = "" }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(defaultImage)
  console.log("preview in ImageUpload", preview)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setPreview(defaultImage)
  }, [defaultImage])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      onChange?.(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`relative rounded-full overflow-hidden cursor-pointer ${className}`} onClick={handleClick}>
      <div
        className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 ${preview ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
      >
        <Upload className="w-8 h-8 md:w-12 md:h-12 text-gray-400 dark:text-gray-500" />
      </div>
      <div
        className={`absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center ${preview ? "" : "hidden"}`}
      >
        <Upload className="w-6 h-6 md:w-8 md:h-8 text-white" />
      </div>
      {preview && (
        <img
          src={preview || "/placeholder.svg"}
          alt="Profile"
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
      )}
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
    </div>
  )
}

