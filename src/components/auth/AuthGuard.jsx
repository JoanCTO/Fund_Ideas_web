"use client";

import React from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { Loading } from "@/components/ui/Loading/Loading";
import { Button } from "@/components/ui/Button";
import { Shield, ArrowLeft } from "lucide-react";

const AuthGuard = ({ children, fallback = null }) => {
  const { user, profile, isAuthenticated, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <Loading size="lg" text="Checking authentication..." />
      </div>
    );
  }

  // If not authenticated, show access denied
  if (!isAuthenticated || !user || !profile) {
    if (fallback) {
      return fallback;
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-8">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6 text-center">
            {/* Access Denied Icon */}
            <div className="animate-element glass mx-auto flex h-16 w-16 items-center justify-center rounded-3xl">
              <Shield className="h-8 w-8 text-red-400" />
            </div>

            {/* Access Denied Message */}
            <div className="animate-element animate-delay-100">
              <h1 className="mb-4 text-3xl font-light tracking-tighter text-white">
                Access Denied
              </h1>
              <p className="mb-6 text-zinc-400">
                You need to be logged in to access this page. Please sign in to
                continue.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="animate-element animate-delay-200 flex flex-col gap-3">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={() => (window.location.href = "/login")}
              >
                Sign In
              </Button>
              <Button
                variant="ghost"
                size="lg"
                fullWidth
                onClick={() => (window.location.href = "/")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </div>

            {/* Additional Info */}
            <div className="animate-element animate-delay-300">
              <p className="text-sm text-zinc-500">
                Don't have an account?{" "}
                <button
                  onClick={() => (window.location.href = "/register")}
                  className="text-violet-400 transition-colors hover:underline"
                >
                  Create one here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated, render the protected content
  return <>{children}</>;
};

export { AuthGuard };
