import BusinessTypeNavigation from "./BusinessTypeNavigation"
import CategoryNavigation from "./category-navigation"
import HeroBanner from "./hero-banner"

interface BusinessType {
  id: number
  code: string
  name: string
}

interface BusinessTypeCategory {
  id: number
  code: string
  name: string
  businessType: {
    id: number
    code: string
    name: string
  }
}

interface TopSectProps {
  businessTypes: BusinessType[]
  businessTypeCategories: BusinessTypeCategory[]
}

export default function TopSect({ businessTypes, businessTypeCategories }: TopSectProps) {
  return (
    <div className="bg-white   lg:mx-10">
      <BusinessTypeNavigation businessTypes={businessTypes} businessTypeCategories={businessTypeCategories} />
      <HeroBanner />
      <CategoryNavigation businessTypeCategories={businessTypeCategories} />
    </div>
  )
}
