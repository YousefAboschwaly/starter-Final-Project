"use client"

import { useState } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import toast from "react-hot-toast"

interface FileUploadProps {
  maxFiles: number
  accept?: string
  onChange?: (files: File[]) => void
  value?: File[]
}

export function FileUpload({ maxFiles, accept, onChange, value = [] }: FileUploadProps) {
  const [files, setFiles] = useState<File[]>(value)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || [])
    if (files.length + newFiles.length <= maxFiles) {
      const updatedFiles = [...files, ...newFiles]
      setFiles(updatedFiles)
      onChange?.(updatedFiles)
    } else {
      toast.error(`You can only upload up to ${maxFiles} files`, {
        duration: 3000,
        position: "top-center",
      })
    }
  }

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    onChange?.(updatedFiles)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{maxFiles - files.length} files remaining</p>
          </div>
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept={accept}
            multiple
            disabled={files.length >= maxFiles}
          />
        </label>
      </div>

      {files.length > 0 && (
        <div className="grid gap-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 border rounded-lg bg-gray-50 dark:bg-gray-800"
            >
              <span className="text-sm truncate">{file.name}</span>
              <Button variant="ghost" size="icon" onClick={() => removeFile(index)} className="h-8 w-8">
                <X className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

