import { cn } from "@/lib/utils";
import {
  isLikelyServiceLandingHtml,
  sanitizeServiceLandingWysiwyg,
  SERVICE_LANDING_RICH_TEXT_LINK_CLASS,
} from "@/lib/sanitizeHtml";

export { isLikelyServiceLandingHtml };

type Props = {
  content: string;
  className?: string;
};

/** Sanitized WYSIWYG: visible links, `href` values mapped to Next.js paths where applicable. */
export function ServiceLandingRichText({ content, className }: Props) {
  const html = sanitizeServiceLandingWysiwyg(content);
  if (!html) return null;
  return (
    <div
      className={cn(SERVICE_LANDING_RICH_TEXT_LINK_CLASS, "[&_p:last-child]:mb-0", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
