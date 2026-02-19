"use client";

import { useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      // Replace with your form submission endpoint (e.g. WordPress form handler or third-party)
      await new Promise((r) => setTimeout(r, 800));
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-md space-y-6">
      <div>
        <label htmlFor="contact-name" className="block font-medium text-white" style={{ fontSize: "12px" }}>
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Carter"
          className="mt-1 w-full border-0 border-b border-white bg-transparent pb-2 text-white focus:border-white focus:outline-none focus:ring-0 [&::placeholder]:text-[12px] [&::placeholder]:text-[rgba(245,245,245,0.21)]"
          required
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="block font-medium text-white" style={{ fontSize: "12px" }}>
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="johncarter@gmail.com"
          className="mt-1 w-full border-0 border-b border-white bg-transparent pb-2 text-white focus:border-white focus:outline-none focus:ring-0 [&::placeholder]:text-[12px] [&::placeholder]:text-[rgba(245,245,245,0.21)]"
          required
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="block font-medium text-white" style={{ fontSize: "12px" }}>
          Message
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Please write your message here"
          rows={4}
          className="mt-1 w-full resize-none border-0 border-b border-white bg-transparent pb-2 text-white focus:border-white focus:outline-none focus:ring-0 [&::placeholder]:text-[12px] [&::placeholder]:text-[rgba(245,245,245,0.21)]"
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
