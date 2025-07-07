"use client"

import { ShoppingCart } from "lucide-react"
import { useCart } from "@/Contexts/CartContext"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"

interface SimpleCartIconProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function SimpleCartIcon({ className = "", size = "md" }: SimpleCartIconProps) {
  const { cartData } = useCart()

  // Calculate total items in cart
  const totalItems = cartData.cartProducts.reduce((total, item) => total + item.amount, 0)

  // Size configurations
  const sizes = {
    sm: {
      icon: "w-5 h-5",
      badge: "w-4 h-4 text-xs",
    },
    md: {
      icon: "w-6 h-6",
      badge: "w-5 h-5 text-xs",
    },
    lg: {
      icon: "w-7 h-7",
      badge: "w-5 h-5 text-sm",
    },
  }

  const config = sizes[size]

  return (
    <Link to="/cart">
      <span className={`relative inline-block cursor-pointer  w- ${className}`}>
        <ShoppingCart className={`${config.icon} text-white hover:text-blue-600 transition-colors`} />

        {totalItems > 0 && (
          <span
            className={`
              absolute -top-2 -right-2 
              ${config.badge}
              bg-red-500 
              text-white 
              rounded-full 
              flex items-center justify-center 
              font-medium
              min-w-fit
            `}
          >
            {totalItems > 99 ? "99+" : totalItems}
          </span>
        )}
      </span>
    </Link>
  )
}

// Minimal version with just the essentials
export function MinimalCartIcon({ className = "" }: { className?: string }) {
  const { cartData } = useCart()
  const totalItems = cartData.cartProducts.reduce((total, item) => total + item.amount, 0)

  return (
    <Link to="/cart" className={`relative ${className}`}>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
        <div className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:shadow-xl transition-shadow duration-300">
          <ShoppingCart className="w-6 h-6 text-white" />
        </div>

        {totalItems > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md"
          >
            {totalItems > 9 ? "9+" : totalItems}
          </motion.div>
        )}
      </motion.div>
    </Link>
  )
}

// Modern glassmorphism style
export function GlassCartIcon({ className = "" }: { className?: string }) {
  const { cartData } = useCart()
  const totalItems = cartData.cartProducts.reduce((total, item) => total + item.amount, 0)

  return (
    <Link to="/cart" className={`relative ${className}`}>
      <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="relative group">
        <div
          className="
          w-14 h-14 
          rounded-2xl 
          bg-white/20 
          backdrop-blur-md 
          border border-white/30 
          shadow-lg 
          flex items-center justify-center 
          hover:bg-white/30 
          transition-all duration-300
          hover:shadow-xl
        "
        >
          <ShoppingCart className="w-7 h-7 text-white group-hover:text-blue-600 transition-colors duration-300" />
        </div>

        <AnimatePresence>
          {totalItems > 0 && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="
                absolute -top-2 -right-2 
                w-7 h-7 
                bg-gradient-to-r from-orange-400 to-red-500 
                text-white text-sm font-bold 
                rounded-full 
                flex items-center justify-center 
                shadow-lg 
                border-2 border-white
              "
            >
              {totalItems > 99 ? "99" : totalItems}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  )
}

// Clean and professional style
export function CleanCartIcon({ className = "" }: { className?: string }) {
  const { cartData } = useCart()
  const totalItems = cartData.cartProducts.reduce((total, item) => total + item.amount, 0)

  return (
    <Link to="/cart" className={className}>
      <div className="relative group">
        <div
          className="
          w-12 h-12 
          rounded-xl 
          bg-gray-50 
          hover:bg-blue-50 
          border-2 border-gray-200 
          hover:border-blue-300 
          flex items-center justify-center 
          transition-all duration-200 
          hover:shadow-md
          group-hover:scale-105
        "
        >
          <ShoppingCart className="w-6 h-6 text-white group-hover:text-blue-600 transition-colors duration-200" />
        </div>

        {totalItems > 0 && (
          <div
            className="
            absolute -top-2 -right-2 
            min-w-6 h-6 px-1
            bg-blue-600 
            text-white text-xs font-semibold 
            rounded-full 
            flex items-center justify-center 
            shadow-sm
          "
          >
            {totalItems > 99 ? "99+" : totalItems}
          </div>
        )}
      </div>
    </Link>
  )
}
