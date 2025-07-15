"use client"

import { useState, useMemo, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DynamicFilterSidebar } from "./components/dynamic-filter-sidebar"
import { ActiveFilters } from "./components/active-filters"
import { Pagination } from "./components/pagination"
import { ProductCard } from "./components/product-card"
import { CategoryNavigation } from "./components/category-navigation"
import { MyAsksPage } from "./components/my-asks-page"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useFilterProducts, type FilterParams } from "@/hooks/useFilterProducts"
import { useFilterData, useCities } from "@/hooks/useFilterData"

const ITEMS_PER_PAGE = 12 // Match API default page size

// Map service types to business type codes for API calls
const getBusinessTypeFromService = (serviceType: string): string => {
  switch (serviceType) {
    case "engineer":
      return "ask_engineer"
    case "worker":
      return "technical_worker"
    case "kitchen":
      return "kitchens"
    case "furnish-house":
      return "home_furnishing"
    case "home-renovate":
      return "home_renovate"
    case "request-design":
      return "design_request"
    case "custom-package":
      return "custom_package"
    default:
      return "ask_engineer" // Default fallback
  }
}

// Map service types to URL paths for My Asks
const getMyAsksUrlPath = (serviceType: string): string => {
  switch (serviceType) {
    case "engineer":
      return "MyAsks/AskEngineer"
    case "worker":
      return "MyAsks/AskWorker"
    case "request-design":
      return "MyAsks/RequestDesign"
    case "home-renovate":
      return "MyAsks/RenovateHome"
    case "custom-package":
      return "MyAsks/CustomPackage"
    default:
      return "MyAsks/AskEngineer"
  }
}

export default function ProductsPage({
  showMyAsks,
  setShowMyAsks,
}: { showMyAsks: boolean; setShowMyAsks: (value: boolean) => void }) {
  const location = useLocation()

  // Page state
  useEffect(() => {
    const handlePathnameChange = () => {
      if (window.location.pathname === "/All-Asks") {
        setShowMyAsks(false)
      }
    }

    // Check on mount
    handlePathnameChange()

    // Listen for popstate events (back/forward navigation)
    window.addEventListener("popstate", handlePathnameChange)

    return () => {
      window.removeEventListener("popstate", handlePathnameChange)
    }
  }, [setShowMyAsks])

  // Search and service type state
  const [searchName, setSearchName] = useState("")
  const [selectedServiceType, setSelectedServiceType] = useState<string>("engineer") // Default to engineer

  // Preserve active service type from navigation state
  useEffect(() => {
    if (location.state?.preserveCategory && location.state?.activeServiceType) {
      console.log("Preserving category:", location.state.activeServiceType)
      setSelectedServiceType(location.state.activeServiceType)
      setShowMyAsks(false) // Ensure we're not in MyAsks mode when coming back

      // Clear the state to prevent it from persisting on future navigations
      window.history.replaceState({}, document.title)
    }
  }, [location.state, setShowMyAsks])

  // Store the active service type in sessionStorage for additional persistence
  useEffect(() => {
    if (selectedServiceType) {
      sessionStorage.setItem("activeServiceType", selectedServiceType)
    }
  }, [selectedServiceType])

  // Restore from sessionStorage on initial load (only if no navigation state)
  useEffect(() => {
    if (!location.state?.preserveCategory) {
      const stored = sessionStorage.getItem("activeServiceType")
      if (stored && stored !== selectedServiceType) {
        setSelectedServiceType(stored)
      }
    }
  }, [location.state?.preserveCategory, selectedServiceType])

  // Filter states - all single values
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [selectedUnitTypeId, setSelectedUnitTypeId] = useState<number | null>(null)
  const [selectedGovernorateId, setSelectedGovernorateId] = useState<number | null>(null)
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null)
  const [selectedUrgencyLevelId, setSelectedUrgencyLevelId] = useState<number | null>(null)
  const [selectedEngineerTypeId, setSelectedEngineerTypeId] = useState<number | null>(null)

  // Worker-specific filter states
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null)
  const [selectedWorkerTypeId, setSelectedWorkerTypeId] = useState<number | null>(null)

  // Request Design specific filter states
  const [minUnitArea, setMinUnitArea] = useState("")
  const [maxUnitArea, setMaxUnitArea] = useState("")
  const [minDuration, setMinDuration] = useState("")
  const [maxDuration, setMaxDuration] = useState("")

  // Home Renovate specific filter states
  const [selectedUnitStatusId, setSelectedUnitStatusId] = useState<number | null>(null)
  const [selectedUnitWorkTypeId, setSelectedUnitWorkTypeId] = useState<number | null>(null)
  const [selectedWorkSkillId, setSelectedWorkSkillId] = useState<number | null>(null)

  // Custom Package specific filter states
  const [selectedCustomPackageId, setSelectedCustomPackageId] = useState<number | null>(null)
  const [selectedCompoundValue, setSelectedCompoundValue] = useState<boolean | null>(null)

  // Pagination
  const [currentPage, setCurrentPage] = useState(0)

  // Get filter data
  const { unitTypes, governorates, urgencyLevels, engineerTypes } = useFilterData()

  // Get cities based on selected governorate
  const { data: citiesData } = useCities(selectedGovernorateId)
  const cities = citiesData?.data || []

  // Build filter parameters with single values
  const filterParams: FilterParams = useMemo(
    () => ({
      pageSize: ITEMS_PER_PAGE,
      pageNumber: currentPage,
      searchCriteria: {
        projectName: searchName || null,
        unitTypeId: selectedUnitTypeId,
        governorateId: selectedGovernorateId,
        cityId: selectedCityId,
        urgencyLevelId: selectedUrgencyLevelId,
        engineerTypeId: selectedEngineerTypeId,
        budgetFrom: minPrice ? Number.parseInt(minPrice) : null,
        budgetTo: maxPrice ? Number.parseInt(maxPrice) : null,
        // Worker-specific filters
        materialId: selectedMaterialId,
        workerTypeId: selectedWorkerTypeId,
        // Request Design specific filters
        unitAreaFrom: minUnitArea ? Number.parseInt(minUnitArea) : null,
        unitAreaTo: maxUnitArea ? Number.parseInt(maxUnitArea) : null,
        requiredDurationFrom: minDuration ? Number.parseInt(minDuration) : null,
        requiredDurationTo: maxDuration ? Number.parseInt(maxDuration) : null,
        // Home Renovate specific filters
        unitStatusId: selectedUnitStatusId,
        unitWorkTypeId: selectedUnitWorkTypeId,
        workSkillId: selectedWorkSkillId,
        // Custom Package specific filters
        customPackageId: selectedCustomPackageId,
        isInsideCompound: selectedCompoundValue,
      },
    }),
    [
      currentPage,
      searchName,
      selectedUnitTypeId,
      selectedGovernorateId,
      selectedCityId,
      selectedUrgencyLevelId,
      selectedEngineerTypeId,
      minPrice,
      maxPrice,
      selectedMaterialId,
      selectedWorkerTypeId,
      minUnitArea,
      maxUnitArea,
      minDuration,
      maxDuration,
      selectedUnitStatusId,
      selectedUnitWorkTypeId,
      selectedWorkSkillId,
      selectedCustomPackageId,
      selectedCompoundValue,
    ],
  )

  // Get business type code for API call
  const businessTypeCode = getBusinessTypeFromService(selectedServiceType)

  // Fetch products based on selected service type and filters (only when not showing My Asks)
  const {
    data: productsData,
    isLoading: isProductsLoading,
    isError,
  } = useFilterProducts(businessTypeCode, filterParams)

  const products = productsData?.data?.content || []
  const totalPages = productsData?.data?.totalPages || 0

  // Reset page when filters change (including price changes)
  useEffect(() => {
    setCurrentPage(0)
  }, [
    selectedServiceType,
    searchName,
    selectedUnitTypeId,
    selectedGovernorateId,
    selectedCityId,
    selectedUrgencyLevelId,
    selectedEngineerTypeId,
    minPrice,
    maxPrice,
    selectedMaterialId,
    selectedWorkerTypeId,
  ])

  // Clear city when governorate changes
  useEffect(() => {
    setSelectedCityId(null)
  }, [selectedGovernorateId])

  // Update URL when on main page (All-Asks)
  useEffect(() => {
    if (!showMyAsks) {
      // Update the URL to /All-Asks when on the main browsing page
      window.history.pushState({}, "", "/All-Asks")
    }
  }, [showMyAsks])

  // Update URL when showing My Asks
  useEffect(() => {
    if (showMyAsks) {
      const myAsksPath = getMyAsksUrlPath(selectedServiceType)
      // Update the URL without causing a page reload
      window.history.pushState({}, "", `/${myAsksPath}`)
    }
  }, [showMyAsks, selectedServiceType])

  // Handler functions - all single value selection
  const handleServiceTypeChange = (serviceType: string) => {
    console.log("Service type changed to:", serviceType)
    setSelectedServiceType(serviceType)
    setShowMyAsks(false) // Reset to browse mode when changing service type
    // Clear all filters when service type changes
    setMinPrice("")
    setMaxPrice("")
    setSelectedUnitTypeId(null)
    setSelectedGovernorateId(null)
    setSelectedCityId(null)
    setSelectedUrgencyLevelId(null)
    setSelectedEngineerTypeId(null)
    setSelectedMaterialId(null)
    setSelectedWorkerTypeId(null)
    setSelectedUnitStatusId(null)
    setSelectedUnitWorkTypeId(null)
    setSelectedWorkSkillId(null)
    setSelectedCustomPackageId(null)
    setSelectedCompoundValue(null)
    setCurrentPage(0)
  }

  const handleMyAsksClick = (serviceType: string) => {
    console.log("My Asks clicked for service type:", serviceType)
    setSelectedServiceType(serviceType)
    setShowMyAsks(true)
  }

  const handleBackToBrowse = () => {
    console.log("Back to browse, maintaining service type:", selectedServiceType)
    setShowMyAsks(false)
    // Don't change selectedServiceType here - keep it as is to maintain active category
  }

  const handleUnitTypeChange = (unitTypeId: number, checked: boolean) => {
    setSelectedUnitTypeId(checked ? unitTypeId : null)
  }

  const handleGovernorateChange = (governorateId: number, checked: boolean) => {
    setSelectedGovernorateId(checked ? governorateId : null)
  }

  const handleCityChange = (cityId: number, checked: boolean) => {
    setSelectedCityId(checked ? cityId : null)
  }

  const handleUrgencyLevelChange = (urgencyLevelId: number, checked: boolean) => {
    setSelectedUrgencyLevelId(checked ? urgencyLevelId : null)
  }

  const handleEngineerTypeChange = (engineerTypeId: number, checked: boolean) => {
    setSelectedEngineerTypeId(checked ? engineerTypeId : null)
  }

  const handleMaterialChange = (materialId: number, checked: boolean) => {
    setSelectedMaterialId(checked ? materialId : null)
  }

  const handleWorkerTypeChange = (workerTypeId: number, checked: boolean) => {
    setSelectedWorkerTypeId(checked ? workerTypeId : null)
  }

  const handleUnitStatusChange = (unitStatusId: number, checked: boolean) => {
    setSelectedUnitStatusId(checked ? unitStatusId : null)
  }

  const handleUnitWorkTypeChange = (unitWorkTypeId: number, checked: boolean) => {
    setSelectedUnitWorkTypeId(checked ? unitWorkTypeId : null)
  }

  const handleWorkSkillChange = (workSkillId: number, checked: boolean) => {
    setSelectedWorkSkillId(checked ? workSkillId : null)
  }

  const handleCustomPackageChange = (customPackageId: number, checked: boolean) => {
    setSelectedCustomPackageId(checked ? customPackageId : null)
  }

  const handleClearAllFilters = () => {
    setSearchName("")
    setMinPrice("")
    setMaxPrice("")
    setSelectedUnitTypeId(null)
    setSelectedGovernorateId(null)
    setSelectedCityId(null)
    setSelectedUrgencyLevelId(null)
    setSelectedEngineerTypeId(null)
    setSelectedMaterialId(null)
    setSelectedWorkerTypeId(null)
    setMinUnitArea("")
    setMaxUnitArea("")
    setMinDuration("")
    setMaxDuration("")
    setSelectedUnitStatusId(null)
    setSelectedUnitWorkTypeId(null)
    setSelectedWorkSkillId(null)
    setSelectedCustomPackageId(null)
    setSelectedCompoundValue(null)
    setCurrentPage(0)
  }

  const activeFiltersCount =
    (searchName ? 1 : 0) +
    (selectedUnitTypeId ? 1 : 0) +
    (selectedGovernorateId ? 1 : 0) +
    (selectedCityId ? 1 : 0) +
    (selectedUrgencyLevelId ? 1 : 0) +
    (selectedEngineerTypeId ? 1 : 0) +
    (selectedMaterialId ? 1 : 0) +
    (selectedWorkerTypeId ? 1 : 0) +
    (minPrice || maxPrice ? 1 : 0) +
    (minUnitArea || maxUnitArea ? 1 : 0) +
    (minDuration || maxDuration ? 1 : 0) +
    (selectedUnitStatusId ? 1 : 0) +
    (selectedUnitWorkTypeId ? 1 : 0) +
    (selectedWorkSkillId ? 1 : 0) +
    (selectedCustomPackageId ? 1 : 0) +
    (selectedCompoundValue !== null ? 1 : 0)

  // Create a mock business type for the dynamic filter sidebar
  const mockBusinessType = {
    id: 1,
    code: businessTypeCode,
    name: selectedServiceType,
  }

  // If showing My Asks, render the My Asks page
  if (showMyAsks) {
    return <MyAsksPage selectedServiceType={selectedServiceType} onBack={handleBackToBrowse} />
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <div className="w-full max-w-[1920px] mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 2xl:px-12 py-4 sm:py-6 lg:py-8">
        {/* Search Bar */}
        <div className="flex justify-center mb-4 sm:mb-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="relative w-full max-w-3xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-colors duration-300" />
            <Input
              type="text"
              placeholder="What are you looking for?"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="pl-12 pr-4 py-3 w-full rounded-full border-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:shadow-lg transition-all duration-300 hover:shadow-md text-base"
            />
          </div>
        </div>

        {/* Mobile Filter Button */}
        <div className="flex justify-end mb-4 lg:hidden animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="bg-transparent hover:bg-gray-50 hover:scale-105 transition-all duration-300"
              >
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
                <DynamicFilterSidebar
                  selectedBusinessType={mockBusinessType}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  minUnitArea={minUnitArea}
                  maxUnitArea={maxUnitArea}
                  minDuration={minDuration}
                  maxDuration={maxDuration}
                  selectedUnitTypeId={selectedUnitTypeId}
                  selectedGovernorateId={selectedGovernorateId}
                  selectedCityId={selectedCityId}
                  selectedUrgencyLevelId={selectedUrgencyLevelId}
                  selectedEngineerTypeId={selectedEngineerTypeId}
                  selectedMaterialId={selectedMaterialId}
                  selectedWorkerTypeId={selectedWorkerTypeId}
                  onMinPriceChange={setMinPrice}
                  onMaxPriceChange={setMaxPrice}
                  onMinUnitAreaChange={setMinUnitArea}
                  onMaxUnitAreaChange={setMaxUnitArea}
                  onMinDurationChange={setMinDuration}
                  onMaxDurationChange={setMaxDuration}
                  onUnitTypeChange={handleUnitTypeChange}
                  onGovernorateChange={handleGovernorateChange}
                  onCityChange={handleCityChange}
                  onUrgencyLevelChange={handleUrgencyLevelChange}
                  onEngineerTypeChange={handleEngineerTypeChange}
                  onMaterialChange={handleMaterialChange}
                  onWorkerTypeChange={handleWorkerTypeChange}
                  onClearFilters={handleClearAllFilters}
                  activeFiltersCount={activeFiltersCount}
                  idPrefix="mobile"
                  selectedUnitStatusId={selectedUnitStatusId}
                  selectedUnitWorkTypeId={selectedUnitWorkTypeId}
                  selectedWorkSkillId={selectedWorkSkillId}
                  onUnitStatusChange={handleUnitStatusChange}
                  onUnitWorkTypeChange={handleUnitWorkTypeChange}
                  onWorkSkillChange={handleWorkSkillChange}
                  selectedCustomPackageId={selectedCustomPackageId}
                  selectedCompoundValue={selectedCompoundValue}
                  onCustomPackageChange={handleCustomPackageChange}
                  onCompoundChange={setSelectedCompoundValue}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 xl:gap-10">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-64 xl:w-72 2xl:w-80 shrink-0 animate-in fade-in slide-in-from-left-4 duration-700 delay-300">
            <div className="sticky top-4">
              <DynamicFilterSidebar
                selectedBusinessType={mockBusinessType}
                minPrice={minPrice}
                maxPrice={maxPrice}
                minUnitArea={minUnitArea}
                maxUnitArea={maxUnitArea}
                minDuration={minDuration}
                maxDuration={maxDuration}
                selectedUnitTypeId={selectedUnitTypeId}
                selectedGovernorateId={selectedGovernorateId}
                selectedCityId={selectedCityId}
                selectedUrgencyLevelId={selectedUrgencyLevelId}
                selectedEngineerTypeId={selectedEngineerTypeId}
                selectedMaterialId={selectedMaterialId}
                selectedWorkerTypeId={selectedWorkerTypeId}
                onMinPriceChange={setMinPrice}
                onMaxPriceChange={setMaxPrice}
                onMinUnitAreaChange={setMinUnitArea}
                onMaxUnitAreaChange={setMaxUnitArea}
                onMinDurationChange={setMinDuration}
                onMaxDurationChange={setMaxDuration}
                onUnitTypeChange={handleUnitTypeChange}
                onGovernorateChange={handleGovernorateChange}
                onCityChange={handleCityChange}
                onUrgencyLevelChange={handleUrgencyLevelChange}
                onEngineerTypeChange={handleEngineerTypeChange}
                onMaterialChange={handleMaterialChange}
                onWorkerTypeChange={handleWorkerTypeChange}
                onClearFilters={handleClearAllFilters}
                activeFiltersCount={activeFiltersCount}
                idPrefix="desktop"
                selectedUnitStatusId={selectedUnitStatusId}
                selectedUnitWorkTypeId={selectedUnitWorkTypeId}
                selectedWorkSkillId={selectedWorkSkillId}
                onUnitStatusChange={handleUnitStatusChange}
                onUnitWorkTypeChange={handleUnitWorkTypeChange}
                onWorkSkillChange={handleWorkSkillChange}
                selectedCustomPackageId={selectedCustomPackageId}
                selectedCompoundValue={selectedCompoundValue}
                onCustomPackageChange={handleCustomPackageChange}
                onCompoundChange={setSelectedCompoundValue}
              />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 min-h-[600px]">
            {/* Category Navigation */}
            <div className="mb-6">
              <CategoryNavigation
                onCategoryChange={handleServiceTypeChange}
                onMyAsksClick={handleMyAsksClick}
                showMyAsksButton={true}
                activeServiceType={selectedServiceType}
              />
            </div>

            {/* Content Area */}
            <div className="space-y-6">
              {/* Active Filters */}
              <ActiveFilters
                searchName={searchName}
                selectedUnitTypeIds={selectedUnitTypeId ? [selectedUnitTypeId] : []}
                selectedGovernorateIds={selectedGovernorateId ? [selectedGovernorateId] : []}
                selectedCityIds={selectedCityId ? [selectedCityId] : []}
                selectedUrgencyLevelIds={selectedUrgencyLevelId ? [selectedUrgencyLevelId] : []}
                selectedEngineerTypeIds={selectedEngineerTypeId ? [selectedEngineerTypeId] : []}
                minPrice={minPrice}
                maxPrice={maxPrice}
                unitTypes={unitTypes}
                governorates={governorates}
                cities={cities}
                urgencyLevels={urgencyLevels}
                engineerTypes={engineerTypes}
                onClearSearch={() => setSearchName("")}
                onClearUnitType={() => setSelectedUnitTypeId(null)}
                onClearGovernorate={() => setSelectedGovernorateId(null)}
                onClearCity={() => setSelectedCityId(null)}
                onClearUrgencyLevel={() => setSelectedUrgencyLevelId(null)}
                onClearEngineerType={() => setSelectedEngineerTypeId(null)}
                onClearPriceRange={() => {
                  setMinPrice("")
                  setMaxPrice("")
                }}
                onClearAllFilters={handleClearAllFilters}
              />

              {/* Products Grid */}
              {isProductsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 xl:gap-7 mb-8">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 rounded-lg h-64"></div>
                    </div>
                  ))}
                </div>
              ) : isError ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Error loading products. Please try again.</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No products found matching your criteria.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 xl:gap-7 mb-8">
                  {products.map((product, index) => (
                    <div
                      key={product.id}
                      className="animate-in fade-in slide-in-from-bottom-8 duration-700"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
