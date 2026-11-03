# Guía del CMS del Portal DGDD en Google Sheets

Google Sheets es la **fuente de verdad del contenido** del portal. El equipo puede cambiar textos, títulos, enlaces, imágenes, orden, visibilidad, periodos, actividades, responsables, eventos, recursos, oferta formativa, indicadores e integrantes del equipo **sin editar HTML ni Astro**.

El proyecto web conserva únicamente el diseño, la accesibilidad, las animaciones, las reglas de validación y la forma en que se presentan los datos.

## Pestañas administrables

| Pestaña | Filas iniciales | Qué administra |
|---|---:|---|
| `config` | 5 | Configuración general y referencias editoriales |
| `periodos` | 4 | Periodos académicos e inicio/fin de cada ciclo |
| `procesos` | 5 | Nombres, descripción, beneficio, público y participación de los cinco procesos |
| `actividades` | 144 | Gantt/agenda: actividades, fechas, responsables, modalidad, fase, hitos y ejecución |
| `eventos` | 7 | Convocatorias, encuentros y memoria de eventos |
| `indicadores` | 9 | Metas y resultados publicados |
| `oferta_formativa` | 40 | Rutas/líneas y módulos de formación |
| `iniciativas` | 0 | Iniciativas de innovación y mejora |
| `recursos` | 97 | Documentos, enlaces, videos y fotografías |
| `equipo` | 2 | Personas y cargos publicados |
| `contenido` | 640 | CMS editorial: palabras, títulos, botones, imágenes, enlaces, orden y visibilidad del portal |

Todas las pestañas de contenido incluyen `estado_publicacion`.

## La pestaña `contenido`: donde se cambia la web sin tocar código

Es la pestaña principal para cambios editoriales. Cada fila representa una pieza del portal.

| Campo | Uso |
|---|---|
| `id` | Identificador estable. No cambiar salvo que se esté creando una pieza nueva |
| `grupo` | Agrupa elementos repetibles, como navegación, dimensiones MIDE o tarjetas |
| `pagina` | Página donde se utiliza el contenido |
| `seccion` | Bloque de la página |
| `tipo` | Texto, enlace, imagen, item, dimensión, etc. |
| `titulo` | Título o etiqueta cuando corresponda |
| `texto` | Texto principal |
| `url` | Enlace interno, ancla o URL externa |
| `imagen` | Ruta `/assets/...` o URL HTTPS |
| `imagen_alt` | Descripción accesible de la imagen |
| `icono` | Nombre/etiqueta de icono cuando el componente lo admita |
| `color` | Color hexadecimal `#RRGGBB` cuando corresponda |
| `orden` | Posición dentro de un grupo |
| `visible` | `si` o `no`; permite ocultar una pieza sin borrarla |
| `estado_publicacion` | `borrador`, `publicado` o `archivado` |

### Para cambiar una palabra

Busque el `id` correspondiente en `contenido`, edite `titulo` o `texto`, valide y publique. No se modifica HTML.

### Para quitar temporalmente un bloque

Cambie `visible` a `no`. La fila se conserva en Sheets, pero el portal deja de mostrarla cuando esa pieza usa visibilidad editorial.

### Para cambiar un botón

Edite su `titulo` y/o `url`. Si el botón debe dejar de mostrarse, use `visible=no` o `estado_publicacion=archivado` según corresponda.

### Para cambiar una imagen

Edite `imagen` y `imagen_alt`. Las imágenes locales deben existir dentro del proyecto en `/assets/`; también se admiten URLs HTTPS públicas.

## Gantt y selector de periodo

El Gantt se alimenta de dos pestañas:

- `periodos`: define los periodos disponibles y su fecha de inicio/fin.
- `actividades`: define cada barra/hito del Gantt.

Para agregar 2028, por ejemplo, no se modifica el HTML: se agrega el periodo en `periodos` y sus actividades en `actividades`. El selector se genera a partir de la información publicada.

Campos esenciales de `actividades`: `id`, `proceso_id`, `actividad`, `periodo`, `inicio`, `fin`, `responsable`, `modalidad`, `estado_publicacion`.

Campos recomendados: `titulo_claro`, `grupo`, `fase`, `tipo`, `fuente`, `accion_programa`, `estado_ejecucion` y `fecha_cumplimiento`.

## Publicación

- `borrador`: se prepara en Sheets y no aparece en el sitio.
- `publicado`: entra en la siguiente publicación.
- `archivado`: se conserva en Sheets pero no aparece en el sitio.

Flujo recomendado:

1. Editar en Sheets.
2. Ejecutar **Portal Desarrollo Docente → Validar contenido**.
3. Corregir cualquier error bloqueante.
4. Ejecutar **Publicar y solicitar actualización**.
5. Netlify reconstruye el portal con la versión validada.

La publicación genera un snapshot inmutable. Si una edición futura contiene un error, no sobrescribe silenciosamente una versión válida anterior.

## Qué permanece fuera de Sheets

El contenido sí se administra desde Sheets. Permanecen protegidos en el proyecto web:

- branding y paleta;
- tipografías;
- CSS y responsive;
- animaciones;
- lógica de accesibilidad;
- validaciones del CMS;
- credenciales y tokens;
- configuración de Netlify y Apps Script.

Esto evita que una modificación editorial rompa el diseño del portal.

## Reglas importantes

- No duplique `id`.
- Use fechas `AAAA-MM-DD`.
- No cambie `proceso_id` existentes: `induccion`, `formacion`, `acompanamiento`, `evaluacion`, `reconocimiento`.
- Para Evaluación, use fases válidas: `aplicacion`, `reportes`, `procesamiento`, `resultados`.
- No use HTML o JavaScript dentro de las celdas.
- No coloque tokens, contraseñas ni URLs privadas de build hooks en Sheets.
- Antes de publicar, use siempre **Validar contenido**.

El contrato completo de columnas está en `schema.json` y la puesta en marcha está documentada en `../INTEGRACION.md`.
