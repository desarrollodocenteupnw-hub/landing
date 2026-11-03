# Entrega del portal de Desarrollo Docente

## Qué se entrega

Un portal institucional estático, desarrollado con Astro, para presentar el área de Desarrollo Docente de la Universidad Norbert Wiener, explicar sus cinco procesos y facilitar la consulta de actividades, eventos, metas y resultados.

El snapshot de esta entrega es **`incluido-v4-gantt-2027`**. El contenido público se ha contrastado con el Plan de Desarrollo Docente 2026 **UPNW-GAC-PLA-017, versión 01**, y con la comunicación de la web institucional. El detalle de las fuentes está en [CONTENIDO-Y-FUENTES.md](CONTENIDO-Y-FUENTES.md).

La entrega reúne el **código fuente editable**, los **activos de marca y fotografías**, una **compilación en `dist/`**, el **publicador de Apps Script**, las **plantillas de Google Sheets** y las guías para completar la conexión con Netlify. No se presenta como un sitio ya publicado ni como una integración activa con cuentas externas.

## Decisiones de producto

### Un área completa, con profundidad en Evaluación

Inducción, Formación, Acompañamiento, Evaluación y Reconocimiento comparten una misma jerarquía de navegación y presentación. El explorador de Inicio permite seleccionarlos con botones o con las teclas de flecha, Inicio y Fin. Cada proceso tiene una página propia y acceso a su contribución, públicos, metas y calendario.

Evaluación dispone de una consulta más detallada: una nueva composición diagramática de las cuatro dimensiones de la **Medición Integral de Excelencia Docente (MIDE)**, el cronograma organizado por etapas y vínculos a los encuentros de reconocimiento asociados con la evaluación docente. Ese detalle responde a la información disponible y a las necesidades de autoridades y responsables académicos; no convierte al resto de procesos en secciones secundarias.

El portal permite dos formas de recorrer el área: navegación por páginas para la consulta habitual y modo presentación para una reunión. La portada abre con **«Impulsamos el talento docente»** y sitúa **Memoria del área** después del explorador de procesos, antes de Evaluación, Innovación y Agenda. Las jornadas y ciclos se conservan en Formación; Innovación los reúne por tema y enlaza a sus mismas fichas, con un enfoque transversal al trabajo del área.

### Agenda para consultar y actuar

La agenda conserva la planificación original y permite alternar entre lista y cronograma. Incluye filtros por periodo, proceso y modalidad, búsqueda, ampliación del detalle y exportación `.ics` de la selección o de una actividad.

Las fechas programadas y la ejecución reportada son conceptos distintos. El paso del tiempo no completa una actividad ni genera un porcentaje de avance. Los próximos registros se seleccionan con criterios comunes para Inicio y Presentación, teniendo en cuenta la ejecución publicada.

### Memorias con fuentes identificadas

El contenido reúne **siete eventos**: cinco experiencias realizadas, documentadas por cuatro noticias oficiales, y dos registros futuros procedentes de la planificación original. La noticia sobre las capacitaciones de 2024 documenta dos actividades distintas: el ciclo InnovaIA y la Jornada de Buenas Prácticas Docentes. Cada una tiene su propia ficha y conserva el enlace a la fuente compartida.

Las fichas separan la fecha de publicación de la noticia, la fecha de realización y la edición o periodo reconocido. Conectados con el Rector no tiene una fecha de evento informada; la publicación del 31 de octubre de 2025 se identifica como tal. InnovaIA muestra sus tres sesiones del 9, 14 y 17 de octubre de 2024. Las fuentes, el inventario de fechas y los criterios de uso están en [MARCA-Y-CONTENIDO.md](MARCA-Y-CONTENIDO.md#noticias-y-memorias-del-área).

### Metas y resultados con contexto

Las metas y los resultados se muestran en espacios separados. Un resultado vacío aparece pendiente de publicación. Cuando se informa un resultado, debe acompañarse de periodo, fecha de corte y fuente; el universo se muestra cuando está disponible. El cero se considera un resultado real y no se utiliza para sustituir un dato desconocido.

El contenido conserva nueve metas y no añade resultados que la fuente no proporciona. Carrera docente permanece como indicador transversal, sin crear un sexto proceso institucional.

### Precisiones incorporadas desde el plan

- **Inducción:** las etiquetas de `KPI-001` y `KPI-002` incluyen docentes nuevos y reingresantes. La meta de satisfacción `KPI-002` es **95 %** y se refiere a quienes están satisfechos o muy satisfechos; su resultado permanece vacío.
- **Acompañamiento:** el detalle desplegable recoge sus cuatro tipos, la priorización por necesidades y el alcance que exceptúa a docentes que desarrollan sus actividades en campos clínicos.
- **Formación:** completar una línea puede reconocerse mediante insignia digital o certificado, según el cumplimiento de los módulos, las condiciones y los recursos vigentes. El detalle del proceso reúne esos requisitos.

Las referencias de página y apartado se conservan en [Contenido y fuentes](CONTENIDO-Y-FUENTES.md), sin trasladar el texto completo del plan a la web pública.

## Alcance de las páginas

La compilación actual incluye **21 páginas contando la 404**: Inicio; El área; directorio de Procesos; las cinco páginas de proceso; Metas y resultados; Agenda; Innovación; Recursos; Presentación; y siete fichas de eventos. Las rutas y sus destinos se detallan en el [README principal](../README.md#páginas-y-rutas).

Las fichas de eventos se generan a partir del contenido publicado. La agenda y la búsqueda permiten abrir una actividad mediante un enlace con su ID y periodo. Los recursos y convocatorias sin URL no se presentan como botones vacíos.

## Identidad y experiencia visual

El sistema combinado utiliza **N27 Regular y Medium para la introducción, el hero y los H1**, y **Hanken Grotesk para interfaz, textos y H2–H4**. Las fuentes se alojan en `public/fonts/`, que incluye la licencia OFL de Hanken Grotesk. La identidad utiliza turquesa `#07C8CC`, fondos claros, texto oscuro y geometría diagonal con remate curvo.

Los logos oficiales se conservan sin reconstrucción ni deformación. El playbook institucional ya fue revisado: establece un ancho mínimo digital de 140 px para el logo simple, 200 px para la versión con tagline y una reserva de un módulo del isotipo. La entrega documenta estas reglas y su aplicación, sin certificar una conformidad visual integral.

La portada utiliza **`gala-dialogo.webp`**, seleccionada mediante `portada_foto_id`. Las cuatro fotografías del álbum original y las cuatro imágenes de noticias oficiales se conservan como activos optimizados. Las imágenes de noticias mantienen su composición y dimensiones completas, sin retoque de personas; su procedencia y tratamiento se documentan en [activos-eventos.json](activos-eventos.json).

La introducción tiene una secuencia principal de **2,65 segundos** y una breve transición de salida. Se puede omitir o repetir, y se reproduce automáticamente una vez por sesión. El movimiento combina tipografía, geometría y revelado de contenido al desplazarse. La preferencia de movimiento reducido elimina los efectos decorativos; también existe un control en el portal. La lectura y el acceso a la información no dependen de terminar una animación.

El modo presentación contiene siete escenas: área, cinco procesos, metas, Evaluación MIDE, innovación, próximas fechas y comunidad. Ofrece navegación mediante teclado y botones, selección directa de escena y pantalla completa cuando el navegador lo admite.

El documento [MARCA-Y-CONTENIDO.md](MARCA-Y-CONTENIDO.md) incluye las fuentes de las fotografías y noticias, sus textos alternativos, recomendaciones de encuadre y reglas del playbook revisado. El archivo de QS se conserva entre los activos recibidos, sin utilizarlo para afirmar una calificación vigente.

La vista previa autónoma incorpora la portada inicial en `srcdoc` y sus recursos mediante data URI para evitar la dependencia de recursos `blob:` del documento exterior en visores con origen aislado. Mantiene accesos de revisión a portada, eventos, repetición de intro y presentación. Los comandos de regeneración y sus límites están en el [README](../README.md#vista-previa-autónoma).

## Administración editorial

El modelo de publicación es:

1. El equipo edita y revisa las filas de Google Sheets.
2. Apps Script valida el contenido publicado y genera un JSON con una versión única.
3. El publicador solicita a Netlify construir esa versión mediante un build hook.
4. El build descarga y valida el JSON, genera el sitio y permite comprobar el despliegue en Netlify.

Las visitas al sitio reciben páginas estáticas. No necesitan entrar a Sheets ni ejecutar Apps Script en cada carga. Una solicitud de build aceptada no confirma que el sitio ya se haya actualizado; el resultado efectivo se consulta en Netlify.

### Qué puede editar el equipo

Las once pestañas administran periodos, procesos, actividades, eventos, indicadores, oferta formativa, iniciativas, recursos, equipo y opciones de configuración admitidas. Incluyen los beneficios y públicos de los procesos, fuentes de resultados, enlaces disponibles y datos que alimentan las próximas actividades.

El equipo puede cambiar contenido operativo y su visibilidad sin editar código una vez conectada la integración. Debe conservar los IDs y relaciones, distinguir `borrador`, `publicado` y `archivado`, y completar las evidencias exigidas antes de publicar resultados o iniciativas implementadas.

### Qué sigue requiriendo desarrollo

La estructura de las páginas, los estilos, las animaciones, las reglas de interacción, las plantillas de presentación y buena parte de los titulares y textos editoriales generales permanecen en Astro y TypeScript. Las explicaciones de recorrido y los textos de respaldo también siguen en el proyecto.

Sheets no es un editor visual del sitio. Un campo adicional o una clave de configuración nueva requiere que la interfaz tenga lógica para mostrarlo. Tampoco administra permisos, tokens, build hooks, fuentes tipográficas ni reglas de hosting. La matriz de responsabilidades está en el [README](../README.md#contenido-editable-y-qué-permanece-en-el-desarrollo).

## Comprobaciones y límites de la entrega

La suite local del publicador y el contrato editorial pasó **40 pruebas**, tras añadir dos comprobaciones al conjunto anterior. Cubre conservación de datos, transformación desde las tablas, relaciones, fechas, estados, resultados, autenticación del endpoint, versiones y tratamiento de fallos. Estas comprobaciones utilizan servicios simulados. Su resultado no demuestra acceso a una cuenta real, permisos efectivos del dominio de Google ni un despliegue externo de Netlify.

La conexión institucional se verifica al configurar las cuentas, publicar una versión de prueba controlada y comprobar que Netlify construye exactamente esa versión. Si el dominio impide que la aplicación web atienda la petición de build sin una sesión interactiva, deberá acordarse un mecanismo compatible con la política institucional antes de activar ese flujo.

La compilación incluida permite revisar el portal sin esa conexión. En desarrollo, `npm run build` valida el snapshot local si no hay endpoint configurado; con endpoint configurado, los errores de acceso o contenido detienen la construcción para evitar anunciar una actualización que no se produjo.

## Pendientes verificables

| Pendiente | Situación de la entrega | Siguiente paso |
| --- | --- | --- |
| Google Sheets, Apps Script y Netlify | Código, esquema, plantillas y documentación preparados; cuentas externas sin conectar | Configurar con las cuentas responsables y ejecutar el ciclo de publicación descrito en la guía |
| Enlaces de tres documentos | Vacíos en la fuente; se identifican como referencias pendientes de enlace | Incorporar las URLs institucionales cuando estén disponibles |
| URL externa de dos eventos futuros | Solo `EV-02` y `EV-03` siguen sin URL; las cinco memorias tienen noticia oficial y `EV-01` también dispone de álbum | Añadir las páginas o convocatorias reales cuando estén disponibles |
| Resultados de nueve metas | Nueve metas disponibles y resultados vacíos | Publicar valores únicamente con fecha de corte y fuente; añadir universo cuando corresponda |
| Casos estructurados de innovación | Innovación y Formación muestran experiencias documentadas; el catálogo editorial de iniciativas sigue vacío | Incorporar casos con estado, intervención y evidencia; las noticias de actividades no sustituyen resultados medidos |

Estos pendientes no impiden revisar la propuesta ni publicar una copia estática con el contenido incluido. Sí determinan qué información adicional podrá comunicar el portal y cuándo podrá actualizarse desde la hoja institucional.

## Activación recomendada

1. Abra la compilación mediante un servidor local o ejecute el proyecto siguiendo el [README](../README.md). Revise especialmente los responsables, fechas y descripciones públicas.
2. Defina quién revisa el contenido y quién administra las credenciales de Apps Script y Netlify.
3. Importe las diez plantillas de `docs/sheets/` conservando encabezados e identificadores.
4. Configure Apps Script y Netlify siguiendo [INTEGRACION.md](INTEGRACION.md). Introduzca solo las URLs y variables reales de sus cuentas.
5. Complete los enlaces y datos que estén disponibles, valide una publicación y compruebe el resultado del build en Netlify.
6. Mantenga el código y la documentación junto con las versiones editoriales para poder reconstruir la publicación.

Para una presentación inmediata sin conectar las cuentas, puede cargar `dist/` mediante el despliegue manual de Netlify. Esa copia se actualizará con una nueva carga de `dist/`; la actualización desde Sheets requiere la conexión editorial completa.

## Guías incluidas

- [README principal](../README.md): ejecución local, comandos, rutas, distribución y alternativas de publicación.
- [Integración editorial](INTEGRACION.md): configuración de cuentas, variables, build hooks, versiones y mantenimiento.
- [Pestañas de Sheets](sheets/README.md): campos, relaciones y reglas de publicación.
- [Marca y contenido](MARCA-Y-CONTENIDO.md): identidad, imágenes, textos alternativos y criterios editoriales.
- [Contenido y fuentes](CONTENIDO-Y-FUENTES.md): aplicación del plan, correcciones de indicadores y referencias institucionales.

