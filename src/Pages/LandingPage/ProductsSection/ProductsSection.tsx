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
    <div className="mx-auto py-8 px-4 max-w-[86rem] bg-white">
      <Recommended products={productsData.recommendedForYou} />
      <BrandSection />
      <Category highestRatedProducts={productsData.highestRated} topBestSellerProducts={productsData.topBestSeller} />
      <TopEngineersSection engineers={topEngineers} />
    </div>
  )
}
