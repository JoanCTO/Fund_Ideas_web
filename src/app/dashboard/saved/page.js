"use client";

import React, { useState, useEffect } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Loading } from "@/components/ui/Loading/Loading";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { formatCurrency, formatDate, getDaysRemaining } from "@/lib/utils";
import { IMAGE_DICTIONARY } from "@/lib/imageDictionary";
import { Heart, Clock, Users, DollarSign, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/contexts/AuthContext";

export default function SavedProjectsPage() {
  const { user, profile, loading } = useAuth();
  const [savedProjects, setSavedProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      loadSavedProjects();
    }
  }, [loading]);

  const loadSavedProjects = async () => {
    // Mock data for now - replace with actual API call
    const mockSavedProjects = [
      {
        id: "1",
        title: "AI-Powered Code Review Tool",
        shortDescription: "Revolutionary AI system for automated code review",
        creator: "TechCorp Labs",
        currentFunding: 45000,
        fundingGoal: 75000,
        backerCount: 234,
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        category: "dev_tools",
        mainImageUrl: IMAGE_DICTIONARY.projects.aiCodeReviewThumb.url,
        savedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "2",
        title: "Decentralized Identity Platform",
        shortDescription: "Blockchain-based identity verification system",
        creator: "BlockChain Solutions",
        currentFunding: 32000,
        fundingGoal: 50000,
        backerCount: 189,
        deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000).toISOString(),
        category: "web_app",
        mainImageUrl: IMAGE_DICTIONARY.projects.decentralizedIdentity.url,
        savedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    setTimeout(() => {
      setSavedProjects(mockSavedProjects);
      setIsLoading(false);
    }, 1000);
  };

  if (loading || isLoading) {
    return (
      <AuthGuard>
        <DashboardLayout>
          <div className="flex min-h-[400px] items-center justify-center">
            <Loading />
          </div>
        </DashboardLayout>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="min-h-screen bg-zinc-950 px-4 py-8">
          <div className="mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h1 className="mb-2 text-4xl font-semibold text-zinc-100">
                    <span className="font-light tracking-tighter">Saved</span>{" "}
                    <span className="text-violet-400">Projects</span>
                  </h1>
                  <p className="text-zinc-400">
                    Projects you've saved for later
                  </p>
                </div>
                <Icon
                  container
                  size="xl"
                  variant="violet"
                  className="animate-element"
                >
                  <Heart className="h-8 w-8" />
                </Icon>
              </div>
            </div>

            {/* Saved Projects */}
            {savedProjects.length === 0 ? (
              <Card variant="glass">
                <CardContent className="p-12 text-center">
                  <Icon
                    container
                    size="xl"
                    variant="violet"
                    className="mx-auto mb-6"
                  >
                    <Heart className="h-8 w-8" />
                  </Icon>
                  <h3 className="mb-2 text-xl font-semibold text-zinc-100">
                    No saved projects yet
                  </h3>
                  <p className="mb-6 text-zinc-400">
                    Start exploring projects and save the ones that interest you
                  </p>
                  <Link href="/discover">
                    <Button variant="primary">Discover Projects</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {savedProjects.map((project, index) => (
                  <SavedProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}

function SavedProjectCard({ project, index }) {
  const fundingProgress =
    project.fundingGoal > 0
      ? (project.currentFunding / project.fundingGoal) * 100
      : 0;

  const daysRemaining = getDaysRemaining(project.deadline);
  const isUrgent = daysRemaining <= 3;

  return (
    <Card
      variant="glass"
      className="animate-element group cursor-pointer transition-all duration-300 hover:scale-[1.02]"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <CardHeader>
        {/* Project Image */}
        {project.mainImageUrl && (
          <div className="mb-4 overflow-hidden rounded-2xl">
            <img
              src={project.mainImageUrl}
              alt={project.title}
              className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}

        {/* Category and Status */}
        <div className="mb-3 flex items-center justify-between">
          <Badge variant="violet">{getCategoryLabel(project.category)}</Badge>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Clock className="h-4 w-4" />
            <span className={isUrgent ? "text-red-400" : ""}>
              {daysRemaining} days left
            </span>
          </div>
        </div>

        {/* Title and Creator */}
        <CardTitle className="text-xl leading-tight">{project.title}</CardTitle>
        <p className="text-sm text-zinc-400">by {project.creator}</p>
      </CardHeader>

      <CardContent>
        {/* Description */}
        <p className="mb-6 leading-relaxed text-zinc-300">
          {project.shortDescription}
        </p>

        {/* Funding Progress */}
        <div className="mb-4">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-zinc-400">Progress</span>
            <span className="font-medium text-zinc-100">
              {formatCurrency(project.currentFunding)} /{" "}
              {formatCurrency(project.fundingGoal)}
            </span>
          </div>
          <Progress value={fundingProgress} className="mb-2" />
          <div className="flex items-center justify-between text-sm text-zinc-500">
            <span>{Math.round(fundingProgress)}% funded</span>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{project.backerCount} backers</span>
            </div>
          </div>
        </div>

        {/* Saved Date */}
        <div className="mb-4 text-xs text-zinc-500">
          Saved {formatDate(project.savedAt)}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link href={`/projects/${project.id}`} className="flex-1">
            <Button variant="accent" size="sm" className="w-full">
              <ExternalLink className="mr-2 h-4 w-4" />
              View Project
            </Button>
          </Link>
          <Button variant="glass" size="sm">
            <Heart className="h-4 w-4 text-red-400" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function getCategoryLabel(category) {
  const categories = {
    web_app: "Web App",
    mobile_app: "Mobile App",
    desktop: "Desktop",
    dev_tools: "Dev Tools",
    saas: "SaaS",
    course: "Course",
    api: "API",
    other: "Other",
  };
  return categories[category] || category;
}
