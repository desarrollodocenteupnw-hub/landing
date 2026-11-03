import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { assertValidContent, loadContentToolkit } from './validate-content.mjs';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function csvCell(value) {
  const text = value === undefined || value === null ? '' : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

async function main() {
  const args = process.argv.slice(2);
  let initialize = false;
  let version = 'incluido-v2';
  let outputDir = path.join(projectRoot, 'docs/sheets');
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--initialize') initialize = true;
    else if (args[i] === '--version') version = args[++i];
    else if (args[i] === '--out') outputDir = path.resolve(args[++i]);
    else throw new Error(`Argumento no reconocido: ${args[i]}`);
  }
  const toolkit = await loadContentToolkit();
  const sitePath = path.join(projectRoot, 'src/content/site.json');
  let content;
  if (initialize) {
    const original = JSON.parse(await readFile(path.join(projectRoot, 'src/content/original.json'), 'utf8'));
    content = JSON.parse(JSON.stringify(toolkit.dgddInitialSnapshot(original, {
      schemaVersion: 2, version, generatedAt: new Date().toISOString(), sourceUpdatedAt: null,
      timeZone: 'America/Lima', source: 'archivo_original'
    })));
    await assertValidContent(content, { expectedVersion: version });
    await writeFile(sitePath, `${JSON.stringify(content, null, 2)}\n`, 'utf8');
  } else content = JSON.parse(await readFile(sitePath, 'utf8'));

  await assertValidContent(content);
  const tables = toolkit.dgddPortalToEditorial(content);
  // Comprueba que todas las tablas editoriales se pueden volver a convertir en publicación.
  const roundTrip = toolkit.dgddEditorialToPortal(tables, content.meta);
  await assertValidContent(roundTrip, { expectedVersion: content.meta.version });
  await mkdir(outputDir, { recursive: true });
  for (const [name, headers] of Object.entries(toolkit.DGDD_SCHEMA.sheets)) {
    const lines = [headers.map(csvCell).join(',')];
    for (const row of tables[name]) lines.push(headers.map(header => csvCell(row[header])).join(','));
    await writeFile(path.join(outputDir, `${name}.csv`), `\uFEFF${lines.join('\r\n')}\r\n`, 'utf8');
    console.log(`${name}: ${tables[name].length} filas`);
  }
  const schema = { schemaVersion: toolkit.DGDD_SCHEMA.schemaVersion, timeZone: toolkit.DGDD_SCHEMA.timeZone, publicationStates: toolkit.DGDD_SCHEMA.publicationStates, executionStates: toolkit.DGDD_SCHEMA.executionStates, evaluationPhases: toolkit.DGDD_SCHEMA.evaluationPhases, optionalColumns: toolkit.DGDD_SCHEMA.optionalColumns, sheets: toolkit.DGDD_SCHEMA.sheets };
  await writeFile(path.join(outputDir, 'schema.json'), `${JSON.stringify(schema, null, 2)}\n`, 'utf8');
  console.log(`Plantillas generadas desde ${content.meta.version}. No se ha conectado ni modificado Google Sheets.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
