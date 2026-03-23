import Link from "next/link";
import {
  getHomePage,
  getServices,
  getTestimonials,
  getFaqs,
  getAppLink,
  getHeader,
  getEstimateConfig,
} from "@/lib/wordpress";
import { GetEstimateButton } from "@/components/GetEstimateButton";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesSection } from "@/components/home/ServicesSection";
import { ServiceAreasSection } from "@/components/home/ServiceAreasSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FAQSection } from "@/components/home/FAQSection";
import { HomeAppDownloadSection } from "@/components/home/HomeAppDownloadSection";

export default async function HomePage() {
  const [page, services, testimonials, faqs, appLink, header, estimate] =
    await Promise.all([
      getHomePage(),
      getServices(),
      getTestimonials(),
      getFaqs(),
      getAppLink(),
      getHeader(),
      getEstimateConfig(),
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
      <HeroSection data={page.acf} header={header} appLink={appLink} />
      <div className="md:-mt-[100px]">
        <ServicesSection
          background={page.acf.section2_background}
          backgroundDesktop={page.acf.section_2_background_desktop}
          counters={page.acf.counter}
          services={services}
          sectionHeading={page.acf.section_heading}
          whyList={page.acf.why_list}
        />
      </div>
      <ServiceAreasSection data={page.acf} />
      <TestimonialsSection testimonials={testimonials} />
      <FAQSection
        faqs={faqs}
        backgroundDesktop={page.acf.faq_background_desktop}
        downloadData={appLink}
      />
      {/* Global floating CTA button above all sections */}
      <GetEstimateButton
        estimate={estimate}
        fallbackText={page.acf.estimate_button_text}
        fallbackHref="/book-a-cleaning"
      />
    </main>
  );
}
