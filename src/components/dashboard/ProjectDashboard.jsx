"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { Alert } from "@/components/ui/Alert";
import { Loading } from "@/components/ui/Loading/Loading";
import { getProjectsByCreator } from "@/lib/api/projects";
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

export function ProjectDashboard({ user, profile }) {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    loadProjects();
  }, [user]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getProjectsByCreator(user.$id, { limit: 50 });

      if (result.success) {
        setProjects(result.data);
      } else {
        setError(result.message || "Failed to load projects");
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((project) => {
    if (filter === "all") return true;
    return project.projectStatus === filter;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.$createdAt) - new Date(a.$createdAt);
      case "oldest":
        return new Date(a.$createdAt) - new Date(b.$createdAt);
      case "funding":
        return b.currentFunding - a.currentFunding;
      case "deadline":
        return new Date(a.deadline) - new Date(b.deadline);
      default:
        return 0;
    }
  });

  const getProjectStats = () => {
    const totalProjects = projects.length;
    const liveProjects = projects.filter(
      (p) => p.projectStatus === "live",
    ).length;
    const fundedProjects = projects.filter(
      (p) => p.projectStatus === "funded",
    ).length;
    const totalFunding = projects.reduce((sum, p) => sum + p.currentFunding, 0);
    const totalBackers = projects.reduce((sum, p) => sum + p.backerCount, 0);

    return {
      totalProjects,
      liveProjects,
      fundedProjects,
      totalFunding,
      totalBackers,
    };
  };

  const stats = getProjectStats();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-4xl font-semibold text-zinc-100">
                <span className="font-light tracking-tighter">Project</span>{" "}
                <span className="text-violet-400">Dashboard</span>
              </h1>
              <p className="text-zinc-400">
                Manage your projects and track their progress
              </p>
            </div>
            <Button
              onClick={() => router.push("/create-project")}
              size="lg"
              className="min-w-[160px]"
            >
              Create Project
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <Card variant="glass">
              <CardContent className="p-4 text-center">
                <div className="mb-1 text-2xl font-semibold text-zinc-100">
                  {stats.totalProjects}
                </div>
                <div className="text-sm text-zinc-400">Total Projects</div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardContent className="p-4 text-center">
                <div className="mb-1 text-2xl font-semibold text-green-400">
                  {stats.liveProjects}
                </div>
                <div className="text-sm text-zinc-400">Live Projects</div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardContent className="p-4 text-center">
                <div className="mb-1 text-2xl font-semibold text-violet-400">
                  {stats.fundedProjects}
                </div>
                <div className="text-sm text-zinc-400">Funded Projects</div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardContent className="p-4 text-center">
                <div className="mb-1 text-2xl font-semibold text-zinc-100">
                  {formatCurrency(stats.totalFunding)}
                </div>
                <div className="text-sm text-zinc-400">Total Raised</div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardContent className="p-4 text-center">
                <div className="mb-1 text-2xl font-semibold text-zinc-100">
                  {stats.totalBackers}
                </div>
                <div className="text-sm text-zinc-400">Total Backers</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <Alert variant="error" message={error} />
          </div>
        )}

        {/* Filters and Controls */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row">
          <div className="flex gap-2">
            {["all", "draft", "live", "funded", "completed", "cancelled"].map(
              (status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                    filter === status
                      ? "bg-violet-500 text-white"
                      : "glass text-zinc-400 hover:text-zinc-300"
                  }`}
                >
                  {STATUS_LABELS[status]} (
                  {
                    projects.filter(
                      (p) => status === "all" || p.projectStatus === status,
                    ).length
                  }
                  )
                </button>
              ),
            )}
          </div>

          <div className="ml-auto flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-input rounded-xl px-4 py-2 text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="funding">Most Funded</option>
              <option value="deadline">Deadline</option>
            </select>
          </div>
        </div>

        {/* Projects Grid */}
        {sortedProjects.length === 0 ? (
          <Card variant="glass">
            <CardContent className="p-12 text-center">
              <div className="glass mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 stroke-zinc-400"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-zinc-100">
                No projects found
              </h3>
              <p className="mb-6 text-zinc-400">
                {filter === "all"
                  ? "You haven't created any projects yet. Start by creating your first project!"
                  : `No projects with status "${STATUS_LABELS[filter]}" found.`}
              </p>
              {filter === "all" && (
                <Button
                  onClick={() => router.push("/create-project")}
                  size="lg"
                >
                  Create Your First Project
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sortedProjects.map((project, index) => (
              <ProjectCard
                key={project.$id}
                project={project}
                index={index}
                onEdit={() =>
                  router.push(`/dashboard/projects/${project.$id}/edit`)
                }
                onView={() => router.push(`/projects/${project.$id}`)}
                onAnalytics={() =>
                  router.push(`/dashboard/projects/${project.$id}/analytics`)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project, index, onEdit, onView, onAnalytics }) {
  const fundingProgress =
    project.fundingGoal > 0
      ? (project.currentFunding / project.fundingGoal) * 100
      : 0;

  const daysRemaining = getDaysRemaining(project.deadline);
  const isOverdue = daysRemaining < 0 && project.projectStatus === "live";

  return (
    <Card
      variant="glass"
      className="animate-element"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardContent className="p-6">
        {/* Project Image */}
        {project.mainImageUrl && (
          <div className="mb-4">
            <img
              src={project.mainImageUrl}
              alt={project.title}
              className="glass h-48 w-full rounded-2xl object-cover"
            />
          </div>
        )}

        {/* Project Header */}
        <div className="mb-4">
          <div className="mb-2 flex items-start justify-between">
            <h3 className="line-clamp-2 text-lg font-semibold text-zinc-100">
              {project.title}
            </h3>
            <Badge className={STATUS_COLORS[project.projectStatus]}>
              {STATUS_LABELS[project.projectStatus]}
            </Badge>
          </div>
          <p className="line-clamp-2 text-sm text-zinc-400">
            {project.shortDescription}
          </p>
        </div>

        {/* Funding Progress */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-300">
              Funding Progress
            </span>
            <span className="text-sm text-zinc-400">
              {formatCurrency(project.currentFunding)} /{" "}
              {formatCurrency(project.fundingGoal)}
            </span>
          </div>
          <Progress value={fundingProgress} className="mb-2" />
          <div className="flex justify-between text-xs text-zinc-500">
            <span>{Math.round(fundingProgress)}% funded</span>
            <span className={isOverdue ? "text-red-400" : ""}>
              {isOverdue ? "Overdue" : `${daysRemaining} days left`}
            </span>
          </div>
        </div>

        {/* Project Stats */}
        <div className="mb-4 grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-zinc-100">
              {project.backerCount}
            </div>
            <div className="text-xs text-zinc-400">Backers</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-zinc-100">
              {formatDate(project.$createdAt)}
            </div>
            <div className="text-xs text-zinc-400">Created</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="glass" size="sm" onClick={onView} className="flex-1">
            View
          </Button>
          {project.projectStatus === "draft" && (
            <Button
              variant="glass"
              size="sm"
              onClick={onEdit}
              className="flex-1"
            >
              Edit
            </Button>
          )}
          {project.projectStatus === "live" && (
            <Button
              variant="glass"
              size="sm"
              onClick={onAnalytics}
              className="flex-1"
            >
              Analytics
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
