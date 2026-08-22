import { Scale } from 'lucide-react';

export default function DisclosurePanel({ title, children, tone = 'light' }) {
  return (
    <aside className={'disclosure-panel ' + tone} aria-label={title}>
      <Scale aria-hidden="true" />
      <div>
        <h2>{title}</h2>
        {children}
      </div>
    </aside>
  );
}
