"use client"

import type React from "react"

import { ChevronDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ErrorMessage } from "../product-form"
import type { FormikErrors, FormikTouched } from "formik"
import { Label } from "@/components/ui/label"
import { useProductData } from "@/lib/product-data"
import type { IBusinessType } from "@/interfaces"

interface ProductBasicInfoProps {
  values: {
    businessType: string
    businessTypeCategory: string
    productNameEn: string
    productNameAr: string
    price: string
    baseUnit: string
    descriptionEn: string
    descriptionAr: string
  }
  errors: FormikErrors<ProductBasicInfoProps["values"]>
  touched: FormikTouched<ProductBasicInfoProps["values"]>
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  setFieldValue: (field: string, value: string | number, shouldValidate?: boolean) => void
}

export default function ProductBasicInfo({
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  setFieldValue,
}: ProductBasicInfoProps) {
  const { data, businessTypes } = useProductData()

  // Filter categories based on selected business type
  const getFilteredCategories = () => {
    if (!values.businessType || !data?.businessTypeCategories) {
      return []
    }

    return data.businessTypeCategories.filter((category) => category.businessType?.code === values.businessType)
  }

  // Handle business type change - reset category when business type changes
  const handleBusinessTypeChange = (value: string) => {
    setFieldValue("businessType", value)
    setFieldValue("businessTypeCategory", "") // Always reset category when business type changes
  }

  // Debug logging
  console.log("Current values:", values)
  console.log("Available categories:", data?.businessTypeCategories)
  console.log("Filtered categories:", getFilteredCategories())

  return (
    <>
      {/* Business Type Select */}
      <div className="space-y-2">
        <Label htmlFor="businessType">Business Type</Label>
        <div className="relative">
          <Select value={values.businessType} onValueChange={handleBusinessTypeChange}>
            <SelectTrigger
              id="businessType"
              name="businessType"
              className={`w-full border-[#e5e7eb] ${errors.businessType && touched.businessType ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="Select business type" />
            </SelectTrigger>
            <SelectContent>
              {businessTypes?.map((type: IBusinessType) => (
                <SelectItem key={type.id} value={type.code}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        </div>
        {errors.businessType && touched.businessType && <ErrorMessage message={errors.businessType} />}
      </div>

      {/* Business Type Category Select */}
      <div className="space-y-2">
        <Label htmlFor="businessTypeCategory">Business Type Category</Label>
        <div className="relative">
          <Select
            value={values.businessTypeCategory}
            onValueChange={(value) => setFieldValue("businessTypeCategory", value)}
            disabled={!values.businessType}
            key={`${values.businessType}-${values.businessTypeCategory}`} // Force re-render when values change
          >
            <SelectTrigger
              id="businessTypeCategory"
              name="businessTypeCategory"
              className={`w-full border-[#e5e7eb] ${errors.businessTypeCategory && touched.businessTypeCategory ? "border-red-500" : ""} ${!values.businessType ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <SelectValue placeholder={values.businessType ? "Select category" : "Select business type first"} />
            </SelectTrigger>
            <SelectContent>
              {getFilteredCategories().map((category) => (
                <SelectItem key={category.id} value={category.code}>
                  {category.name || category.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDown className="h-4 w-4 opacity-50" />
          </div>
        </div>
        {errors.businessTypeCategory && touched.businessTypeCategory && (
          <ErrorMessage message={errors.businessTypeCategory} />
        )}

        {/* Debug info */}
        {values.businessType && (
          <div className="text-xs text-gray-500">
            Business Type: {values.businessType}, Category: {values.businessTypeCategory}, Available Categories:{" "}
            {getFilteredCategories().length}
          </div>
        )}
      </div>

      {/* Product Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="productNameEn">Product Name (English)</Label>
          <Input
            id="productNameEn"
            name="productNameEn"
            placeholder="Product Name En"
            className={`border-[#e5e7eb] ${errors.productNameEn && touched.productNameEn ? "border-red-500" : ""}`}
            value={values.productNameEn}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.productNameEn && touched.productNameEn && <ErrorMessage message={errors.productNameEn} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="productNameAr">Product Name (Arabic)</Label>
          <Input
            id="productNameAr"
            name="productNameAr"
            placeholder="Product Name Ar"
            dir="rtl"
            className={`border-[#e5e7eb] ${errors.productNameAr && touched.productNameAr ? "border-red-500" : ""}`}
            value={values.productNameAr}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.productNameAr && touched.productNameAr && <ErrorMessage message={errors.productNameAr} />}
        </div>
      </div>

      {/* Price and Base Unit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="text"
            placeholder="Price( د)"
            className={`border-[#e5e7eb] ${errors.price && touched.price ? "border-red-500" : ""}`}
            value={values.price}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.price && touched.price && <ErrorMessage message={errors.price} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="baseUnit">Base Unit</Label>
          <div className="relative">
            <Select value={values.baseUnit} onValueChange={(value) => setFieldValue("baseUnit", value)}>
              <SelectTrigger
                id="baseUnit"
                name="baseUnit"
                className={`w-full border-[#e5e7eb] ${errors.baseUnit && touched.baseUnit ? "border-red-500" : ""}`}
              >
                <SelectValue placeholder="Base unit" />
              </SelectTrigger>
              <SelectContent>
                {data?.productBaseUnits.map((unit) => (
                  <SelectItem key={unit.id} value={unit.code}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDown className="h-4 w-4 opacity-50" />
            </div>
          </div>
          {errors.baseUnit && touched.baseUnit && <ErrorMessage message={errors.baseUnit} />}
        </div>
      </div>

      {/* Description Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="descriptionEn">Description (English)</Label>
          <Textarea
            id="descriptionEn"
            name="descriptionEn"
            placeholder="Product Description En"
            className={`min-h-[100px] border-[#e5e7eb] ${errors.descriptionEn && touched.descriptionEn ? "border-red-500" : ""}`}
            value={values.descriptionEn}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.descriptionEn && touched.descriptionEn && <ErrorMessage message={errors.descriptionEn} />}
        </div>

        <div className="space-y-2">
          <Label htmlFor="descriptionAr">Description (Arabic)</Label>
          <Textarea
            id="descriptionAr"
            name="descriptionAr"
            placeholder="Product Description Ar"
            dir="rtl"
            className={`min-h-[100px] border-[#e5e7eb] ${errors.descriptionAr && touched.descriptionAr ? "border-red-500" : ""}`}
            value={values.descriptionAr}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {errors.descriptionAr && touched.descriptionAr && <ErrorMessage message={errors.descriptionAr} />}
        </div>
      </div>
    </>
  )
}
