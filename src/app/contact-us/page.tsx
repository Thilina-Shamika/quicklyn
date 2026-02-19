import { getContactUsPage } from "@/lib/wordpress";
import { ContactForm } from "@/components/contact/ContactForm";

export default async function ContactUsPage() {
  const page = await getContactUsPage();

  if (!page?.acf) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#2a7a7c] p-6">
        <p className="max-w-xs text-center text-sm text-white/80">
          Contact Us content is not available. Please ensure the WordPress page
          with ACF fields is published.
        </p>
      </main>
    );
  }

  const heading = page.acf.heading?.trim() || page.title.rendered;
  const description = page.acf.description?.trim() || "";
  const email = page.acf.email?.trim() || "";
  const phone = page.acf.phone_number?.trim() || "";
  const bgImage = page.acf.background_image?.url;

  return (
    <main className="relative min-h-screen text-white">
      {/* Background image from endpoint — CSS background so it always loads (avoids Next Image domain/encoding issues) */}
      {bgImage ? (
        <>
          <div
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${encodeURI(bgImage)})`,
            }}
            role="img"
            aria-hidden
          />
          <div
            className="absolute inset-0 z-0"
            style={{ backgroundColor: "rgba(42, 122, 124, 0.12)" }}
            aria-hidden
          />
        </>
      ) : (
        <div className="absolute inset-0 z-0 bg-[#2a7a7c]" aria-hidden />
      )}

      <div className="relative z-10 mx-auto max-w-2xl px-8 pt-32 pb-12 md:px-12 md:pt-44 md:pb-16">
        {/* Header */}
        <header className="text-center">
          <h1
            className="font-semibold tracking-tight"
            style={{ fontSize: "43px" }}
          >
            {heading}
          </h1>
          {description && (
            <p className="mt-3 text-white/95" style={{ fontSize: "12px" }}>
              {description}
            </p>
          )}

          {/* Email and phone side by side */}
          <div className="mt-8 flex flex-row flex-wrap items-center justify-center gap-4">
            {email && (
              <a
                href={`mailto:${email}`}
                className="rounded-xl border border-white/80 bg-white/10 px-5 py-3 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                style={{ fontSize: "12px" }}
              >
                {email}
              </a>
            )}
            {phone && (
              <a
                href={`tel:${phone.replace(/\D/g, "")}`}
                className="rounded-xl border border-white/80 bg-white/10 px-5 py-3 text-white transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                style={{ fontSize: "12px" }}
              >
                {phone}
              </a>
            )}
          </div>
        </header>

        {/* Form */}
        <section className="mt-14">
          <ContactForm />
        </section>
      </div>
    </main>
  );
}
