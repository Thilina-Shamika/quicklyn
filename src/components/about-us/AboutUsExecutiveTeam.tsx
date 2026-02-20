"use client";

import { useEffect, useRef, useState } from "react";
import type { AboutUsTeamMember } from "@/types/wordpress";

const TRANSITION_MS = 500;

interface AboutUsExecutiveTeamProps {
  team: AboutUsTeamMember[];
}

export function AboutUsExecutiveTeam({ team }: AboutUsExecutiveTeamProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const transition = `opacity ${TRANSITION_MS}ms ease-out, transform ${TRANSITION_MS}ms ease-out`;
  const opacity = inView ? 1 : 0.2;
  const transform = inView ? "translateY(-16px)" : "translateY(0)";

  return (
    <section
      ref={sectionRef}
      className="mx-auto mt-16 w-full max-w-[300px] px-4"
      style={{
        opacity,
        transform,
        transition,
      }}
    >
      <h2
        className="text-center font-normal text-white"
        style={{ fontSize: "38px", lineHeight: "42px" }}
      >
        Executive
        <br />
        Team
      </h2>
      <div className="mt-8 flex flex-col gap-8">
        {team.map((member, index) => {
          const photoUrl =
            member.profile_picture &&
            typeof member.profile_picture === "object" &&
            "url" in member.profile_picture
              ? (member.profile_picture as { url?: string }).url
              : undefined;
          const name = (member.name || "").trim();
          const designation = (member.designation || "").trim();
          if (!name && !designation && !photoUrl) return null;
          return (
            <div key={index} className="flex items-center gap-5">
              {photoUrl && (
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-white/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoUrl}
                    alt={name || "Team member"}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex min-w-0 flex-col">
                {name && (
                  <p
                    className="font-semibold text-white"
                    style={{ fontSize: "16px" }}
                  >
                    {name}
                  </p>
                )}
                {designation && (
                  <p
                    className="mt-1 text-white/90 italic"
                    style={{ fontSize: "12px" }}
                  >
                    {designation}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
