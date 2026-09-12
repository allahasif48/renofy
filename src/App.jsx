import { useEffect } from 'react';
import Navbar from './components/Navbar.jsx';

const IMAGES = {
  exterior: 'https://images.unsplash.com/photo-1771366260867-7e07094579d7?auto=format&fit=crop&fm=jpg&q=88&w=2400',
  living: 'https://images.unsplash.com/photo-1776362355123-ca966d36e29c?auto=format&fit=crop&fm=jpg&q=88&w=2200',
  kitchen: 'https://images.unsplash.com/photo-1769326541248-5e09a8ace25b?auto=format&fit=crop&fm=jpg&q=88&w=2200',
  bathroom: 'https://images.unsplash.com/photo-1771929662486-f793e08f0f16?auto=format&fit=crop&fm=jpg&q=88&w=2200',
  bathAlt: 'https://images.unsplash.com/photo-1760546120487-ccb54df9838c?auto=format&fit=crop&fm=jpg&q=88&w=2200'
};

const services = [
  {
    id: 'kitchen',
    number: '01',
    name: 'Kitchen renovations',
    copy: 'Cabinetry, stone, lighting and flow — designed as one complete room rather than a collection of finishes.',
    image: IMAGES.kitchen,
    detail: 'Custom cabinetry · islands · stone · lighting'
  },
  {
    id: 'bathroom',
    number: '02',
    name: 'Bathroom renovations',
    copy: 'Clean lines, durable waterproofing and calm material palettes that make everyday routines feel considered.',
    image: IMAGES.bathroom,
    detail: 'Showers · tile · vanities · fixtures'
  },
  {
    id: 'living',
    number: '03',
    name: 'Living spaces',
    copy: 'Better circulation, stronger sightlines and refined millwork that make the whole floor feel connected.',
    image: IMAGES.living,
    detail: 'Layouts · flooring · millwork · feature walls'
  },
  {
    id: 'basement',
    number: '04',
    name: 'Basements',
    copy: 'Lower levels finished with the same attention as the rooms upstairs — warm, useful and fully part of the home.',
    image: IMAGES.bathAlt,
    detail: 'Family rooms · offices · media · storage'
  }
];

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function App() {
  useEffect(() => {
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      document.documentElement.style.setProperty('--scroll', p.toFixed(4));
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <section className="hero" id="top">
          <div className="hero-kicker">Toronto + Greater Toronto Area</div>
          <h1>
            <span>RENOVATE</span>
            <span>BETTER.</span>
          </h1>
          <div className="hero-meta">
            <p>Thoughtful renovations for homes that deserve more than a surface-level update.</p>
            <a href="#work" className="text-link">Explore what we build <Arrow /></a>
          </div>
          <figure className="hero-visual">
            <img src={IMAGES.exterior} alt="Modern renovated home exterior" />
            <figcaption>Whole-home renovation / Toronto</figcaption>
          </figure>
          <div className="hero-object hero-object-a">STONE</div>
          <div className="hero-object hero-object-b">OAK</div>
          <div className="hero-object hero-object-c">CRAFT</div>
        </section>

        <section className="statement" id="work">
          <div className="statement-grid">
            <p className="section-label">One team. One outcome.</p>
            <h2>We renovate homes. We transform how they feel to live in.</h2>
            <p className="statement-copy">Renofy brings planning, construction and finishing together so every decision supports the same idea: a home that works better, looks better and feels intentionally yours.</p>
          </div>
          <div className="floating-gallery" aria-hidden="true">
            <img className="float-img float-1" src={IMAGES.kitchen} alt="" />
            <img className="float-img float-2" src={IMAGES.bathroom} alt="" />
            <img className="float-img float-3" src={IMAGES.living} alt="" />
          </div>
        </section>

        <section className="principles">
          <div className="principle-head">
            <p className="section-label">What good renovation should feel like</p>
            <h2>Clear decisions. Clean execution. No chaos between trades.</h2>
          </div>
          <div className="principle-row">
            <article><span>01</span><h3>Plan it once.</h3><p>Scope, sequencing and finishes aligned before the work starts.</p></article>
            <article><span>02</span><h3>Build it properly.</h3><p>Craftsmanship, protection and site discipline throughout construction.</p></article>
            <article><span>03</span><h3>Finish the details.</h3><p>The final 10% receives the same attention as the first 90%.</p></article>
          </div>
        </section>

        <section className="services" id="services">
          <div className="services-head">
            <p className="section-label">What we renovate</p>
            <h2>Every room. One renovation language.</h2>
          </div>

          {services.map((service, index) => (
            <article className={`service-scene scene-${index + 1}`} id={service.id} key={service.id}>
              <div className="service-copy">
                <span className="service-number">{service.number}</span>
                <h3>{service.name}</h3>
                <p>{service.copy}</p>
                <div className="service-detail">{service.detail}</div>
              </div>
              <div className="service-image-wrap">
                <img src={service.image} alt={service.name} loading="lazy" />
              </div>
              <div className="service-word" aria-hidden="true">{service.name.split(' ')[0].toUpperCase()}</div>
            </article>
          ))}
        </section>

        <section className="process" id="process">
          <div className="process-intro">
            <p className="section-label">The Renofy process</p>
            <h2>From first idea to final walkthrough.</h2>
          </div>
          <div className="process-track">
            <div className="process-line" />
            {[
              ['01', 'Discover', 'We understand the space, goals, priorities and practical constraints.'],
              ['02', 'Define', 'Scope, selections, sequencing and expectations become clear.'],
              ['03', 'Build', 'Trades move through the project with one coordinated plan.'],
              ['04', 'Finish', 'Details, deficiencies and handover are completed properly.']
            ].map(([n, title, copy]) => (
              <article key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p></article>
            ))}
          </div>
        </section>

        <section className="project-feature">
          <img src={IMAGES.living} alt="Premium renovated living space" loading="lazy" />
          <div className="project-overlay">
            <p className="section-label">Featured direction</p>
            <h2>Warm materials. Strong lines. Spaces made for real life.</h2>
            <a href="#contact" className="pill-link">Start a project <Arrow /></a>
          </div>
        </section>

        <section className="cta" id="contact">
          <p className="section-label">Renofy / Toronto</p>
          <h2>Your home could be next.</h2>
          <p>Tell us what you want to change. We’ll help shape the plan, the build and the details that make it feel complete.</p>
          <div className="cta-actions">
            <a className="cta-primary" href="mailto:hello@renofy.ca">Start your renovation <Arrow /></a>
            <span>Serving Toronto & the GTA</span>
          </div>
          <footer>
            <span>© {new Date().getFullYear()} Renofy</span>
            <span>Renovate better together.</span>
            <span className="photo-credit">Photography references via Unsplash</span>
          </footer>
        </section>
      </main>
    </>
  );
}
