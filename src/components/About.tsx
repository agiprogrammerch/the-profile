'use client';

import { useEffect, useRef } from 'react';

export default function About() {
  const hexStreamRef = useRef<HTMLSpanElement>(null);

  // Hardware stats - render immediately on both SSR and client
  const hardwareStats = {
    cpu: 'i3-1115G4',
    ram: '8GB DDR4',
    gpu: 'iGPU 128MB',
    thermal: '<40°C',
  };

  useEffect(() => {
    // Animate hex stream
    const interval = setInterval(() => {
      if (hexStreamRef.current) {
        const bytes = Array.from({ length: 10 }, () =>
          Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase()
        );
        hexStreamRef.current.textContent = bytes.join(' ');
      }
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="encryption-section" id="about">
      <div className="enc-inner">
        <div className="enc-left">
          <div className="section-label" style={{ textAlign: 'left', marginBottom: '0.5rem' }}>
            ENGINEERING DOSSIER
          </div>
          <h2 className="enc-title">
            Built Under Constraints.<br /><span className="accent">Engineered for Privacy.</span>
          </h2>
          <p className="enc-text">
            Class 11 Physics, Chemistry, Mathematics, and Computer Science student in{' '}
            <b>Agra, India</b>, and <b>SilverZone Computer Science Olympiad Gold Medalist</b>,
            preparing for <b>2028 undergraduate studies in Computer Science & Engineering</b>.
            Focused on low-level systems engineering across digital signal processing,
            applied cryptography, computer networking, and defensive security.
          </p>
          <p className="enc-text">
            Started building systems from scratch out of real-world necessity: paid cloud APIs
            and enterprise tooling were financially out of reach, while most "free" consumer
            services trade user privacy for silent telemetry, spyware, and bloat. Every project
            is engineered from first principles to run <b>100% locally</b>, remain fully auditable,
            and run deterministically with minimal overhead.
          </p>
          <p className="enc-text">
            Every architecture is profiled and stress-tested against a strict consumer hardware
            baseline — <b>Asus VivoBook X515EA</b> (<b>Intel Core i3-1115G4</b> 2C/4T up to
            4.10 GHz, <b>8 GB DDR4 RAM</b>, integrated <b>Intel UHD Graphics 128 MB VRAM</b>,
            500 GB HDD) running a thermally tuned Linux environment held <b>under 40°C</b> under
            sustained workloads, alongside a standard built-in webcam/mic, commodity monitor/AP-mode
            Wi-Fi adapter, and a mid-range Android device for air-gapped and LAN socket testing.
          </p>
          <div className="enc-stats" role="list" aria-label="Engineering metrics">
            <div className="stat-box" role="listitem">
              <div className="stat-num">GOLD</div>
              <div className="stat-label">SILVERZONE CS OLYMPIAD</div>
            </div>
            <div className="stat-box" role="listitem">
              <div className="stat-num">$0</div>
              <div className="stat-label">PAID APIS & CLOUD COST</div>
            </div>
            <div className="stat-box" role="listitem">
              <div className="stat-num">{"< 1 GB"}</div>
              <div className="stat-label">PEAK RAM CEILING</div>
            </div>
            <div className="stat-box" role="listitem">
              <div className="stat-num">100%</div>
              <div className="stat-label">DETERMINISTIC / ZERO AI</div>
            </div>
          </div>
        </div>
        <div className="enc-right">
          <div className="lock-visual" role="img" aria-label="Local-first zero telemetry lock visualization">
            <div className="lock-icon" aria-hidden="true">🔒</div>
            <div className="lock-label">LOCAL-FIRST • ZERO TELEMETRY</div>
            <div className="lock-stream">
              <span ref={hexStreamRef} id="hex-stream" aria-hidden="true">
                00 FF 41 2A 9D 4E DD 00 F5 FF
              </span>
            </div>
            <div className="hardware-readout" aria-live="polite">
              CPU: {hardwareStats.cpu} | RAM: {hardwareStats.ram} | GPU: {hardwareStats.gpu} | THERMAL: {hardwareStats.thermal}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}