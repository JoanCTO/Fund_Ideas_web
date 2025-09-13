"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { verifyEmail } from "@/lib/api/auth";
import { CheckCircle, XCircle, Mail, ArrowLeft } from "lucide-react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const userId = searchParams.get("userId");
  const secret = searchParams.get("secret");

  useEffect(() => {
    if (userId && secret) {
      verifyUserEmail();
    } else {
      setError("Invalid verification link");
      setLoading(false);
    }
  }, [userId, secret]);

  const verifyUserEmail = async () => {
    try {
      setLoading(true);
      const result = await verifyEmail(userId, secret);

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message || "Email verification failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6 text-center">
            {/* Loading Icon */}
            <div className="animate-element glass mx-auto flex h-16 w-16 items-center justify-center rounded-3xl">
              <Mail className="h-8 w-8 animate-pulse text-violet-400" />
            </div>

            {/* Loading Message */}
            <div className="animate-element animate-delay-100">
              <h1 className="mb-4 text-3xl font-light tracking-tighter text-white">
                Verifying your email...
              </h1>
              <p className="text-zinc-400">
                Please wait while we verify your email address.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                Email verified!
              </h1>
              <p className="mb-6 text-zinc-400">
                Your email has been successfully verified. You can now access
                all features of the platform.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="animate-element animate-delay-200 flex flex-col gap-3">
              <Link href="/dashboard">
                <Button variant="primary" size="lg" fullWidth>
                  Go to Dashboard
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" size="lg" fullWidth>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
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
        <div className="flex flex-col gap-6 text-center">
          {/* Error Icon */}
          <div className="animate-element glass mx-auto flex h-16 w-16 items-center justify-center rounded-3xl">
            <XCircle className="h-8 w-8 text-red-400" />
          </div>

          {/* Error Message */}
          <div className="animate-element animate-delay-100">
            <h1 className="mb-4 text-3xl font-light tracking-tighter text-white">
              Verification failed
            </h1>
            <p className="mb-6 text-zinc-400">
              {error ||
                "We couldn't verify your email address. The link may have expired or been used already."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="animate-element animate-delay-200 flex flex-col gap-3">
            <Link href="/login">
              <Button variant="primary" size="lg" fullWidth>
                Go to Login
              </Button>
            </Link>
            <Link href="/register">
              <Button variant="ghost" size="lg" fullWidth>
                Create New Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
