"use client";

import ShaderBackground from "@/components/ui/ShaderBackground";
import ShaderHeader from "@/components/ui/ShaderHeader";
import HeroContent from "@/components/ui/HeroContent";
import PulsingCircle from "@/components/ui/PulsingCircle";

export default function TestShaderPage() {
  return (
    <ShaderBackground>
      <ShaderHeader />
      <HeroContent />
      <PulsingCircle />
    </ShaderBackground>
  );
}
