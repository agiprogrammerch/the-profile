import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Skills from '@/components/Skills';
import About from '@/components/About';
import Projects from '@/components/Projects';
import Footer from '@/components/Footer';
import Cursor from '@/components/Cursor';
import MatrixCanvas from '@/components/MatrixCanvas';
import StarsCanvas from '@/components/StarsCanvas';
import ScrollProgress from '@/components/ScrollProgress';
import VisitBadge from '@/components/VisitBadge';

export default function Home() {
  return (
    <>
      <Cursor />
      <MatrixCanvas />
      <StarsCanvas />
      <ScrollProgress />
      <VisitBadge />
      <Navbar />
      <main id="main-content">
        <Hero />
        <Skills />
        <About />
        <Projects />
      </main>
      <Footer />
    </>
  );
}