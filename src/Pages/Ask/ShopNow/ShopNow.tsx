"use client"

import { useState, useMemo, useEffect, useCallback, useContext } from "react"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import axios from "axios"

// Import components
import { SearchBar } from "./SearchBar"
import { FilterSidebar } from "./FilterSidebar"
import { ProductCard } from "./ProductCard"
import { Pagination } from "./Pagination"
import { LoadingSpinner } from "./LoadingSpinner"
import { ActiveFilters } from "./ActiveFilters"
import { EmptyState } from "./EmptyState"
import { UserContext } from "@/Contexts/UserContext"
import { Toaster } from "react-hot-toast"
import { useFilterContext } from "@/Contexts/FilterContext"

// Types
interface Color {
  id: number
  code: string
  name: string
  hexColor: string
}

interface Material {
  id: number
  code: string
  name: string
}

interface BusinessType {
  id: number
  code: string
  name: string
}

interface BusinessTypeCategory {
  id: number
  code: string
  name: string
  businessType: BusinessType
}

interface Product {
  id: number
  name: string
  price: number
  imagePath: string
  rate: number
}

export default function ShopNow() {
  const userContext = useContext(UserContext)
  const { appliedFilters, clearAppliedFilters, clearSpecificFilter } = useFilterContext()

  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }
  const { userToken, pathUrl } = userContext

  // Filter states
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [selectedColorIds, setSelectedColorIds] = useState<number[]>([])
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<number[]>([])
  const [selectedBusinessTypeIds, setSelectedBusinessTypeIds] = useState<number[]>([])
  const [selectedBusinessCategoryIds, setSelectedBusinessCategoryIds] = useState<number[]>([])
  const [searchName, setSearchName] = useState("")

  // UI states
  const [wishlist, setWishlist] = useState<number[]>([])
  const [isFiltering, setIsFiltering] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  // API data states
  const [colors, setColors] = useState<Color[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([])
  const [businessTypeCategories, setBusinessTypeCategories] = useState<BusinessTypeCategory[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isLoadingConfig, setIsLoadingConfig] = useState(true)
  const [isLoadingProducts, setIsLoadingProducts] = useState(false)

  // Fetch configuration data
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoadingConfig(true)
        const { data } = await axios.get(`${pathUrl}/api/v1/business-config`, {
          headers: {
            "Accept-Language": "en",
            Authorization: `Bearer ${userToken}`,
          },
        })

        if (data && data.success) {
          setColors(data.data.colors || [])
          setMaterials(data.data.productMaterial || [])
          setBusinessTypes(data.data.businessTypes || [])
          setBusinessTypeCategories(data.data.businessTypeCategories || [])
        }
      } catch (error) {
        console.error("Error fetching configuration:", error)
        setColors([])
        setMaterials([])
        setBusinessTypes([])
        setBusinessTypeCategories([])
      } finally {
        setIsLoadingConfig(false)
      }
    }

    fetchConfig()
  }, [pathUrl, userToken])

  // Fetch products with combined filters
  const fetchProducts = useCallback(
    async (pageNumber = 0) => {
      try {
        setIsLoadingProducts(true)

        // Combine user selections with applied filters from context
        const finalBusinessTypeIds =
          selectedBusinessTypeIds.length > 0
            ? selectedBusinessTypeIds
            : appliedFilters.businessType
              ? [appliedFilters.businessType.id]
              : []

        const finalBusinessCategoryIds =
          selectedBusinessCategoryIds.length > 0
            ? selectedBusinessCategoryIds
            : appliedFilters.businessCategory
              ? [appliedFilters.businessCategory.id]
              : []

        const requestBody = {
          pageNumber: pageNumber,
          pageSize: 12,
          searchCriteria: {
            name: searchName || "",
            materialIds: selectedMaterialIds.length > 0 ? selectedMaterialIds : null,
            colorIds: selectedColorIds.length > 0 ? selectedColorIds : null,
            minPrice: minPrice && minPrice !== "" ? Number.parseInt(minPrice) : null,
            maxPrice: maxPrice !== "" ? Number.parseInt(maxPrice) : null,
            businessTypeId: finalBusinessTypeIds.length > 0 ? finalBusinessTypeIds[0] : null,
            businessTypeCategoryId: finalBusinessCategoryIds.length > 0 ? finalBusinessCategoryIds[0] : null,
          },
        }

        const { data } = await axios.post(`${pathUrl}/api/v1/products/shop-now`, requestBody, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
            "Accept-Language": "en",
            "Content-Language": "en",
          },
        })

        if (data && data.success) {
          setProducts(data.data.content || [])
          setTotalPages(data.data.totalPages || 1)
        } else {
          setProducts([])
          setTotalPages(1)
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        setProducts([])
        setTotalPages(1)
      } finally {
        setIsLoadingProducts(false)
      }
    },
    [
      pathUrl,
      userToken,
      selectedColorIds,
      selectedMaterialIds,
      selectedBusinessTypeIds,
      selectedBusinessCategoryIds,
      minPrice,
      maxPrice,
      searchName,
      appliedFilters,
    ],
  )

  // Get available business categories
  const availableBusinessCategories = useMemo(() => {
    const allSelectedTypes = [
      ...selectedBusinessTypeIds,
      ...(appliedFilters.businessType && !selectedBusinessTypeIds.includes(appliedFilters.businessType.id)
        ? [appliedFilters.businessType.id]
        : []),
    ]

    if (allSelectedTypes.length === 0) {
      return businessTypeCategories
    }
    return businessTypeCategories.filter((category) => allSelectedTypes.includes(category.businessType.id))
  }, [selectedBusinessTypeIds, businessTypeCategories, appliedFilters.businessType])

  // Fetch products when filters change
  useEffect(() => {
    if (!isLoadingConfig) {
      setCurrentPage(0)
      fetchProducts(0)
    }
  }, [fetchProducts, isLoadingConfig])

  // Loading effect
  useEffect(() => {
    setIsFiltering(true)
    const timer = setTimeout(() => setIsFiltering(false), 300)
    return () => clearTimeout(timer)
  }, [isLoadingProducts])

  // Handler functions
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchProducts(page)
  }

  const handlePriceFilter = useCallback(() => {
    setCurrentPage(0)
    fetchProducts(0)
  }, [fetchProducts])

  const handleColorChange = useCallback((colorId: number, checked: boolean) => {
    if (checked) {
      setSelectedColorIds((prev) => [...prev, colorId])
    } else {
      setSelectedColorIds((prev) => prev.filter((id) => id !== colorId))
    }
  }, [])

  const handleMaterialChange = useCallback((materialId: number, checked: boolean) => {
    if (checked) {
      setSelectedMaterialIds((prev) => [...prev, materialId])
    } else {
      setSelectedMaterialIds((prev) => prev.filter((id) => id !== materialId))
    }
  }, [])

  const handleBusinessTypeChange = useCallback(
    (businessTypeId: number, checked: boolean) => {
      // If unchecking an applied filter, clear it from context
      if (!checked && appliedFilters.businessType && appliedFilters.businessType.id === businessTypeId) {
        clearSpecificFilter("businessType")
        return
      }

      if (checked) {
        setSelectedBusinessTypeIds((prev) => [...prev, businessTypeId])
      } else {
        setSelectedBusinessTypeIds((prev) => prev.filter((id) => id !== businessTypeId))
      }
    },
    [appliedFilters.businessType, clearSpecificFilter],
  )

  const handleBusinessCategoryChange = useCallback(
    (businessCategoryId: number, checked: boolean) => {
      // If unchecking an applied filter, clear it from context
      if (!checked && appliedFilters.businessCategory && appliedFilters.businessCategory.id === businessCategoryId) {
        clearSpecificFilter("businessCategory")
        return
      }

      if (checked) {
        setSelectedBusinessCategoryIds((prev) => [...prev, businessCategoryId])
      } else {
        setSelectedBusinessCategoryIds((prev) => prev.filter((id) => id !== businessCategoryId))
      }
    },
    [appliedFilters.businessCategory, clearSpecificFilter],
  )

  const toggleWishlist = useCallback((productId: number) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId)
      } else {
        return [...prev, productId]
      }
    })
  }, [])

  const clearAllFilters = useCallback(() => {
    setMinPrice("")
    setMaxPrice("")
    setSelectedColorIds([])
    setSelectedMaterialIds([])
    setSelectedBusinessTypeIds([])
    setSelectedBusinessCategoryIds([])
    setSearchName("")
    setCurrentPage(0)
    clearAppliedFilters()
  }, [clearAppliedFilters])

  const activeFiltersCount =
    selectedColorIds.length +
    selectedMaterialIds.length +
    selectedBusinessTypeIds.length +
    selectedBusinessCategoryIds.length +
    (minPrice !== "" || maxPrice !== "" ? 1 : 0) +
    (searchName !== "" ? 1 : 0)

  if (isLoadingConfig) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner message="Loading configuration..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <SearchBar searchName={searchName} onSearchChange={setSearchName} />

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Products
            </h1>
            <p className="text-muted-foreground text-lg">Showing {products.length} products</p>
          </div>

          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden bg-transparent">
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0 flex flex-col">
              <SheetHeader className="p-6 pb-4 border-b">
                <SheetTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </SheetTitle>
                <SheetDescription>Filter products by various criteria</SheetDescription>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-6">
                <FilterSidebar
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  selectedColorIds={selectedColorIds}
                  selectedMaterialIds={selectedMaterialIds}
                  selectedBusinessTypeIds={selectedBusinessTypeIds}
                  selectedBusinessCategoryIds={selectedBusinessCategoryIds}
                  colors={colors}
                  materials={materials}
                  businessTypes={businessTypes}
                  availableBusinessCategories={availableBusinessCategories}
                  onMinPriceChange={setMinPrice}
                  onMaxPriceChange={setMaxPrice}
                  onPriceFilter={handlePriceFilter}
                  onColorChange={handleColorChange}
                  onMaterialChange={handleMaterialChange}
                  onBusinessTypeChange={handleBusinessTypeChange}
                  onBusinessCategoryChange={handleBusinessCategoryChange}
                  onClearFilters={clearAllFilters}
                  activeFiltersCount={activeFiltersCount}
                  idPrefix="mobile"
                  appliedFilters={appliedFilters}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden md:block w-80 shrink-0">
            <div className="sticky top-4">
              <FilterSidebar
                minPrice={minPrice}
                maxPrice={maxPrice}
                selectedColorIds={selectedColorIds}
                selectedMaterialIds={selectedMaterialIds}
                selectedBusinessTypeIds={selectedBusinessTypeIds}
                selectedBusinessCategoryIds={selectedBusinessCategoryIds}
                colors={colors}
                materials={materials}
                businessTypes={businessTypes}
                availableBusinessCategories={availableBusinessCategories}
                onMinPriceChange={setMinPrice}
                onMaxPriceChange={setMaxPrice}
                onPriceFilter={handlePriceFilter}
                onColorChange={handleColorChange}
                onMaterialChange={handleMaterialChange}
                onBusinessTypeChange={handleBusinessTypeChange}
                onBusinessCategoryChange={handleBusinessCategoryChange}
                onClearFilters={clearAllFilters}
                activeFiltersCount={activeFiltersCount}
                idPrefix="desktop"
                appliedFilters={appliedFilters}
              />
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 min-h-[600px]">
            {/* Active Filters */}
            <ActiveFilters
              searchName={searchName}
              selectedColorIds={selectedColorIds}
              colors={colors}
              onClearSearch={() => setSearchName("")}
              onClearColor={(colorId) => handleColorChange(colorId, false)}
              onClearAllFilters={clearAllFilters}
              hasUrlFilters={false}
              appliedFilters={appliedFilters}
            />

            {/* Content Area */}
            <div className="relative min-h-[500px]">
              {(isFiltering || isLoadingProducts) && <LoadingSpinner message="Loading products..." isOverlay />}

              {products.length > 0 ? (
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-500 ${
                    isFiltering || isLoadingProducts ? "opacity-30 scale-95" : "opacity-100 scale-100"
                  }`}
                >
                  {products.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                      pathUrl={pathUrl}
                      isInWishlist={wishlist.includes(product.id)}
                      onToggleWishlist={toggleWishlist}
                    />
                  ))}
                </div>
              ) : !isLoadingProducts ? (
                <EmptyState onClearFilters={clearAllFilters} />
              ) : null}
            </div>

            {/* Pagination */}
            {products.length > 0 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
