"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { FiSearch, FiX, FiChevronLeft, FiChevronRight, FiFilter } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import ProductCard from "@/components/products/ProductCard";
import { getAllProducts } from "@/lib/api/products";
import { getAllCategories } from "@/lib/api/categories";
import { getMyWishlist } from "@/lib/api/wishlist";
import { Product, PaginationMeta, ProductFilters } from "@/types/product";
import { Category } from "@/types/category";

const LIMIT = 9;

const sortOptions = [
  { label: "Newest First", sortBy: "createdAt", sortOrder: "desc" },
  { label: "Oldest First", sortBy: "createdAt", sortOrder: "asc" },
  { label: "Price: Low to High", sortBy: "price", sortOrder: "asc" },
  { label: "Price: High to Low", sortBy: "price", sortOrder: "desc" },
  { label: "Name: A to Z", sortBy: "name", sortOrder: "asc" },
] as const;

export default function ShopPage() {
  const { user, token } = useAuth();
 
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [wishlistedIds, setWishlistedIds] = useState<Set<string>>(new Set());
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // filter state
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [categoryId, setCategoryId] = useState(searchParams.get("categoryId") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sortIndex, setSortIndex] = useState(0);
  const [page, setPage] = useState(1);

  // load categories once
  useEffect(() => {
    getAllCategories()
      .then(setCategories)
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  // load user's wishlist ids (for heart state) if logged in
  useEffect(() => {
    if (!user || !token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWishlistedIds(new Set());
      return;
    }
    getMyWishlist(token)
      .then((items) => setWishlistedIds(new Set(items.map((i) => i.productId))))
      .catch(() => {
        /* silent fail — wishlist state just won't show */
      });
  }, [user, token]);

  const fetchProducts = useCallback(() => {
    const sort = sortOptions[sortIndex];
    const filters: ProductFilters = {
      page,
      limit: LIMIT,
      search: search || undefined,
      categoryId: categoryId || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sortBy: sort.sortBy,
      sortOrder: sort.sortOrder,
    };

    
    setIsLoading(true);
    getAllProducts(filters)
      .then((res) => {
        setProducts(res.data);
        setMeta(res.meta);
      })
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load products"))
      .finally(() => setIsLoading(false));
  }, [page, search, categoryId, minPrice, maxPrice, sortIndex]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [fetchProducts]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const handleWishlistChange = (productId: string, wishlisted: boolean) => {
    setWishlistedIds((prev) => {
      const next = new Set(prev);
      if (wishlisted) next.add(productId);
      else next.delete(productId);
      return next;
    });
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setCategoryId("");
    setMinPrice("");
    setMaxPrice("");
    setSortIndex(0);
    setPage(1);
  };

  const hasActiveFilters = search || categoryId || minPrice || maxPrice;

  const FiltersPanel = (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-text">Search</h3>
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-md border border-border py-2 pl-9 pr-3 text-sm text-text outline-none placeholder:text-text-muted/60 focus:ring-2 focus:ring-primary"
          />
          <FiSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        </form>
      </div>

      {/* Category */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-text">Category</h3>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-sm text-text">
            <input
              type="radio"
              name="category"
              checked={categoryId === ""}
              onChange={() => {
                setCategoryId("");
                setPage(1);
              }}
              className="accent-primary"
            />
            All Categories
          </label>
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 text-sm text-text">
              <input
                type="radio"
                name="category"
                checked={categoryId === cat.id}
                onChange={() => {
                  setCategoryId(cat.id);
                  setPage(1);
                }}
                className="accent-primary"
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-text">Price Range</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-md border border-border px-3 py-2 text-sm text-text outline-none placeholder:text-text-muted/60 focus:ring-2 focus:ring-primary"
          />
          <span className="text-text-muted">–</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-md border border-border px-3 py-2 text-sm text-text outline-none placeholder:text-text-muted/60 focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="mb-2 text-sm font-semibold text-text">Sort By</h3>
        <select
          value={sortIndex}
          onChange={(e) => {
            setSortIndex(Number(e.target.value));
            setPage(1);
          }}
          className="w-full rounded-md border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:ring-2 focus:ring-primary"
        >
          {sortOptions.map((opt, i) => (
            <option key={opt.label} value={i}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center justify-center gap-2 rounded-md border border-border py-2 text-sm text-text-muted hover:bg-bg-muted"
        >
          <FiX size={14} /> Clear Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Shop</h1>
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-text lg:hidden"
        >
          <FiFilter size={16} /> Filters
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[250px_1fr]">
        {/* Sidebar — desktop */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 rounded-xl border border-border bg-bg p-5 shadow-sm">
            {FiltersPanel}
          </div>
        </aside>

        {/* Mobile filters drawer */}
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] overflow-y-auto bg-bg p-5 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-text">Filters</h2>
                <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                  <FiX size={20} className="text-text" />
                </button>
              </div>
              {FiltersPanel}
            </div>
          </div>
        )}

        {/* Products grid */}
        <div>
          {isLoading ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <p className="text-text-muted">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
              <p className="mb-1 font-medium text-text">No products found</p>
              <p className="text-sm text-text-muted">Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm text-text-muted">
                Showing {products.length} of {meta?.total ?? 0} products
              </p>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isWishlisted={wishlistedIds.has(product.id)}
                    onWishlistChange={handleWishlistChange}
                  />
                ))}
              </div>

              {/* Pagination */}
              {meta && meta.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page <= 1}
                    className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm text-text hover:bg-bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FiChevronLeft size={16} /> Prev
                  </button>

                  {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`h-8 w-8 rounded-md text-sm font-medium ${
                        num === page ? "bg-primary text-white" : "text-text hover:bg-bg-muted"
                      }`}
                    >
                      {num}
                    </button>
                  ))}

                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, meta.totalPages))}
                    disabled={page >= meta.totalPages}
                    className="flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm text-text hover:bg-bg-muted disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next <FiChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}