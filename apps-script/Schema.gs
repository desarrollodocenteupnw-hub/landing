/**
 * Contrato editorial y de publicación del portal DGDD.
 * Archivo deliberadamente sin dependencias de Apps Script: el build de Netlify
 * utiliza las mismas reglas y transformaciones que el publicador.
 */
var DGDD_SCHEMA = {
  schemaVersion: 2,
  timeZone: 'America/Lima',
  coreAxes: ['Inducción', 'Formación', 'Acompañamiento', 'Evaluación', 'Reconocimiento'],
  auxiliaryAxes: { carrera_docente: 'Carrera docente' },
  evaluationPhases: {
    aplicacion: 'Aplicación y recolección',
    reportes: 'Reportes e insumos',
    procesamiento: 'Procesamiento y consolidación',
    resultados: 'Comunicación y resultados'
  },
  executionStates: ['', 'pendiente', 'en_ejecucion', 'completada', 'pausada'],
  publicationStates: ['borrador', 'publicado', 'archivado'],
  // Ampliación compatible: las hojas ya creadas pueden omitir estas columnas.
  optionalColumns: {
    eventos: ['slug', 'fecha_publicacion', 'fecha_texto', 'hora', 'tema', 'procesos_relacionados', 'imagen', 'imagen_alt', 'fuente']
  },
  requiredCollections: ['config', 'periodos', 'ejes', 'actividades', 'eventos', 'kpis', 'formacion', 'documentos', 'equipo', 'galeria', 'iniciativas', 'contenido'],
  sheets: {
    config: ['clave', 'valor', 'estado_publicacion'],
    periodos: ['periodo', 'inicio', 'fin', 'semanas', 'estado_publicacion'],
    procesos: ['proceso_id', 'eje', 'orden', 'descripcion', 'beneficio', 'publico', 'como_participar', 'url', 'estado_publicacion'],
    actividades: ['id', 'proceso_id', 'grupo', 'fase', 'actividad', 'periodo', 'inicio', 'fin', 'responsable', 'tipo', 'modalidad', 'fuente', 'nota', 'hito', 'titulo_claro', 'accion_programa', 'estado_ejecucion', 'fecha_cumplimiento', 'estado_publicacion'],
    eventos: ['id', 'proceso_id', 'nombre', 'edicion', 'inicio', 'fin', 'descripcion', 'estado', 'url', 'album_url', 'cifra_1', 'cifra_1_texto', 'cifra_2', 'cifra_2_texto', 'modalidad', 'lugar', 'publico', 'slug', 'fecha_publicacion', 'fecha_texto', 'hora', 'tema', 'procesos_relacionados', 'imagen', 'imagen_alt', 'fuente', 'estado_publicacion'],
    indicadores: ['id', 'proceso_id', 'indicador', 'meta', 'valor', 'unidad', 'periodo', 'fecha_corte', 'fuente', 'universo', 'estado_publicacion'],
    oferta_formativa: ['id', 'tipo', 'ruta_id', 'linea', 'modulo', 'titulo', 'insignia', 'descripcion', 'resultado_aprendizaje', 'publico', 'duracion', 'modalidad', 'disponibilidad', 'url', 'orden', 'estado_publicacion'],
    iniciativas: ['id', 'proceso_id', 'titulo', 'desafio', 'intervencion', 'aplicacion', 'evidencia', 'aprendizaje', 'estado', 'periodo', 'url', 'imagen_url', 'orden', 'estado_publicacion'],
    recursos: ['recurso_id', 'tipo', 'titulo', 'codigo', 'version', 'descripcion', 'url', 'evento_id', 'drive_file_id', 'archivo', 'destacada', 'pie', 'orden', 'estado_publicacion'],
    equipo: ['id', 'nombre', 'cargo', 'orden', 'descripcion', 'contacto_url', 'estado_publicacion'],
    contenido: ['id', 'grupo', 'pagina', 'seccion', 'tipo', 'titulo', 'texto', 'url', 'imagen', 'imagen_alt', 'icono', 'color', 'orden', 'visible', 'estado_publicacion']
  }
};

var DGDD_PROCESS_ENRICHMENT = {
  'Inducción': { id: 'induccion', beneficio: 'Comprender el Modelo Educativo Wiener y los procesos de incorporación docente.', publico: 'Docentes nuevos' },
  'Formación': { id: 'formacion', beneficio: 'Desarrollar capacidades mediante líneas de formación, módulos e insignias.', publico: 'Docentes Wiener' },
  'Acompañamiento': { id: 'acompanamiento', beneficio: 'Recibir observación de clase y retroalimentación personalizada.', publico: 'Docentes y programas priorizados' },
  'Evaluación': { id: 'evaluacion', beneficio: 'Comprender el desempeño docente y orientar oportunidades de mejora.', publico: 'Docentes y responsables académicos' },
  'Reconocimiento': { id: 'reconocimiento', beneficio: 'Visibilizar la excelencia y la contribución docente.', publico: 'Docentes elegibles según los criterios del proceso' }
};
