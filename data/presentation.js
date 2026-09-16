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
  reescritura: {
    label: 'REESCRITURA INTEGRAL',
    title: 'La ciudad escrita en capas.',
    deck: 'Umbrales, ascensos, aperturas, profundidad y pausas componen una arquitectura sin eje global dominante.',
    file: 'index.html'
  }
};

export const nextChapter = Object.fromEntries(
  chapterOrder.map((id, index) => [id, chapterOrder[index + 1] || null])
);
