import ProductContainer from "../RecommendedSection/ProductContainer";
import CategoryProducts from "./CategoryProducts";
import type { ApiProduct } from "../LandingPage";
import { Link } from "react-router-dom";

interface CategoryProps {
  highestRatedProducts: ApiProduct[];
  topBestSellerProducts: ApiProduct[];
}

export default function Category({
  topBestSellerProducts,
  highestRatedProducts,
}: CategoryProps) {
  return (
    <div>
      <main className=" mx-auto py-8 w-full ">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-800">
            The Top BestSeller
          </h2>
          <Link
            to="/Ask?type=shop"
            className="border border-gray-800 px-6 py-2 text-gray-800 hover:bg-gray-800 hover:text-white transition-colors duration-300"
          >
            SHOP NOW
          </Link>
        </div>

        <ProductContainer products={topBestSellerProducts} />
        <CategoryProducts />

        <div className="flex justify-between items-center my-8">
          <h2 className="text-3xl font-semibold text-gray-800">
            The Highest Rated Products
          </h2>
          <Link
            to="/Ask?type=shop"
            className="border border-gray-800 px-6 py-2 text-gray-800 hover:bg-gray-800 hover:text-white transition-colors duration-300"
          >
            SHOP NOW
          </Link>
        </div>

        <ProductContainer products={highestRatedProducts} />
      </main>
    </div>
  );
}
