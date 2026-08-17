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
    "AI/ML graduate with hands-on experience in Machine Learning, Deep Learning, Computer Vision, and full-stack development (React.js, Node.js, FastAPI). I build production-style applications in Python with REST APIs, SQL, and Docker — recent work includes a real-time computer vision pipeline at 85% detection accuracy and a role-based platform serving ~5,000 users at 342ms p95 latency. Strong foundation in Data Structures & Algorithms (750+ LeetCode problems solved) and DBMS — I turn requirements into measurable, production-ready results.",
  role: "AI / ML Engineer",
  roles: [
    "AI Engineer",
    "Software Engineer",
    "ML Engineer",
    "Computer Vision Engineer",
    "Full Stack Developer",
  ],
  resumeUrl: process.env.NEXT_PUBLIC_RESUME_URL || "/resume/Dhruv_Singh_Resume.pdf",
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
  { value: 750, suffix: "+", label: "LeetCode Problems" },
  { value: 5, suffix: "★", label: "HackerRank" },
  { value: 8.07, suffix: "", label: "CGPA", decimals: 2 },
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