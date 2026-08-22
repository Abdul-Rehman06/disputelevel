import ContentRenderer from '../components/ContentRenderer';
import { privacyContent } from '../content';

export default function PrivacyPage() {
  return <ContentRenderer content={privacyContent} pageClass="privacy-page" />;
}
