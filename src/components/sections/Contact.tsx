"use client";

import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { PROFILE } from "@/lib/data/profile";
import { viewportOnce } from "@/lib/animations";
import { useThemedAccent } from "@/lib/theme";
import { FiSend, FiMail, FiGithub, FiLinkedin } from "react-icons/fi";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_p4gji6s";
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_b4y761l";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "LHD8aDiCG1-JKyTNJ";

type Status = "idle" | "flying" | "sent" | "error";

export function Contact() {
  const accent = useThemedAccent();
  const [status, setStatus] = useState<Status>("idle");
  const [fly, setFly] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const configured = SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!configured) {
      window.location.href = `mailto:${PROFILE.email}?subject=${encodeURIComponent(form.subject || "Hello Dhruv")}&body=${encodeURIComponent(form.message)}`;
      setStatus("sent");
      return;
    }
    setFly(true);
    setStatus("flying");
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, { ...form, to_name: PROFILE.name }, { publicKey: PUBLIC_KEY });
      setFly(false);
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setFly(false);
      setStatus("error");
    }
  };

  const field =
    "w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3.5 text-sm text-foreground placeholder:text-slate-600 backdrop-blur-sm transition-colors focus:border-aurora-cyan/60 focus:outline-none";

  return (
    <section id="contact" className="relative overflow-hidden py-28 md:py-40">
      <div aria-hidden className="absolute inset-0 grid-bg opacity-20" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-24 h-96 w-[70vw] -translate-x-1/2 rounded-full bg-aurora-violet/10 blur-[150px]" />
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-8 h-80 w-80 rounded-full bg-aurora-cyan/8 blur-[130px]" />

      <div className="relative mx-auto max-w-4xl px-4 md:px-8">
        <SectionHeading
          index="10"
          kicker="transmission"
          title="Let's build something"
          gradientWord="intelligent."
          align="center"
          subtitle="Open to AI engineering roles, freelance and collaborations. The form reaches Dhruv's inbox instantly."
        />

        <div className="relative">
          {/* floating particles around the form */}
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              aria-hidden
              className="pointer-events-none absolute hidden h-1 w-1 rounded-full md:block"
              style={{
                background: i % 2 ? accent("#22d3ee") : accent("#a78bfa"),
                boxShadow: `0 0 8px ${i % 2 ? accent("#22d3ee") : accent("#a78bfa")}`,
                left: `${(i * 13) % 90 + 5}%`,
                top: `${(i * 29) % 85 + 8}%`,
                animation: `float-slow ${5 + (i % 4)}s ease-in-out infinite`,
                animationDelay: `${i * 0.7}s`,
              }}
            />
          ))}

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-3xl glass-strong p-7 md:p-12"
          >
            <div aria-hidden className="absolute inset-x-0 top-0 h-px shimmer-line opacity-40" />

            <form onSubmit={onSubmit} className="relative space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500" htmlFor="c-name">
                    Name
                  </label>
                  <input id="c-name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Ada Lovelace" className={field} />
                </div>
                <div>
                  <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500" htmlFor="c-email">
                    Email
                  </label>
                  <input id="c-email" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@company.dev" className={field} />
                </div>
              </div>
              <div>
                <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500" htmlFor="c-subject">
                  Subject
                </label>
                <input id="c-subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="AI Engineer opportunity" className={field} />
              </div>
              <div>
                <label className="mb-2 block font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500" htmlFor="c-msg">
                  Message
                </label>
                <textarea id="c-msg" required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell me about what you're building…" className={`${field} resize-none`} />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
                <div className="flex gap-3">
                  <a href={PROFILE.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" data-cursor className="flex h-10 w-10 items-center justify-center rounded-full glass ring-1 ring-white/5 text-slate-400 transition-all duration-300 hover:border-aurora-cyan/60 hover:text-aurora-cyan hover:shadow-[0_0_22px_-8px_rgba(var(--glow-w),0.65)]">
                    <FiGithub />
                  </a>
                  <a href={PROFILE.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" data-cursor className="flex h-10 w-10 items-center justify-center rounded-full glass ring-1 ring-white/5 text-slate-400 transition-all duration-300 hover:border-aurora-cyan/60 hover:text-aurora-cyan hover:shadow-[0_0_22px_-8px_rgba(var(--glow-w),0.65)]">
                    <FiLinkedin />
                  </a>
                  <a href={`mailto:${PROFILE.email}`} aria-label="Email" data-cursor className="flex h-10 w-10 items-center justify-center rounded-full glass ring-1 ring-white/5 text-slate-400 transition-all duration-300 hover:border-aurora-cyan/60 hover:text-aurora-cyan hover:shadow-[0_0_22px_-8px_rgba(var(--glow-w),0.65)]">
                    <FiMail />
                  </a>
                </div>

                <div className="relative">
                  <MagneticButton type="submit" variant="primary" size="lg" disabled={status === "flying"}>
                    {status === "flying" ? "Transmitting…" : "Send message"}
                    <FiSend className={`transition-transform duration-700 ${fly ? "translate-x-1 -translate-y-1 rotate-45" : ""}`} />
                  </MagneticButton>
                </div>
              </div>
            </form>
          </motion.div>
        </div>

        <AnimatePresence>
          {(status === "sent" || status === "error") && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 overflow-hidden rounded-3xl glass-strong p-8 text-center"
            >
              {status === "sent" ? (
                <>
                  <motion.div
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-aurora-cyan to-aurora-violet text-2xl text-void"
                  >
                    ✓
                  </motion.div>
                  <h3 className="mt-5 font-display text-2xl font-bold text-gradient-aurora">Message transmitted</h3>
                  <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
                    Thanks for reaching out — Dhruv usually replies within 24 hours. Your transmission is now in the inbox.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="font-display text-2xl font-bold text-aurora-magenta">Transmission failed</h3>
                  <p className="mx-auto mt-3 max-w-md text-sm text-slate-400">
                    Something broke en route. Email Dhruv directly at{" "}
                    <a href={`mailto:${PROFILE.email}`} className="text-aurora-cyan underline underline-offset-4">{PROFILE.email}</a>.
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}