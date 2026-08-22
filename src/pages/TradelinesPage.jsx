import ContentRenderer from '../components/ContentRenderer';
import { tradelinesContent } from '../content';

export default function TradelinesPage() {
  return <ContentRenderer content={tradelinesContent} pageClass="tradelines-page" />;
}
