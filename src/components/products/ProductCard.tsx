"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user, token } = useAuth();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const router = useRouter();

  const wishlisted = isWishlisted(product.id);
  const [toggling, setToggling] = useState(false);

  const isOutOfStock = product.status === "OUT_OF_STOCK" || product.stock === 0;

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || !token) {
      router.push("/login");
      return;
    }

    setToggling(true);
    try {
      await toggleWishlist(product.id);
      toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setToggling(false);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-bg shadow-sm transition-shadow hover:shadow-md">
      {/* Image section */}
      <Link href={`/products/${product.id}`} className="relative block h-48 w-full bg-bg-muted">
        {product.images?.[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-text-muted">No image</div>
        )}

        {/* Category badge — secondary (navy) */}
        {product.category && (
          <span className="absolute left-2 top-2 rounded-full bg-secondary/90 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur">
            {product.category.name}
          </span>
        )}

        {/* Out of stock badge — accent (orange), urgent info */}
        {isOutOfStock && (
          <span className="absolute left-2 bottom-2 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-white">
            Out of Stock
          </span>
        )}

        {/* Wishlist heart button */}
        <button
          onClick={handleWishlistToggle}
          disabled={toggling}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-bg/90 shadow-sm backdrop-blur transition-colors hover:bg-bg disabled:opacity-50"
        >
          <FiHeart size={16} className={wishlisted ? "fill-error text-error" : "text-text-muted"} />
        </button>
      </Link>

      {/* Content section */}
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="line-clamp-1 font-semibold text-text transition-colors group-hover:text-primary">
            {product.name}
          </h3>
        </Link>

        <p className="mt-1 line-clamp-2 flex-1 text-sm text-text-muted">{product.description}</p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
          {!isOutOfStock && <span className="text-xs font-medium text-success">In stock</span>}
        </div>

        {/* Two action buttons */}
        <div className="mt-4 flex items-center gap-2">
          <Link
            href={`/products/${product.id}`}
            className="flex flex-1 items-center justify-center rounded-md border border-border py-2 text-sm font-medium text-text transition-colors hover:bg-bg-muted"
          >
            View Details
          </Link>
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label="Add to cart"
            className="flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:bg-border disabled:text-text-muted"
          >
            <FiShoppingCart size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}