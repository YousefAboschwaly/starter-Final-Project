import ProductContainer from "../RecommendedSection/ProductContainer";
import CategoryProducts from "./CategoryProducts";

export default function Category() {
  return (
    <div>
      <CategoryProducts/>
        <main className=" mx-auto py-8 w-full ">
          <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-gray-800">The BestFurniture</h2>
        <button className="border border-gray-800 px-6 py-2 text-gray-800 hover:bg-gray-800 hover:text-white transition-colors duration-300">
          SHOP NOW
        </button>
      </div>

    <ProductContainer/>
      
    </main>
    </div>
  )
}
