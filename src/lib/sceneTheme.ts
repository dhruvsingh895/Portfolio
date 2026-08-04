import { useMemo } from "react";
import { useTheme } from "@/lib/theme";

export interface ScenePalette {
  sun: string;
  corona: string;
  corona2: string;
  flare: string;
  atmosphere: string;
  atmosphere2: string;
  earthSpecular: string;
  marker: string;
  orbit: string;
  ringColors: string[];
  asteroid: string;
  starPoints: string;
  constellation: string;
  lightWarm: string;
  lightViolet: string;
  flightRings: string[];
}

export const SCENE_MONO: ScenePalette = {
  sun: "#ffffff",
  corona: "#ffffff",
  corona2: "#a1a1aa",
  flare: "#ffffff",
  atmosphere: "#d4d4d8",
  atmosphere2: "#71717a",
  earthSpecular: "#4a4a52",
  marker: "#fafafa",
  orbit: "#d4d4d8",
  ringColors: ["#b8b8b8", "#e4e4e4", "#c4c4c4", "#a1a1a1"],
  asteroid: "#8f8f8f",
  starPoints: "#e4e4e8",
  constellation: "#9a9aa3",
  lightWarm: "#ffffff",
  lightViolet: "#a1a1aa",
  flightRings: ["#f4f4f5", "#a1a1aa", "#e4e4e7", "#ececef"],
};

export const SCENE_COLORFUL: ScenePalette = {
  sun: "#ffd28a",
  corona: "#ff9d3b",
  corona2: "#7c3aed",
  flare: "#ffd28a",
  atmosphere: "#1e90ff",
  atmosphere2: "#8b5cf6",
  earthSpecular: "#223a55",
  marker: "#34f5c5",
  orbit: "#7dd3fc",
  ringColors: ["#c9b18f", "#eeddbb", "#d7c4a1", "#b9a27d"],
  asteroid: "#8f8170",
  starPoints: "#8f9be8",
  constellation: "#5757d9",
  lightWarm: "#ffb35c",
  lightViolet: "#8b5cf6",
  flightRings: ["#22d3ee", "#a78bfa", "#f472b6", "#34f5c5"],
};

export function useScenePalette(): ScenePalette {
  const { theme } = useTheme();
  return useMemo(() => (theme === "colorful" ? SCENE_COLORFUL : SCENE_MONO), [theme]);
}
