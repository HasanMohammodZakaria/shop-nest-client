import { User } from "./user";

export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  userId: string;
  user?: User;
  productId: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}