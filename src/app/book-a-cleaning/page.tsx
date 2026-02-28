import { getBookACleaningPage } from "@/lib/wordpress";
import type {
  BookACleaningApartmentType,
  BookACleaningHowOften,
  BookACleaningExtra,
} from "@/types/wordpress";
import { BookACleaningForm } from "@/components/book-a-cleaning/BookACleaningForm";
import { ContactPageContent } from "@/components/contact/ContactPageContent";

export const metadata = {
  title: "Book a cleaning | Quicklyn",
  description:
    "Reserve and pay online. All in one place. Get an estimate for your cleaning.",
};

export default async function BookACleaningPage() {
  const page = await getBookACleaningPage();
  const acf = page?.acf;

  if (!acf) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#1a5d5f] px-6 text-white">
        <p className="text-center text-sm text-white/80">
          Book a cleaning content is not available.
        </p>
      </div>
    );
  }

  const heading = (acf.heading && String(acf.heading).trim()) || "Book a Cleaning";
  const description =
    (acf.description && String(acf.description).trim()) ||
    "Reserve and pay online. All in one place.";
  const backgroundImage =
    acf.background_image &&
    typeof acf.background_image === "object" &&
    "url" in acf.background_image
      ? (acf.background_image as { url?: string }).url
      : undefined;
  const apartmentTypes: BookACleaningApartmentType[] = Array.isArray(
    acf.apartment_or_house_type
  )
    ? acf.apartment_or_house_type
    : [];
  const howOftenOptions: BookACleaningHowOften[] = Array.isArray(acf.how_often)
    ? acf.how_often
    : [];
  const extras: BookACleaningExtra[] = Array.isArray(acf.extras) ? acf.extras : [];
  const specialNotes =
    (acf.special_notes && String(acf.special_notes).trim()) || "";

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white">
      {/* Background */}
      <div
        className="fixed inset-0 z-0 bg-[#1a5d5f]"
        aria-hidden
      />
      {backgroundImage && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={backgroundImage}
            alt=""
            className="fixed inset-0 z-0 h-full w-full object-cover object-top"
            aria-hidden
          />
          {/* Very light teal tint so white text stays readable; was /25 and dimmed the image */}
          <div
            className="fixed inset-0 z-0 bg-[#1a5d5f]/10"
            aria-hidden
          />
        </>
      )}

      <ContactPageContent>
      <main className="relative z-10 pt-40 pb-8 md:pt-[180px]">
        {/* Header */}
        <header className="px-6 pb-6 text-center">
          <h1
            className="font-semibold text-white"
            style={{ fontSize: "47px", lineHeight: "47px" }}
          >
            {heading}
          </h1>
          <p
            className="mt-2 font-normal text-white/95"
            style={{ fontSize: "15px" }}
          >
            {description}
          </p>
        </header>

        <BookACleaningForm
          apartmentTypes={apartmentTypes}
          howOftenOptions={howOftenOptions}
          extras={extras}
        />

        {/* Special notes / disclaimer */}
        {specialNotes && (
          <p className="mx-auto max-w-md px-6 text-center text-xs leading-relaxed text-white/80">
            {specialNotes}
          </p>
        )}
      </main>
      </ContactPageContent>
    </div>
  );
}
