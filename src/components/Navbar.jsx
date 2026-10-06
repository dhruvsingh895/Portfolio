import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, ArrowUpRight, Menu, X } from 'lucide-react';
import { profile } from '../data';
import { Magnetic } from './UI';
import Monogram from './Monogram';

const links = [
  { href: '#work', label: 'Work' },
  { href: '#about', label: 'About' },
  { href: '#journey', label: 'Journey' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar({ accent, onAccentChange }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const menuButton = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: '-20% 0px -55% 0px' },
    );
    document.querySelectorAll('section[id], footer[id]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    if (!open) return;
    const close = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open]);

  return (
    <header className="site-header">
      <a
        className="wordmark"
        href="#home"
        aria-label="Dhruv Singh, back to top"
        onClick={() => setOpen(false)}
      >
        <span className="brand-emblem"><Monogram /></span>
        <span className="wordmark-name">
          DHRUV SINGH<span>ENGINEER & DEVELOPER</span>
        </span>
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className={active === link.href ? 'active' : ''}
            aria-current={active === link.href ? 'location' : undefined}
          >
            {link.label}
            <span className="nav-dot" />
          </a>
        ))}
      </nav>
      <div className="nav-actions">
        <button
          className="theme-switch"
          onClick={onAccentChange}
          role="switch"
          aria-checked={accent === 'orange'}
          aria-label="Orange and black theme"
          title={`Switch to ${accent === 'orange' ? 'charcoal and silver' : 'orange and black'} theme`}
        >
          <span className="theme-switch-label" aria-hidden="true">
            {accent === 'orange' ? 'Orange' : 'Silver'}
          </span>
          <span className="theme-switch-track" aria-hidden="true">
            <span className="theme-switch-thumb" />
          </span>
        </button>
        <Magnetic className="resume-link" href={profile.resume} download>
          Résumé <ArrowDownToLine size={14} aria-hidden="true" />
        </Magnetic>
        <button
          ref={menuButton}
          className="menu-toggle"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      {open && (
        <nav className="mobile-nav" id="mobile-menu" aria-label="Mobile navigation">
          {links.map((link, i) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              <span className="mono">0{i + 1}</span>
              {link.label}
              <ArrowUpRight />
            </a>
          ))}
          <a className="mobile-resume" href={profile.resume} download>
            Download résumé <ArrowDownToLine size={20} />
          </a>
        </nav>
      )}
      <div className="reading-progress" />
    </header>
  );
}
