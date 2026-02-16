export default function GamepadIcon({ size = 28, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path d="M52 18H12C5.4 18 0 23.4 0 30v4c0 6.6 5.4 12 12 12h4.7c2.3 0 4.4-1.3 5.5-3.3L26 36h12l3.8 6.7c1.1 2 3.2 3.3 5.5 3.3H52c6.6 0 12-5.4 12-12v-4c0-6.6-5.4-12-12-12zM20 34h-4v4h-4v-4H8v-4h4v-4h4v4h4v4zm18-2c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3zm10 6c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3zm0-10c-1.7 0-3-1.3-3-3s1.3-3 3-3 3 1.3 3 3-1.3 3-3 3zm6 4c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
    </svg>
  );
}
