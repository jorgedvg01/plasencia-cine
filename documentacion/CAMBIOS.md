# Registro de cambios · reconstrucción de los tres modelos

Fecha: 15 de septiembre de 2026.

## Punto de partida

El ZIP reparado anterior se utilizó como checkpoint congelado para recuperar investigación, fotografías autorizadas, tipografías, GSAP, ScrollTrigger y criterios de accesibilidad. La nueva entrega se construyó en una carpeta limpia: no es una sucesión de parches sobre las tres maquetas anteriores.

La composición maestra `assets/base-4k.png` conserva el SHA-256 `b48465e512638fc8bfa9432b69a8a5e6a9bc2f5050318beee3b5c3a6674ad627`, idéntico al archivo del checkpoint.

## Reconstrucción

- Se creó una portada común que explica la diferencia entre las tres experiencias.
- Atlas dejó de ser una cinta y pasó a funcionar como un territorio vertical de hojas, rutas, pliegues y claros.
- Cronología mantiene el scroll vertical nativo y lo convierte en el único transporte horizontal global. La animación interna de cada estación usa su propio gesto.
- Reescritura se rehízo como una secuencia vertical de capas, umbrales, profundidad, ascensos, ritmos y pausas, sin coordenada X global.
- Se planificaron y construyeron 24 tratamientos específicos antes de cerrar la implementación.
- Los tres modelos consumen `chapters.json`, `media.json` y `sources.json`; las fechas históricas ya no están repetidas en sus archivos de puesta en escena.
- Efecto1.0 se reserva globalmente para Cronología y aparece de forma local en recorridos de muralla o agua cuando la narración lo justifica.
- Efecto2.0 comparte apertura, cierre, Escape, foco, restauración del scroll, teclado, táctil y lightbox, pero genera ocho órdenes DOM y ocho retículas editoriales distintas.
- Se limitaron las familias tipográficas a Manrope, Cormorant Garamond, Bodoni Moda e Italiana.
- Móvil y movimiento reducido conservan toda la historia en flujo vertical.
- Se añadió una página única de trazabilidad de fotografías y fuentes.

## Correcciones surgidas de la relectura final

La primera compilación no copiaba al directorio de producción los JSON cargados en tiempo de ejecución, las fotografías dinámicas ni los archivos locales de GSAP. Se corrigió el proceso de build y se volvió a probar por HTTP.

La relectura detectó también fechas repetidas en las plantillas de modelo. Se sustituyeron por valores procedentes de la base factual común. Se eliminaron fotografías ajenas que se habían añadido a dos galerías solo para aumentar su cantidad; una galería de una imagen pertinente es preferible a una galería engañosa.

La prueba de integración detectó que Plaza y Acueducto en Reescritura tenían estructuras históricas propias que no llevaban el marcador común de prueba. Se añadieron marcadores semánticos sin alterar sus composiciones. También se corrigió la espera al navegar desde el índice y la inicialización de `aria-current`.

Las dimensiones del catálogo fotográfico se separaron entre originales y archivos locales comprimidos para que los atributos `width` y `height` coincidan con los bytes entregados y eviten saltos de maquetación.

## Checkpoint B · Muralla y Puerta (evolución de transiciones)

Se reforzaron los dos primeros capítulos en los tres modelos para que la transición visual interprete el puente narrativo del JSON, sin alterar la identidad de cada arquitectura:

- Atlas (Modelo 1): Muralla incorpora un perímetro que se traza con Efecto1.0 local (recorrido del recinto) y una banda de brecha que se abre al final; Puerta añade planos de profundidad en Z dentro del arco y una franja de desembocadura hacia la Plaza. Las entradas de detalle pasan de `opacity` a recortes `clip-path` para variar el recurso.
- Cronología (Modelo 2): el transporte horizontal global permanece intacto. Los interiores dejan de ser horizontales: Muralla ensambla bloques en vertical con brecha final; Puerta atraviesa planos de profundidad y desemboca en la vida coral. Se conserva `inert` y el mapeo de `score.labels`.
- Reescritura (Modelo 3): Muralla abre una brecha de estratos; Puerta añade una luz de umbral y una franja de emergencia hacia la Plaza. Sin eje X global.

Las bandas de transición se colocaron en la franja de padding inferior y por detrás del contenido para evitar solapes con acciones y hechos. La validación técnica (`scripts/validate.mjs`) sigue superando las 272 comprobaciones sin incumplimientos.

## Elementos que no se han simulado

- No hay actas, sellos, periódicos, planos, firmas ni citas históricas inventadas.
- Los esquemas de muralla y acueducto están rotulados como interpretación editorial contemporánea.
- Cuando una imagen de archivo no tiene condiciones de reproducción cerradas, se enlaza el registro y no se incorpora una copia.
- 1995 se presenta como decisión municipal del monumento a Alfonso VIII, no como fecha del personaje medieval ni automáticamente de toda la fuente.
