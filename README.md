# Portal de Desarrollo Docente · Universidad Norbert Wiener

Sitio institucional para presentar el área, explicar sus cinco procesos y consultar sus fechas, encuentros, metas y resultados. La propuesta mantiene la misma jerarquía para **Inducción, Formación, Acompañamiento, Evaluación y Reconocimiento**, con una consulta más detallada de Evaluación para docentes, directores y autoridades.

**Versión del contenido incluido:** `incluido-v4-gantt-2027`. Esta evolución utiliza el Plan de Desarrollo Docente 2026 **UPNW-GAC-PLA-017, versión 01**, el playbook revisado y la comunicación pública de la universidad. Las decisiones y sus fuentes se registran en [Contenido y fuentes](docs/CONTENIDO-Y-FUENTES.md).

La entrega contiene el proyecto editable y la arquitectura editorial para Google Sheets + Apps Script + Netlify. La compilación estática se genera con `npm run build`. **No acredita una publicación en Internet ni una conexión activa con cuentas institucionales.**

## Empieza por aquí

| Qué necesitas hacer | Dónde comenzar |
| --- | --- |
| Conocer el alcance y los pendientes | [Guía de entrega](docs/ENTREGA.md) |
| Revisar o modificar la web en tu equipo | Sección «Ejecutar el proyecto» de este documento |
| Publicar una copia estática en Netlify | Sección «Publicación en Netlify» |
| Administrar todo el contenido desde Google Sheets | [Administración desde Sheets](docs/ADMINISTRACION-DESDE-SHEETS.md) |
| Entender las pestañas y campos de la hoja | [Guía de las once pestañas](docs/sheets/README.md) |
| Revisar tipografía, fotos, textos alternativos y marca | [Marca y contenido](docs/MARCA-Y-CONTENIDO.md) |
| Consultar el sustento del contenido y las correcciones del plan | [Contenido y fuentes](docs/CONTENIDO-Y-FUENTES.md) |

## Administración editorial: no se edita HTML

Google Sheets es el CMS del portal. La pestaña `contenido` administra textos, títulos, botones, imágenes, enlaces, orden y visibilidad; las pestañas estructuradas administran periodos, Gantt, procesos, eventos, indicadores, formación, recursos y equipo. El código conserva únicamente el diseño, el branding, la accesibilidad y las reglas de presentación.

El flujo previsto es **editar → validar → publicar → solicitar build en Netlify**. El publicador crea versiones JSON inmutables, por lo que una edición con errores no reemplaza silenciosamente la última versión válida. Consulte [Administración desde Sheets](docs/ADMINISTRACION-DESDE-SHEETS.md).

## Qué ofrece el portal

El inicio abre con **«Impulsamos el talento docente»** y la fotografía `gala-dialogo.webp`. Un explorador permite recorrer los cinco procesos con botones y teclado; las flechas izquierda y derecha cambian de proceso, y las teclas Inicio y Fin llevan al primero y al último. **Memoria del área** aparece inmediatamente después del explorador para dar visibilidad temprana a encuentros realizados y sus fuentes.

La nueva composición diagramática de la **Medición Integral de Excelencia Docente (MIDE)** conecta sus cuatro dimensiones. Cada proceso mantiene una página propia, explicación de su contribución, metas y agenda. Evaluación añade la lectura del cronograma por etapas y los encuentros de reconocimiento vinculados con sus resultados.

La agenda ofrece lista y cronograma, filtros por periodo, proceso y modalidad, búsqueda, detalle de cada actividad y exportación de calendario en formato `.ics`. Conserva los nombres y las fechas de origen. El calendario distingue el transcurso de un plazo del estado de ejecución informado; una fecha pasada no confirma por sí misma que una actividad se haya realizado.

El portal también incluye búsqueda general, recursos institucionales, equipo, eventos con fichas propias, galería ampliable y un **modo presentación de siete escenas** para reuniones. Los siete eventos comprenden cinco experiencias realizadas, documentadas en cuatro noticias oficiales, y dos registros futuros de la planificación original. Las jornadas y ciclos pertenecen a Formación; Innovación los presenta por tema y enlaza a las mismas fichas, dentro de un enfoque transversal a los cinco procesos.

### Páginas y rutas

La compilación actual contempla **21 páginas**, incluida la página de error 404. Las fichas de procesos y eventos se generan a partir del contenido publicado; el número de páginas de eventos puede cambiar al actualizarlo.

| Ruta | Contenido |
| --- | --- |
| `/` | Presentación general del área |
| `/el-area/` | Contribución, públicos y equipo |
| `/procesos/` | Vista de los cinco procesos |
| `/procesos/induccion/` | Inducción |
| `/procesos/formacion/` | Formación y rutas formativas |
| `/procesos/acompanamiento/` | Acompañamiento |
| `/procesos/evaluacion/` | Evaluación MIDE y consulta ejecutiva |
| `/procesos/reconocimiento/` | Reconocimiento |
| `/resultados/` | Metas y resultados por proceso |
| `/agenda/` | Agenda, cronograma y eventos |
| `/innovacion/` | Enfoques e iniciativas de mejora |
| `/recursos/` | Referencias y documentos institucionales |
| `/presentar/` | Presentación de siete escenas |
| `/eventos/[nombre-edicion]/` | Siete fichas: cinco memorias documentadas y dos encuentros futuros |
| `/404.html` | Página no encontrada |

Los enlaces de actividades pueden incluir `?actividad=ID&periodo=PERIODO`; la agenda abre el registro correspondiente. El acceso `?proceso=evaluacion` aplica el filtro de Evaluación.

## Diseño y movimiento

El sistema tipográfico combina **N27 Regular y Medium para la introducción, el hero y los H1**, y **Hanken Grotesk para la interfaz, los textos y los H2–H4**. Ambas familias se sirven desde `public/fonts/`; la licencia OFL de Hanken Grotesk se incluye en esa carpeta. La identidad utiliza el turquesa `#07C8CC`, fondos claros, texto oscuro y **geometría diagonal con remate curvo**. Los logos oficiales se conservan intactos.

El playbook institucional fue revisado. Sus reglas incluyen un ancho mínimo digital de **140 px para el logo simple**, **200 px para la versión con tagline** y una reserva de **un módulo del isotipo**. La documentación describe su aplicación en el portal y no constituye una certificación integral de marca.

Las cuatro fotografías del álbum original se complementan con **cuatro imágenes de las noticias oficiales**. Se optimizaron para web conservando su composición y sin retocar personas. La procedencia, los textos alternativos y el tratamiento de las nuevas imágenes se registran en [docs/activos-eventos.json](docs/activos-eventos.json).

La introducción tiene una **secuencia principal de 2,65 segundos**, seguida de una breve transición de salida. Puede omitirse, aparece automáticamente una vez por sesión y dispone de un control para repetirla. El portal incorpora transiciones tipográficas y geométricas, revelado de contenidos al desplazarse y movimiento de la composición MIDE. Respeta la preferencia del sistema de reducir movimiento y ofrece un control para cambiarla. No utiliza audio automático ni sustituye el desplazamiento normal de la página.

En `/presentar/`, las siete escenas se recorren con los botones, los puntos de navegación o las flechas del teclado. La pantalla completa se ofrece cuando el navegador la admite.

## Ejecutar el proyecto

Se requiere **Node.js 24 o superior** y npm. Abra una terminal en la carpeta que contiene `package.json`. Los comandos utilizan un lanzador de Node compatible con Windows, macOS y Linux; no requieren Bash.

Para instalar exactamente las dependencias registradas en `package-lock.json`:

```sh
npm ci
```

También puede utilizar `npm install` para una instalación de desarrollo. Este comando puede actualizar el archivo de bloqueo; conserve esos cambios si decide modificar dependencias.

Para abrir el entorno local de desarrollo:

```sh
npm run dev
```

La terminal mostrará la dirección local. No abra directamente los archivos de `src/`: Astro los transforma en páginas web.

Para validar el contenido y generar una compilación:

```sh
npm run build
```

El resultado queda en `dist/`. Si no hay conexión editorial configurada, el comando valida y utiliza `src/content/site.json`. Si la conexión está configurada, solicita el contenido de Apps Script, lo valida y después construye el sitio. Un fallo de conexión o de validación detiene el build.

Para revisar la compilación local:

```sh
npm run preview
```

Comandos adicionales disponibles:

| Comando | Finalidad |
| --- | --- |
| `npm run validate:content` | Revisar el snapshot local y sus relaciones |
| `npm run build:local` | Compilar directamente el snapshot existente, sin sincronizar con Apps Script; útil después de una sincronización local explícita |
| `node apps-script/tests/content.test.mjs` | Ejecutar las comprobaciones locales del contrato y del publicador con servicios simulados |
| `node scripts/seed-sheets.mjs` | Regenerar las plantillas CSV para Sheets desde el contenido local |

## Publicación en Netlify

### Opción A · Cargar la compilación incluida

Para publicar una copia estática, utilice el despliegue manual de Netlify y cargue **la carpeta `dist/`**, con su `index.html` en la raíz de lo que se publica. No cargue la carpeta del proyecto completo como si fuera la web compilada.

Esta modalidad sirve para presentar el contenido entregado. La carga manual no ejecuta `npm run build` ni conecta Google Sheets. Cuando cambie el contenido o el código, será necesario generar otro `dist/` y cargarlo de nuevo.

### Opción B · Conectar un repositorio

Para mantener una publicación administrable, coloque el proyecto en un repositorio y conéctelo con un sitio de Netlify. El archivo `netlify.toml` ya define:

| Ajuste | Valor |
| --- | --- |
| Versión de Node | `24` |
| Comando de construcción | `npm run build` |
| Directorio de publicación | `dist` |

Si el proyecto está dentro de una subcarpeta del repositorio, configure esa carpeta como directorio base. Mantenga `package-lock.json` en el repositorio y omita `node_modules/`.

La conexión editorial completa utiliza un build hook: el equipo publica desde Sheets, Apps Script genera una versión de contenido y Netlify construye esa versión. Los pasos y las propiedades de las cuentas están en [INTEGRACION.md](docs/INTEGRACION.md). Una solicitud de build aceptada no confirma que el despliegue haya terminado; su resultado se revisa en Netlify.

### Variables de entorno

Estos son los nombres que utiliza el código. Sus valores reales se configuran en el entorno de build; la entrega no contiene secretos.

| Variable | Uso |
| --- | --- |
| `APPS_SCRIPT_CONTENT_URL` | URL real de la aplicación web de Apps Script terminada en `/exec` |
| `APPS_SCRIPT_CONTENT_TOKEN` | Token de lectura generado por el proyecto de Apps Script; privado del build |
| `CONTENT_VERSION` | Opcional: fija una versión concreta para una reconstrucción manual |
| `INCOMING_HOOK_BODY` | Lo proporciona Netlify al recibir el hook; contiene la versión solicitada y no se configura como valor fijo |

Para configurar la conexión en su equipo, copie `.env.example` con el nombre `.env.local` y complete los valores reales. **`npm run build` carga ese archivo opcional automáticamente** antes de sincronizar. Con las variables vacías se utiliza el snapshot incluido.

Si necesita ejecutar solo la sincronización de forma explícita, puede usar:

```sh
node --env-file=.env.local scripts/sync-content.mjs
npm run build:local
```

Mantenga ese archivo fuera del ZIP compartido y del repositorio. No copie tokens a `public/`, `src/`, HTML ni celdas de la hoja. No deje `CONTENT_VERSION` fijada cuando vuelva al flujo habitual de publicación desde Sheets.

## Contenido editable y qué permanece en el desarrollo

**Sheets administra el contenido operativo que la interfaz tiene preparado para mostrar.** No todas las palabras de la web son campos de la hoja.

| Se administra desde Sheets | Permanece en el proyecto web |
| --- | --- |
| Periodos, actividades, responsables, modalidades, fuentes y ejecución informada | Estructura de páginas, diseño de agenda y reglas de interacción |
| Descripciones, beneficios, público y orden de los procesos | Titulares editoriales generales, frases introductorias y explicaciones de recorrido que siguen en Astro o `src/lib/content.ts` |
| Eventos, fechas de realización y publicación, estados, descripción, procesos relacionados y enlaces de noticia, convocatoria o álbum | Composición y diseño de las tarjetas y de las fichas |
| Metas, resultados, periodos, fecha de corte, fuente y universo | Diseño de los indicadores y selección visual de la presentación |
| Rutas, módulos, insignias y enlaces publicados | Estructura visual de Formación; los campos adicionales solo aparecen donde existe una sección implementada |
| Iniciativas con estado y evidencia, documentos y datos del equipo | Narrativa general de innovación y reglas de presentación |
| Referencias de fotografías y pies, junto con las opciones editoriales admitidas | Logos, fuentes, activos optimizados locales y tratamiento visual de imágenes |

Las próximas actividades se calculan a partir de la planificación y la ejecución publicada. Los campos de beneficio y público, las fuentes de indicadores y los enlaces disponibles tienen un uso concreto en la interfaz. Añadir una columna o una clave nueva a Sheets no crea automáticamente un componente ni hace editable otro texto.

Antes de publicar cambios, siga el flujo de validación descrito en la guía editorial. Mantenga vacíos los resultados desconocidos y los enlaces que aún no existen.

Las fechas de publicación de las noticias se conservan separadas de las fechas de realización. Por ejemplo, Conectados con el Rector conserva la fecha de su noticia y no recibe una fecha de evento que la fuente no indica. InnovaIA se describe mediante sus **tres sesiones: 9, 14 y 17 de octubre de 2024**, sin presentar esos días como una actividad continua. Los periodos reconocidos, como 2025-I o 2026-I, tampoco sustituyen a la fecha del encuentro.

## Organización de la entrega

| Carpeta o archivo | Contenido |
| --- | --- |
| `src/pages/` | Páginas y rutas de Astro |
| `src/components/` | Agenda, tarjetas, galería y componentes comunes |
| `src/layouts/`, `src/styles/`, `src/scripts/`, `src/lib/` | Estructura, estilos, comportamiento y transformación de datos para la interfaz |
| `src/content/original.json` | Extracción conservada del archivo original |
| `src/content/site.json` | Snapshot utilizado para construir el portal |
| `public/assets/`, `public/fonts/` | Activos de marca, ocho fotografías optimizadas, N27 y Hanken Grotesk con su licencia OFL |
| `apps-script/` | Publicador, esquema, transformaciones, validación y pruebas locales |
| `scripts/` | Sincronización, validación y preparación de plantillas |
| `docs/` | Entrega, integración, marca y plantillas de Sheets |
| `docs/activos-eventos.json` | Procedencia, dimensiones, textos alternativos y tratamiento de las cuatro fotos oficiales incorporadas |
| `dist/` | Compilación estática para publicar |
| `package.json`, `package-lock.json` | Dependencias y comandos de trabajo |
| `.env.example` | Nombres de las variables de conexión, sin valores privados |
| `astro.config.mjs`, `netlify.toml` | Configuración de construcción y publicación |

## Pendientes de puesta en marcha

La conexión con las cuentas reales de Google y Netlify se completa siguiendo la guía de integración. El publicador tiene comprobaciones locales con servicios simulados; no se ha probado un ciclo de publicación contra las cuentas institucionales.

El contenido conserva **tres documentos sin enlace**, **dos eventos futuros sin URL externa (`EV-02` y `EV-03`)** y **nueve metas sin resultados informados**. Los cinco eventos realizados enlazan a sus noticias oficiales, y Conectados con la Excelencia también dispone del álbum recibido. La interfaz identifica los documentos pendientes y evita botones de convocatoria vacíos; no sustituye información faltante por datos inventados.

La revisión del plan precisa el público de Inducción, corrige a 95 % la meta de satisfacción `KPI-002`, delimita el alcance de Acompañamiento y condiciona la insignia digital o el certificado de Formación a sus lineamientos. Los detalles se conservan en [Contenido y fuentes](docs/CONTENIDO-Y-FUENTES.md). La presencia del archivo QS no se utiliza para afirmar una calificación vigente. La secuencia de activación se resume en [ENTREGA.md](docs/ENTREGA.md).

## Vista previa autónoma

La entrega incluye por separado `Portal_Desarrollo_Docente_Vista_Previa.html`. Ábrelo con un navegador moderno para recorrer las 21 páginas, sus filtros, las memorias de eventos, la introducción y el modo presentación. Contiene los recursos y el contenido del portal; no consulta Apps Script y no modifica Sheets. Los enlaces externos de noticias, álbumes o futuras convocatorias requieren conexión.

El exportador incrusta CSS, fuentes, imágenes y módulos mediante **data URI**, e incluye la portada inicial en **`srcdoc`**. Así evita depender de recursos `blob:` creados en el documento exterior, que fallaban en un visor con origen aislado. La navegación protege las operaciones de historial para que una restricción de esa API no impida mostrar la página. El diseño inicial queda incluido en el archivo; la navegación y las animaciones requieren JavaScript. La barra de accesos de revisión pertenece únicamente a esta vista previa.

Para regenerarlo después de una construcción:

```sh
node scripts/create-preview.mjs
```

Esta copia facilita la revisión. Para publicar en Netlify, utiliza el contenido de `dist/` o conecta el repositorio siguiendo la guía de integración.

La galería admite `galeria_destacados` (IDs de fotos separados por comas) y la portada `portada_foto_id` en la pestaña `config`. `evento_destacado` permite seleccionar el ID de un evento de portada. Cuando se omiten, se utiliza la selección inicial y el evento disponible según fechas.


## Evolución visual premium (noviembre 2026)

El portal aplica un sistema visual unificado inspirado en el master aprobado para DGDD: hero fotográfico, tarjetas de procesos con identidad propia, navegación secundaria por proceso, superficies editoriales, uso institucional de Norby y tipografías N27 + Hanken Grotesk. La actualización cubre Inicio, Nuestra Dirección, Procesos, los cinco procesos, Recursos, Agenda, Innovación, Resultados, eventos y 404.

La lógica de cronograma/Agenda y sus datos se conservan sin cambios funcionales en esta etapa. La actualización del Gantt 2027 se realizará sobre esta base visual.
