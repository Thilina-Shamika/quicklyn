import type {
  WPImage,
  WPLink,
  WPPage,
  HomePageACF,
  OurServicesPage,
  ContactUsPage,
  CareersPage,
  TermsAndConditionsPage,
  PrivacyPolicyPage,
  GiftCardsPage,
  OurMissionPage,
  AboutUsPage,
  BookACleaningPage,
  WPGetEstimate,
  WPPostRaw,
  WPServiceLanding,
  WPSiteTitle,
} from "@/types/wordpress";
import { fallbackHomePage } from "./fallback-home";

const WORDPRESS_URL = process.env.WORDPRESS_URL ?? "http://quicklyn-headless.local";
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? "https://quicklyn.com").replace(/\/$/, "");

export function getWordPressUrl(): string {
  return WORDPRESS_URL.replace(/\/$/, "");
}

/** Frontend base URL for sitemaps, canonical URLs, etc. */
export function getSiteUrl(): string {
  return SITE_URL;
}

export function getApiUrl(path: string): string {
  return `${getWordPressUrl()}/wp-json/wp/v2${path}`;
}

export async function getHomePage(): Promise<WPPage | null> {
  try {
    const res = await fetch(getApiUrl("/pages?slug=home&acf_format=standard"), {
      next: { revalidate: 60 },
    });
    if (!res.ok) return fallbackHomePage;
    const data: WPPage[] = await res.json();
    return data[0] ?? fallbackHomePage;
  } catch {
    return fallbackHomePage;
  }
}

export async function getOurServicesPage(): Promise<OurServicesPage | null> {
  try {
    const res = await fetch(
      getApiUrl("/pages?slug=our-services&acf_format=standard"),
      {
        next: { revalidate: 60 },
      },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as OurServicesPage[];
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch {
    return null;
  }
}

export async function getContactUsPage(): Promise<ContactUsPage | null> {
  try {
    const res = await fetch(
      getApiUrl("/pages?slug=contact-us&acf_format=standard"),
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as ContactUsPage[];
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch {
    return null;
  }
}

export async function getCareersPage(): Promise<CareersPage | null> {
  try {
    const res = await fetch(
      getApiUrl("/pages?slug=careers&acf_format=standard"),
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as CareersPage[];
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch {
    return null;
  }
}

export async function getGiftCardsPage(): Promise<GiftCardsPage | null> {
  try {
    const res = await fetch(
      getApiUrl("/pages?slug=gift-cards&acf_format=standard"),
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as GiftCardsPage[];
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch {
    return null;
  }
}

export async function getTermsPage(): Promise<TermsAndConditionsPage | null> {
  try {
    const res = await fetch(
      getApiUrl("/pages?slug=terms-and-conditions&acf_format=standard"),
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as TermsAndConditionsPage[];
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch {
    return null;
  }
}

export async function getPrivacyPolicyPage(): Promise<PrivacyPolicyPage | null> {
  try {
    const res = await fetch(
      getApiUrl("/pages?slug=privacy-policy&acf_format=standard"),
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as PrivacyPolicyPage[];
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch {
    return null;
  }
}

export async function getOurMissionPage(): Promise<OurMissionPage | null> {
  try {
    const res = await fetch(
      getApiUrl("/pages?slug=our-mission&acf_format=standard"),
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as OurMissionPage[];
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch {
    return null;
  }
}

export async function getAboutUsPage(): Promise<AboutUsPage | null> {
  try {
    const res = await fetch(
      getApiUrl("/pages?slug=about-us&acf_format=standard"),
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as AboutUsPage[];
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch {
    return null;
  }
}

export async function getBookACleaningPage(): Promise<BookACleaningPage | null> {
  try {
    const res = await fetch(
      getApiUrl("/pages?slug=book-a-cleaning&acf_format=standard"),
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as BookACleaningPage[];
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch {
    return null;
  }
}

export async function getEstimateConfig(): Promise<WPGetEstimate | null> {
  try {
    const res = await fetch(
      getApiUrl("/get-estimate?acf_format=standard"),
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as WPGetEstimate[];
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch {
    return null;
  }
}

export interface BlogPostItem {
  id: number;
  slug: string;
  title: string;
  link: string;
  date: string;
  dateFormatted: string;
  excerpt: string;
  shortDescription: string;
  readTime: string;
  featuredImageUrl: string | undefined;
}

export interface BlogPostSingle {
  id: number;
  slug: string;
  title: string;
  link: string;
  date: string;
  dateFormatted: string;
  readTime: string;
  featuredImageUrl: string | undefined;
  content: string;
}

export async function getPosts(): Promise<BlogPostItem[]> {
  try {
    const res = await fetch(
      getApiUrl("/posts?acf_format=standard&_embed&per_page=20"),
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as WPPostRaw[];
    if (!Array.isArray(data)) return [];
    return data.map((post) => {
      const media = post._embedded?.["wp:featuredmedia"]?.[0];
      const shortDesc =
        post.acf?.short_description?.trim() ||
        stripHtml(post.excerpt?.rendered ?? "").slice(0, 200);
      const readTime = post.acf?.how_many_minutes_to_read?.trim() || "— Min Read";
      return {
        id: post.id,
        slug: post.slug ?? String(post.id),
        title: stripHtml(post.title?.rendered ?? ""),
        link: post.link ?? "#",
        date: post.date,
        dateFormatted: formatPostDate(post.date),
        excerpt: stripHtml(post.excerpt?.rendered ?? ""),
        shortDescription: shortDesc,
        readTime,
        featuredImageUrl: media?.source_url,
      };
    });
  } catch {
    return [];
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&hellip;|&nbsp;/g, " ").trim();
}

function formatPostDate(iso: string): string {
  try {
    const d = new Date(iso);
    const day = d.getDate();
    const suffix =
      day === 1 || day === 21 || day === 31
        ? "st"
        : day === 2 || day === 22
          ? "nd"
          : day === 3 || day === 23
            ? "rd"
            : "th";
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    return `${day}${suffix} ${months[d.getMonth()]}, ${d.getFullYear()}`;
  } catch {
    return iso;
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPostSingle | null> {
  try {
    const res = await fetch(
      getApiUrl(`/posts?slug=${encodeURIComponent(slug)}&acf_format=standard&_embed`),
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as WPPostRaw[];
    const post = Array.isArray(data) && data.length > 0 ? data[0] : null;
    if (!post) return null;
    const media = post._embedded?.["wp:featuredmedia"]?.[0];
    const readTime = post.acf?.how_many_minutes_to_read?.trim() || "— Min Read";
    return {
      id: post.id,
      slug: post.slug ?? String(post.id),
      title: stripHtml(post.title?.rendered ?? ""),
      link: post.link ?? "#",
      date: post.date,
      dateFormatted: formatPostDate(post.date),
      readTime,
      featuredImageUrl: media?.source_url,
      content: post.content?.rendered ?? "",
    };
  } catch {
    return null;
  }
}

/** All post slugs + modified date for sitemap (paginated fetch). */
export async function getAllPostSlugsForSitemap(): Promise<{ slug: string; modified: string }[]> {
  const out: { slug: string; modified: string }[] = [];
  let page = 1;
  const perPage = 100;
  while (true) {
    const res = await fetch(
      getApiUrl(`/posts?per_page=${perPage}&page=${page}&_fields=slug,modified`),
      { next: { revalidate: 60 } },
    );
    if (!res.ok) break;
    const data = (await res.json()) as Array<{ slug?: string; modified?: string }>;
    if (!Array.isArray(data) || data.length === 0) break;
    for (const p of data) {
      const slug = p.slug ?? String(p);
      if (slug && typeof slug === "string") out.push({ slug, modified: p.modified ?? "" });
    }
    if (data.length < perPage) break;
    page++;
  }
  return out;
}

export interface WPCategorySitemap {
  slug: string;
}

export async function getCategoriesForSitemap(): Promise<WPCategorySitemap[]> {
  try {
    const res = await fetch(
      getApiUrl("/categories?per_page=100&_fields=slug"),
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as Array<{ slug?: string }>;
    if (!Array.isArray(data)) return [];
    return data
      .filter((c) => c.slug && c.slug !== "uncategorized")
      .map((c) => ({ slug: c.slug! }));
  } catch {
    return [];
  }
}

export interface WPTagSitemap {
  slug: string;
}

export async function getTagsForSitemap(): Promise<WPTagSitemap[]> {
  try {
    const res = await fetch(
      getApiUrl("/tags?per_page=100&_fields=slug"),
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as Array<{ slug?: string }>;
    if (!Array.isArray(data)) return [];
    return data.map((c) => ({ slug: c.slug ?? "" })).filter((t) => t.slug);
  } catch {
    return [];
  }
}

/** Fetch posts filtered by category ID (for category archive pages). */
export async function getPostsByCategoryId(categoryId: number): Promise<BlogPostItem[]> {
  try {
    const res = await fetch(
      getApiUrl(`/posts?categories=${categoryId}&acf_format=standard&_embed&per_page=50`),
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as WPPostRaw[];
    if (!Array.isArray(data)) return [];
    return data.map((post) => {
      const media = post._embedded?.["wp:featuredmedia"]?.[0];
      const shortDesc =
        post.acf?.short_description?.trim() ||
        stripHtml(post.excerpt?.rendered ?? "").slice(0, 200);
      const readTime = post.acf?.how_many_minutes_to_read?.trim() || "— Min Read";
      return {
        id: post.id,
        slug: post.slug ?? String(post.id),
        title: stripHtml(post.title?.rendered ?? ""),
        link: post.link ?? "#",
        date: post.date,
        dateFormatted: formatPostDate(post.date),
        excerpt: stripHtml(post.excerpt?.rendered ?? ""),
        shortDescription: shortDesc,
        readTime,
        featuredImageUrl: media?.source_url,
      };
    });
  } catch {
    return [];
  }
}

/** Fetch posts filtered by tag ID (for tag archive pages). */
export async function getPostsByTagId(tagId: number): Promise<BlogPostItem[]> {
  try {
    const res = await fetch(
      getApiUrl(`/posts?tags=${tagId}&acf_format=standard&_embed&per_page=50`),
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as WPPostRaw[];
    if (!Array.isArray(data)) return [];
    return data.map((post) => {
      const media = post._embedded?.["wp:featuredmedia"]?.[0];
      const shortDesc =
        post.acf?.short_description?.trim() ||
        stripHtml(post.excerpt?.rendered ?? "").slice(0, 200);
      const readTime = post.acf?.how_many_minutes_to_read?.trim() || "— Min Read";
      return {
        id: post.id,
        slug: post.slug ?? String(post.id),
        title: stripHtml(post.title?.rendered ?? ""),
        link: post.link ?? "#",
        date: post.date,
        dateFormatted: formatPostDate(post.date),
        excerpt: stripHtml(post.excerpt?.rendered ?? ""),
        shortDescription: shortDesc,
        readTime,
        featuredImageUrl: media?.source_url,
      };
    });
  } catch {
    return [];
  }
}

export interface WPCategory {
  id: number;
  name: string;
  slug: string;
}

export async function getCategoryBySlug(slug: string): Promise<WPCategory | null> {
  try {
    const res = await fetch(getApiUrl(`/categories?slug=${encodeURIComponent(slug)}`), {
      next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{ id: number; name: string; slug: string }>;
    const cat = Array.isArray(data) && data.length > 0 ? data[0] : null;
    return cat ? { id: cat.id, name: cat.name, slug: cat.slug } : null;
  } catch {
    return null;
  }
}

export interface WPTag {
  id: number;
  name: string;
  slug: string;
}

export async function getTagBySlug(slug: string): Promise<WPTag | null> {
  try {
    const res = await fetch(getApiUrl(`/tags?slug=${encodeURIComponent(slug)}`), {
      next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{ id: number; name: string; slug: string }>;
    const tag = Array.isArray(data) && data.length > 0 ? data[0] : null;
    return tag ? { id: tag.id, name: tag.name, slug: tag.slug } : null;
  } catch {
    return null;
  }
}

/** WooCommerce products if available. Returns empty if no products API. */
export async function getProductsForSitemap(): Promise<{ slug: string; modified: string }[]> {
  try {
    const base = getWordPressUrl();
    const res = await fetch(`${base}/wp-json/wc/store/v1/products?per_page=100`, {
      next: { revalidate: 60 } },
    );
    if (!res.ok) return [];
    const data = (await res.json()) as Array<{ slug?: string; date_modified?: string }>;
    if (!Array.isArray(data)) return [];
    return data
      .filter((p) => p.slug)
      .map((p) => ({ slug: p.slug!, modified: p.date_modified ?? "" }));
  } catch {
    return [];
  }
}

export interface ServiceApproximateTimeItem {
  acf_fc_layout?: string;
  type: string;
  hours: string;
}

export interface WPService {
  id: number;
  slug: string;
  title: { rendered: string };
  acf: {
    service_heading: string;
    service_description: string;
    link: {
      title: string;
      url: string;
      target: string;
    };
    service_image?: WPImage;
    whats_included?: string;
    supplies?: string;
    approximate_time_list?: ServiceApproximateTimeItem[];
    hourly_rate?: string;
    note?: string;
    id?: string;
  };
}

export async function getServices(): Promise<WPService[]> {
  try {
    const res = await fetch(getApiUrl("/service?acf_format=standard"), {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data: WPService[] = await res.json();
    return data;
  } catch {
    return [];
  }
}

/**
 * Local marketing / SEO landing pages from the `services` post type
 * (`/wp/v2/services?slug=…`), distinct from the `/service` listing items.
 */
export async function getServiceLandingBySlug(
  slug: string,
): Promise<WPServiceLanding | null> {
  try {
    const res = await fetch(
      getApiUrl(
        `/services?slug=${encodeURIComponent(slug)}&acf_format=standard`,
      ),
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as WPServiceLanding[];
    if (!Array.isArray(data) || data.length === 0) return null;
    return data[0];
  } catch {
    return null;
  }
}

export interface WPTestimonial {
  id: number;
  slug: string;
  title: { rendered: string };
  acf: {
    name: string;
    testimonial: string;
    stars: string;
  };
}

const fallbackTestimonials: WPTestimonial[] = [
  {
    id: 79,
    slug: "hany-y",
    title: { rendered: "Hany Y." },
    acf: {
      name: "Hany Y.",
      testimonial:
        "The young ladies (2) of them showed up early to clean my large apartment. They did a fantastic job and had pleasant personalities. I would recommend Quicklyn for any cleaning job. I will use again in the near future.",
      stars: "5",
    },
  },
  {
    id: 80,
    slug: "tracy-h",
    title: { rendered: "Tracy H." },
    acf: {
      name: "Tracy H.",
      testimonial:
        "Finally, we found a housecleaning service that knows how to clean. And the house was in terrible shape when they arrived. Quicklyn did a fabulous job in record time. The house was sparkling! So happy with their service. Will definitely use them again.",
      stars: "5",
    },
  },
  {
    id: 78,
    slug: "kelly-c",
    title: { rendered: "Kelly C." },
    acf: {
      name: "Kelly C.",
      testimonial:
        "Great responsiveness, on time, good work. Needs an update on materials used to clean.",
      stars: "5",
    },
  },
];

export async function getTestimonials(): Promise<WPTestimonial[]> {
  try {
    const res = await fetch(getApiUrl("/testimonial?acf_format=standard"), {
      next: { revalidate: 60 },
    });
    if (!res.ok) return fallbackTestimonials;
    const data: WPTestimonial[] = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : fallbackTestimonials;
  } catch {
    return fallbackTestimonials;
  }
}

export interface WPFAQ {
  id: number;
  slug: string;
  title: { rendered: string };
  acf: {
    question: string;
    answer_part_01: string;
    link_text_01?: string;
    link01?: { title: string; url: string; target: string };
    link02?: string;
    answer_part_02?: string;
  };
}

const fallbackFaqs: WPFAQ[] = [
  {
    id: 93,
    slug: "how-do-you-charge",
    title: { rendered: "How do you charge?" },
    acf: {
      question: "How do you charge?",
      answer_part_01:
        "we charge a flat hourly rate of $50 per hour, with a 3 hour minimum per booking",
      link_text_01: "Get A Cost Estimate",
      link01: { title: "", url: "#", target: "" },
      answer_part_02:
        "time estimates shown are approximate. You are only charged for the actual time spent on the job, which may be more or less depending on the condition and size of your space. Quicklyn Signature Pro (all-in-one solutions including special requests) is $75 per hour.",
    },
  },
  {
    id: 94,
    slug: "why-do-you-have-a-3-hour-minimum",
    title: { rendered: "Why do you have a 3-hour minimum?" },
    acf: {
      question: "Why do you have a 3-hour minimum?",
      answer_part_01:
        "We require a 3-hour minimum per booking to ensure fair compensation for our cleaning professionals and maintain consistent service quality. Each visit involves travel time and preparation, and our professionals are paid for a minimum of three hours, even if the cleaning itself takes less time. This allows us to work with reliable, experienced cleaners and deliver a high-quality service.",
    },
  },
  {
    id: 95,
    slug: "can-i-book-a-cleaning-without-downloading-the-app",
    title: { rendered: "Can I book a cleaning without downloading the app?" },
    acf: {
      question: "Can I book a cleaning without downloading the app?",
      answer_part_01: "Yes, you can book without the app.",
      link_text_01: "Book a Cleaning",
      link01: { title: "", url: "#", target: "" },
    },
  },
];

export async function getFaqs(): Promise<WPFAQ[]> {
  try {
    const res = await fetch(getApiUrl("/faq?acf_format=standard"), {
      next: { revalidate: 60 },
    });
    if (!res.ok) return fallbackFaqs;
    const data: WPFAQ[] = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : fallbackFaqs;
  } catch {
    return fallbackFaqs;
  }
}

export interface WPAppLink {
  id: number;
  slug: string;
  title: { rendered: string };
  acf: {
    heading?: string;
    sub_heading?: string;
    /** Discount/promo code shown in ribbon (API may return as discount_code, promo_code, or code) */
    discount_code?: string;
    promo_code?: string;
    code?: string;
    code_only?: string;
    image_01?: WPImage;
    link_01?: { title: string; url: string; target: string };
    image_02?: WPImage;
    link_02?: string;
    booking_text?: string;
    booking_link?: { title: string; url: string; target: string };
    description?: string;
    background_image?: WPImage;
    /** Optional mobile-only phone image for download sections */
    mobile_phone_image?: WPImage;
    back_image?: WPImage;
    /** Optional desktop-only background image for Get The App page */
    back_image_desktop?: WPImage;
  };
}

export async function getAppLink(): Promise<WPAppLink | null> {
  try {
    const res = await fetch(getApiUrl("/app-link?acf_format=standard"), {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as WPAppLink[];
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch {
    return null;
  }
}

export interface WPFooterNavItem {
  acf_fc_layout: string;
  menu_name: string;
  page_link: { title: string; url: string; target: string };
}

export interface WPFooter {
  id: number;
  slug: string;
  title: { rendered: string };
  acf: {
    logo?: WPImage;
    footer_description?: string;
    footer_navigation?: WPFooterNavItem[];
    contact_email?: string;
    contact_phone?: string;
    subscription_text?: string;
    download_text?: string;
    copyright_and_branding?: string;
    footer_background?: WPImage;
    footer_background_desktop?: WPImage;
  };
}

export async function getFooter(): Promise<WPFooter | null> {
  try {
    const res = await fetch(getApiUrl("/footer?acf_format=standard"), {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as WPFooter[];
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch {
    return null;
  }
}

export interface WPSocialLink {
  id: number;
  slug: string;
  title: { rendered: string };
  acf: {
    social_media_name?: string;
    social_media_link?: WPLink;
  };
}

export async function getSocialLinks(): Promise<WPSocialLink[]> {
  try {
    const res = await fetch(getApiUrl("/social-links?acf_format=standard"), {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as WPSocialLink[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export interface WPHeaderNavItem {
  acf_fc_layout?: string;
  menu_item_name?: string;
  menu_item_link?: WPLink;
}

export interface WPHeader {
  id: number;
  slug: string;
  title: { rendered: string };
  acf: {
    header_logo?: WPImage;
    /** API typo: navitgation */
    navitgation?: WPHeaderNavItem[];
    menu_description?: string;
    navigation_background?: WPImage;
  };
}

/** Map known WordPress page URLs for this site to Next.js frontend paths.
 * Any URL that is clearly external (different host) is left as-is.
 */
export function mapWordPressUrlToNextPath(wpUrl: string | undefined): string {
  if (!wpUrl || typeof wpUrl !== "string") return "/";
  const u = wpUrl.trim();
  if (!u || u === "#") return "/#estimate";

  try {
    const parsed = new URL(u, "https://example.com");
    const host = parsed.host.toLowerCase();
    const isKnownWpHost =
      !host || // relative URLs
      host.includes("quicklyn-headless.local") ||
      host.includes("quick.rootholdings.com.mv");

    // If this URL is not on a known WordPress host, treat it as external.
    if (!isKnownWpHost) {
      return u;
    }

    const path = parsed.pathname.toLowerCase().replace(/\/$/, "") || "/";

    // Known internal routes – keep using Next.js paths for these
    if (path === "/home" || path === "/") return "/";
    if (path.includes("our-services")) return "/our-services";
    if (path.includes("our-mission")) return "/our-mission";
    if (path.includes("about-us")) return "/about-us";
    if (path.includes("get-the-app")) return "/get-the-app";
    if (path.includes("book-a-cleaning")) return "/book-a-cleaning";
    if (path.includes("contact-us")) return "/contact-us";
    if (path.includes("careers")) return "/careers";
    if (path.includes("gift-cards")) return "/gift-cards";
    // Always send any FAQ page link to the FAQ section on the home page
    if (path.includes("faq")) return "/#faq";
    if (path.includes("terms")) return "/terms-and-conditions";
    if (path.includes("privacy-policy")) return "/privacy-policy";
    if (path.includes("blogs")) return "/blogs";

    // Keep hash for same-page anchors on the home page
    const hash = parsed.hash;
    if (hash && path === "/") return `/${hash}`;

    // For any other WP URL we don't recognize, return the original URL as-is
    return u;
  } catch {
    return u.startsWith("#") ? u : u;
  }
}

export async function getHeader(): Promise<WPHeader | null> {
  try {
    // Fetch header without Next.js caching so logo updates are seen immediately
    const res = await fetch(getApiUrl("/header?acf_format=standard"), {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as WPHeader[];
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch {
    return null;
  }
}

/** Favicon from WordPress favicon endpoint (custom post type with ACF favicon image). */
export async function getFaviconUrl(): Promise<string | null> {
  try {
    const res = await fetch(getApiUrl("/favicon?acf_format=standard"), {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{ acf?: { favicon?: { url?: string } } }>;
    const first = Array.isArray(data) && data.length > 0 ? data[0] : null;
    const url = first?.acf?.favicon?.url?.trim();
    return url || null;
  } catch {
    return null;
  }
}

const FALLBACK_SITE_TITLE_TAGLINE = "Premium Cleaning Services in NYC";

function decodeWpTitleText(html: string): string {
  const noTags = html.replace(/<[^>]*>/g, "");
  return noTags
    .replace(/&#(\d+);/g, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 10)),
    )
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCodePoint(Number.parseInt(hex, 16)),
    )
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

/**
 * Tagline for the default document title: `Quicklyn | {tagline}`.
 * Uses `site-title` CPT, ACF `site_title`, else `title.rendered`, else a static fallback.
 */
export async function getSiteTitleTaglineFromWordPress(): Promise<string> {
  try {
    const res = await fetch(
      getApiUrl(
        "/site-title?per_page=1&status=publish&acf_format=standard&orderby=date&order=desc",
      ),
      { next: { revalidate: 60 } },
    );
    if (!res.ok) return FALLBACK_SITE_TITLE_TAGLINE;
    const data = (await res.json()) as WPSiteTitle[];
    if (!Array.isArray(data) || data.length === 0) {
      return FALLBACK_SITE_TITLE_TAGLINE;
    }
    const first = data[0];
    const fromAcf = first.acf?.site_title?.trim();
    if (fromAcf) return fromAcf;
    const rendered = first.title?.rendered?.trim();
    if (rendered) return decodeWpTitleText(rendered);
    return FALLBACK_SITE_TITLE_TAGLINE;
  } catch {
    return FALLBACK_SITE_TITLE_TAGLINE;
  }
}
