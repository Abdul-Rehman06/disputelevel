import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion as Motion } from 'framer-motion';

export default function FAQAccordion({ question, answer }) {
  const [open, setOpen] = useState(false);
  const generatedId = useId().replace(/:/g, '');
  const answerId = 'faq-answer-' + generatedId;

  return (
    <div className={'faq-item' + (open ? ' open' : '')}>
      <button type="button" aria-expanded={open} aria-controls={answerId} onClick={() => setOpen((value) => !value)}>
        <span>{question}</span><ChevronDown aria-hidden="true" />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <Motion.div
            id={answerId}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p>{answer}</p>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
