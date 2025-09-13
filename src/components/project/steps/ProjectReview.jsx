"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";

export function ProjectReview({ data, onPublish, onPrevious, isLoading }) {
  const [publishOption, setPublishOption] = useState("publish_now");

  const formatCurrency = (amount, currency = "USD") => {
    const symbol = currency === "USD" ? "$" : "€";
    return `${symbol}${amount.toLocaleString()}`;
  };

  const getCategoryLabel = (category) => {
    const categories = {
      web_app: "Web Applications",
      mobile_app: "Mobile Apps",
      desktop: "Desktop Software",
      dev_tools: "Developer Tools",
      saas: "SaaS Platforms",
      course: "Technical Courses",
      api: "API Services",
      other: "Other",
    };
    return categories[category] || category;
  };

  const getStatusColor = (status) => {
    const colors = {
      concept: "bg-blue-500/20 text-blue-400",
      development: "bg-yellow-500/20 text-yellow-400",
    };
    return colors[status] || "bg-zinc-500/20 text-zinc-400";
  };

  const completionChecklist = [
    {
      label: "Project title and description completed",
      completed: data.title && data.shortDescription && data.fullDescription,
    },
    {
      label: "Category selected",
      completed: data.category,
    },
    {
      label: "Funding goal set",
      completed: data.fundingGoal > 0,
    },
    {
      label: "Main project image uploaded",
      completed: data.mainImage,
    },
    {
      label: "Minimum 3 reward tiers created",
      completed: data.rewardTiers.length >= 3,
    },
    {
      label: "Milestones add up to 100%",
      completed:
        data.milestones.reduce((sum, m) => sum + m.percentage, 0) === 100,
    },
  ];

  const allRequirementsMet = completionChecklist.every(
    (item) => item.completed,
  );

  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="text-2xl">Review & Publish</CardTitle>
        <p className="text-zinc-400">
          Review your project details and publish when ready. You can always
          edit draft projects.
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Completion Checklist */}
        <div className="animate-element">
          <h3 className="mb-4 text-lg font-medium text-zinc-100">
            Project Completion Checklist
          </h3>
          <div className="space-y-3">
            {completionChecklist.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full ${
                    item.completed ? "bg-green-500" : "bg-zinc-600"
                  }`}
                >
                  {item.completed && (
                    <svg
                      className="h-3 w-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <span
                  className={`text-sm ${item.completed ? "text-zinc-300" : "text-zinc-500"}`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="glass mt-4 rounded-2xl p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-300">
                Completion Progress
              </span>
              <span className="text-sm text-zinc-400">
                {completionChecklist.filter((item) => item.completed).length}/
                {completionChecklist.length}
              </span>
            </div>
            <Progress
              value={
                (completionChecklist.filter((item) => item.completed).length /
                  completionChecklist.length) *
                100
              }
              className="mb-2"
            />
            <p className="text-xs text-zinc-500">
              {allRequirementsMet
                ? "All requirements met! Ready to publish."
                : "Complete all requirements to publish your project."}
            </p>
          </div>
        </div>

        {/* Project Preview */}
        <div className="animate-element animate-delay-100">
          <h3 className="mb-4 text-lg font-medium text-zinc-100">
            Project Preview
          </h3>

          <Card variant="default">
            <CardContent className="p-6">
              {/* Project Header */}
              <div className="mb-6 flex items-start gap-6">
                {data.mainImage && (
                  <img
                    src={data.mainImage.url}
                    alt="Project preview"
                    className="glass h-24 w-32 rounded-2xl object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-zinc-100">
                      {data.title}
                    </h2>
                    <Badge className={getStatusColor(data.developmentStage)}>
                      {data.developmentStage === "concept"
                        ? "Concept"
                        : "In Development"}
                    </Badge>
                  </div>
                  <p className="mb-3 text-zinc-400">{data.shortDescription}</p>
                  <div className="flex items-center gap-4 text-sm text-zinc-500">
                    <span>{getCategoryLabel(data.category)}</span>
                    <span>•</span>
                    <span>{data.fundingDuration} days</span>
                  </div>
                </div>
              </div>

              {/* Funding Progress */}
              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-zinc-300">
                    Funding Progress
                  </span>
                  <span className="text-sm text-zinc-400">
                    {formatCurrency(0)} /{" "}
                    {formatCurrency(data.fundingGoal, data.currency)}
                  </span>
                </div>
                <Progress value={0} className="mb-2" />
                <div className="flex justify-between text-xs text-zinc-500">
                  <span>0% funded</span>
                  <span>{data.fundingDuration} days left</span>
                </div>
              </div>

              {/* Reward Tiers Preview */}
              <div className="mb-6">
                <h4 className="mb-3 text-sm font-medium text-zinc-300">
                  Reward Tiers
                </h4>
                <div className="space-y-2">
                  {data.rewardTiers.slice(0, 3).map((tier, index) => (
                    <div
                      key={index}
                      className="glass flex items-center justify-between rounded-xl p-3"
                    >
                      <div>
                        <span className="font-medium text-zinc-100">
                          ${tier.amount}
                        </span>
                        <span className="ml-2 text-zinc-400">{tier.title}</span>
                      </div>
                      <div className="text-xs text-zinc-500">
                        {tier.isLimited
                          ? `Limited (${tier.quantityLimit})`
                          : "Unlimited"}
                      </div>
                    </div>
                  ))}
                  {data.rewardTiers.length > 3 && (
                    <div className="py-2 text-center text-xs text-zinc-500">
                      +{data.rewardTiers.length - 3} more tiers
                    </div>
                  )}
                </div>
              </div>

              {/* Milestones Preview */}
              <div>
                <h4 className="mb-3 text-sm font-medium text-zinc-300">
                  Project Milestones
                </h4>
                <div className="space-y-2">
                  {data.milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className="glass flex items-center justify-between rounded-xl p-3"
                    >
                      <div>
                        <span className="text-sm font-medium text-zinc-100">
                          {milestone.title}
                        </span>
                        <span className="ml-2 text-xs text-zinc-500">
                          ({milestone.targetDate})
                        </span>
                      </div>
                      <span className="rounded-lg bg-violet-500/20 px-2 py-1 text-sm text-violet-400">
                        {milestone.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Publishing Options */}
        <div className="animate-element animate-delay-200">
          <h3 className="mb-4 text-lg font-medium text-zinc-100">
            Publishing Options
          </h3>

          <div className="space-y-4">
            <Card variant="minimal">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    id="publish_now"
                    name="publish_option"
                    value="publish_now"
                    checked={publishOption === "publish_now"}
                    onChange={(e) => setPublishOption(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="publish_now"
                      className="mb-1 block font-medium text-zinc-100"
                    >
                      Publish Now
                    </label>
                    <p className="text-sm text-zinc-400">
                      Your project will go live immediately and start accepting
                      backers.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="minimal">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    id="save_draft"
                    name="publish_option"
                    value="save_draft"
                    checked={publishOption === "save_draft"}
                    onChange={(e) => setPublishOption(e.target.value)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="save_draft"
                      className="mb-1 block font-medium text-zinc-100"
                    >
                      Save as Draft
                    </label>
                    <p className="text-sm text-zinc-400">
                      Keep your project as a draft. You can edit and publish it
                      later.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final Actions */}
        <div className="animate-element animate-delay-300">
          <Card variant="minimal">
            <CardContent className="p-4">
              <h4 className="mb-3 text-sm font-medium text-zinc-300">
                Before You Publish
              </h4>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-violet-400">•</span>
                  <span>Double-check all information for accuracy</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-violet-400">•</span>
                  <span>
                    Ensure your funding goal is realistic and achievable
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-violet-400">•</span>
                  <span>
                    Make sure reward tiers provide good value to backers
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-violet-400">•</span>
                  <span>Verify milestone dates are achievable</span>
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
          <div className="flex gap-3">
            <Button
              variant="glass"
              onClick={() => {
                /* Handle save draft */
              }}
              disabled={isLoading}
            >
              Save Draft
            </Button>
            <Button
              onClick={onPublish}
              disabled={isLoading || !allRequirementsMet}
              size="lg"
              className="min-w-[140px]"
            >
              {isLoading ? "Publishing..." : "Publish Project"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
