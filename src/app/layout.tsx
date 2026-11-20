import type { Metadata, Viewport } from 'next';
import { shareTechMono, orbitron, vt323 } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Arush Shakya | Cybersecurity & DSP Engineering Student',
  description: 'Independent systems builder engineering offline-first security, acoustic communication, and statistical analysis tools from scratch.',
  keywords: ['cybersecurity', 'DSP', 'cryptography', 'signal processing', 'portfolio', 'Arush Shakya'],
  authors: [{ name: 'Arush Shakya' }],
  openGraph: {
    title: 'Arush Shakya | Cybersecurity & DSP Engineering Student',
    description: 'Independent systems builder engineering offline-first security, acoustic communication, and statistical analysis tools from scratch.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#020b02',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${shareTechMono.variable} ${orbitron.variable} ${vt323.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}