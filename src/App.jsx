import { useCallback, useEffect, useRef, useState } from 'react';
import { domAnimation, LazyMotion, MotionConfig } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experiment from './components/Experiment';
import Projects from './components/Projects';
import Timeline from './components/Timeline';
import Skills from './components/Skills';
import Contact from './components/Contact';
import Cursor from './components/Cursor';
import Loader from './components/Loader';
import { useMediaQuery } from './hooks';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const root = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const reducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [accent, setAccent] = useState(() => {
    try {
      return localStorage.getItem('dhruv-theme') === 'orange' ? 'orange' : 'silver';
    } catch {
      return 'silver';
    }
  });
  const finishLoading = useCallback(() => setLoaded(true), []);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) entry.target.dataset.inView = String(entry.isIntersecting);
      },
      { rootMargin: '200px' },
    );
    root.current
      .querySelectorAll('section, footer')
      .forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    document.documentElement.dataset.accent = accent;
    document.documentElement.dataset.theme = accent;
    try {
      localStorage.setItem('dhruv-theme', accent);
    } catch {
      /* Storage can be disabled in private browsers. */
    }
  }, [accent]);

  useEffect(() => {
    if (reducedMotion) return;
    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
    });
    gsap.ticker.lagSmoothing(0);
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    const onModal = (event) => (event.detail ? lenis.stop() : lenis.start());
    window.addEventListener('portfolio:modal', onModal);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.removeEventListener('portfolio:modal', onModal);
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (!loaded) return;
    let revealObserver;
    const context = gsap.context(() => {
      if (reducedMotion) return;
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      intro
        .from(
          '.hero-letter',
          {
            yPercent: 115,
            rotateX: -85,
            rotateZ: 5,
            transformOrigin: '50% 100%',
            duration: 1.15,
            stagger: 0.045,
          },
          0,
        )
        .from('.hero-reveal', { y: 22, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.3)
        .from('.scene-stage', { opacity: 0, scale: 0.85, duration: 1.8 }, 0.15);
      // Only animate elements as they approach the viewport. This avoids
      // measuring every offscreen project card during the initial render.
      root.current.classList.add('motion-ready');
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(({ target, isIntersecting }) => {
            if (!isIntersecting) return;
            target.classList.add('is-revealed');
            context.add(() => {
              gsap.fromTo(
                target,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' },
              );
              target.querySelectorAll('[data-count]').forEach((element) => {
                const counter = { value: 0 };
                gsap.to(counter, {
                  value: Number(element.dataset.count),
                  duration: 1.5,
                  ease: 'power2.out',
                  onUpdate: () => {
                    element.textContent = Math.round(counter.value).toLocaleString('en-US');
                  },
                });
              });
            });
            revealObserver.unobserve(target);
          });
        },
        { rootMargin: '0px 0px -5% 0px' },
      );
      root.current
        .querySelectorAll('[data-reveal]')
        .forEach((element) => revealObserver.observe(element));
      gsap.to('.timeline-track > span', {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.timeline', start: 'top 70%', end: 'bottom 70%', scrub: 0.5 },
      });
      gsap.to('.reading-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: document.documentElement, start: 0, end: 'max', scrub: 0.2 },
      });
      ScrollTrigger.refresh();
    }, root);
    return () => {
      revealObserver?.disconnect();
      root.current?.classList.remove('motion-ready');
      context.revert();
    };
  }, [loaded, reducedMotion]);

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <div ref={root} className="portfolio">
          <a className="skip-link" href="#main">
            Skip to content
          </a>
          <Navbar
            accent={accent}
            onAccentChange={() => setAccent((value) => (value === 'silver' ? 'orange' : 'silver'))}
          />
          <main id="main">
            <Hero accent={accent} reducedMotion={reducedMotion} />
            <About />
            <Experiment accent={accent} reducedMotion={reducedMotion} />
            <Projects />
            <Timeline />
            <Skills />
          </main>
          <Contact />
          <Cursor disabled={reducedMotion} />
          {!loaded && <Loader onComplete={finishLoading} reducedMotion={reducedMotion} />}
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
