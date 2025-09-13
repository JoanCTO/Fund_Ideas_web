"use client";

import { useEffect, useRef, useState } from "react";
import { MeshGradient } from "@paper-design/shaders-react";

export default function ShaderBackground({ children }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  const containerRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseEnter = () => setIsActive(true);
    const handleMouseLeave = () => setIsActive(false);
    const handleMouseMove = (e) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
      container.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      if (container) {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
        container.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  // Fallback for server-side rendering
  if (!isClient) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-zinc-950">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-violet-900/20 to-zinc-900" />
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      {/* SVG Filters for Technical Glass Effects */}
      <svg className="absolute inset-0 h-0 w-0">
        <defs>
          {/* Enhanced Glass Effect with Technical Patterns */}
          <filter
            id="glass-effect"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feTurbulence
              baseFrequency="0.008"
              numOctaves="2"
              result="noise"
              type="fractalNoise"
            />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.4" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.03
                      0 1 0 0 0.02
                      0 0 1 0 0.08
                      0 0 0 0.85 0"
              result="tint"
            />
          </filter>

          {/* Technical Circuit Glow Effect */}
          <filter
            id="circuit-glow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feTurbulence
              baseFrequency="0.012"
              numOctaves="1"
              result="circuit"
              type="turbulence"
            />
            <feColorMatrix
              in="circuit"
              type="matrix"
              values="0 0 0 0 0.5
                      0 0 0 0 0.3
                      0 0 0 0 1
                      0 0 0 0.6 0"
              result="violet-glow"
            />
            <feGaussianBlur in="violet-glow" stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="screen" />
          </filter>

          {/* Innovation Pulse Effect */}
          <filter
            id="innovation-pulse"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="0 0 0 0 0.2
                      0 0 0 0 0.8
                      0 0 0 0 0.3
                      0 0 0 15 -8"
              result="pulse"
            />
            <feComposite in="SourceGraphic" in2="pulse" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Dark Overlay for Better Text Contrast */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Primary Background Shader - Fund Ideas Brand Colors */}
      <MeshGradient
        className="absolute inset-0 h-full w-full transition-all duration-1000 ease-out"
        colors={[
          "#0a0a0a", // zinc-950 (your app background)
          "#8b5cf6", // violet-500 (primary brand)
          "#a855f7", // violet-600 (accent)
          "#1e1b4b", // violet-900 (deep purple)
          "#ffffff", // white highlights
          "#10b981", // emerald-500 (success/innovation)
        ]}
        speed={0.3}
        backgroundColor="#0a0a0a"
        scale={1.02}
        rotation={mousePosition.x * 3}
      />

      {/* Secondary Layer - Technical Circuit Pattern */}
      <MeshGradient
        className="absolute inset-0 h-full w-full opacity-30 transition-all duration-1000 ease-out"
        colors={[
          "#000000",
          "#8b5cf6",
          "#06b6d4", // cyan-500 (tech/innovation)
          "#000000",
        ]}
        speed={0.4}
        wireframe="true"
        backgroundColor="transparent"
        scale={0.98}
        rotation={mousePosition.y * -2}
      />

      {/* Accent Layer - Innovation Glow (Mouse Responsive) */}
      <MeshGradient
        className="absolute inset-0 h-full w-full opacity-20 transition-all duration-1000 ease-out"
        colors={[
          "#8b5cf6", // violet
          "#10b981", // emerald (innovation)
          "#f59e0b", // amber (creativity)
          "#8b5cf6",
        ]}
        speed={0.2}
        backgroundColor="transparent"
        scale={1.05}
        rotation={mousePosition.x * 1.5 + mousePosition.y * 1.5}
      />

      {/* Dynamic Innovation Pulse Layer */}
      <MeshGradient
        className="absolute inset-0 h-full w-full opacity-10 transition-all duration-1000 ease-out"
        colors={[
          "#10b981", // emerald
          "#8b5cf6", // violet
          "#06b6d4", // cyan
          "#f59e0b", // amber
        ]}
        speed={0.3}
        backgroundColor="transparent"
        scale={1.08}
        rotation={mousePosition.y * 2.5}
      />

      {/* Subtle Gradient Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

      {/* Mouse Position Indicator (Subtle Glow) */}
      <div
        className="pointer-events-none absolute opacity-20"
        style={{
          left: `${mousePosition.x * 100}%`,
          top: `${mousePosition.y * 100}%`,
          transform: "translate(-50%, -50%)",
          width: "200px",
          height: "200px",
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(20px)",
          transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
