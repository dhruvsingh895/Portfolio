export default function Monogram({ className = '' }) {
  return (
    <svg className={`ds-mark ${className}`} viewBox="0 0 80 64" fill="none" aria-hidden="true">
      <path d="M9 12H24L37 25V39L24 52H9V12Z" stroke="currentColor" strokeWidth="6" strokeLinejoin="miter" />
      <path d="M70 12H51L43 20V27L65 37V44L57 52H39" stroke="currentColor" strokeWidth="6" strokeLinejoin="miter" />
    </svg>
  );
}
