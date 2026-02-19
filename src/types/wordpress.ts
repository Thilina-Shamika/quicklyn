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
  counter?: CounterItem[];
  section_heading?: string;
  why_list?: WhyListItem[];
  ["4th_section_heading"]?: string;
  ["4th_section_sub_heading"]?: string;
  ["4th_section_description"]?: string;
  ["4th_section_map"]?: WPImage;
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
