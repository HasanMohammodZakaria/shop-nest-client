import { Product } from "./product";

export interface Wishlist {
  id: string;
  userId: string;
  productId: string;
  product?: Product;
  createdAt: string;
}