"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function SettingsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (status === "loading") {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background">
        <div className="text-paragraph">Loading...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    if (newPassword === currentPassword) {
      setError("New password must be different from current password");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(data.error || "Failed to change password");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-headline mb-2">Settings</h1>
          <p className="text-paragraph">
            Manage your account settings
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-lg p-8 border-2 border-secondary">
          <div className="flex items-center space-x-3 mb-6">
            <Lock className="w-6 h-6 text-highlight" />
            <h2 className="text-2xl font-bold text-headline">Change Password</h2>
          </div>

          {success && (
            <div className="mb-6 p-4 rounded-lg bg-tertiary flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-headline" />
              <span className="text-headline font-medium">Password changed successfully!</span>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-secondary text-headline">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium mb-2 text-headline">
                Current Password
              </label>
              <div className="relative">
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-secondary bg-background text-headline focus:outline-none focus:border-highlight transition-colors"
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-paragraph hover:text-headline transition-colors"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium mb-2 text-headline">
                New Password
              </label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-secondary bg-background text-headline focus:outline-none focus:border-highlight transition-colors"
                  placeholder="Enter new password (min 8 characters)"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-paragraph hover:text-headline transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-headline">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-secondary bg-background text-headline focus:outline-none focus:border-highlight transition-colors"
                  placeholder="Confirm new password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-paragraph hover:text-headline transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold bg-highlight text-background transition-all hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Change Password"}
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-background rounded-lg border-2 border-secondary">
            <p className="text-sm text-paragraph">
              <strong>Password requirements:</strong>
            </p>
            <ul className="mt-2 text-sm text-paragraph space-y-1 list-disc list-inside">
              <li>At least 8 characters long</li>
              <li>Different from your current password</li>
              <li>Easy to remember but hard to guess!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
