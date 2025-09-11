import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const Checkbox = React.forwardRef(
  (
    {
      className,
      checked = false,
      onChange,
      disabled = false,
      label,
      description,
      error,
      success,
      ...props
    },
    ref,
  ) => {
    const checkboxId = React.useId();

    return (
      <div className="space-y-2">
        <div className="flex items-start space-x-3">
          <div className="relative flex items-center">
            <input
              id={checkboxId}
              type="checkbox"
              checked={checked}
              onChange={onChange}
              disabled={disabled}
              className="sr-only"
              ref={ref}
              {...props}
            />
            <label
              htmlFor={checkboxId}
              className={cn(
                "custom-checkbox cursor-pointer",
                checked && "border-violet-500 bg-violet-500",
                disabled && "cursor-not-allowed opacity-50",
                error && "border-red-400/40",
                success && "border-green-400/40",
                className,
              )}
            >
              {checked && <Check className="h-3 w-3 text-white" />}
            </label>
          </div>

          {(label || description) && (
            <div className="flex-1 space-y-1">
              {label && (
                <label
                  htmlFor={checkboxId}
                  className={cn(
                    "cursor-pointer text-sm font-medium",
                    error
                      ? "text-red-400"
                      : success
                        ? "text-green-400"
                        : "text-zinc-100",
                  )}
                >
                  {label}
                </label>
              )}
              {description && (
                <p className="text-sm text-zinc-400">{description}</p>
              )}
            </div>
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
  ({ className, children, label, description, error, ...props }, ref) => {
    return (
      <div className="space-y-3">
        {(label || description) && (
          <div className="space-y-1">
            {label && (
              <h3 className="text-sm font-medium text-zinc-100">{label}</h3>
            )}
            {description && (
              <p className="text-sm text-zinc-400">{description}</p>
            )}
          </div>
        )}

        <div ref={ref} className={cn("space-y-2", className)} {...props}>
          {children}
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    );
  },
);

CheckboxGroup.displayName = "CheckboxGroup";

export { Checkbox, CheckboxGroup };
