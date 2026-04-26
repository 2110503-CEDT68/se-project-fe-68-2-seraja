"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Booking } from "@/types";

interface BookingCardProps {
  booking: Booking;
  onEdit?: (booking: Booking) => void;
  onDelete?: (bookingId: string) => void;
  onCancel?: (bookingId: string) => void;
  onCheckIn?: (bookingId: string) => void;
  onCheckOut?: (bookingId: string) => void;
  onReview?: (bookingId: string, rating: number, comment?: string) => Promise<void>;
  onDeleteReview?: (bookingId: string) => Promise<void>;
  onUpdateReview?: (bookingId: string, rating: number, comment?: string) => Promise<void>;
}

const STATUS_STYLES: Record<string, string> = {
  confirmed: "bg-blue-100 text-blue-700",
  "checked-in": "bg-green-100 text-green-700",
  "checked-out": "bg-gray-200 text-gray-500",
  cancelled: "bg-red-100 text-red-600",
  reviewed: "bg-gray-200 text-gray-500", 
  "can-not-review": "bg-gray-300 text-gray-600",
  "late-checkout": "bg-orange-100 text-orange-700 border border-orange-300 font-bold animate-pulse",
};

const STATUS_LABELS: Record<string, string> = {
  confirmed: "Confirmed",
  "checked-in": "Checked In",
  "checked-out": "Checked Out",
  cancelled: "Cancelled",
  reviewed: "Checked Out", 
  "can-not-review": "Review Blocked",
  "late-checkout": "Late Checked Out",
};

export default function BookingCard({
  booking,
  onEdit,
  onDelete,
  onCancel,
  onCheckIn,
  onCheckOut,
  onReview,
  onDeleteReview,
  onUpdateReview,
}: BookingCardProps) {
  const {
    _id,
    checkInDate,
    checkOutDate,
    nightsCount,
    campground,
    createdAt,
    guestName,
    guestTel,
    user,
    status,
    actualCheckIn,
    actualCheckOut,
    review_rating,
    review_comment,
    review_createdAt
  } = booking;

  // States for Create Review
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  // States for Optimistic UI
  const [optStatus, setOptStatus] = useState(status);
  const [optRating, setOptRating] = useState(review_rating);
  const [optComment, setOptComment] = useState(review_comment);
  const [optDate, setOptDate] = useState(review_createdAt);

  // States for Edit Review
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [editRating, setEditRating] = useState(optRating || 0);
  const [editComment, setEditComment] = useState(optComment || "");
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    setOptStatus(status);
    setOptRating(review_rating);
    setOptComment(review_comment);
    setOptDate(review_createdAt);
  }, [status, review_rating, review_comment, review_createdAt]);

  const now = new Date();
  let isOverdue = false;
  let isLateCheckedOut = false;

  if (checkOutDate) {
    const checkoutLimit = new Date(checkOutDate);
    checkoutLimit.setHours(13, 0, 0, 0);

    isOverdue = optStatus === "checked-in" && now > checkoutLimit;

    if (actualCheckOut) {
      isLateCheckedOut = new Date(actualCheckOut) > checkoutLimit;
    }
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const formatDateTime = (d: string) =>
    new Date(d).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });

  const isGuestBook = !!guestName;

  const showActions = onEdit || onDelete || onCancel || onCheckIn || onCheckOut;
  const canEdit = onEdit && status === "confirmed";
  const canCancel = onCancel && status === "confirmed";
  const canCheckIn = onCheckIn && status === "confirmed";
  const canCheckOut = onCheckOut && status === "checked-in";
  const canDelete = onDelete && status === "cancelled";

  const handlePostReview = async () => {
    if (reviewRating === 0) {
      setReviewError("Please select a star rating before submitting.");
      return;
    }
    
    if (!reviewComment.trim()) {
      setReviewError("Please write a review comment before submitting.");
      return;
    }
    
    if (!onReview) return;
    
    setReviewError("");
    setIsSubmitting(true);
    try {
      await onReview(_id, reviewRating, reviewComment);
      
      setOptStatus("reviewed");
      setOptRating(reviewRating);
      setOptComment(reviewComment);
      setOptDate(new Date().toISOString());
      
      alert("Thank you for your review!");
      
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : "Failed to post review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateReview = async () => {
    if (!editComment.trim()) {
      setUpdateError("Comment cannot be empty");
      return;
    }

    if (!onUpdateReview) return;
    
    setUpdateError("");
    setIsSubmitting(true);
    try {
      await onUpdateReview(_id, editRating, editComment);
      
      setOptRating(editRating);
      setOptComment(editComment);
      setOptDate(new Date().toISOString());
      
      setIsEditingReview(false); 
      alert("Your review has been updated");

    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : "Failed to update review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-5">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {campground.name}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {campground.district}, {campground.province}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {isGuestBook ? (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
                Guest booking
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                Registered user
              </span>
            )}
            {optStatus && (
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[optStatus] ?? "bg-gray-100 text-gray-500"}`}
              >
                {STATUS_LABELS[optStatus] ?? optStatus}
              </span>
            )}

            {isOverdue && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-100 text-red-700 border border-red-200 animate-pulse">
                Late Checkout
              </span>
            )}

            {isLateCheckedOut && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                Late Check Out
              </span>
            )}
          </div>
        </div>

        {/* Info Box (Guest or User) */}
        {(isGuestBook || user) && (
          <div
            className={`rounded-lg border px-4 py-3 flex flex-col gap-1 ${
              isGuestBook
                ? "border-purple-100 bg-purple-50"
                : "border-blue-100 bg-blue-50"
            }`}
          >
            <p
              className={`text-xs font-semibold uppercase tracking-wide mb-1 ${
                isGuestBook ? "text-purple-600" : "text-blue-600"
              }`}
            >
              {isGuestBook ? "Guest Info" : "User Info"}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Name:</span>{" "}
              {isGuestBook ? guestName : user?.name}
            </p>
            <p className="text-sm text-gray-700">
              <span className="font-medium">Tel:</span>{" "}
              {isGuestBook ? guestTel : user?.tel}
            </p>
          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Check-in
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {formatDate(checkInDate)} - 12.00 PM
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Check-out
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {formatDate(checkOutDate)} - 1.00 PM
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-1 text-sm text-gray-600">
          {nightsCount && (
            <p>
              <span className="font-medium text-gray-800">🌙 Nights:</span>{" "}
              {nightsCount}
            </p>
          )}
          <p>
            <span className="font-medium text-gray-800">📍 Address:</span>{" "}
            {campground.address}
          </p>
          <p>
            <span className="font-medium text-gray-800">📞 Tel:</span>{" "}
            {campground.tel}
          </p>
          <p>
            <span className="font-medium text-gray-800">🗓️ Booked on:</span>{" "}
            {formatDate(createdAt)}
          </p>
          {actualCheckIn && (
            <p>
              <span className="font-medium text-gray-800">✅ Checked in:</span>{" "}
              {formatDateTime(actualCheckIn)}
            </p>
          )}
          {actualCheckOut && (
            <p>
              <span className="font-medium text-gray-800">🚪 Checked out:</span>{" "}
              {formatDateTime(actualCheckOut)}
            </p>
          )}
        </div>

        {/* --- US2-1: CREATE REVIEW --- */}
        {optStatus === "checked-out" && onReview && (
          <div className="mt-4 pt-5 border-t border-gray-100 transition-all duration-300">
            <h3 className="text-base font-bold text-gray-900 mb-3">
              Write a Review
            </h3>

            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <div className="flex gap-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => { setReviewRating(star); setReviewError(""); }}
                    disabled={isSubmitting}
                    className={`text-2xl transition-all duration-200 hover:scale-110 active:scale-95 ${
                      star <= reviewRating
                        ? "text-yellow-400 drop-shadow-sm"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>

              <div className="relative">
                <textarea
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm transition-all min-h-[80px] resize-none"
                  placeholder="Tell us what you liked about your stay..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              {reviewError && (
                <p className="mt-2 text-sm text-red-500 bg-red-50 p-2 rounded-lg border border-red-100 text-center">
                  {reviewError}
                </p>
              )}

              <div className="mt-4 flex justify-end">
                <Button
                  size="sm"
                  disabled={isSubmitting}
                  onClick={handlePostReview}
                  className="px-6 shadow-sm shadow-blue-500/20"
                  loading={isSubmitting}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* --- US2-2: UPDATE/SHOW REVIEW --- */}
        {optStatus === "reviewed" && (
          <div className="mt-4 pt-5 border-t border-gray-100 animate-in fade-in duration-500">
            <h3 className="text-base font-bold text-gray-900 mb-3">
              Your Review
            </h3>

            {isEditingReview ? (
              // ---------------- Edit Mode ----------------
              <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm animate-in fade-in">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => { setEditRating(star); setUpdateError(""); }}
                      disabled={isSubmitting}
                      className={`text-2xl transition-colors focus:outline-none ${
                        star <= editRating
                          ? "text-yellow-400 drop-shadow-sm"
                          : "text-gray-200 hover:text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <textarea
                  className="w-full px-3 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 outline-none text-sm transition-all min-h-[80px] resize-none"
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  disabled={isSubmitting}
                />

                {updateError && (
                  <div className="mt-2 text-sm text-red-500">
                    {updateError}
                  </div>
                )}

                <div className="mt-4 flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingReview(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleUpdateReview}
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    className="px-6"
                  >
                    Update
                  </Button>
                </div>
              </div>
            ) : (
              // ---------------- Show Review Mode ----------------
              <div className="bg-gray-50/80 rounded-xl p-5 border border-gray-100 animate-in fade-in">
                
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`text-xl ${
                          star <= (optRating || 0) 
                            ? "text-yellow-400"
                            : "text-gray-200"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {optDate && (
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">
                        {formatDate(optDate)}
                      </span>
                    </div>
                  )}
                </div>
                
                {optComment && ( 
                  <p className="text-[15px] text-gray-700 italic">
                    &quot;{optComment}&quot;
                  </p>
                )}

                {(onUpdateReview || onDeleteReview) && (
                  <div className="mt-5 flex justify-end gap-2">
                    {onUpdateReview && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setEditRating(optRating || 0);
                          setEditComment(optComment || "");
                          setIsEditingReview(true);
                        }}
                      >
                        Edit Review
                      </Button>
                    )}
                    
                    {onDeleteReview && (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={async () => {
                          const confirmed = confirm("Are you sure you want to delete this review?");
                          if (!confirmed) return;

                          await onDeleteReview(_id);

                          setOptStatus("checked-out");
                          setOptRating(null as any);
                          setOptComment(null as any);
                          setOptDate(undefined);
                          setReviewRating(0);
                          setReviewComment("");
                          setReviewError("");
                        }}
                      >
                        Delete Review
                      </Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="mt-2 flex gap-3 flex-wrap">
            {canEdit && (
              <Button
                variant="outline"
                fullWidth
                onClick={() => onEdit!(booking)}
              >
                Edit
              </Button>
            )}
            {canCancel && (
              <Button variant="danger" fullWidth onClick={() => onCancel!(_id)}>
                Cancel
              </Button>
            )}
            {canCheckIn && (
              <Button
                variant="outline"
                fullWidth
                onClick={() => onCheckIn!(_id)}
              >
                Check In
              </Button>
            )}
            {canCheckOut && (
              <Button
                variant="secondary"
                fullWidth
                onClick={() => onCheckOut!(_id)}
              >
                {isOverdue ? "Check Out (Late)" : "Check Out"}
              </Button>
            )}
            {canDelete && (
              <Button variant="danger" fullWidth onClick={() => onDelete!(_id)}>
                Delete
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}