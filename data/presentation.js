export const chapterOrder = [
  'muralla',
  'puerta',
  'plaza',
  'catedral',
  'ayuntamiento',
  'acueducto',
  'parque',
  'monumento'
];

export const galleryByChapter = {
  muralla: ['muralla', 'muralla-detalle'],
  puerta: ['puerta'],
  plaza: ['plaza'],
  catedral: ['catedral', 'catedral-entorno'],
  ayuntamiento: ['ayuntamiento', 'mayorga'],
  acueducto: ['acueducto'],
  parque: ['parque'],
  monumento: ['monumento']
};

export const editorialLayouts = {
  muralla: 'dossier-defensivo',
  puerta: 'ficha-umbral',
  plaza: 'album-urbano',
  catedral: 'diptico-artistico',
  ayuntamiento: 'gaceta-civica',
  acueducto: 'lamina-tecnica',
  parque: 'ensayo-memoria',
  monumento: 'archivo-escultura'
};

export const models = {
  atlas: {
    label: '01 / Atlas sensible',
    title: 'La ciudad como territorio.',
    deck: 'Ocho lugares desplegados como hojas de un mismo atlas. La ruta cambia de dirección y deja espacio para detenerse.',
    file: '01-atlas.html'
  },
  cronologia: {
    label: '02 / Cronología horizontal',
    title: 'El tiempo cruza la ciudad.',
    deck: 'El scroll vertical impulsa una línea horizontal; dentro de cada estación, el monumento decide su propio movimiento.',
    file: '02-cronologia.html'
  },
  reescritura: {
    label: '03 / Reescritura integral',
    title: 'La ciudad escrita en capas.',
    deck: 'Umbrales, ascensos, aperturas, profundidad y pausas componen una arquitectura sin eje global dominante.',
    file: '03-reescritura.html'
  }
};

export const nextChapter = Object.fromEntries(
  chapterOrder.map((id, index) => [id, chapterOrder[index + 1] || null])
);
