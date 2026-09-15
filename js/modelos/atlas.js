import { loadPlasenciaData } from '../common/data.js';
import { initShell } from '../common/shell.js';
import { chapterHeading, factualSections, photoFigure, primaryCopy, storyAction, chapterSources, transitionCopy, escapeHTML } from '../common/markup.js';

const root = document.querySelector('#story-root');
let shell;
let motionContext;
let activeObserver;
const mobile = matchMedia('(max-width: 900px)');

try {
  const data = await loadPlasenciaData();
  root.innerHTML = `<div class="atlas-field"><div class="atlas-route" aria-hidden="true"><i></i><b></b></div>${data.chapters.map((chapter, index) => renderAtlasChapter(data, chapter, index)).join('')}</div>${footerMarkup()}`;
  shell = initShell({ data, model: 'atlas', goTo, onMotionChange: rebuildMotion });
  observeChapters(data.chapters);
  rebuildMotion(shell.reduced());
  mobile.addEventListener('change', () => rebuildMotion(shell.reduced()));
  Promise.all([document.fonts.ready, ...[...document.images].map((image) => image.decode?.().catch(() => undefined))]).then(() => window.ScrollTrigger?.refresh());
} catch (error) {
  root.innerHTML = `<section class="error-panel"><div><h2>No se pudo desplegar el atlas.</h2><p>${escapeHTML(error.message)}</p></div></section>`;
  console.error(error);
}

function renderAtlasChapter(data, chapter, index) {
  const templates = {
    muralla: () => `<section class="atlas-leaf atlas-muralla chapter-shell" id="muralla" data-chapter="muralla" style="--chapter-paper:#e4ddcf;--chapter-ink:#24302a">
      <div class="wall-blocks" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
      ${chapterHeading(chapter, index)}
      <div class="perimeter" aria-hidden="true"><span>${escapeHTML(chapter.milestones[0][0])}</span><i></i><b>${escapeHTML(chapter.milestones[1][0])}</b><i></i><b>${escapeHTML(chapter.milestones[2][0])}</b></div>
      ${photoFigure(data, 'muralla', { className: 'atlas-lead', storyId: chapter.id, storyLabel: chapter.name, focus: chapter.focus })}
      ${photoFigure(data, 'muralla-detalle', { className: 'atlas-detail' })}
      ${primaryCopy(chapter)}
      ${factualSections(chapter)}
      <div class="atlas-actions">${storyAction(chapter)}${chapterSources(chapter)}</div>
      ${transitionCopy(chapter)}
    </section>`,
    puerta: () => `<section class="atlas-leaf atlas-puerta chapter-shell" id="puerta" data-chapter="puerta" style="--chapter-paper:#d9d0ba;--chapter-ink:#2b382f">
      <div class="door-axis" aria-hidden="true"><span>EXTERIOR</span><i></i><span>INTERIOR</span></div>
      <div class="door-aperture">${photoFigure(data, 'puerta', { className: 'atlas-lead', storyId: chapter.id, storyLabel: chapter.name, focus: '50% 45%' })}</div>
      ${chapterHeading(chapter, index)}
      ${primaryCopy(chapter, 'threshold-copy')}
      <div class="threshold-facts">${factualSections(chapter)}</div>
      <aside class="archive-marker"><strong>${escapeHTML(chapter.archives[0][0])}</strong><p>${escapeHTML(chapter.archives[0][2])} Se enlaza el registro; la digitalización no se reproduce sin condiciones de uso cerradas.</p></aside>
      <div class="atlas-actions">${storyAction(chapter)}${chapterSources(chapter)}</div>
      ${transitionCopy(chapter)}
    </section>`,
    plaza: () => `<section class="atlas-leaf atlas-plaza chapter-shell" id="plaza" data-chapter="plaza" style="--chapter-paper:#ecd5bf;--chapter-ink:#55382e">
      ${chapterHeading(chapter, index)}
      <div class="plaza-voices" aria-hidden="true"><span>Mercado</span><span>Soportales</span><span>Vecindad</span></div>
      ${photoFigure(data, 'plaza', { className: 'atlas-lead', storyId: chapter.id, storyLabel: chapter.name, focus: chapter.focus })}
      ${primaryCopy(chapter)}
      <div class="plaza-ledger">${factualSections(chapter)}</div>
      <p class="plaza-caution">Una plaza no tiene una sola fecha: el espacio, las fachadas y el mobiliario pertenecen a transformaciones distintas.</p>
      <div class="atlas-actions">${storyAction(chapter)}${chapterSources(chapter)}</div>
      ${transitionCopy(chapter)}
    </section>`,
    catedral: () => `<section class="atlas-leaf atlas-catedral chapter-shell" id="catedral" data-chapter="catedral" style="--chapter-paper:#e5e4df;--chapter-ink:#293c3e">
      <div class="cathedral-years" aria-hidden="true"><span>${escapeHTML(chapter.milestones[0][0])}</span><i></i><span>${escapeHTML(chapter.milestones[1][0])}</span></div>
      ${chapterHeading(chapter, index)}
      <div class="cathedral-pair">
        ${photoFigure(data, 'catedral', { className: 'atlas-lead', storyId: chapter.id, storyLabel: chapter.name, focus: '50% 40%' })}
        ${photoFigure(data, 'catedral-entorno', { className: 'atlas-detail', focus: '50% 52%' })}
      </div>
      ${primaryCopy(chapter)}
      <div class="cathedral-facts">${factualSections(chapter)}</div>
      <p class="cathedral-note">Dos proyectos conviven. La selección fotográfica no sustituye un plano ni reconstruye las fases de obra.</p>
      <div class="atlas-actions">${storyAction(chapter)}${chapterSources(chapter)}</div>
      ${transitionCopy(chapter)}
    </section>`,
    ayuntamiento: () => `<section class="atlas-leaf atlas-ayuntamiento chapter-shell" id="ayuntamiento" data-chapter="ayuntamiento" style="--chapter-paper:#283331;--chapter-ink:#f1eadf">
      <div class="clock-orbit" aria-hidden="true"><i></i><b></b><span>${escapeHTML(chapter.milestones[1][0])}</span></div>
      ${chapterHeading(chapter, index)}
      <div class="civic-pair">
        ${photoFigure(data, 'ayuntamiento', { className: 'atlas-lead', storyId: chapter.id, storyLabel: chapter.name })}
        ${photoFigure(data, 'mayorga', { className: 'atlas-detail', focus: '50% 28%' })}
      </div>
      ${primaryCopy(chapter)}
      <div class="civic-pulses">${factualSections(chapter)}</div>
      <div class="atlas-actions">${storyAction(chapter)}${chapterSources(chapter)}</div>
      ${transitionCopy(chapter)}
    </section>`,
    acueducto: () => `<section class="atlas-leaf atlas-acueducto chapter-shell" id="acueducto" data-chapter="acueducto" style="--chapter-paper:#d4e1e2;--chapter-ink:#244348">
      ${chapterHeading(chapter, index)}
      <svg class="aqueduct-route" viewBox="0 0 900 230" preserveAspectRatio="none" aria-hidden="true"><path d="M0 200 C160 190 190 55 360 85 S630 210 900 20"/></svg>
      ${photoFigure(data, 'acueducto', { className: 'atlas-lead', storyId: chapter.id, storyLabel: chapter.name, focus: chapter.focus })}
      <div class="water-labels"><span>Captación</span><span>Conducción</span><span>Arquería</span></div>
      ${primaryCopy(chapter)}
      <div class="technical-facts">${factualSections(chapter)}</div>
      <p class="scheme-note">El trazado animado es una explicación editorial moderna; no se presenta como plano histórico ni topográfico.</p>
      <div class="atlas-actions">${storyAction(chapter)}${chapterSources(chapter)}</div>
      ${transitionCopy(chapter)}
    </section>`,
    parque: () => `<section class="atlas-leaf atlas-parque chapter-shell" id="parque" data-chapter="parque" style="--chapter-paper:#dfe6dc;--chapter-ink:#284638">
      <div class="breathing-rings" aria-hidden="true"><i></i><i></i><i></i></div>
      ${chapterHeading(chapter, index)}
      ${photoFigure(data, 'parque', { className: 'atlas-lead', storyId: chapter.id, storyLabel: chapter.name })}
      ${primaryCopy(chapter)}
      <aside class="memory-note"><strong>Memoria, no decoración.</strong><p>${escapeHTML(chapter.sections[1][1])}</p></aside>
      <div class="park-facts">${factualSections(chapter)}</div>
      <div class="atlas-actions">${storyAction(chapter)}${chapterSources(chapter)}</div>
      ${transitionCopy(chapter)}
    </section>`,
    monumento: () => `<section class="atlas-leaf atlas-monumento chapter-shell" id="monumento" data-chapter="monumento" style="--chapter-paper:#dfccb0;--chapter-ink:#3d3429">
      <div class="monument-dates"><span><b>${escapeHTML(chapter.milestones[0][0])}</b>${escapeHTML(chapter.milestones[0][1])}</span><i></i><span><b>${escapeHTML(chapter.milestones[1][0])}</b>${escapeHTML(chapter.milestones[1][1])}</span></div>
      ${chapterHeading(chapter, index)}
      ${photoFigure(data, 'monumento', { className: 'atlas-lead', storyId: chapter.id, storyLabel: chapter.name, focus: '56% 48%' })}
      <div class="water-echo" aria-hidden="true"><i></i><i></i><i></i></div>
      ${primaryCopy(chapter)}
      <div class="monument-facts">${factualSections(chapter)}</div>
      <p class="monument-note">${escapeHTML(chapter.note)}</p>
      <div class="atlas-actions">${storyAction(chapter)}${chapterSources(chapter)}</div>
      ${transitionCopy(chapter)}
    </section>`
  };
  return templates[chapter.id]();
}

function observeChapters(chapters) {
  activeObserver?.disconnect();
  activeObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) shell.update(visible.target.id);
  }, { rootMargin: '-34% 0px -46% 0px', threshold: [0, .1, .25] });
  chapters.forEach((chapter) => activeObserver.observe(document.getElementById(chapter.id)));
}

function rebuildMotion(reduced = shell?.reduced() ?? false) {
  motionContext?.revert();
  motionContext = null;
  document.body.classList.toggle('is-static', reduced || mobile.matches || !window.gsap || !window.ScrollTrigger);
  document.body.classList.toggle('is-animated', !reduced && !mobile.matches && !!window.gsap && !!window.ScrollTrigger);
  if (reduced || mobile.matches || !window.gsap || !window.ScrollTrigger) return;
  window.gsap.registerPlugin(window.ScrollTrigger);
  motionContext = window.gsap.context(() => {
    const gsap = window.gsap;
    gsap.fromTo('.atlas-route i', { scaleY: 0 }, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.atlas-field', start: 'top 70%', end: 'bottom 30%', scrub: .4 } });
    document.querySelectorAll('.atlas-leaf').forEach((scene) => {
      const id = scene.id;
      const timeline = gsap.timeline({ scrollTrigger: { trigger: scene, start: 'top 78%', end: 'top 28%', scrub: .45 } });
      if (id === 'muralla') {
        timeline.fromTo(scene.querySelectorAll('.wall-blocks i'), { scaleX: 0 }, { scaleX: 1, stagger: .08, transformOrigin: 'left' }, 0)
          .fromTo(scene.querySelector('.atlas-lead'), { x: -90, clipPath: 'inset(0 35% 0 0)' }, { x: 0, clipPath: 'inset(0 0% 0 0)' }, .08)
          .fromTo(scene.querySelector('.atlas-detail'), { x: 70, y: -25, opacity: 0 }, { x: 0, y: 0, opacity: 1 }, .32)
          .fromTo(scene.querySelector('.perimeter i'), { scaleX: 0 }, { scaleX: 1, stagger: .15, transformOrigin: 'left' }, .1);
      } else if (id === 'puerta') {
        timeline.fromTo(scene.querySelector('.door-aperture'), { scale: .82, clipPath: 'inset(18% 26% 0 26% round 48% 48% 0 0)' }, { scale: 1, clipPath: 'inset(0% 0% 0 0% round 48% 48% 0 0)' }, 0)
          .fromTo(scene.querySelector('.chapter-heading'), { y: -55, opacity: 0 }, { y: 0, opacity: 1 }, .18)
          .fromTo(scene.querySelector('.archive-marker'), { x: 55, opacity: 0 }, { x: 0, opacity: 1 }, .42);
      } else if (id === 'plaza') {
        timeline.fromTo(scene.querySelector('.atlas-lead'), { clipPath: 'circle(8% at 50% 50%)' }, { clipPath: 'circle(72% at 50% 50%)' }, 0)
          .fromTo(scene.querySelectorAll('.plaza-voices span'), { x: (index) => [-85, 70, -35][index], y: (index) => [0, 30, -40][index], opacity: 0 }, { x: 0, y: 0, opacity: 1, stagger: .12 }, .12)
          .fromTo(scene.querySelectorAll('.plaza-ledger .fact'), { y: 38, opacity: 0 }, { y: 0, opacity: 1, stagger: .1 }, .4);
      } else if (id === 'catedral') {
        timeline.fromTo(scene.querySelector('.chapter-heading'), { y: 95, opacity: 0 }, { y: 0, opacity: 1 }, 0)
          .fromTo(scene.querySelector('.atlas-lead'), { y: 120, clipPath: 'inset(28% 0 0)' }, { y: 0, clipPath: 'inset(0% 0 0)' }, .05)
          .fromTo(scene.querySelector('.atlas-detail'), { y: -70, opacity: 0 }, { y: 0, opacity: 1 }, .32)
          .fromTo(scene.querySelector('.cathedral-years i'), { scaleY: 0 }, { scaleY: 1, transformOrigin: 'top' }, .2);
      } else if (id === 'ayuntamiento') {
        timeline.fromTo(scene.querySelector('.clock-orbit'), { rotation: -32, scale: .76, opacity: 0 }, { rotation: 0, scale: 1, opacity: 1 }, 0)
          .fromTo(scene.querySelector('.atlas-lead'), { scale: .92, opacity: 0 }, { scale: 1, opacity: 1 }, .12)
          .fromTo(scene.querySelector('.atlas-detail'), { scale: 1.18, opacity: 0 }, { scale: 1, opacity: 1 }, .28)
          .fromTo(scene.querySelectorAll('.civic-pulses .fact'), { opacity: 0 }, { opacity: 1, stagger: .16 }, .35);
      } else if (id === 'acueducto') {
        const path = scene.querySelector('.aqueduct-route path');
        const length = path.getTotalLength();
        timeline.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0 }, 0)
          .fromTo(scene.querySelector('.chapter-heading'), { x: -80, y: 25, opacity: 0 }, { x: 0, y: 0, opacity: 1 }, .05)
          .fromTo(scene.querySelector('.atlas-lead'), { x: 75, y: -35, clipPath: 'inset(0 38% 0 0)' }, { x: 0, y: 0, clipPath: 'inset(0 0% 0 0)' }, .2)
          .fromTo(scene.querySelectorAll('.technical-facts .fact'), { x: 30, y: 24, opacity: 0 }, { x: 0, y: 0, opacity: 1, stagger: .1 }, .4);
      } else if (id === 'parque') {
        timeline.fromTo(scene.querySelector('.atlas-lead img'), { scale: 1.07, filter: 'saturate(.78)' }, { scale: 1, filter: 'saturate(1)' }, 0)
          .fromTo(scene.querySelector('.chapter-heading'), { opacity: 0 }, { opacity: 1, duration: 1.4 }, .08)
          .fromTo(scene.querySelectorAll('.breathing-rings i'), { scale: .55, opacity: 0 }, { scale: 1, opacity: .45, stagger: .2 }, .2);
      } else if (id === 'monumento') {
        timeline.fromTo(scene.querySelector('.atlas-lead'), { scale: .9, opacity: 0 }, { scale: 1, opacity: 1 }, 0)
          .fromTo(scene.querySelector('.chapter-heading'), { scale: .94, y: 28, opacity: 0 }, { scale: 1, y: 0, opacity: 1 }, .12)
          .fromTo(scene.querySelector('.monument-dates'), { opacity: 0 }, { opacity: 1 }, .3)
          .fromTo(scene.querySelectorAll('.water-echo i'), { scale: .35, opacity: 0 }, { scale: 1, opacity: .38, stagger: .12 }, .32);
      }
    });
  }, root);
  window.ScrollTrigger.refresh();
}

function goTo(id) {
  const target = id === 'inicio' ? document.querySelector('#inicio') : document.getElementById(id);
  target?.scrollIntoView({ behavior: shell?.reduced() ? 'auto' : 'smooth', block: 'start' });
}

function footerMarkup() {
  return `<footer class="site-footer"><div><p class="eyebrow">FIN DEL ATLAS · LA HISTORIA SIGUE EN LA CALLE</p><h2>La ciudad cambia cuando sabemos dónde mirar.</h2><nav><a href="#inicio">Volver al principio</a><a href="02-cronologia.html">Continuar con Cronología</a><a href="index.html">Comparar las tres versiones</a><a href="creditos.html">Fuentes y fotografías</a></nav></div></footer>`;
}
