import { Category } from "@/types/category";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const authHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export async function getAllCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/categories`);
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to fetch categories");
  return result.data ?? result;
}

export async function createCategory(
  data: { name: string; description?: string; image?: string },
  token: string
): Promise<Category> {
  const res = await fetch(`${BASE_URL}/categories`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to create category");
  return result.data;
}

export async function updateCategory(
  id: string,
  data: { name?: string; description?: string; image?: string },
  token: string
): Promise<Category> {
  const res = await fetch(`${BASE_URL}/categories/${id}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to update category");
  return result.data;
}

export async function deleteCategory(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/categories/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const result = await res.json();
    throw new Error(result.message || "Failed to delete category");
  }
}