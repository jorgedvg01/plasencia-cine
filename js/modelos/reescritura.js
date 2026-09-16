import { loadPlasenciaData } from '../common/data.js';
import { initShell } from '../common/shell.js';
import { escapeHTML } from '../common/markup.js';

const root = document.querySelector('#story-root');
const mobile = matchMedia('(max-width: 900px)');
let shell, motionContext, observer;

const art = {
  muralla:{n:'02',tone:'stone',verb:'Piedra, frontera y memoria',layout:'left',asset:'muralla'},
  puerta:{n:'03',tone:'gate',verb:'Un umbral entre mundos',layout:'right',asset:'puerta'},
  plaza:{n:'04',tone:'plaza',verb:'La vida en el centro',layout:'split',asset:'plaza'},
  catedral:{n:'05',tone:'cathedral',verb:'Fe, arte y tiempo',layout:'left-low',asset:'catedral'},
  ayuntamiento:{n:'06',tone:'civic',verb:'Gobierno, ciudadanía y futuro',layout:'right-high',asset:'ayuntamiento'},
  acueducto:{n:'07',tone:'water',verb:'Ingenio que perdura',layout:'wide',asset:'acueducto'},
  parque:{n:'08',tone:'green',verb:'Naturaleza y ciudad',layout:'quiet',asset:'parque'},
  monumento:{n:'09',tone:'bronze',verb:'Memoria en la ciudad',layout:'center',asset:'monumento'}
};

try {
  const data=await loadPlasenciaData();
  root.innerHTML=`<div class="novel-journey">${data.chapters.map((c,i)=>renderChapter(data,c,i)).join('')}</div>${footerMarkup()}`;
  shell=initShell({data,model:'reescritura',goTo,onMotionChange:rebuildMotion});
  bindMap(); bindFallbacks(); observeChapters(data.chapters); rebuildMotion(shell.reduced());
  mobile.addEventListener('change',()=>rebuildMotion(shell.reduced()));
  Promise.all([document.fonts.ready,...[...document.images].map(i=>i.decode?.().catch(()=>undefined))]).then(()=>window.ScrollTrigger?.refresh());
}catch(error){root.innerHTML=`<section class="error-panel"><div><h2>No se pudo abrir el recorrido.</h2><p>${escapeHTML(error.message)}</p></div></section>`;console.error(error)}

function renderChapter(data,c,index){
  const a=art[c.id], next=data.chapters[index+1], nextArt=next?art[next.id]:null;
  const fallback=data.media[a.asset]||data.media[c.id];
  const seam=next?`${c.id}-${next.id}`:null;
  const m1=c.milestones?.[0]?.[0]||c.shortEra||'',m2=c.milestones?.[1]?.[0]||c.date||'';
  return `<section class="novel-chapter tone-${a.tone} layout-${a.layout}" id="${escapeHTML(c.id)}" data-chapter="${escapeHTML(c.id)}">
    <div class="novel-stage">
      <div class="novel-bg" aria-hidden="true"><img src="assets/cinematic-novel/bg_${a.asset}.webp" data-fallback="${escapeHTML(fallback.src)}" alt=""></div>
      <div class="novel-grade" aria-hidden="true"></div><div class="novel-grain" aria-hidden="true"></div>
      <div class="novel-index" aria-hidden="true"><strong>${a.n}</strong><span>CAPÍTULO ${a.n}</span></div>
      <div class="novel-title"><p>${escapeHTML(a.verb)}</p><h2>${escapeHTML(c.name)}</h2></div>
      <div class="novel-copy"><p class="novel-question">${escapeHTML(c.question)}</p><p>${escapeHTML(c.intro)}</p><button class="novel-story" type="button" data-story="${escapeHTML(c.id)}">Leer la historia <span>↗</span></button></div>
      <div class="novel-meta" aria-hidden="true"><span>${escapeHTML(m1)}</span><i></i><span>${escapeHTML(m2)}</span></div>
      <a class="novel-home" href="#inicio">PLASENCIA ↑</a>
      ${next?`<div class="novel-next" aria-hidden="true"><span>${nextArt.n}</span><em>${escapeHTML(next.name)}</em></div>`:''}
      ${seam?`<div class="novel-seam seam-mid" aria-hidden="true"><img src="assets/cinematic-novel/seam_${seam}.webp" alt=""></div><div class="novel-seam seam-front" aria-hidden="true"><img src="assets/cinematic-novel/foliage_${seam}.webp" alt=""></div>`:''}
      ${c.id==='catedral'?`<div class="novel-seam seam-lens" aria-hidden="true"><img src="assets/cinematic-novel/foliage_05_06_front.webp" alt=""></div>`:''}
    </div>
  </section>`;
}

function bindMap(){document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>goTo(b.dataset.go)))}
function bindFallbacks(){document.querySelectorAll('img[data-fallback]').forEach(img=>img.addEventListener('error',()=>{if(img.dataset.fallback&&img.src!==img.dataset.fallback)img.src=img.dataset.fallback},{once:true}))}

function rebuildMotion(reduced=shell?.reduced()??false){
  motionContext?.revert(); motionContext=null;
  const animate=!reduced&&!mobile.matches&&window.gsap&&window.ScrollTrigger;
  document.body.classList.toggle('is-static',!animate);document.body.classList.toggle('is-animated',animate);if(!animate)return;
  const gsap=window.gsap;gsap.registerPlugin(window.ScrollTrigger);
  motionContext=gsap.context(()=>{
    const map=document.querySelector('.novel-map');
    gsap.timeline({scrollTrigger:{trigger:map,start:'top top',end:'bottom top',scrub:1.1}})
      .to('.novel-map__picture img',{scale:1.055,yPercent:2,ease:'none'},0)
      .to('.novel-map__intro',{yPercent:-14,ease:'none'},0)
      .to('.map-hotspot',{yPercent:-7,ease:'none',stagger:.015},0);

    [...document.querySelectorAll('.novel-chapter')].forEach((scene,index)=>{
      const stage=scene.querySelector('.novel-stage'),bg=scene.querySelector('.novel-bg img'),title=scene.querySelector('.novel-title'),copy=scene.querySelector('.novel-copy'),meta=scene.querySelector('.novel-meta'),mid=scene.querySelector('.seam-mid'),front=scene.querySelector('.seam-front'),lens=scene.querySelector('.seam-lens'),next=scene.querySelector('.novel-next');
      gsap.set(bg,{scale:1.075});
      const tl=gsap.timeline({scrollTrigger:{trigger:scene,start:'top bottom',end:'bottom top',scrub:index===3?1.25:1.05,onEnter:()=>shell.update(scene.id),onEnterBack:()=>shell.update(scene.id)}});
      tl.fromTo(stage,{clipPath:'inset(5% 0 7% 0)'},{clipPath:'inset(0% 0 0% 0)',duration:.18,ease:'none'},0)
        .fromTo(bg,{scale:1.12,yPercent:-3},{scale:1.035,yPercent:3,duration:.72,ease:'none'},0)
        .fromTo(title,{yPercent:28},{yPercent:0,duration:.3,ease:'none'},.05)
        .fromTo(copy,{yPercent:18},{yPercent:0,duration:.34,ease:'none'},.1)
        .fromTo(meta,{xPercent:-10},{xPercent:0,duration:.3,ease:'none'},.12)
        .to(title,{yPercent:-11,duration:.28,ease:'none'},.64).to(copy,{yPercent:-8,duration:.28,ease:'none'},.66).to(bg,{scale:1.07,yPercent:5,duration:.3,ease:'none'},.65);
      if(mid)tl.fromTo(mid,{yPercent:60,scale:.96},{yPercent:-18,scale:1.03,duration:.42,ease:'none'},.56);
      if(front)tl.fromTo(front,{yPercent:82,xPercent:3,scale:1.04},{yPercent:-32,xPercent:-2,scale:1.12,duration:.38,ease:'none'},.62);
      if(lens)tl.fromTo(lens,{yPercent:90,scale:1.1},{yPercent:-44,scale:1.2,duration:.34,ease:'none'},.64);
      if(next)tl.fromTo(next,{yPercent:40,opacity:.15},{yPercent:0,opacity:1,duration:.25,ease:'none'},.67);
    });
  },document.body);window.ScrollTrigger.refresh();
}

function observeChapters(chapters){observer?.disconnect();observer=new IntersectionObserver(entries=>{const v=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(v)shell?.update(v.target.id)},{rootMargin:'-38% 0px -38% 0px',threshold:[0,.08,.25]});chapters.forEach(c=>{const el=document.getElementById(c.id);if(el)observer.observe(el)})}
function goTo(id){const target=id==='inicio'?document.querySelector('#inicio'):document.getElementById(id);target?.scrollIntoView({behavior:shell?.reduced()?'auto':'smooth',block:'start'})}
function footerMarkup(){return `<footer class="novel-finale"><div><p>PLASENCIA · EXTREMADURA</p><h2>El pasado para entender<br><em>el presente.</em></h2><a href="#inicio">Volver al plano general ↑</a></div><a class="novel-credits" href="creditos.html">Fuentes y fotografías ↗</a></footer>`}