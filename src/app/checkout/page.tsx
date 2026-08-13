"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/apiClient";
import { Order, CreateOrderPayload } from "@/types/order";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { toast } from "react-toastify";

interface ShippingForm {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { token, user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<ShippingForm>({
    fullName: user?.name || "",
    phone: user?.phone || "",
    street: "",
    city: "",
    postalCode: "",
    country: "Bangladesh",
  });
  const [errors, setErrors] = useState<Partial<ShippingForm>>({});
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE">("COD");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const shipping = totalPrice > 0 && totalPrice < 50 ? 5.99 : 0;
  const grandTotal = totalPrice + shipping;

  const updateField = (field: keyof ShippingForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<ShippingForm> = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.street.trim()) newErrors.street = "Street address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.postalCode.trim()) newErrors.postalCode = "Postal code is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!token) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!validate()) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Combine the structured fields into the single string the backend expects
    const shippingAddress = `${form.fullName}, ${form.phone}, ${form.street}, ${form.city}, ${form.postalCode}, ${form.country}`;

    setIsPlacingOrder(true);
    try {
      const payload: CreateOrderPayload = {
        shippingAddress,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      };

      const res = await apiClient<Order>("/orders", {
        method: "POST",
        body: payload,
        token,
      });

      clearCart();
      toast.success("Order placed successfully!");

      // NOTE: once SSLCommerz is wired up, redirect to the payment gateway
      // here using res.data.id, instead of going straight to the orders page.
      router.push(`/dashboard/orders?highlight=${res.data.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-text-muted mb-4">Your cart is empty.</p>
        <Button onClick={() => router.push("/shop")}>Go to Shop</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-text mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        {/* Left — Shipping + Payment form */}
        <div className="flex flex-col gap-8">
          <div className="border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-text mb-4">Shipping details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="fullName"
                label="Full name"
                value={form.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                error={errors.fullName}
              />
              <Input
                id="phone"
                label="Phone number"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                error={errors.phone}
              />
              <div className="sm:col-span-2">
                <Input
                  id="street"
                  label="Street address"
                  placeholder="House no, road, area"
                  value={form.street}
                  onChange={(e) => updateField("street", e.target.value)}
                  error={errors.street}
                />
              </div>
              <Input
                id="city"
                label="City"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                error={errors.city}
              />
              <Input
                id="postalCode"
                label="Postal code"
                value={form.postalCode}
                onChange={(e) => updateField("postalCode", e.target.value)}
                error={errors.postalCode}
              />
              <div className="sm:col-span-2">
                <Input
                  id="country"
                  label="Country"
                  value={form.country}
                  onChange={(e) => updateField("country", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="border border-border rounded-xl p-6">
            <h2 className="text-lg font-semibold text-text mb-4">Payment method</h2>
            <div className="flex flex-col gap-3">
              <label
                className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer ${
                  paymentMethod === "COD" ? "border-primary bg-bg-muted" : "border-border"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                  className="accent-primary"
                />
                <div>
                  <p className="text-sm font-medium text-text">Cash on delivery</p>
                  <p className="text-xs text-text-muted">Pay when your order arrives</p>
                </div>
              </label>

              <label
                className={`flex items-center gap-3 border rounded-lg p-4 cursor-pointer ${
                  paymentMethod === "ONLINE" ? "border-primary bg-bg-muted" : "border-border"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "ONLINE"}
                  onChange={() => setPaymentMethod("ONLINE")}
                  className="accent-primary"
                />
                <div>
                  <p className="text-sm font-medium text-text">Pay online</p>
                  <p className="text-xs text-text-muted">Card, mobile banking via SSLCommerz</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right — Order summary */}
        <div className="h-fit border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-text mb-4">Order summary</h2>

          <div className="flex flex-col gap-3 mb-4">
            {items.map((item) => (
              <div key={item.product.id} className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-md overflow-hidden bg-bg-muted relative border border-border shrink-0">
                  {item.product.images[0] && (
                    <Image
                      src={item.product.images[0]}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-text font-medium line-clamp-1">{item.product.name}</p>
                  <p className="text-xs text-text-muted">
                    {item.quantity} × ${item.product.price.toFixed(2)}
                  </p>
                </div>
                <p className="text-sm font-medium text-text">
                  ${(item.quantity * item.product.price).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between text-text-muted">
              <span>Subtotal</span>
              <span className="text-text">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-text-muted">
              <span>Shipping</span>
              <span className="text-text">
                {shipping === 0 ? <span className="text-success">Free</span> : `$${shipping.toFixed(2)}`}
              </span>
            </div>
          </div>

          <div className="flex justify-between py-4 border-t border-border mt-2 text-base font-semibold text-text">
            <span>Total</span>
            <span className="text-primary">${grandTotal.toFixed(2)}</span>
          </div>

          <Button
            variant="primary"
            className="w-full"
            onClick={handlePlaceOrder}
            isLoading={isPlacingOrder}
          >
            Place order
          </Button>
        </div>
      </div>
    </div>
  );
}