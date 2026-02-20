import type {
  WPImage,
  WPPage,
  HomePageACF,
  OurServicesPage,
  ContactUsPage,
  CareersPage,
  TermsAndConditionsPage,
  OurMissionPage,
  AboutUsPage,
  WPPostRaw,
} from "@/types/wordpress";
import { fallbackHomePage } from "./fallback-home";

const WORDPRESS_URL = process.env.WORDPRESS_URL ?? "http://quicklyn-headless.local";

export function getWordPressUrl(): string {
  return WORDPRESS_URL.replace(/\/$/, "");
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
    image_01?: WPImage;
    link_01?: { title: string; url: string; target: string };
    image_02?: WPImage;
    link_02?: string;
    booking_text?: string;
    booking_link?: { title: string; url: string; target: string };
    description?: string;
    background_image?: WPImage;
    back_image?: WPImage;
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
    subscription_text?: string;
    download_text?: string;
    copyright_and_branding?: string;
    footer_background?: WPImage;
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

export interface WPHeader {
  id: number;
  slug: string;
  title: { rendered: string };
  acf: {
    header_logo?: WPImage;
  };
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
