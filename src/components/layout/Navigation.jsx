"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Bell,
  Search,
  LayoutDashboard,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Badge, NotificationBadge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/contexts/AuthContext";

const Navigation = ({ className, notifications = 0, ...props }) => {
  const router = useRouter();
  const { user, profile, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navItems = [
    { label: "Discover", href: "/discover" },
    { label: "About", href: "/about" },
  ];

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      router.push("/");
    }
    setIsUserMenuOpen(false);
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <nav
      className={cn(
        "sticky top-0 z-40 border-b border-white/10 bg-zinc-950",
        className,
      )}
      {...props}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Icon container size="lg" variant="violet">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-500">
                <span className="text-sm font-bold text-white">F</span>
              </div>
            </Icon>
            <span className="text-xl font-semibold text-zinc-100">
              Fund Ideas
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-zinc-400 transition-colors duration-200 hover:text-zinc-100"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button className="glass rounded-2xl p-2 text-zinc-400 transition-colors hover:bg-zinc-900/30 hover:text-zinc-100">
              <Search className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <NotificationBadge count={notifications} variant="error">
              <button className="glass rounded-2xl p-2 text-zinc-400 transition-colors hover:bg-zinc-900/30 hover:text-zinc-100">
                <Bell className="h-5 w-5" />
              </button>
            </NotificationBadge>

            {/* User Menu */}
            {isAuthenticated && user && profile ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="glass flex items-center space-x-2 rounded-2xl px-3 py-2 text-zinc-100 transition-colors hover:bg-zinc-900/30"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500">
                    <span className="text-sm font-medium text-white">
                      {profile.fullName?.charAt(0) ||
                        user.name?.charAt(0) ||
                        "U"}
                    </span>
                  </div>
                  <span className="hidden text-sm font-medium sm:block">
                    {profile.fullName || user.name || "User"}
                  </span>
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="glass-card animate-element absolute right-0 mt-2 w-48 rounded-2xl p-2">
                    <div className="mb-2 border-b border-white/10 px-3 py-2">
                      <p className="text-sm font-medium text-zinc-100">
                        {profile.fullName || user.name}
                      </p>
                      <p className="text-xs text-zinc-400">{user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2 rounded-xl px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-900/30 hover:text-zinc-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href={`/profile/${profile.username}`}
                      className="flex items-center space-x-2 rounded-xl px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-900/30 hover:text-zinc-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>View Profile</span>
                    </Link>
                    <Link
                      href="/profile/edit"
                      className="flex items-center space-x-2 rounded-xl px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-900/30 hover:text-zinc-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center space-x-2 rounded-xl px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-900/30 hover:text-zinc-100"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Shield className="h-4 w-4" />
                      <span>Account Settings</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center space-x-2 rounded-xl px-3 py-2 text-left text-sm text-red-400 transition-colors hover:bg-red-400/10 hover:text-red-300"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={handleLogin}>
                  Sign In
                </Button>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="glass rounded-2xl p-2 text-zinc-400 transition-colors hover:bg-zinc-900/30 hover:text-zinc-100 md:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="animate-element border-t border-white/10 py-4 md:hidden">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl px-4 py-2 text-zinc-400 transition-colors hover:bg-zinc-900/30 hover:text-zinc-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {isAuthenticated && (
                <>
                  <Link
                    href="/dashboard"
                    className="block rounded-xl px-4 py-2 text-zinc-400 transition-colors hover:bg-zinc-900/30 hover:text-zinc-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={`/profile/${profile?.username}`}
                    className="block rounded-xl px-4 py-2 text-zinc-400 transition-colors hover:bg-zinc-900/30 hover:text-zinc-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export { Navigation };
