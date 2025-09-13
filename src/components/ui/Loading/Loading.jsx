import React from "react";
import { Spinner } from "./Spinner";
import { cn } from "@/lib/utils";

const Loading = React.forwardRef(
  (
    {
      className,
      size = "default",
      variant = "default",
      text = "Loading...",
      centered = true,
      ...props
    },
    ref,
  ) => {
    const containerClasses = centered
      ? "flex items-center justify-center min-h-screen"
      : "flex items-center justify-center";

    return (
      <div ref={ref} className={cn(containerClasses, className)} {...props}>
        <div className="flex flex-col items-center gap-4">
          <Spinner size={size} variant={variant} />
          {text && (
            <p className="animate-pulse text-sm text-zinc-400">{text}</p>
          )}
        </div>
      </div>
    );
  },
);

Loading.displayName = "Loading";

export { Loading };
