"use client"

import { useContext, useEffect, useState } from "react"
import MidSect from "./MidSection/MidSect"
import ProductsSection from "./ProductsSection/ProductsSection"
import TopSect from "./TopSection/TopSect"
import { AnimatePresence } from "framer-motion"
import LoginAlert from "../Home/loginAlert"
import { UserContext } from "@/Contexts/UserContext"
import { Toaster } from "react-hot-toast"

// API Response interfaces - Updated to match your actual API response
export interface ApiProduct {
  id: number
  name: string // Changed from 'title' to 'name'
  rate: number // Changed from 'rating' to 'rate'
  countRates: number // Changed from 'reviews' to 'countRates'
  price: number
  numberOfSales: number
  bestSeller: boolean // Changed from 'sellingFast' to 'bestSeller'
  productRankBySales: number // This is a number, not string
  categoryName: string
  images: string[]
  // Optional fields that might not be in API response
  originalPrice?: number | null
  discount?: string | null
  express?: boolean
  recentlySold?: string
}

export interface ProductsData {
  highestRated: ApiProduct[]
  topBestSeller: ApiProduct[]
  recommendedForYou: ApiProduct[]
}

export interface BusinessType {
  id: number
  code: string
  name: string
}

export interface BusinessConfigResponse {
  businessTypes: BusinessType[]
}

export default function LandingPage() {
  const userContext = useContext(UserContext)
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }
  const { pathUrl, userId, userToken } = userContext
  const [alert, setAlert] = useState<{
    message: string
    type: "success" | "error"
  } | null>(null)
  const [productsData, setProductsData] = useState<ProductsData>({
    highestRated: [],
    topBestSeller: [],
    recommendedForYou: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([])
  console.log(userToken)
  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Try to fetch business config, but provide fallback if it fails
        let businessTypesData: BusinessType[] = []
        try {
          const businessConfigRes = await fetch(`${pathUrl}/api/v1/business-config`, {
            headers: {
              "Accept-language": "en",
              Authorization: `Bearer ${userToken}`,
            },
          })

          if (businessConfigRes.ok) {
            const businessConfig: BusinessConfigResponse = await businessConfigRes.json()
            businessTypesData = businessConfig.businessTypes || []
          }
        } catch (businessConfigError) {
          console.warn("Business config API failed, using fallback data:", businessConfigError)
        }

        // If API failed or returned empty data, use fallback categories
        if (businessTypesData.length === 0) {
          businessTypesData = [
            { id: 1, code: "FURNITURE", name: "furniture" },
            { id: 2, code: "KITCHENS_DRESSINGS", name: "kitchens and dressing" },
            { id: 3, code: "ELECTRICAL_TOOLS", name: "electrical tools" },
            { id: 4, code: "FURNISHINGS", name: "Furnishings" },
            { id: 5, code: "PAINT_MATERIALS", name: "paint materials" },
          ]
        }

        setBusinessTypes(businessTypesData)

        // Continue with product API calls...
        const [highestRatedRes, topBestSellerRes, recommendedRes] = await Promise.all([
          fetch(`${pathUrl}/api/v1/products/highest-rated`, {
            headers: {
              "Accept-language": "en",
              Authorization: `Bearer ${userToken}`,
            },
          }),
          fetch(`${pathUrl}/api/v1/products/top-best-seller`, {
            headers: {
              "Accept-language": "en",
              Authorization: `Bearer ${userToken}`,
            },
          }),
          fetch(`${pathUrl}/api/v1/products/recommended-for-you?userId=${userId}`, {
            headers: {
              "Accept-language": "en",
              Authorization: `Bearer ${userToken}`,
            },
          }),
        ])

        // Check if all requests were successful
        if (!highestRatedRes.ok || !topBestSellerRes.ok || !recommendedRes.ok) {
          throw new Error("Failed to fetch products data")
        }

        // Parse JSON responses
        const [highestRated, topBestSeller, recommendedForYou] = await Promise.all([
          highestRatedRes.json(),
          topBestSellerRes.json(),
          recommendedRes.json(),
        ])

        console.log("API Responses:", { highestRated, topBestSeller, recommendedForYou })

        setProductsData({
          highestRated: highestRated.data || highestRated,
          topBestSeller: topBestSeller.data || topBestSeller,
          recommendedForYou: recommendedForYou.data || recommendedForYou,
        })
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch data")

        // Even if products fail, still set fallback business types
        if (businessTypes.length === 0) {
          setBusinessTypes([
            { id: 1, code: "FURNITURE", name: "furniture" },
            { id: 2, code: "KITCHENS_DRESSINGS", name: "kitchens and dressing" },
            { id: 3, code: "ELECTRICAL_TOOLS", name: "electrical tools" },
            { id: 4, code: "FURNISHINGS", name: "Furnishings" },
            { id: 5, code: "PAINT_MATERIALS", name: "paint materials" },
          ])
        }
      } finally {
        setLoading(false)
      }
    }

    if (pathUrl && userToken) {
      fetchData()
    }
  }, [businessTypes.length, pathUrl, userId, userToken])

  // Handle login alert
  useEffect(() => {
    if (localStorage.getItem("isLoggedIn")) {
      setAlert({
        message: "Login Successful. Welcome back to Home4U!",
        type: "success",
      })
      setTimeout(() => {
        setAlert(null)
        localStorage.removeItem("isLoggedIn")
      }, 3000)
    }
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading products...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <TopSect businessTypes={businessTypes}/>
      <MidSect  />
      <ProductsSection productsData={productsData} />
            <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#333",
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "12px 16px",
          },
          success: {
            style: {
              background: "#D1FAE5",
              border: "1px solid #10B981",
              color: "#065F46",
            },
            iconTheme: {
              primary: "#10B981",
              secondary: "#D1FAE5",
            },
          },
          error: {
            style: {
              background: "#FEE2E2",
              border: "1px solid #EF4444",
              color: "#7F1D1D",
            },
            iconTheme: {
              primary: "#EF4444",
              secondary: "#FEE2E2",
            },
            duration: 5000,
          },
        }}
      />
      <AnimatePresence>
        {alert && <LoginAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      </AnimatePresence>
    </main>
  )
}
