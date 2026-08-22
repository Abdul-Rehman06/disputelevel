import { useCallback, useState } from 'react';
import { ArrowRight, Check, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { motion as Motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';
import BookingEmbed from './BookingEmbed';
import ContactFormEmbed from './ContactFormEmbed';
import CTABanner from './CTABanner';
import FAQAccordion from './FAQAccordion';
import PageHero from './PageHero';
import PartnerFormEmbed from './PartnerFormEmbed';
import PricingCard from './PricingCard';
import PricingComparison from './PricingComparison';
import SectionHeading from './SectionHeading';
import ServiceItem from './ServiceItem';
import Testimonial from './Testimonial';
import TradelinesModal from './TradelinesModal';

const checkoutPattern = /checkout-|billing/i;
const buttonPattern = /Get Started|Choose|Schedule|Book|View Pricing|Learn More|Partner With|Start|Request|Consultation|See Plans|Enroll|Select/i;

function textOf(node) {
  if (!node) return '';
  if (node.text) return node.text;
  if (node.question) return node.question + ' ' + node.answer;
  if (node.items) return node.items.join(' ');
  return (node.children || []).map(textOf).join(' ');
}

function firstHeading(node) {
  if (node?.type === 'heading') return node.text;
  for (const child of node?.children || []) {
    const heading = firstHeading(child);
    if (heading) return heading;
  }
  return '';
}

function ContentImage({ src, alt }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return (
      <div className="image-fallback" role="img" aria-label={alt || 'Image unavailable'}>
        <ImageIcon aria-hidden="true" />
        <span>{alt || 'Image unavailable'}</span>
      </div>
    );
  }
  return <img className="content-image" src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}

function EmbedForUrl({ src }) {
  if (src.includes('/widget/booking/')) return <BookingEmbed src={src} />;
  if (src.includes('DIILI736u9rwFgAbwALb')) return <ContactFormEmbed src={src} />;
  if (src.includes('7AL0Qf8OHQBqbjwKB1uR')) return <PartnerFormEmbed src={src} />;
  return <ContactFormEmbed src={src} />;
}

function Container({ node, depth, contextLabel, onTradeline }) {
  const nodeCopy = textOf(node);
  const label = firstHeading(node) || contextLabel;
  const children = node.children.map((child, index) => (
    <NodeRenderer
      key={child.type + '-' + index}
      node={child}
      depth={depth + 1}
      contextLabel={label}
      onTradeline={onTradeline}
    />
  ));

  if (node.role === 'grid') return <div className="content-grid">{children}</div>;
  if (node.role === 'row') return <div className="content-row">{children}</div>;
  if (node.role === 'card' && depth <= 5) {
    if (/OPTIMIZATION TIER1|CREDIT OPTIMIZATION PLAN GROUP|Homebuyer Path Premier Promo/.test(nodeCopy)) {
      return <PricingCard featured={/CREDIT OPTIMIZATION PLAN GROUP/.test(nodeCopy)}>{children}</PricingCard>;
    }
    if (/“|Testimonials reflect|What Our Clients Say/.test(nodeCopy)) return <Testimonial>{nodeCopy}</Testimonial>;
    return <ServiceItem>{children}</ServiceItem>;
  }
  return <div className={node.role === 'container' ? 'content-container' : 'content-group'}>{children}</div>;
}

function NodeRenderer({ node, depth = 0, contextLabel = '', onTradeline }) {
  if (!node) return null;

  if (node.type === 'container' || node.type === 'section') {
    return <Container node={node} depth={depth} contextLabel={contextLabel} onTradeline={onTradeline} />;
  }

  if (node.type === 'heading') {
    const level = Math.min(Math.max(node.level, 1), 6);
    const tag = 'h' + level;
    return <SectionHeading as={tag}>{node.text}</SectionHeading>;
  }

  if (node.type === 'paragraph') return <p className="content-paragraph">{node.text}</p>;
  if (node.type === 'note') return <p className="content-note">{node.text}</p>;
  if (node.type === 'copy') return <span className={'content-copy ' + (node.emphasis || '')}>{node.text}</span>;
  if (node.type === 'quote') return <Testimonial>{node.text}</Testimonial>;
  if (node.type === 'faq') return <FAQAccordion question={node.question} answer={node.answer} />;
  if (node.type === 'image') return <ContentImage src={node.src} alt={node.alt} />;
  if (node.type === 'embed') return <EmbedForUrl src={node.src} />;
  if (node.type === 'video') return <video className="content-video" src={node.src} controls muted playsInline />;

  if (node.type === 'list') {
    const Tag = node.ordered ? 'ol' : 'ul';
    return (
      <Tag className="content-list">
        {node.items.map((item) => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}
      </Tag>
    );
  }

  if (node.type === 'button') {
    return (
      <button
        className="button-primary"
        type="button"
        onClick={() => node.action === 'tradeline' && onTradeline(contextLabel || 'Selected Tradeline')}
      >
        {node.text}<ArrowRight size={17} aria-hidden="true" />
      </button>
    );
  }

  if (node.type === 'link') {
    if (!node.href) return <span className="missing-legal-link">{node.text}</span>;
    const className = 'content-link ' + (buttonPattern.test(node.text) || checkoutPattern.test(node.href) ? 'button-primary' : 'text-link');
    if (!node.external || node.href.startsWith('#')) {
      return <Link className={className} to={node.href}>{node.text}<ArrowRight size={16} aria-hidden="true" /></Link>;
    }
    return (
      <a className={className} href={node.href} target={node.href.startsWith('http') ? '_blank' : undefined} rel={node.href.startsWith('http') ? 'noreferrer' : undefined}>
        {node.text}{node.href.startsWith('http') ? <ExternalLink size={15} aria-hidden="true" /> : null}
      </a>
    );
  }

  return null;
}

function StandardSection({ section, onTradeline, legal }) {
  const reduceMotion = useReducedMotion();
  const content = section.children.map((child, index) => (
    <NodeRenderer key={child.type + '-' + index} node={child} onTradeline={onTradeline} />
  ));
  const classes = 'page-section section-' + section.variant + (legal ? ' legal-document' : '');

  if (section.variant === 'cta') return <CTABanner>{content}</CTABanner>;
  if (section.variant === 'pricing') {
    return (
      <section className={classes} id={section.id}>
        <div className="section-shell"><PricingComparison>{content}</PricingComparison></div>
      </section>
    );
  }

  return (
    <Motion.section
      className={classes}
      id={section.id}
      initial={legal || reduceMotion ? false : { opacity: 0, y: 18 }}
      whileInView={legal || reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.38 }}
    >
      <div className="section-shell">{content}</div>
    </Motion.section>
  );
}

export default function ContentRenderer({ content, pageClass = '' }) {
  const [selectedTradeline, setSelectedTradeline] = useState('');
  const closeModal = useCallback(() => setSelectedTradeline(''), []);
  useDocumentMetadata(content.title, content.description);
  const [hero, ...sections] = content.sections;
  const legal = content.route === '/privacy' || content.route === '/terms';

  return (
    <>
      <main id="main-content" className={'content-page page-' + content.route.replace('/', '') + ' ' + pageClass}>
        {hero && (
          <PageHero variant={hero.variant}>
            {hero.children.map((child, index) => (
              <NodeRenderer key={child.type + '-' + index} node={child} onTradeline={setSelectedTradeline} />
            ))}
          </PageHero>
        )}
        {sections.map((section) => (
          <StandardSection
            key={section.sourceIndex}
            section={section}
            onTradeline={setSelectedTradeline}
            legal={legal}
          />
        ))}
      </main>
      {content.route === '/tradelines' && <TradelinesModal selected={selectedTradeline} onClose={closeModal} />}
    </>
  );
}
