export interface Category {
  id: string;
  name: string;
  description?: string | null;
  image?: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}