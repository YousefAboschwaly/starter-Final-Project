import BrandSection from "../BrandsSection/BrandsSection";
import Category from "../CategoryProducts/Category";
import Recommended from "../RecommendedSection/Recommended";

export default function ProductsSection() {
  return (
    <div className=" mx-auto py-8 px-4 max-w-[86rem] bg-white">
        <Recommended/>
        <BrandSection/>
        <Category/>

    </div>
  )
}
