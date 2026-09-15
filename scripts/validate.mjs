import { createHash } from 'node:crypto';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const passes = [];
const expectedOrder = ['muralla', 'puerta', 'plaza', 'catedral', 'ayuntamiento', 'acueducto', 'parque', 'monumento'];
const modelFiles = ['js/modelos/atlas.js', 'js/modelos/cronologia.js', 'js/modelos/reescritura.js'];
const modelStyles = ['css/atlas.css', 'css/cronologia.css', 'css/reescritura.css'];

function luminance(hex) {
  const channels = hex.slice(1).match(/.{2}/g).map((value) => parseInt(value, 16) / 255).map((value) => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrast(foreground, background) {
  const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

function imageDimensions(file) {
  const buffer = readFileSync(file);
  if (buffer.subarray(1, 4).toString() === 'PNG') return [buffer.readUInt32BE(16), buffer.readUInt32BE(20)];
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset < buffer.length) {
      if (buffer[offset] !== 0xff) { offset += 1; continue; }
      const marker = buffer[offset + 1];
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
        return [buffer.readUInt16BE(offset + 7), buffer.readUInt16BE(offset + 5)];
      }
      if (marker === 0xd8 || marker === 0xd9) { offset += 2; continue; }
      offset += 2 + buffer.readUInt16BE(offset + 2);
    }
  }
  return null;
}

function check(condition, label, detail = '') {
  (condition ? passes : failures).push({ label, detail });
}

function read(relative) {
  return readFileSync(resolve(root, relative), 'utf8');
}

function json(relative) {
  return JSON.parse(read(relative));
}

const required = [
  'index.html', '01-atlas.html', '02-cronologia.html', '03-reescritura.html', 'creditos.html',
  'data/chapters.json', 'data/media.json', 'data/sources.json', 'data/presentation.js',
  'js/common/data.js', 'js/common/shell.js', 'js/common/markup.js', ...modelFiles,
  'css/common.css', 'css/editorial.css', 'css/fonts.css', ...modelStyles,
  'assets/base-4k.png', 'vendor/gsap.min.js', 'vendor/ScrollTrigger.min.js',
  'documentacion/MATRIZ_24_TRATAMIENTOS.md', 'documentacion/PROMPT_APLICADO.md',
  'documentacion/MATRIZ_CUMPLIMIENTO.md', 'documentacion/COMPARACION_CRUZADA.md', 'documentacion/CAMBIOS.md', 'documentacion/PRUEBAS.md',
  'README.md', 'servidor.py', 'ABRIR_PLASENCIA.bat'
];
required.forEach((file) => check(existsSync(resolve(root, file)), `Existe ${file}`));

const chapters = json('data/chapters.json');
const media = json('data/media.json');
const sources = json('data/sources.json');
check(chapters.length === 8, 'La base factual contiene ocho capítulos', `detectados: ${chapters.length}`);
check(JSON.stringify(chapters.map(({ id }) => id)) === JSON.stringify(expectedOrder), 'El orden histórico-editorial coincide con el prompt');
chapters.forEach((chapter) => {
  const complete = ['name', 'era', 'title', 'brief', 'question', 'intro', 'transition', 'note'].every((field) => String(chapter[field] || '').trim())
    && chapter.sections?.length >= 3 && chapter.milestones?.length >= 3 && chapter.sources?.length >= 1;
  check(complete, `Contenido principal suficiente: ${chapter.id}`);
  check(chapter.sources.every((entry) => /^https:\/\//.test(entry[1])), `Fuentes HTTPS: ${chapter.id}`);
});

const mediaIds = new Set(media.map(({ id }) => id));
check(mediaIds.size === media.length && media.length >= 8, 'Catálogo fotográfico único y sin identificadores duplicados', `recursos: ${media.length}`);
media.forEach((item) => {
  check(existsSync(resolve(root, item.src)), `Existe fotografía ${item.id}`, item.src);
  check(['alt', 'author', 'date', 'license', 'source', 'changes'].every((field) => String(item[field] || '').trim()), `Metadatos completos: ${item.id}`);
  check(/^https:\/\//.test(item.source), `Procedencia HTTPS: ${item.id}`);
  const measured = imageDimensions(resolve(root, item.src));
  check(JSON.stringify(measured) === JSON.stringify(item.dimensions), `Dimensiones locales verificadas: ${item.id}`, measured?.join('×'));
});
check(sources.length >= 8 && sources.every((source) => /^https:\/\//.test(source.url)), 'Índice común de fuentes válido', `fuentes: ${sources.length}`);

const presentation = read('data/presentation.js');
expectedOrder.forEach((id) => check(new RegExp(`\\b${id}: \\[`).test(presentation), `Galería declarada: ${id}`));
check((presentation.match(/:\s*'(dossier-defensivo|ficha-umbral|album-urbano|diptico-artistico|gaceta-civica|lamina-tecnica|ensayo-memoria|archivo-escultura)'/g) || []).length === 8, 'Ocho layouts editoriales declarados');

modelFiles.forEach((file) => {
  const code = read(file);
  expectedOrder.forEach((id) => check(new RegExp(`\\n\\s{4}${id}: \\(`).test(code), `${file}: tratamiento propio de ${id}`));
  check(code.includes('loadPlasenciaData()'), `${file}: consume la base factual común`);
  check(code.includes('prefers-reduced-motion') || code.includes('shell.reduced()'), `${file}: integra movimiento reducido`);
  const palettes = [...code.matchAll(/--chapter-paper:(#[0-9a-f]{6});--chapter-ink:(#[0-9a-f]{6})/gi)];
  check(palettes.length === 8, `${file}: ocho superficies cromáticas verificables`, `paletas: ${palettes.length}`);
  palettes.forEach(([, paper, ink], index) => {
    const ratio = contrast(ink, paper);
    check(ratio >= 4.5, `${file}: contraste sólido ${expectedOrder[index]}`, `${ratio.toFixed(2)}:1`);
  });
  const movementKinds = [' x:', ' y:', 'scale:', 'clipPath:', 'opacity:', 'rotation:', 'strokeDashoffset:'].filter((token) => code.includes(token));
  check(movementKinds.length >= 5, `${file}: variedad de trayectorias y propiedades`, movementKinds.join(' '));
});

const atlasCode = read('js/modelos/atlas.js');
const chronoCode = read('js/modelos/cronologia.js');
const rewriteCode = read('js/modelos/reescritura.js');
check(chronoCode.includes("id: 'cronologia-global'") && chronoCode.includes("pin: '.chrono-window'"), 'Solo Cronología declara el transporte horizontal global');
check(!atlasCode.includes("pin: '.chrono-window'") && !rewriteCode.includes("pin: '.chrono-window'"), 'Atlas y Reescritura no heredan el pin horizontal global');
check(chronoCode.includes("x: () => -(index + 1) * window.innerWidth"), 'Cronología traduce scroll vertical en transporte horizontal');
check(!/addEventListener\(['\"]wheel/.test(modelFiles.map(read).join('\n')), 'No se intercepta la rueda del ratón');
check(!/(1186|1196|1201|1498|1930|1937|1995)/.test(modelFiles.map(read).join('\n')), 'Los modelos no duplican manualmente las fechas históricas');
check(atlasCode.includes('.aqueduct-route path') && rewriteCode.includes('.aqueduct-diagonal path'), 'Efecto1.0 aparece localmente con función hidráulica');

const shell = read('js/common/shell.js');
expectedOrder.forEach((id) => check(shell.includes(`${id}: () =>`), `Efecto2.0 tiene DOM propio: ${id}`));
check(shell.includes("dialog.addEventListener('cancel'") && shell.includes('trapFocus') && shell.includes('opener.focus'), 'Motor editorial: Escape, trampa y retorno de foco');
check(shell.includes("lightboxDialog.addEventListener('touchstart'") && shell.includes("event.key === 'ArrowLeft'"), 'Lightbox táctil y por teclado');
check(shell.includes('scrollLock') && shell.includes('window.scrollTo'), 'Apertura editorial restaura el scroll');

const editorialCSS = read('css/editorial.css');
expectedOrder.forEach((id) => check(editorialCSS.includes(`.layout-${id}`), `Retícula editorial específica: ${id}`));
modelStyles.forEach((file) => {
  const css = read(file);
  check(css.includes('@media (max-width:900px)') || css.includes('@media (max-width: 900px)'), `${file}: adaptación móvil`);
});
const allCSS = ['css/common.css', 'css/editorial.css', ...modelStyles].map(read).join('\n');
check(allCSS.includes('prefers-reduced-motion'), 'CSS conserva una variante de movimiento reducido');
check(!allCSS.includes('overflow-x:visible'), 'No se fuerza overflow horizontal visible');

const fontsCSS = read('css/fonts.css');
const families = new Set([...fontsCSS.matchAll(/font-family:\s*['"]([^'"]+)/g)].map((match) => match[1]));
check(families.size >= 3 && families.size <= 4, 'Sistema tipográfico coherente de 3–4 familias', [...families].join(', '));

const matrix = read('documentacion/MATRIZ_24_TRATAMIENTOS.md');
const matrixRows = (matrix.match(/^\| (Muralla|Puerta del Sol|Plaza Mayor|Catedral|Ayuntamiento y Mayorga|Acueducto|Parque de los Pinos|Alfonso VIII) \|/gm) || []).length;
check(matrixRows === 24, 'Matriz narrativa completa: 3 × 8', `filas: ${matrixRows}`);
check(read('documentacion/PROMPT_APLICADO.md').includes('Adenda vinculante: variedad de direcciones'), 'La adenda final forma parte de la especificación aplicada');

const hash = createHash('sha256').update(readFileSync(resolve(root, 'assets/base-4k.png'))).digest('hex');
check(hash === 'b48465e512638fc8bfa9432b69a8a5e6a9bc2f5050318beee3b5c3a6674ad627', 'La composición maestra permanece byte a byte intacta', hash);

const sourcePages = ['index.html', '01-atlas.html', '02-cronologia.html', '03-reescritura.html', 'creditos.html'];
for (const page of sourcePages) {
  const html = read(page);
  const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((match) => match[1]);
  for (const ref of refs) {
    if (/^(?:https?:|#|mailto:)/.test(ref)) continue;
    check(existsSync(resolve(root, dirname(page), ref)), `${page}: ruta local ${ref}`);
  }
}
for (const cssFile of ['css/fonts.css', 'css/common.css', 'css/editorial.css', 'css/selector.css', 'css/credits.css', ...modelStyles]) {
  const css = read(cssFile);
  const refs = [...css.matchAll(/url\(['"]?([^)'"?#]+)[^)]*\)/g)].map((match) => match[1]);
  refs.forEach((ref) => check(existsSync(resolve(root, dirname(cssFile), ref)), `${cssFile}: recurso ${ref}`));
}

if (existsSync(resolve(root, 'dist'))) {
  const runtime = [
    'dist/index.html', 'dist/01-atlas.html', 'dist/02-cronologia.html', 'dist/03-reescritura.html', 'dist/creditos.html',
    'dist/data/chapters.json', 'dist/data/media.json', 'dist/data/sources.json',
    'dist/vendor/gsap.min.js', 'dist/vendor/ScrollTrigger.min.js', 'dist/assets/historia/muralla.jpg'
  ];
  runtime.forEach((file) => check(existsSync(resolve(root, file)) && statSync(resolve(root, file)).size > 0, `Build contiene ${file.slice(5)}`));
}

console.log(`VALIDACIÓN PLASENCIA · ${passes.length} comprobaciones superadas`);
passes.forEach(({ label, detail }) => console.log(`✓ ${label}${detail ? ` · ${detail}` : ''}`));
if (failures.length) {
  console.error(`\n${failures.length} INCUMPLIMIENTOS DETECTADOS`);
  failures.forEach(({ label, detail }) => console.error(`✗ ${label}${detail ? ` · ${detail}` : ''}`));
  process.exitCode = 1;
} else {
  console.log('\nRESULTADO: sin incumplimientos técnicos en las reglas automatizables.');
}
