"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type ThemeMode = "mono" | "colorful";

interface ThemeContextValue {
  theme: ThemeMode;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: "mono", toggle: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("mono");

  useEffect(() => {
    const saved = localStorage.getItem("pf-theme");
    if (saved === "colorful") setTheme("colorful");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("theme-colorful", theme === "colorful");
    localStorage.setItem("pf-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle: () => setTheme((t) => (t === "mono" ? "colorful" : "mono")) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

export function greyHex(color: string): string {
  if (!color || !color.startsWith("#")) return color;
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return color;
  const l = Math.max(40, Math.min(245, Math.round(0.299 * r + 0.587 * g + 0.114 * b)));
  const h = l.toString(16).padStart(2, "0");
  return `#${h}${h}${h}`;
}

export function useThemedAccent() {
  const { theme } = useTheme();
  return (color: string) => (theme === "colorful" ? color : greyHex(color));
}
