"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { resetUserPassword } from "@/lib/api/auth";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await resetUserPassword(email);

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message || "Failed to send reset email");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6 text-center">
            {/* Success Icon */}
            <div className="animate-element glass mx-auto flex h-16 w-16 items-center justify-center rounded-3xl">
              <Mail className="h-8 w-8 text-green-400" />
            </div>

            {/* Success Message */}
            <div className="animate-element animate-delay-100">
              <h1 className="mb-4 text-3xl font-light tracking-tighter text-white">
                Check your email
              </h1>
              <p className="mb-6 text-zinc-400">
                If an account with that email exists, we've sent you a password
                reset link.
              </p>
            </div>

            {/* Back to Login */}
            <div className="animate-element animate-delay-200">
              <Link href="/login">
                <Button variant="glass" size="lg" fullWidth>
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back to Login
                </Button>
              </Link>
            </div>

            <p className="animate-element animate-delay-300 text-sm text-zinc-500">
              Didn't receive an email? Check your spam folder or{" "}
              <button
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                }}
                className="text-violet-400 hover:underline"
              >
                try again
              </button>
            </p>
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
              Reset your password
            </h1>
            <p className="text-zinc-400">
              Enter your email address and we'll send you a link to reset your
              password
            </p>
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
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={loading}
              className="animate-element animate-delay-400"
            >
              {loading ? "Sending reset link..." : "Send Reset Link"}
            </Button>
          </form>

          {/* Back to Login */}
          <div className="animate-element animate-delay-500 text-center">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 text-violet-400 transition-colors hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
