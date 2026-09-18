import { useState, useEffect, useCallback } from 'react';
import Nav from './components/Nav';
import LiquidEther from './components/LiquidEther';
import Hero from './components/Hero';
import About from './components/About';
import Works from './components/Works';
import Tech from './components/Tech';
import Contact from './components/Contact';
import Modal from './components/Modal';

const sections = ['hero', 'about', 'works', 'tech', 'contact'];

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [modalWorkId, setModalWorkId] = useState(null);
  const [showBackTop, setShowBackTop] = useState(false);

  const handleNavigate = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    let ticking = false;
    let currentSection = 'hero';
    const updateSection = () => {
      const scrollY = window.scrollY + window.innerHeight / 2;
      let next = 'hero';
      for (let i = 0; i < sections.length; i++) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollY) next = sections[i];
      }
      if (next !== currentSection) { currentSection = next; setActiveSection(next); }
      setShowBackTop(window.scrollY > window.innerHeight * 0.5);
      ticking = false;
    };
    const handleScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(updateSection); } };
    window.addEventListener('scroll', handleScroll, { passive: true });
    updateSection();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="global-liquid-ether">
        <LiquidEther
          colors={['#A855F7', '#7C3AED', '#C084FC']}
          mouseForce={14}
          cursorSize={90}
          resolution={0.3}
          autoDemo={true}
          autoSpeed={0.3}
          autoIntensity={0.8}
          autoResumeDelay={4000}
        />
      </div>

      <Nav onNavigate={handleNavigate} activeSection={activeSection} />

      <div className="scroll-dots">
        {sections.map((sec) => (
          <div
            key={sec}
            className={`scroll-dot ${activeSection === sec ? 'active' : ''}`}
            onClick={() => handleNavigate(sec)}
          />
        ))}
      </div>

      <Hero onNavigate={handleNavigate} />
      <About />
      <Works onOpenModal={setModalWorkId} />
      <Tech />
      <Contact />

      <div className="footer">© 2026 YE FANG. All rights reserved.</div>

      {showBackTop && (
        <div className="back-top liquid-glass" onClick={() => handleNavigate('hero')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
          <span>回到顶部</span>
        </div>
      )}

      <Modal workId={modalWorkId} onClose={() => setModalWorkId(null)} />
    </>
  );
}
