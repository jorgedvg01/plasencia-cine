import { chapterOrder, galleryByChapter, editorialLayouts } from '../../data/presentation.js';

let cache;

export async function loadPlasenciaData() {
  if (cache) return cache;
  cache = Promise.all([
    fetch('data/chapters.json').then(assertOk),
    fetch('data/media.json').then(assertOk),
    fetch('data/sources.json').then(assertOk)
  ]).then(async ([chaptersResponse, mediaResponse, sourcesResponse]) => {
    const [rawChapters, rawMedia, sources] = await Promise.all([
      chaptersResponse.json(),
      mediaResponse.json(),
      sourcesResponse.json()
    ]);
    const chapterMap = new Map(rawChapters.map((chapter) => [chapter.id, chapter]));
    const media = Object.fromEntries(rawMedia.map((item) => [item.id, item]));
    const chapters = chapterOrder.map((id) => {
      const chapter = chapterMap.get(id);
      if (!chapter) throw new Error(`Falta el capítulo ${id}`);
      const gallery = galleryByChapter[id] || [id];
      gallery.forEach((mediaId) => {
        if (!media[mediaId]) throw new Error(`Falta el recurso ${mediaId}`);
      });
      return { ...chapter, gallery, editorialLayout: editorialLayouts[id] };
    });
    return { chapters, media, sources };
  });
  return cache;
}

function assertOk(response) {
  if (!response.ok) throw new Error(`No se pudo cargar ${response.url}`);
  return response;
}
