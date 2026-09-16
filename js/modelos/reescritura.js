import { loadPlasenciaData } from '../common/data.js';
import { initShell } from '../common/shell.js';
import { chapterHeading, factualSections, photoFigure, primaryCopy, storyAction, chapterSources, transitionCopy, escapeHTML } from '../common/markup.js';

const root = document.querySelector('#story-root');
let shell;
let motionContext;
let activeObserver;
const mobile = matchMedia('(max-width: 900px)');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

try {
  const data = await loadPlasenciaData();
  root.innerHTML = `<div class="rewrite-sequence">${data.chapters.map((chapter, index) => renderRewriteChapter(data, chapter, index)).join('')}</div>${footerMarkup()}`;
  shell = initShell({ data, model: 'reescritura', goTo, onMotionChange: rebuildMotion });
  observeStatic(data.chapters);
  rebuildMotion(shell.reduced());
  mobile.addEventListener('change', () => rebuildMotion(shell.reduced()));
  Promise.all([document.fonts.ready, ...[...document.images].map((image) => image.decode?.().catch(() => undefined))]).then(() => {
    window.ScrollTrigger?.refresh();
    animateHero();
  });
} catch (error) {
  root.innerHTML = `<section class="error-panel"><div><h2>No se pudieron abrir las capas.</h2><p>${escapeHTML(error.message)}</p></div></section>`;
  console.error(error);
}

function renderRewriteChapter(data, chapter, index) {
  const templates = {
    muralla: () => `<section class="rewrite-chapter rewrite-muralla chapter-shell" id="muralla" data-chapter="muralla" data-transition="brecha" style="--chapter-paper:#ddd6c9;--chapter-ink:#24302a">
      <div class="rewrite-stage">
        <div class="wall-strata" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
        ${chapterHeading(chapter, index)}
        <div class="wall-cut">${photoFigure(data, 'muralla', { className: 'rewrite-lead', storyId: chapter.id, storyLabel: chapter.name })}</div>
        ${photoFigure(data, 'muralla-detalle', { className: 'rewrite-detail' })}
        <div class="perimeter-score" aria-label="Hitos del recinto"><span>${escapeHTML(chapter.milestones[0][0])}</span><i></i><span>${escapeHTML(chapter.milestones[1][0])}</span><i></i><span>${escapeHTML(chapter.milestones[2][0])}</span></div>
        <div class="strata-breach" aria-hidden="true"><span>APERTURA · EL MURO CEDE</span></div>
        ${primaryCopy(chapter)}
        <div class="rewrite-facts">${factualSections(chapter)}</div>
        <div class="rewrite-actions">${storyAction(chapter)}${chapterSources(chapter)}</div>${transitionCopy(chapter)}
      </div>
    </section>`,
    puerta: () => `<section class="rewrite-chapter rewrite-puerta chapter-shell" id="puerta" data-chapter="puerta" data-transition="apertura" style="--chapter-paper:#17231d;--chapter-ink:#f0e8d9">
      <div class="rewrite-stage">
        <div class="tunnel-planes" aria-hidden="true"><i></i><i></i><i></i></div>
        <div class="door-light" aria-hidden="true"></div>
        <div class="door-depth">${photoFigure(data, 'puerta', { className: 'rewrite-lead', storyId: chapter.id, storyLabel: chapter.name, focus: '50% 43%' })}</div>
        ${chapterHeading(chapter, index)}
        <div class="threshold-sides"><span>EXTERIOR</span><span>PASO</span><span>INTERIOR</span></div>
        ${primaryCopy(chapter)}
        <aside class="door-archive"><strong>${escapeHTML(chapter.archives[0][0])}</strong><p>${escapeHTML(chapter.archives[0][2])} La ficha se enlaza; no se fabrica un antes/ahora.</p></aside>
        <div class="rewrite-facts">${factualSections(chapter)}</div>
        <div class="rewrite-actions">${storyAction(chapter)}${chapterSources(chapter)}</div>
        <div class="door-emerge" aria-hidden="true"><span>LA PLAZA LUMINOSA</span></div>${transitionCopy(chapter)}
      </div>
    </section>`,
    plaza: () => `<section class="rewrite-chapter rewrite-plaza chapter-shell" id="plaza" data-chapter="plaza" data-transition="eje" style="--chapter-paper:#e8cab1;--chapter-ink:#50342c">
      <div class="rewrite-stage">
        <div class="plaza-orbit" aria-hidden="true"><span>mercado</span><span>fachadas</span><span>oficios</span><span>vecindad</span></div>
        ${chapterHeading(chapter, index)}
        <div class="plaza-opening">${photoFigure(data, 'plaza', { className: 'rewrite-lead', storyId: chapter.id, storyLabel: chapter.name })}</div>
        ${primaryCopy(chapter)}
        <div class="plaza-focus focus-a" data-fact="1">${chapter.sections[0] ? `<strong>${escapeHTML(chapter.sections[0][0])}</strong><p>${escapeHTML(chapter.sections[0][1])}</p>` : ''}</div>
        <div class="plaza-focus focus-b" data-fact="2">${chapter.sections[1] ? `<strong>${escapeHTML(chapter.sections[1][0])}</strong><p>${escapeHTML(chapter.sections[1][1])}</p>` : ''}</div>
        <div class="plaza-focus focus-c" data-fact="3">${chapter.sections[2] ? `<strong>${escapeHTML(chapter.sections[2][0])}</strong><p>${escapeHTML(chapter.sections[2][1])}</p>` : ''}</div>
        <p class="plaza-precision">${escapeHTML(chapter.note)}</p>
        <div class="rewrite-actions">${storyAction(chapter)}${chapterSources(chapter)}</div>${transitionCopy(chapter)}
      </div>
    </section>`,
    catedral: () => `<section class="rewrite-chapter rewrite-catedral chapter-shell" id="catedral" data-chapter="catedral" data-transition="luz" style="--chapter-paper:#dfe1dd;--chapter-ink:#263b3d">
      <div class="rewrite-stage">
        <div class="cathedral-light" aria-hidden="true"></div>
        <div class="cathedral-rise old-layer"><span>${escapeHTML(chapter.milestones[0][0])} · VIEJA</span>${photoFigure(data, 'catedral-entorno', { className: 'rewrite-detail' })}</div>
        <div class="cathedral-rise new-layer"><span>${escapeHTML(chapter.milestones[1][0])} · NUEVA</span>${photoFigure(data, 'catedral', { className: 'rewrite-lead', storyId: chapter.id, storyLabel: chapter.name })}</div>
        ${chapterHeading(chapter, index)}
        ${primaryCopy(chapter)}
        <div class="rewrite-facts">${factualSections(chapter)}</div>
        <p class="cathedral-precision">${escapeHTML(chapter.note)}</p>
        <div class="rewrite-actions">${storyAction(chapter)}${chapterSources(chapter)}</div>${transitionCopy(chapter)}
      </div>
    </section>`,
    ayuntamiento: () => `<section class="rewrite-chapter rewrite-ayuntamiento chapter-shell" id="ayuntamiento" data-chapter="ayuntamiento" data-transition="pulso" style="--chapter-paper:#222d2a;--chapter-ink:#f0e9dc">
      <div class="rewrite-stage">
        <div class="mayorga-dial" aria-hidden="true"><i></i><b></b><span>${escapeHTML(chapter.milestones[1][0])}</span></div>
        ${chapterHeading(chapter, index)}
        <div class="civic-facade">${photoFigure(data, 'ayuntamiento', { className: 'rewrite-lead', storyId: chapter.id, storyLabel: chapter.name })}</div>
        <div class="mayorga-portrait">${photoFigure(data, 'mayorga', { className: 'rewrite-detail' })}</div>
        ${primaryCopy(chapter)}
        <div class="civic-beats">${factualSections(chapter)}</div>
        <div class="rewrite-actions">${storyAction(chapter)}${chapterSources(chapter)}</div>${transitionCopy(chapter)}
      </div>
    </section>`,
    acueducto: () => `<section class="rewrite-chapter rewrite-acueducto chapter-shell" id="acueducto" data-chapter="acueducto" data-transition="reflejo" style="--chapter-paper:#cbdcde;--chapter-ink:#24474d">
      <div class="rewrite-stage">
        <svg class="aqueduct-diagonal" viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden="true"><path d="M-40 560 C250 520 360 140 640 260 S970 370 1240 40"/></svg>
        ${chapterHeading(chapter, index)}
        <div class="water-window">${photoFigure(data, 'acueducto', { className: 'rewrite-lead', storyId: chapter.id, storyLabel: chapter.name })}</div>
        <div class="water-stations" aria-hidden="true"><span>CAPTAR</span><span>CONDUCIR</span><span>ELEVAR</span></div>
        ${primaryCopy(chapter)}
        <div class="hydraulic-notes">${chapter.sections.map(([heading, text], itemIndex) => `<section data-fact="${itemIndex + 1}"><b>0${itemIndex + 1}</b><h3>${escapeHTML(heading)}</h3><p>${escapeHTML(text)}</p></section>`).join('')}</div>
        <p class="technical-precision">Línea interpretativa moderna, sin pretensión de plano histórico ni escala exacta.</p>
        <div class="rewrite-actions">${storyAction(chapter)}${chapterSources(chapter)}</div>${transitionCopy(chapter)}
      </div>
    </section>`,
    parque: () => `<section class="rewrite-chapter rewrite-parque chapter-shell" id="parque" data-chapter="parque" data-transition="sombra" style="--chapter-paper:#dce5da;--chapter-ink:#29483a">
      <div class="rewrite-stage">
        <div class="park-breath" aria-hidden="true"><i></i><i></i><i></i></div>
        ${chapterHeading(chapter, index)}
        <div class="quiet-photo">${photoFigure(data, 'parque', { className: 'rewrite-lead', storyId: chapter.id, storyLabel: chapter.name })}</div>
        ${primaryCopy(chapter)}
        <aside class="memory-margin"><p class="chapter-index">MEMORIA HISTÓRICA</p><strong>${escapeHTML(chapter.sections[1][0])}</strong><p>${escapeHTML(chapter.sections[1][1])}</p></aside>
        <div class="quiet-copy">${factualSections(chapter)}</div>
        <div class="rewrite-actions">${storyAction(chapter)}${chapterSources(chapter)}</div>${transitionCopy(chapter)}
      </div>
    </section>`,
    monumento: () => `<section class="rewrite-chapter rewrite-monumento chapter-shell" id="monumento" data-chapter="monumento" data-transition="cierre" style="--chapter-paper:#dfccb1;--chapter-ink:#3e352b">
      <div class="rewrite-stage">
        <div class="inscription-dates"><span><b>${escapeHTML(chapter.milestones[0][0])}</b>PERSONAJE HISTÓRICO</span><i></i><span><b>${escapeHTML(chapter.milestones[1][0])}</b>DECISIÓN DEL MONUMENTO</span></div>
        ${chapterHeading(chapter, index)}
        <div class="sculpture-frame">${photoFigure(data, 'monumento', { className: 'rewrite-lead', storyId: chapter.id, storyLabel: chapter.name, focus: '57% 50%' })}</div>
        <div class="bronze-echo" aria-hidden="true"><i></i><i></i><i></i></div>
        ${primaryCopy(chapter)}
        <div class="monument-ledger">${factualSections(chapter)}</div>
        <p class="monument-precision">${escapeHTML(chapter.note)}</p>
        <div class="rewrite-actions">${storyAction(chapter)}${chapterSources(chapter)}</div>${transitionCopy(chapter)}
      </div>
    </section>`
  };
  return templates[chapter.id]();
}

function rebuildMotion(reduced = shell?.reduced() ?? false) {
  motionContext?.revert();
  motionContext = null;
  const shouldAnimate = !reduced && !mobile.matches && window.gsap && window.ScrollTrigger;
  document.body.classList.toggle('is-static', !shouldAnimate);
  document.body.classList.toggle('is-animated', shouldAnimate);
  if (!shouldAnimate) return;
  const gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);
  motionContext = gsap.context(() => {
    document.querySelectorAll('.rewrite-chapter').forEach((scene) => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: scene,
          start: 'top top',
          end: 'bottom bottom',
          scrub: scene.id === 'parque' ? .85 : .5,
          onEnter: () => shell.update(scene.id),
          onEnterBack: () => shell.update(scene.id)
        }
      });
      composeScene(gsap, timeline, scene);
    });

    const prologue = document.querySelector('#inicio');
    if (prologue) {
      const heroTimeline = gsap.timeline({ paused: true });
      heroTimeline
        .set(['.hero-survivor img', '.hero-transition'], { clearProps: 'opacity' })
        .to('.prologue-rewrite', {
          scrollTrigger: {
            trigger: prologue,
            start: 'top top',
            end: () => '+=1',
            scrub: 1.1,
            invalidateOnRefresh: true
          },
          scale: 1.055,
          ease: 'none'
        }, 0)
        .fromTo('.hero-transition .hero-fade', {
          opacity: 0
        }, {
          opacity: 1,
          scrollTrigger: {
            trigger: prologue,
            start: 'top bottom',
            end: '+=280',
            scrub: 1.05,
            invalidateOnRefresh: true
          }
        }, 0)
        .fromTo('.hero-survivor img', {
          willChange: 'transform'
        }, {
          yPercent: 8,
          xPercent: -3,
          scale: .97,
          opacity: .92,
          scrollTrigger: {
            trigger: prologue,
            start: 'top bottom',
            end: '+=220',
            scrub: 1.05,
            invalidateOnRefresh: true
          }
        }, 0)
        .fromTo('.hero-transition .hero-text', {
          clipPath: 'inset(0 32% 0 52%)'
        }, {
          clipPath: 'inset(0 0% 0 0%)',
          scrollTrigger: {
            trigger: prologue,
            start: 'top bottom',
            end: '+=260',
            scrub: 1.05,
            invalidateOnRefresh: true
          }
        }, .05)
        .fromTo('.hero-transition .hero-quote', {
          clipPath: 'inset(0 52% 0 0)'
        }, {
          clipPath: 'inset(0 0% 0 0%)',
          scrollTrigger: {
            trigger: prologue,
            start: 'top bottom',
            end: '+=260',
            scrub: 1.05,
            invalidateOnRefresh: true
          }
        }, .08)
        .fromTo('.hero-transition .hero-key', {
          scale: .78,
          opacity: 0,
          rotation: -12
        }, {
          scale: 1,
          opacity: 1,
          rotation: 0,
          scrollTrigger: {
            trigger: prologue,
            start: 'top bottom',
            end: '+=240',
            scrub: 1.05,
            invalidateOnRefresh: true
          }
        }, .14)
        .fromTo('.hero-transition .hero-chapter', {
          yPercent: 14,
          opacity: 0
        }, {
          yPercent: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: prologue,
            start: 'top bottom',
            end: '+=240',
            scrub: 1.05,
            invalidateOnRefresh: true
          }
        }, .18)
        .fromTo('.hero-transition .hero-crest', {
          scale: .82,
          opacity: 0,
          rotation: -6
        }, {
          scale: 1,
          opacity: .32,
          rotation: 0,
          scrollTrigger: {
            trigger: prologue,
            start: 'top bottom',
            end: '+=240',
            scrub: 1.05,
            invalidateOnRefresh: true
          }
        }, .22)
        .fromTo('.hero-transition .hero-bracket', {
          scaleX: 0
        }, {
          scaleX: 1,
          transformOrigin: 'left center',
          scrollTrigger: {
            trigger: prologue,
            start: 'top bottom',
            end: '+=240',
            scrub: 1.05,
            invalidateOnRefresh: true
          }
        }, .26)
        .fromTo('.hero-transition .hero-shadow', {
          scale: .8,
          opacity: 0
        }, {
          scale: 1,
          opacity: .42,
          scrollTrigger: {
            trigger: prologue,
            start: 'top bottom',
            end: '+=240',
            scrub: 1.05,
            invalidateOnRefresh: true
          }
        }, .3);

    if (!reducedMotion.matches && !mobile.matches && window.gsap && window.ScrollTrigger && prologue) {
      gsap.timeline({
        scrollTrigger: {
          trigger: prologue,
          start: 'top bottom',
          end: '+=1400',
          scrub: 1.15,
          invalidateOnRefresh: true
        }
      })
        .to('.hero-survivor img', {
          yPercent: 14,
          xPercent: -14,
          scale: .78,
          opacity: .14,
          ease: 'none'
        }, 0)
        .to('.master-image', {
          scale: .94,
          ease: 'none'
        }, 0)
        .to('.prologue-rewrite', {
          rotation: gsap.utils.clamp(-.35, .35, (window.innerWidth < 900 ? 0 : -1.4)),
          ease: 'none'
        }, 0)
        .to('.hero-transition .hero-crest', {
          opacity: 0,
          rotation: -10,
          scale: .86,
          ease: 'none'
        }, 0.62)
        .to('.hero-transition .hero-key', {
          rotation: 10,
          opacity: 0,
          scale: .88,
          ease: 'none'
        }, 0.66)
        .to('.hero-transition .hero-text', {
          y: -8,
          opacity: 0.12,
          ease: 'none'
        }, 0.7)
        .to('.hero-transition .hero-fade', {
          opacity: 0.28,
          ease: 'none'
        }, 0.74)
        .to('.hero-transition .hero-overlayer', {
          opacity: 0.2,
          ease: 'none'
        }, 0.8)
        .to('.hero-transition .hero-fill', {
          scaleY: .42,
          ease: 'none'
        }, 0.82)
        .to('.hero-transition .hero-sublayer', {
          opacity: 0,
          y: 14,
          ease: 'none'
        }, 0.86)
        .to('.hero-transition .hero-underscore', {
          scaleX: .2,
          ease: 'none'
        }, 0.9)
        .to('.hero-transition .hero-shadow', {
          opacity: .14,
          scale: .76,
          ease: 'none'
        }, 0.92)
        .to('.hero-transition .hero-bracket', {
          scaleX: .2,
          ease: 'none'
        }, 0.94)
        .to('.hero-transition .hero-chapter', {
          yPercent: -10,
          opacity: 0.26,
          ease: 'none'
        }, 0.94)
        .to('.hero-transition .hero-quote', {
          clipPath: 'inset(0 40% 0 18%)',
          ease: 'none'
        }, 0.94)
        .to('.enter-link span', {
          rotation: 0,
          boxShadow: '0 0 0 1px rgba(255,255,255,.08)',
          opacity: 0.4,
          ease: 'none'
        }, 0.86);
    }
    heroTimeline.scrollTrigger && heroTimeline.scrollTrigger.disable();
  }

  
}, root);

window.ScrollTrigger.refresh();
}

function composeScene(gsap, timeline, scene) {
  const q = (selector) => scene.querySelector(selector);
  const qa = (selector) => scene.querySelectorAll(selector);
  if (scene.id === 'muralla') {
    timeline.fromTo(qa('.wall-strata i'), { xPercent: (index) => index % 2 ? 34 : -34, yPercent: (index) => index % 2 ? -8 : 8, scaleX: .4 }, { xPercent: 0, yPercent: 0, scaleX: 1, stagger: .07, duration: .7 }, 0)
      .fromTo(q('.wall-cut'), { x: -110, clipPath: 'inset(0 38% 0 0)' }, { x: 0, clipPath: 'inset(0 0% 0 0)', duration: .85 }, .06)
      .fromTo(q('.rewrite-detail'), { x: 76, y: -24, clipPath: 'inset(0 0 0 42%)' }, { x: 0, y: 0, clipPath: 'inset(0 0 0 0%)', duration: .6 }, .28)
      .fromTo(q('.perimeter-score i'), { scaleX: 0 }, { scaleX: 1, stagger: .12, transformOrigin: 'left', duration: .55 }, .14)
      .fromTo(q('.strata-breach'), { clipPath: 'inset(0 50% 0 50%)' }, { clipPath: 'inset(0 0% 0 0%)', duration: .5 }, .78)
      .to(q('.chapter-heading'), { x: 42, opacity: .14, duration: .3 }, .88);
  } else if (scene.id === 'puerta') {
    timeline.fromTo(qa('.tunnel-planes i'), { scale: (index) => 1.5 - index * .18, opacity: 0 }, { scale: 1, opacity: .48, stagger: .08, duration: .7 }, 0)
      .fromTo(q('.door-light'), { scale: .2, opacity: 0 }, { scale: 1, opacity: .9, duration: .9 }, 0)
      .fromTo(q('.door-depth'), { scale: 1.22, clipPath: 'inset(18% 28% 0 round 50% 50% 0 0)' }, { scale: 1, clipPath: 'inset(0% 0% 0 round 50% 50% 0 0)', duration: .9 }, .05)
      .fromTo(q('.chapter-heading'), { y: -52, clipPath: 'inset(0 0 55% 0)' }, { y: 0, clipPath: 'inset(0 0 0% 0)', duration: .48 }, .3)
      .fromTo(q('.door-archive'), { x: 52, y: 20, clipPath: 'inset(0 0 0 55%)' }, { x: 0, y: 0, clipPath: 'inset(0 0 0 0%)', duration: .45 }, .48)
      .fromTo(q('.door-emerge'), { clipPath: 'inset(0 50% 0 50%)' }, { clipPath: 'inset(0 0% 0 0%)', duration: .5 }, .84)
      .to(q('.door-depth'), { scale: 1.035, duration: .32 }, .9);
  } else if (scene.id === 'plaza') {
    timeline.fromTo(q('.plaza-opening'), { clipPath: 'circle(5% at 50% 50%)', scale: .88 }, { clipPath: 'circle(72% at 50% 50%)', scale: 1, duration: .75 }, 0)
      .fromTo(qa('.plaza-orbit span'), { x: (index) => [-130, 95, -75, 140][index], y: (index) => [28, -48, 60, -15][index], opacity: 0 }, { x: 0, y: 0, opacity: 1, stagger: .08, duration: .55 }, .12)
      .fromTo(q('.focus-a'), { x: -55, opacity: 0 }, { x: 0, opacity: 1, duration: .4 }, .35)
      .fromTo(q('.focus-b'), { y: 48, opacity: 0 }, { y: 0, opacity: 1, duration: .4 }, .42)
      .fromTo(q('.focus-c'), { x: 55, y: -22, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: .4 }, .49)
      .to(q('.plaza-orbit'), { scale: .95, opacity: .2, duration: .28 }, .9);
  } else if (scene.id === 'catedral') {
    timeline.fromTo(q('.new-layer'), { yPercent: 78, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .72 }, 0)
      .fromTo(q('.old-layer'), { yPercent: -32, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .58 }, .18)
      .fromTo(q('.chapter-heading'), { y: 92, opacity: 0 }, { y: 0, opacity: 1, duration: .56 }, .18)
      .fromTo(q('.cathedral-light'), { scaleY: .15, opacity: 0 }, { scaleY: 1, opacity: .58, transformOrigin: 'top', duration: .85 }, .03)
      .to(q('.old-layer'), { x: -36, opacity: .58, duration: .28 }, .86)
      .to(q('.new-layer'), { x: 34, duration: .28 }, .86);
  } else if (scene.id === 'ayuntamiento') {
    timeline.fromTo(q('.mayorga-dial'), { rotation: -58, scale: .68, opacity: 0 }, { rotation: 0, scale: 1, opacity: 1, duration: .55 }, 0)
      .fromTo(q('.civic-facade'), { scale: .93, opacity: 0 }, { scale: 1, opacity: 1, duration: .38 }, .18)
      .fromTo(q('.mayorga-portrait'), { scale: 1.18, opacity: 0 }, { scale: 1, opacity: 1, duration: .34 }, .4)
      .fromTo(qa('.civic-beats .fact'), { scale: .92, opacity: 0 }, { scale: 1, opacity: 1, stagger: .14, duration: .28 }, .48)
      .to(q('.mayorga-dial i'), { rotation: 80, duration: .32 }, .86);
  } else if (scene.id === 'acueducto') {
    const path = q('.aqueduct-diagonal path');
    const length = path.getTotalLength();
    timeline.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: .82, ease: 'none' }, 0)
      .fromTo(q('.water-window'), { x: 105, y: -62, clipPath: 'inset(0 44% 0 0)' }, { x: 0, y: 0, clipPath: 'inset(0 0% 0 0)', duration: .68 }, .12)
      .fromTo(qa('.water-stations span'), { x: -26, y: 22, opacity: 0 }, { x: 0, y: 0, opacity: 1, stagger: .1, duration: .34 }, .34)
      .fromTo(qa('.hydraulic-notes section'), { x: 42, y: 28, opacity: 0 }, { x: 0, y: 0, opacity: 1, stagger: .09, duration: .35 }, .46)
      .to(q('.aqueduct-diagonal'), { opacity: .18, duration: .3 }, .9);
  } else if (scene.id === 'parque') {
    timeline.fromTo(q('.quiet-photo img'), { scale: 1.055, filter: 'saturate(.72) blur(1px)' }, { scale: 1, filter: 'saturate(1) blur(0px)', duration: .72, ease: 'sine.out' }, 0)
      .fromTo(q('.chapter-heading'), { opacity: 0 }, { opacity: 1, duration: .65 }, .08)
      .fromTo(q('.memory-margin'), { opacity: 0 }, { opacity: 1, duration: .6 }, .25)
      .fromTo(qa('.park-breath i'), { scale: .55, opacity: 0 }, { scale: 1, opacity: .38, stagger: .14, duration: .62 }, .15);
  } else if (scene.id === 'monumento') {
    timeline.fromTo(q('.sculpture-frame'), { scale: .88, opacity: 0 }, { scale: 1, opacity: 1, duration: .58 }, 0)
      .fromTo(q('.chapter-heading'), { y: 30, scale: .94, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: .45 }, .16)
      .fromTo(q('.inscription-dates'), { clipPath: 'inset(0 50% 0 50%)' }, { clipPath: 'inset(0 0% 0 0%)', duration: .52 }, .24)
      .fromTo(qa('.bronze-echo i'), { scale: .4, opacity: 0 }, { scale: 1, opacity: .34, stagger: .1, duration: .5 }, .34)
      .to(q('.chapter-heading'), { letterSpacing: '.01em', duration: .3 }, .86);
  }
}

function observeStatic(chapters) {
  activeObserver?.disconnect();
  activeObserver = new IntersectionObserver((entries) => {
    if (document.body.classList.contains('is-animated')) return;
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) shell.update(visible.target.id);
  }, { rootMargin: '-30% 0px -48% 0px', threshold: [0, .12] });
  chapters.forEach((chapter) => activeObserver.observe(document.getElementById(chapter.id)));
}

function goTo(id) {
  const target = id === 'inicio' ? document.querySelector('#inicio') : document.getElementById(id);
  target?.scrollIntoView({ behavior: shell?.reduced() ? 'auto' : 'smooth', block: 'start' });
}

function footerMarkup() {
  return `<footer class="site-footer"><div><p class="eyebrow">CIERRE · OCHO CAPAS / UNA CIUDAD</p><h2>Ninguna ciudad termina de escribirse.</h2><nav><a href="#inicio">Volver al principio</a><a href="creditos.html">Fuentes y fotografías</a></nav></div></footer>`;
}
