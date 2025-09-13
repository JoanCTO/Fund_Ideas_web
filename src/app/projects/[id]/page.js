"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Layout, Container, Section, Grid } from "@/components/layout/Layout";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { Icon } from "@/components/ui/Icon";
import { Loading } from "@/components/ui/Loading/Loading";
import { formatCurrency, formatDate, getDaysRemaining } from "@/lib/utils";
import { IMAGE_DICTIONARY } from "@/lib/imageDictionary";
import {
  Calendar,
  Users,
  DollarSign,
  Clock,
  Share2,
  Heart,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function ProjectPage() {
  const params = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProject();
  }, [params.id]);

  const loadProject = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockProject = {
        id: params.id,
        title: "AI-Powered Code Review Tool",
        shortDescription: "Revolutionary AI system for automated code review",
        fullDescription: `This groundbreaking AI-powered code review tool revolutionizes the way developers approach code quality and security. Built on advanced machine learning algorithms, our system automatically analyzes code for:

**Key Features:**
- Real-time vulnerability detection
- Performance optimization suggestions
- Code style and best practices enforcement
- Integration with popular development environments
- Customizable rule sets for different programming languages

**Technical Innovation:**
Our proprietary neural network has been trained on millions of lines of code from open-source projects, enabling it to identify patterns and potential issues that traditional static analysis tools miss.

**Impact:**
This tool will help development teams reduce bugs by up to 60%, improve code quality, and accelerate development cycles while maintaining high security standards.`,
        creator: "TechCorp Labs",
        creatorId: "creator123",
        currentFunding: 45000,
        fundingGoal: 75000,
        backerCount: 234,
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        completionDate: new Date(
          Date.now() + 90 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        category: "dev_tools",
        developmentStage: "prototype",
        mainImageUrl: IMAGE_DICTIONARY.projects.aiCodeReview.url,
        additionalImages: [
          {
            url: IMAGE_DICTIONARY.projects.aiCodeReviewScreenshot1.url,
            alt: "Screenshot 1",
          },
          {
            url: IMAGE_DICTIONARY.projects.aiCodeReviewScreenshot2.url,
            alt: "Screenshot 2",
          },
        ],
        rewardTiers: [
          {
            id: "tier1",
            title: "Early Bird",
            description: "Get early access to the beta version",
            amount: 25,
            estimatedDelivery: "2024-03-01",
            isLimited: true,
            quantityLimit: 100,
            claimedCount: 45,
          },
          {
            id: "tier2",
            title: "Pro License",
            description: "Full license for individual developers",
            amount: 99,
            estimatedDelivery: "2024-04-01",
            isLimited: false,
            claimedCount: 89,
          },
          {
            id: "tier3",
            title: "Team License",
            description: "License for teams up to 10 developers",
            amount: 299,
            estimatedDelivery: "2024-04-01",
            isLimited: false,
            claimedCount: 23,
          },
        ],
        milestones: [
          {
            title: "Core Development",
            description: "Complete the core AI engine and basic functionality",
            percentage: 40,
            targetDate: "2024-02-15",
            completed: false,
          },
          {
            title: "Beta Testing",
            description: "Release beta version for early backers",
            percentage: 30,
            targetDate: "2024-03-01",
            completed: false,
          },
          {
            title: "Final Release",
            description: "Complete product with all features",
            percentage: 30,
            targetDate: "2024-04-01",
            completed: false,
          },
        ],
        publishedAt: new Date(
          Date.now() - 10 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      };

      setTimeout(() => {
        setProject(mockProject);
        setLoading(false);
      }, 1000);
    } catch (error) {
      setError("Failed to load project");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <Section>
          <Container>
            <div className="flex min-h-[400px] items-center justify-center">
              <Loading />
            </div>
          </Container>
        </Section>
      </Layout>
    );
  }

  if (error || !project) {
    return (
      <Layout>
        <Section>
          <Container>
            <div className="py-12 text-center">
              <h1 className="mb-4 text-2xl font-semibold text-zinc-100">
                Project Not Found
              </h1>
              <p className="mb-6 text-zinc-400">
                The project you're looking for doesn't exist or has been
                removed.
              </p>
              <Link href="/discover">
                <Button variant="primary">Browse Projects</Button>
              </Link>
            </div>
          </Container>
        </Section>
      </Layout>
    );
  }

  const fundingProgress =
    project.fundingGoal > 0
      ? (project.currentFunding / project.fundingGoal) * 100
      : 0;

  const daysRemaining = getDaysRemaining(project.deadline);
  const isUrgent = daysRemaining <= 3;

  return (
    <Layout>
      <Section>
        <Container>
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/discover">
              <Button variant="ghost" size="sm" className="group">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Discover
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Project Header */}
              <div className="mb-8">
                <div className="mb-4 flex items-center gap-3">
                  <Badge variant="violet">
                    {getCategoryLabel(project.category)}
                  </Badge>
                  <Badge
                    variant={
                      project.developmentStage === "concept"
                        ? "default"
                        : "success"
                    }
                  >
                    {project.developmentStage === "concept"
                      ? "Concept"
                      : "In Development"}
                  </Badge>
                  {isUrgent && <Badge variant="error">Ending Soon</Badge>}
                </div>

                <h1 className="mb-4 text-4xl font-semibold text-zinc-100">
                  {project.title}
                </h1>
                <p className="text-xl text-zinc-400">by {project.creator}</p>
              </div>

              {/* Project Image */}
              {project.mainImageUrl && (
                <div className="mb-8 overflow-hidden rounded-3xl">
                  <img
                    src={project.mainImageUrl}
                    alt={project.title}
                    className="h-96 w-full object-cover"
                  />
                </div>
              )}

              {/* Project Description */}
              <Card variant="glass" className="mb-8">
                <CardContent className="p-8">
                  <div className="prose prose-invert max-w-none">
                    <p className="text-lg leading-relaxed whitespace-pre-wrap text-zinc-300">
                      {project.fullDescription}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Images */}
              {project.additionalImages &&
                project.additionalImages.length > 0 && (
                  <Card variant="glass" className="mb-8">
                    <CardHeader>
                      <CardTitle>Project Gallery</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Grid cols={2} gap="lg">
                        {project.additionalImages.map((image, index) => (
                          <div
                            key={index}
                            className="overflow-hidden rounded-2xl"
                          >
                            <img
                              src={image.url}
                              alt={image.alt}
                              className="h-64 w-full object-cover"
                            />
                          </div>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                )}

              {/* Milestones */}
              <Card variant="glass" className="mb-8">
                <CardHeader>
                  <CardTitle>Project Milestones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.milestones.map((milestone, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20">
                          <span className="text-sm font-medium text-violet-400">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-zinc-100">
                            {milestone.title}
                          </h4>
                          <p className="text-sm text-zinc-400">
                            {milestone.description}
                          </p>
                          <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(milestone.targetDate)}</span>
                            <span className="ml-2 rounded bg-violet-500/20 px-2 py-1 text-violet-400">
                              {milestone.percentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Funding Card */}
              <Card variant="glass">
                <CardContent className="p-6">
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

                  <div className="mb-4 flex items-center gap-2 text-sm text-zinc-400">
                    <Clock className="h-4 w-4" />
                    <span className={isUrgent ? "text-red-400" : ""}>
                      {daysRemaining} days left
                    </span>
                  </div>

                  <Button variant="primary" size="lg" className="mb-4 w-full">
                    <DollarSign className="mr-2 h-5 w-5" />
                    Back This Project
                  </Button>

                  <div className="flex gap-2">
                    <Button variant="glass" size="sm" className="flex-1">
                      <Heart className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                    <Button variant="glass" size="sm" className="flex-1">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Reward Tiers */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>Reward Tiers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.rewardTiers.map((tier) => (
                      <div
                        key={tier.id}
                        className="rounded-xl border border-zinc-800 p-4"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="font-semibold text-zinc-100">
                            ${tier.amount}
                          </span>
                          {tier.isLimited && (
                            <Badge variant="violet" size="sm">
                              Limited
                            </Badge>
                          )}
                        </div>
                        <h4 className="mb-2 font-medium text-zinc-100">
                          {tier.title}
                        </h4>
                        <p className="mb-3 text-sm text-zinc-400">
                          {tier.description}
                        </p>
                        <div className="mb-3 flex items-center justify-between text-xs text-zinc-500">
                          <span>
                            Delivery: {formatDate(tier.estimatedDelivery)}
                          </span>
                          {tier.isLimited && (
                            <span>
                              {tier.claimedCount}/{tier.quantityLimit} claimed
                            </span>
                          )}
                        </div>
                        <Button variant="accent" size="sm" className="w-full">
                          Select This Tier
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Creator Info */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>About the Creator</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-500">
                      <span className="text-lg font-medium text-white">
                        {project.creator.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium text-zinc-100">
                        {project.creator}
                      </h4>
                      <p className="text-sm text-zinc-400">Verified Creator</p>
                    </div>
                  </div>
                  <Button variant="glass" size="sm" className="w-full">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </Layout>
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
