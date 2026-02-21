export interface ArchitectProfile {
  name: string;
  title: string;
  bio: string;
  photoUrl: string;
  highlights: string[];
}

export interface MetricItem {
  label: string;
  value: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  bullets: string[];
  iconKey: string;
  imageUrl: string;
}

export interface ProjectLink {
  label: string;
  url: string;
}

export interface ProjectItem {
  name: string;
  summary: string;
  stack: string[];
  highlights: string[];
  links: ProjectLink[];
}

export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  company: string;
}

export interface FinalCtaData {
  primaryLabel: string;
  secondaryLabel: string;
  note: string;
}

export interface HeroContent {
  title: string;
  subtitle: string;
  primaryLabel: string;
  secondaryLabel: string;
  imageUrl: string;
  imageAlt: string;
}

export interface BrandContent {
  logoText: string;
  logoTagline: string;
}

export interface ArchitectShowcaseData {
  brand: BrandContent;
  hero: HeroContent;
  architect: ArchitectProfile;
  metrics: MetricItem[];
  logos: string[];
  services: ServiceItem[];
  projects: ProjectItem[];
  testimonials: TestimonialItem[];
  cta: FinalCtaData;
}
