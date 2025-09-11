import React from "react";
import { cn } from "@/lib/utils";

const Skeleton = React.forwardRef(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-zinc-800/50",
      glass: "glass",
      shimmer: "animate-shimmer bg-zinc-800/50",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "animate-pulse rounded-2xl",
          variants[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Skeleton.displayName = "Skeleton";

const SkeletonText = ({ lines = 1, className, ...props }) => {
  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={cn("h-4", index === lines - 1 && "w-3/4")}
        />
      ))}
    </div>
  );
};

const SkeletonCard = ({
  className,
  showAvatar = true,
  showActions = true,
  ...props
}) => {
  return (
    <div
      className={cn("glass-card space-y-4 rounded-3xl p-6", className)}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center space-x-3">
        {showAvatar && <Skeleton className="h-10 w-10 rounded-2xl" />}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-20 rounded-xl" />
          <Skeleton className="h-8 w-24 rounded-xl" />
        </div>
      )}
    </div>
  );
};

const SkeletonTable = ({ rows = 5, columns = 4, className, ...props }) => {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      {/* Header */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={index} className="h-4" />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton
              key={colIndex}
              className={cn("h-4", colIndex === columns - 1 && "w-3/4")}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export { Skeleton, SkeletonText, SkeletonCard, SkeletonTable };
