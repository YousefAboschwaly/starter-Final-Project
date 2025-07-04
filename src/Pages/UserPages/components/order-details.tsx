"use client"

import { useState, useEffect, useCallback, useContext } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, Headphones, Star, ChevronRight, Loader2, HelpCircle } from "lucide-react"
import { ReviewModal } from "./review-modal"
import { UserContext } from "@/Contexts/UserContext"
import toast from "react-hot-toast"
import { useParams } from "react-router-dom"

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

interface ReviewData {
  id?: number
  statusCode?: number
  rating: number
  comment: string
}

interface ExistingReviewData {
  id: number
  statusCode: number
  productId: number
  rate: number
  comment: string
}

export function OrderDetails({ order, onBack }: OrderDetailsProps) {
  const {id} = useParams<{id: string}>()
  const userContext = useContext(UserContext)
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }
  const { userToken, pathUrl } = userContext

  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedProductForReview, setSelectedProductForReview] = useState<OrderDetail | null>(null)
  const [submittedReviews, setSubmittedReviews] = useState<Record<number, ReviewData>>({})
  const [reviewStatuses, setReviewStatuses] = useState<Record<number, boolean>>({})
  const [loadingReviewStatuses, setLoadingReviewStatuses] = useState(true)
  const [existingReviewData, setExistingReviewData] = useState<ReviewData | undefined>(undefined)
  const [loadingExistingReview, setLoadingExistingReview] = useState(false)

  const fetchExistingReview = async (productId: number, userId: number): Promise<ReviewData | null> => {
    try {
      const response = await fetch(`${pathUrl}/api/v1/product-ratings/product/${productId}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Accept-language": "en",
        },
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          const reviewData: ExistingReviewData = result.data
          return {
            id: reviewData.id,
            statusCode: reviewData.statusCode,
            rating: reviewData.rate,
            comment: reviewData.comment,
          }
        }
      }
      return null
    } catch (error) {
      console.error(`Error fetching existing review for product ${productId}:`, error)
      return null
    }
  }

  const handleAddReviewClick = async (product: OrderDetail) => {
    setSelectedProductForReview(product)

    // If this is an edit review (user has already reviewed), fetch existing review data
    if (hasReviewed(product.product.id)) {
      setLoadingExistingReview(true)

      try {
        const existingReview = await fetchExistingReview(product.product.id, order.userId)
        setExistingReviewData(existingReview || undefined)
      } catch (error) {
        console.error("Error fetching existing review:", error)
        toast.error("Failed to load existing review data")
        setExistingReviewData(undefined)
      } finally {
        setLoadingExistingReview(false)
      }
    } else {
      setExistingReviewData(undefined)
    }

    setShowReviewModal(true)
  }

  const handleReviewSubmitted = (productId: number, reviewData: ReviewData) => {
    // Save the review for this specific product
    setSubmittedReviews((prev) => ({
      ...prev,
      [productId]: reviewData,
    }))

    // Update review status to true since user just submitted/updated a review
    setReviewStatuses((prev) => ({
      ...prev,
      [productId]: true,
    }))

    // Close modal
    setShowReviewModal(false)
    setSelectedProductForReview(null)
    setExistingReviewData(undefined)
  }

  const handleCloseReviewModal = () => {
    setShowReviewModal(false)
    setSelectedProductForReview(null)
    setExistingReviewData(undefined)
  }

  const hasReviewed = (productId: number) => {
    return reviewStatuses[productId] === true || submittedReviews[productId] !== undefined
  }

  const getExistingReview = (productId: number) => {
    // First check if we have fetched existing review data
    if (existingReviewData) {
      return existingReviewData
    }
    // Fallback to submitted reviews
    return submittedReviews[productId]
  }

  const checkReviewStatuses = useCallback(async () => {
    // Only check review statuses for delivered orders
    if (order.status !== "Delivered" || !order.orderDetails || order.orderDetails.length === 0) {
      setLoadingReviewStatuses(false)
      return
    }

    setLoadingReviewStatuses(true)
    const statuses: Record<number, boolean> = {}

    try {
      // Check review status for each product
      const promises = order.orderDetails.map(async (detail) => {
        try {
          const response = await fetch(
            `${pathUrl}/api/v1/product-ratings/check?productId=${detail.product.id}&userId=${order.userId}`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
                "Accept-language": "en",
              },
            },
          )
          console.log("is it Reviewed ", response)
          if (response.ok) {
            const result = await response.json()
            if (result.success) {
              statuses[detail.product.id] = result.data
            } else {
              statuses[detail.product.id] = false
            }
          } else {
            statuses[detail.product.id] = false
          }
        } catch (error) {
          console.error(`Error checking review status for product ${detail.product.id}:`, error)
          statuses[detail.product.id] = false
        }
      })

      await Promise.all(promises)
      setReviewStatuses(statuses)
    } catch (error) {
      console.error("Error checking review statuses:", error)
    } finally {
      setLoadingReviewStatuses(false)
    }
  }, [order.orderDetails, order.userId, order.status, pathUrl, userToken])

  useEffect(() => {
    if (order && order.orderDetails) {
      checkReviewStatuses()
    }
  }, [checkReviewStatuses, order])

  if (!order) return null

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
        <Button variant="ghost" onClick={onBack} className="mb-4 gap-2 hover:bg-gray-100">
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
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
                              src={pathUrl + detail.product.mainImagePath || "/placeholder.svg"}
                              alt={detail.product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback to icon if image fails to load
                                const target = e.target as HTMLImageElement
                                target.style.display = "none"
                                target.nextElementSibling?.classList.remove("hidden")
                              }}
                            />
                          ) : (
                            <Headphones className="h-10 w-10 text-gray-400" />
                          )}
                          <Headphones className="h-10 w-10 text-gray-400 hidden" />
                        </motion.div>

                        <div className="flex-1 space-y-1">
                          <motion.h3
                            className="font-medium text-gray-900"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                          >
                            {detail.product.name}
                          </motion.h3>

                          <motion.div
                            className="flex items-center gap-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                          >
                            {hasReviewed(detail.product.id) && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm text-green-600 font-medium">Reviewed</span>
                              </div>
                            )}
                          </motion.div>

                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <motion.div
                              className="flex flex-col text-sm text-gray-600"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1.0 + index * 0.1 }}
                            >
                              <span>
                                Quantity: <span className="text-black text-medium"> {detail.amount}</span>
                              </span>
                              <span className=" text-lg text-black font-semibold">
                                EGP {(detail.price * detail.amount).toFixed(2)}
                              </span>
                            </motion.div>

                            {/* Action Buttons - Only show Add Review for delivered orders */}
                            {order.status === "Delivered" && (
                              <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.1 + index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button
                                  className={`gap-2 w-full sm:w-auto shadow-md hover:shadow-lg transition-all duration-200 ${
                                    hasReviewed(detail.product.id)
                                      ? "bg-green-600 hover:bg-green-700"
                                      : "bg-blue-600 hover:bg-blue-700"
                                  }`}
                                  onClick={() => handleAddReviewClick(detail)}
                                  disabled={loadingReviewStatuses || loadingExistingReview}
                                >
                                  {loadingReviewStatuses ? (
                                    <>
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                      Checking...
                                    </>
                                  ) : loadingExistingReview &&
                                    selectedProductForReview?.product.id === detail.product.id ? (
                                    <>
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                      Loading...
                                    </>
                                  ) : (
                                    <>
                                      <Star className="h-4 w-4" />
                                      {hasReviewed(detail.product.id) ? "Edit Review" : "Add Review"}
                                    </>
                                  )}
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
                    <span className="text-lg font-semibold text-gray-900">Total Order Price:</span>
                    <span className="text-xl font-bold text-gray-900">EGP {order.price.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <Card>
              <CardContent className="p-4 lg:p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Order Number:</p>
                    <p className="font-medium break-all">{order.id}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Order ID:</p>
                    <p className="font-medium break-all">{id}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Delivery Address:</p>
                    <p className="font-medium">{order.deliveryAddress}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Items:</p>
                    <p className="font-medium">{order.quantity}</p>
                  </div>

                  <Button variant="link" className="p-0 h-auto text-blue-600 hover:text-blue-800 justify-start">
                    View order/invoice summary
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={handleCloseReviewModal}
        product={selectedProductForReview}
        existingReview={selectedProductForReview ? getExistingReview(selectedProductForReview.product.id) : undefined}
        onReviewSubmitted={handleReviewSubmitted}
      />
      {/* Add this before the closing </motion.div> tag */}

      {/* Help Button */}
      <motion.div
        className="fixed bottom-6 right-6"
        initial={{ opacity: 0, scale: 0, rotate: -180 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{
          delay: 1.5,
          duration: 0.6,
          type: "spring",
          stiffness: 200,
          damping: 15,
        }}
        whileHover={{
          scale: 1.1,
          rotate: 5,
          transition: { duration: 0.2 },
        }}
        whileTap={{ scale: 0.9 }}
      >
        <Button
          className="bg-[#7c6fd4] hover:bg-[#282560]  text-white rounded-full h-12 px-4 lg:px-6 shadow-lg hover:shadow-xl transition-all duration-300"
          onClick={() => {
            const phoneNumber = "2001065823087"
            const message = `Hello! I need help with my order #${order.id}.`
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
            window.open(whatsappUrl, "_blank")
          }}
        >
          <motion.div animate={{ rotate: 0 }} whileHover={{ rotate: 15 }} transition={{ duration: 0.2 }}>
            <HelpCircle className="h-5 w-5 mr-2" />
          </motion.div>
          <span className="hidden sm:inline">Need Help?</span>
          <span className="sm:hidden">Help</span>
        </Button>
      </motion.div>
    </motion.div>
  )
}
