"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, Search, SlidersHorizontal, AlertCircle, Info } from "lucide-react"

import { fetchProducts, deleteProduct, type FilterCriteria } from "@/api/product-service"
import { useDebounce } from "@/hooks/use-debounce"
import type { IProduct, IProductsResponse } from "@/interfaces"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import FilterPanel from "@/MyComponents/product/FilterPanel"
import ProductCard from "@/MyComponents/product/ProductCard"
import Pagination from "@/MyComponents/product/Pagination"
import Sidebar from "@/MyComponents/product/Sidebar"
import { useProductData } from "@/lib/product-data"


interface FilterState {
  minPrice: number | null
  maxPrice: number | null
  colorsIds: number[] | null
  businessTypeIds: number[] | null
}

export default function ProductList() {
const {data,businessTypes} = useProductData()
const colors = data?.colors || []
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(0) // API uses 0-based indexing
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearchQuery = useDebounce(searchQuery, 500)

  const [filters, setFilters] = useState<FilterState>({
    minPrice: null,
    maxPrice: null,
    colorsIds: null,
    businessTypeIds: null,
  })

  const [products, setProducts] = useState<IProduct[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalProducts, setTotalProducts] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUsingMockData, setIsUsingMockData] = useState(false)
  // Load products when filters or page changes
  const loadProducts = useCallback(async (page: number, filterState: FilterState, search: string) => {
    console.log("filterState",filterState)
    try {
      setIsLoading(true)
      setError(null)

      const filterCriteria: FilterCriteria = {
        minPrice: filterState.minPrice,
        maxPrice: filterState.maxPrice,
        colorsIds: filterState.colorsIds,
        businessTypeIds: filterState.businessTypeIds,
        name: search, // Pass the search query as the name parameter
      }

      const response: IProductsResponse = await fetchProducts(page, 9, filterCriteria, search)
      setProducts(response?.data.content)
      setTotalPages(response?.data.totalPages || 1) // Ensure at least 1 page
      setCurrentPage(response?.data.pageable.pageNumber) // In case the API adjusts the page number
      setTotalProducts(response?.data.totalElements)
      setIsUsingMockData(false) // We're using real data now
    } catch (err) {
      console.error("Error loading products:", err)
      setError("Failed to load products. Please try again.")
      setIsUsingMockData(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial load and when search changes
  useEffect(() => {
    loadProducts(0, filters, debouncedSearchQuery)
  }, [debouncedSearchQuery, loadProducts, filters])

  // Handle filter changes
  useEffect(() => {
    // Reset to first page when filters change
    loadProducts(0, filters, debouncedSearchQuery)
  }, [filters, loadProducts, debouncedSearchQuery])

  // Handle page changes
  const handlePageChange = (page: number) => {
    // API uses 0-based indexing, but our UI uses 1-based
    loadProducts(page - 1, filters, debouncedSearchQuery)
  }

  const handleDeleteProduct = async (id: number) => {
    try {
      const success = await deleteProduct(id)
      if (success) {
        // Refresh the current page
        loadProducts(currentPage, filters, debouncedSearchQuery)
      } else {
        setError("Failed to delete product. Please try again.")
      }
    } catch (err) {
      setError("An error occurred while deleting the product.")
      console.error(err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} totalProducts={totalProducts} />

      <div className={`transition-all duration-300 ${isSidebarOpen ? "ml-[280px]" : "ml-[80px]"}`}>
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div className="flex-1 max-w-xl">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
              >
                <SlidersHorizontal className="w-6 h-6" />
                {(filters.minPrice !== null ||
                  filters.maxPrice !== null ||
                  filters.colorsIds !== null ||
                  filters.businessTypeIds !== null) && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full" />
                )}
              </button>
            </div>
          </div>
        </header>

        <AnimatePresence>
          {isFilterOpen && (
            <FilterPanel
              filters={filters}
              setFilters={setFilters}
              colors={colors}
              businessTypes={businessTypes||[]}
              onClose={() => setIsFilterOpen(false)}
            />
          )}
        </AnimatePresence>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isUsingMockData && (
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertTitle className="text-blue-700">Development Mode</AlertTitle>
              <AlertDescription className="text-blue-600">
                Using mock data for development. In production, this would connect to the actual API.
              </AlertDescription>
            </Alert>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {products?.length > 0 ? (
                    products.map((product) => (
                      <ProductCard key={product.id} product={product} onDelete={handleDeleteProduct} />
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-12">
                      <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {products?.length > 0 && (
                <Pagination
                  currentPage={currentPage + 1} // Convert to 1-based for UI
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

