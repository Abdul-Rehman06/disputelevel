import { motion as Motion } from 'framer-motion';

export default function PageHero({ children, variant = 'hero' }) {
  return (
    <Motion.section
      className={'page-section page-hero ' + variant}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="section-shell">{children}</div>
    </Motion.section>
  );
}
