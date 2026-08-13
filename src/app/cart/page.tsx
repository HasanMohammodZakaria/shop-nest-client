"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiTrash2, FiPlus, FiMinus, FiShoppingBag } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import Button from "@/components/ui/Button";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice, isLoading } =
    useCart();
  const router = useRouter();

  const shipping = totalPrice > 0 && totalPrice < 50 ? 5.99 : 0;
  const grandTotal = totalPrice + shipping;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text-muted">Loading cart...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
        <FiShoppingBag size={48} className="mb-4 text-text-muted" />
        <h1 className="mb-2 text-xl font-semibold text-text">Your cart is empty</h1>
        <p className="mb-6 text-sm text-text-muted">
          Looks like you haven&apos;t added anything to your cart yet.
        </p>
        <Link href="/shop">
          <Button>Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-text">
        Shopping Cart <span className="text-text-muted">({totalItems})</span>
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
        {/* Cart items */}
        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.product.id}
              className="flex gap-4 rounded-xl border border-border bg-bg p-4 shadow-sm"
            >
              <Link
                href={`/products/${item.product.id}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-bg-muted"
              >
                {item.product.images?.[0] && (
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                )}
              </Link>

              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link
                    href={`/products/${item.product.id}`}
                    className="line-clamp-1 font-medium text-text hover:text-primary"
                  >
                    {item.product.name}
                  </Link>
                  {item.product.category && (
                    <p className="text-xs text-text-muted">{item.product.category.name}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-md border border-border">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="flex h-8 w-8 items-center justify-center text-text-muted hover:text-text disabled:opacity-30"
                      aria-label="Decrease quantity"
                    >
                      <FiMinus size={14} />
                    </button>
                    <span className="w-6 text-center text-sm font-medium text-text">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= item.product.stock}
                      className="flex h-8 w-8 items-center justify-center text-text-muted hover:text-text disabled:opacity-30"
                      aria-label="Increase quantity"
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-primary">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => {
                        removeFromCart(item.product.id);
                        toast.success("Removed from cart");
                      }}
                      className="text-text-muted hover:text-error"
                      aria-label="Remove item"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => {
              clearCart();
              toast.success("Cart cleared");
            }}
            className="w-fit text-sm text-error hover:underline"
          >
            Clear cart
          </button>
        </div>

        {/* Order summary */}
        <div className="h-fit rounded-xl border border-border bg-bg p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-text">Order Summary</h2>

          <div className="flex flex-col gap-2 border-b border-border pb-4 text-sm">
            <div className="flex justify-between text-text-muted">
              <span>Subtotal</span>
              <span className="text-text">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-text-muted">
              <span>Shipping</span>
              <span className="text-text">
                {shipping === 0 ? (
                  <span className="text-success">Free</span>
                ) : (
                  `$${shipping.toFixed(2)}`
                )}
              </span>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-accent">
                Add ${(50 - totalPrice).toFixed(2)} more for free shipping
              </p>
            )}
          </div>

          <div className="flex justify-between py-4 text-base font-semibold text-text">
            <span>Total</span>
            <span className="text-primary">${grandTotal.toFixed(2)}</span>
          </div>

          <Button onClick={() => router.push("/checkout")} className="w-full" variant="primary">
            Proceed to Checkout
          </Button>
        </div>
      </div>
    </div>
  );
}