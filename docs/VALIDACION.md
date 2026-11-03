# Validación de la entrega

## Construcción e integridad

- Astro genera 21 páginas: inicio, área, procesos, cinco páginas de proceso, resultados, agenda, innovación, recursos, siete eventos, presentación y 404.
- Se mantienen las 72 actividades, 32 módulos formativos, nueve indicadores, 94 registros fotográficos, tres documentos y dos integrantes del equipo de la fuente recibida. La colección de eventos contiene siete registros: cinco actividades realizadas documentadas por cuatro noticias institucionales y dos registros futuros conservados de la fuente original.
- Los nueve resultados de indicadores permanecen sin valor informado. Las metas no se presentan como logros.
- En la actualización anterior, las 40 pruebas locales de integración y publicación pasaron. Esta revisión editorial y visual conserva ese resultado como antecedente; no se volvió a ejecutar la suite de servicios simulados. Incluyen preservación de datos, transformación de diez hojas, fechas reales, referencias, resultados, autorización, versiones, inmutabilidad de snapshots y errores de sincronización. Las dos pruebas añadidas cubren los campos editoriales de eventos y la distinción entre fecha de realización y publicación de una noticia. Los servicios externos se simulan en estas pruebas.
- Una comprobación adicional de la selección de próximas fechas confirma que excluye actividades completadas, conserva una actividad pausada con su estado informado y respeta los cierres y el orden cronológico.

## Revisión en navegador

La revisión inicial en Chrome cubrió la portada, la jerarquía de los cinco procesos, la búsqueda, el cronograma, el detalle de actividades y el modo presentación. Se conserva ese alcance como antecedente de la entrega:

- Evaluación / 2026-II: 26 actividades; a distancia: 22 actividades.
- El Gantt mantiene el nombre completo en una columna fija y contempla fechas hasta enero de 2027.
- Los enlaces de búsqueda abren el detalle y el periodo de la actividad seleccionada.
- El diálogo de actividad cierra con Escape.
- El modo presentación permite elegir sus siete escenas y acceder al detalle de Evaluación.
- El control de movimiento alterna entre movimiento completo y reducido; la repetición de intro queda desactivada al reducir movimiento.
- Se revisaron tamaños de 390 y 768 píxeles mediante marcos de prueba. El contenido móvil no presenta desplazamiento horizontal de página; el diálogo de actividad cabe en su viewport. Se corrigió el desbordamiento de la fotografía de comunidad.
- Se corrigió el desbordamiento horizontal de la escena MIDE y se separaron las etiquetas del sello central.

La actualización de eventos y tipografía se comprobó con un alcance específico:

- La portada muestra tres encuentros destacados y enlaza a la colección completa. La agenda separa dos registros futuros de cinco actividades realizadas.
- Las cuatro fotografías oficiales cargan correctamente. Las tarjetas respetan la proporción de las imágenes panorámicas y las fichas conservan la imagen completa.
- La ficha de Conectados con el Rector identifica el 31 de octubre de 2025 como publicación y explica que la fuente no consigna el día de realización. La ficha de InnovaIA presenta tres sesiones: 9, 14 y 17 de octubre de 2024.
- Se comprobó N27 en el titular principal y Hanken Grotesk en el cuerpo y la interfaz mediante los estilos calculados del navegador.
- En marcos de 390 y 768 píxeles, la portada, la agenda y una ficha histórica no presentan desbordamiento horizontal de página. El logotipo conserva un ancho mínimo de 140 píxeles. Se ajustó el tamaño de los titulares gráficos de eventos para que su caja completa quepa en móvil.

La revisión de tamaños es una comprobación de diseño responsivo en navegador, no una certificación exhaustiva de todos los dispositivos o tecnologías de asistencia.

## Estado real de los servicios

El paquete contiene el código de conexión y las plantillas. No incluye credenciales de cuentas reales. Sheets, Apps Script y Netlify no se han conectado ni desplegado desde esta sesión. La primera publicación con las cuentas institucionales debe comprobar la lectura del snapshot, la versión recibida y el estado final de Netlify.

## Contenido editorial

Los documentos y convocatorias sin URL conservan una presentación informativa, sin botones externos vacíos. La galería enlaza al álbum presente en la fuente. Las iniciativas aparecen cuando se publican registros; la colección inicial está vacía y no se añadieron casos de éxito inventados.

La fecha actual se calcula en America/Lima. El campo legado `fecha_hoy` del archivo original se conserva por compatibilidad de migración, pero no altera la fecha real del portal. No se utiliza la fecha de la consulta como fecha de corte de los indicadores.

## Marca

Se consultaron el playbook y la web institucional. Se conservan los archivos originales de logotipo y N27; se incorpora Hanken Grotesk con su licencia OFL. N27 Medium se declara con su peso real 500 y se utiliza en la introducción y titulares expresivos. Hanken Grotesk se utiliza en textos, navegación, botones y encabezados de consulta. Las fuentes se alojan con el proyecto. Los detalles y sus fuentes figuran en FUENTES.md y MARCA-Y-CONTENIDO.md.

## Copia autónoma de revisión

Se exportaron las 21 páginas en un único HTML con fuentes, imágenes, estilos y módulos incluidos. El paquete autónomo contiene las dos fuentes Hanken Grotesk, su licencia completa y las cuatro fotografías nuevas. En esta actualización se comprobaron en navegador las familias tipográficas, la navegación de portada a Agenda y la apertura de la nueva ficha de InnovaIA con sus tres sesiones. La revisión inicial comprobó además los filtros, un enlace de búsqueda que abre el periodo y la actividad correctos y el cambio de escena en Presentar. La copia usa los mismos documentos del build, con una capa local de navegación.

El build final pasó una revisión de enlaces, anclas, recursos e identificadores duplicados en las 21 páginas: 1.009 referencias locales comprobadas, sin enlaces ni recursos locales rotos. Las páginas temporales de revisión no forman parte de la entrega.

## Corrección de compatibilidad de la vista previa

Se descargó el HTML efectivamente entregado y se comprobó que sus bytes coincidían con la exportación local actualizada. No era la versión anterior de 17 páginas.

Se reprodujo un fallo de visualización al abrir ese HTML dentro de un iframe con `sandbox="allow-scripts"`: los recursos `blob:` creados por el documento exterior no se mostraban en el documento anidado. La portada aparecía sin su diseño, con imágenes rotas y tipografía Times New Roman. Esta prueba identifica una condición reproducible; no presupone la configuración exacta del visor utilizado por el usuario.

El exportador ahora incrusta los recursos de visualización mediante URI de datos, incluye el HTML de la portada desde el primer render y protege las operaciones del historial. La barra superior de revisión ofrece Portada, Ver eventos, Repetir intro y Presentación. Esta barra pertenece únicamente a la copia autónoma de revisión.

La versión corregida pasó la misma prueba de aislamiento: imágenes visibles, N27 y Hanken Grotesk aplicadas, acceso a los eventos, apertura de una ficha nueva, reproducción de la intro y avance de la presentación por teclado y botón. También se comprobó la portada con scripts deshabilitados: conserva el diseño y las imágenes; las interacciones y animaciones requieren JavaScript.


## Revisión «Plan y experiencia» · v3

Snapshot `incluido-v4-gantt-2027`.

- Construcción final correcta: 21 páginas; validador de contenido correcto; plantillas de las diez hojas regeneradas. Se conservan cinco procesos, 72 actividades, siete eventos y nueve indicadores sin resultados inventados.
- Comprobación estática final: 1.009 referencias locales de HTML y CSS, sin referencias rotas ni identificadores duplicados.
- Contraste editorial con el Plan UPNW-GAC-PLA-017 v01: propósito de cada proceso, cuatro tipos y alcance del acompañamiento, reconocimiento de formación condicionado, metas de Inducción para nuevos y reingresantes (90 % de aprobación; 95 % satisfechos o muy satisfechos). Las fechas y actividades del cronograma permanecen conservadas.
- MIDE utiliza «Medición Integral de Excelencia Docente» en portada, proceso, recursos y presentación. Su gráfico mantiene cuatro dimensiones equivalentes y el texto permanece estable durante la animación.
- Portada verificada en escritorio y en marcos de 390 y 768 píxeles. Se revisaron las páginas de área, índice de procesos, Formación, Acompañamiento, Evaluación e Innovación en el marco móvil. Se corrigió un desbordamiento en las tarjetas de dimensiones de Evaluación; el ancho final de la página coincide con el viewport útil.
- Explorador de cinco procesos: selección por clic y navegación con flechas de teclado. El panel visible y el estado de selección cambian de forma coordinada.
- Intro: reproducción manual, cierre con Escape, devolución de foco y control de movimiento reducido. Al reducir movimiento, la portada permanece visible y se desactiva la repetición de intro.
- Desplegable de Acompañamiento: apertura correcta, cuatro tipos y alcance consultables sin desbordamiento. Se unificó su indicador visual.
- Presentación: gráfico y nombre completo de MIDE comprobados a 390 y 1.024 píxeles; cinco metas visibles y etiquetadas como metas. Esta revisión no constituye una certificación de dispositivos físicos.
- Agenda: filtro de Evaluación y vista Cronograma verificados; devuelve 26 actividades de 2026-II. Se armonizaron superficies, bordes y barras con la paleta institucional, preservando las diferencias y etiquetas de estado.
- Exportación autónoma de 21 páginas (aproximadamente 6,97 MB): comprobada dentro de un iframe con `sandbox="allow-scripts"`. Fuentes aplicadas, fotografías sin roturas, explorador operable por teclado y apertura de la ficha canónica de II Jornada de Buenas Prácticas Docentes. La ficha identifica Formación y separa la fecha de publicación de la fecha no documentada del encuentro.
- No se modificaron credenciales ni se conectaron o publicaron servicios externos.

La barra de la vista autónoma también regresa al inicio cuando se selecciona Portada desde la propia portada, sin recargarla ni reproducir de nuevo la intro. Esta navegación se comprobó con interacción directa.
