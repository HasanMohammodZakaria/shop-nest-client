"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { apiClient } from "@/lib/apiClient";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import { toast } from "react-toastify";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { addToCart } = useCart();
  const { user, token } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  // Review form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

 const fetchProduct = async () => {
  try {
    const res = await apiClient<Product>(`/products/${id}`);

    setProduct(res.data);
  } catch {
    toast.error("Product not found");
  } finally {
  
    setIsLoading(false);
  }
};

useEffect(() => {
   // eslint-disable-next-line react-hooks/set-state-in-effect
  fetchProduct();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [id]);

  const increment = () => {
    if (product && quantity < product.stock) setQuantity((q) => q + 1);
  };
  const decrement = () => {
    if (quantity > 1) setQuantity((q) => q - 1);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast.success(`${quantity} item(s) added to cart`);
  };


  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    router.push("/cart");
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please login to write a review");
      router.push("/login");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setIsSubmittingReview(true);
    try {
      await apiClient(`/reviews`, {
        method: "POST",
        body: { productId: id, rating, comment },
        token,
      });
      toast.success("Review submitted!");
      setComment("");
      setRating(5);
      fetchProduct();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center text-text-muted">Loading...</div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center text-text-muted">
        Product not found
      </div>
    );
  }

  const isOutOfStock = product.status === "OUT_OF_STOCK" || product.stock === 0;
  const reviews = product.reviews ?? [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left side — Images */}
        <div>
          <div className="w-full aspect-square bg-bg-muted rounded-lg overflow-hidden relative border border-border">
            {product.images.length > 0 ? (
              <Image
                src={product.images[activeImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-muted">
                No image available
              </div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-16 h-16 rounded-md overflow-hidden border-2 relative ${
                    activeImage === index ? "border-primary" : "border-border"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right side — Details */}
        <div>
          {product.category && (
            <span className="inline-block text-xs font-medium bg-bg-muted text-text-muted px-3 py-1 rounded-full mb-3">
              {product.category.name}
            </span>
          )}

          <h1 className="text-2xl font-semibold text-text mb-2">{product.name}</h1>

          <p className="text-3xl font-semibold text-primary mb-4">
            ${product.price.toFixed(2)}
          </p>

          <p className="text-text-muted leading-relaxed mb-6">{product.description}</p>

          <div className="mb-6">
            {isOutOfStock ? (
              <span className="text-error font-medium">Out of stock</span>
            ) : (
              <span className="text-success font-medium">
                In stock ({product.stock} available)
              </span>
            )}
          </div>

          {!isOutOfStock && (
            <>
              {/* Quantity selector */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm font-medium text-text">Quantity</span>
                <div className="flex items-center border border-border rounded-md">
                  <button
                    onClick={decrement}
                    className="px-3 py-1 text-lg text-text hover:bg-bg-muted disabled:opacity-40"
                    disabled={quantity <= 1}
                  >
                    −
                  </button>
                  <span className="px-4 py-1 text-text font-medium">{quantity}</span>
                  <button
                    onClick={increment}
                    className="px-3 py-1 text-lg text-text hover:bg-bg-muted disabled:opacity-40"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleAddToCart} className="flex-1">
                  Add to Cart
                </Button>
                <Button variant="primary" onClick={handleBuyNow} className="flex-1">
                  Buy Now
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ================= Review Section ================= */}
      <div className="mt-12 border-t border-border pt-8">
        <h2 className="text-xl font-semibold text-text mb-6">
          Customer Reviews ({reviews.length})
        </h2>

        {/* Review form — logged-in user only */}
        {user ? (
          <form onSubmit={handleSubmitReview} className="bg-bg-muted rounded-lg p-4 mb-8">
            <p className="text-sm font-medium text-text mb-2">Write a review</p>

            <div className="flex items-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl ${star <= rating ? "text-accent" : "text-border"}`}
                  aria-label={`Rate ${star} stars`}
                >
                  ★
                </button>
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md outline-none focus:ring-2 focus:ring-primary text-text mb-3"
            />

            <Button type="submit" variant="primary" isLoading={isSubmittingReview}>
              Submit Review
            </Button>
          </form>
        ) : (
          <p className="text-sm text-text-muted mb-8">
            <button onClick={() => router.push("/login")} className="text-primary underline">
              Login
            </button>{" "}
            to write a review.
          </p>
        )}

        {/* Review list */}
        {reviews.length === 0 ? (
          <p className="text-text-muted text-sm">
            No reviews yet. Be the first to review this product.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-border pb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-text text-sm">{review.user.name}</span>
                  <span className="text-accent text-sm">{"★".repeat(review.rating)}</span>
                </div>
                {review.comment && (
                  <p className="text-text-muted text-sm">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}