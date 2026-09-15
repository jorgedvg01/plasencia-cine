# Matriz final de cumplimiento

Fecha: 15 de septiembre de 2026.

## Dictamen

La implementación técnica está completa y ha superado las comprobaciones automatizables y de integración DOM. La aprobación global **no se declara como definitiva** porque la revisión visual real de escritorio y móvil quedó bloqueada por el navegador de previsualización. No hay requisitos técnicos conocidos pendientes; los estados visuales se registran separadamente.

Estados utilizados:

- **IMPLEMENTADO Y COMPROBADO**: existe y la prueba indicada terminó correctamente.
- **TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL**: estructura y comportamiento verificables funcionan, pero falta inspección de píxeles en navegador real.
- **BLOQUEADO**: la herramienta necesaria devolvió un impedimento concreto.

## Arquitectura, datos y recursos

| Requisito | Modelo | Capítulo | Archivo | Componente | Prueba realizada | Resultado | Estado | Observaciones |
|---|---|---|---|---|---|---|---|---|
| Leer documentación pertinente y distinguir autoridad | Todos | Todos | `documentacion/referencia/*`, `PROMPT_APLICADO.md` | Auditoría previa | Lectura del prompt, investigación, E1, E2 y limitaciones; comparación con ZIP reparado | Se priorizó el prompt revisado y su adenda | IMPLEMENTADO Y COMPROBADO | Los documentos antiguos no gobiernan la nueva arquitectura. |
| Conservar el checkpoint anterior | Todos | Todos | ZIP original fuera del proyecto nuevo | Punto de partida | Extracción de solo lectura y reconstrucción en carpeta nueva | Checkpoint no modificado | IMPLEMENTADO Y COMPROBADO | La entrega es completa, no un parche. |
| Mantener intacta la base maestra | Todos | Portada | `assets/base-4k.png` | Composición maestra | SHA-256 contra checkpoint | Hash idéntico | IMPLEMENTADO Y COMPROBADO | No se regeneró ni reencuadró el archivo. |
| Nueva base limpia | Todos | Todos | raíz del proyecto | Vite MPA | Inventario y build | Separación entre HTML, CSS, JS, datos, recursos y docs | IMPLEMENTADO Y COMPROBADO | No conserva layouts globales antiguos. |
| Capa factual única | Todos | Todos | `data/chapters.json` | `loadPlasenciaData()` | 24 escenas comparadas con título, introducción y 3 bloques centrales | Sin divergencias | IMPLEMENTADO Y COMPROBADO | Las fechas no aparecen codificadas en los módulos de modelo. |
| Medios y procedencia únicos | Todos | Todos | `data/media.json` | `photoFigure()` | 11 archivos, metadatos, HTTPS y dimensiones locales | Correcto | IMPLEMENTADO Y COMPROBADO | Original y copia comprimida se distinguen cuando procede. |
| Fuentes únicas | Todos | Todos | `data/sources.json`, `creditos.html` | Página de trazabilidad | JSON válido y 13 enlaces HTTPS | Correcto | IMPLEMENTADO Y COMPROBADO | Los enlaces de capítulo proceden también de la base central. |
| Matriz 3 × 8 previa | Todos | Todos | `MATRIZ_24_TRATAMIENTOS.md` | 24 tratamientos | Recuento automatizado | 24 filas válidas | IMPLEMENTADO Y COMPROBADO | Incluye arquitectura, movimiento, ritmo, texto, E1, E2 y riesgos. |
| Tres arquitecturas inequívocas | Todos | Todos | `js/modelos/*`, `css/*` | Atlas / Cronología / Reescritura | Revisión de estructura, selectores y transporte | Tres raíces y sistemas espaciales distintos | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | Falta comparación visual humana completa. |
| Horizontal global solo en modelo 2 | Cronología | Todos | `cronologia.js` | `cronologia-global` | Búsqueda de pin y traslado del track | Único pin global en Cronología | IMPLEMENTADO Y COMPROBADO | Atlas y Reescritura carecen de ese pin. |
| Scroll vertical nativo | Cronología | Todos | `cronologia.js` | ScrollTrigger global | Revisión de listeners | No hay listener `wheel` ni `preventDefault` de rueda | IMPLEMENTADO Y COMPROBADO | La escala espacial se declara no proporcional. |
| Modelo 3 sin eje X global | Reescritura | Todos | `reescritura.js` | Secuencia de umbrales | Revisión de triggers y contenedor | Sin track ni pin X global | IMPLEMENTADO Y COMPROBADO | Puede haber movimientos X locales. |
| Variedad de dirección, trayectoria y ritmo | Todos | Todos | `js/modelos/*` | Coreografías por capítulo | Comprobación de X, Y, Z/escala, clip, giro, trazado y pausas | Al menos 5 familias de movimiento por modelo | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | La adecuación estética final requiere observación. |
| Sistema tipográfico coherente | Todos | Todos | `css/fonts.css`, CSS de modelos | 4 familias | Recuento de familias y carga en build | Manrope, Cormorant, Bodoni e Italiana | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | Caracteres españoles presentes en contenido. |
| Fotografía narrativa, no falsa | Todos | Todos | `media.json`, `markup.js` | Figuras y pies | Metadatos y etiquetas | Autor, fecha, licencia, procedencia y cambios visibles | IMPLEMENTADO Y COMPROBADO | No se presenta tratamiento actual como fotografía antigua. |
| No fabricar documentos históricos | Todos | Todos | `shell.js`, datos | Archivo editorial | Revisión de copy y archivos enlazados | Esquemas declarados modernos; archivos no reproducibles solo enlazados | IMPLEMENTADO Y COMPROBADO | No hay actas, sellos, firmas o prensa falsa. |
| Build completo y rutas relativas | Todos | Todos | `vite.config.js`, `dist/` | Copia runtime | Build + prueba HTTP | HTML, JSON, fotos, vendor y matriz disponibles | IMPLEMENTADO Y COMPROBADO | Corrige una omisión detectada en la primera relectura. |

## Los 24 tratamientos principales

Todos los tratamientos siguientes superaron render DOM, correspondencia factual, presencia de fotografía, tres bloques históricos, acceso editorial, fuentes y transición. La valoración de composición se mantiene pendiente de revisión visual.

| Requisito | Modelo | Capítulo | Archivo | Componente | Prueba realizada | Resultado | Estado | Observaciones |
|---|---|---|---|---|---|---|---|---|
| Estructura específica | Atlas | Muralla | `atlas.js`, `atlas.css` | Perímetro y bloques | DOM + código | Contenido y gesto propios | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | E1 local recorre el recinto. |
| Estructura específica | Atlas | Puerta | `atlas.js`, `atlas.css` | Umbral y profundidad | DOM + código | Contenido y gesto propios | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | No es otro panel lateral. |
| Estructura específica | Atlas | Plaza | `atlas.js`, `atlas.css` | Lámina coral | DOM + código | Tres focos y jerarquía propia | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | Entradas desde direcciones distintas. |
| Estructura específica | Atlas | Catedral | `atlas.js`, `atlas.css` | Pliego Vieja/Nueva | DOM + código | Ascenso y doble fotografía | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | Texto estable tras entrada. |
| Estructura específica | Atlas | Ayuntamiento | `atlas.js`, `atlas.css` | Hoja cívica | DOM + código | Pulsos y dos escalas | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | Sin sonido obligatorio. |
| Estructura específica | Atlas | Acueducto | `atlas.js`, `atlas.css` | Desplegable técnico | DOM + código | Conducción diagonal local | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | Esquema moderno rotulado. |
| Estructura específica | Atlas | Parque | `atlas.js`, `atlas.css` | Claro contemplativo | DOM + código | Pausa y memoria presentes | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | Tratamiento no festivo. |
| Estructura específica | Atlas | Alfonso VIII | `atlas.js`, `atlas.css` | Folio monumental | DOM + código | 1186/1995 proceden de datos | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | Cierre contenido. |
| Estructura específica | Cronología | Muralla | `cronologia.js`, `cronologia.css` | Estación-basamento | DOM + código | Interior vertical dentro de transporte X | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | Separa interior/exterior. |
| Estructura específica | Cronología | Puerta | `cronologia.js`, `cronologia.css` | Estación-portal | DOM + código | Profundidad al detener transporte | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | Archivo enlazado, no simulado. |
| Estructura específica | Cronología | Plaza | `cronologia.js`, `cronologia.css` | Estación expandida | DOM + código | Coral y radial | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | Ritmo vivo con pausa. |
| Estructura específica | Cronología | Catedral | `cronologia.js`, `cronologia.css` | Torre tipográfica | DOM + código | Movimiento interno vertical | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | No hereda X global. |
| Estructura específica | Cronología | Ayuntamiento | `cronologia.js`, `cronologia.css` | Esfera cívica | DOM + código | Tres pulsos y reloj | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | Fechas centrales. |
| Estructura específica | Cronología | Acueducto | `cronologia.js`, `cronologia.css` | Estación longitudinal | DOM + código | Línea hidráulica distinta del transporte | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | Dos funciones del movimiento. |
| Estructura específica | Cronología | Parque | `cronologia.js`, `cronologia.css` | Estación silenciosa | DOM + código | Mayor tiempo de permanencia | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | La línea pierde protagonismo. |
| Estructura específica | Cronología | Alfonso VIII | `cronologia.js`, `cronologia.css` | Estación terminal | DOM + código | Final en monumento contemporáneo | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | 1186 es memoria, no posición final. |
| Estructura específica | Reescritura | Muralla | `reescritura.js`, `reescritura.css` | Estratos y brecha | DOM + código | Barrido fragmentado | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | X únicamente local. |
| Estructura específica | Reescritura | Puerta | `reescritura.js`, `reescritura.css` | Túnel de tres planos | DOM + código | Profundidad y cruce | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | Estructura distinta de Atlas. |
| Estructura específica | Reescritura | Plaza | `reescritura.js`, `reescritura.css` | Apertura radial | DOM + código | Tres bloques centrales íntegros | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | Marcadores semánticos añadidos tras prueba. |
| Estructura específica | Reescritura | Catedral | `reescritura.js`, `reescritura.css` | Pozo de luz | DOM + código | Ascenso y contradescenso | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | Capas Vieja/Nueva. |
| Estructura específica | Reescritura | Ayuntamiento | `reescritura.js`, `reescritura.css` | Cámara circular | DOM + código | Pulsos concéntricos | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | No repite ascenso. |
| Estructura específica | Reescritura | Acueducto | `reescritura.js`, `reescritura.css` | Corte diagonal | DOM + código | Tres paradas hidráulicas | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | Sin eje diagonal global. |
| Estructura específica | Reescritura | Parque | `reescritura.js`, `reescritura.css` | Cámara abierta | DOM + código | Movimiento mínimo y memoria | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | Represión no convertida en efecto. |
| Estructura específica | Reescritura | Alfonso VIII | `reescritura.js`, `reescritura.css` | Pedestal frontal | DOM + código | Acercamiento corto y cierre | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | Sin repetir el portal. |

## Efecto2.0, accesibilidad y adaptación

| Requisito | Modelo | Capítulo | Archivo | Componente | Prueba realizada | Resultado | Estado | Observaciones |
|---|---|---|---|---|---|---|---|---|
| Motor editorial común | Todos | Todos | `shell.js` | Diálogo editorial | Integración 9 modos | Abre, cierra, restaura foco y scroll | IMPLEMENTADO Y COMPROBADO | Infraestructura compartida, no maqueta. |
| Dossier defensivo | Todos | Muralla | `shell.js`, `editorial.css` | `layout-muralla` | DOM + selector CSS | DOM y retícula propios | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | Incluye cronología y cautelas. |
| Ficha de transformación | Todos | Puerta | mismos | `layout-puerta` | DOM + selector CSS | Exterior/paso/interior | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | No fabrica antes/ahora. |
| Álbum urbano | Todos | Plaza | mismos | `layout-plaza` | DOM + selector CSS | Composición coral | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | Archivo real solo enlazado. |
| Díptico artístico | Todos | Catedral | mismos | `layout-catedral` | DOM + selector CSS | Vieja/Nueva enfrentadas | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | Fotografía actual identificada. |
| Gaceta cívica | Todos | Ayuntamiento | mismos | `layout-ayuntamiento` | DOM + selector CSS | Fachada, Mayorga y fecha | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | Cabecera contemporánea explícita. |
| Lámina técnica | Todos | Acueducto | mismos | `layout-acueducto` | DOM + selector CSS | Esquema, foto y notas | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | No es plano histórico. |
| Ensayo de memoria | Todos | Parque | mismos | `layout-parque` | DOM + selector CSS | Ritmo y copy respetuosos | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | Sin recursos lúdicos. |
| Archivo de escultura | Todos | Alfonso VIII | mismos | `layout-monumento` | DOM + selector CSS | Persona, fundación y monumento separados | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | Autoría central. |
| Teclado, Escape y foco | Todos | Todos | `shell.js` | focus trap / cancel | Integración DOM | Escape cierra y foco retorna | IMPLEMENTADO Y COMPROBADO | Revisión de tabulación real pendiente con la visual. |
| Galería y lightbox | Todos | Todos | `shell.js`, `markup.js` | Controles comunes | Integración DOM | Ratón programático, flechas y gestos implementados | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | Swipe y flechas existen; gesto físico no ejecutado. |
| Movimiento reducido conserva contenido | Todos | Todos | CSS y JS de modelos | Fallback estático | 3 modelos en modo reduced | 24 escenas y ampliaciones completas | IMPLEMENTADO Y COMPROBADO | No depende de GSAP. |
| Móvil conserva contenido e identidad | Todos | Todos | tres CSS de modelo | Media queries propias | 3 modelos en modo móvil DOM | 24 escenas completas; horizontal pasa a flujo vertical | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | Falta inspección de recortes/overflow a píxel. |
| Contraste de superficies | Todos | Todos | estilos inline de capítulos | Paletas | 24 cálculos WCAG | 7,12:1–13,32:1 | IMPLEMENTADO Y COMPROBADO | Contraste sobre estados fotográficos queda visualmente pendiente. |
| Ausencia de errores de consola | Todos | Todos | módulos JS | Inicialización | 9 ejecuciones DOM sin `console.error` | Sin errores en simulación | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | Falta consola de navegador gráfico real. |
| Revisión visual completa | Todos | Todos | preview supervisada | Navegador gráfico | Apertura de host local | `net::ERR_BLOCKED_BY_CLIENT` | BLOQUEADO | No se declara realizada ni aprobada. |
| Comparación cruzada | Todos | Todos | `COMPARACION_CRUZADA.md` | 8 comparaciones | Datos + estructura | Factualidad igual y arquitectura distinta en código | TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL | La comparación visual humana sigue pendiente. |
| Integridad y extracción del ZIP | Todos | Todos | paquete final | Entrega | `unzip -t`, extracción temporal, `npm ci`, build, 272 controles, 9 integraciones y HTTP desde extraído | Sin errores; 8/8 recursos de muestra responden `200` | IMPLEMENTADO Y COMPROBADO | La prueba se repite sobre el ZIP definitivo después de esta actualización documental. |
