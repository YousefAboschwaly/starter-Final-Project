import {
  BadgeCheck,
  Ban,
  ChevronRight,
  Clock3,
  Home,
  PercentCircle,
  RotateCcw,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
type SellerDetailsProps = {
  Seller: {
    image: string;
    name: string;
    price: number;
    seller: string;
    rating: number;
    returnPolicy: string;
    ratingPercentage: number;
  };
};

const ProductRecommendations = ({ Seller }: SellerDetailsProps) => {
  return (
    <div className=" border-gray-300 mt-8 pt-4">
      <div className="space-y-4 ">
        {/* Product Name and Price */}
        <div className="border border-gray-300 rounded-lg p-1 bg-white">
          <div className="flex items-center space-x-4">
            <img
              src={Seller.image}
              alt={Seller.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex justify-between items-center w-full">
              <h5 className="text-xl text-gray-800">{Seller.name}</h5>
              <span className="text-lg text-gray-700">
                EGP <span className="font-bold">{Seller.price}</span>{" "}
              </span>
            </div>
          </div>
        </div>
        <h2 className="font-bold text-lg">SELLER </h2>

        <Link to="/bestsellers" className="block">
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            {/* first section*/}
            <div className="flex items-center justify-between px-3 py-5 cursor-pointer">
              <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>

              <span className="text-sm text-gray-800 font-medium flex-grow ml-4">
                Sold by {Seller.seller}
                <br />
                <span className="text-white bg-green-700 px-2 rounded-xl">
                  {Seller.rating}
                </span>
                <span className="font-bold">
                  {" "}
                  ({Seller.ratingPercentage}% Positive Ratings)
                </span>
              </span>

              <ChevronRight className="w-6 h-6 text-gray-500" />
            </div>

            <hr className="w-full border-t border-gray-300" />

            {/* sec section*/}
            <div className="bg-gray-50 px-4 py-5 grid grid-cols-2 gap-y-6 gap-x-4">
              <div className="flex items-center space-x-2">
                <BadgeCheck className="text-green-600 w-5 h-5" />
                <span className="text-sm text-gray-700 font-bold">
                  Partner Since
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <PercentCircle className="text-yellow-600 w-5 h-5" />
                <span className="text-sm text-gray-700 font-bold">
                  Item as Described
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock3 className="text-blue-600 w-5 h-5" />
                <span className="text-sm text-gray-700 font-bold">
                  Great Recent Rating
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <RotateCcw className="text-red-600 w-5 h-5" />
                <span className="text-sm text-gray-700 font-bold">
                  Low Return Seller
                </span>
              </div>
            </div>
          </div>
        </Link>

        <Link to="/combined-section" className="block">
          <div className="border border-gray-300 rounded-lg overflow-hidden">
            {/* First Section - Free Delivery */}
            <div className="flex items-center justify-between px-3 py-5 cursor-pointer">
              <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-gray-800 font-medium flex-grow ml-4">
                Free delivery on Pickup Points
              </span>
              <ChevronRight className="w-6 h-6 text-gray-500" />
            </div>

            {/* Line Separator */}
            <hr className="w-full border-t border-gray-300" />

            {/* Second Section - Not Eligible for Return */}
            <div className="flex items-center justify-between px-3 py-5 cursor-pointer">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <Ban className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-gray-800 font-medium flex-grow ml-4">
                This item is not eligible for return
              </span>
              <ChevronRight className="w-6 h-6 text-gray-500" />
            </div>
          </div>
        </Link>

      </div>
    </div>
  );
};

export default ProductRecommendations;
