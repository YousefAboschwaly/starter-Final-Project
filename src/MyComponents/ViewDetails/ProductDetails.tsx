import { ChevronRight, HandCoins, RotateCcw, Star, Truck } from "lucide-react";
import { Link } from "react-router-dom";
type ProductDetailsProps = {
  product: {
    name: string;
    brand: string;
    rating: number;
    price: number;
    originalPrice: number;
    saving: number;
    discountPercentage: number;
    rank: number;
    category: string;

    shipping: string;
    deliveryTime: string;
    installment: string;
  };
};

export default function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="space-y-6 p-6">
      <Link
        to="/best-sellers-page"
        className="inline-block bg-gray-200 rounded-full overflow-hidden"
      >
        <div className="flex flex-col">
          {/* Category Text */}
          <div className="text-gray-800 text-sm font-medium   inline-flex items-center justify-center space-x-1 text-center">
            <span className="bg-gray-800 text-white text-xs font-bold px-3 py-2 rounded-full">
              Best Seller
            </span>

            <span className="px-[4px]">in {product.category}</span>
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </Link>

      {/* Product Name and Brand */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex flex-col">
          <Link
            to="/brand-page"
            className="text-2xl font-bold mb-2 text-gray-400"
          >
            {product.brand}
          </Link>

          <h3 className="text-xl font-semibold text-gray-700">
            {product.name}
          </h3>

          {/* Rating section */}
          <Link
            to="/ratings-page"
            className="flex items-center space-x-2 mt-2 cursor-pointer text-2xl"
          >
            <span className="text-green-700">
              {"★".repeat(Math.floor(product.rating))}
              {"☆".repeat(5 - Math.floor(product.rating))}
            </span>
            <span className="ml-2 text-gray-500">{product.rating}</span>
          </Link>
        </div>
      </div>

      {/* Price and Discount */}
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-xl font-bold text-gray-800">
          EGP {product.price.toFixed(2)}
        </span>
        <span className="text-sm line-through text-gray-500">
          EGP {product.originalPrice.toFixed(2)}
        </span>
        <p className="text-sm text-gray-500">Inclusive of VAT</p>
      </div>

      {/* Savings and Discount Percentage */}
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-green-600 font-semibold">
          Saving: EGP {product.saving.toFixed(2)}
        </span>
        <span className="text-green-600 font-semibold">
          ({product.discountPercentage}% Off)
        </span>
      </div>

      {/* Rank and Category */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
        <div className="w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center">
          <Star className="w-3 h-3 text-white" />
        </div>
        <span>
          #{product.rank} in{" "}
          <span className="font-semibold text-gray-800">
            {product.category}
          </span>
        </span>
      </div>

      {/* Shipping Details */}
      <div className="text-sm text-gray-800 font-bold mb-4">
        {product.shipping}{" "}
        <span className="text-gray-600 font-bold">
          ( {product.deliveryTime} )
        </span>
      </div>

      {/* Delivery, Seller Rating, Returns, and Payment Method */}
      <div className="border rounded-lg p-4 flex justify-between text-center mb-6">
        <div className="flex flex-col items-center space-y-1">
          <Truck className="w-6 h-6 text-blue-600" />
          <span className="text-xs text-gray-800">Delivery by noon</span>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <Star className="w-6 h-6 text-yellow-500" />
          <span className="text-xs text-gray-800">High Rated Seller</span>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <RotateCcw className="w-6 h-6 text-green-600" />
          <span className="text-xs text-gray-800">Low Returns</span>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <HandCoins className="w-6 h-6 text-purple-600" />
          <span className="text-xs text-gray-800">Cash on Delivery</span>
        </div>
      </div>

      {/* Bestsellers Link */}
      <div className="border border-gray-300 rounded-lg p-3 hover:border-gray-900">
        <Link
          to="/bestsellers"
          className="flex items-center justify-between p-3 cursor-pointer rounded-lg"
        >
          {/* Icon container */}
          <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center">
            <Star className="w-6 h-6 text-white" />
          </div>

          {/* Text with link */}
          <span className="text-sm text-gray-800 font-medium flex-grow ml-2">
            Ranked #{product.rank} in{" "}
            <span className="font-semibold">{product.category}</span>
            <br />
            Explore other bestsellers
          </span>

          {/* Chevron icon at the end */}
          <ChevronRight className="w-6 h-6 text-gray-500" />
        </Link>
      </div>
    </div>
  );
}
