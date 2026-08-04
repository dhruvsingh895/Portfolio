"use client";

import dynamic from "next/dynamic";

const ExperienceScene = dynamic(() => import("./ExperienceScene"), {
  ssr: false,
  loading: () => null,
});

export default function ExperienceSceneLoader() {
  return <ExperienceScene />;
}