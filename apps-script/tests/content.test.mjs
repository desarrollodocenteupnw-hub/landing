import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { loadContentToolkit, validateContent } from '../../scripts/validate-content.mjs';
import { requestedVersion, syncContent } from '../../scripts/sync-content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const snapshot = JSON.parse(await readFile(path.join(root, 'src/content/site.json'), 'utf8'));
const original = JSON.parse(await readFile(path.join(root, 'src/content/original.json'), 'utf8'));
const toolkit = await loadContentToolkit();
const clone = value => JSON.parse(JSON.stringify(value));
const editorial = () => clone(toolkit.dgddPortalToEditorial(snapshot));
const remote = version => ({ ...clone(snapshot), meta: { ...snapshot.meta, version } });

test('la importación conserva el original y el snapshot editorial no inventa resultados ni ejecución', async () => {
  const initial = clone(toolkit.dgddInitialSnapshot(original, snapshot.meta));
  for (const [collection, rows] of Object.entries(original)) {
    assert.equal(initial[collection].length, rows.length, collection);
    rows.forEach((row, index) => {
      for (const [field, value] of Object.entries(row)) {
        assert.deepEqual(initial[collection][index][field], value, `${collection}[${index}].${field}`);
      }
    });
  }
  assert.equal(snapshot.actividades.length, 144);
  assert.equal(snapshot.formacion.length, 32);
  assert.equal(snapshot.kpis.length, 9);
  assert.equal(snapshot.galeria.length, 94);
  assert.ok(snapshot.kpis.every(row => row.valor === ''));
  assert.ok(snapshot.actividades.every(row => row.estado_ejecucion === '' && row.fecha_cumplimiento === ''));
  assert.deepEqual(snapshot.iniciativas, []);
  assert.equal(snapshot.meta.sourceUpdatedAt, null);
  assert.equal((await validateContent(snapshot)).valid, true);
});

test('las pestañas normalizadas conservan datos y ampliaciones editoriales', async () => {
  const tables = editorial();
  assert.equal(Object.keys(tables).length, 11);
  assert.equal(tables.oferta_formativa.length, 40);
  assert.equal(tables.oferta_formativa.filter(row => row.tipo === 'ruta').length, 8);
  assert.equal(tables.recursos.length, 97);
  const rebuilt = clone(toolkit.dgddEditorialToPortal(tables, snapshot.meta));
  assert.equal((await validateContent(rebuilt)).valid, true);
  for (const [collection, rows] of Object.entries(snapshot)) {
    if (collection === 'meta' || collection === 'eventos') continue;
    assert.equal(rebuilt[collection].length, rows.length, collection);
    rows.forEach((row, index) => {
      for (const [field, value] of Object.entries(row)) {
        // El nombre de la galería se deriva del título editorial actual del evento.
        if (collection === 'galeria' && field === 'evento') continue;
        assert.deepEqual(rebuilt[collection][index][field], value, `${collection}[${index}].${field}`);
      }
    });
  }
  assert.deepEqual(rebuilt.eventos, snapshot.eventos);
  for (const photo of rebuilt.galeria) {
    const event = rebuilt.eventos.find(row => row.id === photo.evento_id);
    assert.equal(photo.evento, `${event.nombre} ${event.edicion}`);
  }
});

test('una memoria documental no convierte publicación en fecha del evento', async () => {
  const tables = editorial();
  const archival = tables.eventos.find(row => row.id === 'EV-04');
  assert.equal(archival.inicio, '');
  assert.equal(archival.fin, '');
  assert.equal(archival.fecha_publicacion, '2025-10-31');
  const rebuilt = clone(toolkit.dgddEditorialToPortal(tables, snapshot.meta));
  assert.equal(rebuilt.eventos.find(row => row.id === archival.id).inicio, '');
  assert.equal((await validateContent(rebuilt)).valid, true);
  archival.fecha_publicacion = '';
  const untraceable = clone(toolkit.dgddEditorialToPortal(tables, snapshot.meta));
  assert.equal((await validateContent(untraceable)).valid, false);
});

test('borradores se excluyen y no se publican hijos de padres ocultos', () => {
  const tables = editorial();
  tables.actividades[0].estado_publicacion = 'borrador';
  assert.equal(toolkit.dgddEditorialToPortal(tables, snapshot.meta).actividades.length, snapshot.actividades.length - 1);
  tables.oferta_formativa.find(row => row.tipo === 'ruta').estado_publicacion = 'borrador';
  assert.throws(() => toolkit.dgddEditorialToPortal(tables, snapshot.meta), /Módulo sin ruta publicada/);
  const broken = editorial();
  broken.recursos.find(row => row.tipo === 'foto_evento').evento_id = 'EV-INEXISTENTE';
  assert.throws(() => toolkit.dgddEditorialToPortal(broken, snapshot.meta), /Fotografía sin evento publicado/);
});

const invalidCases = [
  ['fecha inexistente', data => { data.actividades[0].inicio = '2026-02-29'; }, /fecha inexistente/],
  ['mes inexistente', data => { data.actividades[0].fin = '2026-13-01'; }, /fecha inexistente/],
  ['identificador duplicado', data => { data.actividades[1].id = data.actividades[0].id; }, /duplicado/],
  ['periodo inexistente', data => { data.actividades[0].periodo = '2099-I'; }, /referencia inexistente/],
  ['fase de evaluación ausente', data => { data.actividades.find(row => row.eje === 'Evaluación').fase = ''; }, /Evaluación requiere/],
  ['fase de evaluación desconocida', data => { data.actividades.find(row => row.eje === 'Evaluación').fase = 'cierre'; }, /Evaluación requiere/],
  ['ejecución sin evidencia temporal', data => { data.actividades[0].estado_ejecucion = 'completada'; }, /se requiere para confirmar/],
  ['porcentaje inferido del calendario', data => { data.actividades[0].avance = 80; }, /no se admite avance derivado/],
  ['URL ejecutable', data => { data.documentos[0].url = 'javascript:alert(1)'; }, /enlaces completos http/],
  ['resultado sin corte', data => { data.kpis[0].valor = 0; }, /fecha_corte/],
  ['meta porcentual imposible', data => { data.kpis.find(row => row.unidad === '%').meta = 101; }, /menor o igual a 100/],
  ['foto huérfana', data => { data.galeria[0].evento_id = 'EV-NO-EXISTE'; }, /referencia inexistente/],
  ['módulo duplicado', data => { data.formacion[1].modulo = data.formacion[0].modulo; }, /módulo duplicado/],
  ['contrato desconocido', data => { data.meta.schemaVersion = 999; }, /versión de contrato no admitida/],
  ['actualización de origen ausente', data => { delete data.meta.sourceUpdatedAt; }, /usar null cuando no consta/]
];

for (const [title, mutate, expected] of invalidCases) {
  test(`bloquea publicación: ${title}`, async () => {
    const data = clone(snapshot);
    mutate(data);
    const report = await validateContent(data);
    assert.equal(report.valid, false);
    assert.match(report.errors.join('\n'), expected);
  });
}

test('un cero respaldado es resultado; un campo en blanco no se transforma en cero', async () => {
  const data = clone(snapshot);
  data.kpis[0].valor = 0;
  data.kpis[0].fecha_corte = '2026-10-23';
  data.kpis[0].fuente = 'Fuente sintética usada solo por esta prueba';
  const report = await validateContent(data);
  assert.equal(report.valid, true);
  assert.equal(report.summary.resultadosInformados, 1);
  assert.equal(toolkit.dgddNumberOrBlank('   '), '');
  assert.equal(toolkit.dgddNumberOrBlank('0'), 0);
  assert.equal(toolkit.dgddNumberOrBlank(false), 'false');
  const tables = editorial();
  tables.indicadores[0].valor = false;
  const checked = toolkit.dgddEditorialToPortal(tables, snapshot.meta);
  assert.equal((await validateContent(checked)).valid, false);
});

test('la fecha bisiesta real y la ejecución confirmada son válidas', async () => {
  const data = clone(snapshot);
  data.actividades[0].inicio = '2028-02-29';
  data.actividades[0].fin = '2028-02-29';
  data.actividades[0].estado_ejecucion = 'completada';
  data.actividades[0].fecha_cumplimiento = '2028-03-01';
  assert.equal((await validateContent(data)).valid, true);
});

test('la versión pedida debe coincidir exactamente con meta.version', async () => {
  assert.equal((await validateContent(snapshot, { expectedVersion: 'otra-version' })).valid, false);
  assert.equal((await validateContent(snapshot, { expectedVersion: snapshot.meta.version })).valid, true);
});

test('versión de build: JSON, cuerpo URL-encoded, conflictos y ausencia', () => {
  assert.equal(requestedVersion({}), null);
  assert.equal(requestedVersion({ CONTENT_VERSION: 'v-publicada' }), 'v-publicada');
  assert.equal(requestedVersion({ INCOMING_HOOK_BODY: '{"version":"v-publicada"}' }), 'v-publicada');
  assert.equal(requestedVersion({ INCOMING_HOOK_BODY: encodeURIComponent('{"version":"v-publicada"}') }), 'v-publicada');
  assert.throws(() => requestedVersion({ CONTENT_VERSION: 'v1', INCOMING_HOOK_BODY: '{"version":"v2"}' }), /versiones distintas/);
  assert.throws(() => requestedVersion({ INCOMING_HOOK_BODY: '{}' }), /versión exacta/);
  assert.throws(() => requestedVersion({ INCOMING_HOOK_BODY: '{"version":""}' }), /vacía/);
  assert.throws(() => requestedVersion({ INCOMING_HOOK_BODY: '%ZZ' }), /JSON válido/);
  assert.throws(() => requestedVersion({ CONTENT_VERSION: '../otra' }), /formato inválido/);
});

async function withOutput(run) {
  const folder = await mkdtemp(path.join(tmpdir(), 'dgdd-content-test-'));
  const outputPath = path.join(folder, 'site.json');
  const before = JSON.stringify(snapshot);
  await writeFile(outputPath, before);
  try { await run({ outputPath, before }); }
  finally { await rm(folder, { recursive: true, force: true }); }
}

test('sin conexión configurada se valida el snapshot incluido sin mutarlo', async () => {
  await withOutput(async ({ outputPath, before }) => {
    const result = await syncContent({ env: {}, outputPath, log: () => {}, fetchImpl: () => { throw new Error('No debe llamar a red'); } });
    assert.equal(result.source, 'bundled');
    assert.equal(await readFile(outputPath, 'utf8'), before);
  });
});

test('sin conexión configurada también rechaza una versión incluida distinta', async () => {
  await withOutput(async ({ outputPath, before }) => {
    await assert.rejects(syncContent({ env: { CONTENT_VERSION: 'inexistente' }, outputPath, log: () => {} }), /no coincide exactamente/);
    assert.equal(await readFile(outputPath, 'utf8'), before);
  });
});

test('configuración parcial detiene el build', async () => {
  await withOutput(async ({ outputPath }) => {
    await assert.rejects(syncContent({ env: { APPS_SCRIPT_CONTENT_TOKEN: 'test-only-token' }, outputPath, log: () => {} }), /falta APPS_SCRIPT_CONTENT_URL/);
  });
});

test('sincroniza únicamente la versión pedida y no imprime el token', async () => {
  await withOutput(async ({ outputPath }) => {
    const logs = [];
    const content = remote('publicada-001');
    let observed;
    const result = await syncContent({
      env: { APPS_SCRIPT_CONTENT_URL: 'https://script.google.com/macros/s/test-only/exec', APPS_SCRIPT_CONTENT_TOKEN: 'test-only-token', INCOMING_HOOK_BODY: encodeURIComponent('{"version":"publicada-001"}') },
      outputPath, log: line => logs.push(line),
      fetchImpl: async (url, options) => {
        observed = { url: new URL(url), options };
        return new Response(JSON.stringify(content), { status: 200 });
      }
    });
    assert.equal(result.source, 'apps-script');
    assert.equal(observed.url.searchParams.get('version'), 'publicada-001');
    assert.equal(observed.url.searchParams.get('token'), 'test-only-token');
    assert.equal(observed.options.redirect, 'follow');
    assert.deepEqual(JSON.parse(await readFile(outputPath, 'utf8')), content);
    assert.ok(logs.every(line => !line.includes('test-only-token')));
  });
});

const badRemoteCases = [
  ['error HTTP', async () => new Response('no disponible', { status: 503 }), /HTTP 503/],
  ['error de conexión', async () => { throw new TypeError('fetch failed'); }, /No se pudo conectar/],
  ['pantalla de acceso HTML', async () => new Response('<html>login</html>'), /JSON válido/],
  ['error Apps Script con HTTP 200', async () => new Response('{"error":{"code":"UNAUTHORIZED"}}'), /UNAUTHORIZED/],
  ['versión diferente', async () => new Response(JSON.stringify(remote('version-incorrecta'))), /no coincide exactamente/],
  ['datos inválidos', async () => { const data = remote('solicitada'); data.actividades[0].inicio = '2026-02-30'; return new Response(JSON.stringify(data)); }, /fecha inexistente/],
  ['tamaño anunciado excesivo', async () => new Response('{}', { headers: { 'content-length': String(6 * 1024 * 1024) } }), /supera el tamaño/]
];

for (const [title, fetchImpl, expected] of badRemoteCases) {
  test(`una conexión configurada falla sin fallback ni escritura: ${title}`, async () => {
    await withOutput(async ({ outputPath, before }) => {
      await assert.rejects(syncContent({ env: { APPS_SCRIPT_CONTENT_URL: 'https://example.test/content', CONTENT_VERSION: 'solicitada' }, outputPath, fetchImpl, log: () => {} }), expected);
      assert.equal(await readFile(outputPath, 'utf8'), before);
    });
  });
}

async function appsScriptHarness() {
  const properties = new Map([
    ['DGDD_CONTENT_READ_TOKEN', 'test-only-token'],
    ['DGDD_PUBLICATIONS_FOLDER_ID', 'test-only-folder'],
    ['DGDD_LATEST_PUBLICATION', JSON.stringify({ version: 'v2' })]
  ]);
  const publications = new Map([
    ['dgdd-v1.json', [JSON.stringify(remote('v1'))]],
    ['dgdd-v2.json', [JSON.stringify(remote('v2'))]]
  ]);
  const calls = { drive: 0, sheets: 0, hook: [] };
  const folder = {
    getFilesByName(name) {
      const records = [...(publications.get(name) || [])];
      return { hasNext: () => records.length > 0, next: () => { const body = records.shift(); return { getBlob: () => ({ getDataAsString: () => body }) }; } };
    },
    createFile(name, body) { publications.set(name, [body]); return { getId: () => `test-file-${name}` }; }
  };
  const context = vm.createContext({
    PropertiesService: { getScriptProperties: () => ({ getProperty: key => properties.get(key) || null, setProperty: (key, value) => properties.set(key, value) }) },
    DriveApp: { getFolderById: id => { assert.equal(id, 'test-only-folder'); calls.drive += 1; return folder; } },
    SpreadsheetApp: { openById: () => { calls.sheets += 1; throw new Error('GET no debe leer Sheets'); } },
    ContentService: { MimeType: { JSON: 'application/json' }, createTextOutput: body => ({ body, setMimeType() { return this; } }) },
    MimeType: { PLAIN_TEXT: 'text/plain' },
    UrlFetchApp: { fetch: (url, options) => { calls.hook.push({ url, options }); return { getResponseCode: () => 201 }; } }
  });
  for (const name of ['Schema.gs', 'Transform.gs', 'Validation.gs', 'Code.gs']) {
    new vm.Script(await readFile(path.join(root, 'apps-script', name), 'utf8'), { filename: name }).runInContext(context);
  }
  return { context, properties, publications, calls };
}

test('Apps Script admite columnas opcionales ausentes y exige las columnas anteriores', async () => {
  const { context } = await appsScriptHarness();
  const initial = clone(toolkit.dgddInitialSnapshot(original, snapshot.meta));
  const legacy = clone(toolkit.dgddPortalToEditorial(initial));
  const data = Object.fromEntries(Object.entries(toolkit.DGDD_SCHEMA.sheets).map(([name, columns]) => {
    const optional = toolkit.DGDD_SCHEMA.optionalColumns[name] || [];
    const headers = [...columns].filter(column => !optional.includes(column));
    return [name, [headers, ...legacy[name].map(row => headers.map(header => row[header] ?? ''))]];
  }));
  const spreadsheet = { getSheetByName: name => ({ getDataRange: () => ({ getValues: () => clone(data[name]) }) }) };
  const read = clone(context.dgddReadEditorial_(spreadsheet));
  const rebuilt = clone(toolkit.dgddEditorialToPortal(read, snapshot.meta));
  assert.equal((await validateContent(rebuilt)).valid, true);
  assert.ok(rebuilt.eventos.every(event => event.fecha_publicacion === '' && event.slug === ''));
  data.eventos[0][data.eventos[0].indexOf('id')] = 'id_interno';
  assert.throws(() => context.dgddReadEditorial_(spreadsheet), /Falta la columna id en eventos/);
});

test('Apps Script sirve versiones inmutables de Drive y no reconstruye Sheets por petición', async () => {
  const { context, calls } = await appsScriptHarness();
  const exact = JSON.parse(context.doGet({ parameter: { token: 'test-only-token', version: 'v1' } }).body);
  const latest = JSON.parse(context.doGet({ parameter: { token: 'test-only-token' } }).body);
  assert.equal(exact.meta.version, 'v1');
  assert.equal(latest.meta.version, 'v2');
  assert.equal(calls.drive, 2);
  assert.equal(calls.sheets, 0);
});

test('Apps Script deniega lectura sin token antes de acceder a Drive', async () => {
  const { context, calls } = await appsScriptHarness();
  assert.equal(JSON.parse(context.doGet({ parameter: { token: 'incorrecto', version: 'v1' } }).body).error.code, 'UNAUTHORIZED');
  assert.equal(calls.drive, 0);
  assert.equal(JSON.parse(context.doPost().body).error.code, 'READ_ONLY_ENDPOINT');
});

test('Apps Script rechaza versiones ausentes, duplicadas o manipuladas', async () => {
  const { context, publications } = await appsScriptHarness();
  const request = version => JSON.parse(context.doGet({ parameter: { token: 'test-only-token', version } }).body);
  assert.equal(request('ausente').error.code, 'NOT_FOUND');
  assert.equal(request('../otra').error.code, 'INVALID_VERSION');
  publications.set('dgdd-v1.json', [JSON.stringify(remote('v1')), JSON.stringify(remote('v1'))]);
  assert.equal(request('v1').error.code, 'DUPLICATE_VERSION');
  publications.set('dgdd-v1.json', [JSON.stringify(remote('v2'))]);
  assert.equal(request('v1').error.code, 'SNAPSHOT_INVALID');
});

test('una publicación existente no se sobrescribe', async () => {
  const { context, publications } = await appsScriptHarness();
  const before = publications.get('dgdd-v1.json')[0];
  assert.throws(() => context.dgddSavePublication_(remote('v1')), /no se sobrescriben/);
  assert.equal(publications.get('dgdd-v1.json')[0], before);
});

test('el hook solicita la versión exacta y su aceptación no se llama despliegue', async () => {
  const { context, properties, calls } = await appsScriptHarness();
  properties.set('NETLIFY_BUILD_HOOK_URL', 'https://api.netlify.com/build_hooks/test-only-hook');
  const result = clone(context.dgddRequestBuild_('v1'));
  assert.equal(result.status, 'solicitado');
  assert.equal(result.version, 'v1');
  assert.deepEqual(JSON.parse(calls.hook[0].options.payload), { version: 'v1' });
  assert.equal(result.deployed, undefined);
  assert.equal(JSON.parse(properties.get('DGDD_LAST_BUILD_REQUEST')).status, 'solicitado');
});
