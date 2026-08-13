import { Order, OrderStatus, CreateOrderPayload } from "@/types/order";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const authHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export async function createOrder(data: CreateOrderPayload, token: string): Promise<Order> {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to create order");
  return result.data;
}

export async function getMyOrders(token: string): Promise<Order[]> {
  const res = await fetch(`${BASE_URL}/orders/my-orders`, {
    headers: authHeaders(token),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to fetch orders");
  return result.data ?? result;
}

export async function getAllOrders(token: string): Promise<Order[]> {
  const res = await fetch(`${BASE_URL}/orders`, {
    headers: authHeaders(token),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to fetch orders");
  return result.data ?? result;
}

export async function getOrderById(id: string, token: string): Promise<Order> {
  const res = await fetch(`${BASE_URL}/orders/${id}`, {
    headers: authHeaders(token),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to fetch order");
  return result.data;
}

export async function cancelOrder(id: string, token: string): Promise<Order> {
  const res = await fetch(`${BASE_URL}/orders/${id}/cancel`, {
    method: "PATCH",
    headers: authHeaders(token),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to cancel order");
  return result.data;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  token: string
): Promise<Order> {
  const res = await fetch(`${BASE_URL}/orders/${id}/status`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to update status");
  return result.data;
}