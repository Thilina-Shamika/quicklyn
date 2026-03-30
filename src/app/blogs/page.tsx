import { buildPageMetadata } from "@/lib/seo";
import { getPosts } from "@/lib/wordpress";
import { BlogCard } from "@/components/blogs/BlogCard";

const BLOG_TITLE = "Blog";
const BLOG_SUBTITLE =
  "Articles, Guides, And Home Care Insights For An Easier Home.";

export const metadata = buildPageMetadata({
  title: "Blog | Quicklyn",
  description:
    "Cleaning tips, home care guides, and insights from Quicklyn — NYC’s premium cleaning service.",
  path: "/blogs",
});

export default async function BlogsPage() {
  const posts = await getPosts();

  const [featuredPost, ...otherPosts] = posts;

  return (
    <main className="min-h-screen bg-[#2a7a7c] text-white">
      {/* Mobile layout - keep existing behavior */}
      <header className="px-6 pb-12 pt-24 text-center md:hidden">
        <h1
          className="mt-12 font-bold tracking-tight"
          style={{ fontSize: "93px" }}
        >
          {BLOG_TITLE}
        </h1>
        <p
          className="mx-auto mt-3 max-w-xl text-white/90"
          style={{ fontSize: "12px" }}
        >
          {BLOG_SUBTITLE}
        </p>
      </header>

      <section className="px-6 pb-20 md:hidden">
        <div className="mx-auto grid max-w-4xl gap-8">
          {posts.length === 0 ? (
            <p className="text-center text-white/80">
              No posts yet. Check back later.
            </p>
          ) : (
            posts.map((post) => <BlogCard key={post.id} post={post} />)
          )}
        </div>
      </section>

      {/* Desktop / tablet layout */}
      <div className="hidden md:block">
        {/* Hero section with featured post */}
        <section className="px-10 pb-16 pt-28 lg:px-16 lg:pt-32">
          <div className="mx-auto max-w-6xl">
            {/* Top row: Blog heading + subtitle, centered with horizontal lines */}
            <div className="mt-10 lg:mt-12">
              <div className="flex items-center justify-center gap-6 lg:gap-10">
                {/* Left horizontal line */}
                <span
                  className="hidden h-px w-20 shrink-0 bg-white/35 md:block lg:w-28"
                  aria-hidden
                />
                <h1
                  className="text-left font-semibold tracking-tight text-white"
                  style={{ fontSize: "142px", lineHeight: "142px" }}
                >
                  Blog
                </h1>
                <p
                  className="max-w-md text-left text-white/90"
                  style={{ fontSize: "24px", lineHeight: "36px" }}
                >
                  {BLOG_SUBTITLE}
                </p>
                {/* Right horizontal line */}
                <span
                  className="hidden h-px w-20 shrink-0 bg-white/35 md:block lg:w-28"
                  aria-hidden
                />
              </div>
            </div>

            {/* Featured post card */}
            {featuredPost && (
              <article className="mt-10 overflow-hidden rounded-3xl border border-[#76aaab] bg-[#1f6b6d]">
                <div className="grid gap-0 lg:grid-cols-[1.4fr_1.6fr] lg:items-stretch">
                  {/* Left: featured text */}
                  <div className="flex flex-col justify-center px-10 py-10 lg:px-12 lg:py-12">
                    <p
                      className="text-white/75"
                      style={{ fontSize: "13px", lineHeight: "18px" }}
                    >
                      {featuredPost.dateFormatted}
                    </p>
                    <h2
                      className="mt-2 text-left font-semibold leading-snug text-white"
                      style={{ fontSize: "22px", lineHeight: "30px" }}
                    >
                      {featuredPost.title}
                    </h2>
                    {featuredPost.shortDescription && (
                      <p
                        className="mt-3 text-left text-white/85"
                        style={{ fontSize: "14px", lineHeight: "22px" }}
                      >
                        {featuredPost.shortDescription}
                      </p>
                    )}
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                      <a
                        href={`/blogs/${featuredPost.slug}`}
                        className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#ffda00] underline decoration-[#ffda00] underline-offset-2 transition hover:opacity-90"
                      >
                        Read More
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          aria-hidden
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 17L17 7M17 7H7M17 7v10"
                          />
                        </svg>
                      </a>
                      <span className="inline-flex items-center gap-1.5 text-[13px] text-white/80">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          aria-hidden
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {featuredPost.readTime}
                      </span>
                    </div>
                  </div>

                  {/* Right: featured image */}
                  <div className="relative h-[300px] bg-[#195b5d] lg:h-[360px]">
                    {featuredPost.featuredImageUrl ? (
                      <a
                        href={`/blogs/${featuredPost.slug}`}
                        className="absolute inset-0 overflow-hidden"
                        aria-label={featuredPost.title}
                      >
                        <div className="relative h-full w-full">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={featuredPost.featuredImageUrl}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </a>
                    ) : (
                      <div className="h-full w-full bg-[#2a7a7c]" />
                    )}
                  </div>
                </div>
              </article>
            )}
          </div>
        </section>

        {/* Remaining posts in 3-column grid */}
        <section className="px-10 pb-24 lg:px-16">
          <div className="mx-auto max-w-6xl">
            {posts.length === 0 ? (
              <p className="text-center text-white/80">
                No posts yet. Check back later.
              </p>
            ) : otherPosts.length === 0 ? null : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10">
                {otherPosts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
