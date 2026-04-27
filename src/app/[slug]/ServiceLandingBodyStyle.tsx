"use client";

import { useEffect } from "react";

const BG = "#2a7a7c";

/** Clears root layout body background image so the service landing uses a solid surface only. */
export function ServiceLandingBodyStyle() {
  useEffect(() => {
    const prev = document.body.style.cssText;
    document.body.style.backgroundImage = "none";
    document.body.style.backgroundColor = BG;
    document.body.style.backgroundRepeat = "";
    document.body.style.backgroundSize = "";
    document.body.style.backgroundPosition = "";
    return () => {
      document.body.style.cssText = prev;
    };
  }, []);
  return null;
}
