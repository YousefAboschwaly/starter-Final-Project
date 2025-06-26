"use client"

import { Heart, Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { useCart } from "@/Contexts/CartContext"

interface Product {
  id: number
  name: string
  price: number
  imagePath: string
  rate: number
}

interface ProductCardProps {
  product: Product
  index: number
  pathUrl: string
  isInWishlist: boolean
  onToggleWishlist: (productId: number) => void
}

export const ProductCard = ({ product, index, pathUrl, isInWishlist, onToggleWishlist }: ProductCardProps) => {
  const { cartData, addToCart, removeFromCart } = useCart()

  // Check if this product is in the cart
  const isInCart = cartData.cartProducts.some((item) => item.id === product.id)

  const handleCartToggle = (productId: number) => {
    if (isInCart) {
      // Product is in cart, remove it
      removeFromCart(productId, "delete", product.name)
    } else {
      // Product is not in cart, add it
      addToCart(productId, product.price, product.name)
    }
  }

  return (
    <Link to={`/products/${product.id}`}>
      <Card
        className="group overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 animate-in fade-in slide-in-from-bottom-8 zoom-in-95 border-0 shadow-md hover:shadow-blue-100/50 cursor-pointer"
        style={{
          animationDelay: `${index * 100}ms`,
          animationDuration: "700ms",
        }}
      >
        <div className="relative overflow-hidden">
          <img
            src={pathUrl + product.imagePath || "/placeholder.svg"}
            alt={product.name}
            width={300}
            height={400}
            className="w-full h-80 object-cover transition-all duration-500 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-white/90 hover:bg-white transition-all duration-300 hover:scale-110 shadow-lg animate-in slide-in-from-right-2"
            style={{ animationDelay: `${index * 100 + 200}ms` }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onToggleWishlist(product.id)
            }}
          >
            <Heart
              className={`w-4 h-4 transition-all duration-300 ${
                isInWishlist
                  ? "fill-red-500 text-red-500 scale-110"
                  : "text-gray-600 hover:text-red-400 hover:scale-110"
              }`}
            />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={`absolute bottom-3 right-3 transition-all duration-300 hover:scale-110 shadow-lg animate-in slide-in-from-right-2 ${
              isInCart ? "bg-blue-500/90 hover:bg-blue-600" : "bg-white/90 hover:bg-white"
            }`}
            style={{ animationDelay: `${index * 100 + 300}ms` }}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleCartToggle(product.id)
            }}
          >
            <ShoppingCart
              className={`w-4 h-4 transition-all duration-300 ${
                isInCart ? "fill-white text-white scale-110" : "text-gray-600 hover:text-blue-400 hover:scale-110"
              }`}
            />
          </Button>
        </div>

        <CardContent className="p-4 space-y-3">
          <h3 className="font-medium text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform duration-200" />
              <span className="text-sm font-medium ml-1">{product.rate || 0}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
              EGP {product.price.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
