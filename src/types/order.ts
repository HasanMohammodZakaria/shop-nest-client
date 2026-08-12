import { Product } from "./product";

export type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type PaymentStatus = "UNPAID" | "PAID" | "FAILED" | "REFUNDED";

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  orderId: string;
  productId: string;
  product?: Product;
}

export interface Order {
  id: string;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  transactionId?: string | null;
  shippingAddress: string;
  userId: string;
  orderItems: OrderItem[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Shape of data frontend sends when creating an order
export interface CreateOrderPayload {
  shippingAddress: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}