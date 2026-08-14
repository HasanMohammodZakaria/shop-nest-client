import { RecentReview } from "@/types/review";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function getRecentReviews(limit = 6): Promise<RecentReview[]> {
  const res = await fetch(`${BASE_URL}/reviews/recent?limit=${limit}`);
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to fetch reviews");
  return result.data;
}