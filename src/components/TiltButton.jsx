import { useRef } from 'react';
import gsap from 'gsap';

// The stable outer card supplies the pointer bounds; only the preview tilts.
export default function TiltButton({ children, className = '', ...props }) {
  const ref = useRef(null),
    bounds = useRef(null);
  const enabled = () =>
    window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches;
  function move(event) {
    if (!enabled()) return;
    const rect = bounds.current || ref.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    gsap.to(ref.current, {
      rotateX: (0.5 - y) * 13,
      rotateY: (x - 0.5) * 15,
      transformPerspective: 1100,
      scale: 1.012,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto',
    });
    ref.current.style.setProperty('--shine-x', `${x * 100}%`);
    ref.current.style.setProperty('--shine-y', `${y * 100}%`);
  }
  function leave() {
    bounds.current = null;
    gsap.to(ref.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.8,
      ease: 'elastic.out(1, 0.65)',
      overwrite: 'auto',
    });
  }
  return (
    <button
      ref={ref}
      className={`${className} tilt-button`}
      onPointerEnter={() => (bounds.current = ref.current.getBoundingClientRect())}
      onPointerMove={move}
      onPointerLeave={leave}
      {...props}
    >
      {children}
      <span className="project-shine" aria-hidden="true" />
    </button>
  );
}
