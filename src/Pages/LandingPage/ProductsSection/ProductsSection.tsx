import BrandSection from "../BrandsSection/BrandsSection"
import Category from "../CategoryProducts/Category"
import Recommended from "../RecommendedSection/Recommended"
import type { ProductsData, Engineer } from "../LandingPage"
import TopEngineersSection from "../TopEngineers/TopEngineersSection"

interface ProductsSectionProps {
  productsData: ProductsData
  topEngineers: Engineer[]
}

export default function ProductsSection({ productsData, topEngineers }: ProductsSectionProps) {
  console.log(productsData)
  return (
    <div className="max-w-[88.5rem] mx-auto px-4 py-8  bg-white">
      <Recommended products={productsData.recommendedForYou} />
      <BrandSection />
      <Category highestRatedProducts={productsData.highestRated} topBestSellerProducts={productsData.topBestSeller} />
      <TopEngineersSection engineers={topEngineers} />
    </div>
  )
}
