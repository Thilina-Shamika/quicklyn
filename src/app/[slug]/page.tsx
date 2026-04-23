import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServiceLandingBySlug } from "@/lib/wordpress";
import { ServiceLandingFirstSection } from "@/components/service-landing/ServiceLandingFirstSection";
import { buildPageMetadata, SITE_NAME } from "@/lib/seo";

function excerptPlain(text: string, max = 160): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getServiceLandingBySlug(slug);
  if (!post?.acf) {
    return { title: "Not found" };
  }

  const title = post.title.rendered.trim() || post.acf["1st_section_heading"] || slug;
  const descSource =
    post.acf["1st_section_description_1"] ||
    post.acf["1st_section_description_2"] ||
    "";
  const description = descSource
    ? excerptPlain(descSource)
    : `Professional cleaning services from ${SITE_NAME}.`;
  const path = `/${post.slug}`;

  const meta = buildPageMetadata({ title, description, path });
  const imageUrl = post.acf["1st_section_image"]?.url;
  if (imageUrl) {
    return {
      ...meta,
      openGraph: {
        ...meta.openGraph,
        images: [{ url: imageUrl, alt: post.acf["1st_section_image"]?.alt || title }],
      },
      twitter: {
        ...meta.twitter,
        card: "summary_large_image",
        images: [imageUrl],
      },
    };
  }
  return meta;
}

export default async function ServiceLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getServiceLandingBySlug(slug);

  if (!post?.acf) {
    notFound();
  }

  const acf = post.acf;
  const heading = acf["1st_section_heading"]?.trim() || post.title.rendered;
  const description1 = acf["1st_section_description_1"]?.trim() ?? "";
  const description2 = acf["1st_section_description_2"]?.trim() ?? "";
  const image = acf["1st_section_image"];

  return (
    <main className="m-0 min-h-screen pb-0">
      <ServiceLandingFirstSection
        heading={heading}
        description1={description1}
        description2={description2}
        image={image}
      />
    </main>
  );
}
