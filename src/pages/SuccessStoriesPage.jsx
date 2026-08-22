import ContentRenderer from '../components/ContentRenderer';
import { successStoriesContent } from '../content';

export default function SuccessStoriesPage() {
  return <ContentRenderer content={successStoriesContent} pageClass="success-stories-page" />;
}
