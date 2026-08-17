"use client";

import { useState, useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { CustomCursor } from "@/components/core/CustomCursor";
import { ScrollProgress } from "@/components/core/ScrollProgress";
import { Preloader } from "@/components/core/Preloader";
import { Navbar } from "@/components/core/Navbar";
import { Footer } from "@/components/core/Footer";
import ExperienceSceneLoader from "@/components/three/ExperienceSceneLoader";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Achievements } from "@/components/sections/Achievements";
import { GitHubSection } from "@/components/sections/GitHubSection";
import { Certificates } from "@/components/sections/Certificates";
import { Timeline } from "@/components/sections/Timeline";
import { Contact } from "@/components/sections/Contact";
import { AIChat } from "@/components/ai/AIChat";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

export function HomeContent() {
  const [booted, setBooted] = useState(false);
  useSmoothScroll(true);

  useEffect(() => {
    // scroll lock while preloader is visible
    document.body.style.overflow = booted ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [booted]);

  return (
    <MotionConfig reducedMotion="user">
      <CustomCursor />
      <ScrollProgress />
      <ExperienceSceneLoader />
      <Preloader onComplete={() => setBooted(true)} />

      <Navbar active={booted} />

      <main className="relative z-10">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Achievements />
        <GitHubSection />
        <Certificates />
        <Timeline />
        <Contact />
      </main>

      <div className="relative z-10">
        <Footer />
      </div>

      <AIChat />
    </MotionConfig>
  );
}