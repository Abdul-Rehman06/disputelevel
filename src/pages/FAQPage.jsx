import ContentRenderer from '../components/ContentRenderer';
import { faqContent } from '../content';

export default function FAQPage() {
  return <ContentRenderer content={faqContent} pageClass="faq-page" />;
}
