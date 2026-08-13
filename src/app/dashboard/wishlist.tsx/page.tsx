"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiTrash2, FiShoppingBag } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { getMyWishlist, removeFromWishlist } from "@/lib/api/wishlist";
import { Wishlist } from "@/types/wishlist";

export default function WishlistPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [items, setItems] = useState<Wishlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !token) {
      router.push("/login");
      return;
    }

    getMyWishlist(token)
      .then(setItems)
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load wishlist"))
      .finally(() => setIsLoading(false));
  }, [authLoading, user, token, router]);

  const handleRemove = async (productId: string) => {
    if (!token) return;
    setRemovingId(productId);
    try {
      await removeFromWishlist(productId, token);
      setItems((prev) => prev.filter((item) => item.productId !== productId));
      toast.success("Removed from wishlist");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to remove item");
    } finally {
      setRemovingId(null);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text-muted">Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-text">My Wishlist</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-bg-muted py-16 text-center">
          <FiShoppingBag size={40} className="mb-3 text-text-muted" />
          <p className="mb-1 font-medium text-text">Your wishlist is empty</p>
          <p className="mb-4 text-sm text-text-muted">Save products you like to find them here later</p>
          <Link href="/shop" className="text-sm font-medium text-primary hover:underline">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-xl border border-border bg-bg shadow-sm">
              <div className="relative h-44 w-full bg-bg-muted">
                {item.product?.images?.[0] ? (
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-text-muted">No image</div>
                )}
              </div>
              <div className="p-4">
                <Link
                  href={`/products/${item.productId}`}
                  className="line-clamp-1 font-medium text-text hover:text-primary"
                >
                  {item.product?.name}
                </Link>
                <p className="mt-1 font-semibold text-primary">
                  ${item.product?.price.toFixed(2)}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={`text-xs font-medium ${
                      (item.product?.stock ?? 0) > 0 ? "text-success" : "text-error"
                    }`}
                  >
                    {(item.product?.stock ?? 0) > 0 ? "In stock" : "Out of stock"}
                  </span>
                  <button
                    onClick={() => handleRemove(item.productId)}
                    disabled={removingId === item.productId}
                    className="text-error hover:opacity-70 disabled:opacity-40"
                    aria-label="Remove from wishlist"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}