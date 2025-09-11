import React from "react";
import { cn } from "@/lib/utils";

const FormField = React.forwardRef(
  (
    { className, children, error, success, required = false, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "space-y-2",
          error && "text-red-400",
          success && "text-green-400",
          className,
        )}
        {...props}
      >
        {children}
        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
        {success && <p className="mt-1 text-sm text-green-400">{success}</p>}
      </div>
    );
  },
);

FormField.displayName = "FormField";

const FormLabel = React.forwardRef(
  ({ className, children, required = false, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn("block text-sm font-medium text-zinc-400", className)}
        {...props}
      >
        {children}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>
    );
  },
);

FormLabel.displayName = "FormLabel";

const FormDescription = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-sm text-zinc-500", className)}
        {...props}
      >
        {children}
      </p>
    );
  },
);

FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef(
  ({ className, children, variant = "error", ...props }, ref) => {
    const variants = {
      error: "text-red-400",
      success: "text-green-400",
      warning: "text-yellow-400",
      info: "text-blue-400",
    };

    return (
      <p
        ref={ref}
        className={cn("text-sm", variants[variant], className)}
        {...props}
      >
        {children}
      </p>
    );
  },
);

FormMessage.displayName = "FormMessage";

export { FormField, FormLabel, FormDescription, FormMessage };
