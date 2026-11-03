import { readFile, writeFile, rename, unlink, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { assertValidContent } from './validate-content.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const VERSION_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,95}$/;
const MAX_RESPONSE_BYTES = 5 * 1024 * 1024;

export function requestedVersion(env = process.env) {
  const explicit = env.CONTENT_VERSION?.trim() || null;
  let fromHook = null;
  const incoming = env.INCOMING_HOOK_BODY?.trim();
  if (incoming) {
    let body;
    try { body = JSON.parse(incoming); }
    catch {
      // Netlify documenta este cuerpo como URL-encoded; también se acepta
      // el JSON ya decodificado para builds manuales y herramientas locales.
      try { body = JSON.parse(decodeURIComponent(incoming.replaceAll('+', ' '))); }
      catch { throw new Error('INCOMING_HOOK_BODY no contiene un objeto JSON válido.'); }
    }
    if (!body || typeof body !== 'object' || Array.isArray(body) || typeof body.version !== 'string') {
      throw new Error('El build hook debe indicar una versión exacta mediante {"version":"…"}.');
    }
    fromHook = body.version.trim();
    if (!fromHook) throw new Error('La versión del build hook está vacía.');
  }
  if (explicit && fromHook && explicit !== fromHook) {
    throw new Error('CONTENT_VERSION e INCOMING_HOOK_BODY solicitan versiones distintas.');
  }
  const version = explicit || fromHook;
  if (version && !VERSION_PATTERN.test(version)) throw new Error('La versión solicitada tiene un formato inválido.');
  if (incoming && !version) throw new Error('La versión del build hook está vacía.');
  return version;
}

function contentEndpoint(raw, token, version) {
  let url;
  try { url = new URL(raw); }
  catch { throw new Error('APPS_SCRIPT_CONTENT_URL debe ser una URL válida de la implementación web /exec.'); }
  const localTest = url.protocol === 'http:' && ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname);
  if (url.protocol !== 'https:' && !localTest) throw new Error('El endpoint de contenido debe usar HTTPS.');
  if (url.username || url.password || url.hash) throw new Error('El endpoint no debe contener credenciales de URL ni fragmentos.');
  if (/script\.google\.com$/.test(url.hostname) && !url.pathname.endsWith('/exec')) {
    throw new Error('Use la URL /exec del despliegue web, no la URL de prueba /dev.');
  }
  url.searchParams.set('action', 'content');
  if (version) url.searchParams.set('version', version);
  else url.searchParams.delete('version');
  if (token) url.searchParams.set('token', token);
  return url;
}

async function readLimitedJson(response) {
  const advertised = Number(response.headers.get('content-length'));
  if (advertised && advertised > MAX_RESPONSE_BYTES) throw new Error('La publicación supera el tamaño admitido.');
  if (!response.body) throw new Error('El endpoint devolvió una respuesta vacía.');
  const reader = response.body.getReader();
  const chunks = [];
  let bytes = 0;
  try {
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      bytes += next.value.byteLength;
      if (bytes > MAX_RESPONSE_BYTES) throw new Error('La publicación supera el tamaño admitido.');
      chunks.push(next.value);
    }
  } catch (error) {
    await reader.cancel().catch(() => {});
    throw error;
  } finally { reader.releaseLock(); }
  const body = Buffer.concat(chunks).toString('utf8');
  let content;
  try { content = JSON.parse(body); }
  catch { throw new Error('El endpoint no devolvió JSON válido. Revise la implementación /exec y su acceso sin sesión de Google.'); }
  if (content?.error) {
    const code = typeof content.error.code === 'string' && /^[A-Z_]+$/.test(content.error.code) ? content.error.code : 'PUBLICATION_ERROR';
    throw new Error(`Apps Script rechazó la lectura de la publicación (${code}).`);
  }
  return content;
}

export async function syncContent({ env = process.env, outputPath = path.join(projectRoot, 'src/content/site.json'), fetchImpl = fetch, log = console.log } = {}) {
  const sourceUrl = env.APPS_SCRIPT_CONTENT_URL?.trim();
  const token = env.APPS_SCRIPT_CONTENT_TOKEN?.trim();
  const version = requestedVersion(env);

  if (!sourceUrl) {
    if (token) throw new Error('Hay un token configurado, pero falta APPS_SCRIPT_CONTENT_URL.');
    const bundled = JSON.parse(await readFile(outputPath, 'utf8'));
    const report = await assertValidContent(bundled, { expectedVersion: version });
    log(`Sin conexión editorial configurada: se utiliza la publicación incluida ${report.summary.version}.`);
    return { source: 'bundled', version: report.summary.version, report };
  }

  const endpoint = contentEndpoint(sourceUrl, token, version);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 45000);
  let content;
  try {
    const response = await fetchImpl(endpoint, { method: 'GET', redirect: 'follow', signal: controller.signal, headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error(`El endpoint respondió HTTP ${response.status}.`);
    content = await readLimitedJson(response);
  } catch (error) {
    if (controller.signal.aborted) throw new Error('La lectura de Apps Script excedió 45 segundos. El build se detiene y conserva la versión anterior del sitio.');
    // No se imprimen la URL completa, el token ni el cuerpo del servidor.
    if (error instanceof TypeError) throw new Error('No se pudo conectar con Apps Script. El build se detiene; no se usará una copia silenciosa.');
    throw error;
  } finally { clearTimeout(timer); }

  const report = await assertValidContent(content, { expectedVersion: version });
  await mkdir(path.dirname(outputPath), { recursive: true });
  const temporary = `${outputPath}.tmp-${process.pid}-${Date.now()}`;
  try {
    await writeFile(temporary, `${JSON.stringify(content, null, 2)}\n`, 'utf8');
    await rename(temporary, outputPath);
  } finally { await unlink(temporary).catch(() => {}); }
  log(`Publicación validada: ${report.summary.version} · ${report.summary.actividades} actividades · ${report.summary.resultadosInformados} resultados informados.`);
  return { source: 'apps-script', version: report.summary.version, report };
}

async function main() {
  const args = process.argv.slice(2);
  let outputPath;
  if (args.length) {
    if (args.length !== 2 || args[0] !== '--out') throw new Error('Uso: node scripts/sync-content.mjs [--out archivo.json]');
    outputPath = path.resolve(args[1]);
  }
  await syncContent({ outputPath });
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
