/**
 * Write Review Modal
 * File: Component/WriteReviewModal.jsx
 * 
 * Simple popup modal for submitting reviews
 */

import { useState } from "react";
import { X, Star } from "lucide-react";
import { useReviewStore } from "../stores/reviewStore";
import { useUserStore } from "../stores/userStore";
import toast from "react-hot-toast";

export default function WriteReviewModal({ targetType, targetId, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const { createReview, submitting } = useReviewStore();
  const { accessToken } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!title.trim() || !comment.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    // Submit review
    const result = await createReview(
      targetType,
      targetId,
      {
        rating,
        title: title.trim(),
        comment: comment.trim(),
      },
      accessToken
    );

    if (result.success) {
      // Reset form
      setRating(0);
      setTitle("");
      setComment("");
      setOpen(false);

      // Callback
      if (onSuccess) {
        onSuccess(result.data);
      }
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        <Star size={18} />
        Write a Review
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold mb-2">Write a Review</h2>
            <p className="text-sm text-gray-500 mb-6">
              Share your experience to help others make informed decisions.
            </p>

            <form onSubmit={handleSubmit}>
              {/* Star Rating */}
              <div className="mb-6">
                <label className="text-sm font-medium block mb-2">
                  Your Rating *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={32}
                        className={`${
                          star <= (hoverRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        } transition-colors`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    {rating === 5 && "Excellent!"}
                    {rating === 4 && "Very Good"}
                    {rating === 3 && "Good"}
                    {rating === 2 && "Fair"}
                    {rating === 1 && "Poor"}
                  </p>
                )}
              </div>

              {/* Review Title */}
              <div className="mb-4">
                <label className="text-sm font-medium block mb-2">
                  Review Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Sum up your experience in one line"
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={200}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {title.length}/200 characters
                </p>
              </div>

              {/* Review Comment */}
              <div className="mb-6">
                <label className="text-sm font-medium block mb-2">
                  Your Review *
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell others about your experience..."
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={5}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 10 characters
                </p>
              </div>

              {/* Submit Buttons */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg mb-3 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </form>

            {/* Info Note */}
            <p className="text-xs text-gray-500 mt-4 text-center">
              Your review will be published after moderation
            </p>
          </div>
        </div>
      )}
    </>
  );
}