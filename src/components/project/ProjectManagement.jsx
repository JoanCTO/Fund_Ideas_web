"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { Alert } from "@/components/ui/Alert";
import { Loading } from "@/components/ui/Loading/Loading";
import { Tab } from "@/components/ui/Tab";
import {
  getProject,
  updateProject,
  publishProject,
  cancelProject,
} from "@/lib/api/projects";
import { getRewardTiers } from "@/lib/api/rewardTiers";
import { formatCurrency, formatDate, getDaysRemaining } from "@/lib/utils";

const STATUS_COLORS = {
  draft: "bg-zinc-500/20 text-zinc-400",
  live: "bg-green-500/20 text-green-400",
  funded: "bg-violet-500/20 text-violet-400",
  completed: "bg-blue-500/20 text-blue-400",
  cancelled: "bg-red-500/20 text-red-400",
};

const STATUS_LABELS = {
  draft: "Draft",
  live: "Live",
  funded: "Funded",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function ProjectManagement({ projectId, user, profile, onBack }) {
  const [project, setProject] = useState(null);
  const [rewardTiers, setRewardTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      setError("");

      const [projectResult, tiersResult] = await Promise.all([
        getProject(projectId),
        getRewardTiers(projectId),
      ]);

      if (projectResult.success) {
        setProject(projectResult.data);
      } else {
        setError(projectResult.message || "Failed to load project");
      }

      if (tiersResult.success) {
        setRewardTiers(tiersResult.data);
      }
    } catch (error) {
      console.error("Error loading project data:", error);
      setError("Failed to load project data");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await publishProject(projectId);

      if (result.success) {
        setProject(result.data);
        setSuccess("Project published successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result.message || "Failed to publish project");
      }
    } catch (error) {
      console.error("Error publishing project:", error);
      setError("Failed to publish project");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel this project? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await cancelProject(projectId);

      if (result.success) {
        setProject(result.data);
        setSuccess("Project cancelled successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(result.message || "Failed to cancel project");
      }
    } catch (error) {
      console.error("Error cancelling project:", error);
      setError("Failed to cancel project");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <Loading />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-semibold text-zinc-100">
            Project Not Found
          </h1>
          <p className="mb-6 text-zinc-400">
            The project you're looking for doesn't exist or you don't have
            permission to view it.
          </p>
          <Button onClick={onBack}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  const fundingProgress =
    project.fundingGoal > 0
      ? (project.currentFunding / project.fundingGoal) * 100
      : 0;

  const daysRemaining = getDaysRemaining(project.deadline);
  const isOverdue = daysRemaining < 0 && project.projectStatus === "live";

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-6 flex items-center gap-4">
            <Button variant="glass" onClick={onBack}>
              ← Back
            </Button>
            <div className="flex-1">
              <h1 className="mb-2 text-3xl font-semibold text-zinc-100">
                {project.title}
              </h1>
              <div className="flex items-center gap-4">
                <Badge className={STATUS_COLORS[project.projectStatus]}>
                  {STATUS_LABELS[project.projectStatus]}
                </Badge>
                <span className="text-zinc-400">
                  Created {formatDate(project.$createdAt)}
                </span>
                {project.publishedAt && (
                  <span className="text-zinc-400">
                    Published {formatDate(project.publishedAt)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="mb-6">
              <Alert variant="error" message={error} />
            </div>
          )}
          {success && (
            <div className="mb-6">
              <Alert variant="success" message={success} />
            </div>
          )}

          {/* Key Metrics */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card variant="glass">
              <CardContent className="p-4 text-center">
                <div className="mb-1 text-2xl font-semibold text-zinc-100">
                  {formatCurrency(project.currentFunding)}
                </div>
                <div className="text-sm text-zinc-400">Raised</div>
                <div className="text-xs text-zinc-500">
                  of {formatCurrency(project.fundingGoal)} goal
                </div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardContent className="p-4 text-center">
                <div className="mb-1 text-2xl font-semibold text-zinc-100">
                  {project.backerCount}
                </div>
                <div className="text-sm text-zinc-400">Backers</div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardContent className="p-4 text-center">
                <div className="mb-1 text-2xl font-semibold text-zinc-100">
                  {Math.round(fundingProgress)}%
                </div>
                <div className="text-sm text-zinc-400">Funded</div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardContent className="p-4 text-center">
                <div
                  className={`mb-1 text-2xl font-semibold ${isOverdue ? "text-red-400" : "text-zinc-100"}`}
                >
                  {isOverdue ? "Overdue" : daysRemaining}
                </div>
                <div className="text-sm text-zinc-400">
                  {isOverdue ? "Days Overdue" : "Days Left"}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Funding Progress */}
          <Card variant="glass" className="mb-8">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium text-zinc-100">
                  Funding Progress
                </h3>
                <span className="text-sm text-zinc-400">
                  {formatCurrency(project.currentFunding)} /{" "}
                  {formatCurrency(project.fundingGoal)}
                </span>
              </div>
              <Progress value={fundingProgress} className="mb-2" />
              <div className="flex justify-between text-sm text-zinc-500">
                <span>{Math.round(fundingProgress)}% funded</span>
                <span>
                  {formatCurrency(project.fundingGoal - project.currentFunding)}{" "}
                  remaining
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <Tab
            tabs={[
              { id: "overview", label: "Overview" },
              { id: "rewards", label: "Rewards" },
              { id: "milestones", label: "Milestones" },
              { id: "backers", label: "Backers" },
              { id: "updates", label: "Updates" },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Tab Content */}
        <div className="animate-element">
          {activeTab === "overview" && (
            <ProjectOverview
              project={project}
              onPublish={handlePublish}
              onCancel={handleCancel}
              loading={loading}
            />
          )}
          {activeTab === "rewards" && (
            <ProjectRewards
              project={project}
              rewardTiers={rewardTiers}
              onRefresh={loadProjectData}
            />
          )}
          {activeTab === "milestones" && (
            <ProjectMilestones project={project} onRefresh={loadProjectData} />
          )}
          {activeTab === "backers" && <ProjectBackers project={project} />}
          {activeTab === "updates" && (
            <ProjectUpdates project={project} onRefresh={loadProjectData} />
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectOverview({ project, onPublish, onCancel, loading }) {
  return (
    <div className="space-y-6">
      {/* Project Description */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Project Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert max-w-none">
            <p className="leading-relaxed whitespace-pre-wrap text-zinc-300">
              {project.fullDescription}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Project Images */}
      {project.mainImageUrl && (
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Project Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <img
                src={project.mainImageUrl}
                alt="Main project image"
                className="glass h-64 w-full rounded-2xl object-cover"
              />
              {project.additionalImages?.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={`Additional image ${index + 1}`}
                  className="glass h-32 w-full rounded-2xl object-cover"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project Actions */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Project Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {project.projectStatus === "draft" && (
              <Button onClick={onPublish} disabled={loading} size="lg">
                {loading ? "Publishing..." : "Publish Project"}
              </Button>
            )}

            {project.projectStatus === "live" && (
              <Button
                variant="glass"
                onClick={onCancel}
                disabled={loading}
                size="lg"
              >
                {loading ? "Cancelling..." : "Cancel Project"}
              </Button>
            )}

            <Button
              variant="glass"
              onClick={() => window.open(`/projects/${project.$id}`, "_blank")}
              size="lg"
            >
              View Public Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProjectRewards({ project, rewardTiers, onRefresh }) {
  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle>Reward Tiers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {rewardTiers.map((tier, index) => (
            <div key={tier.$id} className="glass rounded-2xl p-4">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-zinc-100">
                    ${tier.pledgeAmount} - {tier.tierTitle}
                  </h4>
                  <p className="mt-1 text-sm text-zinc-400">
                    {tier.tierDescription}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-zinc-400">
                    {tier.claimedCount} claimed
                  </div>
                  {tier.isLimited && (
                    <div className="text-xs text-zinc-500">
                      of {tier.quantityLimit}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span>Delivery: {tier.estimatedDelivery || "TBD"}</span>
                {tier.isDigital && <span>• Digital</span>}
                {tier.isLimited && <span>• Limited</span>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectMilestones({ project, onRefresh }) {
  // This would be implemented with milestone data
  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle>Project Milestones</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-zinc-400">
          Milestone management will be implemented here.
        </p>
      </CardContent>
    </Card>
  );
}

function ProjectBackers({ project }) {
  // This would be implemented with backer data
  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle>Project Backers</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-zinc-400">Backer list will be implemented here.</p>
      </CardContent>
    </Card>
  );
}

function ProjectUpdates({ project, onRefresh }) {
  // This would be implemented with project updates
  return (
    <Card variant="glass">
      <CardHeader>
        <CardTitle>Project Updates</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-zinc-400">
          Project updates will be implemented here.
        </p>
      </CardContent>
    </Card>
  );
}
