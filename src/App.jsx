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
  { id:'kitchen', no:'01', title:'Kitchens', line:'Built around the way you live.', detail:'Cabinetry · stone · islands · lighting', image:IMAGES.kitchen, accent:'STONE / CABINETRY / LIGHT' },
  { id:'bathroom', no:'02', title:'Bathrooms', line:'Quiet materials. Precise execution.', detail:'Showers · tile · vanities · fixtures', image:IMAGES.bathroom, accent:'TILE / GLASS / WATER' },
  { id:'living', no:'03', title:'Living', line:'Make the whole floor feel connected.', detail:'Layouts · flooring · millwork · feature walls', image:IMAGES.living, accent:'OAK / LIGHT / FLOW' },
  { id:'basement', no:'04', title:'Basements', line:'Make every square foot belong.', detail:'Family rooms · offices · media · storage', image:IMAGES.basement, accent:'WARMTH / FUNCTION / SPACE' }
];

function Arrow(){ return <span aria-hidden="true">↗</span>; }

export default function App(){
  const root = useRef(null);

  useLayoutEffect(()=>{
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduce) return;

    const ctx = gsap.context(()=>{
      gsap.timeline({scrollTrigger:{trigger:'.hero',start:'top top',end:'+=185%',scrub:1,pin:true}})
        .fromTo('.hero-visual',{clipPath:'inset(15% 22% 18% 22% round 18px)',scale:.88},{clipPath:'inset(0% 0% 0% 0% round 0px)',scale:1,duration:1.15,ease:'none'},0)
        .to('.hero-title .line-one',{xPercent:-18,duration:1},0)
        .to('.hero-title .line-two',{xPercent:16,duration:1},0)
        .to('.hero-visual img',{scale:1.14,yPercent:5,duration:1.6},0)
        .fromTo('.material-chip.a',{x:'-32vw',rotate:-18},{x:'22vw',rotate:8,duration:1.4},0)
        .fromTo('.material-chip.b',{x:'35vw',rotate:16},{x:'-20vw',rotate:-5,duration:1.4},0)
        .to('.hero-intro',{y:-60,opacity:.25,duration:.55},.78)
        .to('.hero-transition',{scaleY:1,duration:.28,ease:'power2.inOut'},1.22);

      gsap.from('.manifesto-word',{yPercent:110,stagger:.08,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.manifesto',start:'top 72%'}});
      gsap.to('.manifesto-media.left',{yPercent:-24,rotate:-5,scrollTrigger:{trigger:'.manifesto',start:'top bottom',end:'bottom top',scrub:1}});
      gsap.to('.manifesto-media.right',{yPercent:18,rotate:5,scrollTrigger:{trigger:'.manifesto',start:'top bottom',end:'bottom top',scrub:1}});

      gsap.utils.toArray('.motion-scene').forEach((scene,index)=>{
        const q=gsap.utils.selector(scene);
        const tl=gsap.timeline({scrollTrigger:{trigger:scene,start:'top top',end:'+=200%',pin:true,scrub:1,anticipatePin:1}});

        const imageFrom = index===0
          ? {clipPath:'inset(12% 34% 14% 8% round 18px)',scale:.86,xPercent:-4}
          : index===1
            ? {clipPath:'inset(6% 20% 30% 20% round 26px)',scale:.9,yPercent:8}
            : index===2
              ? {clipPath:'inset(18% 8% 18% 28% round 18px)',scale:.84,xPercent:5}
              : {clipPath:'inset(32% 16% 8% 16% round 20px)',scale:.9,yPercent:-6};

        tl.fromTo(q('.scene-image'),imageFrom,{clipPath:'inset(0% 0% 0% 0% round 0px)',scale:1,xPercent:0,yPercent:0,duration:1,ease:'none'},0)
          .fromTo(q('.scene-image img'),{scale:index===3?1.18:1.28,filter:index===3?'brightness(.48) saturate(.55)':'brightness(.82) saturate(.72)'},{scale:1.03,filter:'brightness(1) saturate(.82)',duration:1.45},0)
          .fromTo(q('.scene-title'),{xPercent:index%2?-35:35,opacity:.08,rotate:index===2?-2:0},{xPercent:0,opacity:1,rotate:0,duration:.72},.08)
          .fromTo(q('.scene-number'),{y:90,opacity:0},{y:0,opacity:1,duration:.45},.18)
          .fromTo(q('.scene-copy'),{y:75,opacity:0},{y:0,opacity:1,duration:.55},.34)
          .fromTo(q('.scene-accent'),{scaleX:0},{scaleX:1,duration:.65},.22)
          .fromTo(q('.scene-accent-label'),{opacity:0,y:24},{opacity:1,y:0,duration:.42},.42)
          .fromTo(q('.scene-strip.one'),{xPercent:index%2?-125:125,rotate:index%2?-8:8},{xPercent:index%2?18:-18,rotate:index%2?4:-4,duration:1.25},.05)
          .fromTo(q('.scene-strip.two'),{xPercent:index%2?125:-125,rotate:index%2?7:-7},{xPercent:index%2?-18:18,rotate:index%2?-3:3,duration:1.25},.05)
          .to(q('.scene-title'),{scale:1.08,yPercent:-10,duration:.5},.93)
          .to(q('.scene-copy'),{y:-28,opacity:.18,duration:.38},1.02)
          .to(q('.scene-exit'),{scaleY:1,duration:.24,ease:'power2.inOut'},1.14);
      });

      const steps=gsap.utils.toArray('.process-step');
      gsap.timeline({scrollTrigger:{trigger:'.process',start:'top top',end:'+=155%',pin:true,scrub:1}})
        .to('.process-progress',{scaleX:1,duration:1,ease:'none'})
        .fromTo(steps,{opacity:.16,y:55},{opacity:1,y:0,stagger:.18,duration:.45},0)
        .fromTo('.process-orbit',{rotate:-80,scale:.7,opacity:0},{rotate:0,scale:1,opacity:1,duration:.8},.08);

      gsap.timeline({scrollTrigger:{trigger:'.final-project',start:'top top',end:'+=150%',pin:true,scrub:1}})
        .fromTo('.final-frame',{clipPath:'inset(0% 0% 0% 0% round 0px)',scale:1},{clipPath:'inset(10% 10% 12% 10% round 22px)',scale:.92,duration:.72})
        .fromTo('.final-project img',{scale:1.2},{scale:1.02,duration:1},0)
        .fromTo('.final-project-copy',{y:120,opacity:0},{y:0,opacity:1,duration:.55},.18)
        .to('.cta-preview',{scaleY:1,duration:.35,ease:'power2.inOut'},.68);

      gsap.utils.toArray('.magnetic').forEach((el)=>{
        const move=(e)=>{
          const r=el.getBoundingClientRect();
          gsap.to(el,{x:(e.clientX-r.left-r.width/2)*.14,y:(e.clientY-r.top-r.height/2)*.14,duration:.25,ease:'power2.out'});
        };
        const reset=()=>gsap.to(el,{x:0,y:0,duration:.35,ease:'power3.out'});
        el.addEventListener('mousemove',move); el.addEventListener('mouseleave',reset);
      });
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
        <div className="hero-intro"><p>Thoughtful renovations. One coordinated build. Details that feel intentional.</p><a className="magnetic" href="#services">Explore <Arrow/></a></div>
        <div className="material-chip a">STONE / 01</div><div className="material-chip b">CRAFT / 02</div>
        <div className="scroll-cue">SCROLL TO TRANSFORM <i/></div>
        <div className="hero-transition"/>
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
          <div className="scene-accent"/><div className="scene-accent-label">{s.accent}</div>
          <div className="scene-strip one">RENOVATE BETTER · RENOVATE BETTER · RENOVATE BETTER</div>
          <div className="scene-strip two">DESIGN · BUILD · FINISH · TORONTO · GTA</div>
          <div className="scene-exit"/>
        </article>)}
      </section>

      <section className="process" id="process">
        <div className="process-head"><p className="section-label">How Renofy works</p><h2>From idea<br/>to handover.</h2></div>
        <div className="process-orbit">01—04</div>
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
        <div className="final-frame"><img src={IMAGES.living} alt="Finished Renofy living space"/></div>
        <div className="final-project-copy"><p className="section-label">The outcome</p><h2>A home that feels finished — not simply renovated.</h2></div>
        <div className="cta-preview"/>
      </section>

      <section className="cta" id="contact">
        <p className="section-label">Renofy / Toronto</p><h2>YOUR HOME<br/>COULD BE NEXT.</h2>
        <a className="cta-primary magnetic" href="mailto:hello@renofy.ca">Start your renovation <Arrow/></a>
        <footer><span>© {new Date().getFullYear()} Renofy</span><span>Toronto & Greater Toronto Area</span><span>Photography references via Unsplash</span></footer>
      </section>
    </main>
  </div>;
}
