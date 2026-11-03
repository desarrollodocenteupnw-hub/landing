/**
 * Publicador editorial: Google Sheets -> JSON inmutable en Drive -> build hook.
 * Copiar junto con Schema.gs, Transform.gs y Validation.gs al proyecto vinculado
 * al archivo de Sheets. No contiene IDs, tokens ni URLs de cuentas reales.
 */
var DGDD_PROPERTY_KEYS = {
  spreadsheetId: 'DGDD_SPREADSHEET_ID',
  folderId: 'DGDD_PUBLICATIONS_FOLDER_ID',
  readToken: 'DGDD_CONTENT_READ_TOKEN',
  buildHook: 'NETLIFY_BUILD_HOOK_URL',
  latest: 'DGDD_LATEST_PUBLICATION',
  lastBuildRequest: 'DGDD_LAST_BUILD_REQUEST'
};

function onOpen() {
  SpreadsheetApp.getUi().createMenu('Portal Desarrollo Docente')
    .addItem('Validar contenido', 'dgddValidateEditorial')
    .addItem('Publicar y solicitar actualización', 'dgddPublish')
    .addItem('Ver última publicación', 'dgddShowLastPublication')
    .addItem('Solicitar build de una versión', 'dgddRequestVersionBuild')
    .addSeparator()
    .addItem('Preparar integración', 'dgddSetup')
    .addToUi();
}

function dgddSetup() {
  var ui = SpreadsheetApp.getUi();
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error('Abra este proyecto desde Extensiones > Apps Script del archivo de Sheets.');
  var properties = PropertiesService.getScriptProperties();
  properties.setProperty(DGDD_PROPERTY_KEYS.spreadsheetId, spreadsheet.getId());
  spreadsheet.setSpreadsheetTimeZone(DGDD_SCHEMA.timeZone);
  if (!properties.getProperty(DGDD_PROPERTY_KEYS.folderId)) {
    var folder = DriveApp.createFolder('DGDD — Publicaciones del portal');
    properties.setProperty(DGDD_PROPERTY_KEYS.folderId, folder.getId());
  }
  if (!properties.getProperty(DGDD_PROPERTY_KEYS.readToken)) {
    properties.setProperty(DGDD_PROPERTY_KEYS.readToken, Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, ''));
  }
  Object.keys(DGDD_SCHEMA.sheets).forEach(function (name) {
    var headers = DGDD_SCHEMA.sheets[name];
    var sheet = spreadsheet.getSheetByName(name);
    if (!sheet) sheet = spreadsheet.insertSheet(name);
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setBackground('#00669e').setFontColor('#ffffff').setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
    // Solo se añaden validaciones a columnas reconocidas; no se reemplazan datos.
    var currentHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()[0].map(dgddText);
    var statusColumn = currentHeaders.indexOf('estado_publicacion');
    if (statusColumn >= 0 && sheet.getMaxRows() > 1) {
      var rule = SpreadsheetApp.newDataValidation().requireValueInList(DGDD_SCHEMA.publicationStates, true).setAllowInvalid(false).build();
      sheet.getRange(2, statusColumn + 1, sheet.getMaxRows() - 1, 1).setDataValidation(rule);
    }
    var visibleColumn = currentHeaders.indexOf('visible');
    if (visibleColumn >= 0 && sheet.getMaxRows() > 1) {
      var visibleRule = SpreadsheetApp.newDataValidation().requireValueInList(['si', 'no'], true).setAllowInvalid(false).build();
      sheet.getRange(2, visibleColumn + 1, sheet.getMaxRows() - 1, 1).setDataValidation(visibleRule);
    }
    var executionColumn = currentHeaders.indexOf('estado_ejecucion');
    if (executionColumn >= 0 && sheet.getMaxRows() > 1) {
      var executionRule = SpreadsheetApp.newDataValidation().requireValueInList(DGDD_SCHEMA.executionStates, true).setAllowInvalid(false).build();
      sheet.getRange(2, executionColumn + 1, sheet.getMaxRows() - 1, 1).setDataValidation(executionRule);
    }
  });
  ui.alert('Integración preparada', 'Se conservaron los datos existentes. Importe las plantillas CSV y revise las propiedades del script. El token de lectura se ha generado en DGDD_CONTENT_READ_TOKEN; cópielo en la variable privada APPS_SCRIPT_CONTENT_TOKEN de Netlify. Configure también NETLIFY_BUILD_HOOK_URL cuando disponga del hook real. No se ha solicitado ningún despliegue.', ui.ButtonSet.OK);
}

function dgddSpreadsheet_() {
  var id = PropertiesService.getScriptProperties().getProperty(DGDD_PROPERTY_KEYS.spreadsheetId);
  if (!id) throw new Error('Ejecute Preparar integración antes de publicar.');
  return SpreadsheetApp.openById(id);
}

function dgddCellValue_(value) {
  if (Object.prototype.toString.call(value) === '[object Date]') {
    if (!Number.isFinite(value.getTime())) throw new Error('Se encontró una fecha no válida en Sheets.');
    return Utilities.formatDate(value, DGDD_SCHEMA.timeZone, 'yyyy-MM-dd');
  }
  return value === null || value === undefined ? '' : value;
}

function dgddReadEditorial_(spreadsheet) {
  var tables = {};
  Object.keys(DGDD_SCHEMA.sheets).forEach(function (name) {
    var sheet = spreadsheet.getSheetByName(name);
    if (!sheet) throw new Error('Falta la pestaña ' + name + '. Importe la plantilla correspondiente.');
    var values = sheet.getDataRange().getValues();
    if (!values.length) throw new Error('La pestaña ' + name + ' está vacía.');
    var headers = values.shift().map(dgddText);
    var nonEmptyHeaders = headers.filter(Boolean);
    if (new Set(nonEmptyHeaders).size !== nonEmptyHeaders.length) throw new Error('La pestaña ' + name + ' contiene encabezados duplicados.');
    var optionalHeaders = DGDD_SCHEMA.optionalColumns && DGDD_SCHEMA.optionalColumns[name] || [];
    DGDD_SCHEMA.sheets[name].forEach(function (header) {
      if (headers.indexOf(header) < 0 && optionalHeaders.indexOf(header) < 0) throw new Error('Falta la columna ' + header + ' en ' + name + '.');
    });
    tables[name] = values.filter(function (row) {
      return row.some(function (cell) { return cell !== '' && cell !== null; });
    }).map(function (row) {
      var item = {};
      // Lista explícita de campos públicos: las columnas internas adicionales
      // no pasan a la publicación.
      DGDD_SCHEMA.sheets[name].forEach(function (header) {
        var column = headers.indexOf(header);
        item[header] = column < 0 ? '' : dgddCellValue_(row[column]);
      });
      return item;
    });
  });
  return tables;
}

function dgddSourceUpdatedAt_(spreadsheetId) {
  try { return DriveApp.getFileById(spreadsheetId).getLastUpdated().toISOString(); }
  catch (ignored) { return null; }
}

function dgddVersion_() {
  return Utilities.formatDate(new Date(), 'UTC', "yyyyMMdd'T'HHmmss'Z'") + '-' + Utilities.getUuid().slice(0, 8);
}

function dgddBuildSnapshot_(version) {
  var spreadsheet = dgddSpreadsheet_();
  var meta = {
    schemaVersion: DGDD_SCHEMA.schemaVersion,
    version: version,
    generatedAt: new Date().toISOString(),
    sourceUpdatedAt: dgddSourceUpdatedAt_(spreadsheet.getId()),
    timeZone: DGDD_SCHEMA.timeZone,
    source: 'google_sheets'
  };
  var content = dgddEditorialToPortal(dgddReadEditorial_(spreadsheet), meta);
  var validation = dgddValidateContent(content, { expectedVersion: version });
  if (!validation.valid) throw new Error(validation.errors.join('\n'));
  return { content: content, validation: validation };
}

function dgddValidateEditorial() {
  var ui = SpreadsheetApp.getUi();
  try {
    var built = dgddBuildSnapshot_('revision-local');
    var report = built.validation;
    var details = report.summary.actividades + ' actividades; ' + report.summary.modulos + ' módulos; ' + report.summary.resultadosInformados + ' resultados informados; ' + report.summary.contenido + ' contenidos administrables.';
    if (report.warnings.length) details += '\n\nAvisos:\n' + report.warnings.join('\n');
    ui.alert('Contenido válido para publicación', details + '\n\nEsta revisión no ha publicado archivos ni solicitado un build.', ui.ButtonSet.OK);
  } catch (error) {
    ui.alert('Revise el contenido', error.message, ui.ButtonSet.OK);
  }
}

function dgddPublicationFolder_() {
  var id = PropertiesService.getScriptProperties().getProperty(DGDD_PROPERTY_KEYS.folderId);
  if (!id) throw new Error('No está configurada la carpeta de publicaciones. Ejecute Preparar integración.');
  return DriveApp.getFolderById(id);
}

function dgddVersionIsValid_(version) {
  return typeof version === 'string' && /^[A-Za-z0-9][A-Za-z0-9._-]{0,95}$/.test(version);
}

function dgddPublicationFilename_(version) { return 'dgdd-' + version + '.json'; }

function dgddSavePublication_(content) {
  var version = content.meta.version;
  if (!dgddVersionIsValid_(version)) throw new Error('Versión de publicación inválida.');
  var folder = dgddPublicationFolder_();
  var name = dgddPublicationFilename_(version);
  if (folder.getFilesByName(name).hasNext()) throw new Error('La versión ya existe. Las publicaciones no se sobrescriben.');
  var file = folder.createFile(name, JSON.stringify(content, null, 2), MimeType.PLAIN_TEXT);
  var manifest = {
    version: version, fileId: file.getId(), generatedAt: content.meta.generatedAt,
    sourceUpdatedAt: content.meta.sourceUpdatedAt, timeZone: content.meta.timeZone
  };
  PropertiesService.getScriptProperties().setProperty(DGDD_PROPERTY_KEYS.latest, JSON.stringify(manifest));
  return manifest;
}

function dgddRequestBuild_(version) {
  var properties = PropertiesService.getScriptProperties();
  var hook = properties.getProperty(DGDD_PROPERTY_KEYS.buildHook);
  if (!hook) return { status: 'no_configurado', version: version, requestedAt: null };
  if (!/^https:\/\/api\.netlify\.com\/build_hooks\/[A-Za-z0-9_-]+(?:\?[^\s]*)?$/.test(hook)) throw new Error('NETLIFY_BUILD_HOOK_URL no tiene el formato de un build hook de Netlify.');
  var status;
  try {
    var response = UrlFetchApp.fetch(hook, { method: 'post', contentType: 'application/json', payload: JSON.stringify({ version: version }), muteHttpExceptions: true, followRedirects: false });
    var code = response.getResponseCode();
    status = { status: code >= 200 && code < 300 ? 'solicitado' : 'solicitud_rechazada', version: version, requestedAt: new Date().toISOString(), httpStatus: code };
  } catch (ignored) {
    status = { status: 'error_de_conexion', version: version, requestedAt: new Date().toISOString() };
  }
  properties.setProperty(DGDD_PROPERTY_KEYS.lastBuildRequest, JSON.stringify(status));
  return status;
}

function dgddPublish() {
  var ui = SpreadsheetApp.getUi();
  var lock = LockService.getScriptLock();
  var manifest = null;
  try {
    lock.waitLock(30000);
    var built = dgddBuildSnapshot_(dgddVersion_());
    manifest = dgddSavePublication_(built.content);
    var request = dgddRequestBuild_(manifest.version);
    var message = 'Publicación JSON creada: ' + manifest.version + '.\n';
    if (request.status === 'solicitado') message += 'Netlify aceptó la solicitud de build. Compruebe su resultado en Deploys; aceptar el hook no confirma que el sitio se haya actualizado.';
    else if (request.status === 'no_configurado') message += 'No hay build hook configurado. La publicación está disponible, pero no se ha solicitado una actualización del sitio.';
    else message += 'La solicitud de build no se completó. La publicación JSON se conserva. Revise Netlify y puede reintentar esta versión desde el menú.';
    if (built.validation.warnings.length) message += '\n\nAvisos editoriales: ' + built.validation.warnings.length + '. Ejecute Validar contenido para verlos.';
    ui.alert('Publicación editorial', message, ui.ButtonSet.OK);
  } catch (error) {
    var prefix = manifest ? 'La publicación JSON se creó, pero no se completó la solicitud a Netlify.\n' : 'No se ha creado una nueva publicación.\n';
    ui.alert('No se completó la operación', prefix + error.message, ui.ButtonSet.OK);
  } finally { if (lock.hasLock()) lock.releaseLock(); }
}

function dgddLatestManifest_() {
  var raw = PropertiesService.getScriptProperties().getProperty(DGDD_PROPERTY_KEYS.latest);
  if (!raw) return null;
  var manifest = JSON.parse(raw);
  if (!dgddVersionIsValid_(manifest.version)) throw new Error('La referencia de última publicación es inválida.');
  return manifest;
}

function dgddReadPublication_(version) {
  if (!dgddVersionIsValid_(version)) throw new Error('INVALID_VERSION');
  var files = dgddPublicationFolder_().getFilesByName(dgddPublicationFilename_(version));
  if (!files.hasNext()) throw new Error('NOT_FOUND');
  var file = files.next();
  if (files.hasNext()) throw new Error('DUPLICATE_VERSION');
  var content = JSON.parse(file.getBlob().getDataAsString('UTF-8'));
  var validation = dgddValidateContent(content, { expectedVersion: version });
  if (!validation.valid) throw new Error('SNAPSHOT_INVALID');
  return content;
}

function dgddShowLastPublication() {
  var ui = SpreadsheetApp.getUi();
  var manifest = dgddLatestManifest_();
  if (!manifest) { ui.alert('Todavía no hay una publicación editorial.'); return; }
  var request = PropertiesService.getScriptProperties().getProperty(DGDD_PROPERTY_KEYS.lastBuildRequest);
  var status = request ? JSON.parse(request) : null;
  var message = 'Versión: ' + manifest.version + '\nGenerada: ' + manifest.generatedAt + '\nActualización del archivo de origen: ' + (manifest.sourceUpdatedAt || 'no registrada');
  if (status) message += '\nÚltima solicitud de build: ' + status.status + ' (' + status.version + ')';
  message += '\n\nLa confirmación del despliegue se consulta en Netlify.';
  ui.alert('Última publicación editorial', message, ui.ButtonSet.OK);
}

function dgddRequestVersionBuild() {
  var ui = SpreadsheetApp.getUi();
  var answer = ui.prompt('Solicitar build de una versión', 'Indique una versión existente. La solicitud no modifica las publicaciones guardadas.', ui.ButtonSet.OK_CANCEL);
  if (answer.getSelectedButton() !== ui.Button.OK) return;
  var version = answer.getResponseText().trim();
  try {
    dgddReadPublication_(version);
    var request = dgddRequestBuild_(version);
    ui.alert('Solicitud a Netlify', 'Estado: ' + request.status + '. Versión: ' + version + '. Compruebe el resultado del despliegue en Netlify.', ui.ButtonSet.OK);
  } catch (error) { ui.alert('No se solicitó el build', error.message, ui.ButtonSet.OK); }
}

function dgddEqualToken_(actual, expected) {
  if (typeof actual !== 'string' || typeof expected !== 'string' || actual.length !== expected.length) return false;
  var difference = 0;
  for (var i = 0; i < actual.length; i += 1) difference |= actual.charCodeAt(i) ^ expected.charCodeAt(i);
  return difference === 0;
}

function dgddJson_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(event) {
  var params = event && event.parameter ? event.parameter : {};
  var properties = PropertiesService.getScriptProperties();
  var expectedToken = properties.getProperty(DGDD_PROPERTY_KEYS.readToken);
  if (!expectedToken) return dgddJson_({ error: { code: 'NOT_CONFIGURED' } });
  if (!dgddEqualToken_(params.token || '', expectedToken)) return dgddJson_({ error: { code: 'UNAUTHORIZED' } });
  if (params.action && params.action !== 'content' && params.action !== 'manifest') return dgddJson_({ error: { code: 'UNKNOWN_ACTION' } });
  try {
    var requested = params.version ? String(params.version) : '';
    if (requested && !dgddVersionIsValid_(requested)) return dgddJson_({ error: { code: 'INVALID_VERSION' } });
    if (!requested) {
      var manifest = dgddLatestManifest_();
      if (!manifest) return dgddJson_({ error: { code: 'NOT_FOUND' } });
      requested = manifest.version;
    }
    // Se lee una publicación fija de Drive. Nunca se reconstruye desde Sheets
    // al atender un GET del build o del navegador.
    var content = dgddReadPublication_(requested);
    return dgddJson_(params.action === 'manifest' ? content.meta : content);
  } catch (error) {
    var code = ['NOT_FOUND', 'INVALID_VERSION', 'DUPLICATE_VERSION', 'SNAPSHOT_INVALID'].indexOf(error.message) >= 0 ? error.message : 'READ_ERROR';
    return dgddJson_({ error: { code: code } });
  }
}

function doPost() {
  // Publicar requiere el menú ejecutado por un editor autorizado del archivo.
  return dgddJson_({ error: { code: 'READ_ONLY_ENDPOINT' } });
}
