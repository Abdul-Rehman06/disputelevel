import ContentRenderer from '../components/ContentRenderer';
import { contactContent } from '../content';

export default function ContactPage() {
  return <ContentRenderer content={contactContent} pageClass="contact-page" />;
}
