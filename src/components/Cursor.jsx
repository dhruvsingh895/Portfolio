import { useEffect, useRef } from 'react';

export default function Cursor({ disabled }) {
  const cursor = useRef(null);
  useEffect(() => {
    if (disabled || !window.matchMedia('(pointer: fine)').matches) return;
    const el = cursor.current;
    let targetX = -100,
      targetY = -100,
      currentX = -100,
      currentY = -100,
      frame;
    const move = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      el.style.opacity = '1';
    };
    const over = (event) => {
      const project = event.target.closest('[data-cursor]');
      el.classList.toggle('cursor-project', !!project);
      el.classList.toggle('cursor-link', !!event.target.closest('a, button'));
      el.textContent = project ? project.dataset.cursor : '';
    };
    const leave = () => {
      el.style.opacity = '0';
    };
    const tick = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      el.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    document.addEventListener('mouseleave', leave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      document.removeEventListener('mouseleave', leave);
    };
  }, [disabled]);
  return disabled ? null : <div className="custom-cursor" ref={cursor} aria-hidden="true" />;
}
