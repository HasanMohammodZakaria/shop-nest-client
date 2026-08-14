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

export interface RecentReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { id: string; name: string; image?: string | null; };
  product: { id: string; name: string };
}