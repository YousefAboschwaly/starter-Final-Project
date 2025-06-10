

const ProductOverview = () => {
  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-lg px-6 pb-[80px] pt-[20px]">
      <h1 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">
        Product Overview
      </h1>

      <div className="flex flex-col md:flex-row gap-x-7">
        {/* Left Side: Overview + Highlights */}
        <div className="w-full md:w-1/2 space-y-7">
          {/* Highlights */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Highlights
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm break-words">
              <li>Made with high-quality sun-ripened tea leaves</li>
              <li>Natural ingredients offers rich and natural taste</li>
              <li>
                Full-bodied flavor offers an excellent taste to this beverage
              </li>
              <li>Specially crafted for lovers of Egyptian tea</li>
            </ul>
          </div>

          {/* Overview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Overview
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm break-words">
              Refresh your senses with the strong Lipton Yellow Label Kharaz
              Tea. It is made from high-quality sun-ripened tea leaves that
              offer an authentic taste. This kharaz tea is specially created for
              Egyptian tea lovers. Since 1880, nature has been our tea factory.
              Every cup of Lipton tea is grown using natural rain, wind and
              sunshine to give you our signature rich taste and aroma. What’s
              more, we believe that every cup of our tea should not only help
              brighten your day but help brighten the future of all our tea
              farmers and their families, and of course, our planet too. Lipton
              has always led the way for tea. From Sir Thomas Lipton's
              innovative Lipton tea estate to his exciting marketing promotions
              - Lipton has always been ahead of the curve. Lipton is doing more
              than ever to ensure that our refreshing tea tastes great not just
              today, but for years to come. Here at Lipton, nature is our
              factory. We harness the sun, wind and rain to ensure our every cup
              of tea is crafted with natural goodness to give you our signature
              delicious taste and aroma.
            </p>
          </div>
        </div>

        {/* Right Side: Specifications */}
        <div className="w-full md:w-1/2 border-t md:border-t-0 md:border-l border-gray-200 pt-7 md:pt-0 md:pl-7">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Specifications
          </h3>
          <div className="text-sm text-gray-700 break-words">
            {[
              ["Formation", "Powder"],
              ["Dietary Needs", "Vegetarian"],
              ["Product Packaging", "Box"],
              ["F&B Country of Origin", "Egypt"],
            ].map(([label, value], idx) => (
              <div
                key={label}
                className={`grid grid-cols-2 gap-y-3 p-2 ${
                  idx % 2 === 0 ? "bg-gray-100" : ""
                }`}
              >
                <div className="font-medium">{label}</div>
                <div>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOverview;
