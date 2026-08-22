import { useEffect, useRef, useState } from 'react';
import { CalendarDays, Menu, X } from 'lucide-react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { globalContent } from '../content/globalContent';
import SignupWidget from './SignupWidget';

export default function Header() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef(null);
  const mobileNav = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusable = mobileNav.current?.querySelectorAll('a, button');
    focusable?.[0]?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
      if (event.key === 'Tab' && focusable?.length) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link to="/" className="brand" aria-label="Dispute Levels home">
          <img src="/assets/Logos/logo.png" alt="Dispute Levels" />
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {globalContent.navigation.map(({ label, to }) => (
            <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <Link to="/consultation" className="schedule-link">
            <CalendarDays size={17} aria-hidden="true" />Schedule a Call
          </Link>
          <SignupWidget compact />
          <button
            ref={menuButton}
            className="menu-button"
            type="button"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <Motion.div
            className="mobile-nav-layer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
          >
            <button className="mobile-nav-backdrop" type="button" aria-label="Close navigation menu" onClick={() => setOpen(false)} />
            <Motion.nav
              ref={mobileNav}
              id="mobile-navigation"
              className="mobile-nav"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 32 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mobile-nav-label">Dispute Levels</p>
              {globalContent.navigation.map(({ label, to }, index) => (
                <NavLink key={to} to={to} end={to === '/'}><span>0{index + 1}</span>{label}</NavLink>
              ))}
              <div className="mobile-nav-actions">
                <Link to="/consultation" className="mobile-schedule"><CalendarDays size={18} aria-hidden="true" />Schedule a Call</Link>
                <a className="mobile-signup" href={globalContent.billingUrl}>Get Started For $0</a>
              </div>
            </Motion.nav>
          </Motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
