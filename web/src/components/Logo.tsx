type Props = { size?: number; variant?: "brand" | "ink" | "white" };

export function Logo({ size = 56, variant = "ink" }: Props) {
  const fill = variant === "brand" ? "var(--brand)" : variant === "white" ? "#fff" : "var(--ink)";
  const shirt = variant === "white" ? "var(--ink)" : "var(--brand)";
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="LOOK logo">
      {/* Clothing tag */}
      <path
        d="M22 6 L46 6 C50 6 53 9 53 13 L53 52 C53 56 50 59 46 59 L18 59 C14 59 11 56 11 52 L11 17 C11 14.5 12 12.2 13.7 10.5 L18.5 5.7 C19.5 4.7 21 6 22 6 Z"
        fill={fill}
      />
      {/* Tag hole */}
      <circle cx="18" cy="14" r="2.4" fill="var(--background)" />
      {/* Shirt in center */}
      <path
        d="M24 26 L28 23 L36 23 L40 26 L43 29 L40 32 L38 31 L38 44 C38 45 37 46 36 46 L28 46 C27 46 26 45 26 44 L26 31 L24 32 L21 29 Z M30 23 C30 25 31 26 32 26 C33 26 34 25 34 23"
        fill={shirt}
        stroke={shirt}
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-extrabold tracking-[-0.04em] ${className}`}>
      LOOK<span className="text-brand">.</span>
    </span>
  );
}
