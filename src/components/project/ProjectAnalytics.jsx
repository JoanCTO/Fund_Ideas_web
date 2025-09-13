"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { Alert } from "@/components/ui/Alert";
import { Loading } from "@/components/ui/Loading/Loading";
import { getProject, getProjectStats } from "@/lib/api/projects";
import { getRewardTiers } from "@/lib/api/rewardTiers";
import { formatCurrency, formatDate, getDaysRemaining } from "@/lib/utils";

export function ProjectAnalytics({ projectId, user, profile, onBack }) {
  const [project, setProject] = useState(null);
  const [stats, setStats] = useState(null);
  const [rewardTiers, setRewardTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAnalyticsData();
  }, [projectId]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      setError("");

      const [projectResult, statsResult, tiersResult] = await Promise.all([
        getProject(projectId),
        getProjectStats(projectId),
        getRewardTiers(projectId),
      ]);

      if (projectResult.success) {
        setProject(projectResult.data);
      } else {
        setError(projectResult.message || "Failed to load project");
      }

      if (statsResult.success) {
        setStats(statsResult.data);
      }

      if (tiersResult.success) {
        setRewardTiers(tiersResult.data);
      }
    } catch (error) {
      console.error("Error loading analytics data:", error);
      setError("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
          <Button onClick={onBack}>Back to Project</Button>
        </div>
      </div>
    );
  }

  const fundingProgress = stats?.fundingProgress || 0;
  const daysRemaining = stats?.daysRemaining || 0;

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
                Analytics - {project.title}
              </h1>
              <div className="flex items-center gap-4">
                <Badge className="bg-violet-500/20 text-violet-400">
                  Analytics Dashboard
                </Badge>
                <span className="text-zinc-400">
                  Last updated {formatDate(new Date())}
                </span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6">
              <Alert variant="error" message={error} />
            </div>
          )}

          {/* Key Metrics */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card variant="glass">
              <CardContent className="p-4 text-center">
                <div className="mb-1 text-2xl font-semibold text-zinc-100">
                  {formatCurrency(stats?.currentFunding || 0)}
                </div>
                <div className="text-sm text-zinc-400">Total Raised</div>
                <div className="text-xs text-zinc-500">
                  of {formatCurrency(stats?.fundingGoal || 0)} goal
                </div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardContent className="p-4 text-center">
                <div className="mb-1 text-2xl font-semibold text-zinc-100">
                  {stats?.backerCount || 0}
                </div>
                <div className="text-sm text-zinc-400">Total Backers</div>
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
                <div className="mb-1 text-2xl font-semibold text-zinc-100">
                  {formatCurrency(stats?.averageBacking || 0)}
                </div>
                <div className="text-sm text-zinc-400">Avg. Backing</div>
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
                  {formatCurrency(stats?.currentFunding || 0)} /{" "}
                  {formatCurrency(stats?.fundingGoal || 0)}
                </span>
              </div>
              <Progress value={fundingProgress} className="mb-2" />
              <div className="flex justify-between text-sm text-zinc-500">
                <span>{Math.round(fundingProgress)}% funded</span>
                <span>{formatCurrency(stats?.remaining || 0)} remaining</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Sections */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Reward Tier Performance */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Reward Tier Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rewardTiers.map((tier, index) => {
                  const tierStats = {
                    claimedCount: tier.claimedCount || 0,
                    quantityLimit: tier.quantityLimit || 0,
                    isLimited: tier.isLimited,
                  };

                  const tierProgress =
                    tierStats.isLimited && tierStats.quantityLimit > 0
                      ? (tierStats.claimedCount / tierStats.quantityLimit) * 100
                      : 0;

                  return (
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
                            {tierStats.claimedCount} claimed
                          </div>
                          {tierStats.isLimited && (
                            <div className="text-xs text-zinc-500">
                              of {tierStats.quantityLimit}
                            </div>
                          )}
                        </div>
                      </div>

                      {tierStats.isLimited && (
                        <div className="mb-2">
                          <Progress value={tierProgress} size="sm" />
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-zinc-500">
                        <span>
                          Revenue:{" "}
                          {formatCurrency(
                            tierStats.claimedCount * tier.pledgeAmount,
                          )}
                        </span>
                        {tier.isDigital && <span>• Digital</span>}
                        {tier.isLimited && <span>• Limited</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Project Timeline */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="glass flex items-center justify-between rounded-xl p-3">
                  <div>
                    <span className="text-sm font-medium text-zinc-100">
                      Project Created
                    </span>
                    <div className="text-xs text-zinc-500">
                      {formatDate(project.$createdAt)}
                    </div>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                </div>

                {project.publishedAt && (
                  <div className="glass flex items-center justify-between rounded-xl p-3">
                    <div>
                      <span className="text-sm font-medium text-zinc-100">
                        Project Published
                      </span>
                      <div className="text-xs text-zinc-500">
                        {formatDate(project.publishedAt)}
                      </div>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-violet-500"></div>
                  </div>
                )}

                <div className="glass flex items-center justify-between rounded-xl p-3">
                  <div>
                    <span className="text-sm font-medium text-zinc-100">
                      Funding Deadline
                    </span>
                    <div className="text-xs text-zinc-500">
                      {formatDate(project.deadline)}
                    </div>
                  </div>
                  <div
                    className={`h-2 w-2 rounded-full ${
                      daysRemaining < 0 ? "bg-red-500" : "bg-yellow-500"
                    }`}
                  ></div>
                </div>

                {project.completionDate && (
                  <div className="glass flex items-center justify-between rounded-xl p-3">
                    <div>
                      <span className="text-sm font-medium text-zinc-100">
                        Expected Completion
                      </span>
                      <div className="text-xs text-zinc-500">
                        {formatDate(project.completionDate)}
                      </div>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="glass rounded-2xl p-4">
                  <h4 className="mb-2 font-medium text-zinc-100">
                    Funding Velocity
                  </h4>
                  <div className="mb-1 text-2xl font-semibold text-violet-400">
                    {formatCurrency(
                      Math.ceil(
                        (stats?.currentFunding || 0) /
                          Math.max(1, daysRemaining),
                      ),
                    )}
                    /day
                  </div>
                  <p className="text-sm text-zinc-400">
                    Average daily funding rate
                  </p>
                </div>

                <div className="glass rounded-2xl p-4">
                  <h4 className="mb-2 font-medium text-zinc-100">
                    Projected Completion
                  </h4>
                  <div className="mb-1 text-2xl font-semibold text-zinc-100">
                    {daysRemaining > 0 ? `${daysRemaining} days` : "Overdue"}
                  </div>
                  <p className="text-sm text-zinc-400">
                    Time remaining in funding period
                  </p>
                </div>

                <div className="glass rounded-2xl p-4">
                  <h4 className="mb-2 font-medium text-zinc-100">
                    Conversion Rate
                  </h4>
                  <div className="mb-1 text-2xl font-semibold text-green-400">
                    {stats?.backerCount > 0 ? "Good" : "N/A"}
                  </div>
                  <p className="text-sm text-zinc-400">
                    Based on current backer engagement
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {fundingProgress < 25 && (
                  <div className="glass rounded-xl p-3">
                    <h4 className="mb-1 font-medium text-yellow-400">
                      Low Funding Progress
                    </h4>
                    <p className="text-sm text-zinc-400">
                      Consider promoting your project on social media and
                      reaching out to your network.
                    </p>
                  </div>
                )}

                {daysRemaining < 7 && fundingProgress < 100 && (
                  <div className="glass rounded-xl p-3">
                    <h4 className="mb-1 font-medium text-red-400">
                      Urgent Action Needed
                    </h4>
                    <p className="text-sm text-zinc-400">
                      Time is running out! Consider extending your deadline or
                      adjusting your funding goal.
                    </p>
                  </div>
                )}

                {fundingProgress > 75 && (
                  <div className="glass rounded-xl p-3">
                    <h4 className="mb-1 font-medium text-green-400">
                      Great Progress!
                    </h4>
                    <p className="text-sm text-zinc-400">
                      You're close to your goal! Keep up the momentum with
                      regular updates.
                    </p>
                  </div>
                )}

                {rewardTiers.length < 3 && (
                  <div className="glass rounded-xl p-3">
                    <h4 className="mb-1 font-medium text-blue-400">
                      Add More Reward Tiers
                    </h4>
                    <p className="text-sm text-zinc-400">
                      Consider adding more reward options to attract different
                      types of backers.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
