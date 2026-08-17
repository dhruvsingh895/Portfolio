"use client";

export function SectionDivider() {
  return (
    <div aria-hidden className="relative mx-auto flex max-w-5xl items-center gap-6 px-4">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-aurora-cyan/30 to-aurora-violet/40" />
      <span className="relative flex h-10 w-10 items-center justify-center">
        <span className="absolute inset-0 animate-spin-slow rounded-full border border-dashed border-aurora-cyan/40" />
        <span className="h-1.5 w-1.5 rounded-full bg-aurora-cyan shadow-[0_0_12px_rgba(var(--glow-w),0.9)]" />
      </span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-aurora-violet/40 to-aurora-cyan/30" />
    </div>
  );
}