export default function PricingCard({ children, featured = false }) {
  return <article className={'content-card pricing-card' + (featured ? ' featured' : '')}>{children}</article>;
}
