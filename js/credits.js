import { loadPlasenciaData } from './common/data.js';
import { escapeHTML, externalLink } from './common/markup.js';

try {
  const data = await loadPlasenciaData();
  document.querySelector('#media-list').innerHTML = Object.values(data.media).map((item) => `<article class="media-card">
    <img src="${escapeHTML(item.src)}" alt="" width="${item.dimensions[0]}" height="${item.dimensions[1]}" loading="lazy">
    <div><h3>${escapeHTML(item.alt)}</h3><p>${escapeHTML(item.author)} · ${escapeHTML(item.date)}</p><p class="license">${escapeHTML(item.license)}</p><p>${escapeHTML(item.changes)}</p>${externalLink(item.source, 'Ficha de procedencia')}</div>
  </article>`).join('');
  document.querySelector('#source-list').innerHTML = data.sources.map((source) => `<article class="source-card"><small>${escapeHTML(source.type)}</small>${externalLink(source.url, source.label)}</article>`).join('');
} catch (error) {
  document.querySelector('#media-list').innerHTML = '<p>No se pudieron cargar las fichas fotográficas.</p>';
  document.querySelector('#source-list').innerHTML = '<p>No se pudieron cargar las fuentes.</p>';
  console.error(error);
}
