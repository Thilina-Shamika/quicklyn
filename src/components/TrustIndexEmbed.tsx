"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export const TRUSTINDEX_LOADER_SRC =
  "https://cdn.trustindex.io/loader.js?6497e26716dc984eb846b82a01e";

type Props = {
  className?: string;
};

/** Injects TrustIndex loader; widget replaces the script in-place. */
export function TrustIndexEmbed({ className }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || mount.querySelector('script[src*="cdn.trustindex.io/loader.js"]')) {
      return;
    }

    const script = document.createElement("script");
    script.src = TRUSTINDEX_LOADER_SRC;
    script.defer = true;
    script.async = true;
    mount.appendChild(script);

    return () => {
      mount.replaceChildren();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={cn(
        "relative z-0 mx-auto w-full min-h-[120px] max-w-[1180px]",
        className,
      )}
    />
  );
}
