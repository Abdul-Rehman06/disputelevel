import ContentRenderer from '../components/ContentRenderer';
import { aboutContent } from '../content';

export default function AboutPage() {
  return <ContentRenderer content={aboutContent} pageClass="about-page" />;
}
