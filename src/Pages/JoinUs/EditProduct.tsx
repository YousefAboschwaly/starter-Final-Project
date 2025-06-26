"use client"

import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Loader2 } from "lucide-react"

import { useContext, useEffect, useState } from "react"
import type { IintialValues, IProductById } from "@/interfaces"
import { useNavigate, useParams } from "react-router-dom"
import { UserContext } from "@/Contexts/UserContext"
import ProductForm from "@/MyComponents/product-form"

export default function EditProduct() {
  const navigate = useNavigate()
  const { productId } = useParams()
  const [initialValues, setInitialValues] = useState<IintialValues | null>(null)

  const userContext = useContext(UserContext)
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }
  const { pathUrl, userToken } = userContext

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getProductById", productId],
    queryFn: () =>
      axios.get(`${pathUrl}/api/v1/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
          "Accept-Language": "en",
        },
      }),
    enabled: !!productId && !!userToken,
  })

  const product = response?.data?.data as IProductById | undefined

  useEffect(() => {
    if (product && product.businessType && product.baseUnit) {
      // Transform API data to form initial values
      const formattedValues = {
        // Revert the businessType and businessTypeCategory back to using codes as in the original
        businessType: product.businessType.code,
        businessTypeCategory: product.businessTypeCategory?.code ,

        productNameEn: product.nameEn,
        productNameAr: product.nameAr,
        price: product.price.toString(),
        baseUnit: product.baseUnit.code, // Keep code for base unit as it seems to work with codes
        descriptionEn: product.descriptionEn,
        descriptionAr: product.descriptionAr,
        length: product.length.toString(),
        width: product.width.toString(),
        height: product.height.toString(),

        // Transform materials to array of codes
        materials: product.materials.map((material) => material.code),

        // Transform colors and stock
        colorRows: product.stocks.map((stock) => ({
          color: stock.color.code,
          stock: stock.amount.toString(),
          id: stock.id, // Include the stock ID for editing
        })),

        // Transform image paths to proper URLs
        imageFiles: product.imagePaths
          .filter((img) => img.imagePath)
          .map((img) => {
            const path = img.imagePath!
            if (path.startsWith("./")) {
              return `${pathUrl}${path.substring(1)}`
            }
            return path
          }),
      }

      setInitialValues(formattedValues)
      
    }
  }, [product, pathUrl])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
          <p className="text-lg font-medium text-gray-700">Loading product data...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Product</h2>
          <p className="text-gray-600 mb-6">
            Unable to load product data. The product may not exist or you may not have permission to edit it.
          </p>
          <button
            onClick={() => navigate("/productlist")}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  console.log("initialValues", initialValues)
  console.log("product", product)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {initialValues ? (
          <ProductForm
            isEditMode={true}
            productId={Number(productId)}
            initialValues={initialValues}
            productData={product}
          />
        ) : (
          <div className="p-8 flex justify-center">
            <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
          </div>
        )}
      </div>
    </div>
  )
}
