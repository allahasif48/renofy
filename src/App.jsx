import { useLayoutEffect, useRef } from 'react';
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

const scenes = [
  { id:'kitchen', no:'01', title:'Kitchens', line:'Built around the way you live.', detail:'Cabinetry · stone · islands · lighting', image:IMAGES.kitchen },
  { id:'bathroom', no:'02', title:'Bathrooms', line:'Quiet materials. Precise execution.', detail:'Showers · tile · vanities · fixtures', image:IMAGES.bathroom },
  { id:'living', no:'03', title:'Living', line:'Make the whole floor feel connected.', detail:'Layouts · flooring · millwork · feature walls', image:IMAGES.living },
  { id:'basement', no:'04', title:'Basements', line:'Make every square foot belong.', detail:'Family rooms · offices · media · storage', image:IMAGES.basement }
];

function Arrow(){ return <span aria-hidden="true">↗</span>; }

export default function App(){
  const root = useRef(null);

  useLayoutEffect(()=>{
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce) return;

    const ctx = gsap.context(()=>{
      gsap.timeline({scrollTrigger:{trigger:'.hero',start:'top top',end:'+=180%',scrub:1,pin:true}})
        .fromTo('.hero-visual',{clipPath:'inset(15% 22% 18% 22% round 18px)',scale:.88},{clipPath:'inset(0% 0% 0% 0% round 0px)',scale:1,duration:1.2,ease:'none'},0)
        .to('.hero-title .line-one',{xPercent:-18,duration:1},0)
        .to('.hero-title .line-two',{xPercent:16,duration:1},0)
        .to('.hero-visual img',{scale:1.14,yPercent:5,duration:1.6},0)
        .fromTo('.material-chip.a',{x:'-32vw',rotate:-18},{x:'22vw',rotate:8,duration:1.4},0)
        .fromTo('.material-chip.b',{x:'35vw',rotate:16},{x:'-20vw',rotate:-5,duration:1.4},0)
        .to('.hero-intro',{y:-60,opacity:.25,duration:.55},.75);

      gsap.from('.manifesto-word',{yPercent:110,stagger:.08,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.manifesto',start:'top 72%'}});
      gsap.to('.manifesto-media.left',{yPercent:-24,rotate:-5,scrollTrigger:{trigger:'.manifesto',start:'top bottom',end:'bottom top',scrub:1}});
      gsap.to('.manifesto-media.right',{yPercent:18,rotate:5,scrollTrigger:{trigger:'.manifesto',start:'top bottom',end:'bottom top',scrub:1}});

      gsap.utils.toArray('.motion-scene').forEach((scene)=>{
        const q=gsap.utils.selector(scene);
        const tl=gsap.timeline({scrollTrigger:{trigger:scene,start:'top top',end:'+=190%',pin:true,scrub:1,anticipatePin:1}});
        tl.fromTo(q('.scene-image'),{clipPath:'inset(16% 30% 18% 30% round 20px)',scale:.78},{clipPath:'inset(0% 0% 0% 0% round 0px)',scale:1,duration:1},0)
          .fromTo(q('.scene-image img'),{scale:1.28},{scale:1.04,duration:1.45},0)
          .fromTo(q('.scene-title'),{xPercent:-38,opacity:.12},{xPercent:0,opacity:1,duration:.75},.08)
          .fromTo(q('.scene-number'),{y:100,opacity:0},{y:0,opacity:1,duration:.5},.18)
          .fromTo(q('.scene-copy'),{y:80,opacity:0},{y:0,opacity:1,duration:.55},.35)
          .fromTo(q('.scene-strip.one'),{xPercent:-125,rotate:-8},{xPercent:18,rotate:4,duration:1.25},.05)
          .fromTo(q('.scene-strip.two'),{xPercent:125,rotate:7},{xPercent:-18,rotate:-3,duration:1.25},.05)
          .to(q('.scene-title'),{scale:1.09,yPercent:-12,duration:.55},.92)
          .to(q('.scene-copy'),{y:-30,opacity:.2,duration:.45},1.02);
      });

      const steps=gsap.utils.toArray('.process-step');
      gsap.timeline({scrollTrigger:{trigger:'.process',start:'top top',end:'+=150%',pin:true,scrub:1}})
        .to('.process-progress',{scaleX:1,duration:1,ease:'none'})
        .fromTo(steps,{opacity:.18,y:55},{opacity:1,y:0,stagger:.18,duration:.45},0);

      gsap.timeline({scrollTrigger:{trigger:'.final-project',start:'top top',end:'+=120%',pin:true,scrub:1}})
        .fromTo('.final-project img',{scale:1.25},{scale:1,duration:1})
        .fromTo('.final-project-copy',{y:120,opacity:0},{y:0,opacity:1,duration:.6},.28);
    },root);
    return ()=>ctx.revert();
  },[]);

  return <div ref={root}>
    <Navbar/>
    <main>
      <section className="hero" id="top">
        <div className="hero-visual"><img src={IMAGES.exterior} alt="Modern renovated Toronto home"/></div>
        <div className="hero-shade"/>
        <p className="hero-kicker">Renofy / Toronto + GTA</p>
        <h1 className="hero-title"><span className="line-one">RENOVATE</span><span className="line-two">BETTER.</span></h1>
        <div className="hero-intro"><p>Thoughtful renovations. One coordinated build. Details that feel intentional.</p><a href="#services">Explore <Arrow/></a></div>
        <div className="material-chip a">STONE / 01</div><div className="material-chip b">CRAFT / 02</div>
        <div className="scroll-cue">SCROLL TO TRANSFORM <i/></div>
      </section>

      <section className="manifesto" id="work">
        <p className="section-label">What we believe</p>
        <h2>{['ONE','HOME.','ONE','VISION.'].map((w,i)=><span className="manifesto-mask" key={i}><span className="manifesto-word">{w}</span></span>)}</h2>
        <p className="manifesto-copy">Renofy brings planning, construction and finishing together so a renovation feels coherent from the first demolition cut to the last piece of trim.</p>
        <img className="manifesto-media left" src={IMAGES.kitchen} alt="Renovated kitchen"/>
        <img className="manifesto-media right" src={IMAGES.bathroom} alt="Renovated bathroom"/>
      </section>

      <section id="services" className="scene-stack">
        {scenes.map((s,i)=><article className={`motion-scene tone-${i}`} id={s.id} key={s.id}>
          <div className="scene-image"><img src={s.image} alt={`${s.title} renovation`}/></div>
          <div className="scene-overlay"/>
          <span className="scene-number">{s.no}</span>
          <h2 className="scene-title">{s.title}</h2>
          <div className="scene-copy"><h3>{s.line}</h3><p>{s.detail}</p></div>
          <div className="scene-strip one">RENOVATE BETTER · RENOVATE BETTER · RENOVATE BETTER</div>
          <div className="scene-strip two">DESIGN · BUILD · FINISH · TORONTO · GTA</div>
        </article>)}
      </section>

      <section className="process" id="process">
        <div className="process-head"><p className="section-label">How Renofy works</p><h2>From idea<br/>to handover.</h2></div>
        <div className="process-rail"><div className="process-progress"/></div>
        <div className="process-steps">
          {[
            ['01','Discover','Understand the space, goals and priorities.'],
            ['02','Define','Align scope, selections and sequencing.'],
            ['03','Build','Coordinate the work under one clear plan.'],
            ['04','Finish','Complete the details and final walkthrough.']
          ].map(x=><article className="process-step" key={x[0]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></article>)}
        </div>
      </section>

      <section className="final-project">
        <img src={IMAGES.living} alt="Finished Renofy living space"/>
        <div className="final-project-copy"><p className="section-label">The outcome</p><h2>A home that feels finished — not simply renovated.</h2></div>
      </section>

      <section className="cta" id="contact">
        <p className="section-label">Renofy / Toronto</p><h2>YOUR HOME<br/>COULD BE NEXT.</h2>
        <a className="cta-primary" href="mailto:hello@renofy.ca">Start your renovation <Arrow/></a>
        <footer><span>© {new Date().getFullYear()} Renofy</span><span>Toronto & Greater Toronto Area</span><span>Photography references via Unsplash</span></footer>
      </section>
    </main>
  </div>;
}
