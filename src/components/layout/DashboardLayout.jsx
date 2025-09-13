"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/lib/contexts/AuthContext";

const DashboardLayout = ({ children, className, ...props }) => {
  const pathname = usePathname();
  const { user, profile } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          user={user}
          profile={profile}
          currentPath={pathname}
          notifications={0}
        />

        {/* Main Content */}
        <main
          className={cn(
            "flex-1 transition-all duration-300",
            isSidebarCollapsed ? "lg:ml-8" : "lg:ml-5",
            className,
          )}
          {...props}
        >
          <div className="min-h-screen">{children}</div>
        </main>
      </div>
    </div>
  );
};

export { DashboardLayout };
