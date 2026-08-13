"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { getProductById, updateProduct } from "@/lib/api/products";
import { getAllCategories } from "@/lib/api/categories";
import { Category } from "@/types/category";

export default function EditProductPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    images: "",
    status: "ACTIVE",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

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

    Promise.all([getProductById(productId), getAllCategories()])
      .then(([product, cats]) => {
        setCategories(cats);
        setForm({
          name: product.name,
          description: product.description,
          price: String(product.price),
          stock: String(product.stock),
          categoryId: product.categoryId,
          images: product.images.join(", "),
          status: product.status,
        });
      })
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load product"))
      .finally(() => setIsLoading(false));
  }, [authLoading, user, token, router, productId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = "Name must be at least 2 characters";
    if (!form.description.trim() || form.description.trim().length < 10)
      errs.description = "Description must be at least 10 characters";
    if (!form.price || Number(form.price) <= 0) errs.price = "Enter a valid price";
    if (!form.categoryId) errs.categoryId = "Select a category";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!validate()) return;

    const images = form.images
      .split(",")
      .map((u) => u.trim())
      .filter(Boolean);

    setSaving(true);
    try {
      await updateProduct(
        productId,
        {
          name: form.name.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          stock: Number(form.stock),
          categoryId: form.categoryId,
          images,
          status: form.status,
        },
        token
      );
      toast.success("Product updated");
      router.push("/dashboard/products");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text-muted">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-text">Edit Product</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-xl border border-border bg-bg p-6 shadow-sm"
      >
        <Input
          id="name"
          name="name"
          label="Product Name"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
          className="placeholder:text-text-muted/60"
        />

        <div className="flex flex-col gap-1">
          <label htmlFor="description" className="text-sm font-medium text-text">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
            className={`rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-primary placeholder:text-text-muted/60 ${
              errors.description ? "border-error" : "border-border"
            }`}
          />
          {errors.description && <span className="text-sm text-error">{errors.description}</span>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            label="Price ($)"
            value={form.price}
            onChange={handleChange}
            error={errors.price}
            className="placeholder:text-text-muted/60"
          />
          <Input
            id="stock"
            name="stock"
            type="number"
            label="Stock"
            value={form.stock}
            onChange={handleChange}
            error={errors.stock}
            className="placeholder:text-text-muted/60"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="categoryId" className="text-sm font-medium text-text">
            Category
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className={`rounded-md border bg-bg px-3 py-2 text-text outline-none focus:ring-2 focus:ring-primary ${
              errors.categoryId ? "border-error" : "border-border"
            }`}
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <span className="text-sm text-error">{errors.categoryId}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="status" className="text-sm font-medium text-text">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="rounded-md border border-border bg-bg px-3 py-2 text-text outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
          </select>
        </div>

        <Input
          id="images"
          name="images"
          label="Image URLs (comma-separated)"
          value={form.images}
          onChange={handleChange}
          className="placeholder:text-text-muted/60"
        />

        <Button type="submit" isLoading={saving} className="mt-2 w-full sm:w-auto">
          Update Product
        </Button>
      </form>
    </div>
  );
}