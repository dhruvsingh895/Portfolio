// Small, local brand marks keep social links independent of external icon CDNs.
export function Github({ size = 24, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M9 19c-4.3 1.3-4.3-2.2-6-2.7M15 22v-3.4c0-1 .1-1.4-.5-2 3.3-.4 6.7-1.6 6.7-7.2a5.6 5.6 0 0 0-1.5-3.9 5.2 5.2 0 0 0-.1-3.9S18.4 1.2 15.5 3a13.4 13.4 0 0 0-7 0C5.6 1.2 4.4 1.6 4.4 1.6a5.2 5.2 0 0 0-.1 3.9 5.6 5.6 0 0 0-1.5 3.9c0 5.6 3.4 6.8 6.7 7.2-.5.5-.6 1.1-.5 2V22" />
    </svg>
  );
}
export function Linkedin({ size = 24, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="8" width="4" height="13" />
      <circle cx="5" cy="3.5" r="2" />
      <path d="M11 21V8h4v2c1-3 6-3 6 2v9h-4v-8c0-2-2-2-2 0v8z" />
    </svg>
  );
}
