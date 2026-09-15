# Comparación cruzada · ocho capítulos en tres modelos

Los módulos de los tres modelos llaman a `loadPlasenciaData()` y renderizan los mismos objetos de `data/chapters.json`. La prueba DOM compara en las 24 escenas el título, la introducción y los tres bloques históricos con esa fuente central. Por tanto, hechos, fechas y fuentes permanecen iguales; cambia la puesta en escena.

| Capítulo | Atlas sensible | Cronología horizontal | Reescritura integral | Igualdad factual | Diferencia técnica | Estado visual |
|---|---|---|---|---|---|---|
| Muralla | Hoja perimetral, bloques y dos fragmentos fotográficos. | Estación de basamento dentro del transporte temporal. | Estratos de muro que abren una brecha. | Comprobada contra JSON. | Composición, ritmo y transición distintos. | Pendiente de revisión humana en navegador. |
| Puerta del Sol | Umbral estrecho con exterior/interior. | El transporte se frena ante una estación-portal. | Túnel de tres planos y profundidad. | Comprobada contra JSON. | Hoja, estación y túnel no comparten estructura. | Pendiente de revisión humana en navegador. |
| Plaza Mayor | Lámina coral con voces alrededor de una imagen. | Plaza expandida en doce columnas dentro del friso. | Apertura radial con tres focos independientes. | Comprobada contra JSON. | Focos, jerarquía y entrada propios. | Pendiente de revisión humana en navegador. |
| Catedral | Pliego doble Vieja/Nueva con eje vertical. | Torre tipográfica; el eje horizontal exterior se detiene. | Pozo de luz con ascenso y contradescenso. | Comprobada contra JSON. | Tres ritmos verticales, sin clonación de panel. | Pendiente de revisión humana en navegador. |
| Ayuntamiento y Mayorga | Hoja cívica con órbita y tres pulsos. | Estación de reloj y dos escalas fotográficas. | Cámara circular y cronología orbital. | Comprobada contra JSON. | Diferentes relaciones entre fachada, figura y tiempo. | Pendiente de revisión humana en navegador. |
| Acueducto | Desplegable técnico con cauce curvo. | Estación longitudinal dentro del transporte global. | Corte diagonal que enlaza imagen y datos. | Comprobada contra JSON. | E1 local cumple funciones distintas dentro de cada arquitectura. | Pendiente de revisión humana en navegador. |
| Parque de los Pinos | Claro vegetal con pausa extensa. | Estación silenciosa que desacelera el transporte. | Cámara abierta con memoria en el margen. | Comprobada contra JSON. | Vacío, foco y duración diferentes; tono documental común. | Pendiente de revisión humana en navegador. |
| Alfonso VIII | Folio final con eco circular. | Estación terminal fechada en el presente monumental. | Cámara frontal y pedestal tipográfico. | Comprobada contra JSON. | Cierres distintos sin devolver físicamente la cronología a 1186. | Pendiente de revisión humana en navegador. |

La comparación técnica está completada. La aprobación visual cruzada no se declara: el navegador de revisión no pudo abrir el host local supervisado y devolvió `net::ERR_BLOCKED_BY_CLIENT`.
