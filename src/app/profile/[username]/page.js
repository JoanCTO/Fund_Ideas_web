"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/lib/contexts/AuthContext";
import { getUserProfile } from "@/lib/api/users";
import {
  Calendar,
  Github,
  Linkedin,
  Globe,
  Edit,
  Settings,
  Heart,
  TrendingUp,
} from "lucide-react";

export default function ProfilePage() {
  const params = useParams();
  const { user: currentUser, profile: currentProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const username = params.username;

  useEffect(() => {
    loadProfile();
  }, [username]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      // In a real app, you'd fetch by username
      // For now, we'll use the current user's profile
      if (currentProfile && currentProfile.username === username) {
        setProfile(currentProfile);
      } else {
        // Fetch other user's profile
        const result = await getUserProfile(username);
        if (result.success) {
          setProfile(result.data);
        } else {
          setError("Profile not found");
        }
      }
    } catch (err) {
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-violet-400 border-t-transparent"></div>
          <p className="text-zinc-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-semibold text-zinc-100">
            Profile Not Found
          </h1>
          <p className="mb-6 text-zinc-400">{error}</p>
          <Button variant="primary" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const isOwnProfile =
    currentUser && currentProfile && currentProfile.username === username;
  const socialLinks = profile.socialLinks
    ? JSON.parse(profile.socialLinks)
    : {};
  const joinDate = new Date(profile.$createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });

  // Mock data for user statistics
  const userStats = {
    projectsCreated: profile.userType === "creator" ? 3 : 0,
    projectsBacked: profile.userType === "backer" ? 8 : 0,
    totalFundingRaised: profile.userType === "creator" ? 125000 : 0,
    totalContributed: profile.userType === "backer" ? 2500 : 0,
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="flex items-start gap-6">
            {/* Profile Picture */}
            <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl bg-zinc-800">
              {profile.profilePictureUrl ? (
                <img
                  src={profile.profilePictureUrl}
                  alt={profile.fullName}
                  className="h-full w-full rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-violet-500">
                  <span className="text-2xl font-semibold text-white">
                    {profile.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h1 className="mb-2 text-3xl font-light tracking-tighter text-white">
                    {profile.fullName}
                  </h1>
                  <div className="mb-2 flex items-center gap-3">
                    <span className="text-zinc-400">@{profile.username}</span>
                    <Badge
                      variant={
                        profile.userType === "creator" ? "violet" : "blue"
                      }
                    >
                      {profile.userType === "creator" ? "Creator" : "Backer"}
                    </Badge>
                    {profile.isVerified && (
                      <Badge variant="green">Verified</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-zinc-400">
                    <Calendar className="h-4 w-4" />
                    <span>Member since {joinDate}</span>
                  </div>
                </div>

                {isOwnProfile && (
                  <div className="flex items-center gap-2">
                    <Button variant="glass" size="sm">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {profile.bio && (
                <p className="mb-4 leading-relaxed text-zinc-300">
                  {profile.bio}
                </p>
              )}

              {/* Social Links */}
              {(socialLinks.github ||
                socialLinks.linkedin ||
                socialLinks.website) && (
                <div className="flex items-center gap-4">
                  {socialLinks.github && (
                    <a
                      href={socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-zinc-400 transition-colors hover:text-zinc-300"
                    >
                      <Github className="h-4 w-4" />
                      <span className="text-sm">GitHub</span>
                    </a>
                  )}
                  {socialLinks.linkedin && (
                    <a
                      href={socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-zinc-400 transition-colors hover:text-zinc-300"
                    >
                      <Linkedin className="h-4 w-4" />
                      <span className="text-sm">LinkedIn</span>
                    </a>
                  )}
                  {socialLinks.website && (
                    <a
                      href={socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-zinc-400 transition-colors hover:text-zinc-300"
                    >
                      <Globe className="h-4 w-4" />
                      <span className="text-sm">Website</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {profile.userType === "creator" ? (
            <>
              <Card variant="glass" className="animate-element">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="mx-auto mb-2 h-8 w-8 text-violet-400" />
                  <p className="text-2xl font-semibold text-zinc-100">
                    {userStats.projectsCreated}
                  </p>
                  <p className="text-sm text-zinc-400">Projects Created</p>
                </CardContent>
              </Card>

              <Card
                variant="glass"
                className="animate-element animate-delay-100"
              >
                <CardContent className="p-6 text-center">
                  <TrendingUp className="mx-auto mb-2 h-8 w-8 text-green-400" />
                  <p className="text-2xl font-semibold text-zinc-100">
                    ${userStats.totalFundingRaised.toLocaleString()}
                  </p>
                  <p className="text-sm text-zinc-400">Total Funding Raised</p>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card variant="glass" className="animate-element">
                <CardContent className="p-6 text-center">
                  <Heart className="mx-auto mb-2 h-8 w-8 text-red-400" />
                  <p className="text-2xl font-semibold text-zinc-100">
                    {userStats.projectsBacked}
                  </p>
                  <p className="text-sm text-zinc-400">Projects Backed</p>
                </CardContent>
              </Card>

              <Card
                variant="glass"
                className="animate-element animate-delay-100"
              >
                <CardContent className="p-6 text-center">
                  <TrendingUp className="mx-auto mb-2 h-8 w-8 text-blue-400" />
                  <p className="text-2xl font-semibold text-zinc-100">
                    ${userStats.totalContributed.toLocaleString()}
                  </p>
                  <p className="text-sm text-zinc-400">Total Contributed</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Projects Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-zinc-100">
            {profile.userType === "creator"
              ? "Created Projects"
              : "Backed Projects"}
          </h2>

          {/* Mock projects data */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {profile.userType === "creator" ? (
              // Creator projects
              <>
                <Card variant="glass" className="animate-element">
                  <CardContent className="p-6">
                    <div className="mb-4 h-32 w-full rounded-xl bg-zinc-800"></div>
                    <h3 className="mb-2 text-lg font-medium text-zinc-100">
                      AI Code Review Tool
                    </h3>
                    <p className="mb-4 text-sm text-zinc-400">
                      Revolutionary AI system for automated code review
                    </p>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Status</span>
                      <Badge variant="violet">Live</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  variant="glass"
                  className="animate-element animate-delay-100"
                >
                  <CardContent className="p-6">
                    <div className="mb-4 h-32 w-full rounded-xl bg-zinc-800"></div>
                    <h3 className="mb-2 text-lg font-medium text-zinc-100">
                      Identity Platform
                    </h3>
                    <p className="mb-4 text-sm text-zinc-400">
                      Blockchain-based identity verification system
                    </p>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Status</span>
                      <Badge variant="green">Completed</Badge>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              // Backer projects
              <>
                <Card variant="glass" className="animate-element">
                  <CardContent className="p-6">
                    <div className="mb-4 h-32 w-full rounded-xl bg-zinc-800"></div>
                    <h3 className="mb-2 text-lg font-medium text-zinc-100">
                      Quantum Simulator
                    </h3>
                    <p className="mb-4 text-sm text-zinc-400">
                      Advanced quantum computing simulation platform
                    </p>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Contribution</span>
                      <span className="font-medium text-green-400">$1,000</span>
                    </div>
                  </CardContent>
                </Card>

                <Card
                  variant="glass"
                  className="animate-element animate-delay-100"
                >
                  <CardContent className="p-6">
                    <div className="mb-4 h-32 w-full rounded-xl bg-zinc-800"></div>
                    <h3 className="mb-2 text-lg font-medium text-zinc-100">
                      ML API Platform
                    </h3>
                    <p className="mb-4 text-sm text-zinc-400">
                      Machine learning API for developers
                    </p>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-400">Contribution</span>
                      <span className="font-medium text-green-400">$500</span>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
