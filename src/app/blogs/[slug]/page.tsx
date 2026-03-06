import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug } from "@/lib/wordpress";
import { sanitizeWordPressHtml } from "@/lib/sanitizeHtml";

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
              alt=""
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
