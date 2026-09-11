import { useEffect, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import ScrollProgress from './components/ScrollProgress.jsx';
import SectionPanel from './components/SectionPanel.jsx';
import RealHouseScene from './scenes/RealHouseScene.jsx';

const sections = [
  {
    id: 'top',
    eyebrow: 'Renofy — Toronto renovations',
    title: 'Walk into what your home could become.',
    copy: 'A guided journey through one reimagined home — from the first approach to the rooms that shape everyday life.',
    points: ['Whole-home renovation', 'Design + build', 'Greater Toronto Area']
  },
  {
    id: 'entrance',
    eyebrow: '01 — Arrival',
    title: 'The renovation starts before you step inside.',
    copy: 'A stronger entrance, better proportions and a clearer first sightline set the tone for everything beyond the front door.',
    points: ['Exterior detailing', 'Entry doors', 'Lighting', 'Millwork']
  },
  {
    id: 'living',
    eyebrow: '02 — Living',
    title: 'Space that feels calm, open and considered.',
    copy: 'We reshape circulation, sightlines and finishes so the rooms you use every day feel connected rather than simply renovated.',
    points: ['Layout changes', 'Feature walls', 'Flooring', 'Custom millwork']
  },
  {
    id: 'kitchen',
    eyebrow: '03 — Kitchen',
    title: 'Built around the way you actually live.',
    copy: 'Cabinetry, stone, lighting and movement come together in one cohesive room — practical enough for every day and refined enough to anchor the home.',
    points: ['Custom cabinetry', 'Stone surfaces', 'Islands', 'Architectural lighting'],
    align: 'right'
  },
  {
    id: 'bathroom',
    eyebrow: '04 — Bath',
    title: 'Quiet materials. Precise execution.',
    copy: 'Durable waterproofing, balanced lighting and clean detailing create rooms that feel composed long after the renovation is complete.',
    points: ['Walk-in showers', 'Large-format tile', 'Vanities', 'Fixtures']
  },
  {
    id: 'basement',
    eyebrow: '05 — Lower level',
    title: 'Make every square foot belong to the home.',
    copy: 'Finished basements should feel intentional, not secondary — with the same material language, comfort and attention as the main floor.',
    points: ['Family rooms', 'Media spaces', 'Home offices', 'Storage'],
    align: 'right'
  },
  {
    id: 'finished',
    eyebrow: '06 — Complete home',
    title: 'One renovation. One consistent vision.',
    copy: 'From demolition to finishing details, Renofy coordinates the work so every room feels like part of the same home.',
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
      <RealHouseScene progress={progress} />
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
            <p className="eyebrow">Begin your project</p>
            <h2>Make the next version of your home exceptional.</h2>
            <p>Tell us what you want to change. We’ll help shape the plan, the build and the details that make it feel complete.</p>
            <div className="contact-actions">
              <a href="mailto:hello@renofy.ca" className="primary-btn">Request a consultation</a>
              <a href="tel:+10000000000" className="secondary-btn">Call Renofy</a>
            </div>
            <p className="microcopy">Toronto & Greater Toronto Area</p>
          </div>
          <footer>© {new Date().getFullYear()} Renofy. Renovations. Reimagined.</footer>
        </section>
      </main>
    </>
  );
}
