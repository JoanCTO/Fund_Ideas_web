"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

const TabGroup = React.forwardRef(
  (
    {
      className,
      children,
      defaultValue,
      value,
      onValueChange,
      orientation = "horizontal",
      variant = "default",
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const currentValue = value !== undefined ? value : internalValue;

    const handleValueChange = (newValue) => {
      if (value === undefined) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    };

    const orientations = {
      horizontal: "flex-row",
      vertical: "flex-col",
    };

    const variants = {
      default: "glass rounded-xl p-1",
      minimal: "space-x-1",
      pills: "space-x-1",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          orientations[orientation],
          variants[variant],
          className,
        )}
        {...props}
      >
        {React.Children.map(children, (child) =>
          React.cloneElement(child, {
            value: currentValue,
            onValueChange: handleValueChange,
            orientation,
            variant,
          }),
        )}
      </div>
    );
  },
);

TabGroup.displayName = "TabGroup";

const TabList = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex", className)} {...props}>
      {children}
    </div>
  );
});

TabList.displayName = "TabList";

const Tab = React.forwardRef(
  ({ className, children, value, disabled = false, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 focus:ring-2 focus:ring-violet-400/50 focus:outline-none",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Tab.displayName = "Tab";

const TabTrigger = React.forwardRef(
  ({ className, children, value, disabled = false, ...props }, ref) => {
    const { value: currentValue, onValueChange, variant } = props;
    const isActive = currentValue === value;

    const variants = {
      default: cn(
        "px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200",
        isActive
          ? "bg-violet-500/20 text-violet-400 border border-violet-400/30"
          : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/30",
      ),
      minimal: cn(
        "px-3 py-2 text-sm font-medium border-b-2 transition-colors duration-200",
        isActive
          ? "border-violet-400 text-violet-400"
          : "border-transparent text-zinc-400 hover:text-zinc-100 hover:border-zinc-400",
      ),
      pills: cn(
        "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
        isActive
          ? "bg-violet-500 text-white"
          : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/30",
      ),
    };

    return (
      <button
        ref={ref}
        onClick={() => !disabled && onValueChange?.(value)}
        disabled={disabled}
        className={cn(
          "focus:ring-2 focus:ring-violet-400/50 focus:outline-none",
          disabled && "cursor-not-allowed opacity-50",
          variants[variant],
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

TabTrigger.displayName = "TabTrigger";

const TabContent = React.forwardRef(
  ({ className, children, value, ...props }, ref) => {
    const { value: currentValue } = props;
    const isActive = currentValue === value;

    if (!isActive) return null;

    return (
      <div
        ref={ref}
        className={cn("animate-element mt-4", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

TabContent.displayName = "TabContent";

const TabPanels = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("mt-4", className)} {...props}>
      {children}
    </div>
  );
});

TabPanels.displayName = "TabPanels";

export { TabGroup, TabList, Tab, TabTrigger, TabContent, TabPanels };
