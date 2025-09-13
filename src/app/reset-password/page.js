"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { account } from "@/lib/appwrite";
import { Eye, EyeOff, CheckCircle } from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  useEffect(() => {
    if (!userId || !secret) {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [userId, secret]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (error) setError("");

    // Check password strength
    if (name === "password") {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    if (password.length < 8) {
      setPasswordStrength("weak");
    } else if (password.length >= 8 && /[0-9]/.test(password)) {
      setPasswordStrength("strong");
    } else {
      setPasswordStrength("medium");
    }
  };

  const validateForm = () => {
    if (!formData.password || formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    if (!/[0-9]/.test(formData.password)) {
      setError("Password must contain at least one number");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      await account.updateRecovery(userId, secret, formData.password);
      setSuccess(true);
    } catch (err) {
      setError("Failed to reset password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "weak":
        return "text-red-400";
      case "medium":
        return "text-yellow-400";
      case "strong":
        return "text-green-400";
      default:
        return "text-zinc-500";
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case "weak":
        return "Weak";
      case "medium":
        return "Medium";
      case "strong":
        return "Strong";
      default:
        return "";
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6 text-center">
            {/* Success Icon */}
            <div className="animate-element glass mx-auto flex h-16 w-16 items-center justify-center rounded-3xl">
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>

            {/* Success Message */}
            <div className="animate-element animate-delay-100">
              <h1 className="mb-4 text-3xl font-light tracking-tighter text-white">
                Password updated!
              </h1>
              <p className="mb-6 text-zinc-400">
                Your password has been successfully updated. You can now log in
                with your new password.
              </p>
            </div>

            {/* Login Button */}
            <div className="animate-element animate-delay-200">
              <Link href="/login">
                <Button variant="primary" size="lg" fullWidth>
                  Go to Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-8">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <div className="animate-element glass mx-auto flex h-12 w-12 items-center justify-center rounded-3xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 stroke-violet-400"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.071-7.071l-1.414 1.414M6.343 17.657l-1.414 1.414m0-14.142l1.414 1.414m11.314 11.314l1.414 1.414" />
            </svg>
          </div>

          {/* Heading */}
          <div className="animate-element animate-delay-100 text-center">
            <h1 className="mb-2 text-3xl font-light tracking-tighter text-white">
              Set new password
            </h1>
            <p className="text-zinc-400">Enter your new password below</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="animate-element animate-delay-200 rounded-2xl border border-red-400/20 bg-red-400/10 p-4 text-red-400">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="animate-element animate-delay-300">
              <label className="mb-2 block text-sm font-medium text-zinc-400">
                New Password
              </label>
              <div className="glass-input relative rounded-2xl">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your new password"
                  className="w-full bg-transparent pr-12 text-zinc-100 placeholder-zinc-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-zinc-500 transition-colors hover:text-zinc-300"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2 flex items-center gap-2">
                  <span className={`text-sm ${getPasswordStrengthColor()}`}>
                    {getPasswordStrengthText()}
                  </span>
                  {passwordStrength === "strong" && (
                    <CheckCircle className="h-4 w-4 text-green-400" />
                  )}
                </div>
              )}
            </div>

            <div className="animate-element animate-delay-400">
              <label className="mb-2 block text-sm font-medium text-zinc-400">
                Confirm New Password
              </label>
              <div className="glass-input relative rounded-2xl">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your new password"
                  className="w-full bg-transparent pr-12 text-zinc-100 placeholder-zinc-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-zinc-500 transition-colors hover:text-zinc-300"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading || !userId || !secret}
              className="animate-element animate-delay-500"
            >
              {loading ? "Updating password..." : "Update Password"}
            </Button>
          </form>

          {/* Back to Login */}
          <div className="animate-element animate-delay-600 text-center">
            <Link
              href="/login"
              className="text-violet-400 transition-colors hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-8">
          <div className="w-full max-w-md">
            <div className="flex flex-col gap-6 text-center">
              <div className="animate-element glass mx-auto flex h-16 w-16 items-center justify-center rounded-3xl">
                <div className="h-8 w-8 animate-pulse rounded-full bg-violet-400/20"></div>
              </div>
              <div className="animate-element animate-delay-100">
                <h1 className="mb-4 text-3xl font-light tracking-tighter text-white">
                  Loading...
                </h1>
                <p className="text-zinc-400">
                  Please wait while we load the page.
                </p>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
