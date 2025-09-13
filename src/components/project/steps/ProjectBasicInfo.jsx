"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Form/Textarea";
import { Select } from "@/components/ui/Form/Select";

const CATEGORIES = [
  { value: "web_app", label: "Web Applications" },
  { value: "mobile_app", label: "Mobile Apps" },
  { value: "desktop", label: "Desktop Software" },
  { value: "dev_tools", label: "Developer Tools" },
  { value: "saas", label: "SaaS Platforms" },
  { value: "course", label: "Technical Courses" },
  { value: "api", label: "API Services" },
  { value: "other", label: "Other" },
];

const DEVELOPMENT_STAGES = [
  { value: "concept", label: "Concept Stage" },
  { value: "development", label: "In Development" },
];

export function ProjectBasicInfo({ data, onUpdate, onNext, isLoading }) {
  const [formData, setFormData] = useState({
    title: data.title || "",
    shortDescription: data.shortDescription || "",
    fullDescription: data.fullDescription || "",
    category: data.category || "",
    developmentStage: data.developmentStage || "concept",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Project title is required";
    } else if (formData.title.length > 80) {
      newErrors.title = "Title must be 80 characters or less";
    }

    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = "Short description is required";
    } else if (formData.shortDescription.length > 120) {
      newErrors.shortDescription =
        "Short description must be 120 characters or less";
    }

    if (!formData.fullDescription.trim()) {
      newErrors.fullDescription = "Full description is required";
    } else if (formData.fullDescription.length < 500) {
      newErrors.fullDescription = "Description must be at least 500 characters";
    } else if (formData.fullDescription.length > 5000) {
      newErrors.fullDescription = "Description must be 5000 characters or less";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
        <CardTitle className="text-2xl">Basic Project Information</CardTitle>
        <p className="text-zinc-400">
          Tell us about your project. This information will be visible to
          potential backers.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Project Title */}
        <div className="animate-element">
          <Input
            label="Project Title"
            placeholder="Enter your project title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            error={errors.title}
            helperText={`${formData.title.length}/80 characters`}
            maxLength={80}
          />
        </div>

        {/* Short Description */}
        <div className="animate-element animate-delay-100">
          <Input
            label="One-line Description"
            placeholder="Brief description that appears in project previews"
            value={formData.shortDescription}
            onChange={(e) =>
              handleInputChange("shortDescription", e.target.value)
            }
            error={errors.shortDescription}
            helperText={`${formData.shortDescription.length}/120 characters`}
            maxLength={120}
          />
        </div>

        {/* Category Selection */}
        <div className="animate-element animate-delay-200">
          <Select
            label="Project Category"
            value={formData.category}
            onChange={(value) => handleInputChange("category", value)}
            options={CATEGORIES}
            placeholder="Select a category"
            error={errors.category}
          />
        </div>

        {/* Development Stage */}
        <div className="animate-element animate-delay-300">
          <Select
            label="Development Stage"
            value={formData.developmentStage}
            onChange={(value) => handleInputChange("developmentStage", value)}
            options={DEVELOPMENT_STAGES}
            placeholder="Select development stage"
          />
        </div>

        {/* Full Description */}
        <div className="animate-element animate-delay-400">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-400">
              Detailed Project Description
            </label>
            <Textarea
              placeholder="Describe your project in detail. Include what problem it solves, who it's for, what makes it unique, and your technical approach."
              value={formData.fullDescription}
              onChange={(e) =>
                handleInputChange("fullDescription", e.target.value)
              }
              error={errors.fullDescription}
              rows={12}
              maxLength={5000}
            />
            <div className="flex justify-between text-sm text-zinc-500">
              <span>Minimum 500 characters</span>
              <span>{formData.fullDescription.length}/5000 characters</span>
            </div>
          </div>
        </div>

        {/* Suggested Sections */}
        <div className="animate-element animate-delay-500">
          <Card variant="minimal">
            <CardContent className="p-4">
              <h4 className="mb-3 text-sm font-medium text-zinc-300">
                Suggested sections to include:
              </h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-violet-400">•</span>
                  <span>
                    <strong>What problem does this solve?</strong> - Explain the
                    specific problem your project addresses
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-violet-400">•</span>
                  <span>
                    <strong>Who is this for?</strong> - Define your target
                    audience
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-violet-400">•</span>
                  <span>
                    <strong>What makes it unique?</strong> - Highlight your
                    competitive advantages
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-violet-400">•</span>
                  <span>
                    <strong>Technical approach</strong> - Describe your
                    development methodology
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="animate-element animate-delay-600 flex justify-end pt-6">
          <Button
            onClick={handleNext}
            disabled={isLoading}
            size="lg"
            className="min-w-[140px]"
          >
            {isLoading ? "Creating..." : "Continue"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
