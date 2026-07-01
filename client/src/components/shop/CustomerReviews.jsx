import { useEffect, useState } from "react";
import { reviewsApi } from "../../api/reviews.js";

export default function CustomerReviews({ productId, ratingAvg }) {
  const [reviews, setReviews] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) {
      setReviews(undefined);
      setLoading(false);
      return;
    }
    reviewsApi
      .list(productId)
      .then((res) => setReviews(res.data))
      .catch(() => setReviews(undefined))
      .finally(() => setLoading(false));
  }, [productId]);

  const displayRating = ratingAvg != null ? `${ratingAvg} / 5.0` : undefined;

  return (
    <section className="w-full px-8 py-12 border-t border-neutral-900">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">
            STREET FEEDBACK
          </h2>
          <span className="text-[9px] text-[#737373] uppercase tracking-wider block mt-1">
            AUTHENTIC VERIFIED OWNERS
          </span>
        </div>
        {displayRating && (
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="#EF476F"
                stroke="#EF476F"
                strokeWidth="1"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
            <span className="text-xs font-bold text-white ml-2">{displayRating}</span>
          </div>
        )}
      </div>

      {loading && (
        <p className="text-xs text-[#737373] uppercase tracking-widest">Loading reviews...</p>
      )}

      {!loading && !reviews?.length && (
        <p className="text-xs text-[#737373] uppercase tracking-widest">No reviews yet</p>
      )}

      {reviews?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </section>
  );
}

function ReviewCard({ review }) {
  const initials = review.author_label
    ? review.author_label.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : undefined;

  return (
    <div className="bg-[#171717] border border-neutral-900 rounded-2xl p-6 flex flex-col justify-between min-h-[180px]">
      <div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs text-[#737373] font-mono">{review.id?.slice(0, 8) ?? "—"}</span>
          {review.rating != null && (
            <div className="flex gap-0.5">
              {Array.from({ length: review.rating }).map((_, i) => (
                <svg
                  key={i}
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="#2DD4BF"
                  stroke="#2DD4BF"
                  strokeWidth="1"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
          )}
        </div>
        {review.body && (
          <p className="text-xs text-[#F8F9FA] leading-normal mb-6 flex-grow">
            &ldquo;{review.body}&rdquo;
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#282826] flex items-center justify-center text-[10px] font-bold text-white">
          {initials ?? "?"}
        </div>
        <div>
          <p className="text-xs font-bold text-white uppercase">{review.author_label ?? "—"}</p>
        </div>
      </div>
    </div>
  );
}
