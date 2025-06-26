"use client"

import React from "react"

import type { ReactNode } from "react"

import { useState, useMemo, useEffect, useCallback, useContext } from "react"
import { Heart, Star, Filter, X, ShoppingCart, ChevronDown, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import axios from "axios"
import { Link } from "react-router-dom"
import { UserContext } from "@/Contexts/UserContext"

// Types for API data
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

const FilterSection = ({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}) => (
  <Collapsible defaultOpen={defaultOpen}>
    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors duration-200 group">
      <span className="font-medium text-gray-700 group-hover:text-gray-900">{title}</span>
      <ChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-200 group-data-[state=open]:rotate-180" />
    </CollapsibleTrigger>
    <CollapsibleContent className="px-3 pb-3">
      <div className="pt-2">{children}</div>
    </CollapsibleContent>
  </Collapsible>
)

// Pagination Component
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) => {
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    // Convert 0-based currentPage to 1-based for display
    const displayCurrentPage = currentPage + 1

    for (let i = Math.max(1, displayCurrentPage - delta); i <= Math.min(totalPages, displayCurrentPage + delta); i++) {
      range.push(i)
    }

    if (displayCurrentPage - delta > 1) {
      rangeWithDots.push(1)
      if (displayCurrentPage - delta > 2) {
        rangeWithDots.push("...")
      }
    }

    rangeWithDots.push(...range)

    if (displayCurrentPage + delta < totalPages) {
      if (displayCurrentPage + delta < totalPages - 1) {
        rangeWithDots.push("...")
      }
      rangeWithDots.push(totalPages)
    }

    // Remove duplicates
    return rangeWithDots.filter((item, index, arr) => 
      index === 0 || item !== arr[index - 1]
    )
  }

  if (totalPages <= 1) return null

  const displayCurrentPage = currentPage + 1

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="flex items-center gap-1"
      >
        <ChevronLeft className="w-4 h-4" />
        Previous
      </Button>

      <div className="flex items-center space-x-1">
        {getVisiblePages().map((page, index) => (
          <React.Fragment key={index}>
            {page === "..." ? (
              <span className="px-3 py-2 text-gray-500">...</span>
            ) : (
              <Button
                variant={displayCurrentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange((page as number) - 1)} // Convert back to 0-based for API
                className={`min-w-[40px] ${
                  displayCurrentPage === page ? "bg-blue-600 text-white hover:bg-blue-700" : "hover:bg-gray-50"
                }`}
              >
                {page}
              </Button>
            )}
          </React.Fragment>
        ))}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className="flex items-center gap-1"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}

export default function ProductListing() {
  const userContext = useContext(UserContext)
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }
  const { userToken, pathUrl } = userContext

  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [selectedColorIds, setSelectedColorIds] = useState<number[]>([])
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<number[]>([])
  const [selectedBusinessTypeIds, setSelectedBusinessTypeIds] = useState<number[]>([])
  const [selectedBusinessCategoryIds, setSelectedBusinessCategoryIds] = useState<number[]>([])
  const [searchName, setSearchName] = useState("")
  const [wishlist, setWishlist] = useState<number[]>([])
  const [cart, setCart] = useState<number[]>([])
  const [isFiltering, setIsFiltering] = useState(false)

  // Pagination states
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

  // Fetch configuration data from API
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
        console.log("Config data:", data)

        if (data && data.success) {
          setColors(data.data.colors || [])
          setMaterials(data.data.productMaterial || [])
          setBusinessTypes(data.data.businessTypes || [])
          setBusinessTypeCategories(data.data.businessTypeCategories || [])
        }
      } catch (error) {
        console.error("Error fetching configuration:", error)
        // Fallback to empty arrays if API fails
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

  // Fetch products from API with filters
  const fetchProducts = useCallback(
    async (pageNumber = 0) => {
      try {
        setIsLoadingProducts(true)
        const requestBody = {
          pageNumber: pageNumber,
          pageSize: 12,
          searchCriteria: {
            name: searchName || "",
            materialIds: selectedMaterialIds.length > 0 ? selectedMaterialIds : null,
            colorIds: selectedColorIds.length > 0 ? selectedColorIds : null,
            minPrice: minPrice && minPrice !== "" ? Number.parseInt(minPrice) : null,
            maxPrice: maxPrice !== "" ? Number.parseInt(maxPrice) : null,
            businessTypeId: selectedBusinessTypeIds.length > 0 ? selectedBusinessTypeIds[0] : null,
            businessTypeCategoryId: selectedBusinessCategoryIds.length > 0 ? selectedBusinessCategoryIds[0] : null,
          },
        }

        console.log("Fetching products with request body:", requestBody)

        const { data } = await axios.post(`${pathUrl}/api/v1/products/shop-now`, requestBody, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
            "Accept-Language": "en",
            "Content-Language": "en", // Specifies language of request content
          },
        })

        console.log("Products data:", data)

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
    ],
  )

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchProducts(page)
  }

  // Fetch products when filters change
  useEffect(() => {
    if (!isLoadingConfig) {
      setCurrentPage(0)
      fetchProducts(0)
    }
  }, [fetchProducts, isLoadingConfig])

  // Get available business categories based on selected business types
  const availableBusinessCategories = useMemo(() => {
    if (selectedBusinessTypeIds.length === 0) {
      return businessTypeCategories
    }
    return businessTypeCategories.filter((category) => selectedBusinessTypeIds.includes(category.businessType.id))
  }, [selectedBusinessTypeIds, businessTypeCategories])

  // Clear business categories when business types change
  useEffect(() => {
    setSelectedBusinessCategoryIds((prev) =>
      prev.filter((categoryId) => availableBusinessCategories.some((available) => available.id === categoryId)),
    )
  }, [availableBusinessCategories])

  const handlePriceFilter = useCallback(() => {
    // Trigger refetch when price filter is applied
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

  const handleBusinessTypeChange = useCallback((businessTypeId: number, checked: boolean) => {
    if (checked) {
      setSelectedBusinessTypeIds((prev) => [...prev, businessTypeId])
    } else {
      setSelectedBusinessTypeIds((prev) => prev.filter((id) => id !== businessTypeId))
    }
  }, [])

  const handleBusinessCategoryChange = useCallback((businessCategoryId: number, checked: boolean) => {
    if (checked) {
      setSelectedBusinessCategoryIds((prev) => [...prev, businessCategoryId])
    } else {
      setSelectedBusinessCategoryIds((prev) => prev.filter((id) => id !== businessCategoryId))
    }
  }, [])

  const toggleWishlist = useCallback((productId: number) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId)
      } else {
        return [...prev, productId]
      }
    })
  }, [])

  const toggleCart = useCallback((productId: number) => {
    setCart((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId)
      } else {
        return [...prev, productId]
      }
    })
  }, [])

  const clearFilters = useCallback(() => {
    setMinPrice("")
    setMaxPrice("")
    setSelectedColorIds([])
    setSelectedMaterialIds([])
    setSelectedBusinessTypeIds([])
    setSelectedBusinessCategoryIds([])
    setSearchName("")
    setCurrentPage(0)
  }, [])

  const activeFiltersCount =
    selectedColorIds.length +
    selectedMaterialIds.length +
    selectedBusinessTypeIds.length +
    selectedBusinessCategoryIds.length +
    (minPrice !== "" || maxPrice !== "" ? 1 : 0) +
    (searchName !== "" ? 1 : 0)

  // Loading effect for filtering
  useEffect(() => {
    setIsFiltering(true)
    const timer = setTimeout(() => setIsFiltering(false), 300)
    return () => clearTimeout(timer)
  }, [isLoadingProducts])

  if (isLoadingConfig) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-xl shadow-lg border">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium text-gray-700">Loading configuration...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="container mx-auto px-4 py-8">
        {/* Beautiful Search Bar - Centered at Top */}
        <div className="mb-12 flex justify-center animate-in fade-in slide-in-from-top-2 duration-700">
          <div className="relative w-full max-w-2xl">
            <div className="relative group">
              {/* Animated background gradient */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-500 opacity-40 group-hover:opacity-60 animate-pulse"></div>
              
              {/* Main search container */}
              <div className="relative bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-white/80 overflow-hidden group-hover:shadow-xl transition-all duration-500">
                <div className="flex items-center px-2 py-2">
                  <div className="pl-4 pr-3">
                    <Search className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-all duration-300 group-hover:scale-110" />
                  </div>
                  <Input
                    type="text"
                    placeholder="What are you looking for?"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="flex-1 border-none bg-transparent text-base placeholder:text-gray-400 focus:ring-0 focus-visible:ring-0 focus:outline-none py-3 pr-4 placeholder:font-normal"
                  />
                  {searchName && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSearchName("")}
                      className="mr-2 h-8 w-8 p-0 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110"
                    >
                      <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                    </Button>
                  )}
                </div>
                
                {/* Search indicator when active */}
                {searchName && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full shadow-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                        Searching...
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Products
            </h1>
            <p className="text-muted-foreground animate-in slide-in-from-left-2 duration-500 text-lg">
              Showing {products.length} products
            </p>
          </div>

          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="md:hidden hover:scale-105 transition-transform duration-200 shadow-lg">
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 animate-pulse">
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
                <div className="space-y-4 pb-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Filters</h3>
                      {activeFiltersCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearFilters}
                          className="hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                        >
                          Clear All
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      {/* Price Range */}
                      <FilterSection title="Price Range">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handlePriceFilter()}
                            className="flex-1 text-center border-gray-300 focus:border-blue-500 transition-colors duration-200"
                          />
                          <span className="text-sm font-medium text-gray-500 px-2">TO</span>
                          <Input
                            type="number"
                            min="0"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handlePriceFilter()}
                            className="flex-1 text-center border-gray-300 focus:border-blue-500 transition-colors duration-200"
                          />
                          <Button
                            onClick={handlePriceFilter}
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 transition-all duration-200 hover:scale-105"
                          >
                            GO
                          </Button>
                        </div>
                        {(minPrice !== "" || maxPrice !== "") && (
                          <div className="mt-2 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                            Applied: {minPrice || "Min"} - {maxPrice || "Max"}
                          </div>
                        )}
                      </FilterSection>

                      {/* Colors */}
                      <FilterSection title="Colors">
                        <div className="space-y-2">
                          {colors.map((color) => (
                            <div key={color.id}>
                              <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                  id={`mobile-color-${color.id}`}
                                  checked={selectedColorIds.includes(color.id)}
                                  onCheckedChange={(checked) => {
                                    handleColorChange(color.id, checked as boolean)
                                  }}
                                />
                                <div
                                  className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                                  style={{ backgroundColor: color.hexColor }}
                                />
                                <Label htmlFor={`mobile-color-${color.id}`} className="text-sm cursor-pointer">
                                  {color.name}
                                </Label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </FilterSection>

                      {/* Materials */}
                      <FilterSection title="Materials">
                        <div className="space-y-2">
                          {materials.map((material) => (
                            <div key={material.id}>
                              <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                  id={`mobile-material-${material.id}`}
                                  checked={selectedMaterialIds.includes(material.id)}
                                  onCheckedChange={(checked) => {
                                    handleMaterialChange(material.id, checked as boolean)
                                  }}
                                />
                                <Label htmlFor={`mobile-material-${material.id}`} className="text-sm cursor-pointer">
                                  {material.name}
                                </Label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </FilterSection>

                      {/* Business Types */}
                      <FilterSection title="Business Types">
                        <div className="space-y-2">
                          {businessTypes.map((businessType) => (
                            <div key={businessType.id}>
                              <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                  id={`mobile-business-type-${businessType.id}`}
                                  checked={selectedBusinessTypeIds.includes(businessType.id)}
                                  onCheckedChange={(checked) => {
                                    handleBusinessTypeChange(businessType.id, checked as boolean)
                                  }}
                                />
                                <Label
                                  htmlFor={`mobile-business-type-${businessType.id}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {businessType.name}
                                </Label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </FilterSection>

                      {/* Business Type Categories */}
                      <FilterSection title="Business Type Categories">
                        <div className="space-y-2">
                          {availableBusinessCategories.map((businessCategory) => (
                            <div key={businessCategory.id}>
                              <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                                <Checkbox
                                  id={`mobile-business-category-${businessCategory.id}`}
                                  checked={selectedBusinessCategoryIds.includes(businessCategory.id)}
                                  onCheckedChange={(checked) => {
                                    handleBusinessCategoryChange(businessCategory.id, checked as boolean)
                                  }}
                                />
                                <Label
                                  htmlFor={`mobile-business-category-${businessCategory.id}`}
                                  className="text-sm cursor-pointer"
                                >
                                  {businessCategory.name}
                                </Label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </FilterSection>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8">
          {/* Fixed Desktop Sidebar */}
          <div className="hidden md:block w-80 shrink-0">
            <div className="sticky top-4">
              <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-gray-50/50 to-blue-50/30 animate-in slide-in-from-left-4 duration-700 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Filters</h3>
                        {activeFiltersCount > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                            className="hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                          >
                            Clear All
                          </Button>
                        )}
                      </div>

                      <div className="space-y-2">
                        {/* Price Range */}
                        <FilterSection title="Price Range">
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              min="0"
                              placeholder="Min"
                              value={minPrice}
                              onChange={(e) => setMinPrice(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handlePriceFilter()}
                              className="flex-1 text-center border-gray-300 focus:border-blue-500 transition-colors duration-200"
                            />
                            <span className="text-sm font-medium text-gray-500 px-2">TO</span>
                            <Input
                              type="number"
                              min="0"
                              placeholder="Max"
                              value={maxPrice}
                              onChange={(e) => setMaxPrice(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handlePriceFilter()}
                              className="flex-1 text-center border-gray-300 focus:border-blue-500 transition-colors duration-200"
                            />
                            <Button
                              onClick={handlePriceFilter}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 transition-all duration-200 hover:scale-105"
                            >
                              GO
                            </Button>
                          </div>
                          {(minPrice !== "" || maxPrice !== "") && (
                            <div className="mt-2 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                              Applied: {minPrice || "Min"} - {maxPrice || "Max"}
                            </div>
                          )}
                        </FilterSection>

                        {/* Colors */}
                        <FilterSection title="Colors">
                          <div className="space-y-2">
                            {colors.map((color) => (
                              <div key={color.id}>
                                <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                                  <Checkbox
                                    id={`desktop-color-${color.id}`}
                                    checked={selectedColorIds.includes(color.id)}
                                    onCheckedChange={(checked) => {
                                      handleColorChange(color.id, checked as boolean)
                                    }}
                                  />
                                  <div
                                    className="w-4 h-4 rounded-full border border-gray-300 flex-shrink-0"
                                    style={{ backgroundColor: color.hexColor }}
                                  />
                                  <Label htmlFor={`desktop-color-${color.id}`} className="text-sm cursor-pointer">
                                    {color.name}
                                  </Label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </FilterSection>

                        {/* Materials */}
                        <FilterSection title="Materials">
                          <div className="space-y-2">
                            {materials.map((material) => (
                              <div key={material.id}>
                                <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                                  <Checkbox
                                    id={`desktop-material-${material.id}`}
                                    checked={selectedMaterialIds.includes(material.id)}
                                    onCheckedChange={(checked) => {
                                      handleMaterialChange(material.id, checked as boolean)
                                    }}
                                  />
                                  <Label htmlFor={`desktop-material-${material.id}`} className="text-sm cursor-pointer">
                                    {material.name}
                                  </Label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </FilterSection>

                        {/* Business Types */}
                        <FilterSection title="Business Types">
                          <div className="space-y-2">
                            {businessTypes.map((businessType) => (
                              <div key={businessType.id}>
                                <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                                  <Checkbox
                                    id={`desktop-business-type-${businessType.id}`}
                                    checked={selectedBusinessTypeIds.includes(businessType.id)}
                                    onCheckedChange={(checked) => {
                                      handleBusinessTypeChange(businessType.id, checked as boolean)
                                    }}
                                  />
                                  <Label
                                    htmlFor={`desktop-business-type-${businessType.id}`}
                                    className="text-sm cursor-pointer"
                                  >
                                    {businessType.name}
                                  </Label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </FilterSection>

                        {/* Business Type Categories */}
                        <FilterSection title="Business Type Categories">
                          <div className="space-y-2">
                            {availableBusinessCategories.map((businessCategory) => (
                              <div key={businessCategory.id}>
                                <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                                  <Checkbox
                                    id={`desktop-business-category-${businessCategory.id}`}
                                    checked={selectedBusinessCategoryIds.includes(businessCategory.id)}
                                    onCheckedChange={(checked) => {
                                      handleBusinessCategoryChange(businessCategory.id, checked as boolean)
                                    }}
                                  />
                                  <Label
                                    htmlFor={`desktop-business-category-${businessCategory.id}`}
                                    className="text-sm cursor-pointer"
                                  >
                                    {businessCategory.name}
                                  </Label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </FilterSection>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 min-h-[600px]">
            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="mb-6 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-500">
                {searchName && (
                  <Badge variant="secondary" className="px-3 py-1 bg-purple-50 text-purple-700 border-purple-200">
                    Search: {searchName}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-auto p-0 text-purple-500 hover:text-purple-700"
                      onClick={() => setSearchName("")}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                )}
                {selectedColorIds.map((colorId) => {
                  const color = colors.find((c) => c.id === colorId)
                  return color ? (
                    <Badge
                      key={colorId}
                      variant="secondary"
                      className="px-3 py-1 bg-green-50 text-green-700 border-green-200"
                    >
                      {color.name}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-auto p-0 text-green-500 hover:text-green-700"
                        onClick={() => handleColorChange(colorId, false)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ) : null
                })}
                {/* Similar badges for other filters... */}
              </div>
            )}

            {/* Content Area */}
            <div className="relative min-h-[500px]">
              {/* Loading overlay */}
              {(isFiltering || isLoadingProducts) && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center animate-in fade-in duration-300">
                  <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-xl shadow-lg border animate-in zoom-in-50 duration-300">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm font-medium text-gray-700">Loading products...</span>
                  </div>
                </div>
              )}

              {/* Products Grid or No Products Message */}
              {products.length > 0 ? (
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-500 ${
                    isFiltering || isLoadingProducts ? "opacity-30 scale-95" : "opacity-100 scale-100"
                  }`}
                >
                  {products.map((product, index) => (
                    <Link key={product.id} to={`/product/${product.id}`}>
                      <Card
                        className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8 zoom-in-95 border-0 shadow-md hover:shadow-blue-100/50 cursor-pointer"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animationDuration: "700ms",
                        }}
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={pathUrl + product.imagePath || "/placeholder.svg"}
                            alt={product.name}
                            width={300}
                            height={400}
                            className="w-full h-80 object-cover transition-all duration-500 group-hover:scale-110"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-3 right-3 bg-white/90 hover:bg-white transition-all duration-300 hover:scale-110 shadow-lg animate-in slide-in-from-right-2"
                            style={{ animationDelay: `${index * 100 + 200}ms` }}
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              toggleWishlist(product.id)
                            }}
                          >
                            <Heart
                              className={`w-4 h-4 transition-all duration-300 ${
                                wishlist.includes(product.id)
                                  ? "fill-red-500 text-red-500 scale-110"
                                  : "text-gray-600 hover:text-red-400 hover:scale-110"
                              }`}
                            />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute bottom-3 right-3 bg-white/90 hover:bg-white transition-all duration-300 hover:scale-110 shadow-lg animate-in slide-in-from-right-2"
                            style={{ animationDelay: `${index * 100 + 300}ms` }}
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              toggleCart(product.id)
                            }}
                          >
                            <ShoppingCart
                              className={`w-4 h-4 transition-all duration-300 ${
                                cart.includes(product.id)
                                  ? "fill-blue-500 text-blue-500 scale-110"
                                  : "text-gray-600 hover:text-blue-400 hover:scale-110"
                              }`}
                            />
                          </Button>
                        </div>

                        <CardContent className="p-4 space-y-3">
                          <h3 className="font-medium text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                            {product.name}
                          </h3>

                          <div className="flex items-center gap-1 mb-2">
                            <div className="flex items-center">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform duration-200" />
                              <span className="text-sm font-medium ml-1">{product.rate || 0}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                              EGP {product.price.toLocaleString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              ) : !isLoadingProducts ? (
                <div className="flex items-center justify-center min-h-[500px]">
                  <div className="text-center py-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="text-8xl mb-6 animate-bounce">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                    <p className="text-muted-foreground mb-6">Try adjusting your filters to see more results</p>
                    <Button
                      onClick={clearFilters}
                      className="hover:scale-105 transition-all duration-200 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg"
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Pagination */}
            {products.length > 0 && (
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}