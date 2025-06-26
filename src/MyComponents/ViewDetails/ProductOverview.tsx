type ProductOverviewProps = {
  description: string
  highlights: string[]
  specifications: [string, string][]
}

const ProductOverview = ({ description, highlights, specifications }: ProductOverviewProps) => {
  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-lg px-6 pb-[80px] pt-[20px]">
      <h1 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">Product Overview</h1>

      <div className="flex flex-col md:flex-row gap-x-7">
        {/* Left Side: Overview + Highlights */}
        <div className="w-full md:w-1/2 space-y-7">
          {/* Highlights */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Highlights</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm break-words">
              {highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </div>

          {/* Overview */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Overview</h3>
            <p className="text-gray-600 leading-relaxed text-sm break-words">{description}</p>
          </div>
        </div>

        {/* Right Side: Specifications */}
        <div className="w-full md:w-1/2 border-t md:border-t-0 md:border-l border-gray-200 pt-7 md:pt-0 md:pl-7">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Specifications</h3>
          <div className="text-sm text-gray-700 break-words">
            {specifications.map(([label, value], idx) => (
              <div key={label} className={`grid grid-cols-2 gap-y-3 p-2 ${idx % 2 === 0 ? "bg-gray-100" : ""}`}>
                <div className="font-medium">{label}</div>
                <div>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductOverview
