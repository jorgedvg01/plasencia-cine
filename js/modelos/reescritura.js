import { loadPlasenciaData } from '../common/data.js';
import { initShell } from '../common/shell.js';
import { escapeHTML } from '../common/markup.js';

const root = document.querySelector('#story-root');
const mobile = matchMedia('(max-width: 900px)');
let shell;
let motionContext;
let observer;

const visual = {
  muralla: { label: '01', image: 'muralla', tone: 'stone', bridge: 'El límite' },
  puerta: { label: '02', image: 'puerta', tone: 'night', bridge: 'Atravesar' },
  plaza: { label: '03', image: 'plaza', tone: 'amber', bridge: 'Encontrarse' },
  catedral: { label: '04', image: 'catedral', tone: 'slate', bridge: 'Ascender' },
  ayuntamiento: { label: '05', image: 'ayuntamiento', tone: 'civic', bridge: 'Representarse' },
  acueducto: { label: '06', image: 'acueducto', tone: 'water', bridge: 'Conducir' },
  parque: { label: '07', image: 'parque', tone: 'green', bridge: 'Respirar' },
  monumento: { label: '08', image: 'monumento', tone: 'bronze', bridge: 'Recordar' }
};

try {
  const data = await loadPlasenciaData();
  root.innerHTML = `<div class="cinema-journey">${data.chapters.map((chapter, index) => renderChapter(data, chapter, index)).join('')}</div>${footerMarkup()}`;
  shell = initShell({ data, model: 'reescritura', goTo, onMotionChange: rebuildMotion });
  observeChapters(data.chapters);
  rebuildMotion(shell.reduced());
  mobile.addEventListener('change', () => rebuildMotion(shell.reduced()));
  Promise.all([document.fonts.ready, ...[...document.images].map((image) => image.decode?.().catch(() => undefined))]).then(() => window.ScrollTrigger?.refresh());
} catch (error) {
  root.innerHTML = `<section class="error-panel"><div><h2>No se pudo abrir el recorrido.</h2><p>${escapeHTML(error.message)}</p></div></section>`;
  console.error(error);
}

function renderChapter(data, chapter, index) {
  const art = visual[chapter.id];
  const media = data.media[art.image] || data.media[chapter.id];
  const next = data.chapters[index + 1];
  const nextArt = next ? visual[next.id] : null;
  const milestone = chapter.milestones?.[0]?.[0] || chapter.shortEra;
  const secondMilestone = chapter.milestones?.[1]?.[0] || chapter.date;

  return `<section class="cinema-chapter tone-${art.tone}" id="${escapeHTML(chapter.id)}" data-chapter="${escapeHTML(chapter.id)}">
    <div class="cinema-sticky">
      <div class="cinema-backdrop" aria-hidden="true">
        <img src="${escapeHTML(media.src)}" alt="">
      </div>
      <div class="cinema-wash" aria-hidden="true"></div>
      <div class="cinema-grain" aria-hidden="true"></div>

      <p class="cinema-number" aria-hidden="true">${art.label}</p>
      <p class="cinema-era">${escapeHTML(chapter.era)}</p>

      <div class="cinema-title-wrap">
        <p class="cinema-verb">${escapeHTML(art.bridge)}</p>
        <h2 class="cinema-title">${escapeHTML(chapter.name)}</h2>
      </div>

      <div class="cinema-copy">
        <p class="cinema-question">${escapeHTML(chapter.question)}</p>
        <p class="cinema-intro">${escapeHTML(chapter.intro)}</p>
        <button class="cinema-story" type="button" data-story="${escapeHTML(chapter.id)}">Explorar la historia <span aria-hidden="true">↗</span></button>
      </div>

      <div class="cinema-dates" aria-hidden="true">
        <span>${escapeHTML(milestone)}</span><i></i><span>${escapeHTML(secondMilestone)}</span>
      </div>

      <button class="cinema-photo" type="button" data-photo="${escapeHTML(art.image)}" aria-label="Ampliar fotografía de ${escapeHTML(chapter.name)}">
        <span>FOTOGRAFÍA · ${escapeHTML(media.date || '')}</span>
      </button>

      ${next ? `<div class="cinema-next" aria-hidden="true"><span>${String(index + 2).padStart(2, '0')}</span><p>${escapeHTML(nextArt.bridge)}</p><strong>${escapeHTML(next.name)}</strong></div>` : ''}
    </div>
  </section>`;
}

function rebuildMotion(reduced = shell?.reduced() ?? false) {
  motionContext?.revert();
  motionContext = null;
  const animate = !reduced && !mobile.matches && window.gsap && window.ScrollTrigger;
  document.body.classList.toggle('is-static', !animate);
  document.body.classList.toggle('is-animated', animate);
  if (!animate) return;

  const gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);

  motionContext = gsap.context(() => {
    const hero = document.querySelector('.cinema-hero');
    const heroTl = gsap.timeline({
      scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1.15 }
    });
    heroTl
      .to('.cinema-hero-image img', { scale: 1.075, yPercent: 5, ease: 'none' }, 0)
      .to('.cinema-hero-copy', { yPercent: -18, ease: 'none' }, 0)
      .to('.cinema-hero-deck', { y: -20, opacity: .25, ease: 'none' }, .12)
      .to('.cinema-hero-index', { xPercent: 24, ease: 'none' }, 0)
      .to('.cinema-enter', { y: -26, ease: 'none' }, 0)
      .to('.cinema-hero-shade', { opacity: .86, ease: 'none' }, .25);

    const chapters = [...document.querySelectorAll('.cinema-chapter')];
    chapters.forEach((scene, index) => {
      const sticky = scene.querySelector('.cinema-sticky');
      const image = scene.querySelector('.cinema-backdrop img');
      const title = scene.querySelector('.cinema-title-wrap');
      const copy = scene.querySelector('.cinema-copy');
      const dates = scene.querySelector('.cinema-dates');
      const next = scene.querySelector('.cinema-next');

      gsap.set(sticky, { transformOrigin: '50% 50%' });
      gsap.set(image, { scale: 1.09, yPercent: -2 });
      gsap.set(title, { yPercent: 24 });
      gsap.set(copy, { yPercent: 16 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scene,
          start: 'top bottom',
          end: 'bottom top',
          scrub: index === 6 ? 1.35 : 1.05,
          onEnter: () => shell.update(scene.id),
          onEnterBack: () => shell.update(scene.id)
        }
      });

      tl
        .fromTo(sticky, { clipPath: 'inset(10% 3% 10% 3% round 2px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', duration: .22, ease: 'none' }, 0)
        .fromTo(image, { scale: 1.12, yPercent: -4 }, { scale: 1.035, yPercent: 2, duration: .62, ease: 'none' }, 0)
        .fromTo(title, { yPercent: 30 }, { yPercent: 0, duration: .34, ease: 'none' }, .06)
        .fromTo(copy, { yPercent: 22 }, { yPercent: 0, duration: .38, ease: 'none' }, .12)
        .fromTo(dates, { xPercent: -10 }, { xPercent: 0, duration: .34, ease: 'none' }, .14)
        .to(title, { yPercent: -12, duration: .3, ease: 'none' }, .62)
        .to(copy, { yPercent: -8, duration: .28, ease: 'none' }, .66)
        .to(image, { scale: 1.075, yPercent: 5, duration: .36, ease: 'none' }, .64)
        .to(sticky, { clipPath: 'inset(0% 0% 8% 0% round 2px)', duration: .22, ease: 'none' }, .78);

      if (next) {
        tl.fromTo(next, { yPercent: 48 }, { yPercent: 0, duration: .28, ease: 'none' }, .64);
      }
    });
  }, document.body);

  window.ScrollTrigger.refresh();
}

function observeChapters(chapters) {
  observer?.disconnect();
  observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) shell?.update(visible.target.id);
  }, { rootMargin: '-38% 0px -38% 0px', threshold: [0, .08, .25] });
  chapters.forEach((chapter) => {
    const element = document.getElementById(chapter.id);
    if (element) observer.observe(element);
  });
}

function goTo(id) {
  const target = id === 'inicio' ? document.querySelector('#inicio') : document.getElementById(id);
  target?.scrollIntoView({ behavior: shell?.reduced() ? 'auto' : 'smooth', block: 'start' });
}

function footerMarkup() {
  return `<footer class="cinema-finale">
    <div class="cinema-finale-image" aria-hidden="true"><img src="assets/base-4k.png" alt=""></div>
    <div class="cinema-finale-shade" aria-hidden="true"></div>
    <div class="cinema-finale-copy"><p>PLASENCIA · OCHO CAPAS / UNA CIUDAD</p><h2>El pasado no termina.<br><em>Cambia de forma.</em></h2><a href="#inicio">Volver al principio ↑</a></div>
    <a class="cinema-credits" href="creditos.html">Fuentes y fotografías ↗</a>
  </footer>`;
}