import ContentRenderer from '../components/ContentRenderer';
import { partnersContent } from '../content';

export default function PartnersPage() {
  return <ContentRenderer content={partnersContent} pageClass="partners-page" />;
}
