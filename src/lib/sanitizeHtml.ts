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

