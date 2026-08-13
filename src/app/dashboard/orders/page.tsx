"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiPackage, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { getMyOrders, cancelOrder } from "@/lib/api/orders";
import { Order, OrderStatus } from "@/types/order";

const statusStyles: Record<OrderStatus, string> = {
  PENDING: "bg-warning/10 text-warning",
  CONFIRMED: "bg-info/10 text-info",
  SHIPPED: "bg-primary/10 text-primary",
  DELIVERED: "bg-success/10 text-success",
  CANCELLED: "bg-error/10 text-error",
};

export default function OrdersPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !token) {
      router.push("/login");
      return;
    }

    getMyOrders(token)
      .then(setOrders)
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load orders"))
      .finally(() => setIsLoading(false));
  }, [authLoading, user, token, router]);

  const handleCancel = async (orderId: string) => {
    if (!token) return;
    setCancellingId(orderId);
    try {
      const updated = await cancelOrder(orderId, token);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      toast.success("Order cancelled");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text-muted">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-text">My Orders</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-bg-muted py-16 text-center">
          <FiPackage size={40} className="mb-3 text-text-muted" />
          <p className="mb-1 font-medium text-text">You haven&apos;t placed any orders yet</p>
          <p className="mb-4 text-sm text-text-muted">Your order history will show up here</p>
          <Link href="/shop" className="text-sm font-medium text-primary hover:underline">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => {
            const isExpanded = expandedId === order.id;
            return (
              <div key={order.id} className="rounded-xl border border-border bg-bg shadow-sm">
                {/* Header row */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                >
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                    <span className="text-sm font-medium text-text">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="text-xs text-text-muted">{formatDate(order.createdAt)}</span>
                    <span
                      className={`w-fit rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-text">${order.totalAmount.toFixed(2)}</span>
                    {isExpanded ? (
                      <FiChevronUp size={18} className="text-text-muted" />
                    ) : (
                      <FiChevronDown size={18} className="text-text-muted" />
                    )}
                  </div>
                </button>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="border-t border-border px-5 py-4">
                    <div className="mb-4 flex flex-col gap-1 text-sm">
                      <p className="text-text-muted">
                        Shipping Address: <span className="text-text">{order.shippingAddress}</span>
                      </p>
                      <p className="text-text-muted">
                        Payment:{" "}
                        <span className="font-medium text-text">{order.paymentStatus}</span>
                      </p>
                    </div>

                    <div className="flex flex-col gap-3">
                      {order.orderItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-bg-muted">
                            {item.product?.images?.[0] ? (
                              <Image
                                src={item.product.images[0]}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            ) : null}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-text">{item.product?.name}</p>
                            <p className="text-xs text-text-muted">
                              Qty: {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <p className="text-sm font-medium text-text">
                            ${(item.quantity * item.price).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {order.status === "PENDING" && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        disabled={cancellingId === order.id}
                        className="mt-4 text-sm font-medium text-error hover:underline disabled:opacity-50"
                      >
                        {cancellingId === order.id ? "Cancelling..." : "Cancel Order"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}