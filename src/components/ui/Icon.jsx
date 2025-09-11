import React from "react";
import { cn } from "@/lib/utils";

const Icon = React.forwardRef(
  (
    {
      className,
      children,
      size = "default",
      variant = "default",
      container = false,
      ...props
    },
    ref,
  ) => {
    const sizes = {
      sm: "w-4 h-4",
      default: "w-5 h-5",
      lg: "w-6 h-6",
      xl: "w-8 h-8",
    };

    const variants = {
      default: "text-zinc-100",
      violet: "text-violet-400",
      muted: "text-zinc-400",
      success: "text-green-400",
      warning: "text-yellow-400",
      error: "text-red-400",
    };

    const iconElement = (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center",
          sizes[size],
          variants[variant],
          className,
        )}
        {...props}
      >
        {children}
      </span>
    );

    if (container) {
      return (
        <div
          className={cn(
            "glass flex items-center justify-center rounded-3xl",
            size === "sm" && "h-8 w-8",
            size === "default" && "h-10 w-10",
            size === "lg" && "h-12 w-12",
            size === "xl" && "h-16 w-16",
          )}
        >
          {iconElement}
        </div>
      );
    }

    return iconElement;
  },
);

Icon.displayName = "Icon";

export { Icon };
