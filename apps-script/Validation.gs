/** Validación compartida. No modifica los datos ni convierte ausencia en cero. */
function dgddValidateContent(content, options) {
  options = options || {};
  var errors = [], warnings = [];
  function fail(path, message) { errors.push(path + ': ' + message); }
  function warn(path, message) { warnings.push(path + ': ' + message); }
  function record(value) { return value !== null && typeof value === 'object' && !Array.isArray(value); }
  function blank(value) { return value === '' || value === null || value === undefined; }
  function text(value, path, required) {
    if (blank(value)) { if (required) fail(path, 'es obligatorio.'); return ''; }
    if (typeof value !== 'string') { fail(path, 'debe ser texto.'); return ''; }
    if (required && !value.trim()) fail(path, 'no puede contener solo espacios.');
    return value;
  }
  function realDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    var parts = value.split('-').map(Number);
    if (parts[0] < 1900 || parts[0] > 2199) return false;
    var d = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
    return d.getUTCFullYear() === parts[0] && d.getUTCMonth() === parts[1] - 1 && d.getUTCDate() === parts[2];
  }
  function date(value, path, required) {
    if (blank(value)) { if (required) fail(path, 'se requiere una fecha AAAA-MM-DD.'); return false; }
    if (!realDate(value)) { fail(path, 'fecha inexistente o formato distinto de AAAA-MM-DD.'); return false; }
    return true;
  }
  function timestamp(value, path, required) {
    if (blank(value)) { if (required) fail(path, 'se requiere una fecha y hora UTC.'); return false; }
    var match = typeof value === 'string' && value.match(/^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?Z$/);
    if (!match || !realDate(match[1]) || Number(match[2]) > 23 || Number(match[3]) > 59 || Number(match[4]) > 59 || !Number.isFinite(Date.parse(value))) {
      fail(path, 'debe ser una marca temporal UTC válida, por ejemplo AAAA-MM-DDTHH:mm:ss.sssZ.'); return false;
    }
    return true;
  }
  function number(value, path, required, min, max) {
    if (blank(value)) { if (required) fail(path, 'se requiere un número.'); return false; }
    if (typeof value !== 'number' || !Number.isFinite(value)) { fail(path, 'debe ser un número finito, sin símbolo de porcentaje.'); return false; }
    if (min !== undefined && value < min) fail(path, 'debe ser mayor o igual a ' + min + '.');
    if (max !== undefined && value > max) fail(path, 'debe ser menor o igual a ' + max + '.');
    return true;
  }
  function url(value, path) {
    if (blank(value)) return;
    if (typeof value !== 'string' || !/^https?:\/\/[^/?#\s]+(?:[/?#][^\s]*)?$/i.test(value)) fail(path, 'solo se admiten enlaces completos http(s).');
  }
  function range(row, path, required) {
    var a = date(row.inicio, path + '.inicio', required);
    var b = date(row.fin, path + '.fin', required);
    if (a !== b) fail(path, 'inicio y fin deben estar informados juntos.');
    if (a && b && row.fin < row.inicio) fail(path, 'la fecha final es anterior a la inicial.');
  }
  function unique(rows, field, collection, required) {
    var values = new Set();
    rows.forEach(function (row, index) {
      if (!record(row)) { fail(collection + '[' + index + ']', 'debe ser un objeto.'); return; }
      var value = text(row[field], collection + '[' + index + '].' + field, required);
      if (!value) return;
      if (field === 'id' || field === 'recurso_id' || field === 'slug') {
        if (!/^[A-Za-z0-9][A-Za-z0-9_.:-]{0,95}$/.test(value)) fail(collection + '[' + index + '].' + field, 'identificador inválido.');
      }
      if (values.has(value)) fail(collection, 'identificador duplicado en ' + field + ': ' + value);
      values.add(value);
    });
    return values;
  }
  if (!record(content)) return { valid: false, errors: ['contenido: debe ser un objeto JSON.'], warnings: [], summary: {} };
  if (!record(content.meta)) fail('meta', 'es obligatorio.');
  else {
    if (content.meta.schemaVersion !== DGDD_SCHEMA.schemaVersion) fail('meta.schemaVersion', 'versión de contrato no admitida.');
    var version = text(content.meta.version, 'meta.version', true);
    if (version && !/^[A-Za-z0-9][A-Za-z0-9._-]{0,95}$/.test(version)) fail('meta.version', 'formato inválido.');
    if (options.expectedVersion && version !== options.expectedVersion) fail('meta.version', 'la versión recibida no coincide exactamente con la versión solicitada.');
    timestamp(content.meta.generatedAt, 'meta.generatedAt', true);
    if (!Object.prototype.hasOwnProperty.call(content.meta, 'sourceUpdatedAt')) fail('meta.sourceUpdatedAt', 'debe existir; usar null cuando no consta.');
    else if (content.meta.sourceUpdatedAt !== null) timestamp(content.meta.sourceUpdatedAt, 'meta.sourceUpdatedAt', true);
    if (content.meta.timeZone !== DGDD_SCHEMA.timeZone) fail('meta.timeZone', 'debe ser America/Lima.');
  }
  var tables = {};
  DGDD_SCHEMA.requiredCollections.forEach(function (name) {
    if (!Array.isArray(content[name])) fail(name, 'debe ser una lista.');
    tables[name] = Array.isArray(content[name]) ? content[name] : [];
  });
  var axes = unique(tables.ejes, 'eje', 'ejes', true);
  unique(tables.ejes, 'id', 'ejes', true);
  unique(tables.ejes, 'slug', 'ejes', true);
  DGDD_SCHEMA.coreAxes.forEach(function (axis) { if (!axes.has(axis)) fail('ejes', 'falta el proceso ' + axis + '.'); });
  if (axes.size !== DGDD_SCHEMA.coreAxes.length) fail('ejes', 'el contrato contempla los cinco procesos institucionales.');
  var periods = unique(tables.periodos, 'periodo', 'periodos', true);
  function relation(value, set, path) {
    if (!set.has(value)) fail(path, 'referencia inexistente: ' + String(value));
  }
  function period(value, path, allowYear) {
    if (allowYear && typeof value === 'string' && /^\d{4}$/.test(value) && Array.from(periods).some(function (p) { return p.indexOf(value + '-') === 0; })) return;
    relation(value, periods, path);
  }
  unique(tables.config, 'clave', 'config', true);
  tables.config.forEach(function (row, index) {
    if (!record(row)) return;
    text(row.valor, 'config[' + index + '].valor', false);
    if (row.clave === 'fecha_hoy' && !blank(row.valor)) date(row.valor, 'config.fecha_hoy', false);
    if (typeof row.clave === 'string' && /(?:^|_)url$/.test(row.clave)) url(row.valor, 'config.' + row.clave);
  });
  tables.ejes.forEach(function (row, index) {
    if (!record(row)) return;
    var p = 'ejes[' + index + ']';
    text(row.descripcion, p + '.descripcion', true);
    text(row.beneficio, p + '.beneficio', true);
    text(row.publico, p + '.publico', true);
    if (row.id !== row.slug) fail(p, 'id y slug deben coincidir para conservar enlaces estables.');
    number(row.orden, p + '.orden', true, 0);
    url(row.url, p + '.url');
  });
  tables.periodos.forEach(function (row, index) {
    if (!record(row)) return;
    var p = 'periodos[' + index + ']';
    range(row, p, true);
    if (number(row.semanas, p + '.semanas', true, 1, 60) && !Number.isInteger(row.semanas)) fail(p + '.semanas', 'debe ser entero.');
  });
  unique(tables.actividades, 'id', 'actividades', true);
  tables.actividades.forEach(function (row, index) {
    if (!record(row)) return;
    var p = 'actividades[' + index + ']';
    relation(row.eje, axes, p + '.eje');
    period(row.periodo, p + '.periodo', false);
    text(row.actividad, p + '.actividad', true);
    text(row.responsable, p + '.responsable', true);
    text(row.modalidad, p + '.modalidad', true);
    range(row, p, true);
    if (row.eje === 'Evaluación' && !Object.prototype.hasOwnProperty.call(DGDD_SCHEMA.evaluationPhases, row.fase)) fail(p + '.fase', 'Evaluación requiere aplicacion, reportes, procesamiento o resultados.');
    if (DGDD_SCHEMA.executionStates.indexOf(row.estado_ejecucion === undefined ? '' : row.estado_ejecucion) < 0) fail(p + '.estado_ejecucion', 'estado de ejecución no admitido.');
    if (!blank(row.fecha_cumplimiento)) {
      date(row.fecha_cumplimiento, p + '.fecha_cumplimiento', true);
      if (row.estado_ejecucion !== 'completada') fail(p, 'una fecha de cumplimiento requiere estado completada.');
    }
    if (row.estado_ejecucion === 'completada' && blank(row.fecha_cumplimiento)) fail(p + '.fecha_cumplimiento', 'se requiere para confirmar ejecución completada.');
    if (Object.prototype.hasOwnProperty.call(row, 'avance')) {
      if (!blank(row.avance)) fail(p + '.avance', 'no se admite avance derivado del calendario; utilice ejecución confirmada.');
    }
  });
  var events = unique(tables.eventos, 'id', 'eventos', true);
  unique(tables.eventos, 'slug', 'eventos', false);
  tables.eventos.forEach(function (row, index) {
    if (!record(row)) return;
    var p = 'eventos[' + index + ']';
    relation(row.eje, axes, p + '.eje');
    text(row.nombre, p + '.nombre', true);
    text(row.descripcion, p + '.descripcion', true);
    range(row, p, row.estado !== 'Por confirmar' && row.estado !== 'Realizado');
    date(row.fecha_publicacion, p + '.fecha_publicacion', false);
    ['edicion', 'fecha_texto', 'hora', 'lugar', 'modalidad', 'publico', 'tema', 'procesos_relacionados', 'imagen_alt', 'fuente'].forEach(function (key) {
      text(row[key], p + '.' + key, false);
    });
    if (!blank(row.slug) && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(row.slug)) fail(p + '.slug', 'utilice palabras en minúsculas separadas por guiones.');
    if (row.estado === 'Realizado' && blank(row.inicio)) {
      if (blank(row.fecha_publicacion)) fail(p + '.fecha_publicacion', 'un evento realizado sin fecha exacta necesita la fecha de su publicación documental.');
      if (blank(row.url)) fail(p + '.url', 'un evento realizado sin fecha exacta necesita una fuente documental enlazada.');
    }
    if (!blank(row.procesos_relacionados)) {
      dgddText(row.procesos_relacionados).split(/[;,]/).map(dgddText).filter(Boolean).forEach(function (axis) { relation(axis, axes, p + '.procesos_relacionados'); });
    }
    if (!blank(row.imagen)) {
      if (typeof row.imagen === 'string' && row.imagen.indexOf('/assets/') === 0) {
        if (!/^\/assets\/[A-Za-z0-9][A-Za-z0-9._/-]*$/.test(row.imagen) || row.imagen.indexOf('..') >= 0) fail(p + '.imagen', 'ruta local de imagen inválida.');
      } else url(row.imagen, p + '.imagen');
      text(row.imagen_alt, p + '.imagen_alt', true);
    }
    url(row.url, p + '.url'); url(row.album_url, p + '.album_url');
    ['cifra_1', 'cifra_2'].forEach(function (key) {
      if (!blank(row[key])) {
        number(row[key], p + '.' + key, true, 0);
        text(row[key + '_texto'], p + '.' + key + '_texto', true);
      }
    });
    if (blank(row.url)) warn(p + '.url', 'sin enlace a una página o convocatoria; no se debe mostrar un botón vacío.');
  });
  unique(tables.kpis, 'id', 'kpis', true);
  tables.kpis.forEach(function (row, index) {
    if (!record(row)) return;
    var p = 'kpis[' + index + ']';
    if (Object.values(DGDD_SCHEMA.auxiliaryAxes).indexOf(row.eje) < 0) relation(row.eje, axes, p + '.eje');
    period(row.periodo, p + '.periodo', true);
    text(row.indicador, p + '.indicador', true);
    text(row.unidad, p + '.unidad', true);
    number(row.meta, p + '.meta', false, 0, row.unidad === '%' ? 100 : undefined);
    number(row.valor, p + '.valor', false, 0, row.unidad === '%' ? 100 : undefined);
    if (!blank(row.valor)) {
      date(row.fecha_corte, p + '.fecha_corte', true);
      text(row.fuente, p + '.fuente', true);
    } else if (!blank(row.fecha_corte)) date(row.fecha_corte, p + '.fecha_corte', false);
  });
  unique(tables.formacion, 'id', 'formacion', true);
  var modules = new Set(), routeData = Object.create(null);
  tables.formacion.forEach(function (row, index) {
    if (!record(row)) return;
    var p = 'formacion[' + index + ']';
    ['ruta_id', 'linea', 'nombre', 'modulo', 'nombre_modulo'].forEach(function (key) { text(row[key], p + '.' + key, true); });
    if (typeof row.ruta_id === 'string' && !/^[A-Za-z0-9][A-Za-z0-9_.:-]{0,95}$/.test(row.ruta_id)) fail(p + '.ruta_id', 'identificador de ruta inválido.');
    var key = row.ruta_id + '|' + row.modulo;
    if (modules.has(key)) fail(p, 'módulo duplicado dentro de su ruta.');
    modules.add(key);
    var routeKey = JSON.stringify([row.linea, row.nombre, row.insignia || '']);
    if (routeData[row.ruta_id] && routeData[row.ruta_id] !== routeKey) fail(p, 'los datos de la ruta difieren entre sus módulos.');
    routeData[row.ruta_id] = routeKey;
    url(row.url, p + '.url'); url(row.modulo_url, p + '.modulo_url');
  });
  unique(tables.documentos, 'id', 'documentos', true);
  tables.documentos.forEach(function (row, index) {
    if (!record(row)) return;
    var p = 'documentos[' + index + ']';
    text(row.nombre, p + '.nombre', true);
    url(row.url, p + '.url');
    if (blank(row.url)) warn(p + '.url', 'documento sin enlace; debe identificarse como pendiente de incorporación.');
  });
  unique(tables.equipo, 'id', 'equipo', true);
  tables.equipo.forEach(function (row, index) {
    if (!record(row)) return;
    var p = 'equipo[' + index + ']';
    text(row.nombre, p + '.nombre', true); text(row.cargo, p + '.cargo', true);
    number(row.orden, p + '.orden', true, 0); url(row.contacto_url, p + '.contacto_url');
  });
  unique(tables.galeria, 'recurso_id', 'galeria', true);
  tables.galeria.forEach(function (row, index) {
    if (!record(row)) return;
    var p = 'galeria[' + index + ']';
    relation(row.evento_id, events, p + '.evento_id');
    if (blank(row.id) && blank(row.url)) fail(p, 'se requiere id de archivo de Drive o url de imagen.');
    if (!blank(row.id) && (typeof row.id !== 'string' || !/^[A-Za-z0-9_-]{10,150}$/.test(row.id))) fail(p + '.id', 'identificador de archivo Drive inválido.');
    url(row.url, p + '.url'); number(row.orden, p + '.orden', true, 0);
  });
  unique(tables.iniciativas, 'id', 'iniciativas', true);
  tables.iniciativas.forEach(function (row, index) {
    if (!record(row)) return;
    var p = 'iniciativas[' + index + ']';
    relation(row.eje, axes, p + '.eje');
    ['titulo', 'desafio', 'intervencion', 'estado'].forEach(function (key) { text(row[key], p + '.' + key, true); });
    if (['implementado', 'piloto', 'en_desarrollo', 'propuesto'].indexOf(row.estado) < 0) fail(p + '.estado', 'estado de iniciativa no admitido.');
    if (row.estado === 'implementado') text(row.evidencia, p + '.evidencia', true);
    if (!blank(row.periodo)) period(row.periodo, p + '.periodo', true);
    url(row.url, p + '.url'); url(row.imagen_url, p + '.imagen_url');
  });
  unique(tables.contenido, 'id', 'contenido', true);
  tables.contenido.forEach(function (row, index) {
    if (!record(row)) return;
    var p = 'contenido[' + index + ']';
    text(row.grupo, p + '.grupo', true);
    text(row.pagina, p + '.pagina', true);
    text(row.seccion, p + '.seccion', true);
    text(row.tipo, p + '.tipo', true);
    text(row.titulo, p + '.titulo', false);
    text(row.texto, p + '.texto', false);
    text(row.icono, p + '.icono', false);
    text(row.imagen_alt, p + '.imagen_alt', false);
    if (['si','no'].indexOf(dgddText(row.visible).toLowerCase()) < 0) fail(p + '.visible', 'debe ser si o no.');
    if (!blank(row.orden) && (!number(row.orden, p + '.orden', false, 0) || !Number.isInteger(row.orden))) fail(p + '.orden', 'debe ser entero.');
    if (!blank(row.color) && (typeof row.color !== 'string' || !/^#[0-9A-Fa-f]{6}$/.test(row.color))) fail(p + '.color', 'debe usar formato hexadecimal #RRGGBB.');
    if (!blank(row.url)) {
      if (typeof row.url !== 'string' || !(row.url.indexOf('/') === 0 || row.url.indexOf('#') === 0 || /^https?:\/\//i.test(row.url))) fail(p + '.url', 'use una ruta interna, ancla o enlace http(s).');
    }
    if (!blank(row.imagen)) {
      if (typeof row.imagen !== 'string' || !(row.imagen.indexOf('/assets/') === 0 || /^https?:\/\//i.test(row.imagen))) fail(p + '.imagen', 'use /assets/... o una URL http(s).');
    }
  });
  var galleryResourceIds = new Set(tables.galeria.map(function (row) { return row && row.recurso_id; }));
  tables.documentos.forEach(function (row) { if (row && galleryResourceIds.has(row.id)) fail('recursos', 'un documento y una foto comparten identificador: ' + row.id); });
  return {
    valid: errors.length === 0,
    errors: errors,
    warnings: warnings,
    summary: {
      version: content.meta && content.meta.version,
      procesos: tables.ejes.length,
      actividades: tables.actividades.length,
      actividadesEvaluacion: tables.actividades.filter(function (row) { return row && row.eje === 'Evaluación'; }).length,
      indicadores: tables.kpis.length,
      resultadosInformados: tables.kpis.filter(function (row) { return row && !blank(row.valor); }).length,
      modulos: tables.formacion.length,
      eventos: tables.eventos.length,
      fotografias: tables.galeria.length,
      iniciativas: tables.iniciativas.length,
      contenido: tables.contenido.length
    }
  };
}
