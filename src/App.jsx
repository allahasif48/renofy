import { useEffect, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import SectionPanel from './components/SectionPanel.jsx';
import HouseScene from './scenes/HouseScene.jsx';

const sections = [
  {
    id: 'top',
    eyebrow: 'Renofy immersive home',
    title: 'Step inside better spaces.',
    copy: 'A renovation should feel different before it even begins. Scroll through one Renofy home and explore how every room can be transformed with thoughtful design, skilled craftsmanship and a finish built to last.',
    points: ['Whole-home renovations', 'Design + build', 'GTA homeowners']
  },
  {
    id: 'entrance',
    eyebrow: '01 — Entrance & foyer',
    title: 'First impressions, rebuilt.',
    copy: 'From the front door to the first sightline inside, we create entrances that feel considered, welcoming and connected to the rest of the home.',
    points: ['Entry doors', 'Flooring', 'Trim & millwork', 'Lighting']
  },
  {
    id: 'living',
    eyebrow: '02 — Living spaces',
    title: 'Make everyday space feel exceptional.',
    copy: 'Open layouts, feature walls, integrated storage and refined finishes turn the rooms you use most into spaces you actually want to spend time in.',
    points: ['Layout changes', 'Feature walls', 'Flooring', 'Custom millwork']
  },
  {
    id: 'kitchen',
    eyebrow: '03 — Kitchen renovations',
    title: 'The heart of the home, redesigned.',
    copy: 'We bring cabinetry, counters, lighting, flooring and flow together so the kitchen works as beautifully as it looks.',
    points: ['Custom cabinetry', 'Stone counters', 'Backsplashes', 'Islands & lighting'],
    align: 'right'
  },
  {
    id: 'bathroom',
    eyebrow: '04 — Bathroom renovations',
    title: 'Quiet luxury, built for real life.',
    copy: 'From compact powder rooms to complete primary ensuites, every surface is planned around durability, water management, comfort and clean detailing.',
    points: ['Walk-in showers', 'Tile', 'Vanities', 'Fixtures'],
    align: 'left'
  },
  {
    id: 'basement',
    eyebrow: '05 — Basement finishing',
    title: 'Turn unused square footage into living space.',
    copy: 'Family rooms, home offices, entertainment spaces and flexible lower levels — finished to feel like part of the home, not an afterthought.',
    points: ['Basement finishing', 'Media rooms', 'Home offices', 'Storage'],
    align: 'right'
  },
  {
    id: 'finished',
    eyebrow: '06 — Complete home',
    title: 'One home. One vision. Finished properly.',
    copy: 'Renofy coordinates the details across the entire renovation so materials, proportions and finishes feel intentional from room to room.',
    points: ['Planning', 'Construction', 'Finishing', 'Final walkthrough']
  }
];

export default function App() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <>
      <Navbar />
      <HouseScene progress={progress} />
      <ScrollProgress progress={progress} />

      <main>
        {sections.map((section, index) => (
          <section className={`story-section story-${index}`} id={section.id} key={section.id}>
            <SectionPanel
              eyebrow={section.eyebrow}
              title={section.title}
              copy={section.copy}
              points={section.points}
              align={section.align || (index % 2 ? 'right' : 'left')}
            >
              {index === 0 && <div className="scroll-hint"><span /> Scroll to enter</div>}
            </SectionPanel>
          </section>
        ))}

        <section className="contact-section" id="contact">
          <div className="contact-card">
            <p className="eyebrow">Start your renovation</p>
            <h2>Ready to transform your home?</h2>
            <p>Tell us what you want to change and we’ll help you shape the next version of your space.</p>
            <div className="contact-actions">
              <a href="mailto:hello@renofy.ca" className="primary-btn">Request a free quote</a>
              <a href="tel:+10000000000" className="secondary-btn">Call Renofy</a>
            </div>
            <p className="microcopy">Replace the placeholder phone number before launch.</p>
          </div>
          <footer>© {new Date().getFullYear()} Renofy. Renovations. Reimagined.</footer>
        </section>
      </main>
    </>
  );
}
