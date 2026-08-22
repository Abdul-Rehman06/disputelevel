import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ContentRenderer from '../components/ContentRenderer';
import { pricingLandContent } from '../content';

export default function PricingLandPage() {
  return (
    <div className="landing-layout">
      <header className="landing-header">
        <Link to="/" aria-label="Dispute Levels home"><img src="/assets/Logos/logo.png" alt="Dispute Levels" /></Link>
        <Link to="/pricing"><ArrowLeft size={16} />Pricing</Link>
      </header>
      <ContentRenderer content={pricingLandContent} pageClass="pricing-landing-page" />
      <footer className="landing-footer">
        <p>© 2026 Dispute Levels. All Rights Reserved.</p>
        <div>
          <a href="tel:7547044737">754-704-4737</a>
          <a href="mailto:support@disputelevelcreditrestoration.com">support@disputelevelcreditrestoration.com</a>
        </div>
      </footer>
    </div>
  );
}
