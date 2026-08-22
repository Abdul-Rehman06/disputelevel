import ContentRenderer from '../components/ContentRenderer';
import { consultationContent } from '../content';

export default function ConsultationPage() {
  return <ContentRenderer content={consultationContent} pageClass="consultation-page" />;
}
