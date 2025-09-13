"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { ProjectBasicInfo } from "./steps/ProjectBasicInfo";
import { ProjectFundingTimeline } from "./steps/ProjectFundingTimeline";
import { ProjectVisualAssets } from "./steps/ProjectVisualAssets";
import { ProjectRewardsMilestones } from "./steps/ProjectRewardsMilestones";
import { ProjectReview } from "./steps/ProjectReview";
import { createProject, updateProject } from "@/lib/api/projects";
import { createRewardTier } from "@/lib/api/rewardTiers";
import { Alert } from "@/components/ui/Alert";

const STEPS = [
  {
    id: 1,
    title: "Basic Information",
    description: "Project details and description",
  },
  {
    id: 2,
    title: "Funding & Timeline",
    description: "Funding goal and timeline",
  },
  { id: 3, title: "Visual Assets", description: "Images and media" },
  {
    id: 4,
    title: "Rewards & Milestones",
    description: "Reward tiers and milestones",
  },
  {
    id: 5,
    title: "Review & Publish",
    description: "Final review and publishing",
  },
];

export function ProjectCreationWizard({ user, profile }) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [projectData, setProjectData] = useState({
    // Step 1: Basic Information
    title: "",
    shortDescription: "",
    fullDescription: "",
    category: "",
    developmentStage: "concept",

    // Step 2: Funding & Timeline
    fundingGoal: 0,
    currency: "USD",
    fundingDuration: 60,
    completionDate: "",
    developmentTimeline: "",
    riskAssessment: "",

    // Step 3: Visual Assets
    mainImage: null,
    additionalImages: [],
    videoUrl: "",

    // Step 4: Rewards & Milestones
    rewardTiers: [],
    milestones: [],

    // Metadata
    creatorId: user?.$id,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [projectId, setProjectId] = useState(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState("");

  // Auto-save functionality
  useEffect(() => {
    if (projectId && currentStep > 1) {
      const autoSaveInterval = setInterval(async () => {
        await saveDraft();
      }, 30000); // Save every 30 seconds

      return () => clearInterval(autoSaveInterval);
    }
  }, [projectId, currentStep]);

  const saveDraft = async () => {
    if (!projectId) return;

    try {
      setAutoSaveStatus("Saving...");
      await updateProject(projectId, projectData);
      setAutoSaveStatus("Saved");
      setTimeout(() => setAutoSaveStatus(""), 2000);
    } catch (error) {
      console.error("Auto-save failed:", error);
      setAutoSaveStatus("Save failed");
    }
  };

  const handleStepChange = (step) => {
    if (step <= currentStep || isStepCompleted(currentStep)) {
      setCurrentStep(step);
      setError("");
    }
  };

  const isStepCompleted = (step) => {
    switch (step) {
      case 1:
        return (
          projectData.title &&
          projectData.shortDescription &&
          projectData.fullDescription &&
          projectData.category
        );
      case 2:
        return (
          projectData.fundingGoal > 0 &&
          projectData.completionDate &&
          projectData.developmentTimeline
        );
      case 3:
        return projectData.mainImage;
      case 4:
        return (
          projectData.rewardTiers.length >= 3 &&
          projectData.milestones.length >= 3
        );
      default:
        return false;
    }
  };

  const handleDataUpdate = (stepData) => {
    setProjectData((prev) => ({ ...prev, ...stepData }));
  };

  const handleNext = async () => {
    if (currentStep < STEPS.length) {
      if (currentStep === 1 && !projectId) {
        // Create initial project draft
        await createInitialProject();
      }
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const createInitialProject = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await createProject({
        ...projectData,
        projectStatus: "draft",
      });

      if (result.success) {
        setProjectId(result.data.$id);
        setSuccess("Project draft created successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result.message || "Failed to create project draft");
      }
    } catch (error) {
      setError("Failed to create project draft");
      console.error("Error creating project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Update project with final data
      const updateResult = await updateProject(projectId, {
        ...projectData,
        projectStatus: "live",
        publishedAt: new Date().toISOString(),
      });

      if (updateResult.success) {
        setSuccess("Project published successfully!");
        setTimeout(() => {
          router.push(`/dashboard/projects/${projectId}`);
        }, 2000);
      } else {
        setError(updateResult.message || "Failed to publish project");
      }
    } catch (error) {
      setError("Failed to publish project");
      console.error("Error publishing project:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProjectBasicInfo
            data={projectData}
            onUpdate={handleDataUpdate}
            onNext={handleNext}
            isLoading={isLoading}
          />
        );
      case 2:
        return (
          <ProjectFundingTimeline
            data={projectData}
            onUpdate={handleDataUpdate}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isLoading={isLoading}
          />
        );
      case 3:
        return (
          <ProjectVisualAssets
            data={projectData}
            onUpdate={handleDataUpdate}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isLoading={isLoading}
          />
        );
      case 4:
        return (
          <ProjectRewardsMilestones
            data={projectData}
            onUpdate={handleDataUpdate}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isLoading={isLoading}
          />
        );
      case 5:
        return (
          <ProjectReview
            data={projectData}
            onPublish={handlePublish}
            onPrevious={handlePrevious}
            isLoading={isLoading}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="animate-element glass mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 stroke-violet-400"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h1 className="animate-element animate-delay-100 mb-4 text-4xl leading-tight font-semibold md:text-5xl">
            <span className="font-light tracking-tighter text-white">
              Create
            </span>{" "}
            <span className="text-violet-400">Project</span>
          </h1>
          <p className="animate-element animate-delay-200 text-lg text-zinc-400">
            Launch your technical product with community backing
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="animate-element animate-delay-300 mb-8">
          <Card variant="glass">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-medium text-zinc-100">
                  Step {currentStep} of {STEPS.length}
                </h2>
                <span className="text-sm text-zinc-400">
                  {autoSaveStatus && `(${autoSaveStatus})`}
                </span>
              </div>
              <Progress
                value={(currentStep / STEPS.length) * 100}
                className="mb-4"
              />
              <div className="flex justify-between">
                {STEPS.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => handleStepChange(step.id)}
                    className={`text-left transition-colors ${
                      step.id === currentStep
                        ? "text-violet-400"
                        : step.id < currentStep
                          ? "text-zinc-300"
                          : "text-zinc-500"
                    }`}
                    disabled={
                      step.id > currentStep && !isStepCompleted(currentStep)
                    }
                  >
                    <div className="text-sm font-medium">{step.title}</div>
                    <div className="text-xs text-zinc-500">
                      {step.description}
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error and Success Messages */}
        {error && (
          <div className="animate-element animate-delay-400 mb-6">
            <Alert variant="error" message={error} />
          </div>
        )}
        {success && (
          <div className="animate-element animate-delay-400 mb-6">
            <Alert variant="success" message={success} />
          </div>
        )}

        {/* Step Content */}
        <div className="animate-element animate-delay-500">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
}
