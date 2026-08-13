import { User } from "@/types/user";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const authHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export async function updateMyProfile(
  data: Partial<{ name: string; phone: string; address: string; image: string }>,
  token: string
): Promise<User> {
  const res = await fetch(`${BASE_URL}/users/me`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to update profile");
  return result.data;
}

export async function changeMyPassword(
  data: { oldPassword: string; newPassword: string },
  token: string
): Promise<void> {
  const res = await fetch(`${BASE_URL}/users/me/password`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const result = await res.json();
    throw new Error(result.message || "Failed to change password");
  }
}

export async function getAllUsers(token: string): Promise<User[]> {
  const res = await fetch(`${BASE_URL}/users`, {
    headers: authHeaders(token),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.message || "Failed to fetch users");
  return result.data ?? result;
}

export async function deleteUser(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!res.ok) {
    const result = await res.json();
    throw new Error(result.message || "Failed to delete user");
  }
}