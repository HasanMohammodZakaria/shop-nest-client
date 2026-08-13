"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { createProduct } from "@/lib/api/products";
import { getAllCategories } from "@/lib/api/categories";
import { Category } from "@/types/category";

export default function AddProductPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    images: "", // comma-separated URLs
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

    getAllCategories()
      .then(setCategories)
      .catch(() => toast.error("Failed to load categories"))
      .finally(() => setLoadingCategories(false));
  }, [authLoading, user, token, router]);

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
    if (form.stock && Number(form.stock) < 0) errs.stock = "Stock cannot be negative";
    if (!form.categoryId) errs.categoryId = "Select a category";

    const urls = form.images
      .split(",")
      .map((u) => u.trim())
      .filter(Boolean);
    const urlPattern = /^https?:\/\/.+/;
    if (urls.some((u) => !urlPattern.test(u))) {
      errs.images = "Each image must be a valid URL";
    }

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
      await createProduct(
        {
          name: form.name.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          stock: form.stock ? Number(form.stock) : 0,
          categoryId: form.categoryId,
          images,
        },
        token
      );
      toast.success("Product created");
      router.push("/dashboard/products");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create product");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loadingCategories) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-text">Add Product</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-xl border border-border bg-bg p-6 shadow-sm"
      >
        <Input
          id="name"
          name="name"
          label="Product Name"
          placeholder="e.g. Wireless Headphones"
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
            placeholder="Describe the product..."
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
            placeholder="0.00"
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
            placeholder="0"
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

        <Input
          id="images"
          name="images"
          label="Image URLs (comma-separated, optional)"
          placeholder="https://example.com/1.jpg, https://example.com/2.jpg"
          value={form.images}
          onChange={handleChange}
          error={errors.images}
          className="placeholder:text-text-muted/60"
        />

        <Button type="submit" isLoading={saving} className="mt-2 w-full sm:w-auto">
          Create Product
        </Button>
      </form>
    </div>
  );
}