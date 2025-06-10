import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const ratingData = [
  { stars: 5, percent: 74 },
  { stars: 4, percent: 13 },
  { stars: 3, percent: 4 },
  { stars: 2, percent: 2 },
  { stars: 1, percent: 7 },
];

const reviews = [
  {
    name: "محمد",
    date: "Sep 29, 2024",
    title:
      "Commitment to deadlines, ethics of delivery representatives, product matches description",
    comment:
      "Good price, good product, great packaging, customer follow-up and communication from the time the order is confirmed until the representative arrives and delivers it, and even after delivery..",
    rating: 3,
  },
  {
    name: "أحمد",
    date: "Oct 1, 2024",
    title: "Great customer service",
    comment: "The product arrived on time and was as described.",
    rating: 5,
  },
  {
    name: "سارة",
    date: "Sep 25, 2024",
    title: "Average quality",
    comment: "The product is okay, but not as good as expected.",
    rating: 2,
  },
];

const ProductReviews = () => {
  const [filterRating, setFilterRating] = useState(0);
  const [sortOption, setSortOption] = useState("Top Reviews");

  const rating = 4.5;

  const renderStars = () => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const totalStars = 5;

    return [...Array(totalStars)].map((_, i) => {
      if (i < fullStars) {
        return <Star key={i} className="text-yellow-400 fill-yellow-400" />;
      } else if (i === fullStars && hasHalfStar) {
        return (
          <div key={i} className="relative w-5 h-5">
            <Star className="text-gray-300 absolute" />
            <Star
              className="text-yellow-400 fill-yellow-400 absolute"
              style={{ clipPath: "inset(0 50% 0 0)" }}
            />
          </div>
        );
      } else {
        return <Star key={i} className="text-gray-300" />;
      }
    });
  };

  const ReviewContent = ({ comment }: { comment: string }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const truncatedText = comment.substring(0, 120);

    return (
      <p className="mt-1 text-sm text-gray-700 leading-relaxed">
        {isExpanded ? comment : truncatedText}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-500 text-xs ml-1"
        >
          {isExpanded ? " ...Less" : " ...More"}
        </button>
      </p>
    );
  };

  const filteredReviews = reviews.filter(
    (review) => filterRating === 0 || review.rating === filterRating
  );

  const sortedReviews = filteredReviews.sort((a, b) => {
    if (sortOption === "Top Reviews") {
      return b.rating - a.rating;
    } else if (sortOption === "Newest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
    return 0;
  });

  return (
    <div className="bg-white border border-gray-200 shadow-md rounded-lg px-6 pb-[80px] pt-[20px]">
      <h1 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">
        Product Ratings & Reviews
      </h1>
      <div className="flex flex-col md:flex-row gap-24">
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          <h1 className="text-xl font-bold text-gray-800">Overall Rating</h1>
          <div className="flex flex-col">
            <span className="text-5xl font-bold">{rating}</span>
            <div className="flex text-xl mt-2">{renderStars()}</div>
          </div>
          <p className="text-sm text-gray-600">Based on 671 ratings</p>

          <div className="flex flex-col gap-2">
            {ratingData.map((item) => (
              <div key={item.stars} className="flex items-center gap-3">
                <span className="flex items-center gap-1 w-6">
                  {item.stars}
                  <Star className="fill-current text-yellow-400" />
                </span>
                <Progress
                  value={item.percent}
                  className="flex-1 h-3 bg-gray-200"
                />
                <span className=" text-right text-sm text-gray-600">
                  {item.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-2/3 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <h2 className="text-xl font-semibold">Reviews</h2>
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
          <Label htmlFor="filter-rating" className="text-sm font-bold whitespace-nowrap">
            Filter By:
            </Label>


                <Select
                  name="filter-rating"
                  value={filterRating.toString()}
                  onValueChange={(value) => {
                    setFilterRating(parseInt(value, 10));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue>
                      {filterRating === 0 ? (
                        <span>All stars</span>
                      ) : (
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              className={`w-4 h-4 ${
                                index < filterRating
                                  ? "text-yellow-400"
                                  : "text-gray-400"
                              }`}
                              fill={index < filterRating ? "#facc15" : "none"}
                            />
                          ))}
                        </div>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All stars</SelectItem>
                    {[...Array(5)].map((_, index) => (
                      <SelectItem key={index} value={String(index + 1)}>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, starIndex) => (
                            <Star
                              key={starIndex}
                              className={`w-4 h-4 ${
                                starIndex <= index
                                  ? "text-yellow-400"
                                  : "text-gray-400"
                              }`}
                              fill={starIndex <= index ? "#facc15" : "none"}
                            />
                          ))}
                        </div>
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
                  name="unitTypeId"
                  value={sortOption}
                  onValueChange={(value) => {
                    setSortOption(value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Top Reviews">Top Reviews</SelectItem>
                    <SelectItem value="Newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {sortedReviews.map((review, index) => (
            <div key={index} className="border-b pb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-800 font-bold text-lg">
                  {review.name.charAt(0)}
                </div>

                <div className="flex flex-col">
                  <span className="font-semibold text-sm">{review.name}</span>
                  <span className="text-[10px] text-gray-500">
                    {review.date}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <p className="text-sm font-medium mt-2 text-gray-800">
                {review.title}
              </p>
              <ReviewContent comment={review.comment} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
