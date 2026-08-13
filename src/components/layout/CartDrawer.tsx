"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiX, FiTrash2, FiPlus, FiMinus } from "react-icons/fi";
import { useCart } from "@/context/CartContext";
import Button from "@/components/ui/Button";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, removeFromCart, totalItems, totalPrice } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    onClose();
    router.push("/cart");
  };

  return (
    <>
      {/* Backdrop — clicking it closes the drawer */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Off-canvas panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-bg z-50 shadow-lg flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-text">Cart ({totalItems})</h2>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="text-text-muted hover:text-text"
          >
            <FiX size={22} />
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="text-text-muted text-sm text-center mt-10">Your cart is empty.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <Link
                    href={`/products/${item.product.id}`}
                    onClick={onClose}
                    className="relative w-16 h-16 shrink-0 rounded-md overflow-hidden bg-bg-muted border border-border"
                  >
                    {item.product.images[0] && (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product.id}`}
                      onClick={onClose}
                      className="text-sm font-medium text-text hover:text-primary line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-text-muted mb-2">
                      ${item.product.price.toFixed(2)}
                    </p>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center border border-border rounded-md">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-6 h-6 flex items-center justify-center text-text-muted hover:text-text disabled:opacity-30"
                        >
                          <FiMinus size={12} />
                        </button>
                        <span className="w-6 text-center text-xs text-text">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-6 h-6 flex items-center justify-center text-text-muted hover:text-text disabled:opacity-30"
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-text-muted hover:text-error ml-auto"
                        aria-label="Remove item"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-text shrink-0">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer — total + checkout */}
        {items.length > 0 && (
          <div className="border-t border-border px-5 py-4">
            <div className="flex justify-between text-sm font-medium text-text mb-3">
              <span>Subtotal</span>
              <span className="text-primary">${totalPrice.toFixed(2)}</span>
            </div>
            <Button variant="primary" className="w-full" onClick={handleCheckout}>
              Go to Cart
            </Button>
          </div>
        )}
      </div>
    </>
  );
}