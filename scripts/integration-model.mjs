import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';

const project = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const model = process.argv[2];
const mode = process.argv[3] || 'desktop';
const settings = {
  atlas: ['01-atlas.html', 'js/modelos/atlas.js'],
  cronologia: ['02-cronologia.html', 'js/modelos/cronologia.js'],
  reescritura: ['03-reescritura.html', 'js/modelos/reescritura.js']
};

if (!settings[model]) throw new Error(`Modelo desconocido: ${model}`);
const [htmlFile, moduleFile] = settings[model];
const html = await readFile(resolve(project, htmlFile), 'utf8');
const dom = new JSDOM(html, {
  url: `http://plasencia.local/${htmlFile}`,
  pretendToBeVisual: true,
  runScripts: 'outside-only'
});
const { window } = dom;
const errors = [];
const originalError = console.error;
console.error = (...args) => errors.push(args.map(String).join(' '));

Object.assign(global, {
  window,
  document: window.document,
  location: window.location,
  history: window.history,
  localStorage: window.localStorage,
  HTMLElement: window.HTMLElement,
  HTMLDialogElement: window.HTMLDialogElement,
  Event: window.Event,
  CustomEvent: window.CustomEvent,
  requestAnimationFrame: (callback) => setTimeout(callback, 0),
  cancelAnimationFrame: clearTimeout,
  addEventListener: window.addEventListener.bind(window),
  removeEventListener: window.removeEventListener.bind(window)
});
Object.defineProperty(global, 'navigator', { value: window.navigator, configurable: true });

window.matchMedia = global.matchMedia = (query) => ({
  matches: mode === 'reduced' ? query.includes('prefers-reduced-motion') : mode === 'mobile' && query.includes('max-width'),
  media: query,
  addEventListener() {},
  removeEventListener() {}
});
window.scrollTo = () => {};
window.HTMLElement.prototype.scrollIntoView = () => {};
Object.defineProperty(window.document, 'fonts', { value: { ready: Promise.resolve() } });

class Observer {
  observe() {}
  disconnect() {}
}
window.IntersectionObserver = global.IntersectionObserver = Observer;

window.HTMLDialogElement.prototype.showModal = function showModal() {
  this.open = true;
  this.setAttribute('open', '');
};
window.HTMLDialogElement.prototype.close = function close() {
  this.open = false;
  this.removeAttribute('open');
};

global.fetch = async (input) => {
  const url = new URL(String(input), window.location.href);
  const local = resolve(project, url.pathname.replace(/^\//, ''));
  try {
    const body = await readFile(local);
    const type = local.endsWith('.json') ? 'application/json' : 'application/octet-stream';
    return new Response(body, { status: 200, headers: { 'content-type': type } });
  } catch {
    return new Response('Not found', { status: 404 });
  }
};

await import(`${pathToFileURL(resolve(project, moduleFile)).href}?integration=${Date.now()}`);
await new Promise((resolveTick) => setTimeout(resolveTick, 30));

const assert = (condition, message) => {
  if (!condition) throw new Error(`${model}: ${message}`);
};

const chapters = [...document.querySelectorAll('[data-chapter]')];
const chapterData = JSON.parse(await readFile(resolve(project, 'data/chapters.json'), 'utf8'));
assert(chapters.length === 8, `se esperaban 8 capítulos y se obtuvieron ${chapters.length}`);
assert(new Set(chapters.map(({ id }) => id)).size === 8, 'hay identificadores de capítulo duplicados');
chapters.forEach((chapter, index) => {
  const factual = chapterData[index];
  assert(chapter.querySelector('.chapter-heading'), `${chapter.id} no tiene cabecera`);
  assert(chapter.querySelectorAll('[data-fact]').length === 3, `${chapter.id} no contiene tres bloques históricos`);
  assert(chapter.querySelector('.chapter-photo img'), `${chapter.id} no contiene fotografía`);
  assert(chapter.querySelector('[data-story]'), `${chapter.id} no abre su archivo editorial`);
  assert(chapter.querySelector('.chapter-transition'), `${chapter.id} no tiene transición narrativa`);
  assert(chapter.textContent.includes(factual.title) && chapter.textContent.includes(factual.intro), `${chapter.id} no consume título e introducción centrales`);
  factual.sections.forEach(([heading, text]) => assert(chapter.textContent.includes(heading) && chapter.textContent.includes(text), `${chapter.id} altera un bloque factual central`));
});

assert(document.querySelectorAll('dialog').length === 3, 'el motor común no generó sus tres diálogos');
assert(!document.querySelector('.error-panel'), 'la inicialización mostró un panel de error');
const identifiers = [...document.querySelectorAll('[id]')].map((element) => element.id);
assert(identifiers.length === new Set(identifiers).size, 'hay identificadores HTML duplicados');
assert(document.documentElement.lang === 'es' && document.querySelectorAll('h1').length === 1, 'idioma o jerarquía principal incorrectos');
assert([...document.images].every((image) => image.closest('.lightbox-dialog') || (image.hasAttribute('alt') && image.alt.trim())), 'hay imágenes narrativas sin alternativa textual');
assert([...document.querySelectorAll('button')].every((button) => button.textContent.trim() || button.getAttribute('aria-label')), 'hay botones sin nombre accesible');
assert([...document.querySelectorAll('a[target="_blank"]')].every((link) => link.rel.includes('noopener')), 'hay enlaces externos sin aislamiento');

const storyOpener = document.querySelector('[data-story="muralla"]');
storyOpener.focus();
storyOpener.click();
await new Promise((resolveTick) => setTimeout(resolveTick, 10));
const editorial = document.querySelector('#editorial-dialog');
assert(editorial.open, 'Efecto2.0 no se abrió');
assert(editorial.querySelector('.layout-muralla'), 'Efecto2.0 no aplicó el layout de Muralla');
assert(editorial.querySelectorAll('.editorial-copy').length >= 3, 'Efecto2.0 no contiene la ampliación histórica');
editorial.dispatchEvent(new window.Event('cancel', { bubbles: false, cancelable: true }));
await new Promise((resolveTick) => setTimeout(resolveTick, 10));
assert(!editorial.open, 'Escape/cancel no cerró Efecto2.0');
assert(document.activeElement === storyOpener, 'el foco no volvió al elemento de origen');

const photoOpener = document.querySelector('[data-photo]');
assert(photoOpener, 'no existe fotografía secundaria ampliable');
photoOpener.click();
await new Promise((resolveTick) => setTimeout(resolveTick, 10));
const lightbox = document.querySelector('#lightbox-dialog');
assert(lightbox.open && lightbox.querySelector('img').getAttribute('src') && lightbox.querySelector('img').alt.trim(), 'el lightbox no cargó la fotografía o su alternativa');
lightbox.querySelector('[data-dialog-close]').click();

document.querySelector('#chapters-open').click();
assert(document.querySelector('#chapters-dialog').open, 'el índice de capítulos no se abrió');
document.querySelector('#chapters-dialog [data-dialog-close]').click();

const motionButton = document.querySelector('#motion-toggle');
const previousMotionState = document.body.classList.contains('motion-reduced');
motionButton.click();
assert(document.body.classList.contains('motion-reduced') !== previousMotionState, 'el control de movimiento reducido no cambió de estado');
assert(errors.length === 0, `se registraron errores de consola: ${errors.join(' | ')}`);

console.error = originalError;
console.log(`✓ ${model}/${mode}: render, hechos comunes, 8 capítulos, Efecto2.0, Escape, foco, lightbox e índice`);
dom.window.close();
