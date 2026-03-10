"use client";

import { useMemo, useState } from "react";

const inputBase =
  "w-full border-0 border-b border-white/60 bg-transparent pb-2 text-white placeholder:text-white/25 focus:border-white focus:outline-none focus:ring-0";

type DeliveryMethod = "e-gift" | "physical";

export function GiftCardsForm() {
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("e-gift");

  const amounts = useMemo(
    () => [
      { label: "One Bedroom Apt | $70.00", value: "70" },
      { label: "Two Bedroom Apt | $95.00", value: "95" },
      { label: "Three Bedroom Apt | $120.00", value: "120" },
      { label: "Custom", value: "custom" },
    ],
    [],
  );

  return (
    <form className="mx-auto w-full max-w-[820px] rounded-[28px] bg-white/0 px-4 pb-10 pt-8 text-white md:px-8 md:pt-10">
      <h2
        className="text-left font-normal tracking-tight text-white"
        style={{ fontSize: "55px", lineHeight: "34px" }}
      >
        Gift Info
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/80">
            Receiver&apos;s Name*
          </label>
          <input className={inputBase} placeholder="John Carter" required />
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/80">
            Gift Card Amount*
          </label>
          <select
            className={`${inputBase} appearance-none pr-8`}
            defaultValue={amounts[0].value}
            required
          >
            {amounts.map((a) => (
              <option key={a.value} value={a.value} className="text-black">
                {a.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none relative -mt-6 flex justify-end pr-1" aria-hidden>
            <svg
              className="h-4 w-4 text-white/80"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/80">
            Receiver&apos;s Email*
          </label>
          <input className={inputBase} type="email" placeholder="johncarter@gmail.com" required />
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/80">
            Personalized Message (optional)
          </label>
          <input className={inputBase} placeholder="Write a note…" />
        </div>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-2">
        <div className="md:pr-8">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/80">
            Sender Info
          </p>
        </div>
        <div />

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/80">
            Sender&apos;s Name*
          </label>
          <input className={inputBase} placeholder="John Carter" required />
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/80">
            Delivery Method*
          </label>
          <div className="mt-3 flex items-center gap-8 text-white/90">
            <label className="flex items-center gap-2 text-[12px]">
              <input
                type="radio"
                name="deliveryMethod"
                value="e-gift"
                checked={deliveryMethod === "e-gift"}
                onChange={() => setDeliveryMethod("e-gift")}
                className="h-4 w-4 accent-white"
              />
              E-Gift
            </label>
            <label className="flex items-center gap-2 text-[12px]">
              <input
                type="radio"
                name="deliveryMethod"
                value="physical"
                checked={deliveryMethod === "physical"}
                onChange={() => setDeliveryMethod("physical")}
                className="h-4 w-4 accent-white"
              />
              Physical Card
            </label>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/80">
            Sender&apos;s Email*
          </label>
          <input className={inputBase} type="email" placeholder="johncarter@gmail.com" required />
        </div>

        <div>
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-white/80">
            Delivery Date*
          </label>
          <input className={inputBase} type="date" required />
        </div>
      </div>

      <div className="mt-10 flex justify-end">
        <button
          type="button"
          className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-white transition hover:text-white/90 focus:outline-none focus:ring-0"
        >
          Next
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </button>
      </div>
    </form>
  );
}

