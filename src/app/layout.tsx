import type { Metadata } from "next";
import { getFooter, getAppLink, getHeader, getSocialLinks, getFaviconUrl } from "@/lib/wordpress";
import { Footer } from "@/components/Footer";
import { GlobalHeader } from "@/components/GlobalHeader";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { OrganizationJsonLd } from "@/components/seo/OrganizationJsonLd";
import { DEFAULT_DESCRIPTION, getMetadataBase, SITE_NAME } from "@/lib/seo";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const faviconUrl = await getFaviconUrl();
  const defaultTitle = `${SITE_NAME} | Premium Cleaning Services in NYC`;
  return {
    metadataBase: getMetadataBase(),
    /** Plain default; child routes override. Avoid title template merging oddities in Google. */
    title: defaultTitle,
    description: DEFAULT_DESCRIPTION,
    alternates: { canonical: "/" },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "/",
      siteName: SITE_NAME,
      title: defaultTitle,
      description: DEFAULT_DESCRIPTION,
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description: DEFAULT_DESCRIPTION,
    },
    ...(faviconUrl && { icons: { icon: faviconUrl } }),
  };
}

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
      <head>
        <GoogleAnalytics />
      </head>
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
        <OrganizationJsonLd />
        <GlobalHeader header={header} />
        {children}
        <Footer data={footer} appLink={appLink} socialLinks={socialLinks} />
      </body>
    </html>
  );
}
