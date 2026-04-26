"use client";

import { Booking } from "@/types";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface ReviewListProps {
  reviews: Booking[];
  averageRating: number;
  loading?: boolean;
  isAdmin?: boolean;
  onDeleteReview?: (bookingId: string) => void;
}

export default function ReviewList({
  reviews,
  averageRating,
  loading = false,
  isAdmin = false,
  onDeleteReview,
}: ReviewListProps) {
  if (loading) {
    return (
      <div className="mt-8 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="mt-12 text-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <p className="text-gray-500">
          No reviews yet. Be the first to share your experience!
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Guest Reviews</h2>
          <p className="text-gray-500 text-sm mt-1">
            Based on {reviews.length} stays
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
          <span className="text-3xl font-bold text-gray-900">
            {averageRating.toFixed(1)}
          </span>
          <div className="flex flex-col">
            <div className="flex text-yellow-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-lg">
                  {star <= Math.round(averageRating) ? "★" : "☆"}
                </span>
              ))}
            </div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Average Rating
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <Card key={review._id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {review.user?.name?.charAt(0) || "G"}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {review.user?.name || "Anonymous Guest"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {review.review_createdAt
                      ? new Date(review.review_createdAt).toLocaleDateString()
                      : ""}
                  </p>
                </div>
              </div>

              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star}>
                    {star <= (review.review_rating || 0) ? "★" : "☆"}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative">
              <span className="absolute -top-2 -left-1 text-4xl text-gray-100">
                &quot;
              </span>
              <p className="text-gray-700 text-sm leading-relaxed relative z-10 italic">
                {review.review_comment || "No comment provided."}
              </p>
            </div>

            {isAdmin && onDeleteReview && (
              <div className="mt-4 flex justify-end">
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this review?")) {
                      onDeleteReview(review._id);
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}