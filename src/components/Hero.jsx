import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Code2, MoveUpRight } from 'lucide-react';
import { Github, Linkedin } from './BrandIcons';
import { profile } from '../data';
import { useMediaQuery } from '../hooks';
import { ExternalLink, Magnetic } from './UI';
import SingularityLab from './SingularityLab';
import gsap from 'gsap';
import StoryMode from './StoryMode';

export default function Hero({ accent, reducedMotion }) {
  const container = useRef(null);
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [visible, setVisible] = useState(true);
  const [entering, setEntering] = useState(false);
  const [storyOpen, setStoryOpen] = useState(() => new URLSearchParams(window.location.search).get('story') === '1');
  const portal = useRef(null),
    entrance = useRef(null);
  useEffect(
    () => () => {
      entrance.current?.kill();
      window.dispatchEvent(new CustomEvent('portfolio:modal', { detail: false }));
    },
    [],
  );
  function enterWorkspace() {
    if (entering) return;
    const arrive = () => {
      const workspace = document.getElementById('workspace');
      if (!workspace) return;
      window.scrollTo({
        top: workspace.getBoundingClientRect().top + window.scrollY - 115,
        behavior: 'instant',
      });
      workspace.querySelector('[role="tab"][aria-selected="true"]')?.focus({ preventScroll: true });
    };
    if (reducedMotion) {
      arrive();
      return;
    }
    setEntering(true);
    window.dispatchEvent(new CustomEvent('portfolio:modal', { detail: true }));
    window.dispatchEvent(new Event('portfolio:enter-workspace'));
    entrance.current = gsap
      .timeline({
        onComplete: () => {
          setEntering(false);
          window.dispatchEvent(new CustomEvent('portfolio:modal', { detail: false }));
        },
      })
      .set(portal.current, { visibility: 'visible' })
      .fromTo(portal.current, { opacity: 0 }, { opacity: 1, duration: 0.75, ease: 'power2.in' })
      .fromTo(
        portal.current.querySelectorAll('span'),
        { scale: 0.5, rotate: -25 },
        { scale: 9, rotate: 70, duration: 1.15, stagger: 0.05, ease: 'power3.in' },
        0,
      )
      .call(arrive, [], 1.1)
      .to(portal.current, { opacity: 0, duration: 0.45 }, 1.25)
      .set(portal.current, { visibility: 'hidden' });
  }
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '100px',
    });
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section id="home" className="hero" ref={container} aria-labelledby="hero-title">
      <div className="cinematic-backdrop" aria-hidden="true">
        <div className="aurora aurora-violet" />
        <div className="aurora aurora-coral" />
        <div className="aurora aurora-blue" />
        <div className="light-beam beam-one" />
        <div className="light-beam beam-two" />
        <div className="perspective-floor" />
        <div className="lens-flare flare-one" />
        <div className="lens-flare flare-two" />

      </div>
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-topline hero-reveal">
        <span className="mono">INDEPENDENT MIND. ENGINEER AT HEART.</span>
        <span className="availability">
          <i /> OPEN TO OPPORTUNITIES
        </span>
      </div>
      <SingularityLab
        accent={accent}
        mobile={isMobile}
        reducedMotion={reducedMotion}
        active={visible}
      />
      <div className="hero-content">
        <div className="hero-role hero-reveal">
          <span className="tiny-star">✳</span> AI/ML ENGINEER & FULL-STACK DEVELOPER
        </div>
        <h1 id="hero-title" className="hero-title" aria-label="Dhruv Singh">
          <span className="hero-title-line" aria-hidden="true">
            <span>
              {'DHRUV'.split('').map((letter, i) => (
                <span className="hero-letter" key={i}>
                  {letter}
                </span>
              ))}
            </span>
          </span>
          <span className="hero-title-line" aria-hidden="true">
            <span className="surname">
              {'SINGH'.split('').map((letter, i) => (
                <span className="hero-letter" key={i}>
                  {letter}
                </span>
              ))}
              <span className="hero-letter title-period">.</span>
            </span>
          </span>
        </h1>
        <div className="hero-description hero-reveal">
          <span className="small-rule" />
          <p>
            I turn complex problems into
            <br />
            <span>things that work beautifully.</span>
          </p>
        </div>
        <div className="hero-buttons hero-reveal">
          <Magnetic
            as="button"
            className="button button-primary"
            onClick={enterWorkspace}
            disabled={entering}
          >
            {entering ? 'Entering…' : 'Enter the workspace'}{' '}
            <ArrowUpRight size={19} aria-hidden="true" />
          </Magnetic>
          <Magnetic className="button button-quiet" href="#contact">
            Let’s talk <MoveUpRight size={16} aria-hidden="true" />
          </Magnetic>
        </div>
        <button
          className="story-trigger"
          aria-haspopup="dialog"
          onClick={() => setStoryOpen(true)}
        >
          <span aria-hidden="true">▷</span> Enter Story Mode{' '}
          <span className="story-trigger-time">70 SEC · TWO PATHS</span>
        </button>
      </div>
      <div className="hero-bottom hero-reveal">
        <div className="hero-edition mono">
          <span>SELECTED PORTFOLIO</span>
          <span>© 2026</span>
        </div>
        <div className="hero-socials">
          <ExternalLink href={profile.github} aria-label="GitHub">
            <Github size={18} />
          </ExternalLink>
          <ExternalLink href={profile.linkedin} aria-label="LinkedIn">
            <Linkedin size={17} />
          </ExternalLink>
          <ExternalLink href={profile.leetcode} aria-label="LeetCode">
            <Code2 size={19} />
          </ExternalLink>
        </div>
      </div>
      <div className="workspace-portal" ref={portal} aria-hidden="true">
        <span />
        <span />
        <span />
        <p>ENTER THE WORKSPACE</p>
      </div>
      {storyOpen && (
        <StoryMode
          accent={accent}
          reducedMotion={reducedMotion}
          onClose={() => setStoryOpen(false)}
        />
      )}
    </section>
  );
}
