import { ArrowUpRight, GraduationCap } from 'lucide-react';
import { profile } from '../data';
import { SectionLabel } from './UI';

export default function Timeline() {
  return (
    <section id="journey" className="journey section-shell" aria-labelledby="journey-title">
      <div className="journey-left" data-reveal>
        <SectionLabel number="03">THE JOURNEY SO FAR</SectionLabel>
        <h2 id="journey-title">
          Always learning.
          <br />
          <span className="text-muted">Always building.</span>
        </h2>
        <p>
          Every project adds perspective.
          <br />
          Every challenge sharpens the craft.
        </p>
        <a href={profile.resume} download className="inline-link">
          The full story, in my résumé <ArrowUpRight size={16} />
        </a>
        <div className="journey-mark" aria-hidden="true">
          <span>+</span>
          <span>+</span>
          <div>↗</div>
          <span>+</span>
          <span>+</span>
        </div>
      </div>
      <div className="timeline">
        <div className="timeline-track">
          <span />
        </div>
        <article className="timeline-item" data-reveal>
          <span className="timeline-point" />
          <div className="timeline-date mono">
            DEC 2025 — APR 2026<span>EXPERIENCE</span>
          </div>
          <div className="timeline-company">
            <span className="company-icon">
              in<span>fy</span>
            </span>
            <div>
              <h3>Artificial Intelligence Intern</h3>
              <span>Infosys Springboard</span>
            </div>
          </div>
          <p>
            Turned AI concepts into hands-on work across machine learning, deep learning, NLP, and
            generative AI. Analyzed road accident data to uncover patterns and actionable safety
            insights.
          </p>
          <div className="tech-tags">
            <span>Machine Learning</span>
            <span>Generative AI</span>
            <span>Data Analytics</span>
          </div>
        </article>
        <article className="timeline-item" data-reveal>
          <span className="timeline-point" />
          <div className="timeline-date mono">
            2022 — 2026<span>EDUCATION</span>
          </div>
          <div className="timeline-company">
            <span className="company-icon education-icon">
              <GraduationCap size={24} />
            </span>
            <div>
              <h3>B.Tech in Artificial Intelligence & ML</h3>
              <span>Dr. A.P.J. Abdul Kalam Technical University</span>
            </div>
          </div>
          <p>
            Built a foundation in algorithms, data structures, databases, and intelligent systems.
            Put the theory to work through full-stack products and computer vision projects.
          </p>
          <span className="education-grade mono">GRADUATED WITH 8.07 / 10 CGPA</span>
        </article>
      </div>
    </section>
  );
}
