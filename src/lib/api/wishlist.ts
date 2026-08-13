import { Wishlist } from "@/types/wishlist";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const authHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export async function getMyWishlist(token: string): Promise<Wishlist[]> {
  const res = await fetch(`${BASE_URL}/wishlist`, {
    headers: authHeaders(token),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to fetch wishlist");
  return result.data ?? result;
}

export async function addToWishlist(productId: string, token: string): Promise<Wishlist> {
  const res = await fetch(`${BASE_URL}/wishlist`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ productId }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to add to wishlist");
  return result.data;
}

export async function removeFromWishlist(productId: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/wishlist/${productId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const result = await res.json();
    throw new Error(result.message || "Failed to remove from wishlist");
  }
}