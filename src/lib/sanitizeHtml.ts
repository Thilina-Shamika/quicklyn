import sanitizeHtml from "sanitize-html";
import { getSiteUrl, mapWordPressUrlToNextPath } from "@/lib/wordpress";

/** Heuristic: string contains HTML tags from the CMS rich text / WYSIWYG. */
export function isLikelyServiceLandingHtml(text: string | null | undefined): boolean {
  if (!text) return false;
  return /<\s*[a-z][\s\S]*?>/i.test(text);
}

function isExternalHttpHref(href: string): boolean {
  if (!/^https?:\/\//i.test(href)) return false;
  try {
    const site = new URL(getSiteUrl());
    const link = new URL(href);
    return link.origin !== site.origin;
  } catch {
    return true;
  }
}

/**
 * Sanitize WYSIWYG HTML for service landings and map WP / frontend URLs in `href` to Next paths.
 */
export function sanitizeServiceLandingWysiwyg(html: string | null | undefined): string {
  if (!html) return "";

  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
    ]),
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      "*": ["class", "style"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowProtocolRelative: false,
    transformTags: {
      a: (_tagName, attribs) => {
        const raw = (attribs.href ?? "").trim();
        const next: Record<string, string> = { ...attribs };

        if (!raw || raw === "#") {
          next.href = "#";
          return { tagName: "a", attribs: next };
        }

        if (/^(mailto:|tel:)/i.test(raw)) {
          return { tagName: "a", attribs: next };
        }

        const mapped = mapWordPressUrlToNextPath(raw);
        next.href = mapped;
        delete next.style;

        if (isExternalHttpHref(mapped)) {
          next.target = "_blank";
          const rel = (attribs.rel ?? "").toLowerCase();
          if (!rel.includes("noopener")) {
            next.rel = attribs.rel
              ? `${attribs.rel} noopener noreferrer`
              : "noopener noreferrer";
          }
        } else {
          delete next.target;
          delete next.rel;
        }

        return { tagName: "a", attribs: next };
      },
    },
  });
}

/**
 * Sanitize WordPress HTML content before rendering with dangerouslySetInnerHTML.
 * Keeps basic formatting but strips scripts, iframes, and unsafe attributes.
 */
export function sanitizeWordPressHtml(html: string | undefined | null): string {
  if (!html) return "";

  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "img",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
    ]),
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "width", "height"],
      "*": ["class", "style"],
    },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowProtocolRelative: false,
  });
}

/**
 * Decodes a few common HTML entities when WordPress/ACF stores inline markup in a text field.
 */
export function decodeCommonWpHtmlEntities(s: string): string {
  if (!s.includes("&")) return s;
  return s
    .split("&amp;")
    .join("&#0AMP0;")
    .split("&lt;")
    .join("<")
    .split("&gt;")
    .join(">")
    .split("&#0AMP0;")
    .join("&")
    .replace(/&nbsp;/g, " ");
}

/**
 * One-line service landing heading: inline emphasis only (<strong>, <b>, <i>, <em>).
 */
export function sanitizeServiceLandingHeadingLine(
  html: string | null | undefined,
): string {
  if (!html) return "";
  return sanitizeHtml(html, {
    allowedTags: ["strong", "b", "i", "em"],
    allowedAttributes: {},
  });
}

/**
 * Service landing section 6 heading: line breaks + inline emphasis.
 */
export function sanitizeServiceLandingSection6Heading(
  html: string | null | undefined,
): string {
  if (!html) return "";
  return sanitizeHtml(html, {
    allowedTags: ["strong", "b", "i", "em", "br"],
    allowedAttributes: {},
  });
}

