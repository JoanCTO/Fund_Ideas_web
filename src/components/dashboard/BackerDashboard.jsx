"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { IMAGE_DICTIONARY } from "@/lib/imageDictionary";
import {
  Heart,
  TrendingUp,
  DollarSign,
  Package,
  Eye,
  ExternalLink,
  Star,
  Clock,
} from "lucide-react";

export function BackerDashboard({ user, profile }) {
  // Mock data - in real app, this would come from API
  const stats = {
    projectsBacked: 8,
    totalContributed: 2500,
    rewardsPending: 3,
    activeProjects: 5,
  };

  const backedProjects = [
    {
      id: 1,
      title: "AI-Powered Code Review Tool",
      creator: "TechCorp Labs",
      contribution: 500,
      rewardTier: "Early Bird",
      status: "live",
      progress: 60,
      daysLeft: 15,
      image: IMAGE_DICTIONARY.projects.aiCodeReviewThumb.url,
    },
    {
      id: 2,
      title: "Decentralized Identity Platform",
      creator: "BlockChain Solutions",
      contribution: 250,
      rewardTier: "Supporter",
      status: "live",
      progress: 64,
      daysLeft: 22,
      image: IMAGE_DICTIONARY.projects.decentralizedIdentity.url,
    },
    {
      id: 3,
      title: "Quantum Computing Simulator",
      creator: "Quantum Labs",
      contribution: 1000,
      rewardTier: "VIP",
      status: "completed",
      progress: 100,
      daysLeft: 0,
      image: IMAGE_DICTIONARY.projects.quantumSimulator.url,
    },
  ];

  const recommendedProjects = [
    {
      id: 4,
      title: "Machine Learning API Platform",
      creator: "ML Innovations",
      category: "AI/ML",
      raised: 25000,
      goal: 50000,
      backers: 45,
      daysLeft: 18,
      image: IMAGE_DICTIONARY.projects.mlApiPlatform.url,
    },
    {
      id: 5,
      title: "Blockchain Voting System",
      creator: "Democracy Tech",
      category: "Blockchain",
      raised: 15000,
      goal: 40000,
      backers: 32,
      daysLeft: 25,
      image: IMAGE_DICTIONARY.projects.blockchainVoting.url,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "live":
        return "violet";
      case "completed":
        return "green";
      case "failed":
        return "red";
      default:
        return "gray";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "live":
        return "Live";
      case "completed":
        return "Completed";
      case "failed":
        return "Failed";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-light tracking-tighter text-white">
                Welcome back, {profile.fullName}!
              </h1>
              <p className="text-zinc-400">
                Track your backed projects and discover new opportunities
              </p>
            </div>
            <Button variant="primary" size="lg" className="group">
              <Heart className="mr-2 h-5 w-5" />
              Discover Projects
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card variant="glass" className="animate-element">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm text-zinc-400">Projects Backed</p>
                  <p className="text-2xl font-semibold text-zinc-100">
                    {stats.projectsBacked}
                  </p>
                </div>
                <div className="glass flex h-12 w-12 items-center justify-center rounded-2xl">
                  <Heart className="h-6 w-6 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="glass" className="animate-element animate-delay-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm text-zinc-400">
                    Total Contributed
                  </p>
                  <p className="text-2xl font-semibold text-zinc-100">
                    ${stats.totalContributed.toLocaleString()}
                  </p>
                </div>
                <div className="glass flex h-12 w-12 items-center justify-center rounded-2xl">
                  <DollarSign className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="glass" className="animate-element animate-delay-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm text-zinc-400">Rewards Pending</p>
                  <p className="text-2xl font-semibold text-zinc-100">
                    {stats.rewardsPending}
                  </p>
                </div>
                <div className="glass flex h-12 w-12 items-center justify-center rounded-2xl">
                  <Package className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="glass" className="animate-element animate-delay-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm text-zinc-400">Active Projects</p>
                  <p className="text-2xl font-semibold text-zinc-100">
                    {stats.activeProjects}
                  </p>
                </div>
                <div className="glass flex h-12 w-12 items-center justify-center rounded-2xl">
                  <TrendingUp className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Backed Projects Section */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-zinc-100">
                Your Backed Projects
              </h2>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {backedProjects.map((project, index) => (
                <Card
                  key={project.id}
                  variant="glass"
                  className="animate-element"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="h-20 w-20 flex-shrink-0 rounded-2xl bg-zinc-800"></div>
                      <div className="flex-1">
                        <div className="mb-3 flex items-start justify-between">
                          <div>
                            <h3 className="mb-1 text-lg font-medium text-zinc-100">
                              {project.title}
                            </h3>
                            <p className="text-sm text-zinc-400">
                              by {project.creator}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={getStatusColor(project.status)}>
                              {getStatusText(project.status)}
                            </Badge>
                            <p className="mt-1 text-sm text-zinc-400">
                              {project.daysLeft > 0
                                ? `${project.daysLeft} days left`
                                : "Completed"}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">
                              Your contribution
                            </span>
                            <span className="font-medium text-zinc-100">
                              ${project.contribution}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Reward tier</span>
                            <span className="text-violet-400">
                              {project.rewardTier}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Progress</span>
                            <span className="text-zinc-100">
                              {project.progress}%
                            </span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            View Project
                          </Button>
                          <Button variant="ghost" size="sm">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Updates
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Recommendations Section */}
          <div>
            <h2 className="mb-6 text-2xl font-semibold text-zinc-100">
              Recommended for You
            </h2>
            <div className="space-y-4">
              {recommendedProjects.map((project, index) => (
                <Card
                  key={project.id}
                  variant="glass"
                  className="animate-element"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-4">
                    <div className="mb-3 flex gap-3">
                      <div className="h-12 w-12 flex-shrink-0 rounded-xl bg-zinc-800"></div>
                      <div className="flex-1">
                        <h3 className="mb-1 text-sm font-medium text-zinc-100">
                          {project.title}
                        </h3>
                        <p className="text-xs text-zinc-400">
                          by {project.creator}
                        </p>
                      </div>
                    </div>

                    <div className="mb-3 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-400">Progress</span>
                        <span className="text-zinc-100">
                          ${project.raised.toLocaleString()} / $
                          {project.goal.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={(project.raised / project.goal) * 100}
                        className="h-1"
                      />
                    </div>

                    <div className="mb-3 flex items-center justify-between text-xs text-zinc-400">
                      <span>{project.backers} backers</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {project.daysLeft} days left
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="accent" size="sm" className="flex-1">
                        <Star className="mr-1 h-3 w-3" />
                        Back Project
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
