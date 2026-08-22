import ContentRenderer from '../components/ContentRenderer';
import { servicesContent } from '../content';

export default function ServicesPage() {
  return <ContentRenderer content={servicesContent} pageClass="services-page" />;
}
