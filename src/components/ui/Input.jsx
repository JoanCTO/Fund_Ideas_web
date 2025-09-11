import React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(
  (
    { className, type = "text", label, error, success, helperText, ...props },
    ref,
  ) => {
    const inputId = React.useId();

    const inputClasses = cn(
      "glass-input w-full px-4 py-4 text-zinc-100 placeholder-zinc-500 transition-all duration-300",
      error &&
        "border-red-400/40 bg-red-400/5 focus:border-red-400/60 focus:bg-red-400/10",
      success &&
        "border-green-400/40 bg-green-400/5 focus:border-green-400/60 focus:bg-green-400/10",
      className,
    );

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-zinc-400"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          className={inputClasses}
          ref={ref}
          {...props}
        />
        {helperText && !error && (
          <p className="text-sm text-zinc-500">{helperText}</p>
        )}
        {error && <p className="text-sm text-red-400">{error}</p>}
        {success && <p className="text-sm text-green-400">{success}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
