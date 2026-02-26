import type { Metadata } from "next";
import { getFooter, getAppLink, getHeader, getSocialLinks } from "@/lib/wordpress";
import { Footer } from "@/components/Footer";
import { GlobalHeader } from "@/components/GlobalHeader";
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
  const [footer, appLink, header, socialLinks] = await Promise.all([
    getFooter(),
    getAppLink(),
    getHeader(),
    getSocialLinks(),
  ]);

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className="font-sans antialiased"
        style={
          appLink?.acf?.back_image_desktop?.url ||
          appLink?.acf?.back_image?.url
            ? {
                backgroundColor: "#2a7a7c",
                backgroundImage: `url(${
                  appLink.acf.back_image_desktop?.url ||
                  appLink.acf.back_image?.url
                })`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "top center",
              }
            : undefined
        }
      >
        <GlobalHeader header={header} />
        {children}
        <Footer data={footer} appLink={appLink} socialLinks={socialLinks} />
      </body>
    </html>
  );
}
