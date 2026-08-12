"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { registerUser } from "@/lib/api/auth";

interface FormData {
  name: string;
  email: string;
  password: string;
  image: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    image: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    try {
      await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        image: formData.image.trim() || undefined,
      });

      toast.success("Account created! Please log in.");
      router.push("/login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-bg-muted px-4 py-12">
      <div className="w-full max-w-md bg-bg rounded-xl shadow-md p-6 sm:p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="text-xl font-bold text-secondary">
            Shop<span className="text-primary">Nest</span>
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-text text-center mb-1">
          Create your account
        </h1>
        <p className="text-sm text-text-muted text-center mb-6">
          Sign up to start shopping
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="name"
            name="name"
            type="text"
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            className="placeholder:text-text-muted/60"
            autoComplete="name"
          />

          <Input
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            className="placeholder:text-text-muted/60"
            autoComplete="email"
          />

          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              className="placeholder:text-text-muted/60 pr-10"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className={`absolute right-3 text-text-muted hover:text-text ${
                errors.password ? "top-9.5" : "top-8.5"
              }`}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          <Input
            id="image"
            name="image"
            type="url"
            label="Profile Image URL (optional)"
            placeholder="https://example.com/photo.jpg"
            value={formData.image}
            onChange={handleChange}
            className="placeholder:text-text-muted/60"
            autoComplete="off"
          />

          <Button type="submit" variant="primary" isLoading={isLoading} className="w-full mt-2">
            Register
          </Button>
        </form>

        <p className="text-sm text-text-muted text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}