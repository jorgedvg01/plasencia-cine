# Registro de pruebas

Fecha de última ejecución: 15 de septiembre de 2026.

## Pruebas completadas

| Prueba | Alcance | Resultado |
|---|---|---|
| `npm run build` | Cinco entradas HTML, módulos, estilos, fuentes y recursos de producción. | Compilación correcta. Los avisos de Vite identifican GSAP y ScrollTrigger como scripts clásicos externos; se copian y sirven localmente de forma deliberada. |
| `npm run check` | Estructura, datos, rutas, fotografías, hashes, 24 tratamientos, 8 layouts, contraste sólido, responsive, reduced motion y regla del eje global. | Sin incumplimientos técnicos automatizables. |
| Integración DOM | Atlas, Cronología y Reescritura en modos escritorio, móvil y movimiento reducido. | 9 ejecuciones correctas: 72 escenas, datos comunes, Efecto2.0, Escape, retorno de foco, lightbox, índice y selector de movimiento. |
| Servicio HTTP sobre `dist/` | Portada, tres modelos, créditos, tres JSON, GSAP, ScrollTrigger, fotografía y matriz narrativa. | Todos los recursos responden `200`. |
| Integridad fotográfica | 11 JPEG y la composición maestra. | Formatos y dimensiones legibles; metadatos locales sincronizados. |
| Integridad de la base maestra | Comparación SHA-256 con el checkpoint reparado. | Coincidencia byte a byte. |
| Contraste sólido | 8 pares fondo/texto × 3 modelos. | 24 relaciones entre 7,12:1 y 13,32:1. |
| ZIP extraído | Paquete completo en carpeta temporal independiente. | `unzip -t`, instalación limpia, nueva compilación, 272 controles, 9 integraciones y 8/8 respuestas HTTP correctas. |

La integración DOM ejecuta los módulos reales y comprueba comportamiento funcional, pero no sustituye el renderizado de píxeles ni ScrollTrigger dentro de un navegador gráfico.

## Comprobación visual

Se inició correctamente la previsualización supervisada en `http://terminal.local:4173/`. El navegador de revisión rechazó ese host con `net::ERR_BLOCKED_BY_CLIENT`. No se utilizó otro motor de navegador para eludir la restricción.

Por ello quedan expresamente sin aprobar mediante inspección visual real:

- las 24 escenas en escritorio;
- las 24 escenas en móvil;
- la coreografía activa de ScrollTrigger hacia delante y hacia atrás;
- los ocho layouts editoriales a resolución real;
- el contraste sobre cada estado fotográfico animado;
- y la consola de un navegador gráfico real.

Estos elementos figuran como `TÉCNICAMENTE COMPROBADO — PENDIENTE DE REVISIÓN VISUAL` en la matriz. No se presentan como validados visualmente.
