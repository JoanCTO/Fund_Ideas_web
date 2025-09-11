"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef(
  (
    {
      className,
      label,
      error,
      success,
      helperText,
      autoResize = true,
      minRows = 3,
      maxRows = 10,
      ...props
    },
    ref,
  ) => {
    const textareaRef = useRef(null);
    const textareaId = React.useId();

    const handleResize = () => {
      if (!autoResize || !textareaRef.current) return;

      const textarea = textareaRef.current;
      textarea.style.height = "auto";

      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
      const minHeight = lineHeight * minRows;
      const maxHeight = lineHeight * maxRows;
      const scrollHeight = textarea.scrollHeight;

      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);
      textarea.style.height = `${newHeight}px`;
    };

    useEffect(() => {
      if (autoResize) {
        handleResize();
      }
    }, [props.value, autoResize]);

    const handleChange = (e) => {
      if (autoResize) {
        handleResize();
      }
      props.onChange?.(e);
    };

    const inputClasses = cn(
      "glass-input w-full px-4 py-4 text-zinc-100 placeholder-zinc-500 resize-none transition-all duration-300",
      autoResize && "resize-none",
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
            htmlFor={textareaId}
            className={cn(
              "block text-sm font-medium",
              error
                ? "text-red-400"
                : success
                  ? "text-green-400"
                  : "text-zinc-400",
            )}
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={(node) => {
            textareaRef.current = node;
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          className={inputClasses}
          rows={autoResize ? minRows : undefined}
          onChange={handleChange}
          {...props}
        />
        {helperText && !error && !success && (
          <p className="text-sm text-zinc-500">{helperText}</p>
        )}
        {error && <p className="text-sm text-red-400">{error}</p>}
        {success && <p className="text-sm text-green-400">{success}</p>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
