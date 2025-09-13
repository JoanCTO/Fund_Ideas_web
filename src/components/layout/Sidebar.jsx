"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Home,
  Search,
  Plus,
  User,
  Settings,
  Bell,
  Bookmark,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Badge, NotificationBadge } from "@/components/ui/Badge";

const Sidebar = ({
  className,
  isCollapsed = false,
  onToggleCollapse,
  user = null,
  notifications = 0,
  currentPath = "/",
  ...props
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigationItems = [
    {
      icon: Home,
      label: "Dashboard",
      href: "/dashboard",
      badge: null,
    },
    {
      icon: Search,
      label: "Discover",
      href: "/discover",
      badge: null,
    },
    {
      icon: Plus,
      label: "Create Project",
      href: "/create-project",
      badge: "New",
    },
    {
      icon: TrendingUp,
      label: "My Projects",
      href: "/dashboard/projects",
      badge: null,
    },
    {
      icon: Bookmark,
      label: "Saved",
      href: "/dashboard/saved",
      badge: null,
    },
  ];

  const userItems = [
    {
      icon: User,
      label: "View Profile",
      href: `/profile/${user?.username || "me"}`,
    },
    {
      icon: Settings,
      label: "Edit Profile",
      href: "/profile/edit",
    },
    {
      icon: Settings,
      label: "Account Settings",
      href: "/settings",
    },
  ];

  const isActive = (href) => currentPath === href;

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <Icon container size="lg" variant="violet">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-500">
                <span className="text-sm font-bold text-white">F</span>
              </div>
            </Icon>
            <span className="text-lg font-semibold text-zinc-100">
              Fund Ideas
            </span>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="p-2"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "group flex items-center space-x-3 rounded-xl px-3 py-2 transition-all duration-200",
              isActive(item.href)
                ? "border border-violet-400/30 bg-violet-500/20 text-violet-400"
                : "text-zinc-400 hover:bg-zinc-900/30 hover:text-zinc-100",
            )}
          >
            <item.icon
              className={cn(
                "h-5 w-5 flex-shrink-0",
                isActive(item.href)
                  ? "text-violet-400"
                  : "text-zinc-400 group-hover:text-zinc-100",
              )}
            />
            {!isCollapsed && (
              <>
                <span className="flex-1 text-sm font-medium">{item.label}</span>
                {item.badge && (
                  <Badge variant="violet" size="sm">
                    {item.badge}
                  </Badge>
                )}
              </>
            )}
          </Link>
        ))}
      </nav>

      {/* Notifications */}
      {!isCollapsed && (
        <div className="border-t border-white/10 p-4">
          <NotificationBadge count={notifications} variant="error">
            <Button
              variant="ghost"
              className="w-full justify-start text-zinc-400 hover:text-zinc-100"
            >
              <Bell className="mr-3 h-5 w-5" />
              Notifications
            </Button>
          </NotificationBadge>
        </div>
      )}

      {/* User Section */}
      {user && (
        <div className="border-t border-white/10 p-4">
          <div
            className={cn(
              "flex items-center space-x-3",
              isCollapsed && "justify-center",
            )}
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-violet-500">
              <span className="text-sm font-medium text-white">
                {user.name?.charAt(0) || "U"}
              </span>
            </div>
            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-100">
                  {user.name || "User"}
                </p>
                <p className="truncate text-xs text-zinc-400">{user.email}</p>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <div className="mt-3 space-y-1">
              {userItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 rounded-xl px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-900/30 hover:text-zinc-100"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden flex-col border-r border-white/10 bg-zinc-950 transition-all duration-300 lg:flex",
          isCollapsed ? "w-16" : "w-64",
          className,
        )}
        {...props}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="relative w-64 border-r border-white/10 bg-zinc-950">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMobileOpen(true)}
        className="glass fixed top-4 left-4 z-40 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>
    </>
  );
};

export { Sidebar };
