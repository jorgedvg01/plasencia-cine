# Cinematic Novel — assets de transición

Esta carpeta contiene las **costuras vivas** entre capítulos. No son fondos completos: se colocan por encima de dos escenas y se desplazan a distinta velocidad para que el límite entre capítulos deje de sentirse como una diapositiva.

## Costuras
- `seam_muralla-puerta.svg`: masa de piedra/sombra; prepara el paso hacia el arco.
- `seam_puerta-plaza.svg`: laterales oscuros de arco; la cámara sale de la puerta y abre la plaza.
- `seam_plaza-catedral.svg`: copa vegetal; rompe la frontera horizontal y prepara el ascenso.
- `seam_catedral-ayuntamiento.svg`: **vegetación colgante inspirada en la costura 05→06 del mural aprobado**; es la referencia principal del sistema.
- `seam_ayuntamiento-acueducto.svg`: árbol/tronco lateral; oculta el cambio y abre el travelling del acueducto.
- `seam_acueducto-parque.svg`: masa de pinos; los árboles empiezan perteneciendo al acueducto y terminan perteneciendo al parque.
- `seam_parque-monumento.svg`: vegetación a contraluz que conduce al epílogo nocturno.

## Regla de montaje
Las costuras deben entrar **antes** de que termine el capítulo A y seguir visibles **después** de que empiece B. Nunca usar `fade` como transición principal. La profundidad se obtiene mediante 2–3 velocidades (background / seam / foreground) y oclusión natural.

## Dirección editorial
Cada capítulo tiene una composición tipográfica diferente (`layout-left`, `right`, `split`, `left-low`, `right-high`, `wide`, `quiet`, `center`). La variedad debe seguir siendo parte del mismo sistema: serif editorial, marfil cálido, microtipografía espaciada, negros profundos y movimiento contenido.

Los fondos fotográficos tienen fallback a los medios existentes del proyecto para que la rama siga siendo revisable mientras se sustituyen progresivamente por masters aprobados de mayor resolución.