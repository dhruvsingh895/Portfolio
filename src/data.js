// Profile links were extracted from the PDF. Project demos were found in the
// corresponding public repositories. Metrics are resume figures, not live counts.
export const profile = {
  name: 'Dhruv Singh',
  email: 'dhruvsingh050908@gmail.com',
  phone: '+919935663381',
  github: 'https://github.com/dhruvsingh895',
  linkedin: 'https://www.linkedin.com/in/dhruv-singh-06857831a',
  leetcode: 'https://leetcode.com/u/dhruvsingh895/',
  chess: 'https://www.chess.com/member/anonymous_895x',
  resume: '/Dhruv_Resume.pdf',
};

export const projects = [
  {
    id: 'ethara',
    number: '01',
    name: 'Seat Allocation System',
    title: 'A place for everyone.',
    fullName: 'Seat Allocation & Project Mapping System',
    category: 'FULL-STACK · APPLIED AI',
    date: 'JUN — JUL 2026',
    description:
      'An intelligent workspace platform that brings people, projects, and places together. Built to make complex allocation feel effortless.',
    stack: ['Next.js', 'FastAPI', 'PostgreSQL', 'Gemini AI', 'Docker'],
    github: 'https://github.com/dhruvsingh895/Ethara-SAPSM',
    demo: 'https://ethara-sapsm.vercel.app/',
    metrics: [
      { value: '5,000', label: 'employee records' },
      { value: '342ms', label: 'p95 response time' },
      { value: '52', label: 'RBAC combinations' },
    ],
    challenge:
      'Coordinate seat allocation and project assignments for an organization with approximately 5,000 employees, while giving each role the right level of access.',
    approach:
      'Built a Next.js interface over a FastAPI and PostgreSQL backend, with JWT authentication and role-based access. A Gemini-powered natural-language assistant turns questions into read-only database queries, protected by layered validation and database restrictions.',
    outcome:
      'Measured 342ms p95 on the employee endpoint with 5 concurrent virtual users. Audited 52 role–endpoint combinations and implemented five layers of protection around the AI query flow.',
  },
  {
    id: 'vision',
    number: '02',
    name: 'Traffic Vision',
    title: 'Teaching machines to see.',
    fullName: 'Vehicle Detection & Counting System',
    category: 'COMPUTER VISION · MACHINE LEARNING',
    date: 'JUN 2025 — MAR 2026',
    description:
      'From raw video to meaningful traffic intelligence. A real-time pipeline that detects, tracks, and counts vehicles with precision.',
    stack: ['Python', 'OpenCV', 'YOLOv8', 'Streamlit'],
    github: 'https://github.com/dhruvsingh895/Vehicle_detection',
    demo: 'https://vehicledetection-4hxxb9xjjbvif7edzc8a35.streamlit.app/',
    demoLabel: 'Analytics demo',
    metrics: [
      { value: '85%', label: 'detection accuracy' },
      { value: '1,000+', label: 'frames / minute' },
      { value: '30%', label: 'fewer false positives' },
    ],
    challenge:
      'Replace manual traffic counting with a repeatable pipeline that turns video footage into useful, structured traffic data.',
    approach:
      'Developed a computer vision pipeline using Python and OpenCV, with background subtraction, filtering, tracking, and line-crossing logic. The repository also includes YOLOv8 detection, SQLite persistence, and a Streamlit dashboard for historical analytics.',
    outcome:
      'The resume benchmark reports 85% detection accuracy, processing above 1,000 frames per minute, and a 30% reduction in false positives against the baseline. The public demo displays historical analytics; real-time detection runs locally.',
  },
  {
    id: 'taskflow',
    number: '03',
    name: 'Taskflow',
    title: 'Less friction. More flow.',
    fullName: 'Full-Stack Task Management Platform',
    category: 'FULL-STACK · PRODUCT ENGINEERING',
    date: 'MAR — MAY 2026',
    description:
      'A focused space to turn plans into progress. Secure task management with clear priorities, due dates, and a thoughtfully responsive interface.',
    stack: ['React', 'Node.js', 'Express', 'MongoDB'],
    github: 'https://github.com/dhruvsingh895/taskflow',
    demo: 'https://taskflow-sagar.vercel.app/',
    metrics: [
      { value: '10+', label: 'RESTful APIs' },
      { value: 'JWT', label: 'secure authentication' },
      { value: 'MERN', label: 'end-to-end stack' },
    ],
    challenge:
      'Give teams a centralized way to assign, organize, and track work without losing sight of priorities and deadlines.',
    approach:
      'Built a React frontend and an Express/Node.js backend with MongoDB. Implemented JWT authentication, task categorization, priority management, due dates, and status tracking through more than ten RESTful APIs.',
    outcome:
      'Optimized React rendering and API handling across the core task flows to improve responsiveness. The published repository includes a live demo and setup documentation.',
  },
];

export const moreProjects = [
  {
    name: 'Inventory System',
    type: 'WEB APPLICATION',
    language: 'JavaScript',
    url: 'https://github.com/dhruvsingh895/inventory-system',
  },
  {
    name: 'Smart Recipe Generator',
    type: 'EXPERIMENT',
    language: 'JavaScript',
    url: 'https://github.com/dhruvsingh895/smart-recipe-generator',
  },
];
