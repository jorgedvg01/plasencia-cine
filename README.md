# Plasencia · tres miradas históricas

Reconstrucción completa de tres experiencias narrativas sobre ocho lugares de Plasencia. Los tres modelos consumen la misma base histórica y fotográfica, pero cambian de forma inequívoca su arquitectura, composición, ritmo, dirección e interacción.

## Abrir la entrega

La web carga datos JSON y debe abrirse mediante un servidor local, no haciendo doble clic en el HTML.

### Windows

Ejecuta `ABRIR_PLASENCIA.bat`.

### macOS o Linux

Desde esta carpeta:

```bash
python3 servidor.py
```

Después abre `http://127.0.0.1:4173/`. El servidor utiliza la versión compilada de `dist/`.

## Desarrollo

Requiere Node.js 20 o posterior.

```bash
npm install
npm run dev
```

Comprobación técnica y compilación:

```bash
npm run check
npm run build
```

## Las tres versiones

- `01-atlas.html`: territorio vertical de hojas, rutas y claros. No usa transporte horizontal global.
- `02-cronologia.html`: scroll vertical nativo que impulsa el único transporte cronológico horizontal global del proyecto; cada estación conserva una narrativa interna distinta.
- `03-reescritura.html`: secuencia de umbrales, capas, profundidad, ascensos y pausas sin un eje X global.

## Arquitectura

- `data/chapters.json`: base factual única de los ocho capítulos.
- `data/media.json`: fotografías, autores, fechas, licencias y procedencia.
- `data/sources.json`: índice común de fuentes históricas.
- `js/common/`: carga de datos, marcado y motor compartido de navegación, Efecto2.0 y lightbox.
- `js/modelos/`: puesta en escena específica de cada modelo.
- `css/editorial.css`: ocho retículas editoriales diferenciadas sobre un motor modal común.
- `documentacion/MATRIZ_24_TRATAMIENTOS.md`: planificación previa de 3 × 8 tratamientos.
- `documentacion/MATRIZ_CUMPLIMIENTO.md`: requisitos, pruebas, resultados y estados honestos.
- `documentacion/CAMBIOS.md`: diferencias frente al checkpoint anterior.
- `documentacion/COMPARACION_CRUZADA.md`: igualdad factual y diferencias de los ocho capítulos.
- `documentacion/PRUEBAS.md`: evidencia técnica y límite explícito de la revisión visual.

La composición maestra `assets/base-4k.png` se conserva byte a byte respecto al último paquete reparado. No se incorporan imágenes generadas ni documentos históricos simulados.
