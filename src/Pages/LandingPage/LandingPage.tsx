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
    window.scrollTo({ top: 0, behavior: "smooth" }) // or "auto"
  }, [])

  // Modified API fetching - works with or without authentication
  useEffect(() => {
    const fetchAllData = async () => {
      // Only require pathUrl, userToken is optional
      if (!pathUrl) {
        console.warn("pathUrl is not available, cannot fetch data")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        console.log("Fetching data with:", { pathUrl, userToken: !!userToken, userId })

        // Create headers - include Authorization only if userToken exists
        const createHeaders = () => {
          const headers: Record<string, string> = {
            "Accept-language": "en",
            "Content-Type": "application/json",
          }

          if (userToken) {
            headers.Authorization = `Bearer ${userToken}`
          }

          return headers
        }

        const headers = createHeaders()

        // Fetch all 6 APIs together
        const [
          businessConfigRes,
          highestRatedRes,
          topBestSellerRes,
          recommendedRes,
          topEngineersRes,
          topTechnicalWorkersRes,
        ] = await Promise.allSettled([
          fetch(`${pathUrl}/api/v1/business-config`, {
            headers,
          }),
          fetch(`${pathUrl}/api/v1/products/highest-rated`, {
            headers,
          }),
          fetch(`${pathUrl}/api/v1/products/top-best-seller`, {
            headers,
          }),
          fetch(`${pathUrl}/api/v1/products/recommended-for-you${userId ? `?userId=${userId}` : ""}`, {
            headers,
          }),
          fetch(`${pathUrl}/api/v1/engineers/top-engineers`, {
            headers,
          }),
          fetch(`${pathUrl}/api/v1/technical-workers/top-workers`, {
            headers,
          }),
        ])

        // Handle business config
        let businessTypesData: BusinessType[] = []
        let businessTypeCategoriesData: BusinessTypeCategory[] = []

        if (businessConfigRes.status === "fulfilled") {
          if (businessConfigRes.value.ok) {
            try {
              const businessConfig: BusinessConfigResponse = await businessConfigRes.value.json()
              console.log("Business config response:", businessConfig)
              businessTypesData = businessConfig.data?.businessTypes || []
              businessTypeCategoriesData = businessConfig.data?.businessTypeCategories || []

              console.log("Business config parsed:", {
                businessTypes: businessTypesData.length,
                businessTypeCategories: businessTypeCategoriesData.length,
              })
            } catch (e) {
              console.warn("Failed to parse business config:", e)
            }
          } else {
            console.warn(
              "Business config API failed:",
              businessConfigRes.value.status,
              businessConfigRes.value.statusText,
            )
          }
        } else {
          console.warn("Business config API rejected:", businessConfigRes.reason)
        }

        // Use fallback if no business types
        if (businessTypesData.length === 0) {
          console.log("Using fallback business types")
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

        if (highestRatedRes.status === "fulfilled") {
          if (highestRatedRes.value.ok) {
            try {
              const data = await highestRatedRes.value.json()
              highestRated = data.data || data || []
              console.log("Highest rated products:", highestRated.length)
            } catch (e) {
              console.warn("Failed to parse highest rated:", e)
            }
          } else {
            console.warn("Highest rated API failed:", highestRatedRes.value.status, highestRatedRes.value.statusText)
          }
        } else {
          console.warn("Highest rated API rejected:", highestRatedRes.reason)
        }

        if (topBestSellerRes.status === "fulfilled") {
          if (topBestSellerRes.value.ok) {
            try {
              const data = await topBestSellerRes.value.json()
              topBestSeller = data.data || data || []
              console.log("Top best seller products:", topBestSeller.length)
            } catch (e) {
              console.warn("Failed to parse top best seller:", e)
            }
          } else {
            console.warn(
              "Top best seller API failed:",
              topBestSellerRes.value.status,
              topBestSellerRes.value.statusText,
            )
          }
        } else {
          console.warn("Top best seller API rejected:", topBestSellerRes.reason)
        }

        if (recommendedRes.status === "fulfilled") {
          if (recommendedRes.value.ok) {
            try {
              const data = await recommendedRes.value.json()
              console.log("Recommended API response:", data)
              recommendedForYou = data.data || data || []
              console.log("Recommended products:", recommendedForYou.length)
            } catch (e) {
              console.warn("Failed to parse recommended:", e)
            }
          } else {
            console.warn("Recommended API failed:", recommendedRes.value.status, recommendedRes.value.statusText)
          }
        } else {
          console.warn("Recommended API rejected:", recommendedRes.reason)
        }

        // Handle top engineers data
        let engineersData: Engineer[] = []
        if (topEngineersRes.status === "fulfilled") {
          if (topEngineersRes.value.ok) {
            try {
              const data = await topEngineersRes.value.json()
              console.log("Top Engineers API response:", data)
              engineersData = data.data || data || []
              console.log("Top engineers:", engineersData.length)
            } catch (e) {
              console.warn("Failed to parse top engineers:", e)
            }
          } else {
            console.warn("Top engineers API failed:", topEngineersRes.value.status, topEngineersRes.value.statusText)
          }
        } else {
          console.warn("Top engineers API rejected:", topEngineersRes.reason)
        }

        // Handle top technical workers data
        let technicalWorkersData: TechnicalWorker[] = []
        if (topTechnicalWorkersRes.status === "fulfilled") {
          if (topTechnicalWorkersRes.value.ok) {
            try {
              const data = await topTechnicalWorkersRes.value.json()
              console.log("Top Technical Workers API response:", data)
              technicalWorkersData = data.data || data || []
              console.log("Top technical workers:", technicalWorkersData.length)
            } catch (e) {
              console.warn("Failed to parse top technical workers:", e)
            }
          } else {
            console.warn(
              "Top technical workers API failed:",
              topTechnicalWorkersRes.value.status,
              topTechnicalWorkersRes.value.statusText,
            )
          }
        } else {
          console.warn("Top technical workers API rejected:", topTechnicalWorkersRes.reason)
        }

        setProductsData({
          highestRated,
          topBestSeller,
          recommendedForYou,
        })

        setTopEngineers(engineersData)
        setTopTechnicalWorkers(technicalWorkersData)

        console.log("All APIs processed:", {
          businessTypes: businessTypesData.length,
          businessTypeCategories: businessTypeCategoriesData.length,
          highestRated: highestRated.length,
          topBestSeller: topBestSeller.length,
          recommendedForYou: recommendedForYou.length,
          topEngineers: engineersData.length,
          topTechnicalWorkers: technicalWorkersData.length,
        })

        // Show success message if we got some data
        const totalDataFetched =
          businessTypesData.length +
          highestRated.length +
          topBestSeller.length +
          recommendedForYou.length +
          engineersData.length +
          technicalWorkersData.length

        if (totalDataFetched > 0) {
          console.log("Successfully loaded landing page data")
        } else {
          console.warn("No data was loaded from any API")
        }
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
  }, [pathUrl, userId, userToken]) // Keep all dependencies but don't require userToken

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
          <p className="mt-4 text-lg text-gray-600">Loading Home4U...</p>
          <p className="mt-2 text-sm text-gray-500">Fetching products, engineers, and services...</p>
        </div>
      </main>
    )
  }

  if (error && businessTypes.length === 0) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Unable to Load Content</h2>
          <p className="text-red-600 text-lg mb-4">Error: {error}</p>
          <p className="text-gray-600 mb-6">
            We're having trouble connecting to our services. Please check your internet connection and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Retry Loading
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
