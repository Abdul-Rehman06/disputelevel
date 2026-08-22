import ContentRenderer from '../components/ContentRenderer';
import { termsContent } from '../content';

export default function TermsPage() {
  return <ContentRenderer content={termsContent} pageClass="terms-page" />;
}
