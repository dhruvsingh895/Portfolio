import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMediaQuery } from '../hooks';
import { SceneBoundary } from './SingularityLab';

const Scene = lazy(() => import('./Scene'));
const chapters = [
  {
    title: 'Embrace the',
    accent: 'complexity.',
    label: '01 / ASK THE RIGHT QUESTIONS',
    copy: 'Every meaningful system begins with a problem worth understanding.',
  },
  {
    title: 'Break it',
    accent: 'wide open.',
    label: '02 / CHALLENGE THE ASSUMPTIONS',
    copy: 'Pull the pieces apart. Find the patterns. Build something better.',
  },
  {
    title: 'Make it',
    accent: 'matter.',
    label: '03 / CONNECT IDEAS TO IMPACT',
    copy: 'Intelligence becomes useful when it changes what people can do.',
  },
];

export default function Experiment({ accent, reducedMotion }) {
  const root = useRef(null),
    progress = useRef(0);
  const [near, setNear] = useState(false),
    [chapter, setChapter] = useState(0);
  const [initialized, setInitialized] = useState(false);
  const mobile = useMediaQuery('(max-width: 767px)');
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setNear(entry.isIntersecting);
        if (entry.isIntersecting) setInitialized(true);
      },
      {
        rootMargin: '250px',
      },
    );
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (reducedMotion || !initialized) return;
    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.7,
          onUpdate: (self) => {
            progress.current = self.progress;
            setChapter(Math.min(2, Math.floor(self.progress * 3)));
          },
        },
      });
      timeline
        .to(
          '.sequence-scene',
          { xPercent: -13, rotate: -12, scale: 1.15, duration: 1, ease: 'none' },
          0,
        )
        .to('.sequence-chapter-0', { yPercent: -45, opacity: 0, rotateX: 15, duration: 0.16 }, 0.2)
        .fromTo(
          '.sequence-chapter-1',
          { yPercent: 50, opacity: 0, rotateX: -15 },
          { yPercent: 0, opacity: 1, rotateX: 0, duration: 0.16 },
          0.27,
        )
        .to('.sequence-chapter-1', { yPercent: -45, opacity: 0, rotateX: 15, duration: 0.16 }, 0.55)
        .fromTo(
          '.sequence-chapter-2',
          { yPercent: 50, opacity: 0, rotateX: -15 },
          { yPercent: 0, opacity: 1, rotateX: 0, duration: 0.18 },
          0.62,
        )
        .to('.sequence-meter-fill', { scaleX: 1, duration: 1, ease: 'none' }, 0)
        .to('.sequence-watermark', { xPercent: -20, duration: 1, ease: 'none' }, 0);
      if (mobile)
        timeline.to(
          '.sequence-mobile-sculpture',
          { rotate: 160, scale: 1.6, opacity: 0.25, duration: 1, ease: 'none' },
          0,
        );
    }, root);
    return () => context.revert();
  }, [reducedMotion, mobile, initialized]);

  return (
    <section
      id="experiment"
      className={`experiment ${reducedMotion ? 'experiment-static' : ''}`}
      ref={root}
      aria-label="From complexity to impact, an interactive visual journey"
      data-chapter={reducedMotion ? 2 : chapter}
    >
      <div className="sequence-sticky">
        <div className="sequence-watermark" aria-hidden="true">
          THINK. BUILD. EVOLVE.
        </div>
        <div className="sequence-topline">
          <span className="mono">
            <i /> THOUGHTS, IN MOTION
          </span>
          <span className="mono">SCROLL TO TRANSFORM ↓</span>
        </div>
        <div className="sequence-scene scene-loaded" aria-hidden="true">
          {near && !mobile && !reducedMotion ? (
            <SceneBoundary>
              <Suspense
                fallback={
                  <img
                    className="sequence-mobile-sculpture"
                    src="/sculpture.webp"
                    alt=""
                    loading="lazy"
                    width="720"
                    height="594"
                  />
                }
              >
                <Scene accent={accent} mobile={false} sequence={progress} active={near} />
              </Suspense>
            </SceneBoundary>
          ) : (
            <img
              className="sequence-mobile-sculpture"
              src="/sculpture.webp"
              alt=""
              loading="lazy"
              width="720"
              height="594"
            />
          )}
        </div>
        <div className="sequence-copy">
          {chapters.map((item, i) => (
            <div
              key={item.title}
              className={`sequence-chapter sequence-chapter-${i}`}
              aria-hidden={reducedMotion ? i !== 2 : i !== chapter}
            >
              <span className="mono">{item.label}</span>
              <h2>
                {item.title}
                <br />
                <span className="serif-accent">{item.accent}</span>
              </h2>
              <p>{item.copy}</p>
            </div>
          ))}
        </div>
        <div className="sequence-bottom">
          <div className="sequence-navigation">
            <div className="sequence-chapters">
              {['CURIOSITY', 'EXPLORATION', 'IMPACT'].map((label, i) => (
                <span key={label} className={(reducedMotion ? 2 : chapter) === i ? 'active' : ''}>
                  <b>0{i + 1}</b>
                  {label}
                </span>
              ))}
            </div>
            <div className="sequence-meter">
              <span className="sequence-meter-fill" />
            </div>
          </div>
          <a href="#work" className="sequence-next">
            See it in practice <ArrowDownRight size={20} />
          </a>
        </div>
        <span className="sequence-crosshair crosshair-a" aria-hidden="true">
          +
        </span>
        <span className="sequence-crosshair crosshair-b" aria-hidden="true">
          +
        </span>
      </div>
    </section>
  );
}
