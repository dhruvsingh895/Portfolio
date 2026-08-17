export interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  type: string;
  description: string;
  highlights: string[];
  accent: string;
}

export const EXPERIENCE: ExperienceItem[] = [
  {
    company: "Infosys Springboard",
    role: "Artificial Intelligence Intern",
    period: "Dec 2025 — Apr 2026",
    type: "Internship",
    description:
      "Completed a 4-month AI internship covering Machine Learning, Deep Learning, NLP, Generative AI, Prompt Engineering and Data Analytics — applying concepts to real datasets.",
    highlights: [
      "Machine Learning",
      "Deep Learning",
      "NLP",
      "Generative AI",
      "Prompt Engineering",
      "Data Analytics",
    ],
    accent: "#22d3ee",
  },
];

export const EDUCATION = {
  degree: "B.Tech — Artificial Intelligence & Machine Learning",
  university: "Dr. A.P.J. Abdul Kalam Technical University",
  cgpa: "8.07 / 10",
  period: "2022 — 2026",
  details: [
    "Specialized in ML, Deep Learning, CV and NLP",
    "Built production-grade projects alongside coursework",
    "Strong foundation in Data Structures & Algorithms and DBMS",
  ],
  courses: [
    "Machine Learning",
    "Deep Learning",
    "Computer Vision",
    "NLP",
    "Data Structures & Algorithms",
    "DBMS",
    "OOP",
    "Artificial Intelligence",
  ],
  secondary: {
    school: "Pt. Deen Dayal Upadhyaya Sanatan Dharm Vidyalaya, Kanpur",
    period: "2019 — 2022",
    details: [
      { label: "Intermediate (Class XII)", value: "83.4%" },
      { label: "High School (Class X)", value: "92.5%" },
    ],
  },
};