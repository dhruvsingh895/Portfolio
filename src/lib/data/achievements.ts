export interface Achievement {
  value: number;
  suffix: string;
  label: string;
  platform: string;
  accent: string;
  note: string;
  decimals?: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    value: 750,
    suffix: "+",
    label: "Problems Solved",
    platform: "LeetCode",
    accent: "#fbbf24",
    note: "DSA mastery across arrays, graphs, DP and system-level thinking.",
  },
  {
    value: 150,
    suffix: "+",
    label: "Problems Solved",
    platform: "GeeksforGeeks",
    accent: "#34f5c5",
    note: "Consistent problem-solving practice on one of the largest DSA platforms.",
  },
  {
    value: 5,
    suffix: "★",
    label: "Problem Solving",
    platform: "HackerRank",
    accent: "#22d3ee",
    note: "Top rating on HackerRank problem-solving challenges.",
  },
];

export const STATS_MARQUEE = [
  "750+ LeetCode",
  "150+ GFG",
  "5★ HackerRank",
  "8.07 CGPA",
  "342ms Latency",
  "5,000 User Simulation",
  "YOLOv8",
  "Gemini AI",
] as const;

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  org: string;
  description: string;
  accent: string;
}

export const TIMELINE: TimelineEvent[] = [
  {
    id: "foundation",
    year: "2019",
    title: "The Foundation",
    org: "Class X · 92.5%",
    description:
      "First contact with programming during high school — curiosity sparked, and the path to engineering was set.",
    accent: "#22d3ee",
  },
  {
    id: "spark",
    year: "2022",
    title: "The Spark",
    org: "B.Tech AI & ML · AKTU",
    description:
      "Walked into engineering with one question: can machines actually learn? First neural net — and the obsession began.",
    accent: "#60a5fa",
  },
  {
    id: "learning",
    year: "2023",
    title: "Learning to Learn",
    org: "Self-driven engineering",
    description:
      "750+ DSA problems, OOP and DBMS foundations, and building full-stack apps that put the theory to work.",
    accent: "#a78bfa",
  },
  {
    id: "vision",
    year: "2025",
    title: "Computer Vision",
    org: "Vehicle Detection · 85% accuracy",
    description:
      "YOLOv8, OpenCV and centroid tracking — a production pipeline that counts vehicles at 1,000+ frames per minute.",
    accent: "#34f5c5",
  },
  {
    id: "enterprise-ai",
    year: "2025",
    title: "Enterprise AI",
    org: "Infosys Springboard",
    description:
      "ML, Deep Learning, NLP and Generative AI inside a 4-month enterprise internship — shipping AI, not demos.",
    accent: "#f472b6",
  },
  {
    id: "scale",
    year: "2026",
    title: "Systems That Scale",
    org: "Seat Allocation · ~5,000 employees",
    description:
      "Dockerized FastAPI + PostgreSQL + Gemini with 52 RBAC combos and a 5-layer security system — running at 342ms p95 latency.",
    accent: "#f0abfc",
  },
];

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  skills: string[];
  accent: string;
  url?: string;
}

export const CERTIFICATES: Certificate[] = [
  {
    id: "aws-cloud-practitioner",
    title: "AWS Cloud Practitioner Essentials",
    issuer: "Amazon Web Services",
    date: "2025",
    skills: ["Cloud Computing", "EC2 / S3", "AWS Services", "Pricing & Security"],
    accent: "#fbbf24",
    url: "https://aws.amazon.com/",
  },
  {
    id: "salesforce-ai",
    title: "AI Trailblazer",
    issuer: "Salesforce",
    date: "2026",
    skills: ["Generative AI", "Trusted AI", "Ethics", "Automation"],
    accent: "#22d3ee",
    url: "#",
  },
  {
    id: "goldman-sachs",
    title: "Software Engineering Job Simulation",
    issuer: "Goldman Sachs",
    date: "2026",
    skills: ["Software Engineering", "Problem Solving", "Crack Systems", "Data Structures"],
    accent: "#f472b6",
    url: "#",
  },
  {
    id: "google-generative-ai",
    title: "Google Cloud Generative AI",
    issuer: "Simplilearn",
    date: "2026",
    skills: ["Generative AI", "Google Cloud", "LLMs", "Prompts & Fine-tuning"],
    accent: "#34f5c5",
    url: "#",
  },
  {
    id: "python-101",
    title: "Python 101 for Data Science",
    issuer: "IBM Cognitive Class",
    date: "2024",
    skills: ["Python", "NumPy", "Data Structures", "Data Science"],
    accent: "#8b5cf6",
    url: "#",
  },
];
