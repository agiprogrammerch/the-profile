'use client';

import { useState } from 'react';

const GITHUB_USERNAME = 'agiprogrammerch';
const EMAIL = 'agiprogrammer@gmail.com';

export default function Footer() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = EMAIL;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <footer role="contentinfo">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="brand-name">ARUSH SHAKYA</div>
          <p>
            Cybersecurity & DSP Engineering Student. Building deterministic,
            offline-first security, acoustic communication, and statistical
            analysis tools from scratch. Zero paid APIs, zero telemetry, zero AI bloat.
          </p>
        </div>

        <div className="footer-col">
          <h4>REPOSITORIES</h4>
          <ul>
            <li>
              <a href="/projects/echobaud" onClick={(e) => { e.preventDefault(); window.location.href = '/projects/echobaud'; }}>
                echobaud
              </a>
            </li>
            <li>
              <a href="/projects/phaseveil" onClick={(e) => { e.preventDefault(); window.location.href = '/projects/phaseveil'; }}>
                phaseveil
              </a>
            </li>
            <li>
              <a href="/projects/osint-center" onClick={(e) => { e.preventDefault(); window.location.href = '/projects/osint-center'; }}>
                osint-center
              </a>
            </li>
            <li>
              <a href="/projects/tensorgate" onClick={(e) => { e.preventDefault(); window.location.href = '/projects/tensorgate'; }}>
                tensorgate
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>PROFILES</h4>
          <ul>
            <li>
              <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>NAVIGATION</h4>
          <ul>
            <li><a href="#about">About</a></li>
            <li><a href="#skills">Skills</a></li>
            <li>
              <button onClick={copyEmail} className="contact-btn" aria-label="Copy email address">
                {copied ? 'COPIED!' : 'CONTACT'}
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 <span className="green">ARUSH SHAKYA</span>. All rights reserved.</p>
        <p>Built with <span className="green">Next.js</span> &bull; TypeScript &bull; Tailwind CSS</p>
      </div>
    </footer>
  );
}