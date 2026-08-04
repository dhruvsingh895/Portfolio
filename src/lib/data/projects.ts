export interface ProjectFeature {
  title: string;
  description: string;
}

export interface ProjectMetric {
  label: string;
  value?: number;
  decimals?: number;
  suffix?: string;
  text?: string;
}

export interface Project {
  id: string;
  index: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string[];
  tech: string[];
  category: string;
  accent: string;
  accent2: string;
  year: string;
  github?: string;
  demo?: string;
  caseStudy?: string;
  metrics: ProjectMetric[];
  features: ProjectFeature[];
  architecture: { from: string; to: string; label: string }[];
  isFeatured: boolean;
}

export const PROJECTS: Project[] = [
  {
    id: "vehicle-detection",
    index: "01",
    title: "Vehicle Detection & Counting System",
    tagline: "Automating traffic monitoring with real-time computer vision",
    description:
      "A real-time computer vision pipeline for traffic monitoring that counts vehicles automatically — replacing manual counting with 85% accuracy.",
    longDescription: [
      "Built a real-time computer vision pipeline that processes 1,000+ frames per minute using background subtraction, contour detection and Gaussian filtering to detect and count vehicles.",
      "Achieved 85% detection accuracy and cut false positives by 30% versus the baseline model via centroid-based tracking and line-crossing logic.",
      "Documented the full architecture for handoff and reuse, with a Streamlit dashboard powered by SQLite + Pandas for analytics.",
    ],
    tech: ["Python", "OpenCV", "YOLOv8", "SQLite", "Pandas", "Streamlit"],
    category: "Computer Vision",
    accent: "#34f5c5",
    accent2: "#60a5fa",
    year: "Jun 2025 — Mar 2026",
    github: "https://github.com/dhruvsingh895/Vehicle_detection",
    demo: "#",
    caseStudy: "#",
    metrics: [
      { label: "Frames", value: 1000, suffix: "+/min" },
      { label: "Accuracy", value: 85, suffix: "%" },
      { label: "False positives", value: 30, suffix: "% ↓" },
      { label: "Detection", text: "Real-time" },
    ],
    features: [
      {
        title: "CV Pipeline",
        description: "Background subtraction, contour detection and Gaussian filtering on live feeds.",
      },
      {
        title: "Centroid Tracking",
        description: "Object tracking with line-crossing logic that cuts false positives by 30%.",
      },
      {
        title: "Analytics Dashboard",
        description: "Streamlit + SQLite + Pandas surface per-class counts and traffic trends.",
      },
      {
        title: "Documented Handoff",
        description: "Full architecture documented for reuse and handover to stakeholders.",
      },
    ],
    architecture: [
      { from: "Video Feed", to: "OpenCV", label: "Gaussian Filters" },
      { from: "OpenCV", to: "Detection", label: "Contours + YOLOv8" },
      { from: "Detection", to: "SQLite", label: "Tracking Data" },
      { from: "SQLite", to: "Streamlit", label: "Analytics UI" },
    ],
    isFeatured: true,
  },
  {
    id: "taskflow",
    index: "02",
    title: "Taskflow",
    tagline: "Secure, centralized task assignment & tracking",
    description:
      "A full-stack task management app with JWT authentication, priority management and due-date tracking backed by 10+ RESTful APIs.",
    longDescription: [
      "Gives teams a secure, centralized way to assign and track tasks — built with React.js, Node.js, Express.js and MongoDB.",
      "JWT authentication, priority management and due-date tracking across task categories and statuses, all backed by 10+ RESTful APIs.",
      "Improved workflow efficiency and frontend responsiveness by optimizing React component rendering and API call handling.",
    ],
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT", "REST API"],
    category: "Full Stack",
    accent: "#f472b6",
    accent2: "#a78bfa",
    year: "Mar 2026 — May 2026",
    github: "https://github.com/dhruvsingh895/taskflow",
    demo: "#",
    caseStudy: "#",
    metrics: [
      { label: "Endpoints", value: 10, suffix: "+ REST" },
      { label: "Auth", value: 100, suffix: "% JWT" },
      { label: "Category flow", text: "Prioritized" },
      { label: "Stack", text: "MERN" },
    ],
    features: [
      {
        title: "JWT Security",
        description: "Secure sign-up, login and session management for every team member.",
      },
      {
        title: "Priority & Due Dates",
        description: "Classify tasks by priority with due-date tracking and status flows.",
      },
      {
        title: "10+ REST APIs",
        description: "A clean, documented API layer serving the task categorization flows.",
      },
      {
        title: "Optimized UI",
        description: "React rendering and API call handling tuned for responsiveness.",
      },
    ],
    architecture: [
      { from: "React UI", to: "Node API", label: "REST + JWT" },
      { from: "Node API", to: "Express", label: "Routing" },
      { from: "Express", to: "MongoDB", label: "Mongoose" },
      { from: "Node API", to: "Auth", label: "bcrypt + JWT" },
    ],
    isFeatured: false,
  },
  {
    id: "seat-allocation",
    index: "03",
    title: "Seat Allocation & Project Mapping System",
    tagline: "Enterprise seat assignment engine powered by Gemini AI",
    description:
      "Role-based seat and project allocation for ~5,000 employees with a Gemini AI natural-language assistant — at 342ms p95 latency.",
    longDescription: [
      "Built a role-based seat and project allocation platform for ~5,000 employees on Next.js, FastAPI, PostgreSQL and Docker.",
      "An AI-powered natural-language query assistant uses Gemini AI to answer operational questions securely.",
      "Enforced role-based access control across 52 role and endpoint combinations, protected by a 5-layer security system that defends the AI query feature from injection attacks.",
    ],
    tech: ["Next.js", "FastAPI", "PostgreSQL", "Gemini AI", "JWT", "Docker"],
    category: "Full Stack + AI",
    accent: "#22d3ee",
    accent2: "#8b5cf6",
    year: "Jun — Jul 2026",
    github: "https://github.com/dhruvsingh895/Ethara-SAPSM",
    demo: "#",
    caseStudy: "#",
    metrics: [
      { label: "P95 latency", value: 342, suffix: "ms" },
      { label: "Employees", value: 5000, suffix: " ~" },
      { label: "RBAC combos", value: 52, suffix: "" },
      { label: "Security", value: 5, suffix: " layers" },
    ],
    features: [
      {
        title: "Seat & Project Allocation",
        description: "Role-based allocation workflows that seat employees onto mapped projects.",
      },
      {
        title: "Gemini Assistant",
        description: "Natural-language queries over operational data, grounded and answered by Gemini AI.",
      },
      {
        title: "Granular RBAC",
        description: "Access enforced across 52 role and endpoint combinations.",
      },
      {
        title: "5-Layer Security",
        description: "Multi-layer defense protecting the AI query feature from injection attacks.",
      },
    ],
    architecture: [
      { from: "Next.js UI", to: "FastAPI", label: "REST + JWT" },
      { from: "FastAPI", to: "PostgreSQL", label: "SQLAlchemy" },
      { from: "FastAPI", to: "Gemini API", label: "LLM Calls" },
      { from: "FastAPI", to: "5-Layer Security", label: "Injection Guard" },
      { from: "FastAPI", to: "Docker", label: "Containerized" },
    ],
    isFeatured: true,
  },
];