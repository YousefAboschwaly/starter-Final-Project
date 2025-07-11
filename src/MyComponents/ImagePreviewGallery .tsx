"use client";

import type React from "react";
import { motion } from "framer-motion";
import { Upload, Plus, X } from "lucide-react";
import { Label } from "@/components/ui/label";

interface CompactImageUploadProps {
  newImageFiles: string[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  removeNewImage: (index: number) => void;
}

export default function CompactImageUpload({
  newImageFiles,
  fileInputRef,
  handleImageUpload,
  handleDragOver,
  handleDrop,
  removeNewImage,
}: CompactImageUploadProps) {
  return (
    <div className="space-y-2">
      <Label>Upload Images</Label>

      <div
        className="min-h-[180px] border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-blue-400 transition-colors relative"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          className="hidden"
          accept="image/*"
          multiple
        />

        {newImageFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-400 h-full">
            <Upload className="w-10 h-10 mt-10 animate-bounce" />
            <p className="text-sm">Click or drag to upload</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {newImageFiles.map((src, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-[100px] h-[100px] rounded overflow-hidden border border-gray-200"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeNewImage(index);
                  }}
                  className="absolute top-1 right-1 z-10 bg-white p-[2px] rounded-full shadow"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
                <img
                  src={src}
                  alt={`preview-${index}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}

            {newImageFiles.length < 6 && (
              <div className="w-[100px] h-[100px] border border-dashed border-blue-400 rounded flex items-center justify-center hover:bg-blue-50 transition">
                <Plus className="w-5 h-5 text-blue-500" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
