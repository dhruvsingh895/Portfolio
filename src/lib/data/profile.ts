export const PROFILE = {
  name: "Dhruv Singh",
  firstName: "Dhruv",
  lastName: "SINGH",
  initials: "DS",
  location: "Kanpur, Uttar Pradesh, India",
  coordinates: { lat: 26.4499, lon: 80.3319 },
  email: "dhruvsingh050908@gmail.com",
  phone: "+91 9935663381",
  headline:
    "AI Engineer building production-ready intelligence — from neural nets to shippable products.",
  summary:
    "AI/ML engineer who builds models that ship, not just train. As an Infosys Springboard intern, I shipped a YOLOv8 vehicle detection system hitting 85% accuracy at 1000+ frames/min, and engineered a full-stack seat allocation platform serving ~5,000 employees at 342ms p95. Python, deep learning, computer vision and full-stack — I turn requirements into measurable, production-ready results.",
  role: "AI / ML Engineer",
  roles: [
    "AI Engineer",
    "Software Engineer",
    "ML Engineer",
    "Computer Vision Engineer",
    "Full Stack Developer",
  ],
  resumeUrl: process.env.NEXT_PUBLIC_RESUME_URL ?? "",
  github: process.env.NEXT_PUBLIC_GITHUB_USERNAME ?? "dhruvsingh895",
  socials: {
    github: "https://github.com/dhruvsingh895",
    linkedin: "https://www.linkedin.com/in/dhruv-singh-06857831a",
    leetcode: "https://leetcode.com/dhruvsingh895",
    geeksforgeeks: "https://www.geeksforgeeks.org/user/dhruvsingh",
    email: "dhruvsingh050908@gmail.com",
  },
};

export const HERO_STATS = [
  { value: 700, suffix: "+", label: "LeetCode Problems" },
  { value: 5, suffix: "★", label: "HackerRank" },
  { value: 8, suffix: "", label: "CGPA" },
] as const;

export const NAV_LINKS = [
  { id: "about", label: "Story" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "achievements", label: "Achievements" },
  { id: "github", label: "GitHub" },
  { id: "contact", label: "Contact" },
] as const;