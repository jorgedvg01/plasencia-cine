export const escapeHTML = (value = '') => String(value).replace(/[&<>'"]/g, (character) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
})[character]);

export function externalLink(url, label, className = '') {
  return `<a${className ? ` class="${className}"` : ''} href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(label)} <span aria-hidden="true">↗</span></a>`;
}

export function photoFigure(data, mediaId, options = {}) {
  const item = data.media[mediaId];
  const className = options.className || '';
  const action = options.storyId
    ? `data-story="${escapeHTML(options.storyId)}" aria-label="Explorar historia: ${escapeHTML(options.storyLabel || item.alt)}"`
    : `data-photo="${escapeHTML(mediaId)}" aria-label="Ampliar fotografía: ${escapeHTML(item.alt)}"`;
  const actionLabel = options.storyId ? 'Explorar historia' : 'Ampliar fotografía';
  return `<figure class="chapter-photo ${className}" style="--focus:${escapeHTML(options.focus || '50% 50%')}">
    <button class="photo-button" type="button" ${action}>
      <img src="${escapeHTML(item.src)}" alt="${escapeHTML(item.alt)}" width="${item.dimensions[0]}" height="${item.dimensions[1]}" loading="lazy" decoding="async">
      <span class="photo-action" aria-hidden="true">${actionLabel} ＋</span>
    </button>
    ${options.credit === false ? '' : `<figcaption class="photo-credit">${escapeHTML(item.author)} · ${escapeHTML(item.date)} · ${externalLink(item.source, item.license)}</figcaption>`}
  </figure>`;
}

export function chapterHeading(chapter, index, options = {}) {
  return `<div class="chapter-heading ${options.className || ''}">
    <p class="chapter-index">${String(index + 1).padStart(2, '0')} / ${escapeHTML(chapter.verb)}</p>
    <p class="chapter-kicker">${escapeHTML(chapter.era)}</p>
    <h2 class="chapter-title">${escapeHTML(chapter.title)}</h2>
  </div>`;
}

export function factualSections(chapter, className = '') {
  return `<div class="facts ${className}">${chapter.sections.map(([heading, text], index) => `
    <section class="fact fact-${index + 1}" data-fact="${index + 1}">
      <strong>${String(index + 1).padStart(2, '0')} · ${escapeHTML(heading)}</strong>
      <p>${escapeHTML(text)}</p>
    </section>`).join('')}</div>`;
}

export function primaryCopy(chapter, className = '') {
  return `<div class="primary-copy ${className}">
    <p class="chapter-question">${escapeHTML(chapter.question)}</p>
    <p class="chapter-brief">${escapeHTML(chapter.intro)}</p>
  </div>`;
}

export function storyAction(chapter, className = '') {
  return `<button class="story-button ${className}" type="button" data-story="${escapeHTML(chapter.id)}">Explorar historia <span aria-hidden="true">↗</span></button>`;
}

export function chapterSources(chapter) {
  return `<div class="source-links" aria-label="Fuentes del capítulo">${chapter.sources.map(([label, url]) => externalLink(url, label)).join('')}</div>`;
}

export function transitionCopy(chapter) {
  return `<p class="chapter-transition"><span aria-hidden="true">→</span> ${escapeHTML(chapter.transition)}</p>`;
}

export function mediaCaption(item) {
  return `${escapeHTML(item.author)} · ${escapeHTML(item.date)} · ${externalLink(item.source, item.license)}`;
}
