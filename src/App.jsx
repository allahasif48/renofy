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

const services = [
  { id:'kitchen', no:'01', eyebrow:'Kitchen renovations', title:['THE HEART','OF A BETTER','HOME'], body:'Beautiful. Functional. Built for real life. From cabinetry to premium stone, we create kitchens that bring people together.', image:IMAGES.kitchen, note:'From materials to memories' },
  { id:'bathroom', no:'02', eyebrow:'Bathroom renovations', title:['YOUR','EVERYDAY','ESCAPE'], body:'Modern design. Lasting quality. Transform your bathroom into a calm, considered space that feels like a retreat every day.', image:IMAGES.bathroom, note:'Small details. A bigger you.' },
  { id:'living', no:'03', eyebrow:'Living spaces', title:['SPACES','THAT BRING','PEOPLE CLOSER'], body:'Open, inviting and built around your life. From flooring to feature walls, we create living spaces that feel like home.', image:IMAGES.living, note:'Designed for real life.' },
  { id:'basement', no:'04', eyebrow:'Basement renovations', title:['MORE SPACE.','MORE','POSSIBILITIES.'], body:'Turn unused square footage into something extraordinary: family rooms, offices, media spaces and flexible living.', image:IMAGES.basement, note:'Finished spaces. Brighter futures.' }
];

function Arrow(){ return <span aria-hidden="true">→</span>; }

function SplitTitle({ lines }){
  return <h2>{lines.map((line,i)=><span className="line-mask" key={i}><span className="line-inner">{line}</span></span>)}</h2>;
}

function ServiceScene({service,index}){
  return <section className={`service-band service-${index}`} id={service.id}>
    <div className="service-copy-block">
      <div className="eyebrow-row"><span>{service.no}</span><p>{service.eyebrow}</p></div>
      <SplitTitle lines={service.title}/>
      <p className="service-body">{service.body}</p>
      <a className="inline-link magnetic" href="#contact">Explore {service.eyebrow.split(' ')[0]} <Arrow/></a>
    </div>

    <div className="assembly" aria-hidden="true">
      <div className="assembly-photo"><img src={service.image} alt=""/></div>
      <div className="piece piece-a"><img src={service.image} alt=""/></div>
      <div className="piece piece-b"><img src={service.image} alt=""/></div>
      <div className="piece piece-c"><img src={service.image} alt=""/></div>
      <div className="piece piece-d"><img src={service.image} alt=""/></div>
      <div className="assembly-rule one"/><div className="assembly-rule two"/>
      <div className="material-dot dot-a"/><div className="material-dot dot-b"/>
    </div>

    <p className="side-note">{service.note}</p>
  </section>;
}

export default function App(){
  const root=useRef(null);

  useLayoutEffect(()=>{
    if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx=gsap.context(()=>{
      gsap.timeline({scrollTrigger:{trigger:'.hero-v2',start:'top top',end:'+=180%',pin:true,scrub:1.05}})
        .fromTo('.hero-house',{scale:.82,yPercent:8},{scale:1,yPercent:0,duration:1},0)
        .fromTo('.hero-layer.layer-a',{xPercent:-90,yPercent:-20,rotate:-8,opacity:.2},{xPercent:-13,yPercent:-7,rotate:-1,opacity:1,duration:1},0)
        .fromTo('.hero-layer.layer-b',{xPercent:90,yPercent:-24,rotate:9,opacity:.2},{xPercent:15,yPercent:-4,rotate:1,opacity:1,duration:1},0)
        .fromTo('.hero-layer.layer-c',{xPercent:-80,yPercent:72,rotate:-12,opacity:.1},{xPercent:-9,yPercent:18,rotate:-2,opacity:1,duration:1},.08)
        .fromTo('.hero-layer.layer-d',{xPercent:78,yPercent:64,rotate:10,opacity:.1},{xPercent:11,yPercent:15,rotate:2,opacity:1,duration:1},.08)
        .fromTo('.hero-specs li',{x:40,opacity:0},{x:0,opacity:1,stagger:.08,duration:.5},.28)
        .to('.hero-title-v2 .gold',{xPercent:8,duration:.7},.45)
        .to('.hero-copy-v2',{y:-30,opacity:.35,duration:.45},1.05);

      gsap.utils.toArray('.service-band').forEach((section,index)=>{
        const q=gsap.utils.selector(section);
        const isLight=index===1 || index===3;
        const tl=gsap.timeline({scrollTrigger:{trigger:section,start:'top top',end:'+=170%',pin:true,scrub:1,anticipatePin:1}});
        tl.from(q('.line-inner'),{yPercent:110,stagger:.08,duration:.6,ease:'power3.out'},0)
          .fromTo(q('.assembly-photo'),{scale:.9,clipPath:'inset(10% 14% 12% 14% round 16px)'},{scale:1,clipPath:'inset(0% 0% 0% 0% round 0px)',duration:.9},0)
          .fromTo(q('.piece-a'),{xPercent:-180,yPercent:-30,rotate:-16,opacity:0},{xPercent:-48,yPercent:-8,rotate:-4,opacity:1,duration:.85},.05)
          .fromTo(q('.piece-b'),{xPercent:170,yPercent:-22,rotate:14,opacity:0},{xPercent:50,yPercent:-5,rotate:3,opacity:1,duration:.85},.08)
          .fromTo(q('.piece-c'),{xPercent:-150,yPercent:120,rotate:-10,opacity:0},{xPercent:-35,yPercent:48,rotate:-2,opacity:1,duration:.85},.12)
          .fromTo(q('.piece-d'),{xPercent:150,yPercent:110,rotate:12,opacity:0},{xPercent:36,yPercent:43,rotate:2,opacity:1,duration:.85},.15)
          .fromTo(q('.assembly-rule'),{scaleX:0},{scaleX:1,stagger:.1,duration:.45},.28)
          .fromTo(q('.material-dot'),{scale:0,opacity:0},{scale:1,opacity:1,stagger:.1,duration:.4},.35)
          .fromTo(q('.side-note'),{y:50,opacity:0},{y:0,opacity:1,duration:.45},.5)
          .to(q('.assembly'),{xPercent:index%2?-3:3,yPercent:index%2?2:-2,duration:.6},.85)
          .to(q('.piece-a'),{xPercent:-62,yPercent:-18,rotate:-8,duration:.45},.92)
          .to(q('.piece-b'),{xPercent:64,yPercent:-13,rotate:7,duration:.45},.92)
          .to(q('.piece-c'),{xPercent:-47,yPercent:59,rotate:-5,duration:.45},.92)
          .to(q('.piece-d'),{xPercent:50,yPercent:54,rotate:5,duration:.45},.92)
          .to(section,{backgroundColor:isLight?'#eee9e1':'#0b0b0b',duration:.01},0);
      });

      gsap.timeline({scrollTrigger:{trigger:'.process-v2',start:'top top',end:'+=120%',pin:true,scrub:1}})
        .fromTo('.process-fill',{scaleX:0},{scaleX:1,duration:1,ease:'none'})
        .fromTo('.process-item',{y:45,opacity:.15},{y:0,opacity:1,stagger:.18,duration:.45},0)
        .to('.process-counter',{rotate:360,duration:1,ease:'none'},0);

      gsap.timeline({scrollTrigger:{trigger:'.project-proof',start:'top 75%',end:'bottom 20%',scrub:1}})
        .fromTo('.before-panel',{xPercent:-12},{xPercent:0,duration:1},0)
        .fromTo('.after-panel',{xPercent:12},{xPercent:0,duration:1},0)
        .fromTo('.proof-divider',{scaleY:0},{scaleY:1,duration:.8},.1);

      gsap.fromTo('.footer-cta-v2 h2',{y:100,opacity:0},{y:0,opacity:1,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.footer-cta-v2',start:'top 72%'}});

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
      <section className="hero-v2" id="top">
        <div className="hero-copy-v2">
          <p className="hero-kicker-v2">Toronto & GTA renovations</p>
          <h1 className="hero-title-v2"><span>RENOVATE</span><span>BETTER.</span><span className="gold">LIVE BRIGHTER.</span></h1>
          <p className="hero-sub">Thoughtful renovations. Lasting value. From kitchens to full-home transformations, Renofy creates spaces you’ll love to live in.</p>
          <a className="scroll-link magnetic" href="#services"><span>↓</span> Scroll to explore</a>
        </div>

        <div className="hero-assembly" aria-hidden="true">
          <div className="hero-house"><img src={IMAGES.exterior} alt=""/></div>
          <div className="hero-layer layer-a"><img src={IMAGES.exterior} alt=""/></div>
          <div className="hero-layer layer-b"><img src={IMAGES.exterior} alt=""/></div>
          <div className="hero-layer layer-c"><img src={IMAGES.exterior} alt=""/></div>
          <div className="hero-layer layer-d"><img src={IMAGES.exterior} alt=""/></div>
        </div>

        <ul className="hero-specs"><li>Roofing</li><li>Millwork</li><li>Glass</li><li>Concrete</li><li>Spaces</li><li>A brighter you</li></ul>
        <div className="hero-index"><b>01</b><span>02</span><span>03</span><span>04</span><span>05</span></div>
      </section>

      <section id="services" className="services-v2">
        {services.map((service,index)=><ServiceScene key={service.id} service={service} index={index}/>) }
      </section>

      <section className="process-v2" id="process">
        <div className="process-title-block"><p className="section-label">Our process</p><h2>A clearer path<br/>to a better home.</h2><p>A simple, transparent process from start to finish. Less stress. Better decisions.</p></div>
        <div className="process-counter">01—04</div>
        <div className="process-line"><div className="process-fill"/></div>
        <div className="process-grid">
          {[
            ['01','Discover','Understand your goals and space.'],['02','Define','Design and plan with clarity.'],['03','Build','Expert construction and communication.'],['04','Finish','A space you’ll love for years to come.']
          ].map(([n,t,c])=><article className="process-item" key={n}><span>{n}</span><h3>{t}</h3><p>{c}</p></article>)}
        </div>
      </section>

      <section className="project-proof" id="projects">
        <div className="proof-copy"><p className="section-label">Featured project</p><h2>Real homes.<br/>Real transformations.</h2><p>See how we turn ideas into beautiful, functional spaces across Toronto and the GTA.</p><a href="#contact" className="inline-link magnetic">View all projects <Arrow/></a></div>
        <div className="proof-media">
          <div className="proof-panel before-panel"><img src={IMAGES.basement} alt="Before renovation reference"/><span>Before</span></div>
          <div className="proof-panel after-panel"><img src={IMAGES.living} alt="Finished renovation reference"/><span>After</span></div>
          <div className="proof-divider"><b>↔</b></div>
        </div>
      </section>

      <section className="footer-cta-v2" id="contact">
        <div className="footer-brand">RENOFY<small>Better spaces. Brighter living.</small></div>
        <div><h2>Your home could be next.</h2><p>Let’s create a space you’ll love to live in.</p><div className="footer-actions"><a className="gold-btn magnetic" href="mailto:hello@renofy.ca">Get a quote <Arrow/></a><a className="ghost-btn magnetic" href="mailto:hello@renofy.ca">Talk to our team</a></div></div>
        <div className="footer-meta"><span>Serving Toronto & GTA</span><span>Kitchens · Bathrooms · Basements · Full homes</span></div>
      </section>
    </main>
  </div>;
}
