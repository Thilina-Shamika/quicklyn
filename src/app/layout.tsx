import type { Metadata } from "next";
import { getFooter, getAppLink } from "@/lib/wordpress";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quicklyn | Premium Cleaning Services in NYC",
  description:
    "Trusted, vetted cleaning professionals delivering consistent, white-glove service across NYC.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [footer, appLink] = await Promise.all([getFooter(), getAppLink()]);

  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased">
        {children}
        <Footer data={footer} appLink={appLink} />
      </body>
    </html>
  );
}
