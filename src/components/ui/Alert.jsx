"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "./Button";

const Alert = React.forwardRef(
  (
    {
      className,
      variant = "default",
      title,
      description,
      children,
      dismissible = false,
      onDismiss,
      ...props
    },
    ref,
  ) => {
    const [isVisible, setIsVisible] = useState(true);

    const variants = {
      default: "glass border-white/10",
      success: "bg-green-500/10 border-green-400/30 text-green-400",
      warning: "bg-yellow-500/10 border-yellow-400/30 text-yellow-400",
      error: "bg-red-500/10 border-red-400/30 text-red-400",
      info: "bg-blue-500/10 border-blue-400/30 text-blue-400",
    };

    const icons = {
      default: Info,
      success: CheckCircle,
      warning: AlertTriangle,
      error: AlertCircle,
      info: Info,
    };

    const Icon = icons[variant];

    const handleDismiss = () => {
      setIsVisible(false);
      onDismiss?.();
    };

    if (!isVisible) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "glass animate-element rounded-2xl border p-4 transition-all duration-300",
          variants[variant],
          className,
        )}
        {...props}
      >
        <div className="flex items-start space-x-3">
          <Icon
            className={cn(
              "mt-0.5 h-5 w-5 flex-shrink-0",
              variants[variant].includes("text-") ? "" : "text-zinc-400",
            )}
          />

          <div className="min-w-0 flex-1">
            {title && (
              <h3
                className={cn(
                  "mb-1 text-sm font-semibold",
                  variants[variant].includes("text-") ? "" : "text-zinc-100",
                )}
              >
                {title}
              </h3>
            )}

            {description && (
              <p
                className={cn(
                  "text-sm",
                  variants[variant].includes("text-") ? "" : "text-zinc-400",
                )}
              >
                {description}
              </p>
            )}

            {children}
          </div>

          {dismissible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="p-1 text-zinc-400 hover:text-zinc-100"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  },
);

Alert.displayName = "Alert";

const Toast = React.forwardRef(
  (
    {
      className,
      variant = "default",
      title,
      description,
      duration = 5000,
      onDismiss,
      ...props
    },
    ref,
  ) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
      if (duration > 0) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          onDismiss?.();
        }, duration);

        return () => clearTimeout(timer);
      }
    }, [duration, onDismiss]);

    const handleDismiss = () => {
      setIsVisible(false);
      onDismiss?.();
    };

    if (!isVisible) return null;

    return (
      <Alert
        ref={ref}
        variant={variant}
        title={title}
        description={description}
        dismissible
        onDismiss={handleDismiss}
        className={cn("fixed top-4 right-4 z-50 max-w-sm shadow-lg", className)}
        {...props}
      />
    );
  },
);

Toast.displayName = "Toast";

const LoadingAlert = React.forwardRef(
  ({ className, title = "Loading...", description, ...props }, ref) => {
    return (
      <Alert
        ref={ref}
        variant="info"
        title={title}
        description={description}
        className={cn("animate-pulse", className)}
        {...props}
      >
        <div className="mt-2 flex items-center space-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Please wait...</span>
        </div>
      </Alert>
    );
  },
);

LoadingAlert.displayName = "LoadingAlert";

const AlertProvider = ({ children }) => {
  return <div className="relative">{children}</div>;
};

export { Alert, Toast, LoadingAlert, AlertProvider };
