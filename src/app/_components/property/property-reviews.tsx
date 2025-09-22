import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, ChevronRight } from "lucide-react";

type ReviewData = {
  review: {
    id: string;
    guestName: string;
    rating: number | null;
    comment: string;
    channel: string;
    reviewType: string;
    submittedAt: Date;
    isApproved: boolean;
  };
  property: {
    id: string;
    name: string;
    city: string | null;
  } | null;
};

interface PropertyReviewsProps {
  reviews: ReviewData[];
  propertyId: string;
  totalCount: number;
}

export function PropertyReviews({
  reviews,
  propertyId: _,
  totalCount,
}: PropertyReviewsProps) {
  // Filter only approved reviews and guest-to-host reviews for public display
  const approvedReviews = reviews.filter(
    (item) =>
      item.review.isApproved && item.review.reviewType === "guest-to-host",
  );

  if (approvedReviews.length === 0) {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Guest Reviews</h2>
        <Card className="p-8 text-center">
          <div className="space-y-3">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <Star className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No Reviews Yet
            </h3>
            <p className="text-gray-600">
              {"This property hasn't received any approved guest reviews yet."}
            </p>
          </div>
        </Card>
      </section>
    );
  }

  // Calculate average rating from approved reviews
  const ratingsWithValues = approvedReviews
    .map((item) => item.review.rating)
    .filter((rating) => rating !== null);

  const averageRating =
    ratingsWithValues.length > 0
      ? ratingsWithValues.reduce((sum, rating) => sum + rating, 0) /
        ratingsWithValues.length
      : 0;

  const renderStars = (rating: number | null, size: "sm" | "lg" = "sm") => {
    if (!rating) return null;

    const starSize = size === "lg" ? "h-5 w-5" : "h-4 w-4";

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "long",
    }).format(new Date(date));
  };

  const getChannelColor = (channel: string) => {
    switch (channel.toLowerCase()) {
      case "hostaway":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "google":
        return "bg-red-100 text-red-800 border-red-200";
      case "airbnb":
        return "bg-pink-100 text-pink-800 border-pink-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <section className="space-y-6">
      {/* Reviews Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Guest Reviews</h2>
          {totalCount > approvedReviews.length && (
            <span className="text-sm text-gray-600">
              Showing {approvedReviews.length} of {totalCount} reviews
            </span>
          )}
        </div>

        {/* Average Rating Summary */}
        {averageRating > 0 && (
          <div className="flex items-center gap-4 border-b border-gray-200 pb-4">
            <div className="flex items-center gap-2">
              {renderStars(Math.round(averageRating), "lg")}
              <span className="text-2xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-600">
              Based on {ratingsWithValues.length} guest review
              {ratingsWithValues.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {approvedReviews.map((item) => {
          const { review } = item;

          return (
            <Card
              key={review.id}
              className="p-6 transition-shadow hover:shadow-md"
            >
              <div className="space-y-4">
                {/* Review Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-gray-900">
                        {review.guestName}
                      </h3>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getChannelColor(review.channel)}`}
                      >
                        {review.channel}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-600">
                        {formatDate(review.submittedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="space-y-3">
                  <p className="leading-relaxed text-gray-700">
                    {review.comment}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Load More Reviews (if needed) */}
      {totalCount > approvedReviews.length && (
        <div className="pt-4 text-center">
          <Button variant="outline" className="gap-2">
            View More Reviews
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  );
}
