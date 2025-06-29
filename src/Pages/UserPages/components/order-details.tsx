"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, CheckCircle, Headphones, Star, ChevronRight, X } from "lucide-react"

interface Product {
  id: number
  name: string
  mainImagePath: string
}

interface OrderDetail {
  id: number
  statusCode: string | null
  product: Product
  price: number
  amount: number
}

interface OrderDetailsProps {
  pathUrl:string
  order: {
    id: string
    status: string
    statusColor: string
    date: string
    product: string
    price: number
    quantity: number
    deliveryAddress: string
    orderDetails: OrderDetail[]
    userId: number
  }
  onBack: () => void
}

export function OrderDetails({ order, onBack, pathUrl }: OrderDetailsProps) {
  const [showReviewSection, setShowReviewSection] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");

  const handleStarClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    starIndex: number
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const starWidth = rect.width;
    const isLeftHalf = clickX < starWidth / 2;

    const newRating = isLeftHalf ? starIndex - 0.5 : starIndex;
    setRating(newRating);
  };

  const handleStarHover = (
    event: React.MouseEvent<HTMLButtonElement>,
    starIndex: number
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const hoverX = event.clientX - rect.left;
    const starWidth = rect.width;
    const isLeftHalf = hoverX < starWidth / 2;

    const newHoveredRating = isLeftHalf ? starIndex - 0.5 : starIndex;
    setHoveredRating(newHoveredRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const renderStar = (starIndex: number) => {
    const currentRating = hoveredRating || rating;
    const isFull = currentRating >= starIndex;
    const isHalf =
      currentRating >= starIndex - 0.5 && currentRating < starIndex;

    return (
      <motion.button
        key={starIndex}
        className="relative focus:outline-none"
        onClick={(e) => handleStarClick(e, starIndex)}
        onMouseMove={(e) => handleStarHover(e, starIndex)}
        onMouseLeave={handleStarLeave}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.1 }}
      >
        <Star className="h-8 w-8 sm:h-10 sm:w-10 text-gray-300" />
        {isHalf && (
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="h-8 w-8 sm:h-10 sm:w-10 fill-yellow-400 text-yellow-400" />
          </div>
        )}
        {isFull && (
          <Star className="absolute inset-0 h-8 w-8 sm:h-10 sm:w-10 fill-yellow-400 text-yellow-400" />
        )}
      </motion.button>
    );
  };

  const handleSubmitReview = () => {
    // Handle review submission here
    console.log({ rating, review });
    setShowReviewSection(false);
    setRating(0);
    setReview("");
  };

  if (!order) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.3 }}
      className="flex-1 p-4 lg:p-8"
    >
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-4 gap-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to orders
        </Button>

        <motion.h1
          className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Order Details
        </motion.h1>
        <motion.p
          className="text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Order #{order.id}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6 lg:space-y-8">
          {/* Delivery Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card
              className={`${
                order.status === "Delivered"
                  ? "border-green-200 bg-green-50"
                  : order.status === "Cancelled"
                  ? "border-red-200 bg-red-50"
                  : "border-blue-200 bg-blue-50"
              }`}
            >
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle
                    className={`h-6 w-6 ${
                      order.status === "Delivered"
                        ? "text-green-600"
                        : order.status === "Cancelled"
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  />
                  <div>
                    <p
                      className={`font-semibold ${
                        order.status === "Delivered"
                          ? "text-green-800"
                          : order.status === "Cancelled"
                          ? "text-red-800"
                          : "text-blue-800"
                      }`}
                    >
                      {order.status} on {order.date}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <motion.h2
                className="text-xl font-semibold text-gray-800"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                Order Items
              </motion.h2>
            </div>

            <div className="space-y-4">
              {order.orderDetails.map((detail, index) => (
                <motion.div
                  key={detail.id}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2, delay: 0.6 + index * 0.1 }}
                  className="group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 group-hover:border-gray-300">
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <motion.div
                          className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 self-center sm:self-start overflow-hidden"
                          whileHover={{ scale: 1.05, rotate: 2 }}
                          transition={{ duration: 0.2 }}
                        >
                          {detail.product.mainImagePath ? (
                            <img
                              src={
                                pathUrl + detail.product.mainImagePath ||
                                "/placeholder.svg"
                              }
                              alt={detail.product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to icon if image fails to load
                                const target = e.target as HTMLImageElement;
                                target.style.display = "none";
                                target.nextElementSibling?.classList.remove(
                                  "hidden"
                                );
                              }}
                            />
                          ) : (
                            <Headphones className="h-10 w-10 text-gray-400" />
                          )}
                          <Headphones className="h-10 w-10 text-gray-400 hidden" />
                        </motion.div>

                        <div className="flex-1 space-y-2">
                          <motion.h3
                            className="font-medium text-gray-900"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                          >
                            {detail.product.name}
                          </motion.h3>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <motion.div
                              className="flex flex-col  text-md text-[#777E90]"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1.0 + index * 0.1 }}
                            >
                              <span>
                                Quantity:{" "}
                                <span className=" font-semibold text-black">
                                  {detail.amount}
                                </span>
                              </span>
                              <span>
                                 <span className="font-semibold text-black"> EGP{" "}
                                {(detail.price * detail.amount).toFixed(2)}</span>
                              </span>
                            </motion.div>

                            {/* Only show Add Review button for Delivered orders */}
                            {order.status === "Delivered" && (
                              <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.1 + index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button
                                  className="bg-blue-600 hover:bg-blue-700 gap-2 w-full sm:w-auto shadow-md hover:shadow-lg transition-all duration-200"
                                  onClick={() =>
                                    setShowReviewSection(!showReviewSection)
                                  }
                                >
                                  <Star className="h-4 w-4" />
                                  {showReviewSection
                                    ? "Cancel Review"
                                    : "Add Review"}
                                </Button>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Total Price */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-6"
            >
              <Card className="border-gray-300 bg-gray-50">
                <CardContent className="p-4 lg:p-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Total Order Price:
                    </span>
                    <span className="text-xl font-bold text-gray-900">
                      EGP {order.price.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Review Section - Only for Delivered orders */}
          {order.status === "Delivered" && (
            <AnimatePresence>
              {showReviewSection && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <Card className="border-blue-200 bg-blue-50/30">
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            Write a Review
                          </h3>
                          <p className="text-sm text-gray-600">
                            Help others know what to buy!
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowReviewSection(false)}
                          className="flex-shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Rating Section */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-6"
                      >
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          How do you rate this product?
                        </h4>
                        <div className="flex gap-1 sm:gap-2 mb-2">
                          {[1, 2, 3, 4, 5].map((starIndex) =>
                            renderStar(starIndex)
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {rating > 0
                            ? `${rating} out of 5 stars`
                            : "Tap to rate"}
                        </p>
                      </motion.div>

                      {/* Review Text */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-6"
                      >
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          Write your review
                        </h4>
                        <div className="relative">
                          <Textarea
                            placeholder="What did you like or dislike? How did you use the product? What should others know before buying?"
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            maxLength={1000}
                            rows={4}
                            className="resize-none pr-16 text-sm sm:text-base bg-white"
                          />
                          <span className="absolute right-3 bottom-3 text-xs text-gray-400">
                            {review.length}/1000
                          </span>
                        </div>
                      </motion.div>

                      {/* Submit Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex gap-3"
                      >
                        <Button
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 text-sm sm:text-base"
                          disabled={rating === 0 || !review.trim()}
                          onClick={handleSubmitReview}
                        >
                          SUBMIT REVIEW
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowReviewSection(false)}
                          className="px-6 py-3 text-sm sm:text-base"
                        >
                          Cancel
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardContent className="p-4 lg:p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Order Number:</p>
                    <p className="font-medium break-all">{order.id}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">User ID:</p>
                    <p className="font-medium">{order.userId}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">
                      Delivery Address:
                    </p>
                    <p className="font-medium">{order.deliveryAddress}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Items:</p>
                    <p className="font-medium">{order.quantity}</p>
                  </div>

                  <Button
                    variant="link"
                    className="p-0 h-auto text-blue-600 hover:text-blue-800 justify-start"
                  >
                    View order/invoice summary
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
