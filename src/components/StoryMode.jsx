import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, ChevronLeft, Pause, Play, X } from 'lucide-react';
import { profile, projects } from '../data';
import '../story.css';

const StoryScene = lazy(() => import('./StoryScene'));
const chapters = {
  origin: {
    label: '01 / THE SPARK',
    title: 'Every idea starts with a signal.',
    copy: 'Inside the mind of Dhruv Singh. A journey from curiosity to intelligence—and from intelligence to things you can use.',
    duration: 12,
  },
  choice: {
    label: '02 / THE CROSSROADS',
    title: 'Follow your curiosity.',
    copy: 'One mind. Two ways of seeing the world. Choose where this story takes you.',
  },
  city: {
    label: 'SYSTEMS / CONNECTED',
    title: 'Give complexity a place.',
    copy: 'Seat Allocation System connects people, workspaces, and projects. Next.js, FastAPI, PostgreSQL, and an AI-assisted query layer.',
    duration: 16,
    project: 0,
  },
  vision: {
    label: 'INTELLIGENCE / IN MOTION',
    title: 'Teach machines to see.',
    copy: 'Traffic Vision turns moving vehicles into detections and counts with YOLOv8 and OpenCV. Patterns emerge from the noise.',
    duration: 16,
    project: 1,
  },
  workspace: {
    label: 'ENGINEERING / IN FLOW',
    title: 'Turn intent into progress.',
    copy: 'Taskflow brings tasks, boards, and teams into a shared workspace. React meets Node.js, Express, and MongoDB.',
    duration: 16,
    project: 2,
  },
  finale: {
    label: 'THE NEXT CHAPTER / UNWRITTEN',
    title: 'Let’s build what comes next.',
    copy: 'Intelligence. Engineering. A little imagination. The next idea could be yours.',
    duration: 10,
  },
};
class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="story-fallback" aria-hidden="true">
        ◇
      </div>
    ) : (
      this.props.children
    );
  }
}
export default function StoryMode({ accent, reducedMotion, onClose }) {
  const dialog = useRef(null);
  const [route, setRoute] = useState(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const [elapsed, setElapsed] = useState(0);
  const sequence =
    route === 'intelligence'
      ? ['origin', 'choice', 'vision', 'city', 'workspace', 'finale']
      : ['origin', 'choice', 'city', 'workspace', 'vision', 'finale'];
  const scene = sequence[index],
    chapter = chapters[scene];
  const active = !paused && !hidden && !reducedMotion && scene !== 'choice' && scene !== 'finale';
  useEffect(() => {
    const element = dialog.current,
      previous = document.activeElement;
    element.showModal();
    document.documentElement.classList.add('modal-open');
    window.dispatchEvent(new CustomEvent('portfolio:modal', { detail: true }));
    const visibility = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      element.close();
      document.removeEventListener('visibilitychange', visibility);
      document.documentElement.classList.remove('modal-open');
      window.dispatchEvent(new CustomEvent('portfolio:modal', { detail: false }));
      previous?.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => {
    setElapsed(0);
  }, [index, route]);
  useEffect(() => {
    if (!active) return;
    let last = performance.now();
    const timer = setInterval(() => {
      const now = performance.now(),
        delta = Math.min((now - last) / 1000, 0.3);
      last = now;
      setElapsed((value) => value + delta);
    }, 100);
    return () => clearInterval(timer);
  }, [active, index]);
  useEffect(() => {
    if (active && elapsed >= chapter.duration) {
      setElapsed(0);
      setIndex((value) => Math.min(value + 1, 5));
    }
  }, [active, elapsed, chapter.duration]);
  function contact() {
    onClose();
    requestAnimationFrame(() => {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'instant' });
      document.querySelector('#contact a[href^="mailto:"]')?.focus({ preventScroll: true });
    });
  }
  return createPortal(
    <dialog
      className="story-dialog"
      ref={dialog}
      aria-labelledby="story-title"
      data-lenis-prevent
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="story-film" data-scene={scene}>
        <div className="story-cut" key={`cut-${scene}`} aria-hidden="true" />
        <div className="story-visual" aria-hidden="true">
          <SceneBoundary>
            <Suspense fallback={<div className="story-fallback">◇</div>}>
              <StoryScene
                scene={scene}
                accent={accent}
                reducedMotion={reducedMotion}
                playing={!paused && !hidden && !reducedMotion}
              />
            </Suspense>
          </SceneBoundary>
        </div>
        <div className="story-vignette" aria-hidden="true" />
        <header className="story-header">
          <span>
            DS / INSIDE A DEVELOPER’S MIND<small>AN INTERACTIVE SHORT FILM</small>
          </span>
          <button onClick={onClose} aria-label="Close Story Mode" autoFocus>
            <X size={22} />
          </button>
        </header>
        <div className="story-copy" key={scene} aria-live="polite" aria-atomic="true">
          <p className="story-kicker">{chapter.label}</p>
          <h2 id="story-title">{chapter.title}</h2>
          <p className="story-description">{chapter.copy}</p>
          {scene === 'choice' && (
            <div className="story-paths">
              <button
                onClick={() => {
                  setRoute('intelligence');
                  setIndex(2);
                }}
              >
                <span>01 / PERCEPTION</span>
                <strong>
                  Explore intelligence <ArrowRight size={20} />
                </strong>
                <small>Vision → Systems → Software</small>
              </button>
              <button
                onClick={() => {
                  setRoute('engineering');
                  setIndex(2);
                }}
              >
                <span>02 / CREATION</span>
                <strong>
                  Explore engineering <ArrowRight size={20} />
                </strong>
                <small>Systems → Software → Vision</small>
              </button>
            </div>
          )}
          {chapter.project !== undefined && (
            <a
              className="story-project"
              href={projects[chapter.project].github}
              target="_blank"
              rel="noopener noreferrer"
            >
              Explore {projects[chapter.project].name} <ArrowRight size={16} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
          {scene === 'finale' && (
            <div className="story-final-actions">
              <button onClick={contact}>
                Start a conversation <ArrowRight size={18} />
              </button>
              <a href={profile.github} target="_blank" rel="noopener noreferrer">
                Explore my GitHub<span className="sr-only"> (opens in a new tab)</span>
              </a>
              <button
                onClick={() => {
                  setIndex(0);
                  setRoute(null);
                  setPaused(false);
                }}
              >
                Replay film
              </button>
            </div>
          )}
        </div>
        <footer className="story-controls">
          <div className="story-progress" role="group" aria-label={`Chapter ${index + 1} of 6`}>
            {sequence.map((key, i) => (
              <span key={key} className={i < index ? 'complete' : ''}>
                <i
                  style={{
                    transform: `scaleX(${i < index ? 1 : i === index ? Math.max(0.04, Math.min(1, elapsed / (chapter.duration || 1))) : 0})`,
                  }}
                />
              </span>
            ))}
          </div>
          <div className="story-control-row">
            <span className="story-route">
              {reducedMotion
                ? 'MANUAL · REDUCED MOTION'
                : route
                  ? `${route.toUpperCase()} ROUTE`
                  : '70 SECONDS · SOUNDLESS'}
            </span>
            <div>
              <button
                onClick={() => setIndex((value) => Math.max(0, value - 1))}
                disabled={index === 0}
                aria-label="Previous chapter"
              >
                <ChevronLeft size={19} />
              </button>
              {!reducedMotion && (
                <button
                  onClick={() => setPaused((value) => !value)}
                  aria-label={paused ? 'Play film' : 'Pause film'}
                  aria-pressed={paused}
                >
                  {paused ? <Play size={18} /> : <Pause size={18} />}
                </button>
              )}
              {scene !== 'choice' && scene !== 'finale' && (
                <button onClick={() => setIndex((value) => value + 1)} aria-label="Next chapter">
                  <ArrowRight size={20} />
                </button>
              )}
              {scene !== 'finale' && (
                <button className="story-skip" onClick={() => setIndex(5)}>
                  Skip to finale
                </button>
              )}
            </div>
          </div>
        </footer>
      </div>
    </dialog>,
    document.body,
  );
}
