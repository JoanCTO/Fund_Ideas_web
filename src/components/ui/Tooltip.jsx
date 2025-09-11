"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

const Tooltip = React.forwardRef(
  (
    {
      className,
      children,
      content,
      placement = "top",
      delay = 500,
      disabled = false,
      ...props
    },
    ref,
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef(null);
    const tooltipRef = useRef(null);
    const timeoutRef = useRef(null);

    const placements = {
      top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
      bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
      left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
      right: "left-full top-1/2 transform -translate-y-1/2 ml-2",
    };

    const arrows = {
      top: "top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-zinc-800/40",
      bottom:
        "bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-zinc-800/40",
      left: "left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-zinc-800/40",
      right:
        "right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-zinc-800/40",
    };

    const updatePosition = () => {
      if (!triggerRef.current || !tooltipRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;

      let top = 0;
      let left = 0;

      switch (placement) {
        case "top":
          top = triggerRect.top + scrollY - tooltipRect.height - 8;
          left =
            triggerRect.left +
            scrollX +
            (triggerRect.width - tooltipRect.width) / 2;
          break;
        case "bottom":
          top = triggerRect.bottom + scrollY + 8;
          left =
            triggerRect.left +
            scrollX +
            (triggerRect.width - tooltipRect.width) / 2;
          break;
        case "left":
          top =
            triggerRect.top +
            scrollY +
            (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.left + scrollX - tooltipRect.width - 8;
          break;
        case "right":
          top =
            triggerRect.top +
            scrollY +
            (triggerRect.height - tooltipRect.height) / 2;
          left = triggerRect.right + scrollX + 8;
          break;
      }

      setPosition({ top, left });
    };

    const handleMouseEnter = () => {
      if (disabled) return;

      timeoutRef.current = setTimeout(() => {
        setIsVisible(true);
        updatePosition();
      }, delay);
    };

    const handleMouseLeave = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsVisible(false);
    };

    const handleMouseMove = () => {
      if (isVisible) {
        updatePosition();
      }
    };

    useEffect(() => {
      if (isVisible) {
        updatePosition();
        window.addEventListener("scroll", updatePosition);
        window.addEventListener("resize", updatePosition);
      }

      return () => {
        window.removeEventListener("scroll", updatePosition);
        window.removeEventListener("resize", updatePosition);
      };
    }, [isVisible, placement]);

    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    return (
      <div
        ref={ref}
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        {...props}
      >
        <div ref={triggerRef}>{children}</div>

        {isVisible && content && (
          <div
            ref={tooltipRef}
            className={cn(
              "glass-card animate-element absolute z-50 rounded-xl px-3 py-2 text-sm text-zinc-100",
              placements[placement],
              className,
            )}
            style={{
              top: position.top,
              left: position.left,
            }}
          >
            {content}
            {/* Arrow */}
            <div
              className={cn("absolute h-0 w-0 border-4", arrows[placement])}
            />
          </div>
        )}
      </div>
    );
  },
);

Tooltip.displayName = "Tooltip";

const TooltipProvider = ({ children, delay = 500 }) => {
  return <div data-tooltip-delay={delay}>{children}</div>;
};

const TooltipTrigger = React.forwardRef(
  ({ className, children, asChild = false, ...props }, ref) => {
    if (asChild) {
      return React.cloneElement(children, {
        ref,
        ...props,
      });
    }

    return (
      <div ref={ref} className={cn("inline-block", className)} {...props}>
        {children}
      </div>
    );
  },
);

TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "glass-card animate-element rounded-xl px-3 py-2 text-sm text-zinc-100",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

TooltipContent.displayName = "TooltipContent";

export { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent };
