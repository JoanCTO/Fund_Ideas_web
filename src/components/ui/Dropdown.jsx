"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

const Dropdown = React.forwardRef(
  (
    {
      className,
      children,
      trigger,
      placement = "bottom-start",
      align = "start",
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const triggerRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const placements = {
      "bottom-start": "top-full left-0 mt-2",
      "bottom-end": "top-full right-0 mt-2",
      "top-start": "bottom-full left-0 mb-2",
      "top-end": "bottom-full right-0 mb-2",
    };

    const aligns = {
      start: "left-0",
      center: "left-1/2 transform -translate-x-1/2",
      end: "right-0",
    };

    return (
      <div className="relative" ref={ref} {...props}>
        <div
          ref={triggerRef}
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer"
        >
          {trigger}
        </div>

        {isOpen && (
          <div
            ref={dropdownRef}
            className={cn(
              "glass-card animate-element absolute z-50 min-w-[200px] rounded-2xl p-2",
              placements[placement],
              aligns[align],
              className,
            )}
          >
            {children}
          </div>
        )}
      </div>
    );
  },
);

Dropdown.displayName = "Dropdown";

const DropdownTrigger = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("cursor-pointer", className)} {...props}>
        {children}
      </div>
    );
  },
);

DropdownTrigger.displayName = "DropdownTrigger";

const DropdownContent = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-1", className)} {...props}>
        {children}
      </div>
    );
  },
);

DropdownContent.displayName = "DropdownContent";

const DropdownItem = React.forwardRef(
  (
    {
      className,
      children,
      selected = false,
      disabled = false,
      onClick,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors",
          selected
            ? "bg-violet-500/20 text-violet-400"
            : "text-zinc-300 hover:bg-zinc-900/30 hover:text-zinc-100",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
        {...props}
      >
        <span className="flex-1">{children}</span>
        {selected && <Check className="h-4 w-4 text-violet-400" />}
      </button>
    );
  },
);

DropdownItem.displayName = "DropdownItem";

const DropdownSeparator = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("my-1 h-px bg-white/10", className)}
      {...props}
    />
  );
});

DropdownSeparator.displayName = "DropdownSeparator";

const DropdownLabel = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "px-3 py-2 text-xs font-semibold tracking-wider text-zinc-400 uppercase",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

DropdownLabel.displayName = "DropdownLabel";

export {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
};
