"use client";

import React, { createContext, useContext } from "react";
import { cn } from "@/lib/utils";

const TabContext = createContext();

const TabGroup = React.forwardRef(
  ({ className, value, onValueChange, children, ...props }, ref) => {
    return (
      <TabContext.Provider value={{ value, onValueChange }}>
        <div ref={ref} className={cn("w-full", className)} {...props}>
          {children}
        </div>
      </TabContext.Provider>
    );
  },
);

TabGroup.displayName = "TabGroup";

const TabList = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex rounded-xl bg-zinc-900/50 p-1 backdrop-blur-sm",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
});

TabList.displayName = "TabList";

const TabTrigger = React.forwardRef(
  ({ className, value, children, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = useContext(TabContext);
    const isSelected = selectedValue === value;

    return (
      <button
        ref={ref}
        onClick={() => onValueChange?.(value)}
        className={cn(
          "flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
          isSelected
            ? "bg-violet-500 text-white shadow-lg"
            : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-300",
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

const TabPanels = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("mt-6", className)} {...props}>
      {children}
    </div>
  );
});

TabPanels.displayName = "TabPanels";

const TabContent = React.forwardRef(
  ({ className, value, children, ...props }, ref) => {
    const { value: selectedValue } = useContext(TabContext);

    if (selectedValue !== value) {
      return null;
    }

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {children}
      </div>
    );
  },
);

TabContent.displayName = "TabContent";

// Legacy Tab component for backward compatibility
const Tab = React.forwardRef(
  (
    {
      className,
      tabs = [],
      activeTab,
      onTabChange,
      variant = "default",
      size = "default",
      ...props
    },
    ref,
  ) => {
    const variants = {
      default: "glass rounded-xl p-1",
      minimal: "border-b border-zinc-800",
    };

    const sizes = {
      sm: "text-sm",
      default: "text-base",
      lg: "text-lg",
    };

    return (
      <div
        ref={ref}
        className={cn("flex", variants[variant], className)}
        {...props}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange?.(tab.id)}
            className={cn(
              "rounded-lg px-4 py-2 font-medium transition-all duration-200",
              sizes[size],
              activeTab === tab.id
                ? "bg-violet-500 text-white"
                : "text-zinc-400 hover:bg-zinc-900/30 hover:text-zinc-300",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  },
);

Tab.displayName = "Tab";

export { Tab, TabGroup, TabList, TabTrigger, TabPanels, TabContent };
