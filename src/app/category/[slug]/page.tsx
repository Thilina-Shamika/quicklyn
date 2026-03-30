import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo";
import { getCategoryBySlug, getPostsByCategoryId } from "@/lib/wordpress";
import { BlogCard } from "@/components/blogs/BlogCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category" };
  return buildPageMetadata({
    title: `${category.name} | Quicklyn Blog`,
    description: `Articles in the ${category.name} category.`,
    path: `/category/${slug}`,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const posts = await getPostsByCategoryId(category.id);

  return (
    <main className="min-h-screen bg-[#2a7a7c] text-white">
      <header className="px-6 pb-12 pt-24 text-center md:pt-28">
        <h1 className="mt-12 font-bold tracking-tight" style={{ fontSize: "93px" }}>
          {category.name}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-white/90" style={{ fontSize: "12px" }}>
          {posts.length} {posts.length === 1 ? "article" : "articles"} in this category
        </p>
      </header>

      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.length === 0 ? (
            <p className="col-span-full text-center text-white/80">
              No posts in this category yet.
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
