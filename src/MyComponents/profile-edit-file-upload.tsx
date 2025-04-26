"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface FileUploadProps {
  defaultImage?: string
  onChange: (file: File | null) => void
  icon?: React.ReactNode
  acceptedFileTypes?: string
  className?: string
}

export const FileUpload = ({
  defaultImage,
  onChange,
  icon,
  acceptedFileTypes = ".jpg,.jpeg,.png,.pdf",
  className = "",
}: FileUploadProps) => {
  const [preview, setPreview] = useState<string | undefined>(defaultImage)
  const [fileName, setFileName] = useState<string>("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null

    if (file) {
      setFileName(file.name)

      // If it's an image, create a preview
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        // For non-image files like PDFs, just show the file name
        setPreview(undefined)
      }

      onChange(file)
    }
  }

  const handleRemove = () => {
    setPreview(undefined)
    setFileName("")
    onChange(null)
  }

  const isPdf = preview?.endsWith(".pdf") || fileName.endsWith(".pdf")

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {preview || fileName ? (
        <div className="relative w-full max-w-md">
          {preview && !isPdf ? (
            <div className="relative">
              <img
                src={preview || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-auto max-h-48 object-contain rounded-md border border-gray-300"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 border border-gray-300 rounded-md bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center space-x-3">
                {icon || (
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded">
                    <span className="text-xs font-medium">FILE</span>
                  </div>
                )}
                <span className="text-sm font-medium truncate max-w-[200px]">
                  {fileName || (preview ? preview.split("/").pop() : "")}
                </span>
              </div>
              <Button type="button" variant="destructive" size="icon" className="h-6 w-6" onClick={handleRemove}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {icon || (
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
            )}
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {acceptedFileTypes.replace(/\./g, "").toUpperCase().replace(/,/g, ", ")}
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept={acceptedFileTypes}
            onChange={handleFileChange}
          />
        </label>
      )}
    </div>
  )
}
