export interface WPImage {
  ID: number;
  id: number;
  title: string;
  filename: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  sizes?: Record<string, string | number>;
}

export interface WPLink {
  title: string;
  url: string;
  target: string;
}

export interface CounterItem {
  acf_fc_layout: string;
  counter_number: string;
  counter_suffix: string;
  counter_text: string;
}

export interface WhyListItem {
  acf_fc_layout: string;
  icon?: WPImage;
  list_heading: string;
  list_description: string;
}

export interface HomePageACF {
  section_1_heading: string;
  section_1_description: string;
  appstore: WPImage;
  google_play: WPImage;
  estimate_button_text: string;
  estimate_button_link: WPLink;
  background_image: WPImage;
  pop_img_1?: WPImage;
  pop_img_2?: WPImage;
  pop_img_3?: WPImage;
  section2_background?: WPImage;
  section_2_background_desktop?: WPImage;
  faq_background_desktop?: WPImage;
  why_icon?: WPImage;
  counter?: CounterItem[];
  section_heading?: string;
  why_list?: WhyListItem[];
  ["4th_section_heading"]?: string;
  ["4th_section_sub_heading"]?: string;
  ["4th_section_description"]?: string;
  ["4th_section_map"]?: WPImage;
  desktop_map_without_pin?: WPImage;
  desktop_map_with_pin?: WPImage;
}

export interface ExtrasListItem {
  acf_fc_layout: string;
  extras_heading: string;
  extras_approximate_time?: string;
  extras_icon?: WPImage;
  extras_description?: string;
}

export interface FeatureListItem {
  acf_fc_layout: string;
  feature_icon?: WPImage;
  feature_name: string;
}

export interface OurServicesACF {
  page_heading?: string;
  ["1st_section_background"]?: WPImage;
  /** Legacy desktop background field (kept for backwards compatibility) */
  desktop_background_image?: WPImage;
  /** New desktop background image for 1st section */
  ["1st_section_desktop_background"]?: WPImage;
  service_sub_heading?: string;
  service_description?: string;
  extras_list?: ExtrasListItem[];
  feature_list?: FeatureListItem[];
  background_image?: WPImage;
}

export interface OurServicesPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string; protected?: boolean };
  acf: OurServicesACF;
}

export interface WPPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string; protected?: boolean };
  acf: HomePageACF;
}

export interface ContactUsACF {
  heading?: string;
  description?: string;
  email?: string;
  phone_number?: string;
  background_image?: WPImage;
}

export interface ContactUsPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string; protected?: boolean };
  acf: ContactUsACF;
}

export interface GiftCardsACF {
  heading?: string;
  description?: string;
  hero_back_image?: WPImage;
  page_background?: WPImage;
}

export interface GiftCardsPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string; protected?: boolean };
  acf: GiftCardsACF;
}

export interface CareersACF {
  /** API typo: haeding */
  haeding?: string;
  description?: string;
  image_1?: WPImage;
  image_2?: WPImage;
  image_3?: WPImage;
  /** Mobile / default background image */
  background_image?: WPImage;
  desktop_background?: WPImage;
  /** Alternative ACF field name for background image */
  desktop_background_image?: WPImage;
  /** Mobile-only hero cover image (replaces stacked images in 1st section) */
  mobile_cover?: WPImage;
}

export interface CareersPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string; protected?: boolean };
  acf: CareersACF;
}

export interface BlogPostACF {
  short_description?: string;
  how_many_minutes_to_read?: string;
}

export interface WPPostEmbedded {
  "wp:featuredmedia"?: Array<{ source_url: string }>;
}

export interface WPPostRaw {
  id: number;
  slug: string;
  date: string;
  link: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  featured_media: number;
  acf?: BlogPostACF;
  _embedded?: WPPostEmbedded;
}

export interface TermsListItem {
  acf_fc_layout: string;
  terms_title: string;
  terms: string;
}

export interface TermsAndConditionsACF {
  page_heading?: string;
  terms_list?: TermsListItem[];
}

export interface TermsAndConditionsPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string; protected?: boolean };
  acf: TermsAndConditionsACF;
}

export type PrivacyPolicyACF = TermsAndConditionsACF;

export interface PrivacyPolicyPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string; protected?: boolean };
  acf: PrivacyPolicyACF;
}

export interface OurMissionTeamItem {
  acf_fc_layout: string;
  employee_image?: WPImage;
  employee_name?: string;
  rating_stars?: string;
}

export interface OurMissionACF {
  page_heading?: string;
  hero_image?: WPImage;
  /** Desktop hero background (used in 1st section on desktop/tablet only). */
  desktop_background?: WPImage;
  sub_heading?: string;
  description?: string;
  section_image?: WPImage;
  /** Section image slider (desktop + mobile); when set, overrides single section_image. */
  section_image_slide?: WPImage[];
  commitment_heading?: string;
  commitment_description?: string;
  /** Optional background image for commitment section (desktop). */
  commitment_background_image?: WPImage;
  team?: OurMissionTeamItem[];
  our_team_static?: WPImage;
  background_check_icon?: WPImage;
  background_check_heading?: string;
  background_check_desctiption?: string;
  page_background_image?: WPImage;
}

export interface OurMissionPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string; protected?: boolean };
  acf: OurMissionACF;
}

export interface AboutUsFeatureItem {
  acf_fc_layout?: string;
  feature_icon?: WPImage;
  feature_title?: string;
  feature_name?: string;
}

export interface AboutUsTeamMember {
  acf_fc_layout?: string;
  profile_picture?: WPImage;
  name?: string;
  designation?: string;
}

export interface AboutUsACF {
  heading?: string | null;
  description?: string | null;
  features?: AboutUsFeatureItem[] | null;
  page_background?: WPImage | null;
  /** Desktop/tablet background image (ACF may use desktop_background or desktop_background_image) */
  desktop_background?: WPImage | null;
  desktop_background_image?: WPImage | null;
  executive_team?: AboutUsTeamMember[] | null;
  investor_title?: string | null;
  investor_description?: string | null;
  contact_email?: string | null;
  contact_link?: WPLink | null;
}

export interface AboutUsPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string; protected?: boolean };
  acf: AboutUsACF;
}

export interface BookACleaningApartmentType {
  acf_fc_layout?: string;
  name?: string;
  hours?: string;
  hourly_rate?: string;
}

export interface BookACleaningHowOften {
  acf_fc_layout?: string;
  how_often_name?: string;
  times?: string;
}

export interface BookACleaningExtra {
  acf_fc_layout?: string;
  extras_name?: string;
  hours?: string;
  hourly_rate?: string;
}

export interface BookACleaningACF {
  heading?: string | null;
  description?: string | null;
  background_image?: WPImage | null;
  apartment_or_house_type?: BookACleaningApartmentType[] | null;
  how_often?: BookACleaningHowOften[] | null;
  extras?: BookACleaningExtra[] | null;
  special_notes?: string | null;
}

export interface BookACleaningPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string; protected?: boolean };
  acf: BookACleaningACF;
}

export interface WPGetEstimateACF {
  before_hover?: WPImage | null;
  after_hover?: WPImage | null;
  link?: WPLink | null;
}

export interface WPGetEstimate {
  id: number;
  slug: string;
  title: { rendered: string };
  acf: WPGetEstimateACF;
}

/** Repeater row for the features grid (2nd section) on service landing pages. */
export interface ServiceLandingSecondItem {
  acf_fc_layout?: string;
  heading?: string;
  /** Shown at rest; falls back to legacy `image` if omitted. */
  before_hover?: WPImage;
  /** Shown on row hover. */
  after_hover?: WPImage;
  /** @deprecated use `before_hover` */
  image?: WPImage;
  ["2nd_section_description"]?: string;
}

/** Repeater row: apartment cleaning options accordion (3rd section). */
export interface ServiceLandingThirdAccordionItem {
  acf_fc_layout?: string;
  cleaning_heading?: string;
  cleaning_description?: string;
}

/** Repeater: “Why choose Quicklyn” row (icon + line), section 8. */
export interface ServiceLandingWhyChooseItem {
  acf_fc_layout?: string;
  why_choose_icon?: WPImage;
  why_choose_text?: string;
}

/** Local / SEO service landing pages (CPT `services` in WordPress). */
export interface ServiceLandingACF {
  ["1st_section_heading"]?: string;
  ["1st_section_description_1"]?: string;
  ["1st_section_description_2"]?: string;
  ["1st_section_image"]?: WPImage;
  ["2nd_section_items"]?: ServiceLandingSecondItem[];
  ["3rd_section_heading"]?: string;
  ["3rd_section_description"]?: string;
  ["3rd_section_accordion"]?: ServiceLandingThirdAccordionItem[];
  /** Middle panel background (full-bleed, cover). */
  ["3rd_section_background_image"]?: WPImage;
  /** Decorative strip at top of 3rd section. */
  top_curve?: WPImage;
  /** Same as `top_curve` if ACF uses a grouped field name. */
  ["3rd_section_top_curve"]?: WPImage;
  /** Decorative strip at bottom of 3rd section. */
  bottom_curve?: WPImage;
  /** Same as `bottom_curve` if ACF uses a grouped field name. */
  ["3rd_section_bottom_curve"]?: WPImage;
  /** 4th “why demand / neighborhood” block */
  ["4th_section_heading"]?: string;
  ["4th_section_sub_heading"]?: string;
  features?: ServiceLandingFeatureItem[];
  ["4th_section_description_text"]?: string;
  /** Full-bleed background for the lower rounded panel (teal + subtle pattern). */
  ["4th_section_banner_background"]?: WPImage;
  /** Photo for the lower rounded banner (e.g. cleaner). */
  ["4th_section_banner"]?: WPImage;
  banner_contents?: ServiceLandingBannerPoint[];
  /** Right-side paragraph in the lower banner. */
  ["4th_section_description_banner"]?: string;
  /** Subheading above bullets inside the lower banner. */
  banner_heading?: string;
  /** Section 5–6 shared full-bleed background (teal + art; used for both blocks). */
  ["5th_section_background_image"]?: WPImage;
  ["5th_section_heading"]?: string;
  ["5th_section_description"]?: string;
  button_text?: string;
  button_url?: string;
  apartment_types?: ServiceLandingApartmentType[];
  /** Section 5 footer line (ACF field name may be `service_desclaimer`). */
  service_desclaimer?: string;
  ["6th_section_heading"]?: string;
  ["6th_section_sub_heading"]?: string;
  what_to_expect?: ServiceLandingWhatToExpectItem[];
  what_to_expect_disclaimer?: string;
  /** Section 7: pricing / cost callout. */
  ["7th_section_heading"]?: string;
  ["7th_section_description"]?: string;
  /** HTML: intro line + &lt;ul&gt; of pricing points. */
  structure?: string;
  bottom_description?: string;
  /** Shared full-bleed art for sections 7–9. */
  ["7th_section_8th_section_background"]?: WPImage;
  ["8th_section_heading"]?: string;
  ["8th_section_description"]?: string;
  why_choose_quicklyn?: ServiceLandingWhyChooseItem[];
  why_choose_us_disclaimer?: string;
  final_thoughts?: string;
  final_thoughts_description?: string;
}

/** Repeater: apartment layout card (section 5). */
export interface ServiceLandingApartmentType {
  acf_fc_layout?: string;
  apartment_type_name?: string;
  approx_time?: string;
  service_description?: string;
}

/** Repeater: numbered “what to expect” step (section 6). */
export interface ServiceLandingWhatToExpectItem {
  acf_fc_layout?: string;
  what_to_expect_points?: string;
}

/** Repeater: horizontal feature list (4th section, top). */
export interface ServiceLandingFeatureItem {
  acf_fc_layout?: string;
  feature_name?: string;
}

/** Repeater: bullet line items (4th section, lower banner). */
export interface ServiceLandingBannerPoint {
  acf_fc_layout?: string;
  point_name?: string;
}

export interface WPServiceLanding {
  id: number;
  slug: string;
  title: { rendered: string };
  content?: { rendered: string; protected?: boolean };
  acf?: ServiceLandingACF;
}

/** CMS default document title / tagline (`site-title` CPT + ACF `site_title`). */
export interface WPSiteTitle {
  id: number;
  slug: string;
  title: { rendered: string };
  acf?: { site_title?: string };
}
