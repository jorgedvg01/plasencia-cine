import { photoFigure, externalLink, escapeHTML, mediaCaption } from './markup.js';
import { models } from '../../data/presentation.js';

const focusableSelector = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export function initShell({ data, model, goTo, onMotionChange }) {
  const modelInfo = models[model];
  let current = null;
  let scrollLock = null;
  let lightboxItems = [];
  let lightboxIndex = 0;
  let editorialContext = null;
  const mediaQuery = matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = mediaQuery.matches || localStorage.getItem('plasencia-motion') === 'reduced';

  document.body.insertAdjacentHTML('beforeend', shellMarkup(data, modelInfo));
  const rail = document.querySelector('.chapter-rail');
  const chaptersDialog = document.querySelector('#chapters-dialog');
  const editorialDialog = document.querySelector('#editorial-dialog');
  const lightboxDialog = document.querySelector('#lightbox-dialog');
  const motionButton = document.querySelector('#motion-toggle');

  const syncMotionLabel = () => {
    document.body.classList.toggle('motion-reduced', reduced);
    motionButton.textContent = reduced ? 'Activar movimiento' : 'Modo lectura';
    motionButton.setAttribute('aria-pressed', String(reduced));
  };

  const setReduced = (value, persist = true) => {
    reduced = value;
    if (persist) localStorage.setItem('plasencia-motion', value ? 'reduced' : 'active');
    syncMotionLabel();
    onMotionChange?.(value);
  };

  const lockPage = () => {
    if (scrollLock !== null) return;
    scrollLock = window.scrollY;
    Object.assign(document.body.style, { position: 'fixed', top: `-${scrollLock}px`, width: '100%' });
    document.body.classList.add('dialog-open');
  };

  const unlockPage = () => {
    if ([...document.querySelectorAll('dialog')].some((dialog) => dialog.open)) return;
    const restore = scrollLock ?? 0;
    Object.assign(document.body.style, { position: '', top: '', width: '' });
    document.body.classList.remove('dialog-open');
    scrollLock = null;
    window.scrollTo(0, restore);
  };

  const openDialog = (dialog, opener) => {
    dialog._opener = opener || document.activeElement;
    lockPage();
    dialog.showModal();
    requestAnimationFrame(() => dialog.querySelector(focusableSelector)?.focus({ preventScroll: true }));
  };

  const closeDialog = (dialog) => {
    if (!dialog.open) return;
    if (dialog === editorialDialog) {
      editorialContext?.revert();
      editorialContext = null;
    }
    dialog.close();
    const opener = dialog._opener;
    requestAnimationFrame(() => {
      unlockPage();
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    });
  };

  document.querySelector('#chapters-open').addEventListener('click', (event) => openDialog(chaptersDialog, event.currentTarget));
  motionButton.addEventListener('click', () => setReduced(!reduced));
  mediaQuery.addEventListener('change', (event) => setReduced(event.matches, false));
  syncMotionLabel();

  document.addEventListener('click', (event) => {
    const closer = event.target.closest('[data-dialog-close]');
    if (closer) {
      closeDialog(closer.closest('dialog'));
      return;
    }
    const story = event.target.closest('[data-story]');
    if (story) {
      openStory(story.dataset.story, story);
      return;
    }
    const photo = event.target.closest('[data-photo]');
    if (photo) {
      openLightbox(photo.dataset.photo, photo);
      return;
    }
    const chapterLink = event.target.closest('[data-chapter-link]');
    if (chapterLink) {
      event.preventDefault();
      const id = chapterLink.dataset.chapterLink;
      const closingIndex = chaptersDialog.open;
      if (closingIndex) closeDialog(chaptersDialog);
      history.replaceState(null, '', `#${id}`);
      window.setTimeout(() => goTo(id), closingIndex ? 160 : 0);
    }
  });

  [...document.querySelectorAll('dialog')].forEach((dialog) => {
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      closeDialog(dialog);
    });
    dialog.addEventListener('keydown', (event) => trapFocus(event, dialog));
  });

  lightboxDialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') showLightboxItem(lightboxIndex - 1);
    if (event.key === 'ArrowRight') showLightboxItem(lightboxIndex + 1);
  });
  let touchStartX = null;
  lightboxDialog.addEventListener('touchstart', (event) => { touchStartX = event.changedTouches[0].clientX; }, { passive: true });
  lightboxDialog.addEventListener('touchend', (event) => {
    if (touchStartX === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 45) showLightboxItem(lightboxIndex + (delta < 0 ? 1 : -1));
    touchStartX = null;
  }, { passive: true });
  lightboxDialog.querySelector('[data-lightbox-prev]').addEventListener('click', () => showLightboxItem(lightboxIndex - 1));
  lightboxDialog.querySelector('[data-lightbox-next]').addEventListener('click', () => showLightboxItem(lightboxIndex + 1));

  const editorialScroll = editorialDialog.querySelector('.editorial-scroll');
  editorialScroll.addEventListener('scroll', () => {
    const range = editorialScroll.scrollHeight - editorialScroll.clientHeight;
    const progress = range > 0 ? editorialScroll.scrollTop / range : 0;
    editorialDialog.querySelector('.editorial-progress i').style.transform = `scaleX(${progress})`;
  }, { passive: true });

  const update = (id) => {
    if (current === id) return;
    current = id;
    const index = data.chapters.findIndex((chapter) => chapter.id === id);
    rail.style.setProperty('--progress', index < 0 ? 0 : index / (data.chapters.length - 1));
    rail.querySelectorAll('[data-chapter-link]').forEach((link) => {
      if (link.dataset.chapterLink === id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    document.querySelector('.chapter-status').textContent = index < 0
      ? 'Inicio'
      : `${index + 1} de ${data.chapters.length}: ${data.chapters[index].name}`;
    document.body.dataset.current = id;
  };

  const onWindowScroll = () => document.body.dataset.scrolled = String(window.scrollY > 40);
  addEventListener('scroll', onWindowScroll, { passive: true });
  onWindowScroll();
  update('inicio');

  if (location.hash && data.chapters.some((chapter) => `#${chapter.id}` === location.hash)) {
    window.setTimeout(() => goTo(location.hash.slice(1)), 180);
  }

  return { update, reduced: () => reduced, setReduced, openStory };

  function showLightboxItem(index) {
    if (!lightboxItems.length) return;
    lightboxIndex = (index + lightboxItems.length) % lightboxItems.length;
    const item = data.media[lightboxItems[lightboxIndex]];
    const image = lightboxDialog.querySelector('img');
    image.src = item.src;
    image.alt = item.alt;
    lightboxDialog.querySelector('.lightbox-caption p').innerHTML = mediaCaption(item);
    lightboxDialog.querySelector('.lightbox-count').textContent = `${lightboxIndex + 1} / ${lightboxItems.length}`;
    lightboxDialog.querySelector('.lightbox-nav').hidden = lightboxItems.length < 2;
  }

  function openLightbox(mediaId, opener) {
    const chapterId = editorialDialog.dataset.chapter || current;
    const chapter = data.chapters.find((item) => item.id === chapterId);
    lightboxItems = chapter?.gallery?.length ? [...chapter.gallery] : [mediaId];
    if (!lightboxItems.includes(mediaId)) lightboxItems.unshift(mediaId);
    lightboxIndex = Math.max(0, lightboxItems.indexOf(mediaId));
    showLightboxItem(lightboxIndex);
    openDialog(lightboxDialog, opener);
  }

  function openStory(id, opener) {
    const chapter = data.chapters.find((item) => item.id === id);
    if (!chapter) return;
    editorialDialog.dataset.chapter = id;
    editorialDialog.dataset.layout = chapter.editorialLayout;
    editorialDialog.querySelector('.editorial-scroll').innerHTML = renderEditorial(data, chapter);
    editorialDialog.querySelector('.editorial-scroll').scrollTop = 0;
    editorialDialog.querySelector('.editorial-progress i').style.transform = 'scaleX(0)';
    openDialog(editorialDialog, opener);
    editorialContext?.revert();
    editorialContext = animateEditorial(editorialDialog, reduced);
  }
}

function shellMarkup(data, modelInfo) {
  const links = data.chapters.map((chapter, index) => `
    <a href="#${escapeHTML(chapter.id)}" data-chapter-link="${escapeHTML(chapter.id)}" aria-label="${index + 1}. ${escapeHTML(chapter.name)}, ${escapeHTML(chapter.shortEra)}">
      <small>${String(index + 1).padStart(2, '0')}</small><span>${escapeHTML(chapter.name)}</span><em>${escapeHTML(chapter.shortEra)}</em>
    </a>`).join('');
  const railLinks = data.chapters.map((chapter, index) => `<a href="#${escapeHTML(chapter.id)}" data-chapter-link="${escapeHTML(chapter.id)}" title="${escapeHTML(chapter.name)}"><span>${String(index + 1).padStart(2, '0')}</span></a>`).join('');
  return `
    <nav class="chapter-rail" aria-label="Capítulos"><a href="#inicio" data-chapter-link="inicio" title="Inicio">⌂</a><div class="rail-progress" aria-hidden="true"><i></i></div>${railLinks}</nav>
    <p class="chapter-status sr-only" aria-live="polite">Inicio</p>
    <dialog class="chapters-dialog" id="chapters-dialog" aria-labelledby="chapters-title">
      <div class="dialog-head"><p id="chapters-title">${escapeHTML(modelInfo.label)} · capítulos</p><button class="dialog-close" type="button" data-dialog-close>Cerrar ×</button></div>
      <nav class="chapters-grid" aria-label="Índice de capítulos">${links}</nav>
    </dialog>
    <dialog class="editorial-dialog" id="editorial-dialog" aria-labelledby="editorial-title">
      <div class="editorial-toolbar">
        <p>ARCHIVO EDITORIAL VIVO <span>· interpretación contemporánea</span></p>
        <button class="dialog-close" type="button" data-dialog-close>Volver al recorrido ×</button>
        <div class="editorial-progress" aria-hidden="true"><i></i></div>
      </div>
      <div class="editorial-scroll" tabindex="0"></div>
    </dialog>
    <dialog class="lightbox-dialog" id="lightbox-dialog" aria-label="Fotografía ampliada">
      <div class="lightbox-inner">
        <div class="dialog-head"><p>FOTOGRAFÍA DOCUMENTAL · <span class="lightbox-count"></span></p><button class="dialog-close" type="button" data-dialog-close>Cerrar ×</button></div>
        <div class="lightbox-media"><img alt=""></div>
        <div class="lightbox-caption"><p></p><div class="lightbox-nav"><button type="button" data-lightbox-prev aria-label="Fotografía anterior">←</button><button type="button" data-lightbox-next aria-label="Fotografía siguiente">→</button></div></div>
      </div>
    </dialog>`;
}

function trapFocus(event, dialog) {
  if (event.key !== 'Tab') return;
  const items = [...dialog.querySelectorAll(focusableSelector)].filter((element) => !element.hidden && element.offsetParent !== null);
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function archiveEntries(chapter) {
  if (!chapter.archives.length) return '<p class="archive-empty">No se reproduce una imagen histórica sin condiciones de uso cerradas. Las referencias disponibles se enlazan en las fuentes.</p>';
  return chapter.archives.map(([label, url, note]) => `<article class="archive-entry">${externalLink(url, label)}<p>${escapeHTML(note)}</p><small>Registro enlazado; la digitalización no se presenta aquí como recurso autorizado.</small></article>`).join('');
}

function timeline(chapter, className = '') {
  return `<ol class="editorial-timeline ${className}">${chapter.milestones.map(([date, text]) => `<li><strong>${escapeHTML(date)}</strong><p>${escapeHTML(text)}</p></li>`).join('')}</ol>`;
}

function editorialSources(chapter) {
  return `<footer class="editorial-sources"><p class="editorial-label">Fuentes y límites</p><div>${chapter.sources.map(([label, url]) => externalLink(url, label)).join('')}</div><p>${escapeHTML(chapter.note)}</p></footer>`;
}

function gallery(data, chapter) {
  return `<section class="editorial-gallery" aria-labelledby="gallery-${chapter.id}"><p class="editorial-label">Galería documental</p><h3 id="gallery-${chapter.id}">Mirar el lugar.</h3><div class="gallery-strip">${chapter.gallery.map((id) => photoFigure(data, id, { credit: true })).join('')}</div></section>`;
}

function section(chapter, index, className = '') {
  const [heading, text] = chapter.sections[index];
  return `<section class="editorial-copy ${className}"><p class="editorial-label">${String(index + 1).padStart(2, '0')}</p><h3>${escapeHTML(heading)}</h3><p>${escapeHTML(text)}</p></section>`;
}

function renderEditorial(data, chapter) {
  const layouts = {
    muralla: () => `<article class="editorial-sheet layout-muralla">
      <header class="editorial-hero"><p class="editorial-label">DOSSIER FUNDACIONAL Y DEFENSIVO · ${escapeHTML(chapter.era)}</p><h2 id="editorial-title">${escapeHTML(chapter.title)}</h2><p class="editorial-deck">${escapeHTML(chapter.intro)}</p></header>
      <div class="wall-ledger">${timeline(chapter, 'timeline-horizontal')}<p>${escapeHTML(chapter.question)}</p></div>
      ${photoFigure(data, chapter.id, { className: 'editorial-lead' })}
      <div class="wall-copy">${section(chapter, 0)}${section(chapter, 1)}${section(chapter, 2)}</div>
      <aside class="archive-band"><p class="editorial-label">Archivo y cautelas</p>${archiveEntries(chapter)}</aside>
      ${gallery(data, chapter)}${editorialSources(chapter)}
    </article>`,
    puerta: () => `<article class="editorial-sheet layout-puerta">
      <header class="threshold-title"><p class="editorial-label">FICHA DE TRANSFORMACIÓN · EXTERIOR / PASO / INTERIOR</p><h2 id="editorial-title">${escapeHTML(chapter.name)}</h2><p>${escapeHTML(chapter.question)}</p></header>
      <div class="threshold-current">${photoFigure(data, chapter.id, { className: 'editorial-lead' })}<span aria-hidden="true">AHORA</span></div>
      <div class="threshold-archive"><p class="editorial-label">${escapeHTML(chapter.milestones[2][0])} · REGISTRO DE ARCHIVO</p>${archiveEntries(chapter)}</div>
      <div class="threshold-passage"><p>${escapeHTML(chapter.intro)}</p>${timeline(chapter)}</div>
      <div class="threshold-copy">${section(chapter, 0, 'outside')}${section(chapter, 1, 'passage')}${section(chapter, 2, 'inside')}</div>
      ${gallery(data, chapter)}${editorialSources(chapter)}
    </article>`,
    plaza: () => `<article class="editorial-sheet layout-plaza">
      <header class="plaza-mast"><p class="editorial-label">ÁLBUM URBANO · MERCADO / SOPORTALES / VECINDAD</p><h2 id="editorial-title">${escapeHTML(chapter.title)}</h2><p>${escapeHTML(chapter.intro)}</p></header>
      ${photoFigure(data, chapter.id, { className: 'plaza-lead' })}
      <blockquote>${escapeHTML(chapter.question)}</blockquote>
      <div class="plaza-columns">${section(chapter, 0)}${section(chapter, 1)}${section(chapter, 2)}</div>
      <aside class="plaza-archive">${timeline(chapter)}${archiveEntries(chapter)}</aside>
      ${gallery(data, chapter)}${editorialSources(chapter)}
    </article>`,
    catedral: () => `<article class="editorial-sheet layout-catedral">
      <header class="cathedral-mast"><p class="editorial-label">DOSSIER ARTÍSTICO · DOS CATEDRALES</p><h2 id="editorial-title">${escapeHTML(chapter.title)}</h2><p>${escapeHTML(chapter.intro)}</p></header>
      <div class="cathedral-diptych"><div class="cathedral-old"><span>${escapeHTML(chapter.milestones[0][0])} · CATEDRAL VIEJA</span>${section(chapter, 0)}</div><div class="cathedral-new"><span>${escapeHTML(chapter.milestones[1][0])} · CATEDRAL NUEVA</span>${photoFigure(data, 'catedral', { className: 'editorial-lead' })}${section(chapter, 1)}</div></div>
      <div class="cathedral-craft">${photoFigure(data, 'catedral-entorno')}${section(chapter, 2)}</div>
      ${timeline(chapter, 'timeline-vertical')}<aside class="cathedral-archive">${archiveEntries(chapter)}</aside>
      ${gallery(data, chapter)}${editorialSources(chapter)}
    </article>`,
    ayuntamiento: () => `<article class="editorial-sheet layout-ayuntamiento">
      <header class="gazette-head"><p class="editorial-label">GACETA MUNICIPAL CONTEMPORÁNEA</p><h2 id="editorial-title">${escapeHTML(chapter.name)}</h2><p>${escapeHTML(chapter.intro)}</p></header>
      <div class="gazette-date"><strong>${escapeHTML(chapter.milestones[1][0])}</strong><span>REGISTRO<br>DE ARCHIVO</span></div>
      ${photoFigure(data, 'ayuntamiento', { className: 'gazette-building' })}
      ${photoFigure(data, 'mayorga', { className: 'gazette-mayorga' })}
      <div class="gazette-copy">${section(chapter, 0)}${section(chapter, 1)}${section(chapter, 2)}</div>
      <aside class="gazette-timeline">${timeline(chapter)}${archiveEntries(chapter)}</aside>
      ${gallery(data, chapter)}${editorialSources(chapter)}
    </article>`,
    acueducto: () => `<article class="editorial-sheet layout-acueducto">
      <header class="technical-head"><p class="editorial-label">LÁMINA TÉCNICA EDITORIAL · ESQUEMA MODERNO, NO PLANO HISTÓRICO</p><h2 id="editorial-title">${escapeHTML(chapter.name)}</h2><p>${escapeHTML(chapter.intro)}</p></header>
      <div class="water-schematic" aria-hidden="true"><span>CAPTACIÓN</span><i></i><span>CONDUCCIÓN</span><i></i><span>ARQUERÍA</span></div>
      ${photoFigure(data, chapter.id, { className: 'technical-photo' })}
      <div class="technical-notes">${chapter.sections.map(([heading, text], index) => `<section><b>${String(index + 1).padStart(2, '0')}</b><div><h3>${escapeHTML(heading)}</h3><p>${escapeHTML(text)}</p></div></section>`).join('')}</div>
      ${timeline(chapter, 'timeline-pipe')}${gallery(data, chapter)}${editorialSources(chapter)}
    </article>`,
    parque: () => `<article class="editorial-sheet layout-parque">
      <header class="memory-head"><p class="editorial-label">ENSAYO FOTOGRÁFICO Y ARCHIVO DE MEMORIA</p><h2 id="editorial-title">${escapeHTML(chapter.title)}</h2><p>${escapeHTML(chapter.intro)}</p></header>
      ${photoFigure(data, chapter.id, { className: 'memory-photo' })}
      <p class="memory-pause">${escapeHTML(chapter.question)}</p>
      <div class="memory-copy">${section(chapter, 0)}<aside><strong>Memoria histórica</strong><p>El tratamiento editorial evita convertir el trabajo forzado y la represión en decoración o espectáculo.</p></aside>${section(chapter, 1)}${section(chapter, 2)}</div>
      ${timeline(chapter, 'timeline-memory')}${gallery(data, chapter)}${editorialSources(chapter)}
    </article>`,
    monumento: () => `<article class="editorial-sheet layout-monumento">
      <header class="sculpture-head"><p class="editorial-label">ARCHIVO CONTEMPORÁNEO DE LA ESCULTURA</p><h2 id="editorial-title">${escapeHTML(chapter.name)}</h2><p>${escapeHTML(chapter.intro)}</p></header>
      <div class="sculpture-dates"><div><strong>${escapeHTML(chapter.milestones[0][0])}</strong><span>${escapeHTML(chapter.milestones[0][1])}</span></div><i aria-hidden="true"></i><div><strong>${escapeHTML(chapter.milestones[1][0])}</strong><span>${escapeHTML(chapter.milestones[1][1])}</span></div></div>
      ${photoFigure(data, chapter.id, { className: 'sculpture-photo' })}
      <div class="sculpture-copy">${section(chapter, 0)}${section(chapter, 1)}${section(chapter, 2)}</div>
      ${timeline(chapter, 'timeline-sculpture')}${gallery(data, chapter)}${editorialSources(chapter)}
    </article>`
  };
  return (layouts[chapter.id] || layouts.muralla)();
}

function animateEditorial(dialog, reduced) {
  const scroller = dialog.querySelector('.editorial-scroll');
  if (reduced || !window.gsap || !window.ScrollTrigger) return null;
  return window.gsap.context(() => {
    dialog.querySelectorAll('.editorial-copy,.archive-entry,.editorial-timeline li').forEach((element, index) => {
      const directions = [{ x: -22 }, { y: 18 }, { x: 22 }, { y: -14 }];
      window.gsap.fromTo(element, { ...directions[index % directions.length], opacity: 0 }, {
        x: 0, y: 0, opacity: 1, duration: .7, ease: 'power2.out',
        scrollTrigger: { trigger: element, scroller, start: 'top 92%', once: true }
      });
    });
    dialog.querySelectorAll('.chapter-photo img').forEach((image) => {
      window.gsap.fromTo(image, { scale: 1.045 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: image.closest('figure'), scroller, start: 'top bottom', end: 'bottom top', scrub: .4 }
      });
    });
  }, dialog);
}
