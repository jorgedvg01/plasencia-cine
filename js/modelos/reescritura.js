import { loadPlasenciaData } from '../common/data.js';
import { initShell } from '../common/shell.js';
import { escapeHTML } from '../common/markup.js';

const root=document.querySelector('#story-root');
const mobile=matchMedia('(max-width: 900px)');
let shell,motionContext;

const art={
 muralla:{n:'02',tone:'stone',verb:'Piedra, frontera y memoria',layout:'left',asset:'muralla'},
 puerta:{n:'03',tone:'gate',verb:'Un umbral entre mundos',layout:'right',asset:'puerta'},
 plaza:{n:'04',tone:'plaza',verb:'La vida en el centro',layout:'split',asset:'plaza'},
 catedral:{n:'05',tone:'cathedral',verb:'Fe, arte y tiempo',layout:'cathedral',asset:'catedral'},
 ayuntamiento:{n:'06',tone:'civic',verb:'Gobierno, ciudadanía y futuro',layout:'civic',asset:'ayuntamiento'},
 acueducto:{n:'07',tone:'water',verb:'Ingenio que perdura',layout:'wide',asset:'acueducto'},
 parque:{n:'08',tone:'green',verb:'Naturaleza y ciudad',layout:'quiet',asset:'parque'},
 monumento:{n:'09',tone:'bronze',verb:'Memoria en la ciudad',layout:'center',asset:'monumento'}
};

try{
 const data=await loadPlasenciaData();
 root.innerHTML=`<div class="living-mural">${data.chapters.map((c,i)=>renderChapter(data,c,i)).join('')}</div>${footerMarkup()}`;
 shell=initShell({data,model:'reescritura',goTo,onMotionChange:rebuildMotion});
 bindMap();bindFallbacks();rebuildMotion(shell.reduced());mobile.addEventListener('change',()=>rebuildMotion(shell.reduced()));
 Promise.all([document.fonts.ready,...[...document.images].map(i=>i.decode?.().catch(()=>undefined))]).then(()=>window.ScrollTrigger?.refresh());
}catch(error){root.innerHTML=`<section class="error-panel"><div><h2>No se pudo abrir el recorrido.</h2><p>${escapeHTML(error.message)}</p></div></section>`;console.error(error)}

function renderChapter(data,c,index){
 const a=art[c.id],next=data.chapters[index+1],na=next?art[next.id]:null,fallback=data.media[a.asset]||data.media[c.id];
 const m1=c.milestones?.[0]?.[0]||c.shortEra||'',m2=c.milestones?.[1]?.[0]||c.date||'';
 return `<section class="mural-chapter tone-${a.tone} layout-${a.layout}" id="${escapeHTML(c.id)}" data-chapter="${escapeHTML(c.id)}">
  <div class="mural-shot">
   <div class="mural-bg"><img src="assets/cinematic-novel/bg_${a.asset}.webp" data-fallback="${escapeHTML(fallback.src)}" alt=""></div>
   <div class="mural-vignette"></div><div class="mural-grain"></div>
   <div class="mural-number"><strong>${a.n}</strong><span>CAPÍTULO ${a.n}</span></div>
   <div class="mural-heading"><p>${escapeHTML(a.verb)}</p><h2>${escapeHTML(c.name)}</h2></div>
   <div class="mural-copy"><p class="mural-question">${escapeHTML(c.question)}</p><p>${escapeHTML(c.intro)}</p><button class="novel-story" type="button" data-story="${escapeHTML(c.id)}">Leer la historia <span>↗</span></button></div>
   <div class="mural-meta"><span>${escapeHTML(m1)}</span><i></i><span>${escapeHTML(m2)}</span></div>
   <a class="mural-home" href="#inicio">PLASENCIA ↑</a>
   ${next?`<div class="mural-next"><span>${na.n}</span><em>${escapeHTML(next.name)}</em></div>`:''}
   ${next?seamMarkup(c.id,next.id):''}
  </div>
 </section>`;
}

function seamMarkup(from,to){
 const key=`${from}-${to}`;
 return `<div class="mural-seam" data-seam="${key}" aria-hidden="true">
  <div class="seam-layer seam-back"><img src="assets/cinematic-novel/seam_${key}.webp" alt=""></div>
  <div class="seam-layer seam-main"><img src="assets/cinematic-novel/foliage_${key}.webp" alt=""></div>
  <div class="seam-layer seam-near"><img src="assets/cinematic-novel/foliage_${key}_front.webp" alt=""></div>
 </div>`;
}

function bindMap(){document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>goTo(b.dataset.go)))}
function bindFallbacks(){document.querySelectorAll('img[data-fallback]').forEach(img=>img.addEventListener('error',()=>{if(img.dataset.fallback&&!img.dataset.usedFallback){img.dataset.usedFallback='1';img.src=img.dataset.fallback}},{once:true}));document.querySelectorAll('.mural-seam img').forEach(img=>img.addEventListener('error',()=>img.closest('.seam-layer')?.remove(),{once:true}))}

function rebuildMotion(reduced=shell?.reduced()??false){
 motionContext?.revert();motionContext=null;
 const animate=!reduced&&!mobile.matches&&window.gsap&&window.ScrollTrigger;
 document.body.classList.toggle('is-static',!animate);document.body.classList.toggle('is-animated',animate);if(!animate)return;
 const gsap=window.gsap;gsap.registerPlugin(window.ScrollTrigger);
 motionContext=gsap.context(()=>{
  const map=document.querySelector('.novel-map');
  gsap.timeline({scrollTrigger:{trigger:map,start:'top top',end:'bottom top',scrub:1.15}}).to('.novel-map__picture img',{scale:1.045,yPercent:1.8,ease:'none'},0).to('.novel-map__intro',{yPercent:-12,ease:'none'},0).to('.map-hotspot',{yPercent:-5,ease:'none',stagger:.012},0);
  const scenes=[...document.querySelectorAll('.mural-chapter')];
  scenes.forEach((scene,index)=>{
   const shot=scene.querySelector('.mural-shot'),bg=scene.querySelector('.mural-bg img'),heading=scene.querySelector('.mural-heading'),copy=scene.querySelector('.mural-copy'),number=scene.querySelector('.mural-number'),meta=scene.querySelector('.mural-meta'),next=scene.querySelector('.mural-next');
   const back=scene.querySelector('.seam-back'),main=scene.querySelector('.seam-main'),near=scene.querySelector('.seam-near');
   const tl=gsap.timeline({scrollTrigger:{trigger:scene,start:'top bottom',end:'bottom top',scrub:index===3?1.3:1.08,onEnter:()=>shell.update(scene.id),onEnterBack:()=>shell.update(scene.id)}});
   tl.fromTo(bg,{scale:1.105,yPercent:-3},{scale:1.025,yPercent:3,duration:.68,ease:'none'},0)
    .fromTo(number,{yPercent:20},{yPercent:0,duration:.18,ease:'none'},.05)
    .fromTo(heading,{yPercent:22},{yPercent:0,duration:.3,ease:'none'},.08)
    .fromTo(copy,{yPercent:16},{yPercent:0,duration:.28,ease:'none'},.14)
    .to(heading,{yPercent:-13,duration:.3,ease:'none'},.63).to(copy,{yPercent:-9,duration:.3,ease:'none'},.65).to(number,{yPercent:-16,duration:.26,ease:'none'},.67).to(bg,{scale:1.065,yPercent:5,duration:.34,ease:'none'},.62);
   if(back)tl.fromTo(back,{yPercent:48,scale:.96},{yPercent:-18,scale:1.03,duration:.44,ease:'none'},.5);
   if(main)tl.fromTo(main,{yPercent:72,xPercent:2,scale:1.01},{yPercent:-31,xPercent:-2,scale:1.1,duration:.4,ease:'none'},.57);
   if(near)tl.fromTo(near,{yPercent:92,xPercent:-2,scale:1.08},{yPercent:-48,xPercent:3,scale:1.2,duration:.34,ease:'none'},.62);
   if(next)tl.fromTo(next,{yPercent:35,opacity:.12},{yPercent:0,opacity:1,duration:.22,ease:'none'},.7);
   if(index===3){tl.to(heading,{xPercent:-5,duration:.22,ease:'none'},.48).to(main,{xPercent:-6,rotation:.15,duration:.35,ease:'none'},.56).to(near,{xPercent:7,duration:.3,ease:'none'},.63)}
  });
 },document.body);window.ScrollTrigger.refresh();
}

function goTo(id){const target=id==='inicio'?document.querySelector('#inicio'):document.getElementById(id);target?.scrollIntoView({behavior:shell?.reduced()?'auto':'smooth',block:'start'})}
function footerMarkup(){return `<footer class="novel-finale"><div><p>PLASENCIA · EXTREMADURA</p><h2>El pasado para entender<br><em>el presente.</em></h2><a href="#inicio">Volver al plano general ↑</a></div><a class="novel-credits" href="creditos.html">Fuentes y fotografías ↗</a></footer>`}
