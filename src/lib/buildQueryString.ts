import { ProductFilters } from "@/types/product";

// Converts { search: "phone", minPrice: 100 } into "?search=phone&minPrice=100"
// Skips any filter that's undefined/empty, so the URL stays clean.
export function buildQueryString(filters: ProductFilters): string {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}