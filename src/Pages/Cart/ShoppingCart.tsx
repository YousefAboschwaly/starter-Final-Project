"use client";
import { useState } from "react";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/Contexts/CartContext";
import { useCartTotals } from "@/hooks/useCartTotals";
import { CartItem } from "./CartItem";
import { ClearCartModal } from "./ClearCartModal";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useContext } from "react";
import { UserContext } from "@/Contexts/UserContext";
import { useNavigate } from "react-router-dom";

export default function ShoppingCart() {
  const { cartData, clearCart } = useCart();
  const { subtotal, shippingFee, total, isCalculating, hasErrors, itemCount } =
    useCartTotals();
  const [showClearModal, setShowClearModal] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);

  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider");
  }
  const { pathUrl, userToken } = userContext;

  const handleCheckout = async () => {
    if (!userToken) {
      toast.error("Please login to place an order");
      return;
    }

    if (!cartData.cartProducts || cartData.cartProducts.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    // Check if any products have missing prices
    const hasInvalidPrices = cartData.cartProducts.some(
      (item) => !item.price || item.price <= 0
    );
    if (hasInvalidPrices) {
      toast.error(
        "Some products have invalid prices. Please refresh the cart."
      );
      return;
    }

    setIsProcessingOrder(true);

    try {
      // Calculate total price from cart data
      const calculatedTotal = cartData.cartProducts.reduce(
        (sum, item) => sum + item.price * item.amount,
        0
      );

      // Prepare order data according to the API structure
      const orderData = {
        totalPrice: calculatedTotal,
        orderDetails: cartData.cartProducts.map((item) => ({
          productId: item.id,
          price: item.price,
          amount: item.amount,
        })),
      };

      console.log("Order data being sent:", orderData);

      const response = await fetch(`${pathUrl}/api/v1/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
          "Accept-Language": "en",
        },
        body: JSON.stringify(orderData),
      });

      console.log("API Response:", response);

      if (response.ok) {
        const result = await response.json();
        console.log("Order placed successfully:", result);

        // Clear the cart after successful order
        clearCart();

        // Show success message
        toast.success("Order placed successfully!");

        // Navigate to success page
        navigate("/order-success");
      } else {
        const errorData = await response.json();
        console.error("Order failed:", errorData);
        toast.error(errorData.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Section */}
          <div className="lg:col-span-2">
            <motion.div
              className="bg-white rounded-lg shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-6 border-b flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Cart{" "}
                  <motion.span
                    className="text-gray-500 font-normal"
                    key={cartData.cartProducts?.length || 0}
                    initial={{ scale: 1.2, color: "#3b82f6" }}
                    animate={{ scale: 1, color: "#6b7280" }}
                    transition={{ duration: 0.3 }}
                  >
                    ({cartData.cartProducts?.length || 0} items)
                  </motion.span>
                </h1>

                {/* Clear Cart Button - only show when there are items */}
                {cartData.cartProducts && cartData.cartProducts.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 transition-colors duration-200"
                      onClick={() => setShowClearModal(true)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear Cart
                    </Button>
                  </motion.div>
                )}
              </div>

              <div className="space-y-0">
                {!cartData.cartProducts ||
                cartData.cartProducts.length === 0 ? (
                  <motion.div
                    className="p-12 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="text-gray-400 text-6xl mb-4">🛒</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-500">
                      Add some products to get started!
                    </p>
                  </motion.div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {cartData.cartProducts.map((item) => (
                      <CartItem
                        key={item.id}
                        productId={item.id}
                        quantity={item.amount}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="sticky top-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Order Summary
                  </h2>

                  {/* Coupon Code */}
                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex gap-2">
                      <Input placeholder="Coupon Code" className="flex-1" />
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">
                          APPLY
                        </Button>
                      </motion.div>
                    </div>
                    <Button
                      variant="link"
                      className="text-blue-600 p-0 mt-2 h-auto"
                    >
                      🎯 View Available Offers →
                    </Button>
                  </motion.div>

                  <Separator className="mb-6" />

                  {/* Order Details */}
                  <motion.div
                    className="space-y-4 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Subtotal ({itemCount} items)
                      </span>
                      <motion.span
                        className="font-medium flex items-center gap-2"
                        key={subtotal}
                        initial={{ scale: 1.1, color: "#3b82f6" }}
                        animate={{ scale: 1, color: "#000" }}
                        transition={{ duration: 0.3 }}
                      >
                        {itemCount > 0 && isCalculating && (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                        EGP {subtotal.toLocaleString()}.00
                      </motion.span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping Fee</span>
                      <span className="font-medium">EGP {shippingFee}.00</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>
                        Total{" "}
                        <span className="text-sm font-normal text-gray-500">
                          (Inclusive of VAT)
                        </span>
                      </span>
                      <motion.span
                        key={total}
                        initial={{ scale: 1.1, color: "#3b82f6" }}
                        animate={{ scale: 1, color: "#000" }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-2"
                      >
                        {itemCount > 0 && isCalculating && (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                        EGP {total.toLocaleString()}.00
                      </motion.span>
                    </div>
                    {hasErrors && (
                      <div className="text-xs text-orange-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Some items couldn't be loaded. Total may be incomplete.
                      </div>
                    )}
                  </motion.div>

                  {/* Payment Plans */}
                  <motion.div
                    className="mb-6 p-3 bg-orange-50 rounded-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <span>💳</span>
                      <span className="text-gray-700">
                        Monthly payment plans from EGP 500
                      </span>
                      <Button
                        variant="link"
                        className="text-orange-600 p-0 h-auto text-sm"
                      >
                        View more details
                      </Button>
                    </div>
                  </motion.div>

                  {/* Checkout Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium mb-4 transition-all duration-200"
                      disabled={
                        !cartData.cartProducts ||
                        cartData.cartProducts.length === 0 ||
                        isCalculating ||
                        isProcessingOrder
                      }
                      onClick={handleCheckout}
                    >
                      {isProcessingOrder ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing Order...
                        </div>
                      ) : isCalculating &&
                        cartData.cartProducts &&
                        cartData.cartProducts.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Calculating...
                        </div>
                      ) : (
                        "CHECKOUT"
                      )}
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
        {/* Clear Cart Modal */}
        <ClearCartModal
          isOpen={showClearModal}
          onClose={() => setShowClearModal(false)}
          onConfirm={clearCart}
          itemCount={cartData.cartProducts?.length || 0}
        />
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#333",
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "12px 16px",
          },
          success: {
            style: {
              background: "#D1FAE5",
              border: "1px solid #10B981",
              color: "#065F46",
            },
            iconTheme: {
              primary: "#10B981",
              secondary: "#D1FAE5",
            },
          },
          error: {
            style: {
              background: "#FEE2E2",
              border: "1px solid #EF4444",
              color: "#7F1D1D",
            },
            iconTheme: {
              primary: "#EF4444",
              secondary: "#FEE2E2",
            },
            duration: 5000,
          },
        }}
      />
    </div>
  );
}
