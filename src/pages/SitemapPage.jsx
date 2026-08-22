import ContentRenderer from '../components/ContentRenderer';
import { sitemapContent } from '../content';

export default function SitemapPage() {
  return <ContentRenderer content={sitemapContent} pageClass="sitemap-page" />;
}
