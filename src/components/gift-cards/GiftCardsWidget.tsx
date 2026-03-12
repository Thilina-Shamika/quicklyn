"use client";

import { useEffect } from "react";

export function GiftCardsWidget() {
  useEffect(() => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-quicklyn-launch27="true"]',
    );
    if (existing) return;

    const script = document.createElement("script");
    script.src = "https://quicklyn.launch27.com/jsbundle";
    script.async = true;
    script.dataset.quicklynLaunch27 = "true";
    document.body.appendChild(script);
  }, []);

  return (
    <div className="w-full">
      <iframe
        id="booking-widget-iframe"
        src="https://quicklyn.launch27.com/giftcards/new?w"
        style={{
          border: "none",
          width: "100%",
          minHeight: "1260px",
          overflow: "hidden",
        }}
        scrolling="no"
      />
    </div>
  );
}

