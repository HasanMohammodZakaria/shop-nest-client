"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { updateMyProfile, changeMyPassword } from "@/lib/api/users";

export default function ProfilePage() {
  const { user, token, isLoading: authLoading, login } = useAuth();
  const router = useRouter();

  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    address: "",
    image: "",
  });
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "" });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [savingPassword, setSavingPassword] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !token) {
      router.push("/login");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfileForm({
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || "",
      image: user.image || "",
    });
  }, [authLoading, user, token, router]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    setProfileErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user) return;

    const errs: Record<string, string> = {};
    if (profileForm.name.trim().length < 2) errs.name = "Name must be at least 2 characters";
    if (profileForm.phone && profileForm.phone.trim().length < 6) errs.phone = "Invalid phone number";
    setProfileErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSavingProfile(true);
    try {
      const updated = await updateMyProfile(
        {
          name: profileForm.name.trim(),
          phone: profileForm.phone.trim() || undefined,
          address: profileForm.address.trim() || undefined,
          image: profileForm.image.trim() || undefined,
        },
        token
      );
      login(updated, token);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const errs: Record<string, string> = {};
    if (!passwordForm.oldPassword) errs.oldPassword = "Current password is required";
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      errs.newPassword = "New password must be at least 6 characters";
    }
    setPasswordErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSavingPassword(true);
    try {
      await changeMyPassword(passwordForm, token);
      toast.success("Password changed successfully");
      setPasswordForm({ oldPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-text-muted">Loading profile...</p>
      </div>
    );
  }

  const avatarPreview =
    profileForm.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=059669&color=fff`;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-text">My Profile</h1>

      {/* Profile info card */}
      <div className="mb-8 rounded-xl border border-border bg-bg p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-text">Personal Information</h2>

        <div className="mb-5 flex items-center gap-4">
          <Image
            src={avatarPreview}
            alt={user.name}
            width={64}
            height={64}
            className="h-16 w-16 rounded-full object-cover border border-border"
          />
          <p className="text-sm text-text-muted">
            Paste an image URL below to update your profile picture
          </p>
        </div>

        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
          <Input
            id="name"
            name="name"
            label="Full Name"
            value={profileForm.name}
            onChange={handleProfileChange}
            error={profileErrors.name}
            className="placeholder:text-text-muted/60"
          />

          <Input
            id="email"
            name="email"
            label="Email"
            value={user.email}
            disabled
            className="cursor-not-allowed bg-bg-muted text-text-muted"
          />

          <Input
            id="phone"
            name="phone"
            label="Phone"
            placeholder="e.g. 01700000000"
            value={profileForm.phone}
            onChange={handleProfileChange}
            error={profileErrors.phone}
            className="placeholder:text-text-muted/60"
          />

          <Input
            id="address"
            name="address"
            label="Address"
            placeholder="Your shipping address"
            value={profileForm.address}
            onChange={handleProfileChange}
            className="placeholder:text-text-muted/60"
          />

          <Input
            id="image"
            name="image"
            type="url"
            label="Profile Image URL"
            placeholder="https://example.com/photo.jpg"
            value={profileForm.image}
            onChange={handleProfileChange}
            className="placeholder:text-text-muted/60"
          />

          <Button type="submit" variant="primary" isLoading={savingProfile} className="mt-2 w-full sm:w-auto">
            Save Changes
          </Button>
        </form>
      </div>

      {/* Change password card */}
      <div className="rounded-xl border border-border bg-bg p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-text">Change Password</h2>
        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <Input
              id="oldPassword"
              name="oldPassword"
              type={showOld ? "text" : "password"}
              label="Current Password"
              placeholder="Enter current password"
              value={passwordForm.oldPassword}
              onChange={handlePasswordChange}
              error={passwordErrors.oldPassword}
              className="placeholder:text-text-muted/60 pr-10"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowOld((v) => !v)}
              className={`absolute right-3 text-text-muted hover:text-text ${
                passwordErrors.oldPassword ? "top-9.5" : "top-8.5"
              }`}
              tabIndex={-1}
              aria-label={showOld ? "Hide password" : "Show password"}
            >
              {showOld ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          <div className="relative">
            <Input
              id="newPassword"
              name="newPassword"
              type={showNew ? "text" : "password"}
              label="New Password"
              placeholder="At least 6 characters"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              error={passwordErrors.newPassword}
              className="placeholder:text-text-muted/60 pr-10"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className={`absolute right-3 text-text-muted hover:text-text ${
                passwordErrors.newPassword ? "top-9.5" : "top-8.5"
              }`}
              tabIndex={-1}
              aria-label={showNew ? "Hide password" : "Show password"}
            >
              {showNew ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          <Button type="submit" variant="primary" isLoading={savingPassword} className="mt-2 w-full sm:w-auto">
            Change Password
          </Button>
        </form>
      </div>
    </div>
  );
}