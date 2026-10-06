import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Loader({ onComplete, reducedMotion }) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(20);
  useEffect(() => {
    let cancelled = false;
    const finish = async () => {
      await Promise.race([
        document.fonts.ready,
        new Promise((resolve) => setTimeout(resolve, 900)),
      ]);
      if (cancelled) return;
      setProgress(100);
      gsap.to(ref.current, {
        opacity: 0,
        duration: reducedMotion ? 0 : 0.45,
        delay: reducedMotion ? 0 : 0.15,
        onComplete,
      });
    };
    finish();
    return () => {
      cancelled = true;
      gsap.killTweensOf(ref.current);
    };
  }, [onComplete, reducedMotion]);
  return (
    <div className="loader" ref={ref} aria-hidden="true">
      <span className="loader-logo">
        d<span>.</span>
      </span>
      <div className="loader-bottom">
        <span className="mono">ASSEMBLING A LITTLE PERSPECTIVE</span>
        <span className="mono">{progress.toString().padStart(3, '0')}%</span>
      </div>
      <div className="loader-line">
        <span style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
