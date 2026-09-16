# Plasencia — Cinematic Novel asset package

Este paquete corresponde a la dirección artística aprobada para la rama `cinematic-novel`.

## Contenido listo para copiar al repositorio

Copia el contenido de `assets/cinematic-novel/` dentro de:

`plasencia-cine/assets/cinematic-novel/`

Incluye:

- `cover_map.webp` — plano maestro interactivo basado en la referencia aprobada.
- `chapter_mural_master.webp` — mural vertical maestro de capítulos para producción y referencia.
- `transitions/foliage_05_06_mid.webp/.png` — vegetación media Catedral → Ayuntamiento.
- `transitions/foliage_catedral-ayuntamiento.webp/.png` — vegetación de costura Catedral → Ayuntamiento.

## Referencias aprobadas

- `references/approved/01_cover_hotspots_reference.png`
- `references/approved/02_vertical_chapters_reference.png`
- `references/approved/03_catedral_ayuntamiento_transition_reference.png`

Estas referencias NO deben usarse como una única imagen plana final para los capítulos. Sirven como dirección de arte y mapa de composición.

## Rama GitHub

La rama de trabajo es:

`cinematic-novel`

Después de copiar los assets:

```bash
git switch cinematic-novel
mkdir -p assets/cinematic-novel/transitions
# copia aquí el contenido del paquete
git add assets/cinematic-novel
git commit -m "cinematic novel: add approved visual assets"
git push origin cinematic-novel
npm run dev
```

## Principio visual

- Portada: plano general con hotspots clicables.
- Capítulos: composiciones independientes inspiradas en el mural vertical.
- Tipografía: HTML/CSS, nunca incrustada en los assets finales.
- Transiciones: continuidad mediante piedra, ramas, vegetación, arquitectura, sombra y otros elementos físicos.
- Regla: no usar fades genéricos como solución por defecto; los límites de capítulo deben dejar de sentirse como cortes rectos.

## Nota importante

Los dos PNG/WebP de vegetación son los primeros assets reales de transición preparados. El resto de costuras de producción deben continuar con el mismo criterio fotográfico y cinematográfico, no con SVG decorativo ni recortes tipo pegatina.
