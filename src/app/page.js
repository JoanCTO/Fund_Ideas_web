import {
  Layout,
  Container,
  Section,
  Grid,
  Flex,
} from "@/components/layout/Layout";
import { Navigation } from "@/components/layout/Navigation";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import {
  Rocket,
  Users,
  TrendingUp,
  Shield,
  Star,
  ArrowRight,
  Play,
} from "lucide-react";

export default function Home() {
  const featuredProjects = [
    {
      id: 1,
      title: "AI-Powered Code Review Tool",
      description:
        "Revolutionary AI system that automatically reviews code for security vulnerabilities and performance issues.",
      creator: "TechCorp Labs",
      raised: 45000,
      goal: 75000,
      backers: 234,
      daysLeft: 15,
      category: "AI/ML",
      image: "/api/placeholder/400/300",
    },
    {
      id: 2,
      title: "Decentralized Identity Platform",
      description:
        "Blockchain-based identity verification system for secure, privacy-focused authentication.",
      creator: "BlockChain Solutions",
      raised: 32000,
      goal: 50000,
      backers: 189,
      daysLeft: 22,
      category: "Blockchain",
      image: "/api/placeholder/400/300",
    },
    {
      id: 3,
      title: "Quantum Computing Simulator",
      description:
        "Advanced quantum computing simulation platform for researchers and developers.",
      creator: "Quantum Labs",
      raised: 28000,
      goal: 100000,
      backers: 156,
      daysLeft: 8,
      category: "Quantum Computing",
      image: "/api/placeholder/400/300",
    },
  ];

  const stats = [
    { label: "Projects Funded", value: "1,247", icon: Rocket },
    { label: "Total Backers", value: "45,892", icon: Users },
    { label: "Success Rate", value: "87%", icon: TrendingUp },
    { label: "Trust Score", value: "9.8/10", icon: Shield },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-blue-500/10" />
        <Container className="relative">
          <div className="mx-auto max-w-4xl text-center">
            <div className="animate-element">
              <Badge variant="violet" className="mb-6">
                <Star className="mr-2 h-4 w-4" />
                Trusted by 50,000+ creators
              </Badge>
            </div>

            <h1 className="animate-element animate-delay-100 font-display mb-6 text-zinc-100">
              Fund the Future of
              <span className="text-violet-400"> Technical Innovation</span>
            </h1>

            <p className="animate-element animate-delay-200 mx-auto mb-8 max-w-2xl text-xl leading-relaxed text-zinc-400">
              Connect with visionary creators, back groundbreaking projects, and
              be part of the next generation of technological breakthroughs.
            </p>

            <div className="animate-element animate-delay-300 flex flex-col justify-center gap-4 sm:flex-row">
              <Button variant="primary" size="lg" className="group">
                Start Your Project
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="glass" size="lg" className="group">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </Container>
      </Section>

      {/* Stats Section */}
      <Section background="subtle">
        <Container>
          <Grid cols={4} className="text-center">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="animate-element"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Icon
                  container
                  size="xl"
                  variant="violet"
                  className="mx-auto mb-4"
                >
                  <stat.icon className="h-8 w-8" />
                </Icon>
                <div className="mb-2 text-3xl font-bold text-zinc-100">
                  {stat.value}
                </div>
                <div className="text-sm text-zinc-400">{stat.label}</div>
              </div>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Featured Projects */}
      <Section>
        <Container>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-semibold text-zinc-100">
              Featured Projects
            </h2>
            <p className="mx-auto max-w-2xl text-zinc-400">
              Discover innovative technical projects that are shaping the future
            </p>
          </div>

          <Grid cols={3} gap="lg">
            {featuredProjects.map((project, index) => (
              <Card
                key={project.id}
                variant="elevated"
                className="animate-element"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardHeader>
                  <div className="mb-2 flex items-center justify-between">
                    <Badge variant="violet">{project.category}</Badge>
                    <span className="text-sm text-zinc-400">
                      {project.daysLeft} days left
                    </span>
                  </div>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <CardDescription className="text-zinc-300">
                    by {project.creator}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="mb-6 leading-relaxed text-zinc-400">
                    {project.description}
                  </p>

                  <div className="space-y-4">
                    <div>
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="text-zinc-400">Progress</span>
                        <span className="font-medium text-zinc-100">
                          ${project.raised.toLocaleString()} / $
                          {project.goal.toLocaleString()}
                        </span>
                      </div>
                      <Progress
                        value={project.raised}
                        max={project.goal}
                        className="h-2"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-zinc-400">
                        {project.backers} backers
                      </div>
                      <Button variant="accent" size="sm">
                        Back Project
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section background="glass">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-3xl font-semibold text-zinc-100">
              Ready to Make Your Mark?
            </h2>
            <p className="mb-8 text-xl text-zinc-400">
              Join thousands of creators who are building the future with Fund
              Ideas
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button variant="primary" size="lg">
                Create Your Project
              </Button>
              <Button variant="glass" size="lg">
                Explore Opportunities
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </Layout>
  );
}
