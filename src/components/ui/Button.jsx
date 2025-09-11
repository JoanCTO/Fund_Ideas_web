import React from "react";
import { cn } from "@/lib/utils";

const Button = React.forwardRef(
  (
    {
      className,
      variant = "primary",
      size = "default",
      children,
      disabled = false,
      fullWidth = false,
      ...props
    },
    ref,
  ) => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-white text-zinc-900 hover:bg-zinc-100 rounded-2xl",
      glass: "glass text-zinc-100 hover:bg-zinc-900/30 rounded-2xl",
      accent: "bg-violet-500 text-white hover:bg-violet-600 rounded-2xl",
      ghost: "text-zinc-100 hover:bg-zinc-900/30 rounded-2xl",
    };

    const sizes = {
      sm: "py-2 px-4 text-sm",
      default: "py-4 px-6 text-base",
      lg: "py-5 px-8 text-lg",
    };

    const widthClass = fullWidth ? "w-full" : "";

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          widthClass,
          className,
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
