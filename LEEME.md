# Plasencia · Tres recorridos con GSAP

## Abrir en Windows
1. Extrae el ZIP entero en una carpeta.
2. Ejecuta ABRIR_PLASENCIA.bat. Con Python 3 instalado se inicia un servidor local en un puerto libre y se abre el selector.
3. Si no tienes Python, abre index.html directamente. Los scripts clásicos, fuentes e imágenes están incluidos; no requieren conexión.
4. Elige Coreografía, Nocturno o Atlas sensible.

No hace falta ejecutar npm ni compilar. Debes conservar las carpetas assets y vendor junto a los HTML.

## Qué cambia respecto a Coreografía II
Se reemplaza el motor manual de scroll por GSAP 3.13.0 + ScrollTrigger 3.13.0. No se ejecutan ambos motores a la vez. Los dos archivos originales de las bibliotecas están en vendor, con sus avisos de licencia conservados.

En las versiones 01 y 02 existe una pantalla compartida fijada mediante ScrollTrigger. Cada capítulo es un panel completo; sus siete enlaces mueven o revelan paneles enteros. Las dos escenas conviven durante cada unión. El recorrido no se limita a desplazar imágenes dentro de secciones apiladas.

La versión 03 tiene HTML, CSS y motor propios: un atlas de páginas situadas en coordenadas. El desplazamiento vertical de la rueda recorre ese espacio en horizontal o vertical. Comparte únicamente bibliotecas, recursos y controles comunes.

## Las tres direcciones
### 01 · Coreografía / Encuentros
Conserva textos y composiciones de Coreografía, adaptándolos al escenario común. Cambia de paleta según el capítulo. Uniones:
- Puerta → muralla: entrega horizontal completa.
- Muralla → plaza: desplazamiento diagonal de las dos escenas.
- Plaza → Ayuntamiento: apertura circular con aproximación y salida ampliada de la plaza.
- Ayuntamiento → parque: revelación desde arriba mientras el capítulo anterior se retira.
- Parque → catedral: ascenso vertical compartido.
- Catedral → acueducto: entrega horizontal.
- Acueducto → monumento: entrada diagonal y retirada de la escena anterior.

### 02 · Nocturno / Materia y luz
Comparte exactamente el motor de 01. Cambia la dirección visual: tonos carbón, cobre, tipografía sans y Bodoni, ejes fotográficos diferentes, portada editorial y encuadres rectos. Las fotografías de capítulos reciben un tratamiento CSS más contenido; la imagen maestra no se filtra.

### 03 · Atlas sensible / El lugar y su huella
Estructura nueva: ocho páginas distribuidas en dos dimensiones. Recorrido derecha → abajo → derecha → abajo → abajo → derecha → abajo. Los capítulos tienen composiciones independientes: arco dibujado, collage de piedra, palabras de la plaza, círculo de Mayorga, respiración vegetal, ascenso y detalle de la catedral, trazado de arcos y cierre escultórico. Cada transición muestra fragmentos de dos páginas simultáneamente.

## Ocho capítulos en cada versión
Puerta del Sol; muralla; Plaza Mayor; Ayuntamiento y Mayorga; Parque de los Pinos; catedral; acueducto; monumento y fuente.

La portada muestra la base maestra una sola vez y conserva sus bytes. Las versiones anteriores no se han modificado.

## Navegación
Usa scroll vertical normal, también para los tramos horizontales. No se intercepta la rueda para imponer saltos. Al retroceder se invierte la secuencia. El índice inferior y el menú saltan a etiquetas de la línea temporal. Los botones de relato abren una lectura breve; Escape la cierra. El botón circular alterna animación y lectura en flujo normal. También se respeta la preferencia del sistema de movimiento reducido.

## Qué observar para comparar
- En el primer enlace, ambas escenas deben verse desplazándose lateralmente: esa es la diferencia estructural frente a V2.
- En 01 y 02, compara especialmente plaza → Ayuntamiento y Ayuntamiento → parque.
- En 03, sigue la entrega muralla → plaza: el eje pasa de horizontal a vertical.
- Valora si hay suficiente tiempo para leer. Las pausas y el metraje del recorrido pueden ajustarse sin reconstruir sus escenas.

## Archivos
- 01-coreografia.html / 02-nocturno.html: dos composiciones derivadas de Coreografía.
- coreografia-base.css: estilos heredados de la versión aprobada.
- encuentros.css: nuevo escenario compartido, ajustes de composición y estética Nocturno.
- encuentros.js: secuencia GSAP común, efectos individuales y siete uniones.
- 03-atlas.html / atlas.css / atlas.js: estructura, estilo y motor nuevos.
- interfaz.js: índice, relatos, diálogos, accesibilidad y partículas ambientales.
- vendor/: GSAP y ScrollTrigger 3.13.0 originales.
- assets/: imágenes y tipografías locales.
- SHA256.json: huellas de los archivos del paquete (excepto este propio manifiesto).

## Límites del contenido
Los relatos son literarios provisionales, no documentación histórica contrastada. Falta una fotografía específica de la fuente: su presencia se evoca con círculos y partículas; no se ha inventado una fotografía. Los arcos, círculos y agujas gráficas son ornamentales. Las imágenes son planas: no hay reconstrucción 3D ni perspectivas ocultas. Algunos encuadres necesitarán ajuste después de verlos en tu pantalla.

## Validación realizada y pendiente
Se ejecutaron las bibliotecas GSAP y ScrollTrigger reales en un DOM simulado. Se comprobaron las ocho etiquetas, las siete uniones, la presencia simultánea de paneles y posiciones intermedias, el regreso al inicio, navegación por índice, ocho relatos y cambio a lectura sin movimiento. También se comprobaron enlaces, recursos, integridad ZIP y la imagen maestra.

Esta prueba no renderiza una página y no valida el aspecto visual, la fluidez real ni los encuadres móviles. El navegador disponible bloqueó la dirección local por su política de acceso; no se sorteó ese bloqueo. La revisión visual de las tres versiones queda pendiente y debe realizarse antes de considerar definitivo el diseño.

## Procedencia de bibliotecas
GSAP / ScrollTrigger: https://gsap.com/ — documentación: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
Versión fijada: 3.13.0. Descarga de los archivos de distribución npm mediante jsDelivr. Licencia y condiciones: https://gsap.com/standard-license. No se ha copiado el código de nabilissa.com.
