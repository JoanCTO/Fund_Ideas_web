"use client";

import { useEffect, useState } from "react";
import { PulsingBorder } from "@paper-design/shaders-react";
import { motion } from "framer-motion";

export default function PulsingCircle() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fallback for server-side rendering
  if (!isClient) {
    return (
      <div className="absolute right-8 bottom-8 z-30">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="h-15 w-15 animate-pulse rounded-full border-2 border-violet-500/50 bg-violet-500/10" />
        </div>
      </div>
    );
  }
  return (
    <div className="absolute right-8 bottom-8 z-30">
      <div className="relative flex h-20 w-20 items-center justify-center">
        {/* Pulsing Border Circle */}
        <PulsingBorder
          colors={[
            "#BEECFF",
            "#E77EDC",
            "#FF4C3E",
            "#00FF88",
            "#FFD700",
            "#FF6B35",
            "#8A2BE2",
          ]}
          colorBack="#00000000"
          speed={1.5}
          roundness={1}
          thickness={0.1}
          softness={0.2}
          intensity={5}
          spotsPerColor={5}
          spotSize={0.1}
          pulse={0.1}
          smoke={0.5}
          smokeSize={4}
          scale={0.65}
          rotation={0}
          frame={9161408.251009725}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
          }}
        />

        {/* Rotating Text Around the Pulsing Border */}
        <motion.svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          animate={{ rotate: 360 }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          style={{ transform: "scale(1.6)" }}
        >
          <defs>
            <path
              id="circle"
              d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
            />
          </defs>
          <text className="fill-white/80 text-sm font-light">
            <textPath href="#circle" startOffset="0%">
              Fund Ideas • Fund Ideas • Fund Ideas • Fund Ideas •
            </textPath>
          </text>
        </motion.svg>
      </div>
    </div>
  );
}
