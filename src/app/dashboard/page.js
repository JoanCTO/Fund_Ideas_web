"use client";

import React from "react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { CreatorDashboard } from "@/components/dashboard/CreatorDashboard";
import { BackerDashboard } from "@/components/dashboard/BackerDashboard";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function DashboardPage() {
  const { user, profile } = useAuth();

  return (
    <AuthGuard>
      <DashboardLayout>
        {profile?.userType === "creator" ? (
          <CreatorDashboard user={user} profile={profile} />
        ) : (
          <BackerDashboard user={user} profile={profile} />
        )}
      </DashboardLayout>
    </AuthGuard>
  );
}
