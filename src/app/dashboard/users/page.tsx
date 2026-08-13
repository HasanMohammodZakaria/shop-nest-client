"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiTrash2 } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { getAllUsers, deleteUser } from "@/lib/api/users";
import { User } from "@/types/user";

export default function ManageUsersPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
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

    getAllUsers(token)
      .then(setUsers)
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load users"))
      .finally(() => setIsLoading(false));
  }, [authLoading, user, token, router]);

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (id === user?.id) {
      toast.error("You cannot delete your own account");
      return;
    }
    if (!confirm("Delete this user?")) return;

    setDeletingId(id);
    try {
      await deleteUser(id, token);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("User deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text-muted">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-text">Manage Users</h1>

      {users.length === 0 ? (
        <p className="rounded-xl border border-border bg-bg-muted py-10 text-center text-text-muted">
          No users found.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-bg shadow-sm">
          <table className="w-full min-w-140 text-sm">
            <thead>
              <tr className="border-b border-border bg-bg-muted text-left text-text-muted">
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={
                          u.image ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=059669&color=fff`
                        }
                        alt={u.name}
                        width={32}
                        height={32}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <span className="font-medium text-text">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-text-muted">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        u.role === "ADMIN" ? "bg-primary/10 text-primary" : "bg-bg-muted text-text-muted"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(u.id)}
                      disabled={deletingId === u.id || u.id === user?.id}
                      className="text-text-muted hover:text-error disabled:opacity-30"
                      aria-label="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}