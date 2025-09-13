"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Form/Textarea";
import { Select } from "@/components/ui/Form/Select";

const CURRENCIES = [
  { value: "USD", label: "US Dollar ($)" },
  { value: "EUR", label: "Euro (€)" },
];

const FUNDING_DURATIONS = [
  { value: 30, label: "30 days" },
  { value: 45, label: "45 days" },
  { value: 60, label: "60 days" },
  { value: 90, label: "90 days" },
];

export function ProjectFundingTimeline({
  data,
  onUpdate,
  onNext,
  onPrevious,
  isLoading,
}) {
  const [formData, setFormData] = useState({
    fundingGoal: data.fundingGoal || 0,
    currency: data.currency || "USD",
    fundingDuration: data.fundingDuration || 60,
    completionDate: data.completionDate || "",
    developmentTimeline: data.developmentTimeline || "",
    riskAssessment: data.riskAssessment || "",
  });

  const [errors, setErrors] = useState({});

  // Calculate deadline based on funding duration
  useEffect(() => {
    if (formData.fundingDuration) {
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + formData.fundingDuration);
      // This will be used in the parent component
    }
  }, [formData.fundingDuration]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const formatCurrency = (amount) => {
    const currencySymbol = formData.currency === "USD" ? "$" : "€";
    return `${currencySymbol}${amount.toLocaleString()}`;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fundingGoal || formData.fundingGoal < 1000) {
      newErrors.fundingGoal = "Funding goal must be at least $1,000";
    } else if (formData.fundingGoal > 100000) {
      newErrors.fundingGoal = "Funding goal cannot exceed $100,000";
    }

    if (!formData.completionDate) {
      newErrors.completionDate = "Project completion date is required";
    } else {
      const completionDate = new Date(formData.completionDate);
      const today = new Date();
      if (completionDate <= today) {
        newErrors.completionDate = "Completion date must be in the future";
      }
    }

    if (!formData.developmentTimeline.trim()) {
      newErrors.developmentTimeline = "Development timeline is required";
    } else if (formData.developmentTimeline.length > 1000) {
      newErrors.developmentTimeline =
        "Timeline must be 1000 characters or less";
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
        <CardTitle className="text-2xl">Funding & Timeline</CardTitle>
        <p className="text-zinc-400">
          Set your funding goal and project timeline. Be realistic about what
          you can achieve.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Funding Goal */}
        <div className="animate-element">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-400">
              Funding Goal
            </label>
            <div className="relative">
              <span className="absolute top-1/2 left-4 -translate-y-1/2 transform text-zinc-400">
                {formData.currency === "USD" ? "$" : "€"}
              </span>
              <input
                type="number"
                min="1000"
                max="100000"
                step="100"
                value={formData.fundingGoal}
                onChange={(e) =>
                  handleInputChange(
                    "fundingGoal",
                    parseInt(e.target.value) || 0,
                  )
                }
                className={`glass-input w-full py-4 pr-4 pl-8 text-zinc-100 placeholder-zinc-500 transition-all duration-300 ${
                  errors.fundingGoal ? "border-red-400/40 bg-red-400/5" : ""
                }`}
                placeholder="10000"
              />
            </div>
            {errors.fundingGoal && (
              <p className="text-sm text-red-400">{errors.fundingGoal}</p>
            )}
            <p className="text-sm text-zinc-500">
              Minimum $1,000 • Maximum $100,000 • This is the minimum amount
              needed to complete your project
            </p>
          </div>
        </div>

        {/* Currency and Duration */}
        <div className="animate-element animate-delay-100 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Select
            label="Currency"
            value={formData.currency}
            onChange={(value) => handleInputChange("currency", value)}
            options={CURRENCIES}
            placeholder="Select currency"
          />

          <Select
            label="Funding Duration"
            value={formData.fundingDuration}
            onChange={(value) => handleInputChange("fundingDuration", value)}
            options={FUNDING_DURATIONS}
            placeholder="Select duration"
          />
        </div>

        {/* Project Completion Date */}
        <div className="animate-element animate-delay-200">
          <Input
            label="Estimated Project Completion Date"
            type="date"
            value={formData.completionDate}
            onChange={(e) =>
              handleInputChange("completionDate", e.target.value)
            }
            error={errors.completionDate}
            helperText="When do you expect to complete the project?"
          />
        </div>

        {/* Development Timeline */}
        <div className="animate-element animate-delay-300">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-400">
              Development Timeline
            </label>
            <Textarea
              placeholder="Describe your development timeline, key phases, and milestones. Include any dependencies or potential delays."
              value={formData.developmentTimeline}
              onChange={(e) =>
                handleInputChange("developmentTimeline", e.target.value)
              }
              error={errors.developmentTimeline}
              rows={6}
              maxLength={1000}
            />
            <div className="flex justify-between text-sm text-zinc-500">
              <span>Describe your development phases</span>
              <span>{formData.developmentTimeline.length}/1000 characters</span>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="animate-element animate-delay-400">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-400">
              Risk Assessment
            </label>
            <Textarea
              placeholder="What are the main challenges you anticipate? How will you address potential risks?"
              value={formData.riskAssessment}
              onChange={(e) =>
                handleInputChange("riskAssessment", e.target.value)
              }
              rows={4}
              maxLength={1000}
            />
            <div className="flex justify-between text-sm text-zinc-500">
              <span>Optional but recommended</span>
              <span>{formData.riskAssessment.length}/1000 characters</span>
            </div>
          </div>
        </div>

        {/* Funding Summary */}
        <div className="animate-element animate-delay-500">
          <Card variant="minimal">
            <CardContent className="p-4">
              <h4 className="mb-3 text-sm font-medium text-zinc-300">
                Funding Summary
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Funding Goal:</span>
                  <span className="font-medium text-zinc-100">
                    {formatCurrency(formData.fundingGoal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Funding Duration:</span>
                  <span className="text-zinc-100">
                    {formData.fundingDuration} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Daily Target:</span>
                  <span className="text-zinc-100">
                    {formatCurrency(
                      Math.ceil(
                        formData.fundingGoal / formData.fundingDuration,
                      ),
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="animate-element animate-delay-600 flex justify-between pt-6">
          <Button variant="glass" onClick={onPrevious} disabled={isLoading}>
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={isLoading}
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
