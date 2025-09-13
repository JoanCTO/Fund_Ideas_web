"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { ProjectCreationWizard } from "@/components/project/ProjectCreationWizard";
import { Loading } from "@/components/ui/Loading/Loading";

export default function CreateProjectPage() {
  const { user, profile, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      setIsLoading(false);
    }
  }, [loading]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <Loading />
      </div>
    );
  }

  // Check if user is a creator
  if (!profile || profile.userType !== "creator") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-semibold text-zinc-100">
            Access Denied
          </h1>
          <p className="mb-6 text-zinc-400">
            Only creators can create projects. Please update your profile to
            continue.
          </p>
          <a
            href="/profile/edit"
            className="inline-flex items-center rounded-2xl bg-violet-500 px-6 py-3 text-white transition-colors hover:bg-violet-600"
          >
            Update Profile
          </a>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-zinc-950">
        <ProjectCreationWizard user={user} profile={profile} />
      </div>
    </AuthGuard>
  );
}
