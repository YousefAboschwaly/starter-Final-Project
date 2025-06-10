import CustomersViewed from '@/MyComponents/ViewDetails/CustomersViewed';
import ProductDetails from '@/MyComponents/ViewDetails/ProductDetails';
import ProductFeatures from '@/MyComponents/ViewDetails/ProductFeatures';
import ProductGallery from '@/MyComponents/ViewDetails/ProductGallery';
import ProductOverview from '@/MyComponents/ViewDetails/ProductOverview';
import ProductRecommendations from '@/MyComponents/ViewDetails/ProductRecommendations ';
import ProductReviews from '@/MyComponents/ViewDetails/ProductReviews';

const sampleImages = [
  "https://i.pinimg.com/originals/64/1e/f7/641ef7fe4ef28cb13e2bd491e8f049c6.jpg",
  "https://m.media-amazon.com/images/I/618MwWZziYL.jpg",
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bW9iaWxlJTIwcGhvbmV8ZW58MHx8MHx8fDA%3D&ixlib=rb-4.0.3&q=60&w=3000",
  "https://m.media-amazon.com/images/I/618MwWZziYL.jpg",
  "https://m.media-amazon.com/images/I/618MwWZziYL.jpg",
  "https://i.pinimg.com/originals/64/1e/f7/641ef7fe4ef28cb13e2bd491e8f049c6.jpg",
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bW9iaWxlJTIwcGhvbmV8ZW58MHx8MHx8fDA%3D&ixlib=rb-4.0.3&q=60&w=3000",
  "https://m.media-amazon.com/images/I/618MwWZziYL.jpg",
];

const productData = {
  name: "Black Kharaz Tea 250g",
  brand: "Lipton",
  rating: 4.5,
  price: 69.95,
  originalPrice: 85.00,
  saving: 15.05,
  discountPercentage: 17,
  rank: 2,
  category: "Leaf & Dust Tea",
  shipping: "Get it Tomorrow",
  deliveryTime: "Order in 4 h 9 m",
  installment: "Pay 6 monthly payments of EGP 20.00",
};
const SellerData = {
    name: "Lipton Black Tea 500g",
    price: 94.95,
    seller: "noon Grocery",
    rating: 4.5,
    returnPolicy: "Non-returnable",
    ratingPercentage: 84,
  };
const Viewdetails = () => {
    return (
        <>
          <div className="container mx-auto py-4 px-6 max-w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Section 1: Images + Add to Cart */}
            <section className="col-span-1">
              <ProductGallery images={sampleImages} />
            </section>
      
            {/* Section 2: Product Info */}
            <section className="col-span-1">
              <ProductDetails product={productData} />
            </section>
      
            {/* Section 3: Suggested Products or Shipping/Reviews */}
            <section className="col-span-1">
            <ProductRecommendations Seller={SellerData} />
            </section>
          </div>
          <div className='mt-6'>
            <ProductOverview />
          </div>
          <div className='mt-6 mb-[50px]'>
            <ProductFeatures />
          </div>
          <div className='mt-6 mb-[50px]'>
            <ProductReviews />
          </div>
          <div className='mt-6 mb-[50px]'>
            <CustomersViewed />
          </div>
        </div>
 
        </>
      
      );
      
};

export default Viewdetails;
