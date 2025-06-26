"use client";

import { useState, useMemo, useEffect, useCallback, useContext } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import axios from "axios";

// Import all the separated components
import { SearchBar } from "./SearchBar";
import { FilterSidebar } from "./FilterSidebar";
import { ProductCard } from "./ProductCard";
import { Pagination } from "./Pagination";
import { LoadingSpinner } from "./LoadingSpinner";
import { ActiveFilters } from "./ActiveFilters";
import { EmptyState } from "./EmptyState";
import { UserContext } from "@/Contexts/UserContext";
import { Toaster } from "react-hot-toast";

// Types for API data
interface Color {
  id: number;
  code: string;
  name: string;
  hexColor: string;
}

interface Material {
  id: number;
  code: string;
  name: string;
}

interface BusinessType {
  id: number;
  code: string;
  name: string;
}

interface BusinessTypeCategory {
  id: number;
  code: string;
  name: string;
  businessType: BusinessType;
}

interface Product {
  id: number;
  name: string;
  price: number;
  imagePath: string;
  rate: number;
}

export default function ShopNow() {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }
  const { userToken, pathUrl } = userContext;

  // Filter states
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedColorIds, setSelectedColorIds] = useState<number[]>([]);
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<number[]>([]);
  const [selectedBusinessTypeIds, setSelectedBusinessTypeIds] = useState<
    number[]
  >([]);
  const [selectedBusinessCategoryIds, setSelectedBusinessCategoryIds] =
    useState<number[]>([]);
  const [searchName, setSearchName] = useState("");

  // UI states
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [isFiltering, setIsFiltering] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // API data states
  const [colors, setColors] = useState<Color[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [businessTypes, setBusinessTypes] = useState<BusinessType[]>([]);
  const [businessTypeCategories, setBusinessTypeCategories] = useState<
    BusinessTypeCategory[]
  >([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Fetch configuration data from API
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setIsLoadingConfig(true);
        const { data } = await axios.get(`${pathUrl}/api/v1/business-config`, {
          headers: {
            "Accept-Language": "en",
            Authorization: `Bearer ${userToken}`,
          },
        });
        console.log("Config data:", data);

        if (data && data.success) {
          setColors(data.data.colors || []);
          setMaterials(data.data.productMaterial || []);
          setBusinessTypes(data.data.businessTypes || []);
          setBusinessTypeCategories(data.data.businessTypeCategories || []);
        }
      } catch (error) {
        console.error("Error fetching configuration:", error);
        // Fallback to empty arrays if API fails
        setColors([]);
        setMaterials([]);
        setBusinessTypes([]);
        setBusinessTypeCategories([]);
      } finally {
        setIsLoadingConfig(false);
      }
    };

    fetchConfig();
  }, [pathUrl, userToken]);

  // Fetch products from API with filters
  const fetchProducts = useCallback(
    async (pageNumber = 0) => {
      try {
        setIsLoadingProducts(true);
        const requestBody = {
          pageNumber: pageNumber,
          pageSize: 12,
          searchCriteria: {
            name: searchName || "",
            materialIds:
              selectedMaterialIds.length > 0 ? selectedMaterialIds : null,
            colorIds: selectedColorIds.length > 0 ? selectedColorIds : null,
            minPrice:
              minPrice && minPrice !== "" ? Number.parseInt(minPrice) : null,
            maxPrice: maxPrice !== "" ? Number.parseInt(maxPrice) : null,
            businessTypeId:
              selectedBusinessTypeIds.length > 0
                ? selectedBusinessTypeIds[0]
                : null,
            businessTypeCategoryId:
              selectedBusinessCategoryIds.length > 0
                ? selectedBusinessCategoryIds[0]
                : null,
          },
        };

        console.log("Fetching products with request body:", requestBody);

        const { data } = await axios.post(
          `${pathUrl}/api/v1/products/shop-now`,
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
              "Content-Type": "application/json",
              "Accept-Language": "en",
              "Content-Language": "en",
            },
          }
        );

        console.log("Products data:", data);

        if (data && data.success) {
          setProducts(data.data.content || []);
          setTotalPages(data.data.totalPages || 1);
        } else {
          setProducts([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setTotalPages(1);
      } finally {
        setIsLoadingProducts(false);
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
    ]
  );

  // Get available business categories based on selected business types
  const availableBusinessCategories = useMemo(() => {
    if (selectedBusinessTypeIds.length === 0) {
      return businessTypeCategories;
    }
    return businessTypeCategories.filter((category) =>
      selectedBusinessTypeIds.includes(category.businessType.id)
    );
  }, [selectedBusinessTypeIds, businessTypeCategories]);

  // Clear business categories when business types change
  useEffect(() => {
    setSelectedBusinessCategoryIds((prev) =>
      prev.filter((categoryId) =>
        availableBusinessCategories.some(
          (available) => available.id === categoryId
        )
      )
    );
  }, [availableBusinessCategories]);

  // Fetch products when filters change
  useEffect(() => {
    if (!isLoadingConfig) {
      setCurrentPage(0);
      fetchProducts(0);
    }
  }, [fetchProducts, isLoadingConfig]);

  // Loading effect for filtering
  useEffect(() => {
    setIsFiltering(true);
    const timer = setTimeout(() => setIsFiltering(false), 300);
    return () => clearTimeout(timer);
  }, [isLoadingProducts]);

  // Handler functions
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProducts(page);
  };

  const handlePriceFilter = useCallback(() => {
    setCurrentPage(0);
    fetchProducts(0);
  }, [fetchProducts]);

  const handleColorChange = useCallback((colorId: number, checked: boolean) => {
    if (checked) {
      setSelectedColorIds((prev) => [...prev, colorId]);
    } else {
      setSelectedColorIds((prev) => prev.filter((id) => id !== colorId));
    }
  }, []);

  const handleMaterialChange = useCallback(
    (materialId: number, checked: boolean) => {
      if (checked) {
        setSelectedMaterialIds((prev) => [...prev, materialId]);
      } else {
        setSelectedMaterialIds((prev) =>
          prev.filter((id) => id !== materialId)
        );
      }
    },
    []
  );

  const handleBusinessTypeChange = useCallback(
    (businessTypeId: number, checked: boolean) => {
      if (checked) {
        setSelectedBusinessTypeIds((prev) => [...prev, businessTypeId]);
      } else {
        setSelectedBusinessTypeIds((prev) =>
          prev.filter((id) => id !== businessTypeId)
        );
      }
    },
    []
  );

  const handleBusinessCategoryChange = useCallback(
    (businessCategoryId: number, checked: boolean) => {
      if (checked) {
        setSelectedBusinessCategoryIds((prev) => [...prev, businessCategoryId]);
      } else {
        setSelectedBusinessCategoryIds((prev) =>
          prev.filter((id) => id !== businessCategoryId)
        );
      }
    },
    []
  );

  const toggleWishlist = useCallback((productId: number) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  }, []);

  const clearFilters = useCallback(() => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedColorIds([]);
    setSelectedMaterialIds([]);
    setSelectedBusinessTypeIds([]);
    setSelectedBusinessCategoryIds([]);
    setSearchName("");
    setCurrentPage(0);
  }, []);

  const activeFiltersCount =
    selectedColorIds.length +
    selectedMaterialIds.length +
    selectedBusinessTypeIds.length +
    selectedBusinessCategoryIds.length +
    (minPrice !== "" || maxPrice !== "" ? 1 : 0) +
    (searchName !== "" ? 1 : 0);

  if (isLoadingConfig) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner message="Loading configuration..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-blue-50/30  ">
      <div className="container mx-auto px-4 py-8 ">
        {/* Search Bar */}
        <SearchBar searchName={searchName} onSearchChange={setSearchName} />

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
              <Button
                variant="outline"
                className="md:hidden hover:scale-105 transition-transform duration-200 shadow-lg"
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
                <SheetDescription>
                  Filter products by various criteria
                </SheetDescription>
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
                  onClearFilters={clearFilters}
                  activeFiltersCount={activeFiltersCount}
                  idPrefix="mobile"
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8">
          {/* Fixed Desktop Sidebar */}
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
                onClearFilters={clearFilters}
                activeFiltersCount={activeFiltersCount}
                idPrefix="desktop"
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
            />

            {/* Content Area */}
            <div className="relative min-h-[500px]">
              {/* Loading overlay */}
              {(isFiltering || isLoadingProducts) && (
                <LoadingSpinner message="Loading products..." isOverlay />
              )}

              {/* Products Grid or No Products Message */}
              {products.length > 0 ? (
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-all duration-500 ${
                    isFiltering || isLoadingProducts
                      ? "opacity-30 scale-95"
                      : "opacity-100 scale-100"
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
                <EmptyState onClearFilters={clearFilters} />
              ) : null}
            </div>

            {/* Pagination */}
            {products.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
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
    </div>
  );
}
