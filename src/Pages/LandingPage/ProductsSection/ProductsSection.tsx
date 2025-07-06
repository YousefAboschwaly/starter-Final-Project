import BrandSection from "../BrandsSection/BrandsSection"
import Category from "../CategoryProducts/Category"
import Recommended from "../RecommendedSection/Recommended"
import type { ProductsData } from "../LandingPage"

interface ProductsSectionProps {
  productsData: ProductsData
}

export default function ProductsSection({ productsData }: ProductsSectionProps) {
  console.log(productsData)
  return (
    <div className=" mx-auto py-8 px-4 max-w-[86rem] bg-white">
      <Recommended products={productsData.recommendedForYou} />
      <BrandSection />
      <Category highestRatedProducts={productsData.highestRated} topBestSellerProducts={productsData.topBestSeller} />
    </div>
  )
}
