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

export interface BusinessTypeCategory {
  id: number
  code: string
  name: string
  businessType: {
    id: number
    code: string
    name: string
  }
}

export interface BusinessConfigResponse {
  data: {
    businessTypes: BusinessType[]
    businessTypeCategories: BusinessTypeCategory[]
  }
}

// Engineer interfaces
export interface EngineerType {
  id: number
  code: string
  name: string
  nameAr: string
  nameEn: string
}

export interface EngineerService {
  id: number
  code: string
  name: string
  nameAr: string
  nameEn: string
}

export interface UserType {
  id: number
  code: string
  name: string
}

export interface Governorate {
  id: number
  code: string
  name: string
}

export interface City {
  id: number
  code: string
  name: string
}

export interface EngineerUser {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  personalPhoto: string | null
  coverPhoto: string | null
  userType: UserType
  governorate: Governorate
  city: City
  engineer: Engineer | null
  technicalWorker: TechnicalWorker | null
  engineeringOffice: unknown
  enabled: boolean
  business: unknown
}

export interface Engineer {
  id: number
  statusCode: number
  createdDate: string
  modifiedDate: string
  user: EngineerUser
  type: EngineerType
  yearsOfExperience: number
  engineerServ: EngineerService[]
  bio: string
  facebookLink: string | null
  linkedinLink: string | null
  behanceLink: string | null
  averageRate: number
}

// Add this interface after the Engineer interface
export interface TechnicalWorker {
  id: number
  statusCode: number
  createdDate: string
  modifiedDate: string
  user: EngineerUser // Reuse the same user interface
  type: {
    id: number
    code: string
    name: string
    nameAr: string
    nameEn: string
  }
  yearsOfExperience: number
  workerServs: {
    id: number
    code: string
    name: string
    nameAr: string
    nameEn: string
  }[]
  bio: string
  facebookLink: string | null
  linkedinLink: string | null
  behanceLink: string | null
  averageRate: number
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
  const [businessTypeCategories, setBusinessTypeCategories] = useState<BusinessTypeCategory[]>([])
  const [topEngineers, setTopEngineers] = useState<Engineer[]>([])
  const [topTechnicalWorkers, setTopTechnicalWorkers] = useState<TechnicalWorker[]>([])
  console.log(userToken)

useEffect(() => {
  window.scrollTo({ top: 0, behavior: "smooth" }); // or "auto"
}, []);

  // Simplified API fetching - all 5 APIs together
  useEffect(() => {
    const fetchAllData = async () => {
      if (!pathUrl || !userToken) return

      try {
        setLoading(true)
        setError(null)

        // Fetch all 5 APIs together
        const [
          businessConfigRes,
          highestRatedRes,
          topBestSellerRes,
          recommendedRes,
          topEngineersRes,
          topTechnicalWorkersRes,
        ] = await Promise.allSettled([
          fetch(`${pathUrl}/api/v1/business-config`, {
            headers: {
              "Accept-language": "en",
              Authorization: `Bearer ${userToken}`,
            },
          }),
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
          fetch(`${pathUrl}/api/v1/products/recommended-for-you?userId=${userId || ""}`, {
            headers: {
              "Accept-language": "en",
              Authorization: `Bearer ${userToken}`,
            },
          }),
          fetch(`${pathUrl}/api/v1/engineers/top-engineers`, {
            headers: {
              "Accept-language": "en",
              Authorization: `Bearer ${userToken}`,
            },
          }),
          fetch(`${pathUrl}/api/v1/technical-workers/top-workers`, {
            headers: {
              "Accept-language": "en",
              Authorization: `Bearer ${userToken}`,
            },
          }),
        ])

        // Handle business config
        let businessTypesData: BusinessType[] = []
        let businessTypeCategoriesData: BusinessTypeCategory[] = []

        if (businessConfigRes.status === "fulfilled" && businessConfigRes.value.ok) {
          try {
            const businessConfig: BusinessConfigResponse = await businessConfigRes.value.json()
            console.log("Business config response:", businessConfig)
            businessTypesData = businessConfig.data.businessTypes || []
            businessTypeCategoriesData = businessConfig.data.businessTypeCategories || []

            console.log("Business config response:", {
              businessTypes: businessTypesData,
              businessTypeCategories: businessTypeCategoriesData,
            })
          } catch (e) {
            console.warn("Failed to parse business config:", e)
          }
        }

        // Use fallback if no business types
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
        setBusinessTypeCategories(businessTypeCategoriesData)

        // Handle products data
        let highestRated: ApiProduct[] = []
        let topBestSeller: ApiProduct[] = []
        let recommendedForYou: ApiProduct[] = []

        if (highestRatedRes.status === "fulfilled" && highestRatedRes.value.ok) {
          try {
            const data = await highestRatedRes.value.json()
            highestRated = data.data || data || []
          } catch (e) {
            console.warn("Failed to parse highest rated:", e)
          }
        }

        if (topBestSellerRes.status === "fulfilled" && topBestSellerRes.value.ok) {
          try {
            const data = await topBestSellerRes.value.json()
            topBestSeller = data.data || data || []
          } catch (e) {
            console.warn("Failed to parse top best seller:", e)
          }
        }

        if (recommendedRes.status === "fulfilled" && recommendedRes.value.ok) {
          try {
            const data = await recommendedRes.value.json()
            console.log("Recommended:", data)
            recommendedForYou = data.data || data || []
          } catch (e) {
            console.warn("Failed to parse recommended:", e)
          }
        }

        // Handle top engineers data
        let engineersData: Engineer[] = []
        if (topEngineersRes.status === "fulfilled" && topEngineersRes.value.ok) {
          try {
            const data = await topEngineersRes.value.json()
            console.log("Top Engineers:", data)
            engineersData = data.data || data || []
          } catch (e) {
            console.warn("Failed to parse top engineers:", e)
          }
        }

        let technicalWorkersData: TechnicalWorker[] = []
        if (topTechnicalWorkersRes.status === "fulfilled" && topTechnicalWorkersRes.value.ok) {
          try {
            const data = await topTechnicalWorkersRes.value.json()
            console.log("Top Technical Workers:", data)
            technicalWorkersData = data.data || data || []
          } catch (e) {
            console.warn("Failed to parse top technical workers:", e)
          }
        }

        setProductsData({
          highestRated,
          topBestSeller,
          recommendedForYou,
        })

        setTopEngineers(engineersData)
        setTopTechnicalWorkers(technicalWorkersData)

        console.log("All APIs fetched:", {
          businessTypes: businessTypesData.length,
          businessTypeCategories: businessTypeCategoriesData.length,
          highestRated: highestRated.length,
          topBestSeller: topBestSeller.length,
          recommendedForYou: recommendedForYou.length,
          topEngineers: engineersData.length,
          topTechnicalWorkers: technicalWorkersData.length,
        })
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch data")

        // Set fallback business types even on error
        setBusinessTypes([
          { id: 1, code: "FURNITURE", name: "furniture" },
          { id: 2, code: "KITCHENS_DRESSINGS", name: "kitchens and dressing" },
          { id: 3, code: "ELECTRICAL_TOOLS", name: "electrical tools" },
          { id: 4, code: "FURNISHINGS", name: "Furnishings" },
          { id: 5, code: "PAINT_MATERIALS", name: "paint materials" },
        ])
        setBusinessTypeCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [pathUrl, userId, userToken])

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
      <TopSect businessTypes={businessTypes} businessTypeCategories={businessTypeCategories} />
      <MidSect />
      <ProductsSection
        productsData={productsData}
        topEngineers={topEngineers}
        topTechnicalWorkers={topTechnicalWorkers}
      />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#333",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
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
