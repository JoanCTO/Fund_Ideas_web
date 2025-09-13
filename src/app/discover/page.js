"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Layout, Container, Section, Grid } from "@/components/layout/Layout";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Form/Select";
import { Search, Filter, TrendingUp, Clock, Users } from "lucide-react";
import { formatCurrency, formatDate, getDaysRemaining } from "@/lib/utils";
import { IMAGE_DICTIONARY } from "@/lib/imageDictionary";

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "web_app", label: "Web Applications" },
  { value: "mobile_app", label: "Mobile Apps" },
  { value: "desktop", label: "Desktop Software" },
  { value: "dev_tools", label: "Developer Tools" },
  { value: "saas", label: "SaaS Platforms" },
  { value: "course", label: "Technical Courses" },
  { value: "api", label: "API Services" },
  { value: "other", label: "Other" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "trending", label: "Trending" },
  { value: "most_funded", label: "Most Funded" },
  { value: "ending_soon", label: "Ending Soon" },
];

export default function DiscoverPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [projects, searchQuery, selectedCategory, sortBy]);

  const loadProjects = async () => {
    // Mock data for now - replace with actual API call
    const mockProjects = [
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
        publishedAt: new Date(
          Date.now() - 10 * 24 * 60 * 60 * 1000,
        ).toISOString(),
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
        publishedAt: new Date(
          Date.now() - 5 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      },
      {
        id: "3",
        title: "Quantum Computing Simulator",
        shortDescription: "Advanced quantum computing simulation platform",
        creator: "Quantum Labs",
        currentFunding: 28000,
        fundingGoal: 100000,
        backerCount: 156,
        deadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
        category: "desktop",
        mainImageUrl: IMAGE_DICTIONARY.projects.quantumSimulator.url,
        publishedAt: new Date(
          Date.now() - 3 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      },
    ];

    setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 1000);
  };

  const filterProjects = () => {
    let filtered = [...projects];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.shortDescription
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          project.creator.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (project) => project.category === selectedCategory,
      );
    }

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.publishedAt) - new Date(a.publishedAt);
        case "trending":
          return b.backerCount - a.backerCount;
        case "most_funded":
          return b.currentFunding - a.currentFunding;
        case "ending_soon":
          return new Date(a.deadline) - new Date(b.deadline);
        default:
          return 0;
      }
    });

    setFilteredProjects(filtered);
  };

  const getCategoryLabel = (category) => {
    const cat = CATEGORIES.find((c) => c.value === category);
    return cat ? cat.label : category;
  };

  if (loading) {
    return (
      <Layout>
        <Section>
          <Container>
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-violet-400 border-t-transparent"></div>
                <p className="text-zinc-400">Loading projects...</p>
              </div>
            </div>
          </Container>
        </Section>
      </Layout>
    );
  }

  return (
    <Layout>
      <Section>
        <Container>
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-semibold text-zinc-100">
              <span className="font-light tracking-tighter">Discover</span>{" "}
              <span className="text-violet-400">Projects</span>
            </h1>
            <p className="mx-auto max-w-2xl text-zinc-400">
              Explore innovative technical projects and support creators
              building the future
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {/* Search */}
              <div className="max-w-md flex-1">
                <div className="relative">
                  <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                  <Input
                    placeholder="Search projects, creators..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-4">
                <Select
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  options={CATEGORIES}
                  className="min-w-[180px]"
                />
                <Select
                  value={sortBy}
                  onChange={setSortBy}
                  options={SORT_OPTIONS}
                  className="min-w-[150px]"
                />
              </div>
            </div>
          </div>

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <div className="py-12 text-center">
              <div className="glass mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl">
                <Search className="h-8 w-8 text-zinc-400" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-zinc-100">
                No projects found
              </h3>
              <p className="text-zinc-400">
                Try adjusting your search criteria or browse all projects
              </p>
            </div>
          ) : (
            <Grid cols={3} gap="lg">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </Grid>
          )}
        </Container>
      </Section>
    </Layout>
  );
}

function ProjectCard({ project, index }) {
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

        {/* Action Button */}
        <Link href={`/projects/${project.id}`}>
          <Button variant="accent" className="w-full group-hover:bg-violet-600">
            View Project
          </Button>
        </Link>
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
