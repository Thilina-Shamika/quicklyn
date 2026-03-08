import { NextResponse } from "next/server";
import { getWordPressUrl } from "@/lib/wordpress";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;
    if (!name || typeof name !== "string" || !email || typeof email !== "string" || !message || typeof message !== "string") {
      return NextResponse.json({ success: false, message: "Invalid data." }, { status: 400 });
    }
    const base = getWordPressUrl();
    const res = await fetch(`${base}/wp-json/quicklyn-contact/v1/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: (data && data.message) || "Could not send message." },
        { status: res.status }
      );
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ success: false, message: "Something went wrong." }, { status: 500 });
  }
}
