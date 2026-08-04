"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PROFILE } from "@/lib/data/profile";
import { viewportOnce } from "@/lib/animations";
import { useThemedAccent } from "@/lib/theme";
import { FaGithub, FaStar, FaCodeBranch, FaUsers, FaBoxOpen, FaArrowUpRightFromSquare } from "react-icons/fa6";
import { SiJavascript, SiTypescript, SiPython, SiHtml5, SiCss } from "react-icons/si";
import { cn } from "@/lib/utils";

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
}

interface UserData {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  followers: number;
  public_repos: number;
  html_url: string;
}

const LANG_ICONS: Record<string, React.FC<{ className?: string; style?: React.CSSProperties }>> = {
  JavaScript: SiJavascript,
  TypeScript: SiTypescript,
  Python: SiPython,
  HTML: SiHtml5,
  CSS: SiCss,
};

const LANG_COLORS: Record<string, string> = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3776ab",
  HTML: "#e34f26",
  CSS: "#1572b6",
};

async function githubFetch<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  return res.json();
}

function Heatmap({ days }: { days: { date: Date; count: number }[] }) {
  const weeks: { date: Date; count: number }[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  const max = Math.max(1, ...days.map((d) => d.count));

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-[3px]">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-[3px]">
            {week.map((day, di) => (
              <div
                key={di}
                title={`${day.date.toDateString()} · ${day.count} events`}
                className="h-[11px] w-[11px] rounded-[3px] transition-transform hover:scale-125"
                style={{
                  background:
                    day.count === 0 ? "rgba(255,255,255,0.06)" : `rgba(var(--glow-teal-rgb),${0.2 + (day.count / max) * 0.8})`,
                  boxShadow: day.count > 0 ? "0 0 6px rgba(var(--glow-teal-rgb),0.35)" : undefined,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <div className="h-64 animate-pulse rounded-3xl bg-white/5" />
      </div>
      <div className="lg:col-span-8">
        <div className="h-64 animate-pulse rounded-3xl bg-white/5" />
      </div>
    </div>
  );
}

export function GitHubSection() {
  const themed = useThemedAccent();
  const username = PROFILE.github;

  const userQ = useQuery({
    queryKey: ["gh-user", username],
    queryFn: () => githubFetch<UserData>(`/users/${username}`),
    enabled: !!username,
    staleTime: 1000 * 60 * 15,
  });

  const reposQ = useQuery({
    queryKey: ["gh-repos", username],
    queryFn: () =>
      githubFetch<Repo[]>(
        `/users/${username}/repos?sort=updated&per_page=100&page=1`,
      ),
    enabled: !!username,
    staleTime: 1000 * 60 * 15,
  });

  const eventsQ = useQuery({
    queryKey: ["gh-events", username],
    queryFn: () => githubFetch<{ created_at: string }[]>(`/users/${username}/events/public?per_page=100`),
    enabled: !!username,
    staleTime: 1000 * 60 * 15,
  });

  if (!username) {
    return (
      <section id="github" className="relative py-28 md:py-40">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeading index="10" kicker="live systems" title="GitHub," gradientWord="in real time." />
          <div className="rounded-3xl glass p-10 text-center">
            <FaGithub className="mx-auto text-5xl text-slate-600" />
            <p className="mt-5 text-slate-400">
              Add <code className="rounded bg-white/10 px-2 py-0.5 font-mono text-aurora-cyan">NEXT_PUBLIC_GITHUB_USERNAME</code> to{" "}
              <code className="rounded bg-white/10 px-2 py-0.5 font-mono text-aurora-cyan">.env.local</code> and this section streams live data from the GitHub API.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const loading = userQ.isLoading || reposQ.isLoading;
  const user = userQ.data;
  const repos = reposQ.data ?? [];
  const events = eventsQ.data ?? [];

  const starTotal = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const topRepos = [...repos].sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6);

  const langMap = new Map<string, number>();
  repos.forEach((r) => {
    if (r.language) langMap.set(r.language, (langMap.get(r.language) ?? 0) + 1);
  });
  const langTotals = [...langMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 7);
  const maxLang = langTotals[0]?.[1] ?? 1;

  // activity → last 20 weeks of days
  const days: { date: Date; count: number }[] = [];
  const now = new Date();
  for (let i = 139; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    days.push({ date: d, count: 0 });
  }
  events.forEach((e) => {
    const d = new Date(e.created_at);
    const day = days.find((x) => x.date.toDateString() === d.toDateString());
    if (day) day.count += 1;
  });

  const statCards = [
    { icon: FaStar, label: "Stars earned", value: starTotal, accent: "#fbbf24" },
    { icon: FaCodeBranch, label: "Repositories", value: repos.length || user?.public_repos || 0, accent: "#22d3ee" },
    { icon: FaUsers, label: "Followers", value: user?.followers ?? 0, accent: "#a78bfa" },
    { icon: FaBoxOpen, label: "Total repos", value: user?.public_repos ?? 0, accent: "#34f5c5" },
  ];

  return (
    <section id="github" className="relative overflow-hidden py-28 md:py-40">
      <div aria-hidden className="pointer-events-none absolute right-0 top-24 h-96 w-96 rounded-full bg-aurora-violet/8 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeading
          index="07"
          kicker="live systems"
          title="GitHub,"
          gradientWord="in real time."
          subtitle={`Streaming live from ${username} via the GitHub API — no snapshots, no screenshots.`}
        />

        {loading ? (
          <Skeleton />
        ) : (
          <div className="grid gap-6 lg:grid-cols-12">
            {/* profile card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportOnce}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-4"
            >
              <div className="group relative h-full overflow-hidden rounded-3xl glass-strong p-8">
                <div aria-hidden className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-aurora-cyan/15 blur-[80px]" />
                <div className="relative flex flex-col items-center text-center">
                  <div className="relative">
                    <div aria-hidden className="absolute -inset-2 rounded-full animate-pulse-glow bg-aurora-cyan/30 blur-lg" />
                    {user?.avatar_url ? (
                      <Image
                        src={user.avatar_url}
                        alt={user?.name ?? username}
                        width={96}
                        height={96}
                        className="relative rounded-full border-2 border-aurora-cyan/50"
                        unoptimized
                      />
                    ) : (
                      <div className="relative flex h-24 w-24 items-center justify-center rounded-full glass text-4xl">
                        <FaGithub />
                      </div>
                    )}
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-bold text-foreground">
                    {user?.name ?? username}
                  </h3>
                  <p className="font-mono text-xs text-aurora-cyan/70">@{username}</p>
                  {user?.bio && <p className="mt-4 text-sm leading-relaxed text-slate-400">{user.bio}</p>}
                  {user?.location && (
                    <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-slate-500">
                      📍 {user.location}
                    </p>
                  )}
                  <a
                    href={user?.html_url ?? `https://github.com/${username}`}
                    target="_blank" rel="noreferrer" data-cursor
                    className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-void transition-transform hover:scale-105"
                    style={{ background: `linear-gradient(120deg, ${themed("#22d3ee")}, ${themed("#8b5cf6")})`, boxShadow: "0 0 30px -8px rgba(var(--glow-w),0.8)" }}
                  >
                    <FaGithub /> Visit profile <FaArrowUpRightFromSquare className="text-[10px]" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* activity + languages */}
            <div className="flex flex-col gap-6 lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportOnce}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="rounded-3xl glass-strong p-7"
              >
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
                    Public activity · last 20 weeks
                  </p>
                  <span className="flex gap-1.5">
                    <span className="h-2 w-2 rounded-sm bg-white/10" />
                    <span className="h-2 w-2 rounded-sm bg-neon/40" />
                    <span className="h-2 w-2 rounded-sm bg-neon/80" />
                    <span className="h-2 w-2 rounded-sm bg-neon" />
                  </span>
                </div>
                <div className="mt-5">
                  <Heatmap days={days} />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportOnce}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
                className="rounded-3xl glass-strong p-7"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">Language distribution</p>
                <div className="mt-5 space-y-3">
                  {langTotals.map(([lang, count]) => {
                    const Icon = LANG_ICONS[lang];
                    return (
                      <div key={lang} className="group flex items-center gap-3">
                        <span className="w-28 shrink-0 truncate font-mono text-xs uppercase tracking-wider text-slate-400">
                          {Icon ? <Icon className="mr-1.5 inline text-sm" style={{ color: themed(LANG_COLORS[lang]) ?? "#94a3b8" }} /> : null}
                          {lang}
                        </span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                          <motion.div
                            initial={{ width: "0%" }}
                            whileInView={{ width: `${(count / maxLang) * 100}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full rounded-full"
                            style={{ background: themed(LANG_COLORS[lang]) ?? "#a1a1aa", boxShadow: `0 0 10px ${themed(LANG_COLORS[lang]) ?? "#a1a1aa"}88` }}
                          />
                        </div>
                        <span className="w-8 text-right font-mono text-xs tabular-nums text-slate-500">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* stat strip */}
        {!loading && (
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {statCards.map(({ icon: Icon, label, value, accent }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportOnce}
                transition={{ delay: i * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl glass p-5 transition-colors hover:border-white/20"
              >
                <div className="flex items-center justify-between">
                  <Icon className="text-lg" style={{ color: themed(accent) }} />
                  <span className="font-display text-2xl font-bold tabular-nums" style={{ color: themed(accent) }}>
                    {value.toLocaleString()}
                  </span>
                </div>
                <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-slate-500">{label}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* top repos */}
        {!loading && topRepos.length > 0 && (
          <div className="mt-12">
            <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.3em] text-slate-500">
              Top repositories
            </p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {topRepos.map((repo, i) => {
                const Icon = repo.language ? LANG_ICONS[repo.language] : FaBoxOpen;
                return (
                  <motion.a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank" rel="noreferrer" data-cursor
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={viewportOnce}
                    transition={{ delay: i * 0.07, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="group rounded-2xl glass p-6 transition-all duration-500 hover:-translate-y-1 hover:border-aurora-cyan/40 hover:shadow-[0_0_30px_-12px_rgba(var(--glow-w),0.7)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-display font-bold text-foreground group-hover:text-aurora-cyan">
                          {repo.name}
                        </p>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
                          {repo.description ?? "No description provided"}
                        </p>
                      </div>
                      <FaArrowUpRightFromSquare className="mt-1 shrink-0 text-xs text-slate-600 transition-colors group-hover:text-aurora-cyan" />
                    </div>
                    <div className="mt-5 flex items-center gap-4 font-mono text-[11px] text-slate-500">
                      {repo.language && (
                        <span className={cn("flex items-center gap-1.5")}>
                          {Icon ? <Icon style={{ color: themed(LANG_COLORS[repo.language]) ?? "#94a3b8" }} /> : null}
                          {repo.language}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <FaStar className="text-amber-400/80" /> {repo.stargazers_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaCodeBranch /> {repo.forks_count}
                      </span>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}