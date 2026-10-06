import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Expand, Minimize2, RotateCcw, Sparkles } from 'lucide-react';
const Scene = lazy(() => import('./Scene'));
export class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export default function SingularityLab({ accent, mobile, reducedMotion, active }) {
  const stage = useRef(null);
  const controls = useRef({
    down: false,
    dragged: false,
    start: 0,
    x: 0,
    y: 0,
    yaw: 0,
    pitch: 0,
    pulse: 0,
  });
  const [mount, setMount] = useState(false),
    [ready, setReady] = useState(false),
    [mode, setMode] = useState('solid');
  const [exploded, setExploded] = useState(false),
    [fullscreen, setFullscreen] = useState(false);
  const [fullscreenAvailable] = useState(() => !!document.documentElement.requestFullscreen);
  const onReady = useCallback(() => setReady(true), []);
  useEffect(() => {
    let timer;
    const enter = () => {
      controls.current.enterStart = performance.now();
      timer = setTimeout(() => {
        controls.current.enterStart = 0;
      }, 1800);
    };
    window.addEventListener('portfolio:enter-workspace', enter);
    return () => {
      window.removeEventListener('portfolio:enter-workspace', enter);
      clearTimeout(timer);
    };
  }, []);
  useEffect(() => {
    if (reducedMotion || mobile) return;
    const timer = setTimeout(() => setMount(true), 450);
    return () => clearTimeout(timer);
  }, [reducedMotion, mobile]);
  useEffect(() => {
    const onChange = () => {
      const full = document.fullscreenElement === stage.current;
      setFullscreen(full);
      window.dispatchEvent(new CustomEvent('portfolio:modal', { detail: full }));
    };
    const release = () => {
      controls.current.down = false;
      stage.current?.classList.remove('is-charging');
    };
    document.addEventListener('fullscreenchange', onChange);
    window.addEventListener('blur', release);
    return () => {
      document.removeEventListener('fullscreenchange', onChange);
      window.removeEventListener('blur', release);
    };
  }, []);
  function pointerDown(event) {
    if (event.target.closest('button') || !mount || reducedMotion || event.button > 0) return;
    const input = controls.current;
    input.down = true;
    input.dragged = false;
    input.start = performance.now();
    input.x = event.clientX;
    input.y = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
    stage.current.classList.add('is-charging');
  }
  function pointerMove(event) {
    const input = controls.current;
    if (!input.down) return;
    const dx = event.clientX - input.x,
      dy = event.clientY - input.y;
    if (Math.abs(dx) + Math.abs(dy) > 2) input.dragged = true;
    input.yaw += dx * 0.008;
    input.pitch = Math.max(-1.2, Math.min(1.2, input.pitch + dy * 0.006));
    input.x = event.clientX;
    input.y = event.clientY;
    if (input.dragged) stage.current.classList.remove('is-charging');
  }
  function release(event) {
    const input = controls.current;
    if (input.down && !input.dragged && performance.now() - input.start < 280)
      input.pulse = performance.now();
    input.down = false;
    stage.current.classList.remove('is-charging');
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  }
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else {
        setMount(true);
        await stage.current.requestFullscreen();
      }
    } catch {
      stage.current.scrollIntoView({
        behavior: reducedMotion ? 'instant' : 'smooth',
        block: 'center',
      });
    }
  }
  return (
    <div
      ref={stage}
      className={`scene-stage ${ready && !reducedMotion ? 'scene-loaded' : ''} ${fullscreen ? 'is-fullscreen' : ''}`}
      role="group"
      aria-label="Singularity Lab, interactive 3D sculpture"
      data-mode={mode}
      data-exploded={exploded}
      onPointerDown={pointerDown}
      onPointerMove={pointerMove}
      onPointerUp={release}
      onPointerCancel={release}
    >
      <div className="lab-atmosphere" aria-hidden="true">
        <div className="lab-aura" />
        <div className="lab-reticle reticle-one" />
        <div className="lab-reticle reticle-two" />
      </div>
      <div className="lab-fullscreen-heading">
        <span className="mono">DHRUV SINGH / EXPERIMENT 001</span>
        <h2>
          Singularity<span> Lab.</span>
        </h2>
        <p>A little curiosity goes a long way.</p>
      </div>
      <div className="hero-art" aria-hidden="true">
        <img
          className="sculpture-poster"
          src="/sculpture.webp"
          width="720"
          height="594"
          alt=""
          fetchPriority="high"
        />
        {mount && !reducedMotion && (
          <SceneBoundary>
            <Suspense fallback={null}>
              <Scene
                accent={accent}
                mobile={mobile}
                active={active || fullscreen}
                onReady={onReady}
                mode={mode}
                controls={controls}
                exploded={exploded}
              />
            </Suspense>
          </SceneBoundary>
        )}
      </div>
      {!reducedMotion && (
        <div className="lab-interface">
          {!mount ? (
            <button className="lab-activate" onClick={() => setMount(true)}>
              Interact in 3D <ArrowUpRight size={13} />
            </button>
          ) : (
            <>
              <div className="lab-modes" role="group" aria-label="Sculpture material">
                {[
                  ['solid', 'Chrome'],
                  ['wire', 'Wireframe'],
                  ['field', 'Particles'],
                ].map(([value, label], i) => (
                  <button key={value} onClick={() => setMode(value)} aria-pressed={mode === value}>
                    <span>0{i + 1}</span>
                    {label}
                  </button>
                ))}
              </div>
              <div className="lab-tools">
                <button
                  className={`lab-burst ${exploded ? 'active' : ''}`}
                  aria-pressed={exploded}
                  onClick={() => setExploded(!exploded)}
                >
                  <Sparkles size={13} />
                  {exploded ? 'Reassemble' : 'Disassemble'}
                </button>
                <button
                  aria-label="Reset sculpture rotation"
                  title="Reset rotation"
                  onClick={() => {
                    controls.current.yaw = 0;
                    controls.current.pitch = 0;
                    setExploded(false);
                  }}
                >
                  <RotateCcw size={14} />
                </button>
                {fullscreenAvailable && (
                  <button
                    onClick={toggleFullscreen}
                    aria-label={
                      fullscreen ? 'Exit fullscreen playground' : 'Enter fullscreen playground'
                    }
                    title={fullscreen ? 'Exit fullscreen' : 'Enter the playground'}
                  >
                    {fullscreen ? <Minimize2 size={15} /> : <Expand size={15} />}
                  </button>
                )}
              </div>
            </>
          )}
          {mount && (
            <span className="lab-hint">
              DRAG TO ROTATE <i /> HOLD TO DISASSEMBLE
            </span>
          )}
        </div>
      )}
      <div className="charge-indicator" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}
