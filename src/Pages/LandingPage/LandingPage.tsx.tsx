import MidSect from "./MidSection/MidSect"
import ProductsSection from "./ProductsSection/ProductsSection"
import TopSect from "./TopSection/TopSect"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <TopSect/>
      <MidSect/>
      <ProductsSection/>
    </main>
  )
}
