"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { FiChevronLeft, FiChevronRight, FiStar } from "react-icons/fi";
import { RecentReview } from "@/types/review";

interface TestimonialsSectionProps {
  reviews: RecentReview[];
}

export default function TestimonialsSection({
  reviews,
}: TestimonialsSectionProps) {
  const [index, setIndex] = useState(0);
  const safeReviews = reviews ?? [];

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % safeReviews.length);
  }, [safeReviews.length]);

  const prev = () => {
    setIndex((i) => (i - 1 + safeReviews.length) % safeReviews.length);
  };

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (safeReviews.length <= 1) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, safeReviews.length]);

  if (safeReviews.length === 0) return null;

  const review = safeReviews[index];
  const avatarSrc =
    review.user.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      review.user.name,
    )}&background=059669&color=fff`;
  return (
    <section className="bg-bg py-16">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-text sm:text-3xl">
          What Our Customers Say
        </h2>
        <p className="mt-2 mb-10 text-text-muted">
          Real reviews from real buyers
        </p>

        <div className="relative rounded-2xl border border-border bg-bg-muted p-8 sm:p-12">
          <span className="text-6xl leading-none text-primary/20 select-none">
            &ldquo;
          </span>

          <div className="flex justify-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <FiStar
                key={i}
                size={18}
                className={
                  i < review.rating ? "fill-accent text-accent" : "text-border"
                }
              />
            ))}
          </div>

          <p className="text-lg text-text mb-6 min-h-14">
            {review.comment || "Great product, highly recommended!"}
          </p>

          <div className="flex items-center justify-center gap-3">
            <Image
              src={avatarSrc}
              alt={review.user.name}
              width={44}
              height={44}
              className="h-11 w-11 rounded-full object-cover"
            />
            <div className="text-left">
              <p className="font-medium text-text">{review.user.name}</p>
              <p className="text-xs text-text-muted">
                on {review.product.name}
              </p>
            </div>
          </div>

          {safeReviews.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous review"
                className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-bg border border-border text-text hover:bg-bg-muted"
              >
                <FiChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                aria-label="Next review"
                className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-bg border border-border text-text hover:bg-bg-muted"
              >
                <FiChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {safeReviews.length > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {safeReviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to review ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-primary" : "w-2 bg-border"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
