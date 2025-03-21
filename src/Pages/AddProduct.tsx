import ProductForm from "@/MyComponents/product-form";

export default function AddProduct() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <ProductForm />
      </div>
    </div>
  )
}

