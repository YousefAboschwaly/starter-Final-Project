import CategoryNavigation from "./category-navigation";
import HeroBanner from "./hero-banner";
interface BusinessType {
  id: number
  code: string
  name: string
}

interface TopSectProps {
  businessTypes: BusinessType[]
}
export default function TopSect({ businessTypes }: TopSectProps) {
  return (
    <div className="bg-white">
        <HeroBanner />
      <CategoryNavigation businessTypes={businessTypes} />
    </div>
  )
}
