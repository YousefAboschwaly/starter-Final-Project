"use client";

import useProductById from "@/hooks/useProductById";
import ProductDetails from "@/MyComponents/ViewDetails/ProductDetails";
import ProductFeatures from "@/MyComponents/ViewDetails/ProductFeatures";
import ProductGallery from "@/MyComponents/ViewDetails/ProductGallery";
import ProductOverview from "@/MyComponents/ViewDetails/ProductOverview";
import ProductReviews from "@/MyComponents/ViewDetails/ProductReviews";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import ProductRecommendations from "@/MyComponents/ViewDetails/ProductRecommendations ";
import { useContext, useEffect } from "react";
import { UserContext } from "@/Contexts/UserContext";
import { Toaster } from "react-hot-toast";
import useVisitProduct from "@/hooks/useVisitProduct";

const Viewdetails = () => {
  const userContext = useContext(UserContext);
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }
  const { pathUrl,userToken } = userContext;
  const { id } = useParams<{ id: string }>();
  const { product, isLoading, error, isError } = useProductById(Number(id));
  console.log(`Product Data:`, product);
  console.log(`Is Loading: ${isLoading}`);
  console.log(`Product ID: ${id}`);
  const { visitProduct, isVisiting, visitError } = useVisitProduct()

  // Track product visit when component mounts and product is loaded
  useEffect(() => {
    if (product && id && userToken) {
      console.log(`Tracking visit for product ${id}`)
      visitProduct(Number(id))
    }
  }, [product, id, userToken, visitProduct])

  // Log visit tracking status
  useEffect(() => {
    if (visitError) {
      console.error("Visit tracking failed:", visitError)
    }
  }, [visitError])
  if (isLoading) {
    return (
      <div className="container mx-auto py-4 px-6 max-w-full">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading product details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto py-4 px-6 max-w-full">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Product Not Found
            </h2>
            <p className="text-gray-600">
              {typeof error === "string"
                ? error
                : "The product you are looking for could not be found."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const productData = product;

  // Transform API data for ProductDetails component
  const transformedProductDetails = {
    name: productData.nameEn || productData.nameAr || "Product Name",
    brand: productData.businessType?.name || "Brand",
    rating: 4.5, // Default rating since not in API
    price: productData.price || 0,
    originalPrice: productData.price ? productData.price * 1.2 : 0, // Calculated original price
    saving: productData.price ? productData.price * 0.2 : 0, // Calculated saving
    discountPercentage: 17, // Default discount
    rank: 2, // Default rank
    category: productData.businessType?.name || "Category",
    shipping: "Get it Tomorrow",
    deliveryTime: "Order in 4 h 9 m",
    installment: `Pay 6 monthly payments of EGP ${(
      productData.price / 6
    ).toFixed(2)}`,
  };

  // Transform API data for ProductGallery component
  const transformedImages =
    productData.imagePaths?.length > 0
      ? productData.imagePaths.map((img) => {
          return pathUrl + img.imagePath;
        })
      : []; // Fallback images

  // Transform API data for ProductOverview component
  const transformedOverview = {
    description:
      productData.descriptionEn ||
      productData.descriptionAr ||
      "No description available",
    highlights: [
      `Made with high-quality materials: ${
        productData.materials?.map((m) => m.name).join(", ") ||
        "Various materials"
      }`,
      `Dimensions: ${productData.length}x${productData.width}x${
        productData.height
      } ${productData.baseUnit?.name || "units"}`,
      `Category: ${productData.businessType?.name || "General"}`,
      "High-quality construction and design",
    ],
    specifications: [
      ["Product ID", productData.id?.toString() ?? "N/A"] as [string, string],
      ["Category", productData.businessType?.name || "N/A"] as [string, string],
      [
        "Materials",
        productData.materials?.map((m) => m.name).join(", ") || "N/A",
      ] as [string, string],
      [
        "Dimensions",
        `${productData.length} x ${productData.width} x ${productData.height} ${
          productData.baseUnit?.name || ""
        }`,
      ] as [string, string],
      [
        "Available Colors",
        productData.stocks?.map((s) => s.color.name).join(", ") || "N/A",
      ] as [string, string],
      [
        "Total Stock",
        productData.stocks
          ?.reduce((sum, stock) => sum + stock.amount, 0)
          .toString() || "0",
      ] as [string, string],
    ],
  };

  // Transform API data for ProductRecommendations component
  const transformedSellerData = {
    image:
      pathUrl + productData.imagePaths?.[0]?.imagePath ||
      "https://via.placeholder.com/150",
    name: productData.nameEn || productData.nameAr || "Product Name",
    price: productData.price || 0,
    seller: "Product Seller", // Default since not in API
    rating: 4.5, // Default rating
    returnPolicy: "Standard Return Policy",
    ratingPercentage: 84, // Default percentage
  };

  
  if (isLoading) {
    return (
      <div className="container mx-auto py-4 px-6 max-w-full">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-gray-600">Loading product details...</p>
            {isVisiting && <p className="text-sm text-gray-500">Tracking product visit...</p>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="container mx-auto py-4 px-6 max-w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Section 1: Images + Add to Cart */}
          <section className="col-span-1">
            <ProductGallery
              images={transformedImages}
              id={Number(id) || 0}
              price={product.price}
              name={product.nameEn || product.nameAr}
            />
          </section>

          {/* Section 2: Product Info */}
          <section className="col-span-1">
            <ProductDetails product={transformedProductDetails} />
          </section>

          {/* Section 3: Suggested Products or Shipping/Reviews */}
          <section className="col-span-1">
            <ProductRecommendations Seller={transformedSellerData} />
          </section>
        </div>

        <div className="mt-6">
          <ProductOverview
            description={transformedOverview.description}
            highlights={transformedOverview.highlights}
            specifications={transformedOverview.specifications}
          />
        </div>

        <div className="mt-6 mb-[50px]">
          <ProductFeatures images={transformedImages} />
        </div>

        <div className="mt-6 mb-[50px]">
          <ProductReviews productId={Number(id)} />
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
    </>
  );
};

export default Viewdetails;
