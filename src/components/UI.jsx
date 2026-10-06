import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { m, useMotionValue, useSpring } from 'framer-motion';

export function Magnetic({ children, className = '', as = 'a', ...props }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 18 });
  const springY = useSpring(y, { stiffness: 180, damping: 18 });
  const Element = as === 'button' ? m.button : m.a;
  function onMove(event) {
    if (!window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches)
      return;
    const rect = ref.current.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.13);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.16);
  }
  return (
    <Element
      ref={ref}
      className={className}
      style={{ x: springX, y: springY }}
      onPointerMove={onMove}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      {...props}
    >
      {children}
    </Element>
  );
}

export function SectionLabel({ number, children }) {
  return (
    <div className="section-label">
      <span className="section-number">{number}</span>
      <span>{children}</span>
    </div>
  );
}

export function ExternalLink({ children, className = '', ...props }) {
  return (
    <a className={className} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export function TextLink({ children, ...props }) {
  return (
    <ExternalLink className="text-link" {...props}>
      {children}
      <ArrowUpRight size={16} aria-hidden="true" />
    </ExternalLink>
  );
}
