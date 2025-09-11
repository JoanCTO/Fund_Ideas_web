"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  children,
  className,
  title,
  description,
  size = "default",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    default: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        className={cn(
          "glass-card animate-element relative w-full rounded-3xl p-6",
          sizes[size],
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        aria-describedby={description ? "modal-description" : undefined}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="glass absolute top-4 right-4 rounded-2xl p-2 text-zinc-400 transition-colors hover:bg-zinc-900/30 hover:text-zinc-100"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        {(title || description) && (
          <div className="mb-4 pr-8">
            {title && (
              <h2
                id="modal-title"
                className="mb-2 text-xl font-medium text-zinc-100"
              >
                {title}
              </h2>
            )}
            {description && (
              <p id="modal-description" className="text-sm text-zinc-400">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Content */}
        <div className="text-zinc-100">{children}</div>
      </div>
    </div>
  );
};

const ModalHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props} />
);

const ModalTitle = ({ className, ...props }) => (
  <h2
    className={cn("text-xl font-medium text-zinc-100", className)}
    {...props}
  />
);

const ModalDescription = ({ className, ...props }) => (
  <p className={cn("text-sm text-zinc-400", className)} {...props} />
);

const ModalContent = ({ className, ...props }) => (
  <div className={cn("pt-0", className)} {...props} />
);

const ModalFooter = ({ className, ...props }) => (
  <div
    className={cn("flex items-center justify-end space-x-2 pt-4", className)}
    {...props}
  />
);

export {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalContent,
  ModalFooter,
};
