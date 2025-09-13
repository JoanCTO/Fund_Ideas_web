"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const Checkbox = React.forwardRef(
  (
    {
      className,
      label,
      checked = false,
      onChange,
      disabled = false,
      error,
      success,
      ...props
    },
    ref,
  ) => {
    const checkboxId = React.useId();

    const handleChange = (e) => {
      if (!disabled) {
        onChange?.(e.target.checked);
      }
    };

    return (
      <div className="space-y-2">
        <div className="flex items-start gap-3">
          <div className="relative">
            <input
              id={checkboxId}
              type="checkbox"
              checked={checked}
              onChange={handleChange}
              disabled={disabled}
              className="sr-only"
              ref={ref}
              {...props}
            />
            <button
              type="button"
              onClick={() => !disabled && onChange?.(!checked)}
              disabled={disabled}
              className={cn(
                "custom-checkbox flex items-center justify-center transition-all duration-200",
                checked && "border-violet-500 bg-violet-500",
                error && "border-red-400/40",
                success && "border-green-400/40",
                disabled && "cursor-not-allowed opacity-50",
                className,
              )}
            >
              {checked && <Check className="h-3 w-3 text-white" />}
            </button>
          </div>

          {label && (
            <label
              htmlFor={checkboxId}
              className={cn(
                "cursor-pointer text-sm transition-colors select-none",
                error
                  ? "text-red-400"
                  : success
                    ? "text-green-400"
                    : "text-zinc-300",
                disabled && "cursor-not-allowed opacity-50",
              )}
            >
              {label}
            </label>
          )}
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {success && <p className="text-sm text-green-400">{success}</p>}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

const CheckboxGroup = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-3", className)} {...props}>
        {children}
      </div>
    );
  },
);

CheckboxGroup.displayName = "CheckboxGroup";

export { Checkbox, CheckboxGroup };
