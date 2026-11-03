/** Funciones puras compartidas por Apps Script y las herramientas de Node. */
function dgddText(value) {
  return value === null || value === undefined ? '' : String(value).trim();
}

function dgddNumberOrBlank(value) {
  if (value === '' || value === null || value === undefined) return '';
  if (typeof value === 'string' && !value.trim()) return '';
  if (typeof value !== 'string' && typeof value !== 'number') return dgddText(value);
  var n = Number(value);
  // Un valor no numérico se conserva para que la validación lo rechace.
  return Number.isFinite(n) ? n : dgddText(value);
}

function dgddCopy(value) {
  return JSON.parse(JSON.stringify(value));
}

function dgddInferInitialEvaluationPhase(activity) {
  // Solo se aplica al importar el archivo original. Las ediciones posteriores
  // deben declarar la fase; no se infiere automáticamente durante publicación.
  if (activity.eje !== 'Evaluación') return '';
  if (activity.tipo === 'Procesamiento' || /^Procesamiento/i.test(activity.actividad)) return 'procesamiento';
  if (/^(Comunicación de resultados|Publicación de resultados|Emisión del informe)/i.test(activity.actividad)) return 'resultados';
  if (activity.tipo === 'Reporte' || activity.grupo === 'Reportes académicos' || activity.grupo === 'Formación en MIDE') return 'reportes';
  return 'aplicacion';
}

function dgddInitialSnapshot(original, meta) {
  var content = dgddCopy(original);
  content.meta = dgddCopy(meta);
  content.iniciativas = content.iniciativas || [];
  content.contenido = content.contenido || [];
  content.ejes = content.ejes.map(function (axis) {
    var extra = DGDD_PROCESS_ENRICHMENT[axis.eje] || {};
    return Object.assign({}, axis, extra, { slug: extra.id || axis.slug || axis.id });
  });
  content.actividades = content.actividades.map(function (row) {
    return Object.assign({}, row, {
      fase: row.fase || dgddInferInitialEvaluationPhase(row),
      estado_ejecucion: row.estado_ejecucion || '',
      fecha_cumplimiento: row.fecha_cumplimiento || ''
    });
  });
  content.kpis = content.kpis.map(function (row, i) {
    return Object.assign({}, row, { id: row.id || 'KPI-' + String(i + 1).padStart(3, '0'), fecha_corte: row.fecha_corte || '', fuente: row.fuente || '', universo: row.universo || '' });
  });
  content.formacion = content.formacion.map(function (row) {
    return Object.assign({}, row, { id: row.id || 'FORM-' + row.linea + '-' + row.modulo, ruta_id: row.ruta_id || 'RUTA-' + row.linea });
  });
  content.documentos = content.documentos.map(function (row, i) {
    return Object.assign({}, row, { id: row.id || 'DOC-' + String(i + 1).padStart(3, '0') });
  });
  content.equipo = content.equipo.map(function (row, i) {
    return Object.assign({}, row, { id: row.id || 'EQ-' + String(i + 1).padStart(3, '0') });
  });
  content.galeria = content.galeria.map(function (row, i) {
    var event = content.eventos.find(function (event) {
      return dgddText(event.nombre + ' ' + (event.edicion || '')) === dgddText(row.evento);
    });
    return Object.assign({}, row, { recurso_id: row.recurso_id || 'GAL-' + String(i + 1).padStart(3, '0'), evento_id: row.evento_id || (event ? event.id : '') });
  });
  return content;
}

function dgddPublishedRows(rows, sheetName) {
  return (rows || []).filter(function (row, index) {
    var status = dgddText(row.estado_publicacion).toLowerCase();
    if (DGDD_SCHEMA.publicationStates.indexOf(status) < 0) {
      throw new Error(sheetName + ', fila ' + (index + 2) + ': estado_publicacion debe ser borrador, publicado o archivado.');
    }
    return status === 'publicado';
  });
}

function dgddEditorialToPortal(editorial, meta) {
  var tables = {};
  Object.keys(DGDD_SCHEMA.sheets).forEach(function (name) {
    if (!Array.isArray(editorial[name])) throw new Error('Falta la pestaña editorial: ' + name);
    tables[name] = dgddPublishedRows(editorial[name], name);
  });
  var axes = tables.procesos.map(function (row) {
    return { id: dgddText(row.proceso_id), slug: dgddText(row.proceso_id), eje: dgddText(row.eje), orden: dgddNumberOrBlank(row.orden), descripcion: dgddText(row.descripcion), beneficio: dgddText(row.beneficio), publico: dgddText(row.publico), como_participar: dgddText(row.como_participar), url: dgddText(row.url) };
  });
  var byAxisId = Object.create(null);
  axes.forEach(function (axis) { byAxisId[axis.id] = axis.eje; });
  function axisName(id, allowAuxiliary) {
    var key = dgddText(id);
    var name = byAxisId[key] || (allowAuxiliary && Object.prototype.hasOwnProperty.call(DGDD_SCHEMA.auxiliaryAxes, key) ? DGDD_SCHEMA.auxiliaryAxes[key] : '');
    if (!name) throw new Error('Proceso no publicado o inexistente: ' + key);
    return name;
  }
  function pick(row, fields) {
    var out = {};
    fields.forEach(function (field) { out[field] = dgddText(row[field]); });
    return out;
  }
  var content = {
    meta: dgddCopy(meta),
    config: tables.config.map(function (row) { return { clave: dgddText(row.clave), valor: dgddText(row.valor) }; }),
    periodos: tables.periodos.map(function (row) { return { periodo: dgddText(row.periodo), inicio: dgddText(row.inicio), fin: dgddText(row.fin), semanas: dgddNumberOrBlank(row.semanas) }; }),
    ejes: axes,
    actividades: tables.actividades.map(function (row) {
      var out = pick(row, ['id', 'grupo', 'fase', 'actividad', 'periodo', 'inicio', 'fin', 'responsable', 'tipo', 'modalidad', 'fuente', 'nota', 'hito', 'titulo_claro', 'accion_programa', 'estado_ejecucion', 'fecha_cumplimiento']);
      out.eje = axisName(row.proceso_id, false);
      return out;
    }),
    eventos: tables.eventos.map(function (row) {
      var out = pick(row, ['id', 'nombre', 'edicion', 'inicio', 'fin', 'descripcion', 'estado', 'url', 'album_url', 'cifra_1_texto', 'cifra_2_texto', 'modalidad', 'lugar', 'publico', 'slug', 'fecha_publicacion', 'fecha_texto', 'hora', 'tema', 'procesos_relacionados', 'imagen', 'imagen_alt', 'fuente']);
      out.eje = axisName(row.proceso_id, false);
      out.cifra_1 = dgddNumberOrBlank(row.cifra_1);
      out.cifra_2 = dgddNumberOrBlank(row.cifra_2);
      return out;
    }),
    kpis: tables.indicadores.map(function (row) {
      var out = pick(row, ['id', 'indicador', 'unidad', 'periodo', 'fecha_corte', 'fuente', 'universo']);
      out.eje = axisName(row.proceso_id, true);
      out.meta = dgddNumberOrBlank(row.meta);
      out.valor = dgddNumberOrBlank(row.valor);
      return out;
    }),
    formacion: [], documentos: [], galeria: [],
    contenido: tables.contenido.map(function (row) {
      var out = pick(row, ['id','grupo','pagina','seccion','tipo','titulo','texto','url','imagen','imagen_alt','icono','color','visible']);
      out.orden = dgddNumberOrBlank(row.orden);
      return out;
    }),
    equipo: tables.equipo.map(function (row) {
      var out = pick(row, ['id', 'nombre', 'cargo', 'descripcion', 'contacto_url']);
      out.orden = dgddNumberOrBlank(row.orden);
      return out;
    }),
    iniciativas: tables.iniciativas.map(function (row) {
      var out = pick(row, ['id', 'titulo', 'desafio', 'intervencion', 'aplicacion', 'evidencia', 'aprendizaje', 'estado', 'periodo', 'url', 'imagen_url']);
      out.eje = axisName(row.proceso_id, false);
      out.orden = dgddNumberOrBlank(row.orden);
      return out;
    })
  };
  var routes = Object.create(null);
  var offerIds = Object.create(null);
  tables.oferta_formativa.forEach(function (row) {
    var id = dgddText(row.id);
    if (!/^[A-Za-z0-9][A-Za-z0-9_.:-]{0,95}$/.test(id) || offerIds[id]) throw new Error('Identificador inválido o duplicado en oferta_formativa: ' + id);
    offerIds[id] = true;
    var type = dgddText(row.tipo);
    if (type !== 'ruta' && type !== 'modulo') throw new Error('Tipo de oferta no admitido: ' + type);
    if (type === 'ruta') {
      if (dgddText(row.ruta_id)) throw new Error('Una ruta no debe tener ruta_id padre: ' + id);
      if (!dgddText(row.titulo) || !dgddText(row.linea)) throw new Error('Ruta sin título o línea: ' + id);
      routes[id] = row;
    }
  });
  tables.oferta_formativa.forEach(function (row) {
    if (dgddText(row.tipo) !== 'modulo') return;
    var route = routes[dgddText(row.ruta_id)];
    if (!route) throw new Error('Módulo sin ruta publicada: ' + dgddText(row.id));
    var line = dgddText(route.linea);
    if (/^\d+$/.test(line)) line = line.padStart(2, '0');
    content.formacion.push({
      id: dgddText(row.id), ruta_id: dgddText(row.ruta_id), linea: line,
      nombre: dgddText(route.titulo), insignia: dgddText(route.insignia),
      modulo: dgddText(row.modulo), nombre_modulo: dgddText(row.titulo),
      descripcion_ruta: dgddText(route.descripcion), descripcion_modulo: dgddText(row.descripcion),
      resultado_aprendizaje: dgddText(route.resultado_aprendizaje), publico: dgddText(route.publico),
      duracion: dgddText(route.duracion), modalidad: dgddText(route.modalidad),
      disponibilidad: dgddText(route.disponibilidad), url: dgddText(route.url),
      modulo_url: dgddText(row.url), orden: dgddNumberOrBlank(row.orden)
    });
  });
  Object.keys(routes).forEach(function (id) {
    if (!content.formacion.some(function (row) { return row.ruta_id === id; })) throw new Error('Ruta publicada sin módulos publicados: ' + id);
  });
  var resourceIds = Object.create(null);
  tables.recursos.forEach(function (row) {
    var id = dgddText(row.recurso_id);
    if (!id || resourceIds[id]) throw new Error('Identificador vacío o duplicado en recursos: ' + id);
    resourceIds[id] = true;
    var type = dgddText(row.tipo);
    if (type === 'foto_evento') {
      var event = content.eventos.find(function (event) { return event.id === dgddText(row.evento_id); });
      if (!event) throw new Error('Fotografía sin evento publicado: ' + id);
      content.galeria.push({ recurso_id: id, evento_id: event.id, evento: dgddText(event.nombre + ' ' + event.edicion), id: dgddText(row.drive_file_id), archivo: dgddText(row.archivo), orden: dgddNumberOrBlank(row.orden), destacada: dgddText(row.destacada), pie: dgddText(row.pie), url: dgddText(row.url) });
    } else if (['documento', 'enlace', 'video'].indexOf(type) >= 0) {
      content.documentos.push({ id: id, tipo: type, nombre: dgddText(row.titulo), codigo: dgddText(row.codigo), version: dgddText(row.version), descripcion: dgddText(row.descripcion), url: dgddText(row.url), orden: dgddNumberOrBlank(row.orden) });
    } else {
      throw new Error('Tipo de recurso no admitido: ' + type);
    }
  });
  return content;
}

function dgddPortalToEditorial(content) {
  var tables = {};
  Object.keys(DGDD_SCHEMA.sheets).forEach(function (name) { tables[name] = []; });
  var axisIds = Object.create(null);
  content.ejes.forEach(function (axis) { axisIds[axis.eje] = axis.id || axis.slug; });
  Object.keys(DGDD_SCHEMA.auxiliaryAxes).forEach(function (id) { axisIds[DGDD_SCHEMA.auxiliaryAxes[id]] = id; });
  function publish(row) { return Object.assign({}, row, { estado_publicacion: 'publicado' }); }
  tables.config = content.config.map(publish);
  tables.periodos = content.periodos.map(publish);
  tables.procesos = content.ejes.map(function (axis) { return publish(Object.assign({}, axis, { proceso_id: axis.id || axis.slug })); });
  tables.actividades = content.actividades.map(function (row) { return publish(Object.assign({}, row, { proceso_id: axisIds[row.eje] })); });
  tables.eventos = content.eventos.map(function (row) { return publish(Object.assign({}, row, { proceso_id: axisIds[row.eje] })); });
  tables.indicadores = content.kpis.map(function (row) { return publish(Object.assign({}, row, { proceso_id: axisIds[row.eje] })); });
  tables.equipo = content.equipo.map(publish);
  tables.iniciativas = content.iniciativas.map(function (row) { return publish(Object.assign({}, row, { proceso_id: axisIds[row.eje] })); });
  tables.contenido = (content.contenido || []).map(publish);
  var seenRoutes = Object.create(null);
  content.formacion.forEach(function (row, i) {
    var routeId = row.ruta_id || 'RUTA-' + row.linea;
    if (!seenRoutes[routeId]) {
      seenRoutes[routeId] = true;
      tables.oferta_formativa.push(publish({ id: routeId, tipo: 'ruta', ruta_id: '', linea: row.linea, modulo: '', titulo: row.nombre, insignia: row.insignia, descripcion: row.descripcion_ruta || '', resultado_aprendizaje: row.resultado_aprendizaje || '', publico: row.publico || '', duracion: row.duracion || '', modalidad: row.modalidad || '', disponibilidad: row.disponibilidad || '', url: row.url || '', orden: Number(row.linea) }));
    }
    tables.oferta_formativa.push(publish({ id: row.id || 'FORM-' + row.linea + '-' + row.modulo, tipo: 'modulo', ruta_id: routeId, linea: '', modulo: row.modulo, titulo: row.nombre_modulo, descripcion: row.descripcion_modulo || '', url: row.modulo_url || '', orden: row.orden || Number(dgddText(row.modulo).replace(/\D/g, '')) || i + 1 }));
  });
  content.documentos.forEach(function (row) {
    tables.recursos.push(publish(Object.assign({}, row, { recurso_id: row.id, tipo: row.tipo || 'documento', titulo: row.nombre })));
  });
  content.galeria.forEach(function (row) {
    tables.recursos.push(publish(Object.assign({}, row, { recurso_id: row.recurso_id, tipo: 'foto_evento', titulo: row.pie || '', drive_file_id: row.id })));
  });
  return tables;
}
