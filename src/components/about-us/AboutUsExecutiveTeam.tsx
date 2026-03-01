"use client";

import { useEffect, useRef, useState } from "react";
import type { AboutUsTeamMember } from "@/types/wordpress";

const TRANSITION_MS = 500;

interface AboutUsExecutiveTeamProps {
  team: AboutUsTeamMember[];
  layout?: "mobile" | "desktop";
}

function MemberCard({
  photoUrl,
  name,
  designation,
  index,
}: {
  photoUrl: string | undefined;
  name: string;
  designation: string;
  index: number;
}) {
  if (!name && !designation && !photoUrl) return null;
  return (
    <div key={index} className="flex flex-col items-center text-center">
      {photoUrl && (
        <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-full border-2 border-[#D9D9D9] bg-gray-200 lg:h-52 lg:w-52">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photoUrl}
            alt={name || "Team member"}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      {!photoUrl && (
        <div className="h-48 w-48 shrink-0 rounded-full border-2 border-[#D9D9D9] bg-white/10 lg:h-52 lg:w-52" aria-hidden />
      )}
      {name && (
        <p
          className="mt-4 font-semibold text-white"
          style={{ fontSize: "20px", lineHeight: "28px" }}
        >
          {name}
        </p>
      )}
      {designation && (
        <p
          className="mt-1 max-w-[240px] text-white/95"
          style={{ fontSize: "14px", lineHeight: "20px" }}
        >
          {designation}
        </p>
      )}
    </div>
  );
}

export function AboutUsExecutiveTeam({ team, layout = "mobile" }: AboutUsExecutiveTeamProps) {
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

  if (layout === "desktop") {
    return (
      <section ref={sectionRef} className="mt-16 w-full pb-16 lg:mt-20 lg:pb-20">
        {/* Title between horizontal lines */}
        <div className="flex items-center gap-6">
          <span className="h-px flex-1 bg-white/40" aria-hidden />
          <h2
            className="text-center font-medium text-white"
            style={{ fontSize: "clamp(32px,4vw,42px)", lineHeight: "1.2" }}
          >
            Executive Team
          </h2>
          <span className="h-px flex-1 bg-white/40" aria-hidden />
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-12">
          {team.map((member, index) => {
            const photoUrl =
              member.profile_picture &&
              typeof member.profile_picture === "object" &&
              "url" in member.profile_picture
                ? (member.profile_picture as { url?: string }).url
                : undefined;
            const name = (member.name || "").trim();
            const designation = (member.designation || "").trim();
            return (
              <MemberCard
                key={index}
                photoUrl={photoUrl}
                name={name}
                designation={designation}
                index={index}
              />
            );
          })}
        </div>
      </section>
    );
  }

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
