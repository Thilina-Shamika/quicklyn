import { notFound } from "next/navigation";
import Link from "next/link";
import { getTagBySlug, getPostsByTagId } from "@/lib/wordpress";
import { BlogCard } from "@/components/blogs/BlogCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) return { title: "Tag" };
  return {
    title: `${tag.name} | Quicklyn Blog`,
    description: `Articles tagged with ${tag.name}.`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) notFound();

  const posts = await getPostsByTagId(tag.id);

  return (
    <main className="min-h-screen bg-[#2a7a7c] text-white">
      <header className="px-6 pb-12 pt-24 text-center md:pt-28">
        <h1 className="mt-12 font-bold tracking-tight" style={{ fontSize: "93px" }}>
          {tag.name}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-white/90" style={{ fontSize: "12px" }}>
          {posts.length} {posts.length === 1 ? "article" : "articles"} with this tag
        </p>
      </header>

      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.length === 0 ? (
            <p className="col-span-full text-center text-white/80">
              No posts with this tag yet.
            </p>
          ) : (
            posts.map((post) => <BlogCard key={post.id} post={post} />)
          )}
        </div>
      </section>

      <div className="px-6 pb-12 text-center">
        <Link
          href="/blogs"
          className="text-sm text-white/80 underline underline-offset-2 hover:text-white"
        >
          ← Back to Blog
        </Link>
      </div>
    </main>
  );
}
