import React from "react";
import { cn } from "@/lib/utils";

const Progress = React.forwardRef(
  (
    {
      className,
      value = 0,
      max = 100,
      size = "default",
      variant = "default",
      showLabel = false,
      label,
      ...props
    },
    ref,
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const sizes = {
      sm: "h-2",
      default: "h-3",
      lg: "h-4",
    };

    const variants = {
      default: "bg-violet-500",
      success: "bg-green-500",
      warning: "bg-yellow-500",
      error: "bg-red-500",
    };

    return (
      <div className="w-full space-y-2">
        {(showLabel || label) && (
          <div className="flex justify-between text-sm">
            <span className="text-zinc-400">{label || "Progress"}</span>
            <span className="font-medium text-zinc-100">
              {Math.round(percentage)}%
            </span>
          </div>
        )}

        <div
          ref={ref}
          className={cn(
            "glass w-full overflow-hidden rounded-full",
            sizes[size],
            className,
          )}
          {...props}
        >
          <div
            className={cn(
              "h-full transition-all duration-500 ease-out",
              variants[variant],
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  },
);

Progress.displayName = "Progress";

const ProgressCircle = React.forwardRef(
  (
    {
      className,
      value = 0,
      max = 100,
      size = 100,
      strokeWidth = 8,
      variant = "default",
      showLabel = false,
      label,
      ...props
    },
    ref,
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const variants = {
      default: "stroke-violet-500",
      success: "stroke-green-500",
      warning: "stroke-yellow-500",
      error: "stroke-red-500",
    };

    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="relative" ref={ref}>
          <svg
            width={size}
            height={size}
            className={cn("-rotate-90 transform", className)}
            {...props}
          >
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="none"
              className="text-zinc-800"
            />
            {/* Progress circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={cn(
                "transition-all duration-500 ease-out",
                variants[variant],
              )}
            />
          </svg>

          {/* Center label */}
          {(showLabel || label) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-medium text-zinc-100">
                {Math.round(percentage)}%
              </span>
            </div>
          )}
        </div>

        {label && <span className="text-sm text-zinc-400">{label}</span>}
      </div>
    );
  },
);

ProgressCircle.displayName = "ProgressCircle";

export { Progress, ProgressCircle };
