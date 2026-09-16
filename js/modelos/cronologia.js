import { loadPlasenciaData } from '../common/data.js';
import { initShell } from '../common/shell.js';
import { chapterHeading, factualSections, photoFigure, primaryCopy, storyAction, chapterSources, transitionCopy, escapeHTML } from '../common/markup.js';

const root = document.querySelector('#story-root');
let shell;
let motionContext;
let score;
let journeyTrigger;
let records = [];
let activeObserver;
const mobile = matchMedia('(max-width: 900px)');

try {
  const data = await loadPlasenciaData();
  root.innerHTML = `<div class="chrono-journey"><div class="chrono-window"><div class="chrono-track">${data.chapters.map((chapter, index) => renderStation(data, chapter, index)).join('')}</div><div class="chrono-spine" aria-hidden="true"><i></i>${data.chapters.map((chapter, index) => `<span style="--i:${index}"><b>${escapeHTML(chapter.shortEra)}</b></span>`).join('')}</div></div></div>${footerMarkup(data)}`;
  shell = initShell({ data, model: 'cronologia', goTo, onMotionChange: rebuildMotion });
  observeStatic(data.chapters);
  rebuildMotion(shell.reduced());
  mobile.addEventListener('change', () => rebuildMotion(shell.reduced()));
  Promise.all([document.fonts.ready, ...[...document.images].map((image) => image.decode?.().catch(() => undefined))]).then(() => window.ScrollTrigger?.refresh());
} catch (error) {
  root.innerHTML = `<section class="error-panel"><div><h2>No se pudo trazar la cronología.</h2><p>${escapeHTML(error.message)}</p></div></section>`;
  console.error(error);
}

function renderStation(data, chapter, index) {
  const templates = {
    muralla: () => `<section class="chrono-station station-muralla chapter-shell" id="muralla" data-chapter="muralla" style="--chapter-paper:#ded6c8;--chapter-ink:#263029">
      <div class="station-era"><span>${escapeHTML(chapter.milestones[0][0])}</span><i></i><span>${escapeHTML(chapter.milestones[2][0])}</span></div>
      ${chapterHeading(chapter, index)}
      <div class="chrono-wall" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
      <div class="chrono-breach" aria-hidden="true"><span>EL RECINTO SE ABRE</span></div>
      ${photoFigure(data, 'muralla', { className: 'station-lead', storyId: chapter.id, storyLabel: chapter.name })}
      ${photoFigure(data, 'muralla-detalle', { className: 'station-detail' })}
      ${primaryCopy(chapter)}
      <div class="station-facts">${factualSections(chapter)}</div>
      <div class="station-actions">${storyAction(chapter)}${chapterSources(chapter)}</div>${transitionCopy(chapter)}
    </section>`,
    puerta: () => `<section class="chrono-station station-puerta chapter-shell" id="puerta" data-chapter="puerta" style="--chapter-paper:#d8cfb9;--chapter-ink:#2f3b32">
      <div class="station-door-frame" aria-hidden="true"><i></i><span>ATRAVESAR</span></div>
      <div class="station-door-planes" aria-hidden="true"><i></i><i></i><i></i></div>
      ${photoFigure(data, 'puerta', { className: 'station-lead', storyId: chapter.id, storyLabel: chapter.name, focus: '50% 42%' })}
      ${chapterHeading(chapter, index)}
      <div class="door-before"><strong>${escapeHTML(chapter.archives[0][0])}</strong><p>${escapeHTML(chapter.archives[0][2])} El registro se consulta desde el archivo enlazado.</p></div>
      ${primaryCopy(chapter)}
      <div class="station-facts">${factualSections(chapter)}</div>
      <div class="station-actions">${storyAction(chapter)}${chapterSources(chapter)}</div>
      <div class="chrono-threshold" aria-hidden="true"><span>AL OTRO LADO · LA VIDA CORAL</span></div>${transitionCopy(chapter)}
    </section>`,
    plaza: () => `<section class="chrono-station station-plaza chapter-shell" id="plaza" data-chapter="plaza" style="--chapter-paper:#edcfb5;--chapter-ink:#52382f">
      ${chapterHeading(chapter, index)}
      <div class="square-voices"><span>mercado</span><span>oficios</span><span>soportales</span><span>encuentro</span></div>
      <div class="square-mosaic">${photoFigure(data, 'plaza', { className: 'station-lead', storyId: chapter.id, storyLabel: chapter.name })}</div>
      ${primaryCopy(chapter)}
      <div class="station-facts">${factualSections(chapter)}</div>
      <aside class="square-date"><strong>Martes</strong><span>mercado semanal</span></aside>
      <div class="square-ascent" aria-hidden="true"><i></i><span>ASCENSO A LA PIEDRA SAGRADA</span></div>
      <div class="station-actions">${storyAction(chapter)}${chapterSources(chapter)}</div>${transitionCopy(chapter)}
    </section>`,
    catedral: () => `<section class="chrono-station station-catedral chapter-shell" id="catedral" data-chapter="catedral" style="--chapter-paper:#e7e5df;--chapter-ink:#2a3c3d">
      <div class="cathedral-station-axis" aria-hidden="true"><span>${escapeHTML(chapter.milestones[0][0])}</span><i></i><span>${escapeHTML(chapter.milestones[1][0])}</span></div>
      <div class="tower-halt" aria-hidden="true"><span>EL TRANSPORTE SE DETIENE</span></div>
      ${chapterHeading(chapter, index)}
      <div class="station-cathedral-pair"><div class="tower-old">${photoFigure(data, 'catedral-entorno', { className: 'station-detail' })}</div><div class="tower-new">${photoFigure(data, 'catedral', { className: 'station-lead', storyId: chapter.id, storyLabel: chapter.name })}</div></div>
      ${primaryCopy(chapter)}
      <div class="station-facts">${factualSections(chapter)}</div>
      <div class="civic-handoff" aria-hidden="true"><span>DEL TIEMPO DE LA FE AL TIEMPO CIVIL</span></div>
      <div class="station-actions">${storyAction(chapter)}${chapterSources(chapter)}</div>${transitionCopy(chapter)}
    </section>`,
    ayuntamiento: () => `<section class="chrono-station station-ayuntamiento chapter-shell" id="ayuntamiento" data-chapter="ayuntamiento" style="--chapter-paper:#283230;--chapter-ink:#f1e9dc">
      <div class="civic-dial" aria-hidden="true"><i></i><b></b><span>${escapeHTML(chapter.milestones[1][0])}</span></div>
      ${chapterHeading(chapter, index)}
      ${photoFigure(data, 'ayuntamiento', { className: 'station-lead', storyId: chapter.id, storyLabel: chapter.name })}
      ${photoFigure(data, 'mayorga', { className: 'station-detail' })}
      ${primaryCopy(chapter)}
      <div class="station-facts">${factualSections(chapter)}</div>
      <div class="station-actions">${storyAction(chapter)}${chapterSources(chapter)}</div>${transitionCopy(chapter)}
    </section>`,
    acueducto: () => `<section class="chrono-station station-acueducto chapter-shell" id="acueducto" data-chapter="acueducto" style="--chapter-paper:#cfe0e2;--chapter-ink:#25474c">
      ${chapterHeading(chapter, index)}
      <svg class="station-waterline" viewBox="0 0 1000 180" preserveAspectRatio="none" aria-hidden="true"><path d="M0 155 C175 150 230 40 410 74 S720 160 1000 24"/></svg>
      ${photoFigure(data, 'acueducto', { className: 'station-lead', storyId: chapter.id, storyLabel: chapter.name })}
      <div class="pipe-stops" aria-hidden="true"><span>01 · Captar</span><span>02 · Conducir</span><span>03 · Salvar el desnivel</span></div>
      ${primaryCopy(chapter)}
      <div class="station-facts">${factualSections(chapter)}</div>
      <p class="technical-disclaimer">Esquema editorial contemporáneo: no representa un plano histórico ni una escala topográfica.</p>
      <div class="station-actions">${storyAction(chapter)}${chapterSources(chapter)}</div>${transitionCopy(chapter)}
    </section>`,
    parque: () => `<section class="chrono-station station-parque chapter-shell" id="parque" data-chapter="parque" style="--chapter-paper:#dce5d9;--chapter-ink:#29483a">
      <div class="park-hush" aria-hidden="true"><i></i><i></i></div>
      ${chapterHeading(chapter, index)}
      ${photoFigure(data, 'parque', { className: 'station-lead', storyId: chapter.id, storyLabel: chapter.name })}
      ${primaryCopy(chapter)}
      <aside class="memory-station"><strong>${escapeHTML(chapter.milestones[1][0])}</strong><p>${escapeHTML(chapter.sections[1][1])}</p></aside>
      <div class="station-facts">${factualSections(chapter)}</div>
      <div class="station-actions">${storyAction(chapter)}${chapterSources(chapter)}</div>${transitionCopy(chapter)}
    </section>`,
    monumento: () => `<section class="chrono-station station-monumento chapter-shell" id="monumento" data-chapter="monumento" style="--chapter-paper:#e0cbae;--chapter-ink:#3f362b">
      <div class="terminal-dates"><span><b>${escapeHTML(chapter.milestones[0][0])}</b>${escapeHTML(chapter.milestones[0][1])}</span><i></i><span><b>${escapeHTML(chapter.milestones[1][0])}</b>${escapeHTML(chapter.milestones[1][1])}</span></div>
      ${chapterHeading(chapter, index)}
      ${photoFigure(data, 'monumento', { className: 'station-lead', storyId: chapter.id, storyLabel: chapter.name, focus: '57% 50%' })}
      <div class="terminal-rings" aria-hidden="true"><i></i><i></i><i></i></div>
      ${primaryCopy(chapter)}
      <div class="station-facts">${factualSections(chapter)}</div>
      <p class="terminal-note">${escapeHTML(chapter.note)}</p>
      <div class="station-actions">${storyAction(chapter)}${chapterSources(chapter)}</div>${transitionCopy(chapter)}
    </section>`
  };
  return templates[chapter.id]();
}

function rebuildMotion(reduced = shell?.reduced() ?? false) {
  motionContext?.revert();
  motionContext = null;
  score = null;
  journeyTrigger = null;
  records = [];
  const panels = [...document.querySelectorAll('.chrono-station')];
  panels.forEach((panel) => { panel.inert = false; panel.removeAttribute('aria-hidden'); });
  const shouldAnimate = !reduced && !mobile.matches && window.gsap && window.ScrollTrigger;
  document.body.classList.toggle('is-static', !shouldAnimate);
  document.body.classList.toggle('is-animated', shouldAnimate);
  if (!shouldAnimate) return;
  const gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);
  const track = document.querySelector('.chrono-track');
  const progress = document.querySelector('.chrono-spine>i');
  motionContext = gsap.context(() => {
    gsap.set(track, { x: 0 });
    score = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut' } });
    let cursor = 0;
    panels.forEach((panel, index) => {
      records.push({ id: panel.id, time: cursor });
      score.addLabel(panel.id, cursor);
      composeStation(score, panel, cursor);
      score.to({}, { duration: panel.id === 'parque' ? 3.1 : 2.35 }, cursor + 1.05);
      cursor += panel.id === 'parque' ? 4.25 : 3.5;
      if (index < panels.length - 1) {
        score.to(track, { x: () => -(index + 1) * window.innerWidth, duration: 1.35, ease: index === 5 ? 'sine.inOut' : 'power2.inOut' }, cursor);
        cursor += 1.35;
      }
    });
    score.to({}, { duration: .5 }, cursor);
    score.eventCallback('onUpdate', () => {
      let active = records[0];
      records.forEach((record) => { if (score.time() >= record.time - .15) active = record; });
      setActive(active.id, panels);
      progress.style.transform = `scaleX(${score.progress()})`;
    });
    journeyTrigger = window.ScrollTrigger.create({
      id: 'cronologia-global',
      trigger: '.chrono-journey',
      pin: '.chrono-window',
      start: 'top top',
      end: () => `+=${Math.round(window.innerHeight * 26)}`,
      animation: score,
      scrub: .55,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onEnter: () => setActive('muralla', panels),
      onLeaveBack: () => shell.update('inicio')
    });
  }, root);
  window.ScrollTrigger.refresh();
}

function composeStation(timeline, panel, at) {
  const q = (selector) => panel.querySelector(selector);
  const qa = (selector) => panel.querySelectorAll(selector);
  if (panel.id === 'muralla') {
    timeline.fromTo(qa('.chrono-wall i'), { y: (index) => index % 2 ? -50 : 50, scaleX: .35, opacity: 0 }, { y: 0, scaleX: 1, opacity: .25, stagger: .08, duration: .8 }, at)
      .fromTo(q('.station-lead'), { y: 62, clipPath: 'inset(30% 0 0)' }, { y: 0, clipPath: 'inset(0% 0 0)', duration: .9 }, at + .12)
      .fromTo(q('.station-detail'), { x: 46, clipPath: 'inset(0 0 0 45%)' }, { x: 0, clipPath: 'inset(0 0 0 0%)', duration: .65 }, at + .45)
      .fromTo(q('.chrono-breach'), { clipPath: 'inset(0 50% 0 50%)' }, { clipPath: 'inset(0 0% 0 0%)', duration: .5 }, at + .95);
  } else if (panel.id === 'puerta') {
    timeline.fromTo(q('.station-door-frame'), { scale: .72, opacity: 0 }, { scale: 1, opacity: 1, duration: 1 }, at)
      .fromTo(qa('.station-door-planes i'), { scale: (index) => 1.55 - index * .18 }, { scale: 1, stagger: .08, duration: .8 }, at)
      .fromTo(q('.station-lead'), { scale: .84, clipPath: 'inset(14% 25% 0 round 46% 46% 0 0)' }, { scale: 1, clipPath: 'inset(0 0% 0 round 46% 46% 0 0)', duration: 1 }, at + .05)
      .fromTo(q('.chapter-heading'), { y: -40, clipPath: 'inset(0 0 55% 0)' }, { y: 0, clipPath: 'inset(0 0 0% 0)', duration: .6 }, at + .35)
      .fromTo(q('.chrono-threshold'), { clipPath: 'inset(0 50% 0 50%)' }, { clipPath: 'inset(0 0% 0 0%)', duration: .5 }, at + .95);
  } else if (panel.id === 'plaza') {
    timeline.fromTo(q('.station-lead'), { clipPath: 'circle(7% at 54% 52%)' }, { clipPath: 'circle(75% at 54% 52%)', duration: .85 }, at)
      .fromTo(qa('.square-voices span'), { x: (index) => [-90, 70, -50, 80][index], y: (index) => [12, -34, 42, 0][index], opacity: 0 }, { x: 0, y: 0, opacity: 1, stagger: .1, duration: .6 }, at + .18)
      .fromTo(qa('.station-facts .fact'), { x: (index) => index % 2 ? 90 : -90, opacity: 0 }, { x: 0, opacity: 1, stagger: .1, duration: .5 }, at + .5)
      .fromTo(q('.square-ascent i'), { scaleY: 0 }, { scaleY: 1, transformOrigin: 'bottom', duration: .7, ease: 'none' }, at + 1.1);
  } else if (panel.id === 'catedral') {
    timeline.fromTo(q('.tower-new'), { yPercent: 70, clipPath: 'inset(38% 0 0)' }, { yPercent: 0, clipPath: 'inset(0% 0 0)', duration: 1.05, ease: 'power2.out' }, at)
      .fromTo(q('.cathedral-station-axis i'), { scaleY: 0 }, { scaleY: 1, transformOrigin: 'top', duration: .9 }, at + .18)
      .fromTo(q('.chapter-heading'), { y: 90, clipPath: 'inset(0 0 55% 0)' }, { y: 0, clipPath: 'inset(0 0 0% 0)', duration: .85 }, at + .3)
      .fromTo(q('.tower-old'), { yPercent: 55, clipPath: 'inset(45% 0 0)' }, { yPercent: 0, clipPath: 'inset(0% 0 0)', duration: .95, ease: 'power2.out' }, at + .55)
      .fromTo(q('.civic-handoff'), { clipPath: 'inset(0 50% 0 50%)' }, { clipPath: 'inset(0 0% 0 0%)', duration: .5 }, at + 1.35);
  } else if (panel.id === 'ayuntamiento') {
    timeline.fromTo(q('.civic-dial'), { rotation: -45, scale: .75, opacity: 0 }, { rotation: 0, scale: 1, opacity: 1, duration: .9 }, at)
      .fromTo(q('.station-lead'), { scale: .93, opacity: 0 }, { scale: 1, opacity: 1, duration: .55 }, at + .15)
      .fromTo(q('.station-detail'), { scale: 1.16, opacity: 0 }, { scale: 1, opacity: 1, duration: .55 }, at + .42)
      .fromTo(qa('.station-facts .fact'), { opacity: 0 }, { opacity: 1, stagger: .13, duration: .3 }, at + .55);
  } else if (panel.id === 'acueducto') {
    const path = q('.station-waterline path');
    const length = path.getTotalLength();
    timeline.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 1.15, ease: 'none' }, at)
      .fromTo(q('.station-lead'), { x: 72, y: -34, clipPath: 'inset(0 42% 0 0)' }, { x: 0, y: 0, clipPath: 'inset(0 0% 0 0)', duration: .9 }, at + .12)
      .fromTo(qa('.pipe-stops span'), { y: 26, opacity: 0 }, { y: 0, opacity: 1, stagger: .12, duration: .45 }, at + .42);
  } else if (panel.id === 'parque') {
    timeline.fromTo(q('.station-lead img'), { scale: 1.055, filter: 'saturate(.75)' }, { scale: 1, filter: 'saturate(1)', duration: 1.45, ease: 'sine.out' }, at)
      .fromTo(q('.chapter-heading'), { opacity: 0 }, { opacity: 1, duration: 1.2 }, at + .15)
      .fromTo(qa('.park-hush i'), { scale: .55, opacity: 0 }, { scale: 1, opacity: .4, stagger: .22, duration: 1.2 }, at + .2);
  } else if (panel.id === 'monumento') {
    timeline.fromTo(q('.station-lead'), { scale: .88, opacity: 0 }, { scale: 1, opacity: 1, duration: .95 }, at)
      .fromTo(q('.chapter-heading'), { y: 28, scale: .94, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: .72 }, at + .18)
      .fromTo(q('.terminal-dates'), { opacity: 0 }, { opacity: 1, duration: .75 }, at + .35)
      .fromTo(qa('.terminal-rings i'), { scale: .35, opacity: 0 }, { scale: 1, opacity: .38, stagger: .1, duration: .75 }, at + .4);
  }
}

function setActive(id, panels) {
  shell.update(id);
  panels.forEach((panel) => {
    const active = panel.id === id;
    panel.inert = !active;
    panel.setAttribute('aria-hidden', String(!active));
  });
}

function observeStatic(chapters) {
  activeObserver?.disconnect();
  activeObserver = new IntersectionObserver((entries) => {
    if (document.body.classList.contains('is-animated')) return;
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) shell.update(visible.target.id);
  }, { rootMargin: '-30% 0px -48% 0px', threshold: [0, .15] });
  chapters.forEach((chapter) => activeObserver.observe(document.getElementById(chapter.id)));
}

function goTo(id) {
  if (id === 'inicio') {
    window.scrollTo({ top: 0, behavior: shell?.reduced() ? 'auto' : 'smooth' });
    return;
  }
  if (!journeyTrigger || !score) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'auto', block: 'start' });
    return;
  }
  const time = score.labels[id];
  if (time === undefined) return;
  const target = journeyTrigger.start + (journeyTrigger.end - journeyTrigger.start) * (time / score.duration());
  window.scrollTo({ top: target, behavior: shell?.reduced() ? 'auto' : 'smooth' });
}

function footerMarkup(data) {
  const monument = data.chapters.find((chapter) => chapter.id === 'monumento');
  return `<footer class="site-footer"><div><p class="eyebrow">FIN DE LA CRONOLOGÍA · ${escapeHTML(monument.milestones[1][0])} / MEMORIA DE ${escapeHTML(monument.milestones[0][0])}</p><h2>La línea termina. La historia no.</h2><nav><a href="#inicio">Volver al principio</a><a href="03-reescritura.html">Continuar con Reescritura</a><a href="index.html">Comparar las tres versiones</a><a href="creditos.html">Fuentes y fotografías</a></nav></div></footer>`;
}
