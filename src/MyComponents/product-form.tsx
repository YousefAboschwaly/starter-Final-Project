"use client"

import type React from "react"

import { useContext, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, Loader2, AlertCircle, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useState } from "react"
import { useProductData } from "@/lib/product-data"
import type { IProductFormData, IProductById, IintialValues } from "@/interfaces"
import axios from "axios"

import FormHeader from "./form/form-header"
import ProductBasicInfo from "./form/product-basic-info"
import MaterialsSection from "./form/materials-section"
import DimensionsSection from "./form/dimensions-section"
import ColorsAndStockSection from "./form/colors-stock-section"
import ImageUploadSection from "./form/image-upload-section"
import { UserContext } from "@/Contexts/UserContext"
import { useNavigate } from "react-router-dom"
import ProductPreviewModal from "./product-preview"


// Alert component for success/error messages
const Alert = ({
  message,
  type,
  onClose,
}: {
  message: string
  type: "success" | "error"
  onClose: () => void
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed z-50 top-4 left-0 right-0 flex justify-center items-center"
    >
      <div className="text-center flex justify-center items-center">
        <div
          className={`px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 ${
            type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {type === "success" ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
          <span className="font-medium">{message}</span>
          <button onClick={onClose} className="ml-auto text-white hover:text-gray-200 focus:outline-none">
            ×
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// Error message component
export const ErrorMessage = ({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
    className="text-red-500 text-sm flex items-center mt-1"
  >
    <AlertCircle className="w-4 h-4 mr-1" />
    {message}
  </motion.div>
)

// Product form interface
interface ProductFormValues {
  businessType: string
  productNameEn: string
  productNameAr: string
  price: string
  baseUnit: string
  descriptionEn: string
  descriptionAr: string
  length: string
  width: string
  height: string
}

interface ProductFormProps {
  isEditMode?: boolean
  productId?: number
  initialValues?: IintialValues
  productData?: IProductById
}

export default function ProductForm({ isEditMode = false, productId, initialValues, productData }: ProductFormProps) {
  const navigate = useNavigate()
  const userContext = useContext(UserContext)
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }
  const { userToken, pathUrl } = userContext

  const { data,businessTypes ,isLoading } = useProductData()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [alert, setAlert] = useState<{
    message: string
    type: "success" | "error"
  } | null>(null)

  // State for preview modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // State for new images being added
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])

  // State for existing images from API
  const [existingImagePaths, setExistingImagePaths] = useState<
    { id: number; productId: number; imagePath: string | null }[]
  >([])

  // Track deleted image IDs to ensure they don't reappear
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([])

  // First, let's modify the colorRows state to include an id field for existing stocks
  const [colorRows, setColorRows] = useState<{ color: string; stock: string; id?: number }[]>([])
  const [materials, setMaterials] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Validation schema
  const validationSchema = Yup.object({
    businessType: Yup.string().required("Business type is required"),
    productNameEn: Yup.string().required("Product name in English is required"),
    productNameAr: Yup.string().required("Product name in Arabic is required"),
    price: Yup.string()
      .required("Price is required")
      .test("is-valid-price", "Price must be a valid number", (value) => {
        return !isNaN(Number(value))
      }),
    baseUnit: Yup.string().required("Base unit is required"),
    descriptionEn: Yup.string().required("Description in English is required"),
    descriptionAr: Yup.string().required("Description in Arabic is required"),
    length: Yup.string().test("is-valid-length", "Length must be a valid number", (value) => {
      return !value || !isNaN(Number(value))
    }),
    width: Yup.string().test("is-valid-width", "Width must be a valid number", (value) => {
      return !value || !isNaN(Number(value))
    }),
    height: Yup.string().test("is-valid-height", "Height must be a valid number", (value) => {
      return !value || !isNaN(Number(value))
    }),
  })
  const formik = useFormik<ProductFormValues>({
    initialValues: {
      businessType: "",
      productNameEn: "",
      productNameAr: "",
      price: "",
      baseUnit: "",
      descriptionEn: "",
      descriptionAr: "",
      length: "",
      width: "",
      height: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  })

  // Initialize form with initial values if provided
  // Update the useEffect that sets initial values to include stock IDs
  useEffect(() => {
    if (initialValues) {
      // Set materials if provided
      if (initialValues.materials) {
        setMaterials(initialValues.materials)
      }

      // Set color rows if provided, including stock IDs for existing stocks
      if (initialValues.colorRows && productData?.stocks) {
        const colorRowsWithIds = initialValues.colorRows.map((row: { color: string; stock: string }) => {
          // Find matching stock in productData to get the ID
          const matchingStock = productData.stocks.find(
            (stock) => data?.colors.find((c) => c.code === row.color)?.id === stock.color.id,
          )

          return {
            color: row.color,
            stock: row.stock,
            id: matchingStock?.id, // Include the ID if it exists
          }
        })

        setColorRows(colorRowsWithIds)
      } else if (initialValues.colorRows) {
        setColorRows(initialValues.colorRows)
      }

      // Set form values
      formik.setValues({
        businessType: initialValues.businessType || "",
        productNameEn: initialValues.productNameEn || "",
        productNameAr: initialValues.productNameAr || "",
        price: initialValues.price || "",
        baseUnit: initialValues.baseUnit || "",
        descriptionEn: initialValues.descriptionEn || "",
        descriptionAr: initialValues.descriptionAr || "",
        length: initialValues.length || "",
        width: initialValues.width || "",
        height: initialValues.height || "",
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues, productData, data?.colors])

  // Set existing image paths if in edit mode
  useEffect(() => {
    if (isEditMode && productData && productData.imagePaths) {
      // Reset deleted image IDs when loading a product
      setDeletedImageIds([])

      setExistingImagePaths(
        productData.imagePaths
          .filter((img) => img.imagePath) // Filter out any null image paths
          .map((img) => ({
            id: img.id,
            productId: img.productId,
            imagePath: img.imagePath,
          })),
      )
    }
  }, [isEditMode, productData])

  // Formik setup


  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formik

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const newFiles = Array.from(files)
      const newPreviewUrls: string[] = []

      newFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            newPreviewUrls.push(e.target.result as string)
            if (newPreviewUrls.length === newFiles.length) {
              setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls])
              setImageFiles((prev) => [...prev, ...newFiles])
            }
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  // Handle drag over for image upload
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  // Handle drop for image upload
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const newFiles = Array.from(files).filter((file) => file.type.startsWith("image/"))
      const newPreviewUrls: string[] = []

      newFiles.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          if (e.target?.result) {
            newPreviewUrls.push(e.target.result as string)
            if (newPreviewUrls.length === newFiles.length) {
              setImagePreviewUrls((prev) => [...prev, ...newPreviewUrls])
              setImageFiles((prev) => [...prev, ...newFiles])
            }
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  // Add color row
  // Update the addColorRow function to not include an ID for new rows
  const addColorRow = (color: string, stock: string) => {
    if (color && stock) {
      setColorRows([...colorRows, { color, stock }]) // No ID for new rows
    }
  }

  // Update color row
  // Update the updateColorRow function to preserve the ID if it exists
  const updateColorRow = (index: number, color: string, stock: string) => {
    const updatedRows = [...colorRows]
    // Preserve the id if it exists
    updatedRows[index] = {
      color,
      stock,
      ...(colorRows[index].id ? { id: colorRows[index].id } : {}),
    }
    setColorRows(updatedRows)
  }

  // Remove color row
  const removeColorRow = (index: number) => {
    setColorRows(colorRows.filter((_, i) => i !== index))
  }

  // Add material
  const addMaterial = (material: string) => {
    if (material && !materials.includes(material)) {
      setMaterials([...materials, material])
      return true
    }
    return false
  }

  // Remove material
  const removeMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index))
  }

  // Remove new image
  const removeNewImage = (index: number) => {
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index))
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Remove existing image
  const removeExistingImage = (id: number) => {
    // Add the ID to the list of deleted image IDs
    setDeletedImageIds((prev) => [...prev, id])
    // Remove from the existingImagePaths state
    setExistingImagePaths((prev) => prev.filter((img) => img.id !== id))
  }

  // Upload images to server
  const uploadImages = async (productId: number) => {
    try {
      // Skip if no new images to upload
      if (imageFiles.length === 0) {
        return
      }

      const files = imageFiles.map(() => ({
        productId: productId,
        imagePath: null,
      }))

      const { data } = await axios.post(`${pathUrl}/api/v1/product-images/all`, files, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })

      if (data.success) {
        await Promise.all(
          imageFiles.map(async (file, i) => {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("pathId", "BUSINESS_PRODUCTS")
            formData.append("id", data.data[i].id)

            const { data: Data } = await axios.post(`${pathUrl}/api/v1/file`, formData, {
              headers: {
                Authorization: `Bearer ${userToken}`,
                "Content-Type": "multipart/form-data",
              },
            })

            console.log(Data)
          }),
        )
      }

      console.log(data)
    } catch (error) {
      console.error("Error uploading images:", error)
      throw new Error("Failed to upload images")
    }
  }

  // Transform form data to match API format
  // Now update the transformFormData function to handle existing vs new stocks differently
  const transformFormData = (
    values: ProductFormValues,
    materials: string[],
    colorRows: { color: string; stock: string; id?: number }[],
    isEditMode: boolean,
    productId?: number,
  ): IProductFormData & { id?: number } => {
    // Find business type id from code
    const businessTypeId = businessTypes?.find((type) => type.code === values.businessType)?.id || 0

    // Find base unit id from code
    const baseUnitId = data?.productBaseUnits.find((unit) => unit.code === values.baseUnit)?.id || 0

    // Transform materials to required format
    const materialObjects = materials.map((materialCode) => {
      const materialId = data?.productMaterial.find((m) => m.code === materialCode)?.id || 0
      return { id: materialId }
    })

    // Transform color rows to required format, handling existing vs new stocks
    const stockObjects = colorRows.map((row) => {
      const colorId = data?.colors.find((c) => c.code === row.color)?.id || 0

      // For existing stocks (with ID), include the ID in the object
      if (row.id) {
        return {
          id: row.id,
          amount: Number.parseInt(row.stock.split(" ")[0], 10),
          color: { id: colorId },
        }
      }

      // For new stocks (without ID), use the format without ID
      return {
        amount: Number.parseInt(row.stock.split(" ")[0], 10),
        color: { id: colorId },
      }
    })

    // Create the base product data
    const productData: IProductFormData & { id?: number } = {
      nameAr: values.productNameAr,
      nameEn: values.productNameEn,
      descriptionAr: values.descriptionAr,
      descriptionEn: values.descriptionEn,
      businessType: { id: businessTypeId },
      price: Number.parseFloat(values.price),
      length: values.length ? Number.parseFloat(values.length) : undefined,
      width: values.width ? Number.parseFloat(values.width) : undefined,
      height: values.height ? Number.parseFloat(values.height) : undefined,
      baseUnit: { id: baseUnitId },
      materials: materialObjects,
      stocks: stockObjects,
      imagePaths: existingImagePaths,
    }

    // Add id to the product data if in edit mode
    if (isEditMode && productId) {
      productData.id = productId
    }

    return productData
  }

  // Format existing image paths for display
  const getFormattedExistingImages = () => {
    return existingImagePaths.map((img) => ({
      id: img.id,
      url: img.imagePath
        ? img.imagePath.startsWith("./")
          ? `${pathUrl}${img.imagePath.substring(1)}`
          : img.imagePath
        : "/placeholder.svg",
    }))
  }

  // Handle form submission
  async function handleSubmit(values: ProductFormValues) {
    // Validate additional requirements
    if (imagePreviewUrls.length === 0 && existingImagePaths.length === 0) {
      setAlert({
        message: "Please upload at least one product image",
        type: "error",
      })
      setTimeout(() => setAlert(null), 5000)
      return
    }


    setIsSubmitting(true)

    try {
      // Step 1: Transform form data to match API format, including ID for edit mode
      const productData = transformFormData(values, materials, colorRows, isEditMode, productId)

      console.log("Sending product data to API:", productData)

      // Step 2: Send product data to API
      let response

      if (isEditMode && productId) {
        // Use PUT for updates
        response = await axios.put(`${pathUrl}/api/v1/products`, productData, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        })
      } else {
        // Use POST for new products
        response = await axios.post(`${pathUrl}/api/v1/products`, productData, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        })
      }

      const { data } = response

      let product_id = isEditMode ? productId : null
      if (data.success) {
        product_id = data.data.id
      }

      // Step 3: Upload images if there are new ones
      if (imageFiles.length > 0) {
        await uploadImages(product_id!)
      }

      console.log(data, product_id)

      // Show success message
      setAlert({
        message: isEditMode ? "Product updated successfully!" : "Product added successfully!",
        type: "success",
      })

      setTimeout(() => {
        setAlert(null)
        // Redirect to products page
        navigate("/productlist")
      }, 2000)
    } catch (error) {
      console.error("Error submitting form:", error)
      setAlert({
        message: isEditMode
          ? "Failed to update product. Please try again."
          : "Failed to add product. Please try again.",
        type: "error",
      })
      setTimeout(() => setAlert(null), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  // If the product is reloaded, make sure we don't show deleted images
  useEffect(() => {
    if (productData && deletedImageIds.length > 0) {
      setExistingImagePaths((prev) => prev.filter((img) => !deletedImageIds.includes(img.id)))
    }
  }, [productData, deletedImageIds])

  // Handle preview button click
  const handlePreviewClick = () => {
    setIsPreviewOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading product data...</span>
      </div>
    )
  }

  return (
    <>
      <AnimatePresence>
        {alert && <Alert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      </AnimatePresence>

      {/* Product Preview Modal */}
      <ProductPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        formData={values}
        materials={materials}
        colorRows={colorRows}
        newImageFiles={imagePreviewUrls}
        existingImageFiles={getFormattedExistingImages()}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-sm overflow-hidden"
      >
        <div className="p-6 sm:p-8">
          <FormHeader isEditMode={isEditMode} />

          <motion.form
            onSubmit={formik.handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <div className=" border rounded-lg p-6">
              <div className="space-y-4">
                <ProductBasicInfo
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                />

                <MaterialsSection materials={materials} addMaterial={addMaterial} removeMaterial={removeMaterial} />

                <DimensionsSection
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                />

                <ColorsAndStockSection
                  colorRows={colorRows}
                  addColorRow={addColorRow}
                  updateColorRow={updateColorRow}
                  removeColorRow={removeColorRow}
                />

                <ImageUploadSection
                  newImageFiles={imagePreviewUrls}
                  existingImageFiles={getFormattedExistingImages()}
                  fileInputRef={fileInputRef}
                  handleImageUpload={handleImageUpload}
                  handleDragOver={handleDragOver}
                  handleDrop={handleDrop}
                  removeNewImage={removeNewImage}
                  removeExistingImage={removeExistingImage}
                  isEditMode={isEditMode}
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" className="border-[#e5e7eb]" onClick={handlePreviewClick}>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button type="submit" className="bg-[#4f5d95] hover:bg-[#3f4d85] text-white px-8" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditMode ? "Updating..." : "Submitting..."}
                  </>
                ) : isEditMode ? (
                  "Update Product"
                ) : (
                  "Submit"
                )}
              </Button>
            </div>
          </motion.form>
        </div>
      </motion.div>
    </>
  )
}

