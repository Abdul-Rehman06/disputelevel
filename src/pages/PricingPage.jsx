import ContentRenderer from '../components/ContentRenderer';
import { pricingContent } from '../content';

export default function PricingPage() {
  return <ContentRenderer content={pricingContent} pageClass="pricing-page" />;
}
