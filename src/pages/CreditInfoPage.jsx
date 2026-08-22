import ContentRenderer from '../components/ContentRenderer';
import { creditInfoContent } from '../content';

export default function CreditInfoPage() {
  return <ContentRenderer content={creditInfoContent} pageClass="credit-info-page" />;
}
