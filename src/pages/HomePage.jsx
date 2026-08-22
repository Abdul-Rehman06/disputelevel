import {
  AudienceSection,
  BenefitsSection,
  ConsultationSection,
  ConsumerRightsSection,
  CreditUtilizationSection,
  FinalCTA,
  FounderVideoSection,
  HomeHero,
  PricingSection,
  ProcessSection,
  ServicesSection,
  TestimonialsSection,
  TrustStrip,
  WhyChooseUsSection,
} from '../components/home/HomePageSections';
import { homeContent } from '../content';
import { homepageContent } from '../content/homepageContent';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';

export default function HomePage() {
  useDocumentMetadata(homeContent.title, homeContent.description);

  return (
    <main id="main-content" className="home-redesign">
      <HomeHero content={homepageContent.hero} />
      <TrustStrip items={homepageContent.trustItems} />
      <BenefitsSection content={homepageContent.benefits} />
      <ProcessSection content={homepageContent.process} />
      <PricingSection content={homepageContent.pricing} />
      <CreditUtilizationSection content={homepageContent.utilization} />
      <ServicesSection content={homepageContent.services} />
      <AudienceSection content={homepageContent.audience} />
      <WhyChooseUsSection content={homepageContent.whyChoose} />
      <FounderVideoSection content={homepageContent.video} />
      <TestimonialsSection content={homepageContent.testimonials} />
      <ConsumerRightsSection content={homepageContent.rights} />
      <ConsultationSection content={homepageContent.consultation} />
      <FinalCTA content={homepageContent.finalCta} />
    </main>
  );
}
