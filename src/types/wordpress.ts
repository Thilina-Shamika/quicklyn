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

export interface CareersACF {
  /** API typo: haeding */
  haeding?: string;
  description?: string;
  image_1?: WPImage;
  image_2?: WPImage;
  image_3?: WPImage;
  desktop_background?: WPImage;
  /** Alternative ACF field name for background image */
  desktop_background_image?: WPImage;
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
  commitment_heading?: string;
  commitment_description?: string;
  /** Optional background image for commitment section (desktop). */
  commitment_background_image?: WPImage;
  team?: OurMissionTeamItem[];
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
