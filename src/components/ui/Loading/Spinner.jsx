import React from "react";
import { cn } from "@/lib/utils";

const Spinner = React.forwardRef(
  ({ className, size = "default", variant = "default", ...props }, ref) => {
    const sizes = {
      sm: "w-4 h-4",
      default: "w-6 h-6",
      lg: "w-8 h-8",
      xl: "w-12 h-12",
    };

    const variants = {
      default: "text-violet-400",
      white: "text-white",
      muted: "text-zinc-400",
      success: "text-green-400",
      warning: "text-yellow-400",
      error: "text-red-400",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "animate-spin",
          sizes[size],
          variants[variant],
          className,
        )}
        {...props}
      >
        <svg
          className="h-full w-full"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="32"
            strokeDashoffset="32"
            className="animate-spin"
          />
        </svg>
      </div>
    );
  },
);

Spinner.displayName = "Spinner";

export { Spinner };
