"use client";

import { useEffect, useState } from "react";

interface HeroMissionTextProps {
  missionHeading: string;
  missionParagraphs: string[];
  missionDescription: string;
}

export function HeroMissionText({
  missionHeading,
  missionParagraphs,
  missionDescription,
}: HeroMissionTextProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(t);
  }, []);

  const show = visible;

  return (
    <div
      className="mt-6 max-w-xl px-4 text-center transition-all duration-300 ease-out md:mt-8"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "scale(1)" : "scale(0.92)",
        pointerEvents: show ? "auto" : "none",
        visibility: show ? "visible" : "hidden",
      }}
    >
      {missionHeading && (
        <h2
          className="font-semibold"
          style={{ fontSize: "32px", lineHeight: "1.25" }}
        >
          {missionHeading}
        </h2>
      )}
      {missionDescription && (
        <div className="mt-3 space-y-2 text-sm leading-relaxed text-white/95 md:mt-4 md:text-base">
          {missionParagraphs.length > 0 ? (
            missionParagraphs.map((p, i) => (
              <p key={i}>{p.trim()}</p>
            ))
          ) : (
            <p>{missionDescription}</p>
          )}
        </div>
      )}
    </div>
  );
}
