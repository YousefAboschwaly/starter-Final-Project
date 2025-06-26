"use client"

import { useState, useEffect, useContext } from "react"
import { Progress } from "@/components/ui/progress"
import { Star, ChevronDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useProductReviews, type ReviewData } from "@/hooks/useProductReviews"
import axios from "axios"
import { UserContext } from "@/Contexts/UserContext"

interface RatingChartData {
  overAllRating: number
  countRantings: number
  oneStarPct: number
  twoStarPct: number
  threeStarPct: number
  fourStarPct: number
  fiveStarPct: number
}

interface RatingChartResponse {
  success: boolean
  status: number
  data: RatingChartData
}

const useRatingChart = (productId: number) => {
      const userContext = useContext(UserContext)
      if (!userContext) {
        throw new Error("UserContext must be used within a UserContextProvider")
      }
  const { pathUrl , userToken } = userContext


  const [ratingChart, setRatingChart] = useState<RatingChartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRatingChart = async () => {
      try {
        setLoading(true)
        const {data}:{data:RatingChartResponse}  = await axios.get(`${pathUrl}/api/v1/product-ratings/chart/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (!data.success) {
          throw new Error("Failed to fetch rating chart data")
        }

        if (data.success) {
          setRatingChart(data.data)
        } else {
          throw new Error("API returned unsuccessful response")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchRatingChart()
  }, [pathUrl, productId, userToken])

  return { ratingChart, loading, error }
}

interface ProductReviewsProps {
  productId: number
}

const ProductReviews = ({ productId }: ProductReviewsProps) => {
  const { reviews, loading, error, totalElements, hasMore, filterStars, sortBy, loadMore, applyFilter, changeSortBy } =
    useProductReviews(productId)

  const { ratingChart, loading: chartLoading, error: chartError } = useRatingChart(productId)

  const rating = ratingChart?.overAllRating || 0

  const ratingData = ratingChart
    ? [
      { stars: 1, percent: Math.round(ratingChart.oneStarPct) },
      { stars: 2, percent: Math.round(ratingChart.twoStarPct) },
      { stars: 3, percent: Math.round(ratingChart.threeStarPct) },
      { stars: 4, percent: Math.round(ratingChart.fourStarPct) },
      { stars: 5, percent: Math.round(ratingChart.fiveStarPct) },
      ]
    : []

  const renderStars = (ratingValue: number = rating, size = "w-5 h-5") => {
    const fullStars = Math.floor(ratingValue)
    const hasHalfStar = ratingValue - fullStars >= 0.5
    const totalStars = 5

    return [...Array(totalStars)].map((_, i) => {
      if (i < fullStars) {
        return <Star key={i} className={`text-yellow-400 fill-yellow-400 ${size}`} />
      } else if (i === fullStars && hasHalfStar) {
        return (
          <div key={i} className={`${size} relative overflow-hidden`}>
            <Star className={`${size} text-gray-300 absolute top-0 left-0`} />
            <div className={`${size} absolute top-0 left-0 overflow-hidden`} style={{ width: "50%" }}>
              <Star className={`${size} text-yellow-400 fill-yellow-400`} />
            </div>
          </div>
        )
      } else {
        return <Star key={i} className={`text-gray-300 ${size}`} />
      }
    })
  }

  const ReviewContent = ({ comment }: { comment: string }) => {
    const [isExpanded, setIsExpanded] = useState(false)

    if (comment.length <= 120) {
      return <p className="mt-1 text-sm text-gray-700 leading-relaxed">{comment}</p>
    }

    const truncatedText = comment.substring(0, 120)

    return (
      <p className="mt-1 text-sm text-gray-700 leading-relaxed">
        {isExpanded ? comment : truncatedText}
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-blue-500 text-xs ml-1 hover:underline">
          {isExpanded ? " ...Less" : " ...More"}
        </button>
      </p>
    )
  }

  const ReviewItem = ({ review }: { review: ReviewData }) => (
    <div className="border-b pb-5">
      <div className="flex items-center gap-3">
        {review.userImage ? (
          <img
            src={review.userImage || "/placeholder.svg"}
            alt={review.userName}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-800 font-bold text-lg">
            {review.userName.charAt(0).toUpperCase()}
          </div>
        )}

        <div className="flex flex-col">
          <span className="font-semibold text-sm">{review.userName}</span>
          <span className="text-[10px] text-gray-500">{review.createdDate}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 mt-1">{renderStars(review.rate, "w-4 h-4")}</div>

      <ReviewContent comment={review.comment} />
    </div>
  )

  if (error) {
    return (
      <div className="bg-white border border-red-200 shadow-md rounded-lg px-6 py-8">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error loading reviews</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-lg px-6 pb-[80px] pt-[20px]">
      <h1 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">Product Ratings & Reviews</h1>
      <div className="flex flex-col md:flex-row gap-24">
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <h1 className="text-xl font-bold text-gray-800">Overall Rating</h1>

          {chartLoading ? (
            <div className="flex justify-center py-8">
              <div className="text-gray-500">Loading rating data...</div>
            </div>
          ) : chartError ? (
            <div className="text-center text-red-600">
              <p className="text-sm">Error loading rating data</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col">
                <span className="text-5xl font-bold">{rating.toFixed(1)}</span>
                <div className="flex text-xl mt-2">{renderStars()}</div>
              </div>
              <p className="text-sm text-gray-600">
                Based on {ratingChart?.countRantings || 0} rating{(ratingChart?.countRantings || 0) !== 1 ? "s" : ""}
              </p>

              <div className="flex flex-col gap-2">
                {ratingData.map((item) => (
                  <div key={item.stars} className="flex items-center gap-3">
                    <span className="flex items-center gap-1 w-6">
                      {item.stars}
                      <Star className="fill-current text-yellow-400" />
                    </span>
                    <Progress value={item.percent} className="flex-1 h-3 bg-gray-200" />
                    <span className="text-right text-sm text-gray-600">{item.percent}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="w-full lg:w-2/3 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <h2 className="text-xl font-semibold">Reviews ({totalElements})</h2>
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="filter-rating" className="text-sm font-bold whitespace-nowrap">
                  Filter By:
                </Label>

                <Select
                  name="filter-rating"
                  value={filterStars?.toString() || "0"}
                  onValueChange={(value) => {
                    const stars = value === "0" ? null : Number.parseInt(value, 10)
                    applyFilter(stars)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue>
                      {filterStars === null ? (
                        <span>All stars</span>
                      ) : (
                        <div className="flex items-center gap-1">{renderStars(filterStars, "w-4 h-4")}</div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All stars</SelectItem>
                    {[...Array(5)].map((_, index) => (
                      <SelectItem key={index} value={String(index + 1)}>
                        <div className="flex items-center gap-1">{renderStars(index + 1, "w-4 h-4")}</div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Label htmlFor="sort-option" className="text-sm font-bold whitespace-nowrap">
                  Sort By:
                </Label>
                <Select
                  name="sort-option"
                  value={sortBy}
                  onValueChange={(value: "top" | "newest") => {
                    changeSortBy(value)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top">Top Reviews</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {loading && reviews.length === 0 ? (
            <div className="flex justify-center py-8">
              <div className="text-gray-500">Loading reviews...</div>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No reviews found</p>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {reviews.map((review) => (
                  <ReviewItem key={review.id} review={review} />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center pt-6">
                  <Button onClick={loadMore} disabled={loading} variant="outline" className="flex items-center gap-2">
                    {loading ? (
                      "Loading..."
                    ) : (
                      <>
                        Load More Reviews
                        <ChevronDown className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductReviews
