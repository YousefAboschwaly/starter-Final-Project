"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, Edit, Trash2, Save, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ErrorMessage } from "../product-form"
import { useProductData } from "@/lib/product-data"

interface ColorsAndStockSectionProps {
  colorRows: { color: string; stock: string; id?: number }[]
  addColorRow: (color: string, stock: string) => void
  updateColorRow?: (index: number, color: string, stock: string) => void
  removeColorRow?: (index: number) => void
}

export default function ColorsAndStockSection({
  colorRows,
  addColorRow,
  updateColorRow,
  removeColorRow,
}: ColorsAndStockSectionProps) {
  const { data } = useProductData()
  const [selectedColor, setSelectedColor] = useState("")
  const [stockValue, setStockValue] = useState("")
  const [colorError, setColorError] = useState<string | null>(null)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [editStockValue, setEditStockValue] = useState("")

  const handleAddColor = () => {
    setColorError(null)

    if (!selectedColor) {
      setColorError("Please select a color")
      return
    }

    if (!stockValue) {
      setColorError("Please enter stock quantity")
      return
    }

    // Validate stock is a positive number
    const stockNum = Number(stockValue)
    if (isNaN(stockNum)) {
      setColorError("Stock must be a number")
      return
    }

    if (stockNum < 0) {
      setColorError("Stock cannot be negative")
      return
    }

    // Check if color already exists
    const colorExists = colorRows.some((row) => row.color === selectedColor)
    if (colorExists) {
      setColorError("This color has already been added")
      return
    }

    addColorRow(selectedColor, stockValue)
    setSelectedColor("")
    setStockValue("")
  }

  const handleEditRow = (index: number) => {
    setEditIndex(index)
    setEditStockValue(colorRows[index].stock)
  }

  const handleSaveEdit = (index: number) => {
    if (!editStockValue) {
      setColorError("Please enter stock quantity")
      return
    }

    // Validate stock is a positive number
    const stockNum = Number(editStockValue)
    if (isNaN(stockNum)) {
      setColorError("Stock must be a number")
      return
    }

    if (stockNum < 0) {
      setColorError("Stock cannot be negative")
      return
    }

    if (updateColorRow) {
      updateColorRow(index, colorRows[index].color, editStockValue)
    }
    setEditIndex(null)
    setEditStockValue("")
    setColorError(null)
  }

  const handleCancelEdit = () => {
    setEditIndex(null)
    setEditStockValue("")
    setColorError(null)
  }

  const handleDeleteRow = (index: number) => {
    if (removeColorRow) {
      removeColorRow(index)
    }
  }

  // Handle stock input change with validation
  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow empty string or positive numbers
    if (value === "" || (/^\d*\.?\d*$/.test(value) && Number(value) >= 0)) {
      setStockValue(value)
      setColorError(null)
    }
  }

  // Handle edit stock input change with validation
  const handleEditStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow empty string or positive numbers
    if (value === "" || (/^\d*\.?\d*$/.test(value) && Number(value) >= 0)) {
      setEditStockValue(value)
      setColorError(null)
    }
  }

  return (
    <div className="space-y-2">
      <Label>Colors and Stock</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div className="relative">
          <Select
            value={selectedColor}
            onValueChange={(value) => {
              setSelectedColor(value)
              setColorError(null)
            }}
          >
            <SelectTrigger className={`w-full border-[#e5e7eb] ${colorError ? "border-red-500" : ""}`}>
              <SelectValue placeholder="Colors" />
            </SelectTrigger>
            <SelectContent>
              {data?.colors.map((color) => (
                <SelectItem key={color.id} value={color.code}>
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-2 border border-gray-300"
                      style={{ backgroundColor: color.hexColor }}
                    />
                    {color.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Stock"
            value={stockValue}
            onChange={handleStockChange}
            type="number"
            min="0"
            step="1"
            className={`border-[#e5e7eb] ${colorError ? "border-red-500" : ""}`}
          />
          <Button
            type="button"
            className="bg-[#4f5d95] hover:bg-[#3f4d85] text-white rounded-full px-6"
            onClick={handleAddColor}
          >
            Add
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {colorError && <ErrorMessage message={colorError} />}

      {/* Color and Stock Table */}
      {colorRows.length > 0 && (
        <div className="border border-[#e5e7eb] rounded-lg overflow-hidden">
          <div className="grid grid-cols-12">
            <div className="col-span-5 p-3 text-center font-medium text-gray-600 border-b border-r border-[#e5e7eb]">
              Color
            </div>
            <div className="col-span-5 p-3 text-center font-medium text-gray-600 border-b border-r border-[#e5e7eb]">
              Stock
            </div>
            <div className="col-span-2 p-3 text-center font-medium text-gray-600 border-b border-[#e5e7eb]">
              Actions
            </div>
          </div>
          {colorRows.map((row, index) => {
            const colorData = data?.colors.find((c) => c.code === row.color)
            const isEditing = editIndex === index

            return (
              <div key={index} className="grid grid-cols-12 group">
                <div className="col-span-5 p-3 text-center border-r border-[#e5e7eb] flex items-center justify-center">
                  {colorData && (
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2 border border-gray-300"
                        style={{ backgroundColor: colorData.hexColor }}
                      />
                      {colorData.name}
                    </div>
                  )}
                </div>
                <div className="col-span-5 p-3 text-center border-r border-[#e5e7eb]">
                  {isEditing ? (
                    <Input
                      value={editStockValue}
                      onChange={handleEditStockChange}
                      type="number"
                      min="0"
                      step="1"
                      className="h-8 text-center"
                    />
                  ) : (
                    row.stock
                  )}
                </div>
                <div className="col-span-2 p-3 text-center flex items-center justify-center space-x-2">
                  {isEditing ? (
                    <>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleSaveEdit(index)}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => handleEditRow(index)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteRow(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

