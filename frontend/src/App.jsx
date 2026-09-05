import { useMemo } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { useScrollSpy } from './hooks/useScrollSpy';
import { navLinks } from './data/portfolio';

import Navbar from './components/layout/Navbar';
import SectionRail from './components/layout/SectionRail';
import Footer from './components/layout/Footer';

import Hero from './components/sections/Hero';
import MetricsStrip from './components/sections/MetricsStrip';
import Projects from './components/sections/Projects';
import Achievements from './components/sections/Achievements';
import Timeline from './components/sections/Timeline';
import SkillMatrix from './components/sections/SkillMatrix';
import Contact from './components/sections/Contact';

function Page() {
  const sectionIds = useMemo(() => navLinks.map((link) => link.id), []);
  const activeSection = useScrollSpy(sectionIds);

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar activeSection={activeSection} />
      <SectionRail activeSection={activeSection} />
      <main id="main">
        <Hero />
        <MetricsStrip />
        <Projects />
        <Achievements />
        <Timeline />
        <SkillMatrix />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Page />
    </ThemeProvider>
  );
}
