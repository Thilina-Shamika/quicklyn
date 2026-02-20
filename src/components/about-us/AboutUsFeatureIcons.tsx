"use client";

/** Lightning bolt with lines - Frictionless Booking */
export function IconFrictionlessBooking({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 14h6l-4 12 8-10h-6l4-12-8 10z" />
      <line x1="14" y1="24" x2="14" y2="24.5" strokeWidth="1" />
      <line x1="10" y1="24" x2="10" y2="24.5" strokeWidth="1" />
      <line x1="6" y1="24" x2="6" y2="24.5" strokeWidth="1" />
    </svg>
  );
}

/** Hand with shield and check - Trust & Transparency */
export function IconTrustTransparency({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M24 12v28M14 22c0-4 4-8 10-8s10 4 10 8" />
      <path d="M12 18c-2 2-2 6-2 10s2 6 4 8" />
      <path d="M36 18c2 2 2 6 2 10s-2 6-4 8" />
      <path d="M24 8l-8 4v6c0 4 3 8 8 8s8-4 8-8v-6l-8-4z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" />
      <path d="M20 14l4 4 8-8" strokeWidth="2" />
    </svg>
  );
}

/** People with growth arrow - Flexibility for Scale */
export function IconFlexibilityScale({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="16" cy="18" r="5" />
      <circle cx="32" cy="18" r="5" />
      <path d="M10 34c0-4 2.5-8 6-8s6 4 6 8" />
      <path d="M26 34c0-4 2.5-8 6-8s6 4 6 8" />
      <path d="M32 22h8l4 8-4 4-4-12" strokeWidth="2" />
    </svg>
  );
}
