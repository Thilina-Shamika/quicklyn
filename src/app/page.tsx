import Link from "next/link";
import {
  getHomePage,
  getServices,
  getTestimonials,
  getFaqs,
  getAppLink,
  getHeader,
} from "@/lib/wordpress";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ServiceAreasSection } from "@/components/home/ServiceAreasSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FAQSection } from "@/components/home/FAQSection";
import { HomeAppDownloadSection } from "@/components/home/HomeAppDownloadSection";

export default async function HomePage() {
  const [page, services, testimonials, faqs, appLink, header] = await Promise.all([
    getHomePage(),
    getServices(),
    getTestimonials(),
    getFaqs(),
    getAppLink(),
    getHeader(),
  ]);

  if (!page?.acf) {
    return (
      <main className="flex min-h-screen items-center justify-center p-6">
        <p className="text-center text-white/80">
          No home page content found. Ensure WordPress is running and the home
          page with ACF data exists.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#195b5d]">
      <HeroSection data={page.acf} header={header} />
      <ServicesSection
        background={page.acf.section2_background}
        backgroundDesktop={page.acf.section_2_background_desktop}
        counters={page.acf.counter}
        services={services}
        sectionHeading={page.acf.section_heading}
        whyList={page.acf.why_list}
        whyIcon={page.acf.why_icon}
      />
      <ServiceAreasSection data={page.acf} />
      <TestimonialsSection testimonials={testimonials} />
      <FAQSection faqs={faqs} />
      <HomeAppDownloadSection data={appLink} />
      {/* Global floating CTA button above all sections */}
      <Link
        href="/book-a-cleaning"
        className="fixed left-1/2 z-[9999] flex h-12 w-[224px] -translate-x-1/2 items-center justify-center rounded-full bg-[#FFDA00] shadow-xl drop-shadow-[0_6px_16px_rgba(0,0,0,0.45)] transition hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-[#FFDA00] focus:ring-offset-2 focus:ring-offset-[#297476]"
        style={{
          minWidth: "224px",
          bottom: "max(36px, env(safe-area-inset-bottom, 0px) + 32px)",
        }}
      >
        <span className="text-base font-semibold text-[#1B5B5D]">
          {page.acf.estimate_button_text}
        </span>
      </Link>
    </main>
  );
}
