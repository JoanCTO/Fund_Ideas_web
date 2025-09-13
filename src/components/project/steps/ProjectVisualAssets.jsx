"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { FileUpload } from "@/components/ui/Form/FileUpload";
import { storage, PROJECT_IMAGES_BUCKET_ID } from "@/lib/appwrite";

export function ProjectVisualAssets({
  data,
  onUpdate,
  onNext,
  onPrevious,
  isLoading,
}) {
  const [formData, setFormData] = useState({
    mainImage: data.mainImage || null,
    additionalImages: data.additionalImages || [],
    videoUrl: data.videoUrl || "",
  });

  const [errors, setErrors] = useState({});
  const [uploadingImages, setUploadingImages] = useState([]);
  const fileInputRef = useRef(null);
  const additionalImagesRef = useRef(null);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const uploadImage = async (file, isMain = false) => {
    try {
      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const uploadedFile = await storage.createFile(
        PROJECT_IMAGES_BUCKET_ID,
        fileId,
        file,
      );

      const imageUrl = storage.getFilePreview(
        PROJECT_IMAGES_BUCKET_ID,
        uploadedFile.$id,
      );

      return {
        id: uploadedFile.$id,
        url: imageUrl,
        name: file.name,
        size: file.size,
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleMainImageUpload = async (files) => {
    if (files.length === 0) return;

    const file = files[0];

    // Validate file
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        mainImage: "Please select an image file",
      }));
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB
      setErrors((prev) => ({
        ...prev,
        mainImage: "Image must be smaller than 10MB",
      }));
      return;
    }

    setUploadingImages((prev) => [...prev, "main"]);
    setErrors((prev) => ({ ...prev, mainImage: "" }));

    try {
      const uploadedImage = await uploadImage(file, true);
      handleInputChange("mainImage", uploadedImage);
    } catch (error) {
      setErrors((prev) => ({ ...prev, mainImage: "Failed to upload image" }));
    } finally {
      setUploadingImages((prev) => prev.filter((id) => id !== "main"));
    }
  };

  const handleAdditionalImagesUpload = async (files) => {
    if (files.length === 0) return;

    const validFiles = Array.from(files).filter((file) => {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          additionalImages: "Please select image files only",
        }));
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          additionalImages: "Images must be smaller than 10MB",
        }));
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const newImages = [...formData.additionalImages];
    const uploadPromises = validFiles.map(async (file, index) => {
      const uploadId = `additional-${index}`;
      setUploadingImages((prev) => [...prev, uploadId]);

      try {
        const uploadedImage = await uploadImage(file);
        return uploadedImage;
      } catch (error) {
        console.error("Error uploading additional image:", error);
        return null;
      } finally {
        setUploadingImages((prev) => prev.filter((id) => id !== uploadId));
      }
    });

    try {
      const uploadedImages = await Promise.all(uploadPromises);
      const successfulUploads = uploadedImages.filter((img) => img !== null);

      if (successfulUploads.length > 0) {
        handleInputChange("additionalImages", [
          ...newImages,
          ...successfulUploads,
        ]);
        setErrors((prev) => ({ ...prev, additionalImages: "" }));
      }
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        additionalImages: "Some images failed to upload",
      }));
    }
  };

  const removeImage = (index, isMain = false) => {
    if (isMain) {
      handleInputChange("mainImage", null);
    } else {
      const newImages = formData.additionalImages.filter((_, i) => i !== index);
      handleInputChange("additionalImages", newImages);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.mainImage) {
      newErrors.mainImage = "Main project image is required";
    }

    if (formData.videoUrl && !isValidVideoUrl(formData.videoUrl)) {
      newErrors.videoUrl = "Please enter a valid YouTube or Vimeo URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidVideoUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    const vimeoRegex = /^(https?:\/\/)?(www\.)?vimeo\.com\/.+/;
    return youtubeRegex.test(url) || vimeoRegex.test(url);
  };

  const handleNext = () => {
    if (validateForm()) {
      onUpdate(formData);
      onNext();
    }
  };

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="text-2xl">Visual Assets & Media</CardTitle>
        <p className="text-zinc-400">
          Upload images and videos to showcase your project. Visual content
          helps backers understand your vision.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Project Image */}
        <div className="animate-element">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-400">
              Main Project Image *
            </label>
            <p className="mb-4 text-sm text-zinc-500">
              Recommended size: 1200x800px • JPG, PNG, GIF • Max 10MB
            </p>

            {formData.mainImage ? (
              <div className="relative">
                <img
                  src={formData.mainImage.url}
                  alt="Main project image"
                  className="glass h-64 w-full rounded-2xl object-cover"
                />
                <button
                  onClick={() => removeImage(0, true)}
                  className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600"
                >
                  ×
                </button>
                <div className="mt-2 text-sm text-zinc-400">
                  {formData.mainImage.name} (
                  {(formData.mainImage.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              </div>
            ) : (
              <FileUpload
                onFileSelect={handleMainImageUpload}
                accept="image/*"
                multiple={false}
                loading={uploadingImages.includes("main")}
                className="h-64"
              >
                <div className="text-center">
                  <svg
                    className="mx-auto mb-4 h-12 w-12 text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="mb-2 text-zinc-400">
                    Click to upload main project image
                  </p>
                  <p className="text-sm text-zinc-500">
                    Drag and drop or click to browse
                  </p>
                </div>
              </FileUpload>
            )}

            {errors.mainImage && (
              <p className="text-sm text-red-400">{errors.mainImage}</p>
            )}
          </div>
        </div>

        {/* Additional Images */}
        <div className="animate-element animate-delay-100">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-400">
              Additional Project Images
            </label>
            <p className="mb-4 text-sm text-zinc-500">
              Upload up to 5 additional images • Screenshots, mockups, concept
              art, team photos
            </p>

            {formData.additionalImages.length > 0 && (
              <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-3">
                {formData.additionalImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.url}
                      alt={`Additional image ${index + 1}`}
                      className="glass h-32 w-full rounded-2xl object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-sm text-white transition-colors hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {formData.additionalImages.length < 5 && (
              <FileUpload
                onFileSelect={handleAdditionalImagesUpload}
                accept="image/*"
                multiple={true}
                loading={uploadingImages.some((id) =>
                  id.startsWith("additional"),
                )}
                className="h-32"
              >
                <div className="text-center">
                  <svg
                    className="mx-auto mb-2 h-8 w-8 text-zinc-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <p className="text-sm text-zinc-400">Add more images</p>
                </div>
              </FileUpload>
            )}

            {errors.additionalImages && (
              <p className="text-sm text-red-400">{errors.additionalImages}</p>
            )}
          </div>
        </div>

        {/* Project Video */}
        <div className="animate-element animate-delay-200">
          <Input
            label="Project Video (Optional)"
            placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
            value={formData.videoUrl}
            onChange={(e) => handleInputChange("videoUrl", e.target.value)}
            error={errors.videoUrl}
            helperText="2-3 minute video explaining your project"
          />

          {formData.videoUrl && isValidVideoUrl(formData.videoUrl) && (
            <div className="mt-4">
              <div className="glass aspect-video overflow-hidden rounded-2xl">
                <iframe
                  src={getEmbedUrl(formData.videoUrl)}
                  className="h-full w-full"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="animate-element animate-delay-300">
          <Card variant="minimal">
            <CardContent className="p-4">
              <h4 className="mb-3 text-sm font-medium text-zinc-300">
                Visual Content Tips
              </h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-violet-400">•</span>
                  <span>
                    Use high-quality images that clearly show your product or
                    concept
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-violet-400">•</span>
                  <span>
                    Include screenshots, mockups, or prototypes to demonstrate
                    functionality
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-violet-400">•</span>
                  <span>
                    Show your team or workspace to build trust and connection
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-violet-400">•</span>
                  <span>
                    Create a compelling video that explains your project in 2-3
                    minutes
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="animate-element animate-delay-400 flex justify-between pt-6">
          <Button variant="glass" onClick={onPrevious} disabled={isLoading}>
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={isLoading || uploadingImages.length > 0}
            size="lg"
            className="min-w-[140px]"
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to convert video URLs to embed URLs
function getEmbedUrl(url) {
  if (url.includes("youtube.com/watch")) {
    const videoId = url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  } else if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  } else if (url.includes("vimeo.com/")) {
    const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
    return `https://player.vimeo.com/video/${videoId}`;
  }
  return url;
}
