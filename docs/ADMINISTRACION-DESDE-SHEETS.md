# Administración del Portal DGDD desde Google Sheets

## Regla de operación

Para cambios de contenido, el equipo **no edita HTML**. Google Sheets es el panel editorial del portal.

### Quiero cambiar un texto, título o botón

Use `contenido`. Busque el `id`, modifique el contenido y publique.

### Quiero ocultar algo

Use `visible=no` en `contenido` o `estado_publicacion=archivado` en las tablas estructuradas.

### Quiero cambiar el Gantt

Use `actividades`. Cambie fechas, responsables, modalidad o actividades. Para crear un nuevo ciclo, primero agréguelo en `periodos`.

### Quiero agregar un evento

Use `eventos`. Puede cargar nombre, edición, fechas, enlace, modalidad, lugar, imagen y texto alternativo.

### Quiero cambiar una meta o resultado

Use `indicadores`. No confunda `meta` con `valor`. Todo resultado debe llevar `fecha_corte` y `fuente`. Use `nivel` para Institucional, Pregrado, Segundas Especialidades o Maestrías y `visible=si/no` para activar u ocultar cada fila. El selector de nivel del portal se genera automáticamente.

### Quiero cambiar una ruta o módulo de formación

Use `oferta_formativa`.

### Quiero cambiar documentos o fotos

Use `recursos`.

### Quiero cambiar personas del equipo

Use `equipo`.

## Flujo de publicación

1. Editar.
2. Validar contenido.
3. Revisar errores/avisos.
4. Publicar y solicitar actualización.
5. Verificar el deploy en Netlify.

El sitio mantiene la última versión válida si una nueva publicación no supera la validación o el build falla.
