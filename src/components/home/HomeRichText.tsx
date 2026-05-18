import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import {
  isLikelyServiceLandingHtml,
  sanitizeServiceLandingWysiwyg,
} from "@/lib/sanitizeHtml";

export { isLikelyServiceLandingHtml };

type Props = {
  content: string;
  className?: string;
  style?: CSSProperties;
};

/** Sanitized home WYSIWYG; link styles via `.home-wysiwyg` in globals.css. */
export function HomeRichText({ content, className, style }: Props) {
  const html = sanitizeServiceLandingWysiwyg(content);
  if (!html) return null;
  return (
    <div
      className={cn("home-wysiwyg", "[&_p:last-child]:mb-0", className)}
      style={style}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
