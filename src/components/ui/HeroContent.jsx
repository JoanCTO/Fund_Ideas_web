"use client";

import { Button } from "./Button";
import { Badge } from "./Badge";
import { ArrowRight, Play, Star } from "lucide-react";

export default function HeroContent() {
  return (
    <main className="absolute bottom-8 left-8 z-20 max-w-lg">
      <div className="text-left">
        {/* Badge */}
        <div
          className="animate-element glass relative mb-4 inline-flex items-center rounded-full px-3 py-1"
          style={{
            filter: "url(#glass-effect)",
          }}
        >
          <div className="absolute top-0 right-1 left-1 h-px rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <span className="relative z-10 text-xs font-light text-white/90">
            ✨ New Technical Innovation Platform
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="animate-element animate-delay-100 mb-4 text-5xl font-light tracking-tight text-white md:text-6xl md:leading-16">
          <span className="font-medium">Fund the Future of</span>
          <br />
          <span className="font-light tracking-tight text-violet-400">
            Technical Innovation
          </span>
        </h1>

        {/* Description */}
        <p className="animate-element animate-delay-200 mb-4 text-xs leading-relaxed font-light text-white/70">
          Connect with visionary creators, back groundbreaking projects, and be
          part of the next generation of technological breakthroughs.
        </p>

        {/* Buttons */}
        <div className="animate-element animate-delay-300 flex flex-wrap items-center gap-4">
          <Button
            variant="glass"
            size="lg"
            className="rounded-full border border-white/30 bg-transparent px-8 py-3 text-xs font-normal text-white transition-all duration-200 hover:border-white/50 hover:bg-white/10"
          >
            <Play className="mr-2 h-4 w-4" />
            Watch Demo
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="group rounded-full bg-white px-8 py-3 text-xs font-normal text-black transition-all duration-200 hover:bg-zinc-100"
          >
            Start Your Project
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </main>
  );
}
