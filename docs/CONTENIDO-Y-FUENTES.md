# Contenido público y fuentes del portal

## Alcance de esta actualización

**Versión del snapshot:** `incluido-v4-gantt-2027`.

La redacción pública de los cinco procesos y de las cuatro dimensiones de MIDE se revisó a partir del **Plan de Desarrollo Docente 2026**, código **UPNW-GAC-PLA-017**, versión 01, revisión 01, fecha **06/05/2026**. El archivo adjunto contiene 25 páginas; las referencias de esta nota corresponden a su numeración impresa.

Se mantienen los cinco procesos principales del portal: Inducción, Formación, Acompañamiento, Evaluación y Reconocimiento. La redacción expresa propósitos, acciones y beneficios previstos por el plan. No presenta las metas como resultados alcanzados ni atribuye al área impactos cuantificados sin una fuente de ejecución.

Los textos de entrada son breves y públicos. Los criterios de elegibilidad, condiciones de certificación, alcance y metodología corresponden al detalle de cada proceso; no se convierten en titulares de portada.

La voz pública se contrastó con estas páginas oficiales:

- [Nosotros](https://www.uwiener.edu.pe/nosotros/): propósito educativo, calidad, valores y contribución de las personas.
- [Presentación del Modelo Educativo Wiener 2026](https://portaldelestudiante.uwiener.edu.pe/noticias/conoce-el-modelo-educativo-wiener-2026-educacion-que-transforma/): lenguaje breve, cercano y orientado a la experiencia de aprendizaje.
- [Reconocimiento docente 2026-I](https://www.uwiener.edu.pe/noticias/docentes-destacados-de-la-universidad-norbert-wiener-recibieron-reconocimiento-por-su-excelente-labor-en-el-periodo-academico-2026-i/): comunidad, reconocimiento y evidencia vinculada con Evaluación.

Los titulares del portal son redacción editorial propia. No se presentan como nuevos eslóganes oficiales ni trasladan las acreditaciones o los resultados generales de la universidad a la DGDD.

## Fuentes por contenido

| Contenido | Sustento en el plan | Aplicación editorial |
| --- | --- | --- |
| Propósito integral del desarrollo docente | P. 7, §3.2; pp. 8–9, §3.4 | Vincular el desarrollo del perfil docente con docencia, investigación, visión global, impacto social y mejora continua de la calidad educativa. |
| Innovación pedagógica y digital | P. 7, §§3.1.1–3.1.5; pp. 11–14, capítulo V | Presentar aprendizaje activo, uso ético de tecnologías e IA, formación progresiva y capacidades docentes como enfoques del trabajo. No inventar proyectos ejecutados. |
| Inducción | Pp. 9–10, §§4.1–4.3 | Incorporación de docentes nuevos y reingresantes; reunión institucional DGDD, reunión académica inicial y curso autoinstructivo con recursos de apoyo. |
| Formación | Pp. 11–14, §§5.1–5.5 y tabla 2 | Ocho líneas y cuatro módulos por línea; competencias pedagógicas, digitales, de investigación y de docencia clínica; reconocimiento de hitos formativos. |
| Acompañamiento | Pp. 14–16, §§6.1–6.4 | Observación, orientación y retroalimentación; acompañamiento pedagógico, académico, administrativo y soporte basado en evaluación. |
| Evaluación | Pp. 16–18, §§7.1–7.1.4 | Lectura integral del desempeño y uso de resultados para formación, acompañamiento y reconocimiento. |
| Dimensiones MIDE | P. 17, §7.1.2 | Docencia, investigación, visión global e impacto social, descritas por su contribución a la práctica académica. |
| Reconocimiento | Pp. 18–20, §§7.2–7.2.3; tabla 5, p. 19 | Escala A de la dimensión Docencia con periodicidad semestral y mejores resultados MIDE con periodicidad anual. |
| Carrera docente | Pp. 20–22, capítulo VIII | Información complementaria de trayectoria. No se confunde con una categoría de reconocimiento ni se añade un sexto proceso a esta estructura. |

## Sistema de mensajes por proceso

`src/lib/content.ts` conserva los campos `lead`, `benefit`, `audience`, `eyebrow` y `steps`, y añade `verb` y `teaser` para las entradas visuales del portal. Cada teaser contiene como máximo 18 palabras.

| Proceso | Verbo | Titular |
| --- | --- | --- |
| Inducción | Conecta | Tu experiencia Wiener empieza aquí. |
| Formación | Evoluciona | Nuevas capacidades para transformar tu práctica. |
| Acompañamiento | Fortalece | Un acompañamiento que fortalece tu enseñanza. |
| Evaluación | Comprende | Evaluar para seguir creciendo. |
| Reconocimiento | Inspira | La excelencia docente merece ser reconocida. |

Las descripciones y los beneficios de `src/content/site.json` siguen este mismo enfoque. Se incorpora a los docentes reingresantes en el público de Inducción, conforme a §4.1: reingreso después de más de un año de inactividad.

## Denominación MIDE

Por corrección expresa del usuario, la denominación unificada es **Medición Integral de Excelencia Docente (MIDE)**. Esta forma se aplica en los textos actualizados, aunque el plan utiliza variantes del nombre en algunos apartados. Las cuatro dimensiones se conservan sin cambios de denominación.

## Precisión de los indicadores de Inducción

Ambas etiquetas incluyen ahora **docentes nuevos y reingresantes**, de acuerdo con el alcance del proceso:

| Indicador | Etiqueta vigente | Meta |
| --- | --- | --- |
| `KPI-001` | Docentes nuevos y reingresantes que aprueban el curso de inducción (nota mínima 14) | 90 % |
| `KPI-002` | Docentes nuevos y reingresantes satisfechos o muy satisfechos con la inducción | 95 % |

La única meta numérica modificada es `KPI-002`, que pasa de **80 % a 95 %**. El sustento es la **página 10, §4.5.1.b** del plan. Ambos campos `valor` permanecen vacíos: la corrección precisa los compromisos del plan y no incorpora resultados de aprobación ni satisfacción. Se conservan los periodos, las fechas y las actividades.

## Certificación y reconocimiento de la formación

Se retira la promesa exclusiva de que completar una línea siempre entrega una insignia digital. La **página 13, §5.5.4**, contempla **una insignia digital o un certificado de reconocimiento**, de acuerdo con los lineamientos y recursos vigentes, una vez completados satisfactoriamente los cuatro módulos.

Los criterios del §5.5 incluyen participación, producto acreditable cuando corresponda y evaluación aprobatoria. En el texto público breve se comunica el reconocimiento de los hitos de formación; las condiciones se consultan en el detalle del proceso. Los nombres de las ocho insignias y los 32 módulos de la oferta formativa se mantienen como datos del plan.

## Alcance del acompañamiento y categorías de reconocimiento

- El acompañamiento responde a necesidades identificadas y criterios de priorización. El alcance del §6.2.1 exceptúa a quienes desarrollan sus actividades en campos clínicos; por ello no se promete atención indistinta a toda la plana docente.
- La página reúne en un desplegable los cuatro tipos del §6.3: pedagógico, académico, administrativo y soporte pedagógico a partir de la evaluación. Allí explica también el alcance y la priorización del §6.4.
- El acompañamiento académico se articula con los directores de programa o con quienes designen. La redacción evita atribuir todas sus acciones exclusivamente a DGDD.
- La escala A semestral en la dimensión Docencia y los mejores resultados MIDE anuales son las categorías descritas en la tabla 5. La meta de evaluación de 50% en escalas A y B no amplía la categoría de reconocimiento semestral.

## Eventos, agenda y fotografía de portada

Se conservan los **siete eventos** cargados: cinco experiencias realizadas procedentes de cuatro noticias y dos registros futuros. Las jornadas de buenas prácticas y el ciclo InnovaIA permanecen en **Formación**; **Innovación educativa** se mantiene como tema. La página Innovación presenta dos muestras editoriales —IA en la docencia y buenas prácticas— que enlazan a las fichas canónicas de esos eventos. No se duplican registros ni se cambian sus fechas, cifras o relaciones. El inventario de noticias está en [MARCA-Y-CONTENIDO.md](MARCA-Y-CONTENIDO.md#noticias-y-memorias-del-área).

Las fechas exactas de la agenda provienen de los datos ya integrados. Las tablas por meses o semanas del plan no se utilizan para inferir ni reemplazar esas fechas.

Por selección expresa para esta evolución visual, la configuración `portada_foto_id` apunta a **`1ehOjGeOw7WXfxwXa-GFL1bwDLjDvzDoC`**, fotografía de diálogo de la galería existente, disponible como `public/assets/gala-dialogo.webp`. Se conserva la galería completa, sin sustituir registros ni atribuir nuevas identidades a las personas fotografiadas.

La portada **«Impulsamos el talento docente»** presenta el explorador de los cinco procesos y acerca las memorias documentadas al inicio, antes de los bloques de MIDE, Innovación y Agenda. Los detalles visuales y de movimiento se documentan en [Marca y contenido](MARCA-Y-CONTENIDO.md).

## Preservación y salida editorial

- `src/content/original.json` conserva íntegramente la fuente histórica.
- Las utilidades de fechas, enlaces, búsqueda, eventos y filtros de `src/lib/content.ts` se conservan.
- Los resultados no publicados continúan vacíos. No se convierten metas, porcentajes o número de fotografías en indicadores de impacto.
- Las tablas de `docs/sheets/` se regeneran desde el contenido vigente con `node scripts/seed-sheets.mjs`, sin inicializar de nuevo el portal y sin conectar ni modificar Google Sheets.
- La comprobación estructural se ejecuta con `node scripts/validate-content.mjs`.
