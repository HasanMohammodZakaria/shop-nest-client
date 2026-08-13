"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiEdit2, FiTrash2, FiPlus, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import { getAllProducts, deleteProduct } from "@/lib/api/products";
import { Product, PaginationMeta } from "@/types/product";

const LIMIT = 10;

export default function ManageProductsPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !token) {
      router.push("/login");
      return;
    }
    if (user.role !== "ADMIN") {
      router.push("/");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    getAllProducts({ page, limit: LIMIT })
      .then((res) => {
        setProducts(res.data);
        setMeta(res.meta);
      })
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load products"))
      .finally(() => setIsLoading(false));
  }, [authLoading, user, token, router, page]);

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!confirm("Delete this product?")) return;

    setDeletingId(id);
    try {
      await deleteProduct(id, token);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete product");
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text-muted">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Manage Products</h1>
        <Link href="/dashboard/products/new">
          <Button className="flex items-center gap-2">
            <FiPlus size={16} /> Add Product
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="rounded-xl border border-border bg-bg-muted py-10 text-center text-text-muted">
          No products yet.{" "}
          <Link href="/dashboard/products/new" className="text-primary hover:underline">
            Add your first product
          </Link>
        </p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border border-border bg-bg shadow-sm">
            <table className="w-full min-w-160 text-sm">
              <thead>
                <tr className="border-b border-border bg-bg-muted text-left text-text-muted">
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-bg-muted">
                          {p.images?.[0] && (
                            <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                          )}
                        </div>
                        <span className="line-clamp-1 font-medium text-text">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-muted">{p.category?.name || "—"}</td>
                    <td className="px-4 py-3 text-text">${p.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-text">{p.stock}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          p.status === "ACTIVE"
                            ? "bg-success/10 text-success"
                            : p.status === "OUT_OF_STOCK"
                            ? "bg-error/10 text-error"
                            : "bg-bg-muted text-text-muted"
                        }`}
                      >
                        {p.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/dashboard/products/${p.id}/edit`}
                          className="text-text-muted hover:text-primary"
                          aria-label="Edit"
                        >
                          <FiEdit2 size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deletingId === p.id}
                          className="text-text-muted hover:text-error disabled:opacity-40"
                          aria-label="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="mt-5 flex items-center justify-between">
              <p className="text-sm text-text-muted">
                Page {meta.page} of {meta.totalPages} · {meta.total} products
              </p>
              <div className="flex items-center gap-2">
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
                      num === page
                        ? "bg-primary text-white"
                        : "text-text hover:bg-bg-muted"
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
            </div>
          )}
        </>
      )}
    </div>
  );
}