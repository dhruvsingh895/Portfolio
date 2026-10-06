import {
  ArrowUpRight,
  Award,
  BrainCircuit,
  Braces,
  Cloud,
  Code2,
  Container,
  Database,
  GitBranch,
  Layers3,
  Network,
  Server,
  Terminal,
} from 'lucide-react';
import { profile } from '../data';
import { ExternalLink, SectionLabel } from './UI';

const groups = [
  {
    name: 'Intelligence',
    subtitle: 'FROM DATA TO DECISIONS',
    number: '01',
    icon: BrainCircuit,
    skills: [
      ['Python', 'Py'],
      ['OpenCV', '◉'],
      ['YOLOv8', 'Y'],
      ['Machine Learning', 'ML'],
      ['Deep Learning', 'DL'],
      ['Generative AI', 'AI'],
    ],
  },
  {
    name: 'Engineering',
    subtitle: 'FROM IDEA TO INTERFACE',
    number: '02',
    icon: Braces,
    skills: [
      ['React', '⚛'],
      ['Next.js', 'N'],
      ['Node.js', 'JS'],
      ['FastAPI', '↯'],
      ['Express', 'ex'],
      ['Tailwind CSS', '≈'],
    ],
  },
  {
    name: 'Infrastructure',
    subtitle: 'FROM LOCAL TO LAUNCH',
    number: '03',
    icon: Network,
    skills: [
      ['PostgreSQL', Database],
      ['MongoDB', Database],
      ['Docker', Container],
      ['AWS EC2', Cloud],
      ['Git & GitHub', GitBranch],
      ['Vercel', '▲'],
    ],
  },
];

export default function Skills() {
  return (
    <section id="stack" className="skills section-shell" aria-labelledby="skills-title">
      <div className="section-heading" data-reveal>
        <div>
          <SectionLabel number="04">TOOLS OF THE TRADE</SectionLabel>
          <h2 id="skills-title">
            The right tools.
            <br />
            <span className="text-muted">The bigger picture.</span>
          </h2>
        </div>
        <p>
          Languages change. Frameworks evolve.
          <br />
          Good engineering stays curious.
        </p>
      </div>
      <div className="skill-groups">
        {groups.map((group) => (
          <div className="skill-group" key={group.name} data-reveal>
            <div className="skill-group-heading">
              <group.icon size={23} />
              <span className="mono">/{group.number}</span>
            </div>
            <h3>{group.name}</h3>
            <span className="mono skill-subtitle">{group.subtitle}</span>
            <div className="skill-list">
              {group.skills.map(([name, Icon]) => (
                <div className="skill-item" key={name}>
                  <span className="tech-icon">
                    {typeof Icon === 'string' ? Icon : <Icon size={19} />}
                  </span>
                  <span>{name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="foundation-line" data-reveal>
        <Code2 size={18} />
        <span>Built on the fundamentals</span>
        <div>
          <span>Java</span>
          <span>Data Structures & Algorithms</span>
          <span>OOP</span>
          <span>DBMS</span>
          <span>REST APIs</span>
        </div>
      </div>
      <div className="achievement-grid" data-reveal>
        <ExternalLink className="achievement problem-solving" href={profile.leetcode}>
          <div className="achievement-icon">
            <Code2 size={25} />
          </div>
          <div>
            <span className="mono">A DAILY PRACTICE</span>
            <h3>One problem at a time.</h3>
            <p>
              800+ LeetCode · 150+ GeeksforGeeks
              <br />
              5-star Problem Solving on HackerRank
            </p>
          </div>
          <ArrowUpRight size={21} />
        </ExternalLink>
        <div className="achievement credentials">
          <Award size={26} />
          <div>
            <span className="mono">KEEPING THE CURIOSITY ALIVE</span>
            <h3>Learning beyond the syllabus.</h3>
            <p>
              AWS Cloud Practitioner Essentials · 2025
              <br />
              Google Cloud Generative AI, Simplilearn · 2026
              <br />
              IBM Python 101 for Data Science · 2024
            </p>
            <span className="extra-credentials">
              Salesforce AI Trailblazer · Goldman Sachs Engineering Simulation
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
