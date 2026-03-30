import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug } from "@/lib/wordpress";
import { sanitizeWordPressHtml } from "@/lib/sanitizeHtml";
import { getMetadataBase, SITE_NAME } from "@/lib/seo";

function excerptFromHtml(html: string, max = 160): string {
  const text = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.length <= max ? text : `${text.slice(0, max - 1)}…`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Blog" };

  const description = excerptFromHtml(post.content);
  const path = `/blogs/${post.slug}`;
  const base = getMetadataBase();
  const url = new URL(path, base);
  const title = `${post.title} | ${SITE_NAME}`;

  return {
    title,
    description,
    alternates: { canonical: url.toString() },
    openGraph: {
      type: "article",
      url: url.toString(),
      title,
      description,
      siteName: SITE_NAME,
      locale: "en_US",
      publishedTime: post.date,
      ...(post.featuredImageUrl && { images: [{ url: post.featuredImageUrl, alt: post.title }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(post.featuredImageUrl && { images: [post.featuredImageUrl] }),
    },
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#2a7a7c] text-white">
      <article className="mx-auto max-w-3xl px-8 pt-[90px] pb-20 md:px-10 md:pb-24">
        <Link
          href="/blogs"
          className="mb-8 mt-16 inline-block text-sm text-white/80 underline underline-offset-2 hover:text-white md:mt-20"
        >
          ← Back to Blog
        </Link>

        {post.featuredImageUrl && (
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl">
            <Image
              src={post.featuredImageUrl}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
              unoptimized={post.featuredImageUrl.includes("quick.rootholdings")}
            />
          </div>
        )}

        <header className="mt-8">
          <p className="text-white/70" style={{ fontSize: "13px" }}>
            {post.dateFormatted}
          </p>
          <h1 className="mt-2 font-normal leading-tight text-white" style={{ fontSize: "21px" }}>
            {post.title}
          </h1>
          <p className="mt-2 text-sm text-white/70">{post.readTime}</p>
        </header>

        <div
          className="blog-article-content mt-8"
          dangerouslySetInnerHTML={{ __html: sanitizeWordPressHtml(post.content) }}
        />
      </article>
    </main>
  );
}
