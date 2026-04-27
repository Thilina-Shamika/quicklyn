import sanitizeHtml from "sanitize-html";

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

