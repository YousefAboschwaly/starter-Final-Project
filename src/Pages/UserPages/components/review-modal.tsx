"use client"

import type React from "react"
import { useState, useEffect, useContext } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import toast from "react-hot-toast"
import { Star, Headphones, Loader2 } from "lucide-react"
import { UserContext } from "@/Contexts/UserContext"

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

interface ReviewData {
  id?: number
  statusCode?: number
  rating: number
  comment: string
}

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  product: OrderDetail | null
  existingReview?: ReviewData
  onReviewSubmitted: (productId: number, reviewData: ReviewData) => void
}

export function ReviewModal({ isOpen, onClose, product, existingReview, onReviewSubmitted }: ReviewModalProps) {
  const userContext = useContext(UserContext)
  if (!userContext) {
    throw new Error("UserContext must be used within a UserContextProvider")
  }
  const { userToken, pathUrl } = userContext

  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check if this is an edit operation
  const isEditMode = !!existingReview

  // Load existing review data when modal opens
  useEffect(() => {
    if (isOpen && product) {
      if (existingReview) {
        setRating(existingReview.rating)
        setComment(existingReview.comment)
      } else {
        setRating(0)
        setComment("")
      }
      setHoveredRating(0)
    }
  }, [isOpen, product, existingReview])

  const handleStarClick = (event: React.MouseEvent<HTMLButtonElement>, starIndex: number) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const starWidth = rect.width
    const isLeftHalf = clickX < starWidth / 2

    const newRating = isLeftHalf ? starIndex - 0.5 : starIndex
    setRating(newRating)
  }

  const handleStarHover = (event: React.MouseEvent<HTMLButtonElement>, starIndex: number) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const hoverX = event.clientX - rect.left
    const starWidth = rect.width
    const isLeftHalf = hoverX < starWidth / 2

    const newHoveredRating = isLeftHalf ? starIndex - 0.5 : starIndex
    setHoveredRating(newHoveredRating)
  }

  const handleStarLeave = () => {
    setHoveredRating(0)
  }

  const renderStar = (starIndex: number) => {
    const currentRating = hoveredRating || rating
    const isFull = currentRating >= starIndex
    const isHalf = currentRating >= starIndex - 0.5 && currentRating < starIndex

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
        disabled={isSubmitting}
      >
        <Star className="h-8 w-8 sm:h-10 sm:w-10 text-gray-300" />
        {isHalf && (
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="h-8 w-8 sm:h-10 sm:w-10 fill-yellow-400 text-yellow-400" />
          </div>
        )}
        {isFull && <Star className="absolute inset-0 h-8 w-8 sm:h-10 sm:w-10 fill-yellow-400 text-yellow-400" />}
      </motion.button>
    )
  }

  const handleSubmitReview = async () => {
    if (!product || rating === 0 || !comment.trim()) {
      toast.error("Please provide both a rating and a comment.")
      return
    }

    setIsSubmitting(true)

    try {
      // Use PUT for editing existing reviews, POST for creating new reviews
      const method = isEditMode ? "PUT" : "POST"
      const endpoint = `${pathUrl}/api/v1/product-ratings`

      // Prepare request body
      const requestBody: {
        productId: number
        rate: number
        comment: string
        id?: number
        statusCode?: number
      } = {
        productId: product.product.id,
        rate: rating,
        comment: comment.trim(),
      }

      // Add id and statusCode for edit operations
      if (isEditMode && existingReview) {
        if (existingReview.id) {
          requestBody.id = existingReview.id
        }
        if (existingReview.statusCode) {
          requestBody.statusCode = existingReview.statusCode
        }
      }

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
          "Accept-language": "en",
        },
        body: JSON.stringify(requestBody),
      })
      console.log(response)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log(result)

      if (result.success) {
        // Success
        toast.success(isEditMode ? "Review updated successfully!" : "Thank you for your review!")

        // Call the callback to update the parent component
        onReviewSubmitted(product.product.id, {
          id: existingReview?.id,
          statusCode: existingReview?.statusCode,
          rating,
          comment: comment.trim(),
        })

        // Reset form and close modal
        handleCloseModal()
      } else {
        throw new Error(result.message || `Failed to ${isEditMode ? "update" : "submit"} review`)
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? "updating" : "submitting"} review:`, error)
      toast.error(
        error instanceof Error
          ? error.message
          : `Failed to ${isEditMode ? "update" : "submit"} review. Please try again.`,
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCloseModal = () => {
    if (!isSubmitting) {
      setRating(0)
      setComment("")
      setHoveredRating(0)
      onClose()
    }
  }

  if (!product) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{isEditMode ? "Edit Review" : "Write a Review"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {product.product.mainImagePath ? (
                      <img
                        src={pathUrl + product.product.mainImagePath || "/placeholder.svg"}
                        alt={product.product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                          target.nextElementSibling?.classList.remove("hidden")
                        }}
                      />
                    ) : (
                      <Headphones className="h-8 w-8 text-gray-400" />
                    )}
                    <Headphones className="h-8 w-8 text-gray-400 hidden" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900">{product.product.name}</p>
                    <p className="text-sm text-gray-600">EGP {product.price.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">
                      Product ID: {product.product.id} | Quantity: {product.amount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Rating Section */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">How do you rate this product?</h4>
            <div className="flex gap-2 mb-2 justify-center">
              {[1, 2, 3, 4, 5].map((starIndex) => renderStar(starIndex))}
            </div>
            <p className="text-sm text-gray-500 text-center">
              {rating > 0 ? `${rating} out of 5 stars` : "Tap to rate (1.0 to 5.0)"}
            </p>
          </motion.div>

          {/* Comment Section */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
              {isEditMode ? "Edit your review" : "Write your review"}
            </h4>
            <div className="relative">
              <Textarea
                placeholder="What did you like or dislike? How did you use the product? What should others know before buying?"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={1000}
                rows={4}
                className="resize-none pr-16"
                disabled={isSubmitting}
              />
              <span className="absolute right-3 bottom-3 text-xs text-gray-400">{comment.length}/1000</span>
            </div>
          </motion.div>

          {/* Submit Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-3 pt-4"
          >
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3"
              disabled={rating === 0 || !comment.trim() || isSubmitting}
              onClick={handleSubmitReview}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {isEditMode ? "Updating..." : "Submitting..."}
                </>
              ) : isEditMode ? (
                "UPDATE REVIEW"
              ) : (
                "SUBMIT REVIEW"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={handleCloseModal}
              className="px-6 py-3 bg-transparent"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
