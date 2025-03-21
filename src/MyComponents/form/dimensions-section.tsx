"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ErrorMessage } from "../product-form"
import type { FormikErrors, FormikTouched } from "formik"

interface DimensionsSectionProps {
  values: {
    length: string
    width: string
    height: string
  }
  errors: FormikErrors<{
    length?: string
    width?: string
    height?: string
  }>
  touched: FormikTouched<{
    length?: string
    width?: string
    height?: string
  }>
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void
}

export default function DimensionsSection({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
}: DimensionsSectionProps) {
  return (
    <div className="space-y-2">
      <Label>Dimensions</Label>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Input
            id="length"
            name="length"
            placeholder="Length"
            type="text"
            className={`border-[#e5e7eb] ${errors.length && touched.length ? "border-red-500" : ""}`}
            value={values.length}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.length && touched.length && <ErrorMessage message={errors.length} />}
        </div>

        <div className="space-y-2">
          <Input
            id="width"
            name="width"
            placeholder="Width"
            type="text"
            className={`border-[#e5e7eb] ${errors.width && touched.width ? "border-red-500" : ""}`}
            value={values.width}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.width && touched.width && <ErrorMessage message={errors.width} />}
        </div>

        <div className="space-y-2">
          <Input
            id="height"
            name="height"
            placeholder="Height"
            type="text"
            className={`border-[#e5e7eb] ${errors.height && touched.height ? "border-red-500" : ""}`}
            value={values.height}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.height && touched.height && <ErrorMessage message={errors.height} />}
        </div>
      </div>
    </div>
  )
}

