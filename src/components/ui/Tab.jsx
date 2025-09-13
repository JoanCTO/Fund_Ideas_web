"use client";

import React from "react";
import { cn } from "@/lib/utils";

const Tab = React.forwardRef(
  (
    {
      className,
      tabs = [],
      activeTab,
      onTabChange,
      variant = "default",
      size = "default",
      ...props
    },
    ref,
  ) => {
    const variants = {
      default: "glass rounded-xl p-1",
      minimal: "border-b border-zinc-800",
    };

    const sizes = {
      sm: "text-sm",
      default: "text-base",
      lg: "text-lg",
    };

    return (
      <div
        ref={ref}
        className={cn("flex", variants[variant], className)}
        {...props}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange?.(tab.id)}
            className={cn(
              "rounded-lg px-4 py-2 font-medium transition-all duration-200",
              sizes[size],
              activeTab === tab.id
                ? "bg-violet-500 text-white"
                : "text-zinc-400 hover:bg-zinc-900/30 hover:text-zinc-300",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  },
);

Tab.displayName = "Tab";

export { Tab };
