export interface KnowledgeEntry {
  id: string;
  keywords: string[];
  answer: string;
}

export const AI_KNOWLEDGE: KnowledgeEntry[] = [
  {
    id: "intro",
    keywords: ["who", "about", "dhruv", "tell", "introduce", "yourself", "profile"],
    answer:
      "Dhruv Singh is an AI/ML engineer from Kanpur, India — an AI/ML graduate who builds production-ready AI systems and scalable full-stack applications. He holds a B.Tech in AI & ML from AKTU with a CGPA of 8.07 and trained at Infosys Springboard. Ask me about his projects, skills or experience!",
  },
  {
    id: "resume",
    keywords: ["resume", "cv", "download", "hiring", "hire"],
    answer:
      "You can download Dhruv's resume using the 'Download Resume' button in the hero section. Short version: B.Tech AI & ML (CGPA 8.07), AI Intern at Infosys Springboard (Dec 2025 – Apr 2026), and 3 flagship projects spanning computer vision, full-stack and generative AI systems.",
  },
  {
    id: "projects",
    keywords: ["project", "work", "portfolio", "built", "product"],
    answer:
      "Dhruv has three flagship projects: (1) Vehicle Detection & Counting — Python + OpenCV + YOLOv8 traffic pipeline processing 1,000+ frames/min at 85% accuracy; (2) Taskflow — React.js + Node.js + Express + MongoDB task tracking with JWT and 10+ REST APIs; (3) Seat Allocation & Project Mapping — Next.js + FastAPI + PostgreSQL + Gemini AI for ~5,000 employees at 342ms p95 latency. Scroll to the Projects section to explore them!",
  },
  {
    id: "experience",
    keywords: ["experience", "internship", "infosys", "job", "career"],
    answer:
      "Dhruv was an Artificial Intelligence Intern at Infosys Springboard (Dec 2025 – Apr 2026), covering Machine Learning, Deep Learning, NLP, Generative AI, Prompt Engineering and Data Analytics — including EDA on road accident data. Underpinning it all: a B.Tech in AI & ML, 750+ LeetCode problems and production projects.",
  },
  {
    id: "skills",
    keywords: ["skill", "stack", "tech", "languages", "tools"],
    answer:
      "Languages: Python, Java, SQL. Web & backend: React.js, Node.js, Express.js, FastAPI, Tailwind CSS, REST APIs. Cloud, tools & databases: AWS EC2, Docker, Git, PostgreSQL, MongoDB. AI/ML: Machine Learning, Deep Learning, YOLOv8, OpenCV, Generative AI, prompt engineering.",
  },
  {
    id: "achievements",
    keywords: ["leetcode", "achievement", "hackerrank", "geeks", "gfg", "score", "rating"],
    answer:
      "Dhruv has solved 750+ problems on LeetCode, 150+ on GeeksforGeeks, and holds a 5-star rating on HackerRank. Academic: 8.07 CGPA. Production: a ~5,000-employee allocation system running at 342ms p95 latency with 52 RBAC combinations.",
  },
  {
    id: "contact",
    keywords: ["contact", "email", "reach", "message", "connect", "talk"],
    answer:
      "The fastest way to reach Dhruv is the Contact section below — it sends directly to his inbox with EmailJS (dhruvsingh050908@gmail.com). He's also on GitHub, LinkedIn and LeetCode (links in the footer). Open to AI engineering roles, freelance and collaborations.",
  },
  {
    id: "goals",
    keywords: ["goal", "future", "vision", "ambition", "plan", "growth"],
    answer:
      "Dhruv is aiming for production AI engineering — building systems where models meet millions of users. Direction: agentic AI systems, edge inference and products that feel like intelligence, backed by the disciplines of DSA, DBMS and system design.",
  },
  {
    id: "certificates",
    keywords: ["certificate", "certification", "course", "training"],
    answer:
      "He holds: AWS Cloud Practitioner Essentials (2025), Salesforce AI Trailblazer, Goldman Sachs Software Engineering Job Simulation, Google Cloud Generative AI by Simplilearn (2026), and Python 101 for Data Science from IBM Cognitive Class (2024). Check the Certificates section for the flip-card collection!",
  },
  {
    id: "fallback",
    keywords: [],
    answer:
      "I can answer about Dhruv's resume, projects, experience, skills, achievements, certificates, and career goals. Try asking: 'Tell me about Dhruv' or 'What projects has he built?'",
  },
];

export const AI_CHAT_STARTERS = [
  "Tell me about Dhruv",
  "Resume",
  "Projects",
  "Experience",
  "Skills",
  "Contact",
  "Career goals",
];

export const AI_THINKING_LINES = [
  "Indexing knowledge graph…",
  "Querying neural core…",
  "Reasoning…",
  "Synthesizing response…",
];
