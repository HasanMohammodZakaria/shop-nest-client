import { Product, ProductListResponse, ProductFilters } from "@/types/product";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const authHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export async function getAllProducts(filters?: ProductFilters): Promise<ProductListResponse> {
  const query = new URLSearchParams();
  if (filters?.page) query.set("page", String(filters.page));
  if (filters?.limit) query.set("limit", String(filters.limit));
  if (filters?.search) query.set("search", filters.search);
  if (filters?.categoryId) query.set("categoryId", filters.categoryId);
  if (filters?.status) query.set("status", filters.status);
  if (filters?.minPrice) query.set("minPrice", String(filters.minPrice));
  if (filters?.maxPrice) query.set("maxPrice", String(filters.maxPrice));
  if (filters?.sortBy) query.set("sortBy", filters.sortBy);
  if (filters?.sortOrder) query.set("sortOrder", filters.sortOrder);

  const res = await fetch(`${BASE_URL}/products?${query.toString()}`);
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to fetch products");
  
  return { meta: result.meta, data: result.data };
}

export async function getProductById(id: string): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`);
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to fetch product");
  return result.data; 
}

export async function createProduct(
  data: {
    name: string;
    description: string;
    price: number;
    stock?: number;
    images?: string[];
    categoryId: string;
  },
  token: string
): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to create product");
  return result.data; 
}

export async function updateProduct(
  id: string,
  data: Partial<{
    name: string;
    description: string;
    price: number;
    stock: number;
    images: string[];
    categoryId: string;
    status: string;
  }>,
  token: string
): Promise<Product> {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to update product");
  return result.data;
}

export async function deleteProduct(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const result = await res.json();
    throw new Error(result.message || "Failed to delete product");
  }
}