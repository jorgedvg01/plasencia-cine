# Limitaciones, fronteras y riesgos — Plasencia, relato vivo por scroll

**Fecha:** 13 de septiembre de 2026  
**Proyecto de referencia:** `plasencia-gsap-tres`  
**Objetivo:** documentar con honestidad qué no puede obtenerse con los recursos actuales, qué sí es posible pero tiene costes importantes y qué fronteras no conviene traspasar durante la implementación.

---

## 1. Resumen ejecutivo

La experiencia planteada es técnicamente viable: una narración por capítulos controlada por scroll, con cambios de eje, escenas compartidas, máscaras, zooms, pausas y atmósferas distintas. GSAP y ScrollTrigger ofrecen una base adecuada para construirla.

Sin embargo, hay límites que el código no puede resolver por sí solo. Los más importantes son:

1. Una imagen plana no contiene la geometría ni los píxeles ocultos de sus elementos.
2. CSS y GSAP pueden simular profundidad, pero no convertir una composición 2D en una escena 3D real.
3. No se puede garantizar idéntica fluidez, encuadre y ritmo en todos los dispositivos sin diseñar variantes responsivas.
4. Una experiencia muy ligada al scroll nunca tendrá un tiempo idéntico para todos los usuarios.
5. Más efectos no equivalen a más calidad; el exceso puede destruir el foco visual y la elegancia.
6. Los textos históricos no pueden considerarse fiables hasta investigarlos y contrastarlos.
7. La validación estructural automatizada no sustituye una revisión visual en navegadores y dispositivos reales.

La frontera esencial del proyecto es esta:

> Podemos construir una ilusión editorial muy elaborada con imágenes, tipografía y movimiento. No podemos fabricar información visual que no existe y seguir llamándola reproducción fiel de la base.

---

## 2. Clasificación de límites

Para evitar confusiones, este documento utiliza cuatro niveles:

| Nivel | Significado | Decisión habitual |
|---|---|---|
| **Imposible con la fuente actual** | Falta información que no existe en los archivos | Conseguir otro asset o aceptar reconstrucción |
| **Viable con condiciones** | Puede hacerse, pero exige trabajo, pruebas o una versión alternativa | Prototipar y validar antes de consolidar |
| **Viable pero desaconsejado** | Técnicamente posible, pero perjudica experiencia, accesibilidad o mantenimiento | Evitar salvo razón excepcional |
| **Frontera de proyecto** | Contradice decisiones aprobadas o la integridad del trabajo | No implementar sin reabrir formalmente la dirección |

---

## 3. Limitaciones de la imagen maestra y los modelos

### 3.1. Recuperar partes ocultas de una imagen plana

**Clasificación:** imposible con la fuente actual.

La base maestra es una composición rasterizada. Cuando la estatua tapa una muralla o los pinos ocultan una parte de la catedral, los píxeles posteriores no están almacenados detrás. El PNG conoce únicamente el color final de cada píxel.

Por tanto, no es posible eliminar objetos de delante y hacer que aparezcan automáticamente los modelos completos manteniendo fidelidad absoluta. Las únicas soluciones son:

- disponer de los modelos originales independientes;
- disponer del archivo fuente con capas;
- reconstruir las partes ocultas manual o generativamente;
- limitar el recorte a la porción visible.

Toda reconstrucción introduce interpretación. Puede ser visualmente convincente, pero no debe etiquetarse como extracción literal.

### 3.2. Extraer contornos perfectos en elementos complejos

**Clasificación:** viable con condiciones.

Arquitecturas de borde nítido pueden aislarse con máscaras manuales de alta precisión. Vegetación, agua, cabello escultórico, rejas, ramas finas, nubes y transparencias necesitan rotoscopia, matting especializado o fuentes con alfa.

Un recorte perfecto a todas las escalas no existe cuando el borde original ya mezcla objeto y fondo por antialiasing, desenfoque, reflejo o compresión. Es necesario decidir el fondo de destino y ajustar el `decontamination` del borde para él.

### 3.3. Convertir fotografías diferentes en una única cámara coherente

**Clasificación:** viable con condiciones y alcance limitado.

Las referencias proceden de cámaras, horas, ópticas y puntos de vista distintos. Se pueden armonizar color, contraste, escala y perspectiva hasta cierto punto, pero no hacerlas coincidir de manera físicamente exacta sin geometría 3D o nuevas fotografías desde el ángulo necesario.

Una deformación CSS o una homografía corrige planos aproximadamente planos. No corrige volúmenes complejos ni revela sus laterales.

### 3.4. Zoom infinito sobre fotografías 4K

**Clasificación:** imposible sin recursos adicionales.

El zoom tiene un límite definido por la resolución efectiva del recorte. CSS puede ampliar cualquier imagen, pero no crea detalle real. A partir de cierto nivel aparecerán píxeles, halos, ruido o textura sintética.

Alternativas:

- utilizar fotografías de mayor resolución para los primeros planos;
- cambiar de asset durante el acercamiento mediante una transición cuidadosamente alineada;
- limitar el zoom;
- usar detalle gráfico deliberado en lugar de fingir detalle fotográfico.

### 3.5. Parallax 3D verdadero con una sola imagen

**Clasificación:** imposible con la fuente actual.

Podemos separar planos y moverlos a velocidades diferentes, pero eso es 2.5D. No permite rodear un edificio, cambiar considerablemente la cámara ni mostrar laterales ocultos. Un movimiento excesivo revela enseguida huecos, estiramientos y ausencia de información.

Para una cámara libre harían falta modelos 3D, fotogrametría, NeRF/Gaussian Splatting o una colección fotográfica preparada para reconstrucción espacial.

### 3.6. Mantener fidelidad absoluta y completar modelos a la vez

**Clasificación:** contradicción de requisitos.

No se puede exigir simultáneamente que un modelo oculto quede completo y que no se invente ningún píxel. Hay que elegir una de estas modalidades:

- **fidelidad literal:** solo se entrega lo visible;
- **modelo completo:** se reconstruyen o importan las partes ocultas y se documenta su procedencia.

---

## 4. Limitaciones de GSAP y ScrollTrigger

### 4.1. GSAP no diseña la coreografía

**Clasificación:** frontera conceptual.

GSAP permite ejecutar movimientos con precisión, pero no convierte automáticamente una sucesión de secciones en una historia. Las decisiones de foco, dirección, duración, pausa y continuidad siguen siendo trabajo de diseño.

Añadir más timelines, curvas o plugins no arregla una composición repetida.

### 4.2. El progreso depende del comportamiento del usuario

**Clasificación:** viable con condiciones.

En una animación con `scrub`, el usuario controla el avance. Dos personas pueden recorrer la escena a velocidades muy distintas, detenerse a mitad de una palabra o invertir bruscamente la dirección.

No puede garantizarse el tempo exacto de una película sin quitar control al usuario. Debemos diseñar estados intermedios legibles y reservar las animaciones temporizadas para microeventos que toleren interrupciones.

### 4.3. Fijaciones largas y fatiga

**Clasificación:** viable pero desaconsejado en exceso.

`pin` permite sostener una escena mientras avanza la línea temporal. Un metraje excesivo puede hacer que el usuario sienta que hace scroll sin avanzar. También puede complicar la navegación mediante teclado, anclas y historial.

Cada fijación necesita una razón narrativa y una salida perceptible.

### 4.4. Saltos directos a puntos de una timeline

**Clasificación:** viable con condiciones.

Un índice puede desplazar al usuario a etiquetas de ScrollTrigger. El reto es mantener sincronizados:

- posición documental;
- progreso de la línea temporal;
- capítulo activo;
- foco de teclado;
- URL o historial, si se utilizan;
- estado de diálogos y navegación reducida.

Un cambio en la duración de una escena puede desplazar todos los destinos si se calculan con píxeles fijos. Las etiquetas y proporciones deben ser la autoridad.

### 4.5. Cambios de dirección sin mareo

**Clasificación:** viable con condiciones.

Horizontal, diagonal, zoom y vertical pueden convivir, pero no deben cambiar de forma arbitraria. Una concatenación demasiado intensa puede producir desorientación o cinetosis.

Las transiciones deben compartir un ancla visual, desacelerar antes de cambiar de eje y ofrecer una versión estática mediante `prefers-reduced-motion`.

### 4.6. ScrollTrigger y contenido que cambia de tamaño

**Clasificación:** viable con condiciones.

Fuentes tardías, imágenes sin dimensiones, aperturas de diálogo, barras móviles del navegador y cambios de orientación pueden alterar las medidas y desalinear los triggers.

Medidas preventivas:

- reservar dimensiones de imágenes;
- esperar a fuentes y assets críticos;
- usar `ScrollTrigger.refresh()` en momentos controlados;
- recalcular mediante breakpoints;
- evitar refrescos continuos durante el scroll.

### 4.7. Scroll suave de terceros

**Clasificación:** viable pero arriesgado.

Integrar Lenis u otro interpolador puede aportar inercia, pero también introduce otra fuente de tiempo y desplazamiento. Debe sincronizarse con GSAP y puede empeorar accesibilidad, anclas, dispositivos táctiles o navegadores concretos.

El proyecto actual usa scroll nativo. No debe añadirse un motor suave hasta demostrar que resuelve un problema visible.

---

## 5. Límites de CSS visual avanzado

### 5.1. Compatibilidad desigual

**Clasificación:** viable con condiciones.

`mask-image`, filtros encadenados, `mix-blend-mode`, `backdrop-filter`, texto recortado, perspectivas 3D y algunas funciones de color no se renderizan exactamente igual en Chrome, Safari y Firefox.

Cada efecto esencial necesita una degradación aceptable. Ningún contenido principal debe depender únicamente de una máscara o modo de mezcla experimental.

### 5.2. Transparencias y legibilidad

**Clasificación:** frontera de usabilidad.

Los textos translúcidos pueden ser elegantes, pero pierden contraste sobre fotografías variables. Una solución que funciona sobre cielo puede volverse ilegible sobre piedra o vegetación.

Debe mantenerse contraste suficiente mediante veladuras locales, sombras sutiles, gradientes o cambios de posición. La estética no puede hacer invisible el contenido.

### 5.3. Modos de mezcla impredecibles

**Clasificación:** viable con condiciones.

`mix-blend-mode` depende de todos los píxeles situados detrás. Su resultado cambia con la fotografía, el navegador y la composición de capas. Además, `isolation`, filtros y transformaciones crean nuevos contextos de apilamiento.

Úsalo como acento, no como único método para mostrar un texto o control.

### 5.4. `clip-path` y máscaras complejas

**Clasificación:** viable con condiciones.

Las máscaras grandes animadas pueden ser costosas y mostrar bordes dentados. Las formas con cientos de puntos son difíciles de mantener y adaptar a móviles. Una máscara geométrica no comprende el contenido de la imagen.

Conviene utilizar formas simples, pseudo-elementos o SVG cuando se necesite precisión vectorial.

### 5.5. Filtros fotográficos destructivos

**Clasificación:** frontera del proyecto.

Filtros intensos pueden unificar assets, pero también destruir detalle, alterar el aspecto real del patrimonio y volver artificial la base maestra. La base 4K debe permanecer sin tratamiento destructivo.

La armonización debe aplicarse a recursos secundarios y probarse por capítulo.

### 5.6. Tipografías y carga

**Clasificación:** viable con condiciones.

Muchas familias, pesos o variables aumentan el tiempo de carga y pueden provocar saltos de composición. Además, mezclar tipografías sin un sistema claro genera ruido en vez de emoción.

Las fuentes deben precargarse cuando sean críticas, usar `font-display` adecuado y reservar espacio para sus métricas.

---

## 6. Partículas, atmósfera y efectos ambientales

### 6.1. Partículas sobre todo el recorrido

**Clasificación:** viable pero desaconsejado.

Una capa constante de polvo, niebla, chispas o trazos puede unir visualmente los capítulos, pero también ensucia fotografías, roba atención y hace que escenas distintas parezcan iguales.

La atmósfera debe transformarse: polvo mineral en muralla, respiración lenta en parque, luz ascendente en catedral o ondas en la fuente. No debe existir un único preset pegado sobre toda la página.

### 6.2. Canvas de alta densidad

**Clasificación:** viable con condiciones.

Miles de partículas, desenfoques y conexiones por fotograma pueden saturar CPU/GPU, especialmente en pantallas de alta densidad. Aunque el rendimiento no sea la prioridad inicial, una caída intensa de fotogramas destruye la percepción de lujo.

Se debe adaptar densidad a `devicePixelRatio`, tamaño, visibilidad, batería y movimiento reducido. Un efecto que baja de forma sostenida la fluidez deja de ser espectacular.

### 6.3. Partículas que reaccionan al cursor

**Clasificación:** viable con condiciones.

Pueden aportar presencia, pero no deben competir con el scroll ni convertir cada movimiento del ratón en un foco nuevo. En táctil no existe `hover` equivalente. La experiencia principal debe funcionar sin puntero.

### 6.4. Niebla y lluvia sobre una escena diurna

**Clasificación:** frontera estética actual.

Las fases anteriores descartaron niebla y lluvia dominantes para la composición principal. Se pueden usar veladuras mínimas o polvo lumínico en capítulos concretos, pero no reintroducir un clima que contradiga la escena soleada y la legibilidad patrimonial.

---

## 7. Responsive, móvil y dispositivos

### 7.1. Una única coreografía para todas las pantallas

**Clasificación:** imposible si se exige la misma calidad.

Una composición panorámica diseñada para escritorio no puede comprimirse a vertical móvil conservando simultáneamente encuadre, tamaño de texto, dirección del movimiento y espacio negativo.

El contenido puede ser el mismo, pero la coreografía móvil debe reorganizar focos, recorridos y distancias. No basta con reducir escalas.

### 7.2. Barras dinámicas y altura móvil

**Clasificación:** viable con condiciones.

En móviles, la barra del navegador cambia el alto visible durante el scroll. Un uso ingenuo de `100vh` produce saltos. Deben utilizarse unidades dinámicas cuando sean compatibles y una reserva CSS segura.

### 7.3. Orientación y redimensionado

**Clasificación:** viable con condiciones.

Rotar el dispositivo durante una escena fijada puede dejar el progreso en una posición visual incorrecta. Hace falta reconstruir o refrescar timelines, conservando el capítulo activo.

### 7.4. Dispositivos modestos

**Clasificación:** frontera práctica.

No se puede prometer la misma riqueza visual en un móvil antiguo y en un ordenador con GPU dedicada. Deben existir niveles de detalle progresivos: misma historia, diferente densidad de efectos.

---

## 8. Accesibilidad y control del usuario

### 8.1. Movimiento reducido

**Clasificación:** frontera obligatoria.

No puede sacrificarse `prefers-reduced-motion` para conservar la espectacularidad. La alternativa no debe ser una pantalla rota o vacía, sino una narración vertical estática y cuidada.

### 8.2. Contenido únicamente animado

**Clasificación:** viable pero inaceptable.

El texto esencial no debe existir solo durante unos fotogramas ni desaparecer antes de poder leerlo. Debe ser accesible en el DOM y recuperable mediante navegación normal o modo lectura.

### 8.3. Navegación por teclado

**Clasificación:** viable con condiciones.

Los escenarios fijados y transformados visualmente pueden no coincidir con el orden DOM. Hay que mantener una secuencia semántica correcta y evitar que el foco salte a elementos fuera del viewport.

### 8.4. Mareo y sensibilidad vestibular

**Clasificación:** frontera de seguridad.

Zooms profundos, desplazamientos diagonales y fondos que se mueven a distinta velocidad pueden afectar a algunas personas. Debe existir reducción real del movimiento, no solo una animación más rápida.

---

## 9. Contenido, historia y derechos

### 9.1. Textos históricos provisionales

**Clasificación:** imposible considerarlos definitivos sin investigación.

Los relatos de la maqueta construyen tono, no autoridad documental. Fechas, nombres, usos, restauraciones y leyendas deben verificarse con fuentes institucionales o bibliográficas antes de publicación.

### 9.2. Fotografías y licencias

**Clasificación:** frontera legal.

Que una imagen pueda descargarse de Internet no significa que pueda publicarse. Antes del lanzamiento deben registrarse autor, origen, licencia, atribución y permiso de cada asset.

No conviene basar una escena crítica en una imagen cuya licencia no esté clara.

### 9.3. Código e inspiración externa

**Clasificación:** frontera legal y creativa.

Podemos analizar patrones de interacción y recrear conceptos generales. No debemos copiar código cerrado, shaders, ilustraciones, textos ni composiciones distintivas de Sondaven, Nabil Issa, SCFO o ThreeUI sin licencia.

El resultado debe poseer estructura, contenido y ejecución propios.

### 9.4. GSAP y condiciones de uso

**Clasificación:** viable con revisión de licencia.

El paquete incluye GSAP y ScrollTrigger 3.13.0 con sus avisos. Antes de publicar o explotar comercialmente el proyecto debe comprobarse que el uso concreto cumple las condiciones vigentes de GSAP. La decisión técnica no sustituye una revisión de licencia.

---

## 10. Audio y experiencia sensorial

### 10.1. Reproducción automática

**Clasificación:** limitada por navegador y desaconsejada.

Los navegadores restringen audio con sonido antes de una interacción del usuario. Además, reproducirlo sin consentimiento es intrusivo.

La vía correcta es un control explícito, estado recordado durante la sesión, volumen prudente y experiencia completa sin audio.

### 10.2. Sincronización exacta con scroll

**Clasificación:** viable con condiciones.

El audio puede modularse por capítulo, pero buscar continuamente posiciones de una pista al ritmo del scroll genera artefactos. Es preferible combinar capas ambientales, fundidos y eventos discretos en lugar de tratar el scroll como una mesa de edición de audio exacta.

### 10.3. Sonido espacial real

**Clasificación:** viable parcialmente.

Web Audio permite panorámica y filtros, pero la percepción depende de auriculares, altavoces y usuario. No se debe hacer depender la comprensión narrativa del posicionamiento sonoro.

---

## 11. Navegación, URL y arquitectura web

### 11.1. Tratar una sola página como ocho páginas independientes

**Clasificación:** viable con condiciones.

Se pueden actualizar hashes o historial, pero cada capítulo no se convierte automáticamente en una URL indexable con contenido autónomo. Para SEO profundo, compartir capítulos y analítica clara puede ser necesario crear rutas reales o renderizado adicional.

### 11.2. Botón atrás y restauración de scroll

**Clasificación:** viable con condiciones.

Si el índice actualiza el historial, el botón atrás debe restaurar tanto posición como estado visual. De lo contrario, la URL y la timeline quedan desincronizadas.

### 11.3. Apertura directa en un capítulo

**Clasificación:** viable con condiciones.

Entrar mediante hash requiere cargar recursos, medir la página, inicializar ScrollTrigger y después situar el progreso. Saltar demasiado pronto causa encuadres incorrectos.

---

## 12. Rendimiento: aunque todavía no sea prioridad

### 12.1. El rendimiento forma parte de la estética

**Clasificación:** frontera perceptiva.

El usuario ha priorizado belleza sobre optimización durante la exploración. Es una decisión válida para prototipar, pero una experiencia que tartamudea deja de sentirse refinada. No se puede posponer indefinidamente.

### 12.2. Recursos 4K y memoria

**Clasificación:** viable con condiciones.

Una imagen 4K comprimida puede ocupar pocos megabytes en red y decenas de megabytes una vez decodificada. Varias fotografías grandes, máscaras y canvases simultáneos pueden superar la memoria cómoda de móviles.

Se necesitarán variantes responsivas, formatos modernos, precarga selectiva y liberación de escenas lejanas.

### 12.3. Efectos que fuerzan repintado

**Clasificación:** viable pero limitado.

Desenfoques grandes, `backdrop-filter`, sombras amplias, máscaras animadas y propiedades de layout pueden generar repintados costosos. `will-change` tampoco es una solución universal; aplicado a demasiadas capas consume memoria.

### 12.4. Precarga total

**Clasificación:** viable pero desaconsejada.

Cargar todos los recursos antes de mostrar la portada alarga la espera. Cargar demasiado tarde produce apariciones vacías. Necesitamos una estrategia por proximidad narrativa: portada primero, capítulo siguiente en segundo plano y resto de forma progresiva.

---

## 13. Validación y límites del entorno de trabajo

### 13.1. DOM simulado frente a navegador real

**Clasificación:** frontera de validación.

Las pruebas realizadas confirman estructura, etiquetas, eventos y estados de timelines. Un DOM simulado no dibuja píxeles como un navegador real ni detecta:

- recortes visuales;
- contraste real;
- saltos de fuente;
- tartamudeos;
- errores de composición responsiva;
- diferencias de filtros y máscaras;
- sensación subjetiva de ritmo.

No debe declararse una escena visualmente aprobada basándose solo en estas pruebas.

### 13.2. Bloqueo de la vista local automatizada

**Clasificación:** limitación actual del entorno.

La política del navegador disponible bloqueó la dirección local. No se intentó eludirla. Hasta disponer de una previsualización permitida, la revisión debe hacerse en el equipo del usuario mediante servidor local y compartiendo capturas o grabaciones.

### 13.3. Diferencias entre el equipo de desarrollo y el del usuario

**Clasificación:** viable con condiciones.

Fuentes, escalado de Windows, resolución, navegador, sensibilidad del trackpad y refresco de pantalla alteran la percepción. Las decisiones finales de ritmo no deben tomarse sobre un único equipo.

---

## 14. Fronteras que no debemos traspasar

Estas reglas son límites voluntarios del proyecto. Se podrían romper técnicamente, pero hacerlo supondría abandonar la dirección aprobada:

1. **No alterar ni regenerar la imagen maestra 4K.**
2. **No repetir la imagen maestra en todos los capítulos.**
3. **No volver a una plantilla única de imagen, título y texto.**
4. **No llenar la página de cajas, tarjetas o bordes visibles.**
5. **No usar efectos sin función narrativa.**
6. **No mover todos los elementos a la vez.**
7. **No secuestrar la rueda ni imponer saltos bruscos.**
8. **No eliminar la alternativa de movimiento reducido.**
9. **No presentar reconstrucciones como extracciones exactas.**
10. **No usar derivados degradados como nueva fuente maestra.**
11. **No copiar código o identidad visual de las referencias.**
12. **No afirmar que algo está validado visualmente sin haberlo visto.**
13. **No optimizar recortando la esencia antes de cerrar la dirección.**
14. **No añadir otra familia de prototipos sin evaluar primero las tres actuales.**

---

## 15. Matriz de efectos y viabilidad

| Efecto o capacidad | Viabilidad | Riesgo principal | Recomendación |
|---|---|---|---|
| Entrega horizontal entre capítulos | Alta | Exceso de fijación | Mantener y ajustar ritmo |
| Cruce diagonal | Alta | Desorientación | Usar ancla visual y desaceleración |
| Zoom que conecta dos escenas | Alta | Pérdida de resolución | Cambiar de asset durante el acercamiento |
| Máscara circular de revelado | Alta | Coste y bordes | Probar Safari/Firefox y aportar fallback |
| Cambio cromático gradual | Alta | Legibilidad | Animar variables y verificar contraste |
| Texto desde márgenes | Alta | Salida del viewport | Límites responsivos y modo estático |
| Partículas por capítulo | Alta | Ruido y consumo | Densidad pequeña y semántica propia |
| Profundidad 2.5D | Media-alta | Huecos y cartón recortado | Movimientos cortos y assets separados |
| Parallax con cámara libre | Baja | Falta de geometría | Requiere 3D/fotogrametría |
| Modelos completos desde la base plana | Nula | Píxeles inexistentes | Conseguir fuentes o reconstruir y etiquetar |
| Scroll suave adicional | Media | Conflictos y accesibilidad | No añadir hasta detectar necesidad |
| Audio ambiental adaptativo | Media-alta | Autoplay y fatiga | Activación voluntaria y capas suaves |
| Igual experiencia en móvil y escritorio | Nula literalmente | Diferencia de formato | Misma historia, coreografías distintas |
| Hotspots precisos en la portada | Media-alta | Máscaras y escalado | Implementar después de fijar el recorrido |
| WebGL puntual | Media | Complejidad y consumo | Solo si resuelve un capítulo concreto |
| Navegación por hash a capítulos | Alta | Desincronización | Inicializar antes de saltar |

---

## 16. Qué sí podemos llevar muy lejos

Estas limitaciones no reducen la ambición del proyecto. Con los recursos actuales sí es razonable alcanzar un resultado sobresaliente en:

- transiciones de panel completo con continuidad visual;
- ritmos distintos por capítulo;
- tipografía cinética elegante;
- cambios cromáticos progresivos;
- máscaras geométricas y veladuras;
- composiciones editoriales no repetidas;
- parallax corto y controlado;
- partículas ambientales ligeras y específicas;
- navegación directa mediante índice;
- relatos desplegables;
- reversibilidad completa;
- versión estática accesible;
- sustitución progresiva de recursos provisionales por fotografía final.

El proyecto no necesita una cámara 3D libre ni miles de partículas para producir asombro. Su mayor potencial está en coordinar fotografía, escala, vacío, palabra y movimiento con precisión.

---

## 17. Decisiones necesarias antes de producción

Antes de convertir una de las variantes en versión final habrá que decidir:

1. Qué propuesta será la base: Coreografía, Nocturno, Atlas o un híbrido explícito.
2. Cuánto tiempo de scroll debe ocupar cada capítulo.
3. Qué fotografías tienen licencia y resolución suficientes.
4. Qué textos serán literarios y cuáles documentales.
5. Si habrá audio y bajo qué control.
6. Si la portada tendrá hotspots o será únicamente un prólogo.
7. Qué grado de diferencia tendrá la coreografía móvil.
8. Qué navegadores y dispositivos constituyen el soporte mínimo.
9. Qué efectos son esenciales y cuáles pueden degradarse.
10. Quién valida contenido histórico y derechos de imagen.

---

## 18. Conclusión

La frontera real no está en GSAP ni en CSS. Está en la información disponible, la atención humana y la coherencia narrativa.

Podemos hacer movimientos más complejos, pero no recuperar fielmente lo que nunca estuvo en una imagen. Podemos fijar una escena durante miles de píxeles, pero no obligar al usuario a sentir un ritmo cinematográfico. Podemos añadir filtros, partículas y máscaras, pero no compensar con ellos una composición repetida.

La dirección más sólida consiste en aceptar estos límites y convertirlos en lenguaje: movimientos controlados en lugar de cámara libre, capítulos diseñados en lugar de plantillas, cambios de asset en lugar de zoom infinito y una alternativa estática en lugar de excluir a quien no tolere movimiento.

La espectacularidad sostenible vendrá de la precisión de las decisiones, no de intentar que el navegador haga algo que los recursos de origen no permiten.

