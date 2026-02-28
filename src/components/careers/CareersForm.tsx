"use client";

import { useState } from "react";

const PREFERRED_LOCATIONS = ["Queens", "Manhattan", "Brooklyn", "Bronx", "Staten Island"];
const AVAILABILITY_OPTIONS = ["Fulltime", "Part-time", "Flexible"];

const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function CareersForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("");
  const [availability, setAvailability] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setResumeFile(null);
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      e.target.value = "";
      setResumeFile(null);
      return;
    }
    setResumeFile(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      // Replace with your form submission endpoint
      await new Promise((r) => setTimeout(r, 800));
      setStatus("sent");
      setFirstName("");
      setLastName("");
      setContactNumber("");
      setEmail("");
      setPreferredLocation("");
      setAvailability("");
      setResumeFile(null);
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-lg rounded-2xl border border-white/10 bg-white/5 px-8 py-10 shadow-inner backdrop-blur-sm md:px-10 md:py-12"
    >
      <h2
        className="text-left font-semibold tracking-tight text-white"
        style={{ fontSize: "33px", lineHeight: "31px" }}
      >
        READY TO JOIN?
      </h2>
      <p className="mt-2 text-left text-sm text-white/90 md:text-base">
        Fill Out The Form Below. We&apos;ll Get Back To You Quickly!
      </p>
      <div className="mt-6 border-t border-dashed border-white/30 pt-6" aria-hidden />

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div>
          <label htmlFor="careers-first-name" className="block text-sm font-medium text-white">
            First Name
          </label>
          <input
            id="careers-first-name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            className="mt-1 w-full border-0 border-b border-white/40 bg-transparent pb-2 text-white placeholder:text-white/50 focus:border-white focus:outline-none focus:ring-0"
            required
          />
        </div>
        <div>
          <label htmlFor="careers-last-name" className="block text-sm font-medium text-white">
            Last Name
          </label>
          <input
            id="careers-last-name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Drew"
            className="mt-1 w-full border-0 border-b border-white/40 bg-transparent pb-2 text-white placeholder:text-white/50 focus:border-white focus:outline-none focus:ring-0"
            required
          />
        </div>
      </div>

      <div className="mt-6">
        <label htmlFor="careers-contact" className="block text-sm font-medium text-white">
          Contact Number
        </label>
        <input
          id="careers-contact"
          type="tel"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          placeholder="+1 2344 4567 899"
          className="mt-1 w-full border-0 border-b border-white/40 bg-transparent pb-2 text-white placeholder:text-white/50 focus:border-white focus:outline-none focus:ring-0"
          required
        />
      </div>

      <div className="mt-6">
        <label htmlFor="careers-email" className="block text-sm font-medium text-white">
          Email
        </label>
        <input
          id="careers-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="myemail@gmail.com"
          className="mt-1 w-full border-0 border-b border-white/40 bg-transparent pb-2 text-white placeholder:text-white/50 focus:border-white focus:outline-none focus:ring-0"
          required
        />
      </div>

      <div className="relative mt-6">
        <label htmlFor="careers-location" className="block text-sm font-medium text-white">
          Preferred Location
        </label>
        <select
          id="careers-location"
          value={preferredLocation}
          onChange={(e) => setPreferredLocation(e.target.value)}
          className="mt-1 w-full appearance-none border-0 border-b border-white/40 bg-transparent pb-2 pr-8 text-white focus:border-white focus:outline-none focus:ring-0 [&>option]:bg-[#1f6b6d]"
          required
        >
          <option value="" className="text-white/50">
            Select location
          </option>
          {PREFERRED_LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute bottom-2 right-0 h-4 w-4 text-white/70" aria-hidden>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>

      <div className="relative mt-6">
        <label htmlFor="careers-availability" className="block text-sm font-medium text-white">
          Availability
        </label>
        <select
          id="careers-availability"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
          className="mt-1 w-full appearance-none border-0 border-b border-white/40 bg-transparent pb-2 pr-8 text-white focus:border-white focus:outline-none focus:ring-0 [&>option]:bg-[#1f6b6d]"
          required
        >
          <option value="" className="text-white/50">
            Select availability
          </option>
          {AVAILABILITY_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute bottom-2 right-0 h-4 w-4 text-white/70" aria-hidden>
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>

      <div className="mt-8">
        <p className="block text-sm font-medium text-white">Upload Your Resume</p>
        <label
          htmlFor="careers-resume"
          className="mt-2 flex cursor-pointer flex-wrap items-center gap-3 rounded-xl border-2 border-dashed border-white/40 bg-white/5 px-4 py-4 transition hover:border-white/60 hover:bg-white/10"
        >
          <svg className="h-6 w-6 shrink-0 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="text-sm text-white">
            {resumeFile ? resumeFile.name : "Choose A File To Upload"}
          </span>
          <span className="h-4 w-px bg-white/30" aria-hidden />
          <span className="text-sm text-white/80">PDF Format Upto 50 Mb</span>
          <input
            id="careers-resume"
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className="sr-only"
          />
        </label>
      </div>

      {status === "sent" && (
        <p className="mt-4 text-sm text-white/90">Thank you. We&apos;ll get back to you soon.</p>
      )}
      {status === "error" && (
        <p className="mt-4 text-sm text-red-200">Something went wrong. Please try again.</p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 font-bold uppercase tracking-wide text-[#2a7a7c] shadow transition hover:bg-white/95 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-70"
      >
        Submit
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
        </svg>
      </button>
    </form>
  );
}
