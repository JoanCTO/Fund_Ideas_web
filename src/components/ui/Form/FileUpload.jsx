"use client";

import React, { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Upload, X, File, Image, FileText } from "lucide-react";

const FileUpload = React.forwardRef(
  (
    {
      className,
      label,
      error,
      success,
      helperText,
      accept,
      multiple = false,
      maxFiles = 5,
      maxSize = 10 * 1024 * 1024, // 10MB
      onFilesChange,
      files = [],
      ...props
    },
    ref,
  ) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const fileInputRef = useRef(null);
    const dropZoneRef = useRef(null);

    const fileId = React.useId();

    const getFileIcon = (file) => {
      if (file.type.startsWith("image/")) {
        return <Image className="h-5 w-5 text-violet-400" />;
      } else if (file.type.startsWith("text/")) {
        return <FileText className="h-5 w-5 text-blue-400" />;
      } else {
        return <File className="h-5 w-5 text-zinc-400" />;
      }
    };

    const formatFileSize = (bytes) => {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const validateFile = (file) => {
      if (file.size > maxSize) {
        return `File ${file.name} is too large. Maximum size is ${formatFileSize(maxSize)}.`;
      }
      return null;
    };

    const handleFiles = useCallback(
      (newFiles) => {
        const fileArray = Array.from(newFiles);
        const errors = [];
        const validFiles = [];

        if (!multiple && fileArray.length > 1) {
          errors.push("Only one file is allowed.");
        }

        if (files.length + fileArray.length > maxFiles) {
          errors.push(`Maximum ${maxFiles} files allowed.`);
        }

        fileArray.forEach((file) => {
          const error = validateFile(file);
          if (error) {
            errors.push(error);
          } else {
            validFiles.push(file);
          }
        });

        if (errors.length > 0) {
          setUploadError(errors.join(" "));
        } else {
          setUploadError("");
          onFilesChange?.(multiple ? [...files, ...validFiles] : validFiles);
        }
      },
      [files, multiple, maxFiles, maxSize, onFilesChange],
    );

    const handleDrop = useCallback(
      (e) => {
        e.preventDefault();
        setIsDragOver(false);

        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length > 0) {
          handleFiles(droppedFiles);
        }
      },
      [handleFiles],
    );

    const handleDragOver = useCallback((e) => {
      e.preventDefault();
      setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
      e.preventDefault();
      setIsDragOver(false);
    }, []);

    const handleFileInputChange = useCallback(
      (e) => {
        const selectedFiles = e.target.files;
        if (selectedFiles.length > 0) {
          handleFiles(selectedFiles);
        }
      },
      [handleFiles],
    );

    const removeFile = (index) => {
      const newFiles = files.filter((_, i) => i !== index);
      onFilesChange?.(newFiles);
      setUploadError("");
    };

    const openFileDialog = () => {
      fileInputRef.current?.click();
    };

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={fileId}
            className={cn(
              "block text-sm font-medium",
              error
                ? "text-red-400"
                : success
                  ? "text-green-400"
                  : "text-zinc-400",
            )}
          >
            {label}
          </label>
        )}

        <div
          ref={dropZoneRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "glass cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300",
            isDragOver
              ? "border-violet-400/60 bg-violet-400/5"
              : "border-white/10 hover:border-white/20",
            error && "border-red-400/40 bg-red-400/5",
            success && "border-green-400/40 bg-green-400/5",
            className,
          )}
          onClick={openFileDialog}
          {...props}
        >
          <div className="p-6 text-center">
            <Upload
              className={cn(
                "mx-auto mb-3 h-8 w-8",
                isDragOver ? "text-violet-400" : "text-zinc-400",
              )}
            />
            <p className="mb-1 text-sm text-zinc-100">
              {isDragOver
                ? "Drop files here"
                : "Click to upload or drag and drop"}
            </p>
            <p className="text-xs text-zinc-500">
              {accept && `Accepted formats: ${accept}`}
              {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
              {multiple && ` • Max files: ${maxFiles}`}
            </p>
          </div>

          <input
            ref={fileInputRef}
            id={fileId}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="glass flex items-center justify-between rounded-xl p-3"
              >
                <div className="flex items-center space-x-3">
                  {getFileIcon(file)}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-zinc-100">
                      {file.name}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="glass rounded-lg p-1 text-zinc-400 transition-colors hover:bg-red-400/10 hover:text-red-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {helperText && !error && !success && !uploadError && (
          <p className="text-sm text-zinc-500">{helperText}</p>
        )}
        {(error || uploadError) && (
          <p className="text-sm text-red-400">{error || uploadError}</p>
        )}
        {success && <p className="text-sm text-green-400">{success}</p>}
      </div>
    );
  },
);

FileUpload.displayName = "FileUpload";

export { FileUpload };
