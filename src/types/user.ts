export type Role = "ADMIN" | "USER";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  role: Role;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// What the backend sends back after successful login/register
export interface AuthResponse {
  token: string;
  user: User;
}