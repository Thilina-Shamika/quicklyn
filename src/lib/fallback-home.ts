import type { WPPage } from "@/types/wordpress";

export const fallbackHomePage: WPPage = {
  id: 20,
  slug: "home",
  title: { rendered: "Home" },
  content: { rendered: "" },
  acf: {
    section_1_heading: "Premium Cleaning Services in New York City",
    section_1_description:
      "Trusted, vetted cleaning professionals delivering consistent, white-glove service across NYC.",
    estimate_button_text: "Get an Estimate",
    estimate_button_link: { title: "", url: "#", target: "" },
    appstore: {
      ID: 25,
      id: 25,
      title: "app-store",
      filename: "app-store.png",
      url: "http://quicklyn-headless.local/wp-content/uploads/2026/02/app-store.png",
      alt: "",
      width: 400,
      height: 140,
    },
    google_play: {
      ID: 24,
      id: 24,
      title: "google-play",
      filename: "google-play.png",
      url: "http://quicklyn-headless.local/wp-content/uploads/2026/02/google-play.png",
      alt: "",
      width: 396,
      height: 140,
    },
    background_image: {
      ID: 31,
      id: 31,
      title: "Mask group",
      filename: "Mask-group.png",
      url: "http://quicklyn-headless.local/wp-content/uploads/2026/02/Mask-group.png",
      alt: "",
      width: 1447,
      height: 1091,
    },
    section2_background: {
      ID: 43,
      id: 43,
      title: "backgsec2",
      filename: "backgsec2-scaled.png",
      url: "http://quicklyn-headless.local/wp-content/uploads/2026/02/backgsec2-scaled.png",
      alt: "",
      width: 886,
      height: 2560,
    },
    counter: [
      {
        acf_fc_layout: "counter_item",
        counter_number: "100",
        counter_suffix: "K+",
        counter_text: "Hours of Service",
      },
      {
        acf_fc_layout: "counter_item",
        counter_number: "1",
        counter_suffix: "K+",
        counter_text: "Highly Positive Reviews",
      },
    ],
    section_heading: "Why Quicklyn",
    why_list: [
      {
        acf_fc_layout: "list_points",
        list_heading: "Pay For Time, Not Tasks",
        list_description:
          "Your online price is an estimate. Final pricing is based on the actual time required to complete the job.",
      },
      {
        acf_fc_layout: "list_points",
        list_heading: "Background Checked Team",
        list_description:
          "Every Quicklyn professional is thoroughly vetted and background-checked for your peace of mind.",
      },
      {
        acf_fc_layout: "list_points",
        list_heading: "Easy Booking",
        list_description:
          "Book in minutes through our app or website. Choose your time, add extras, and we handle the rest.",
      },
      {
        acf_fc_layout: "list_points",
        list_heading: "Smarter Savings",
        list_description:
          "Save compared to average NYC rates without compromising on quality or consistency.",
      },
    ],
    ["4th_section_heading"]: "Our Service Areas",
    ["4th_section_sub_heading"]: "Coverage Across New York City",
    ["4th_section_description"]:
      "Whether you live in Manhattan, Brooklyn, Queens, the Bronx, or Staten Island, our dedicated team is equipped and ready to bring top-quality cleaning right to your doorstep.",
    ["4th_section_map"]: {
      ID: 67,
      id: 67,
      title: "Service area map",
      filename: "Frame-1410127467-1-768x798-1.png",
      url: "http://quicklyn-headless.local/wp-content/uploads/2026/02/Frame-1410127467-1-768x798-1.png",
      alt: "",
      width: 768,
      height: 798,
    },
  },
};
