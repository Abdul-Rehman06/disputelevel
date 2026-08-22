import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion as Motion } from 'framer-motion';

const formUrl = 'https://api.kbrownconsultant.com/widget/form/6u5ymHnjsWJYSyabGXHR';

export default function TradelinesModal({ selected, onClose }) {
  const dialogRef = useRef(null);
  const previousFocus = useRef(null);

  useEffect(() => {
    if (!selected) return undefined;
    previousFocus.current = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const dialog = dialogRef.current;
    const focusable = () => [...dialog.querySelectorAll('button, iframe, a[href], [tabindex]:not([tabindex="-1"])')];
    requestAnimationFrame(() => focusable()[0]?.focus());

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const elements = focusable();
      if (!elements.length) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus.current?.focus();
    };
  }, [onClose, selected]);

  return (
    <AnimatePresence>
      {selected && (
        <Motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => event.target === event.currentTarget && onClose()}
        >
          <Motion.div
            ref={dialogRef}
            className="tradelines-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tradelines-modal-title"
            initial={{ opacity: 0, y: 22, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <div className="modal-header">
              <div>
                <p>SELECTED TRADELINE</p>
                <h2 id="tradelines-modal-title">{selected}</h2>
              </div>
              <button type="button" onClick={onClose} aria-label="Close tradelines form"><X /></button>
            </div>
            <iframe src={formUrl} title="Choose this tradeline form" />
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
