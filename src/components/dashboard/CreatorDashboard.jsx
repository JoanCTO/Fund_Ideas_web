"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import {
  Plus,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Eye,
  Edit,
  BarChart3,
  Target,
} from "lucide-react";

export function CreatorDashboard({ user, profile }) {
  // Mock data - in real app, this would come from API
  const stats = {
    totalProjects: 3,
    activeProjects: 2,
    totalFunding: 125000,
    totalBackers: 89,
  };

  const recentProjects = [
    {
      id: 1,
      title: "AI-Powered Code Review Tool",
      status: "live",
      raised: 45000,
      goal: 75000,
      backers: 34,
      daysLeft: 15,
      progress: 60,
    },
    {
      id: 2,
      title: "Decentralized Identity Platform",
      status: "live",
      raised: 32000,
      goal: 50000,
      backers: 28,
      daysLeft: 22,
      progress: 64,
    },
    {
      id: 3,
      title: "Quantum Computing Simulator",
      status: "completed",
      raised: 100000,
      goal: 100000,
      backers: 27,
      daysLeft: 0,
      progress: 100,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "backer",
      message: "New backer joined your AI Code Review project",
      time: "2 hours ago",
      amount: 500,
    },
    {
      id: 2,
      type: "milestone",
      message: "Milestone 'Beta Release' completed for Identity Platform",
      time: "1 day ago",
      amount: null,
    },
    {
      id: 3,
      type: "comment",
      message: "New comment on Quantum Simulator project",
      time: "2 days ago",
      amount: null,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "live":
        return "violet";
      case "completed":
        return "green";
      case "draft":
        return "yellow";
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
      case "draft":
        return "Draft";
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
                Manage your projects and track your funding progress
              </p>
            </div>
            <Button variant="primary" size="lg" className="group">
              <Plus className="mr-2 h-5 w-5" />
              Create New Project
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
                  <p className="mb-1 text-sm text-zinc-400">Total Projects</p>
                  <p className="text-2xl font-semibold text-zinc-100">
                    {stats.totalProjects}
                  </p>
                </div>
                <div className="glass flex h-12 w-12 items-center justify-center rounded-2xl">
                  <Target className="h-6 w-6 text-violet-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="glass" className="animate-element animate-delay-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm text-zinc-400">Active Projects</p>
                  <p className="text-2xl font-semibold text-zinc-100">
                    {stats.activeProjects}
                  </p>
                </div>
                <div className="glass flex h-12 w-12 items-center justify-center rounded-2xl">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="glass" className="animate-element animate-delay-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm text-zinc-400">Total Funding</p>
                  <p className="text-2xl font-semibold text-zinc-100">
                    ${stats.totalFunding.toLocaleString()}
                  </p>
                </div>
                <div className="glass flex h-12 w-12 items-center justify-center rounded-2xl">
                  <DollarSign className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="glass" className="animate-element animate-delay-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="mb-1 text-sm text-zinc-400">Total Backers</p>
                  <p className="text-2xl font-semibold text-zinc-100">
                    {stats.totalBackers}
                  </p>
                </div>
                <div className="glass flex h-12 w-12 items-center justify-center rounded-2xl">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Projects Section */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-zinc-100">
                Your Projects
              </h2>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {recentProjects.map((project, index) => (
                <Card
                  key={project.id}
                  variant="glass"
                  className="animate-element"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <h3 className="text-lg font-medium text-zinc-100">
                            {project.title}
                          </h3>
                          <Badge variant={getStatusColor(project.status)}>
                            {getStatusText(project.status)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-zinc-400">
                          <span>{project.backers} backers</span>
                          <span>{project.daysLeft} days left</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <BarChart3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-400">Progress</span>
                        <span className="text-zinc-100">
                          ${project.raised.toLocaleString()} / $
                          {project.goal.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div>
            <h2 className="mb-6 text-2xl font-semibold text-zinc-100">
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <Card
                  key={activity.id}
                  variant="glass"
                  className="animate-element"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-4">
                    <p className="mb-2 text-sm text-zinc-300">
                      {activity.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-500">
                        {activity.time}
                      </span>
                      {activity.amount && (
                        <span className="text-xs font-medium text-green-400">
                          +${activity.amount}
                        </span>
                      )}
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
