// Swappable logo. Replace the inner markup with an <img> when the final logo file arrives.
export function Logo({ className = "", size = "md" }: { className?: string; size?: "md" | "xl" }) {
  const text = size === "xl" ? "text-4xl sm:text-6xl md:text-7xl" : "text-lg";
  return (
    <span className={`inline-flex items-baseline gap-2 font-display ${text} ${className}`} aria-label="MENA AQUA Tru">
      <span className="font-semibold tracking-tight text-aqua">MENA AQUA</span>
      <span className="font-light text-wordmark-grey">Tru</span>
    </span>
  );
}
