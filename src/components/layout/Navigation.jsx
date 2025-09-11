"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, User, Settings, LogOut, Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Badge, NotificationBadge } from "@/components/ui/Badge";

const Navigation = ({
  className,
  user = null,
  notifications = 0,
  onLogin,
  onLogout,
  ...props
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navItems = [
    { label: "Discover", href: "/discover" },
    { label: "Create", href: "/create" },
    { label: "About", href: "/about" },
  ];

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
          <div className="flex items-center space-x-2">
            <Icon container size="lg" variant="violet">
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-500">
                <span className="text-sm font-bold text-white">F</span>
              </div>
            </Icon>
            <span className="text-xl font-semibold text-zinc-100">
              Fund Ideas
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-zinc-400 transition-colors duration-200 hover:text-zinc-100"
              >
                {item.label}
              </a>
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
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="glass flex items-center space-x-2 rounded-2xl px-3 py-2 text-zinc-100 transition-colors hover:bg-zinc-900/30"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500">
                    <span className="text-sm font-medium text-white">
                      {user.name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <span className="hidden text-sm font-medium sm:block">
                    {user.name || "User"}
                  </span>
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="glass-card animate-element absolute right-0 mt-2 w-48 rounded-2xl p-2">
                    <div className="mb-2 border-b border-white/10 px-3 py-2">
                      <p className="text-sm font-medium text-zinc-100">
                        {user.name}
                      </p>
                      <p className="text-xs text-zinc-400">{user.email}</p>
                    </div>
                    <a
                      href="/profile"
                      className="flex items-center space-x-2 rounded-xl px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-900/30 hover:text-zinc-100"
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </a>
                    <a
                      href="/settings"
                      className="flex items-center space-x-2 rounded-xl px-3 py-2 text-sm text-zinc-300 transition-colors hover:bg-zinc-900/30 hover:text-zinc-100"
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </a>
                    <button
                      onClick={onLogout}
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
                <Button variant="ghost" size="sm" onClick={onLogin}>
                  Sign In
                </Button>
                <Button variant="primary" size="sm">
                  Get Started
                </Button>
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
                <a
                  key={item.href}
                  href={item.href}
                  className="block rounded-xl px-4 py-2 text-zinc-400 transition-colors hover:bg-zinc-900/30 hover:text-zinc-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export { Navigation };
