import type { IProductsResponse } from "@/interfaces"
import { useProductData } from "@/lib/product-data"

// You might need to adjust this URL based on your environment
const API_URL = "https://home4u.gosoftcloud.com/api/v1"
// const BUSINESS_ID = 15 // Mandatory business ID as shown in the API spec

export interface FilterCriteria {
  minPrice: number | null
  maxPrice: number | null
  colorsIds: number[] | null
  businessTypeIds: number[] | null
  name?: string // Added name parameter for search
}

// The actual colors data from the provided JSON
export function useBusinessTypes() {
  const { businessTypes } = useProductData()
  return businessTypes
}

export async function fetchProducts(
  pageNumber = 0,
  pageSize = 9,
  filterCriteria: FilterCriteria = { minPrice: null, maxPrice: null, colorsIds: null, businessTypeIds: null },
  searchQuery = "",
): Promise<IProductsResponse> {
  try {
    // Prepare the request payload exactly as shown in the API spec
    const payload = {
      pageNumber,
      pageSize,
      searchCriteria: {
        businessId: Number(localStorage.getItem("user-business-id")), // Mandatory
        minPrice: filterCriteria.minPrice,
        maxPrice: filterCriteria.maxPrice,
        colorsIds: filterCriteria.colorsIds,
        businessTypeIds: filterCriteria.businessTypeIds,
        name: searchQuery, // Add the search query as the name parameter
      },
    }

    console.log("Sending request to API:", JSON.stringify(payload, null, 2))

    const response = await fetch(`${API_URL}/products/filter`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("userToken"),
        "Content-Type": "application/json",
        "Accept-Language": "en",
        "Content-Language": "en", // Specifies language of request content
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    console.log(data)
    return data as IProductsResponse
  } catch (error) {
    console.error("Error fetching products:", error)

    // Return a properly structured error response with all required properties
    return {
      data: {
        content: [],
        totalElements: 0,
        totalPages: 0,
        pageable: {
          pageNumber: pageNumber,
          pageSize: pageSize,
          sort: { empty: true, sorted: false, unsorted: true },
          offset: 0,
          paged: true,
          unpaged: false,
        },
        last: true,
        size: pageSize,
        number: pageNumber,
        sort: {
          empty: true,
          sorted: false,
          unsorted: true,
        },
        numberOfElements: 0,
        first: true,
        empty: true,
      },
    }
  }
}

export async function deleteProduct(id: number): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("userToken"),
        "Content-Type": "application/json",
        "Accept-Language": "en",
        "Content-Language": "en", // Specifies language of request content
      },
    })
    return response.ok
  } catch (error) {
    console.error("Error deleting product:", error)
    return false
  }
}

