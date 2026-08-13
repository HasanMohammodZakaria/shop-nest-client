"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/api/categories";
import { Category } from "@/types/category";

export default function ManageCategoriesPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", image: "" });
  const [saving, setSaving] = useState(false);
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

    getAllCategories()
      .then(setCategories)
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load categories"))
      .finally(() => setIsLoading(false));
  }, [authLoading, user, token, router]);

  const openCreateForm = () => {
    setEditingId(null);
    setForm({ name: "", description: "", image: "" });
    setShowForm(true);
  };

  const openEditForm = (cat: Category) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      description: cat.description || "",
      image: cat.image || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!form.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        image: form.image.trim() || undefined,
      };

      if (editingId) {
        const updated = await updateCategory(editingId, payload, token);
        setCategories((prev) => prev.map((c) => (c.id === editingId ? updated : c)));
        toast.success("Category updated");
      } else {
        const created = await createCategory(payload, token);
        setCategories((prev) => [created, ...prev]);
        toast.success("Category created");
      }
      setShowForm(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!confirm("Delete this category? Products under it may be affected.")) return;

    setDeletingId(id);
    try {
      await deleteCategory(id, token);
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Category deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text-muted">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Manage Categories</h1>
        <Button onClick={openCreateForm} className="flex items-center gap-2">
          <FiPlus size={16} /> Add Category
        </Button>
      </div>

      {/* Create/Edit form */}
      {showForm && (
        <div className="mb-6 rounded-xl border border-border bg-bg p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-text">
              {editingId ? "Edit Category" : "New Category"}
            </h2>
            <button onClick={() => setShowForm(false)} aria-label="Close form">
              <FiX size={18} className="text-text-muted" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              id="name"
              label="Name"
              placeholder="e.g. Electronics"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="placeholder:text-text-muted/60"
            />
            <Input
              id="description"
              label="Description (optional)"
              placeholder="Short description"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="placeholder:text-text-muted/60"
            />
            <Input
              id="image"
              type="url"
              label="Image URL (optional)"
              placeholder="https://example.com/category.jpg"
              value={form.image}
              onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
              className="placeholder:text-text-muted/60"
            />

            {form.image && (
              <div className="relative h-32 w-full overflow-hidden rounded-md bg-bg-muted">
                <Image src={form.image} alt="Preview" fill className="object-cover" />
              </div>
            )}

            <Button type="submit" isLoading={saving} className="w-full sm:w-auto">
              {editingId ? "Update" : "Create"}
            </Button>
          </form>
        </div>
      )}

      {/* List */}
      {categories.length === 0 ? (
        <p className="rounded-xl border border-border bg-bg-muted py-10 text-center text-text-muted">
          No categories yet.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border bg-bg shadow-sm">
          {categories.map((cat, i) => (
            <div
              key={cat.id}
              className={`flex items-center justify-between px-5 py-4 ${
                i !== categories.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-bg-muted">
                  {cat.image ? (
                    <Image src={cat.image} alt={cat.name} fill className="object-cover" />
                  ) : null}
                </div>
                <div>
                  <p className="font-medium text-text">{cat.name}</p>
                  {cat.description && (
                    <p className="text-sm text-text-muted">{cat.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => openEditForm(cat)}
                  className="text-text-muted hover:text-primary"
                  aria-label="Edit"
                >
                  <FiEdit2 size={17} />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  disabled={deletingId === cat.id}
                  className="text-text-muted hover:text-error disabled:opacity-40"
                  aria-label="Delete"
                >
                  <FiTrash2 size={17} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}