"use client";

import { useThemedAccent } from "@/lib/theme";

export function AuroraBackdrop() {
  const accent = useThemedAccent();
  const c1 = accent("#1dc8e6");
  const c2 = accent("#8b5cf6");
  const c3 = accent("#f472b6");

  return (
    <div aria-hidden className="aurora-bg">
      <div
        className="aurora-blob aurora-blob-1"
        style={{
          width: "48rem",
          height: "48rem",
          top: "-18%",
          left: "-12%",
          background: `radial-gradient(circle at 50% 50%, ${c1}30, transparent 65%)`,
        }}
      />
      <div
        className="aurora-blob aurora-blob-2"
        style={{
          width: "56rem",
          height: "56rem",
          top: "28%",
          right: "-20%",
          background: `radial-gradient(circle at 50% 50%, ${c2}2e, transparent 65%)`,
        }}
      />
      <div
        className="aurora-blob aurora-blob-3"
        style={{
          width: "44rem",
          height: "44rem",
          bottom: "-14%",
          left: "22%",
          background: `radial-gradient(circle at 50% 50%, ${c3}26, transparent 65%)`,
        }}
      />
    </div>
  );
}