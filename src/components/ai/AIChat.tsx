"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { AI_KNOWLEDGE, AI_CHAT_STARTERS, AI_THINKING_LINES } from "@/lib/data/ai-knowledge";
import { FaXmark, FaPaperPlane, FaRobot } from "react-icons/fa6";

interface Message {
  id: number;
  from: "user" | "ai";
  text: string;
}

let idCounter = 0;

function findAnswer(input: string): string {
  const q = input.toLowerCase();
  let best: string | null = null;
  let bestScore = 0;
  for (const entry of AI_KNOWLEDGE) {
    let score = 0;
    for (const k of entry.keywords) {
      if (q.includes(k)) score += k.length > 4 ? 2 : 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry.answer;
    }
  }
  return best ?? AI_KNOWLEDGE[AI_KNOWLEDGE.length - 1].answer;
}

export function AIChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [thinkLine, setThinkLine] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: idCounter++,
          from: "ai",
          text: "Hey, I'm Aurora — Dhruv's AI concierge. Ask me about his resume, projects, skills, experience or how to reach him.",
        },
      ]);
    }
  }, [messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking, thinkLine]);

  const send = (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || thinking) return;
    setInput("");
    setMessages((m) => [...m, { id: idCounter++, from: "user", text }]);
    setThinking(true);
    setThinkLine(0);
    let line = 0;
    const lineTimer = setInterval(() => {
      line = (line + 1) % AI_THINKING_LINES.length;
      setThinkLine(line);
    }, 460);
    setTimeout(() => {
      clearInterval(lineTimer);
      setThinking(false);
      const reply = findAnswer(text);
      setMessages((m) => [...m, { id: idCounter++, from: "ai", text: reply }]);
    }, 1600 + Math.random() * 900);
  };

  return (
    <>
      {/* Flying orb */}
      <motion.button
        initial={{ scale: 0, rotate: -40 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1.4, type: "spring", stiffness: 220, damping: 16 }}
        onClick={() => setOpen((o) => !o)}
        aria-label="Chat with AI assistant"
        data-cursor
        data-cursor-label={open ? "Close" : "Ask Aurora"}
        className="group fixed bottom-5 right-5 z-[65] flex h-14 w-14 items-center justify-center md:bottom-8 md:right-8"
      >
        <span aria-hidden className="absolute -inset-2 rounded-full bg-aurora-violet/30 blur-xl animate-pulse-glow" />
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            aria-hidden
            className="absolute inset-0 rounded-full border border-aurora-cyan/30"
            style={{ animation: `orbit 4s linear infinite`, animationDelay: `${i * 1.3}s` }}
          >
            <span className="absolute -top-0.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-aurora-cyan shadow-[0_0_8px_#fafafa]" />
          </span>
        ))}
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-aurora-cyan via-aurora-violet to-aurora-magenta shadow-[0_0_40px_-6px_rgba(var(--glow-g),0.9)] transition-transform duration-500 group-hover:scale-110">
          {open ? <FaXmark className="text-xl" /> : <FaRobot className="text-xl text-void" />}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95, filter: "blur(12px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 30, scale: 0.95, filter: "blur(10px)" }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
            className="fixed bottom-24 right-4 z-[66] flex h-[min(560px,70vh)] w-[min(92vw,380px)] flex-col overflow-hidden rounded-3xl glass-strong shadow-[0_40px_90px_-20px_rgba(0,0,0,0.9)] md:right-8"
          >
            {/* header */}
            <div className="relative flex items-center gap-3 border-b border-white/5 px-5 py-4">
              <div className="relative">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-aurora-cyan to-aurora-violet text-void">
                  <FaRobot />
                </span>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-abyss bg-neon" />
              </div>
              <div>
                <p className="font-display text-sm font-bold text-foreground">Aurora</p>
                <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-neon/90">
                  <motion.span animate={reduce ? { opacity: 1 } : { opacity: [1, 0.4, 1] }} transition={reduce ? { duration: 0 } : { duration: 1.6, repeat: Infinity }}>●</motion.span>
                  online · local knowledge
                </p>
              </div>
            </div>

            {/* messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              <AnimatePresence initial={false}>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        m.from === "user"
                          ? "rounded-br-md bg-gradient-to-br from-aurora-violet/90 to-aurora-magenta/90 text-white"
                          : "rounded-bl-md border border-white/10 bg-white/[0.04] text-slate-300"
                      }`}
                    >
                      {m.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {thinking && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <span className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            className="h-1.5 w-1.5 rounded-full bg-aurora-cyan"
                            animate={reduce ? { opacity: 0.7 } : { opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                            transition={reduce ? { duration: 0 } : { duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </span>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={thinkLine}
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -4 }}
                          className="font-mono text-[10px] uppercase tracking-widest text-slate-500"
                        >
                          {AI_THINKING_LINES[thinkLine]}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              )}

              {messages.length <= 1 && !thinking && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {AI_CHAT_STARTERS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      data-cursor
                      className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-400 transition-all duration-300 hover:border-aurora-cyan/60 hover:bg-aurora-cyan/5 hover:text-aurora-cyan hover:shadow-[0_0_16px_-8px_rgba(var(--glow-w),0.6)] active:scale-95"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* input */}
            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="flex items-center gap-2 border-t border-white/5 px-4 py-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Aurora about Dhruv…"
                aria-label="Ask a question"
                className="flex-1 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-foreground placeholder:text-slate-600 focus:border-aurora-cyan/50 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Send"
                disabled={!input.trim() || thinking}
                data-cursor
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-aurora-cyan to-aurora-violet text-void ring-1 ring-white/20 shadow-[0_0_20px_-6px_rgba(var(--glow-w),0.6)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_-6px_rgba(var(--glow-g),0.8)] active:scale-95 disabled:opacity-40"
              >
                <FaPaperPlane />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}