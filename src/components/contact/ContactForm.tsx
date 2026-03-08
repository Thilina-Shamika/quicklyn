"use client";

import { useState } from "react";

const inputBase =
  "w-full border-0 border-b border-white bg-transparent pb-2 text-white focus:border-white focus:outline-none focus:ring-0 [&::placeholder]:text-[12px] [&::placeholder]:text-[rgba(245,245,245,0.21)]";
const labelBase = "block font-medium text-white";
const labelStyle = { fontSize: "12px" };

export function ContactForm({ layout = "mobile" }: { layout?: "mobile" | "desktop" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setStatus("sent");
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const isDesktop = layout === "desktop";

  if (isDesktop) {
    return (
      <form onSubmit={handleSubmit} className="flex h-full min-h-[320px] flex-col">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-name-desktop" className={labelBase} style={{ ...labelStyle, fontSize: "16px" }}>
              Name*
            </label>
            <input
              id="contact-name-desktop"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Carter"
              className={`mt-1 ${inputBase}`}
              required
            />
          </div>
          <div>
            <label htmlFor="contact-email-desktop" className={labelBase} style={{ ...labelStyle, fontSize: "16px" }}>
              Email*
            </label>
            <input
              id="contact-email-desktop"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Johncarter@Gmail.Com"
              className={`mt-1 ${inputBase}`}
              required
            />
          </div>
        </div>
        <div className="mt-8">
          <label htmlFor="contact-message-desktop" className={labelBase} style={{ ...labelStyle, fontSize: "16px" }}>
            Message
          </label>
          <textarea
            id="contact-message-desktop"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type Your Message Here"
            rows={4}
            className={`mt-1 resize-none ${inputBase}`}
            required
          />
        </div>
        {status === "sent" && (
          <p className="mt-4 text-sm text-white/90">Thank you. Your message has been sent.</p>
        )}
        {status === "error" && (
          <p className="mt-4 text-sm text-red-200">Something went wrong. Please try again.</p>
        )}
        <div className="mt-auto flex justify-end pt-8">
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex items-center gap-2 text-lg font-medium uppercase tracking-wide text-white transition hover:text-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-70"
          >
            SEND
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md space-y-6">
      <div>
        <label htmlFor="contact-name" className={labelBase} style={labelStyle}>
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Carter"
          className={`mt-1 ${inputBase}`}
          required
        />
      </div>
      <div>
        <label htmlFor="contact-email" className={labelBase} style={labelStyle}>
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="johncarter@gmail.com"
          className={`mt-1 ${inputBase}`}
          required
        />
      </div>
      <div>
        <label htmlFor="contact-message" className={labelBase} style={labelStyle}>
          Message
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Please write your message here"
          rows={4}
          className={`mt-1 w-full resize-none ${inputBase}`}
          required
        />
      </div>
      {status === "sent" && (
        <p className="text-sm text-white/90">Thank you. Your message has been sent.</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-200">Something went wrong. Please try again.</p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center gap-2 rounded-lg bg-[#3a9a9c] px-6 py-3 font-semibold text-white shadow transition hover:bg-[#349092] focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-70"
      >
        SEND
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
        </svg>
      </button>
    </form>
  );
}
