import type { ReactNode } from "react";
import { ServiceLandingBodyStyle } from "./ServiceLandingBodyStyle";

export default function ServiceLandingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <ServiceLandingBodyStyle />
      {children}
    </>
  );
}
