import React from "react";
import { cn } from "@/lib/utils";

const Badge = React.forwardRef(
  (
    { className, variant = "default", size = "default", children, ...props },
    ref,
  ) => {
    const variants = {
      default: "glass text-zinc-100 border-white/10",
      violet: "bg-violet-500/20 text-violet-400 border-violet-400/30",
      success: "bg-green-500/20 text-green-400 border-green-400/30",
      warning: "bg-yellow-500/20 text-yellow-400 border-yellow-400/30",
      error: "bg-red-500/20 text-red-400 border-red-400/30",
      info: "bg-blue-500/20 text-blue-400 border-blue-400/30",
      solid: "bg-violet-500 text-white border-violet-500",
    };

    const sizes = {
      sm: "px-2 py-1 text-xs",
      default: "px-3 py-1.5 text-sm",
      lg: "px-4 py-2 text-base",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg border font-medium transition-colors",
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {children}
      </span>
    );
  },
);

Badge.displayName = "Badge";

const NotificationBadge = React.forwardRef(
  (
    {
      className,
      count,
      max = 99,
      variant = "error",
      size = "sm",
      children,
      ...props
    },
    ref,
  ) => {
    const displayCount = count > max ? `${max}+` : count.toString();

    const variants = {
      error: "bg-red-500 text-white",
      success: "bg-green-500 text-white",
      warning: "bg-yellow-500 text-white",
      info: "bg-blue-500 text-white",
      violet: "bg-violet-500 text-white",
    };

    const sizes = {
      sm: "min-w-[16px] h-4 text-xs px-1",
      default: "min-w-[20px] h-5 text-sm px-1.5",
      lg: "min-w-[24px] h-6 text-base px-2",
    };

    if (!count || count <= 0) return null;

    return (
      <span className="relative inline-block">
        {children}
        <span
          ref={ref}
          className={cn(
            "absolute -top-1 -right-1 flex items-center justify-center rounded-full font-bold",
            variants[variant],
            sizes[size],
            className,
          )}
          {...props}
        >
          {displayCount}
        </span>
      </span>
    );
  },
);

NotificationBadge.displayName = "NotificationBadge";

export { Badge, NotificationBadge };
