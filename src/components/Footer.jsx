import { ArrowUpRight, Mail, Phone } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { footerContent } from '../content/footerContent';
import { globalContent } from '../content/globalContent';
import DisclosurePanel from './DisclosurePanel';

function FooterLinks({ title, links }) {
  return (
    <nav className="footer-links" aria-label={title + ' links'}>
      <h2>{title}</h2>
      <ul>
        {links.map((link) => (
          <li key={link.label}>
            {link.to ? <Link to={link.to}>{link.label}</Link> : <span className="missing-legal-link">{link.label}</span>}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Footer() {
  const { pathname } = useLocation();
  const cleanPath = pathname.endsWith('.html')
    ? (pathname === '/index.html' ? '/' : pathname.slice(0, -5))
    : pathname;
  const pageFooter = footerContent[cleanPath] || footerContent['/'];
  const firstLegalHeading = pageFooter.legalBlocks.find((block) => block.type === 'heading');
  const remainingLegalBlocks = firstLegalHeading
    ? pageFooter.legalBlocks.slice(pageFooter.legalBlocks.indexOf(firstLegalHeading) + 1)
    : pageFooter.legalBlocks;
  const legalColumnTitle = pageFooter.headings.includes('Quick Links') ? 'Quick Links' : 'Legal';
  const pageInternalLinks = pageFooter.links.filter((link) => !/^(https?:|mailto:|tel:)/.test(link.to || '') && link.to !== '/sitemap');
  const companyLabels = new Set(['About us', 'Pricing', 'Success stories', 'Our Services']);
  const supportLabels = new Set(['Credit info', 'FAQ', 'Contact us']);
  const companyLinks = pageInternalLinks.filter((link) => companyLabels.has(link.label));
  const supportLinks = pageInternalLinks.filter((link) => supportLabels.has(link.label));
  const legalLinks = pageInternalLinks.filter((link) => !companyLabels.has(link.label) && !supportLabels.has(link.label));
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/assets/Logos/logo.png" alt="Dispute Levels" />
            <p>{pageFooter.description || globalContent.description}</p>
            <div className="footer-contact">
              <a href={'tel:' + globalContent.phone.replaceAll('-', '')}><Phone size={17} aria-hidden="true" /><span>Customer Service Line:<strong>{globalContent.phone}</strong></span></a>
              <a href={'mailto:' + globalContent.email}><Mail size={17} aria-hidden="true" /><span>{globalContent.email}</span></a>
            </div>
          </div>
          <FooterLinks title="Company" links={companyLinks.length ? companyLinks : globalContent.companyLinks} />
          <FooterLinks title="Support" links={supportLinks.length ? supportLinks : globalContent.supportLinks} />
          <FooterLinks title={legalColumnTitle} links={legalLinks.length ? legalLinks : globalContent.legalLinks} />
        </div>
        {pageFooter.legalBlocks.length > 0 && (
          <DisclosurePanel title={firstLegalHeading?.text || globalContent.disclosureTitle} tone="dark">
            {remainingLegalBlocks.map((block) => (
              block.type === 'heading'
                ? <h3 className="footer-notice-heading" key={block.text}>{block.text}</h3>
                : <p key={block.text}>{block.text}</p>
            ))}
          </DisclosurePanel>
        )}
        <div className="footer-bottom">
          <p>{pageFooter.copyright || globalContent.copyright}</p>
          <div>
            <a href={globalContent.clientPortalUrl} target="_blank" rel="noreferrer">Client Portal <ArrowUpRight size={14} /></a>
            <Link to="/sitemap">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
