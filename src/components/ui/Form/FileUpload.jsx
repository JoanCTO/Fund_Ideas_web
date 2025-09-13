"use client";

import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Upload, X, File } from "lucide-react";

const FileUpload = React.forwardRef(
  (
    {
      className,
      onFileSelect,
      accept,
      multiple = false,
      maxSize = 10 * 1024 * 1024, // 10MB default
      loading = false,
      disabled = false,
      children,
      ...props
    },
    ref,
  ) => {
    const fileInputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState("");

    const handleFiles = (files) => {
      if (disabled || loading) return;

      const fileList = Array.from(files);

      // Validate file count
      if (!multiple && fileList.length > 1) {
        setError("Only one file is allowed");
        return;
      }

      // Validate file sizes
      const oversizedFiles = fileList.filter((file) => file.size > maxSize);
      if (oversizedFiles.length > 0) {
        setError(
          `File size must be less than ${(maxSize / 1024 / 1024).toFixed(1)}MB`,
        );
        return;
      }

      // Validate file types
      if (accept) {
        const acceptedTypes = accept.split(",").map((type) => type.trim());
        const invalidFiles = fileList.filter((file) => {
          return !acceptedTypes.some((type) => {
            if (type.startsWith(".")) {
              return file.name.toLowerCase().endsWith(type.toLowerCase());
            }
            return file.type.match(type.replace("*", ".*"));
          });
        });

        if (invalidFiles.length > 0) {
          setError(`Invalid file type. Accepted: ${accept}`);
          return;
        }
      }

      setError("");
      onFileSelect?.(fileList);
    };

    const handleDrag = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFiles(e.dataTransfer.files);
      }
    };

    const handleClick = () => {
      if (!disabled && !loading) {
        fileInputRef.current?.click();
      }
    };

    const handleFileInputChange = (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFiles(e.target.files);
      }
    };

    return (
      <div className="space-y-2">
        <div
          ref={ref}
          className={cn(
            "relative cursor-pointer transition-all duration-300",
            dragActive && "scale-[1.02]",
            disabled && "cursor-not-allowed opacity-50",
            loading && "cursor-wait opacity-75",
            className,
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleClick}
          {...props}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled || loading}
          />

          <div
            className={cn(
              "glass rounded-2xl border-2 border-dashed transition-all duration-300",
              dragActive
                ? "border-violet-400/60 bg-violet-400/5"
                : "border-zinc-600 hover:border-zinc-500",
              loading && "animate-pulse",
            )}
          >
            {children || (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                {loading ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
                    <p className="text-sm text-zinc-400">Uploading...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Upload className="h-8 w-8 text-zinc-400" />
                    <div>
                      <p className="text-sm font-medium text-zinc-300">
                        {dragActive
                          ? "Drop files here"
                          : "Click to upload or drag and drop"}
                      </p>
                      <p className="mt-1 text-xs text-zinc-500">
                        {accept
                          ? `Accepted formats: ${accept}`
                          : "Any file type"}
                      </p>
                      {maxSize && (
                        <p className="text-xs text-zinc-500">
                          Max size: {(maxSize / 1024 / 1024).toFixed(1)}MB
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    );
  },
);

FileUpload.displayName = "FileUpload";

export { FileUpload };
