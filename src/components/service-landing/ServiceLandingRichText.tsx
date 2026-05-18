import { cn } from "@/lib/utils";
import {
  isLikelyServiceLandingHtml,
  sanitizeServiceLandingWysiwyg,
} from "@/lib/sanitizeHtml";

export { isLikelyServiceLandingHtml };

type Props = {
  content: string;
  className?: string;
};

/** Sanitized WYSIWYG: link colors/underline via `.service-landing-rich-text` in globals.css (production-safe). */
export function ServiceLandingRichText({ content, className }: Props) {
  const html = sanitizeServiceLandingWysiwyg(content);
  if (!html) return null;
  return (
    <div
      className={cn("service-landing-rich-text", "[&_p:last-child]:mb-0", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
