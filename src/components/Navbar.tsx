'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobile = () => setMobileOpen(false);

  const navLinks = [
    { href: '#hero', label: '~/home' },
    { href: '#skills', label: '~/skills' },
    { href: '#about', label: '~/about' },
    { href: '#projects', label: '~/projects' },
  ];

  return (
    <>
      <nav className={scrolled ? 'scrolled' : ''} role="navigation" aria-label="Main navigation">
        <Link href="#hero" className="nav-brand" aria-label="Arush Shakya Home">
          ARUSH<span>.</span>SH
        </Link>

        <ul className="nav-links" role="menubar">
          {navLinks.map((link) => (
            <li key={link.href} role="none">
              <Link
                href={link.href}
                className="nav-link"
                role="menuitem"
                onClick={closeMobile}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-status" aria-hidden="true">
          <div className="status-dot" />
          <span>ONLINE &bull; AGRA, IN</span>
        </div>

        <button
          className="hamburger"
          id="hamburger"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className={mobileOpen ? 'open' : ''} aria-hidden="true" />
          <span className={mobileOpen ? 'open' : ''} aria-hidden="true" />
          <span className={mobileOpen ? 'open' : ''} aria-hidden="true" />
        </button>
      </nav>

      <div
        className={`mobile-menu ${mobileOpen ? 'open' : ''}`}
        id="mobile-menu"
        role="navigation"
        aria-label="Mobile navigation"
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={closeMobile}
            className="mobile-link"
          >
            {link.label}
          </Link>
        ))}
        <div className="mobile-status" aria-hidden="true">
          <div className="status-dot" />
          <span>ONLINE &bull; AGRA, IN</span>
        </div>
      </div>
    </>
  );
}