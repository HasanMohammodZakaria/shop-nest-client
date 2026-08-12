import { Category } from "./category";

export type ProductStatus = "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  status: ProductStatus;
  categoryId: string;
  category?: Category;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Matches the { meta, data } shape returned by productService.getAllProducts()
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductListResponse {
  meta: PaginationMeta;
  data: Product[];
}

// Query params accepted by GET /api/products — mirrors GetAllProductsQuery in the backend
export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: ProductStatus;
  sortBy?: "createdAt" | "price" | "name" | "stock";
  sortOrder?: "asc" | "desc";
}