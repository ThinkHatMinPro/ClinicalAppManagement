export default function HeartbeatLine({ className = "" }) {
  const path =
    "M0 30 H90 L100 30 L110 8 L120 52 L130 18 L138 30 H300";

  return (
    <svg
      viewBox="0 0 300 60"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} opacity="0.25" />
      <path d={path} pathLength="100" strokeDasharray="30 70">
        <animate
          attributeName="stroke-dashoffset"
          from="100"
          to="0"
          dur="2.4s"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}