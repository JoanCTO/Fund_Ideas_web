"use client";

import React from "react";
import {
  Layout,
  Container,
  Section,
  Grid,
  Flex,
} from "@/components/layout/Layout";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { IMAGE_DICTIONARY } from "@/lib/imageDictionary";
import {
  Rocket,
  Users,
  Shield,
  Heart,
  Target,
  Lightbulb,
  Globe,
  Zap,
} from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description:
        "We're committed to empowering technical innovators and connecting them with supporters who share their vision.",
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description:
        "Built on secure infrastructure with transparent processes, ensuring safe transactions and project delivery.",
    },
    {
      icon: Users,
      title: "Community First",
      description:
        "Fostering a supportive ecosystem where creators and backers collaborate to bring ideas to life.",
    },
    {
      icon: Zap,
      title: "Innovation Focus",
      description:
        "Dedicated to technical projects that push boundaries and create meaningful impact in the world.",
    },
  ];

  const stats = [
    { label: "Projects Launched", value: "1,247", icon: Rocket },
    { label: "Active Backers", value: "45,892", icon: Users },
    { label: "Success Rate", value: "87%", icon: Target },
    { label: "Countries", value: "42", icon: Globe },
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Co-Founder",
      bio: "Former tech lead at Google with 10+ years in product development.",
      image: IMAGE_DICTIONARY.team.sarahChenCeo.url,
    },
    {
      name: "Marcus Rodriguez",
      role: "CTO & Co-Founder",
      bio: "Ex-Microsoft engineer specializing in scalable platform architecture.",
      image: IMAGE_DICTIONARY.team.marcusRodriguezCto.url,
    },
    {
      name: "Dr. Emily Watson",
      role: "Head of Community",
      bio: "PhD in Computer Science, passionate about fostering innovation communities.",
      image: IMAGE_DICTIONARY.team.emilyWatsonCommunity.url,
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <Section className="relative overflow-hidden" padding="lg">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-blue-500/10"></div>
        <Container className="relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <div className="animate-element mb-6">
              <Badge variant="violet" className="mb-4">
                <Heart className="mr-2 h-4 w-4" />
                About Fund Ideas
              </Badge>
            </div>

            <h1 className="animate-element animate-delay-100 mb-6 text-4xl font-semibold text-zinc-100 md:text-5xl">
              <span className="font-light tracking-tighter">
                Building the Future
              </span>{" "}
              <span className="text-violet-400">Together</span>
            </h1>

            <p className="animate-element animate-delay-200 mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-zinc-400">
              Fund Ideas is the premier platform for technical innovation,
              connecting visionary creators with passionate backers to bring
              groundbreaking projects to life. We believe in the power of
              community-driven development and the transformative potential of
              technology.
            </p>
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

      {/* Our Story */}
      <Section>
        <Container>
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-semibold text-zinc-100">
                Our Story
              </h2>
              <p className="text-zinc-400">
                Founded in 2023 by a team of passionate technologists and
                entrepreneurs
              </p>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="mb-6 text-lg leading-relaxed text-zinc-300">
                Fund Ideas was born from a simple observation: the most
                innovative technical projects often struggle to find funding and
                community support. Traditional crowdfunding platforms weren't
                designed for the unique needs of technical creators, who require
                specialized tools, expert feedback, and a community that
                understands the complexities of software development.
              </p>

              <p className="mb-6 text-lg leading-relaxed text-zinc-300">
                We set out to create a platform that bridges this gap, providing
                creators with the resources they need to validate ideas, build
                prototypes, and scale their innovations. Our platform combines
                cutting-edge technology with human expertise, ensuring that
                every project receives the attention and support it deserves.
              </p>

              <p className="text-lg leading-relaxed text-zinc-300">
                Today, Fund Ideas has become the go-to destination for technical
                innovation, hosting everything from open-source libraries to
                enterprise software solutions. We're proud to have helped
                thousands of creators turn their ideas into reality, and we're
                just getting started.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      {/* Values */}
      <Section background="glass">
        <Container>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-semibold text-zinc-100">
              Our Values
            </h2>
            <p className="mx-auto max-w-2xl text-zinc-400">
              The principles that guide everything we do
            </p>
          </div>

          <Grid cols={2} gap="lg">
            {values.map((value, index) => (
              <Card
                key={value.title}
                variant="glass"
                className="animate-element"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-6">
                  <Icon container size="lg" variant="violet" className="mb-4">
                    <value.icon className="h-6 w-6" />
                  </Icon>
                  <h3 className="mb-3 text-xl font-semibold text-zinc-100">
                    {value.title}
                  </h3>
                  <p className="leading-relaxed text-zinc-400">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* Team */}
      <Section>
        <Container>
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-semibold text-zinc-100">
              Meet Our Team
            </h2>
            <p className="mx-auto max-w-2xl text-zinc-400">
              The passionate individuals behind Fund Ideas
            </p>
          </div>

          <Grid cols={3} gap="lg">
            {team.map((member, index) => (
              <Card
                key={member.name}
                variant="glass"
                className="animate-element text-center"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-6">
                  <div className="mb-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="mx-auto h-24 w-24 rounded-full object-cover"
                    />
                  </div>
                  <h3 className="mb-1 text-lg font-semibold text-zinc-100">
                    {member.name}
                  </h3>
                  <p className="mb-3 text-sm text-violet-400">{member.role}</p>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section background="subtle">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <Icon container size="xl" variant="violet" className="mx-auto mb-6">
              <Lightbulb className="h-8 w-8" />
            </Icon>
            <h2 className="mb-6 text-3xl font-semibold text-zinc-100">
              Ready to Join Our Mission?
            </h2>
            <p className="mb-8 text-xl text-zinc-400">
              Whether you're a creator with a groundbreaking idea or a backer
              looking to support innovation, we'd love to have you join our
              community.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button variant="primary" size="lg">
                Start Your Project
              </Button>
              <Button variant="glass" size="lg">
                Explore Projects
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </Layout>
  );
}
