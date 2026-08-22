import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion as Motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarCheck,
  Check,
  CheckCircle2,
  CircleUserRound,
  ClipboardCheck,
  Clock3,
  FileCheck2,
  Gauge,
  GraduationCap,
  Handshake,
  HeartHandshake,
  House,
  Landmark,
  LineChart,
  ListChecks,
  LockKeyhole,
  MessageSquareText,
  MonitorCheck,
  PlayCircle,
  Scale,
  ShieldCheck,
  TrendingDown,
  UserRound,
  WalletCards,
} from 'lucide-react';
import { useExternalScript } from '../../hooks/useExternalScript';

const formEmbedScript = 'https://link.kbcnsult.com/js/form_embed.js';

function Reveal({ children, className = '', delay = 0 }) {
  const reducedMotion = useReducedMotion();
  return (
    <Motion.div
      className={className}
      initial={reducedMotion ? false : { opacity: 0, y: 22 }}
      whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Motion.div>
  );
}

function SectionIntro({ eyebrow, title, copy, align = 'left', headingId }) {
  return (
    <div className={'home-section-intro home-section-intro--' + align}>
      {eyebrow && <p className="home-eyebrow">{eyebrow}</p>}
      <h2 id={headingId}>{title}</h2>
      {copy && <p>{copy}</p>}
    </div>
  );
}

export function HomeHero({ content }) {
  const reducedMotion = useReducedMotion();
  return (
    <section className="home-hero" aria-labelledby="home-hero-title">
      <video className="home-hero__ambient" autoPlay muted loop playsInline aria-hidden="true">
        <source src={content.backgroundVideo} type="video/mp4" />
      </video>
      <div className="home-shell home-hero__grid">
        <Motion.div
          className="home-hero__copy"
          initial={reducedMotion ? false : { opacity: 0, y: 24 }}
          animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="home-eyebrow">{content.eyebrow}</p>
          <h1 id="home-hero-title">{content.title}</h1>
          <p className="home-hero__lede">{content.copy}</p>
          <ul className="home-hero__benefits" aria-label="Consultation benefits">
            {content.benefits.map((benefit) => (
              <li key={benefit}><CheckCircle2 aria-hidden="true" />{benefit}</li>
            ))}
          </ul>
          <div className="home-hero__actions">
            <Link className="home-button home-button--primary" to={content.primaryCta.to}>
              {content.primaryCta.label}<ArrowRight aria-hidden="true" />
            </Link>
            <Link className="home-button home-button--quiet" to={content.secondaryCta.to}>
              {content.secondaryCta.label}
            </Link>
          </div>
          <p className="home-fine-print">{content.disclaimer}</p>
        </Motion.div>

        <Motion.div
          className="home-hero__media"
          initial={reducedMotion ? false : { opacity: 0, scale: 0.98 }}
          animate={reducedMotion ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="home-hero__image-frame">
            <img src={content.image} alt={content.imageAlt} />
            <div className="home-hero__image-shade" aria-hidden="true" />
            <div className="home-hero__media-caption">
              <span><ShieldCheck aria-hidden="true" />{content.benefits[1]}</span>
              <strong>{content.benefits[0]}</strong>
            </div>
          </div>
          <div className="home-hero__proof-stack">
            {content.proof.map((item, index) => (
              <div className="home-proof-card" key={item.label}>
                <span className="home-proof-card__icon">
                  {index === 0 ? <FileCheck2 aria-hidden="true" /> : <ListChecks aria-hidden="true" />}
                </span>
                <span>
                  <small>{item.label}</small>
                  <strong>{item.title}</strong>
                  {item.detail && <em>{item.detail}</em>}
                </span>
              </div>
            ))}
          </div>
        </Motion.div>
      </div>
    </section>
  );
}

export function TrustStrip({ items }) {
  return (
    <section className="home-trust-strip" aria-label="How Dispute Levels supports clients">
      <div className="home-shell home-trust-strip__inner">
        {items.map((item, index) => (
          <div key={item} className="home-trust-strip__item">
            {index === 0 ? <BadgeCheck aria-hidden="true" /> : <span aria-hidden="true">0{index}</span>}
            <p>{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function BenefitsSection({ content }) {
  const icons = [FileCheck2, GraduationCap, ClipboardCheck];
  return (
    <section className="home-section home-benefits" aria-labelledby="home-benefits-title">
      <div className="home-shell home-benefits__layout">
        <Reveal className="home-benefits__intro">
          <div className="home-section-intro">
            <p className="home-eyebrow">{content.eyebrow}</p>
            <h2 id="home-benefits-title">{content.title}</h2>
          </div>
          <div className="home-benefits__marker" aria-hidden="true"><span>01</span></div>
        </Reveal>
        <div className="home-benefits__list">
          {content.items.map((item, index) => {
            const Icon = icons[index];
            return (
              <Reveal className="home-benefit-row" delay={index * 0.06} key={item.title}>
                <span className="home-benefit-row__icon"><Icon aria-hidden="true" /></span>
                <div><h3>{item.title}</h3><p>{item.copy}</p></div>
                <span className="home-benefit-row__number" aria-hidden="true">0{index + 1}</span>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ProcessSection({ content }) {
  return (
    <section className="home-section home-process" aria-labelledby="home-process-title">
      <div className="home-shell">
        <Reveal>
          <div className="home-section-intro home-section-intro--center">
            <p className="home-eyebrow">{content.eyebrow}</p>
            <h2 id="home-process-title">{content.title}</h2>
            <p>{content.copy}</p>
          </div>
        </Reveal>
        <div className="home-process__journey">
          {content.items.map((item, index) => (
            <Reveal className="home-process-step" delay={index * 0.08} key={item.number}>
              <div className="home-process-step__number"><span>{item.number}</span></div>
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </Reveal>
          ))}
        </div>
        <p className="home-process__disclaimer"><ShieldCheck aria-hidden="true" />{content.disclaimer}</p>
      </div>
    </section>
  );
}

export function PricingSection({ content }) {
  return (
    <section className="home-section home-pricing" id="pricing" aria-labelledby="home-pricing-title">
      <div className="home-shell">
        <Reveal className="home-pricing__head">
          <SectionIntro eyebrow={content.eyebrow} title={content.title} copy={content.copy} />
          <Link className="home-text-link" to="/pricing">View Pricing Plans<ArrowRight aria-hidden="true" /></Link>
        </Reveal>
        <div className="home-pricing__grid">
          {content.plans.map((plan, index) => (
            <Reveal
              className={'home-price-card' + (plan.badge ? ' home-price-card--featured' : '')}
              delay={index * 0.06}
              key={plan.name}
            >
              {plan.badge && <p className="home-price-card__badge">{plan.badge}</p>}
              <p className="home-price-card__tier">{plan.tier}</p>
              <h3>{plan.name}</h3>
              <div className="home-price-card__amounts">
                <div><strong>{plan.firstPayment}</strong><span>{plan.firstPaymentLabel}</span></div>
                {plan.recurring && <div><strong>{plan.recurring}</strong><span>{plan.recurringLabel}</span></div>}
              </div>
              <p className="home-price-card__payment-copy">{plan.paymentCopy}</p>
              <ul>
                {plan.features.map((feature) => <li key={feature}><Check aria-hidden="true" />{feature}</li>)}
              </ul>
              <a className="home-button home-button--price" href={plan.href}>{plan.cta}<ArrowRight aria-hidden="true" /></a>
            </Reveal>
          ))}
        </div>
        <p className="home-pricing__disclaimer"><LockKeyhole aria-hidden="true" />{content.disclaimer}</p>
      </div>
    </section>
  );
}

export function CreditUtilizationSection({ content }) {
  return (
    <section className="home-section home-utilization" aria-labelledby="home-utilization-title">
      <div className="home-shell home-utilization__grid">
        <Reveal className="home-utilization__copy">
          <p className="home-eyebrow">{content.eyebrow}</p>
          <h2 id="home-utilization-title">{content.title}</h2>
          <p>{content.copy}</p>
          <ul>
            {content.points.map((point, index) => (
              <li key={point}>
                {index === 0 && <LineChart aria-hidden="true" />}
                {index === 1 && <TrendingDown aria-hidden="true" />}
                {index === 2 && <Clock3 aria-hidden="true" />}
                {point}
              </li>
            ))}
          </ul>
          <Link className="home-button home-button--primary" to={content.cta.to}>{content.cta.label}<ArrowRight aria-hidden="true" /></Link>
        </Reveal>
        <Reveal className="home-utilization__visual" delay={0.08}>
          <div className="utilization-orbit" aria-hidden="true">
            <span className="utilization-orbit__ring utilization-orbit__ring--outer" />
            <span className="utilization-orbit__ring utilization-orbit__ring--inner" />
            <span className="utilization-orbit__axis utilization-orbit__axis--horizontal" />
            <span className="utilization-orbit__axis utilization-orbit__axis--vertical" />
          </div>
          <div className="premium-card" aria-label={content.card.label}>
            <div className="premium-card__top"><span>{content.card.label}</span><Landmark aria-hidden="true" /></div>
            <div className="premium-card__chip" aria-hidden="true" />
            <div className="premium-card__details">
              <div><small>{content.card.limitLabel}</small><strong>{content.card.limit}</strong></div>
              <div><small>{content.card.openedLabel}</small><strong>{content.card.opened}</strong></div>
            </div>
            <p><CheckCircle2 aria-hidden="true" />{content.card.status}</p>
          </div>
          <div className="utilization-legend">
            <div><Gauge aria-hidden="true" /><span>{content.points[1]}</span></div>
            <div><Clock3 aria-hidden="true" /><span>{content.points[2]}</span></div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function ServicesSection({ content }) {
  const icons = [FileCheck2, Scale, BookOpenCheck, WalletCards, Gauge, MonitorCheck];
  return (
    <section className="home-section home-services" aria-labelledby="home-services-title">
      <div className="home-shell">
        <Reveal className="home-services__head">
          <div className="home-section-intro"><p className="home-eyebrow">{content.eyebrow}</p><h2 id="home-services-title">{content.title}</h2></div>
          <p>{content.copy}</p>
        </Reveal>
        <div className="home-services__grid">
          {content.items.map((item, index) => {
            const Icon = icons[index];
            return (
              <Reveal className={'home-service-item home-service-item--' + (index + 1)} delay={index * 0.04} key={item.title}>
                <Icon aria-hidden="true" />
                <div><h3>{item.title}</h3><p>{item.copy}</p></div>
                <span aria-hidden="true">0{index + 1}</span>
              </Reveal>
            );
          })}
        </div>
        <div className="home-services__action"><Link className="home-text-link" to={content.cta.to}>{content.cta.label}<ArrowRight aria-hidden="true" /></Link></div>
      </div>
    </section>
  );
}

export function AudienceSection({ content }) {
  const icons = [UserRound, HeartHandshake, BriefcaseBusiness, CircleUserRound];
  return (
    <section className="home-section home-audience" aria-labelledby="home-audience-title">
      <div className="home-shell home-audience__layout">
        <Reveal className="home-audience__intro">
          <p className="home-eyebrow">{content.eyebrow}</p>
          <h2 id="home-audience-title">{content.title}</h2>
          <p>{content.copy}</p>
          <div className="home-audience__line" aria-hidden="true" />
        </Reveal>
        <div className="home-audience__list">
          {content.items.map((item, index) => {
            const Icon = icons[index];
            return (
              <Reveal className="home-audience-row" delay={index * 0.05} key={item.title}>
                <span><Icon aria-hidden="true" /></span><div><h3>{item.title}</h3><p>{item.copy}</p></div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function WhyChooseUsSection({ content }) {
  const icons = [Handshake, GraduationCap, MessageSquareText, ShieldCheck];
  return (
    <section className="home-section home-why" aria-labelledby="home-why-title">
      <div className="home-shell">
        <Reveal className="home-why__head">
          <SectionIntro eyebrow={content.eyebrow} title={content.title} copy={content.copy} />
        </Reveal>
        <div className="home-why__grid">
          {content.items.map((item, index) => {
            const Icon = icons[index];
            return (
              <Reveal className="home-why-item" delay={index * 0.05} key={item.title}>
                <div className="home-why-item__top"><Icon aria-hidden="true" /><span>0{index + 1}</span></div>
                <h3>{item.title}</h3><p>{item.copy}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function FounderVideoSection({ content }) {
  return (
    <section className="home-section home-video" aria-labelledby="home-video-title">
      <div className="home-shell home-video__grid">
        <Reveal className="home-video__copy">
          <p className="home-eyebrow">Client Experiences</p>
          <h2 id="home-video-title">{content.title}</h2>
          <p>{content.copy}</p>
          <a className="home-text-link home-text-link--light" href={content.cta.href}>{content.cta.label}<ArrowRight aria-hidden="true" /></a>
          <p className="home-video__disclaimer">{content.disclaimer}</p>
        </Reveal>
        <Reveal className="home-video__frame" delay={0.08}>
          <div className="home-video__label"><PlayCircle aria-hidden="true" /><span>{content.title}</span></div>
          <video controls playsInline preload="metadata" poster="/assets/kevin-with-laptop.png">
            <source src={content.src} />
            {content.copy}
          </video>
        </Reveal>
      </div>
    </section>
  );
}

export function TestimonialsSection({ content }) {
  return (
    <section className="home-section home-testimonials" aria-labelledby="home-testimonials-title">
      <div className="home-shell">
        <Reveal><SectionIntro eyebrow={content.eyebrow} title={content.title} align="center" headingId="home-testimonials-title" /></Reveal>
        <div className="home-testimonials__grid">
          {content.items.map((item, index) => (
            <Reveal className="home-testimonial" delay={index * 0.06} key={item.quote}>
              <span className="home-testimonial__mark" aria-hidden="true">“</span>
              <blockquote>{item.quote}</blockquote>
              <div className="home-testimonial__person">
                <span className="home-testimonial__avatar">CL</span>
                <div><strong>{item.name}</strong><small>{item.detail}</small></div>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="home-testimonials__disclaimer">{content.disclaimer}</p>
      </div>
    </section>
  );
}

export function ConsumerRightsSection({ content }) {
  return (
    <section className="home-section home-rights" aria-labelledby="home-rights-title">
      <div className="home-shell home-rights__grid">
        <Reveal className="home-rights__copy">
          <p className="home-eyebrow">Know Your Rights</p>
          <h2 id="home-rights-title">{content.title}</h2>
          <p className="home-rights__intro">{content.intro}</p>
          <p>{content.copy}</p>
          <h3>{content.listTitle}</h3>
          <ul>
            {content.items.map((item) => <li key={item}><CheckCircle2 aria-hidden="true" />{item}</li>)}
          </ul>
        </Reveal>
        <Reveal className="home-rights__notice" delay={0.08}>
          <Scale aria-hidden="true" />
          <p className="home-eyebrow">{content.noticeTitle}</p>
          <h3>{content.noticeTitle}</h3>
          <p>{content.notice}</p>
        </Reveal>
      </div>
    </section>
  );
}

function HomeBookingEmbed({ content }) {
  const [loaded, setLoaded] = useState(false);
  const scriptStatus = useExternalScript(formEmbedScript);
  return (
    <div className={'home-booking' + (loaded ? ' home-booking--loaded' : '')} id="consultation-calendar">
      {!loaded && (
        <div className="home-booking__status" role="status">
          <CalendarCheck aria-hidden="true" />
          <strong>{scriptStatus === 'error' ? content.cta.label : content.title}</strong>
          <span>{content.intro}</span>
          {scriptStatus === 'error' && <a href={content.bookingUrl}>{content.cta.label}<ArrowRight aria-hidden="true" /></a>}
        </div>
      )}
      <iframe
        src={content.bookingUrl}
        title="Schedule your credit consultation"
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

export function ConsultationSection({ content }) {
  return (
    <section className="home-section home-consultation" id="consultation" aria-labelledby="home-consultation-title">
      <div className="home-shell home-consultation__grid">
        <Reveal className="home-consultation__copy">
          <h2 id="home-consultation-title">{content.title}</h2>
          <p className="home-consultation__intro">{content.intro}</p>
          <p>{content.copy}</p>
          <ul>{content.points.map((point) => <li key={point}><Check aria-hidden="true" />{point}</li>)}</ul>
          <Link className="home-button home-button--primary" to={content.cta.to}>{content.cta.label}<ArrowRight aria-hidden="true" /></Link>
        </Reveal>
        <Reveal delay={0.08}><HomeBookingEmbed content={content} /></Reveal>
      </div>
    </section>
  );
}

export function FinalCTA({ content }) {
  return (
    <section className="home-final-cta" aria-labelledby="home-final-title">
      <div className="home-shell home-final-cta__inner">
        <Reveal>
          <div className="home-final-cta__icon"><House aria-hidden="true" /></div>
          <h2 id="home-final-title">{content.title}</h2>
          <p>{content.copy}</p>
          <div className="home-final-cta__actions">
            <Link className="home-button home-button--ivory" to={content.primary.to}>{content.primary.label}<ArrowRight aria-hidden="true" /></Link>
            <a className="home-button home-button--outline-light" href={content.secondary.href}>{content.secondary.label}</a>
          </div>
          <p className="home-final-cta__disclaimer">{content.disclaimer}</p>
        </Reveal>
      </div>
    </section>
  );
}
