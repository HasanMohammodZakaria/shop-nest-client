"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiTrash2, FiShoppingBag, FiShoppingCart } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { getMyWishlist, removeFromWishlist } from "@/lib/api/wishlist";
import { Wishlist } from "@/types/wishlist";

export default function WishlistPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const { addToCart } = useCart();
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

  const handleAddToCart = (item: Wishlist) => {
    if (!item.product) return;
    addToCart(item.product, 1);
    toast.success("Added to cart");
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
          {items.map((item) => {
            const inStock = (item.product?.stock ?? 0) > 0;
            return (
              <div key={item.id} className="overflow-hidden rounded-xl border border-border bg-bg shadow-sm">
                <Link href={`/products/${item.productId}`} className="relative block h-44 w-full bg-bg-muted">
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

                  {item.product?.category && (
                    <span className="absolute left-2 top-2 rounded-full bg-secondary/90 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
                      {item.product.category.name}
                    </span>
                  )}

                  {!inStock && (
                    <span className="absolute left-2 bottom-2 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-white">
                      Out of Stock
                    </span>
                  )}
                </Link>

                <div className="p-4">
                  <Link
                    href={`/products/${item.productId}`}
                    className="line-clamp-1 font-medium text-text hover:text-primary"
                  >
                    {item.product?.name}
                  </Link>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="font-semibold text-primary">
                      ${item.product?.price.toFixed(2)}
                    </p>
                    <span
                      className={`text-xs font-medium ${inStock ? "text-success" : "text-error"}`}
                    >
                      {inStock ? "In stock" : "Out of stock"}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={!inStock}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-border disabled:text-text-muted"
                    >
                      <FiShoppingCart size={14} /> Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemove(item.productId)}
                      disabled={removingId === item.productId}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border text-error hover:bg-error/10 disabled:opacity-40"
                      aria-label="Remove from wishlist"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}