import { ArrowUpRight, Star } from 'lucide-react';
import { profile } from '../data';
import { SectionLabel, ExternalLink } from './UI';
import Monogram from './Monogram';

export default function About() {
  return (
    <section id="about" className="about section-shell" aria-labelledby="about-title">
      <div className="about-intro" data-reveal>
        <div className="about-identity">
          <SectionLabel number="01">THE PERSON BEHIND THE CODE</SectionLabel>
          <div className="identity-art" aria-hidden="true">
            <div className="identity-orbit orbit-outer" />
            <div className="identity-orbit orbit-inner" />
            <div className="identity-cube">
              {['front', 'back', 'left', 'right', 'top', 'bottom'].map((face) => (
                <div className={`cube-face cube-${face}`} key={face}><Monogram /></div>
              ))}
            </div>
            <span className="identity-chip chip-code">BUILT ON CURIOSITY</span>
            <span className="identity-chip chip-place">26.45° N / 80.33° E</span>
            <span className="identity-spark spark-one">✦</span>
            <span className="identity-spark spark-two">✦</span>
          </div>
          <div className="identity-caption">
            <i /> KANPUR, INDIA <span> / A WORLD OF IDEAS</span>
          </div>
        </div>
        <div className="about-copy">
          <h2 id="about-title">
            Curiosity is the input.
            <br />
            <span className="text-muted">Impact is the output.</span>
          </h2>
          <div className="about-paragraphs">
            <p>
              I’m Dhruv, an AI/ML graduate and full-stack developer based in Kanpur, India. I work
              at the intersection of <span>intelligent systems and thoughtful software.</span>
            </p>
            <p>
              From teaching machines to understand traffic to building platforms for thousands of
              people, I care about the details that turn a good idea into a dependable product.
            </p>
          </div>
          <a className="inline-link" href="#journey">
            A little more about my journey <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
      <div className="stats-row" data-reveal>
        <ExternalLink href={profile.leetcode} className="stat-cell">
          <div className="stat-top">
            <span className="mono">ALWAYS PROBLEM-SOLVING</span>
            <ArrowUpRight size={18} />
          </div>
          <strong>
            <span data-count="800">800</span>
            <span className="stat-symbol">+</span>
          </strong>
          <span>LeetCode problems solved</span>
        </ExternalLink>
        <div className="stat-cell">
          <div className="stat-top">
            <span className="mono">PROVEN PROBLEM-SOLVING</span>
            <Star size={18} aria-hidden="true" />
          </div>
          <strong aria-label="5 stars">
            <span data-count="5">5</span>
            <span className="stat-symbol" aria-hidden="true">★</span>
          </strong>
          <span>HackerRank rating</span>
        </div>
        <div className="stat-cell">
          <div className="stat-top">
            <span className="mono">A STRONG FOUNDATION</span>
            <span className="stat-mini-star">✳</span>
          </div>
          <strong>
            8.07<span className="stat-denominator">/10</span>
          </strong>
          <span>B.Tech · Artificial Intelligence & ML</span>
        </div>
      </div>
      <div
        className="ticker"
        role="img"
        aria-label="Machine learning, full-stack development, computer vision, problem solving"
      >
        <div aria-hidden="true">
          {[0, 1].map((i) => (
            <div className="ticker-group" key={i}>
              <span>MACHINE LEARNING</span>
              <b>✳</b>
              <span>FULL-STACK DEVELOPMENT</span>
              <b>✳</b>
              <span>COMPUTER VISION</span>
              <b>✳</b>
              <span>PROBLEM SOLVING</span>
              <b>✳</b>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
