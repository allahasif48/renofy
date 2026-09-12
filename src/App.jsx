import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar.jsx';

gsap.registerPlugin(ScrollTrigger);

const IMAGES = {
  exterior: 'https://images.unsplash.com/photo-1771366260867-7e07094579d7?auto=format&fit=crop&fm=jpg&q=88&w=2400',
  living: 'https://images.unsplash.com/photo-1776362355123-ca966d36e29c?auto=format&fit=crop&fm=jpg&q=88&w=2200',
  kitchen: 'https://images.unsplash.com/photo-1769326541248-5e09a8ace25b?auto=format&fit=crop&fm=jpg&q=88&w=2200',
  bathroom: 'https://images.unsplash.com/photo-1771929662486-f793e08f0f16?auto=format&fit=crop&fm=jpg&q=88&w=2200',
  basement: 'https://images.unsplash.com/photo-1760546120487-ccb54df9838c?auto=format&fit=crop&fm=jpg&q=88&w=2200'
};

const services = [
  {
    id:'kitchen', no:'01', tone:'dark', eyebrow:'Kitchen renovations',
    title:['THE HEART','OF A BETTER','HOME'],
    body:'Beautiful. Functional. Built for real life. From custom cabinetry to premium stone, we create kitchens that bring people together.',
    image:IMAGES.kitchen, note:'From materials to memories', materials:['Stone','Cabinetry','Lighting']
  },
  {
    id:'bathroom', no:'02', tone:'light', eyebrow:'Bathroom renovations',
    title:['YOUR','EVERYDAY','ESCAPE'],
    body:'Modern design. Lasting quality. Transform your bathroom into a calm, considered space that feels like a retreat every day.',
    image:IMAGES.bathroom, note:'Small details. A bigger you.', materials:['Tile','Glass','Fixtures']
  },
  {
    id:'living', no:'03', tone:'dark', eyebrow:'Living spaces',
    title:['SPACES','THAT BRING','PEOPLE CLOSER'],
    body:'Open, inviting and built around your life. From flooring to feature walls, we create living spaces that feel cohesive and complete.',
    image:IMAGES.living, note:'Designed for real life.', materials:['Oak','Millwork','Lighting']
  },
  {
    id:'basement', no:'04', tone:'light', eyebrow:'Basement renovations',
    title:['MORE SPACE.','MORE','POSSIBILITIES.'],
    body:'Turn unused square footage into something extraordinary: family rooms, offices, media spaces and flexible living.',
    image:IMAGES.basement, note:'Finished spaces. Brighter futures.', materials:['Storage','Media','Warmth']
  }
];

function Arrow(){ return <span aria-hidden="true">→</span>; }

function SplitTitle({ lines }){
  return <h2>{lines.map((line,i)=><span className="line-mask" key={i}><span className="line-inner">{line}</span></span>)}</h2>;
}

function ServiceScene({service,index}){
  return (
    <section className={`service-band ${service.tone} service-${index}`} id={service.id}>
      <div className="service-copy-block">
        <div className="eyebrow-row"><span>{service.no}</span><p>{service.eyebrow}</p></div>
        <SplitTitle lines={service.title}/>
        <p className="service-body">{service.body}</p>
        <a className="inline-link magnetic" href="#contact">Explore {service.eyebrow.split(' ')[0]} <Arrow/></a>
      </div>

      <div className="component-stage" aria-hidden="true">
        <div className="component component-a"><img src={service.image} alt=""/></div>
        <div className="component component-b"><img src={service.image} alt=""/></div>
        <div className="component component-c"><img src={service.image} alt=""/></div>
        <div className="component component-d"><img src={service.image} alt=""/></div>
        <div className="component-labels">
          {service.materials.map((m,i)=><span key={m} className={`material material-${i}`}>{m}</span>)}
        </div>
      </div>

      <div className="finished-room">
        <img src={service.image} alt={`${service.eyebrow} example`} />
        <div className="finished-shade"/>
      </div>

      <p className="side-note">{service.note}</p>
    </section>
  );
}

export default function App(){
  const root=useRef(null);
  const [compare,setCompare]=useState(50);

  useLayoutEffect(()=>{
    if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx=gsap.context(()=>{
      gsap.timeline({scrollTrigger:{trigger:'.hero-v3',start:'top top',end:'+=170%',pin:true,scrub:1}})
        .fromTo('.hero-photo',{scale:.86,yPercent:7},{scale:1,yPercent:0,duration:1},0)
        .fromTo('.hero-slice.a',{xPercent:-140,yPercent:-30,rotate:-10,opacity:0},{xPercent:-24,yPercent:-8,rotate:-2,opacity:1,duration:1},0)
        .fromTo('.hero-slice.b',{xPercent:140,yPercent:-18,rotate:10,opacity:0},{xPercent:26,yPercent:-4,rotate:2,opacity:1,duration:1},0)
        .fromTo('.hero-slice.c',{xPercent:-120,yPercent:105,rotate:-8,opacity:0},{xPercent:-18,yPercent:34,rotate:-3,opacity:1,duration:1},.05)
        .fromTo('.hero-slice.d',{xPercent:130,yPercent:100,rotate:9,opacity:0},{xPercent:22,yPercent:28,rotate:3,opacity:1,duration:1},.05)
        .fromTo('.hero-callout',{x:45,opacity:0},{x:0,opacity:1,stagger:.08,duration:.5},.3)
        .to('.hero-title-v3 .gold',{xPercent:7,duration:.65},.5)
        .to('.hero-copy-v3',{y:-32,opacity:.38,duration:.45},1.08);

      gsap.utils.toArray('.service-band').forEach((section,index)=>{
        const q=gsap.utils.selector(section);
        const tl=gsap.timeline({scrollTrigger:{trigger:section,start:'top top',end:'+=180%',pin:true,scrub:1,anticipatePin:1}});

        tl.from(q('.line-inner'),{yPercent:115,stagger:.07,duration:.55,ease:'power3.out'},0)
          .fromTo(q('.finished-room'),{clipPath:'inset(8% 10% 8% 10% round 16px)',scale:.94},{clipPath:'inset(0% 0% 0% 0% round 0px)',scale:1,duration:.8},0)
          .fromTo(q('.component-a'),{xPercent:-180,yPercent:-20,rotate:-15,opacity:0},{xPercent:-8,yPercent:-10,rotate:-3,opacity:1,duration:.8},.05)
          .fromTo(q('.component-b'),{xPercent:180,yPercent:-10,rotate:14,opacity:0},{xPercent:10,yPercent:-5,rotate:3,opacity:1,duration:.8},.08)
          .fromTo(q('.component-c'),{xPercent:-160,yPercent:140,rotate:-11,opacity:0},{xPercent:-5,yPercent:15,rotate:-2,opacity:1,duration:.8},.12)
          .fromTo(q('.component-d'),{xPercent:160,yPercent:130,rotate:12,opacity:0},{xPercent:8,yPercent:20,rotate:2,opacity:1,duration:.8},.15)
          .fromTo(q('.material'),{opacity:0,y:18},{opacity:1,y:0,stagger:.08,duration:.35},.34)
          .fromTo(q('.side-note'),{opacity:0,y:35},{opacity:1,y:0,duration:.35},.46)
          .to(q('.component-stage'),{xPercent:index%2?-2:2,duration:.55},.82)
          .to(q('.component-a'),{xPercent:-26,yPercent:-22,rotate:-7,duration:.42},.9)
          .to(q('.component-b'),{xPercent:28,yPercent:-16,rotate:6,duration:.42},.9)
          .to(q('.component-c'),{xPercent:-20,yPercent:30,rotate:-5,duration:.42},.9)
          .to(q('.component-d'),{xPercent:24,yPercent:35,rotate:5,duration:.42},.9)
          .to(q('.finished-room img'),{scale:1.07,duration:.55},.82);
      });

      gsap.timeline({scrollTrigger:{trigger:'.process-v3',start:'top top',end:'+=120%',pin:true,scrub:1}})
        .fromTo('.process-fill',{scaleX:0},{scaleX:1,duration:1,ease:'none'})
        .fromTo('.process-step-v3',{y:40,opacity:.2},{y:0,opacity:1,stagger:.18,duration:.4},0)
        .to('.process-wheel',{rotate:360,duration:1,ease:'none'},0);

      gsap.fromTo('.project-proof-v3',{y:80,opacity:.6},{y:0,opacity:1,duration:1,scrollTrigger:{trigger:'.project-proof-v3',start:'top 80%',end:'top 35%',scrub:1}});
      gsap.fromTo('.footer-cta-v3 h2',{y:90,opacity:0},{y:0,opacity:1,duration:.9,ease:'power3.out',scrollTrigger:{trigger:'.footer-cta-v3',start:'top 75%'}});

      gsap.utils.toArray('.magnetic').forEach(el=>{
        const move=e=>{const r=el.getBoundingClientRect();gsap.to(el,{x:(e.clientX-r.left-r.width/2)*.12,y:(e.clientY-r.top-r.height/2)*.12,duration:.22})};
        const reset=()=>gsap.to(el,{x:0,y:0,duration:.35,ease:'power3.out'});
        el.addEventListener('mousemove',move);el.addEventListener('mouseleave',reset);
      });
    },root);

    return ()=>ctx.revert();
  },[]);

  return <div ref={root}>
    <Navbar/>
    <main>
      <section className="hero-v3" id="top">
        <div className="hero-copy-v3">
          <p className="hero-kicker-v3">Toronto & GTA renovations</p>
          <h1 className="hero-title-v3"><span>RENOVATE</span><span>BETTER.</span><span className="gold">LIVE BRIGHTER.</span></h1>
          <p className="hero-sub-v3">Thoughtful renovations. Lasting value. From kitchens to full-home transformations, Renofy creates spaces you’ll love to live in.</p>
          <a className="scroll-link magnetic" href="#services"><span>↓</span> Scroll to explore</a>
        </div>

        <div className="hero-assembly-v3" aria-hidden="true">
          <div className="hero-photo"><img src={IMAGES.exterior} alt=""/></div>
          <div className="hero-slice a"><img src={IMAGES.exterior} alt=""/></div>
          <div className="hero-slice b"><img src={IMAGES.exterior} alt=""/></div>
          <div className="hero-slice c"><img src={IMAGES.exterior} alt=""/></div>
          <div className="hero-slice d"><img src={IMAGES.exterior} alt=""/></div>
        </div>

        <div className="hero-callouts" aria-hidden="true">
          {['Roofing','Millwork','Glass','Concrete','Spaces','A brighter you'].map((x,i)=><div className="hero-callout" key={x}><i/><span>{x}</span><b>{String(i+1).padStart(2,'0')}</b></div>)}
        </div>
      </section>

      <section id="services" className="services-v3">
        {services.map((service,index)=><ServiceScene key={service.id} service={service} index={index}/>) }
      </section>

      <section className="process-v3" id="process">
        <div className="process-intro-v3"><p className="section-label">Our process</p><h2>A clearer path<br/>to a better home.</h2><p>A simple, transparent process from start to finish. Less stress. Better decisions.</p></div>
        <div className="process-wheel">01—04</div>
        <div className="process-track-v3"><div className="process-fill"/></div>
        <div className="process-grid-v3">
          {[
            ['01','Discover','Understand your goals and space.'],['02','Define','Design and plan with clarity.'],['03','Build','Expert construction and communication.'],['04','Finish','A space you’ll love for years to come.']
          ].map(([n,t,c])=><article className="process-step-v3" key={n}><span>{n}</span><h3>{t}</h3><p>{c}</p></article>)}
        </div>
      </section>

      <section className="project-proof-v3" id="projects">
        <div className="proof-copy-v3"><p className="section-label">Featured transformation</p><h2>Real spaces.<br/>Visible change.</h2><p>Use the slider to compare the transformation direction. Replace these references with Renofy project photography as your portfolio grows.</p><a href="#contact" className="inline-link magnetic">Start a project <Arrow/></a></div>
        <div className="compare-shell">
          <img className="compare-base" src={IMAGES.living} alt="Finished renovation reference"/>
          <div className="compare-before" style={{width:`${compare}%`}}><img src={IMAGES.basement} alt="Before renovation reference"/></div>
          <div className="compare-line" style={{left:`${compare}%`}}><span>↔</span></div>
          <span className="compare-tag before-tag">Before</span><span className="compare-tag after-tag">After</span>
          <input aria-label="Compare before and after" type="range" min="12" max="88" value={compare} onChange={e=>setCompare(Number(e.target.value))}/>
        </div>
      </section>

      <section className="footer-cta-v3" id="contact">
        <div className="footer-brand-v3">RENOFY<small>Better spaces. Brighter living.</small></div>
        <div className="footer-center-v3"><h2>Your home could be next.</h2><p>Let’s create a space you’ll love to live in.</p><div className="footer-actions"><a className="gold-btn magnetic" href="mailto:hello@renofy.ca">Get a quote <Arrow/></a><a className="ghost-btn magnetic" href="mailto:hello@renofy.ca">Talk to our team</a></div></div>
        <div className="footer-meta-v3"><span>Serving Toronto & GTA</span><span>Kitchens · Bathrooms · Basements · Full homes</span></div>
      </section>
    </main>
  </div>;
}
