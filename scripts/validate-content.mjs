import { readFile } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath, pathToFileURL } from 'node:url';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
let toolkitPromise;

/** Carga el mismo código puro que se ejecuta al publicar desde Apps Script. */
export function loadContentToolkit() {
  if (!toolkitPromise) {
    toolkitPromise = (async () => {
      const context = vm.createContext({});
      for (const filename of ['Schema.gs', 'Transform.gs', 'Validation.gs']) {
        const source = await readFile(path.join(projectRoot, 'apps-script', filename), 'utf8');
        new vm.Script(source, { filename }).runInContext(context, { timeout: 5000 });
      }
      return context;
    })();
  }
  return toolkitPromise;
}

export async function validateContent(content, options = {}) {
  const toolkit = await loadContentToolkit();
  // La conversión elimina objetos de otro contexto al devolver el informe.
  return JSON.parse(JSON.stringify(toolkit.dgddValidateContent(content, options)));
}

export async function assertValidContent(content, options = {}) {
  const report = await validateContent(content, options);
  if (!report.valid) {
    const error = new Error(`Contenido no publicable:\n${report.errors.map(message => `- ${message}`).join('\n')}`);
    error.validation = report;
    throw error;
  }
  return report;
}

async function main() {
  const args = process.argv.slice(2);
  let filename = path.join(projectRoot, 'src/content/site.json');
  let expectedVersion = process.env.CONTENT_VERSION?.trim() || undefined;
  let json = false;
  let pathSeen = false;
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '--expected-version') {
      expectedVersion = args[++i];
      if (!expectedVersion) throw new Error('Falta el valor de --expected-version.');
    } else if (args[i] === '--json') {
      json = true;
    } else if (args[i].startsWith('-') || pathSeen) {
      throw new Error(`Argumento no reconocido: ${args[i]}`);
    } else {
      filename = path.resolve(args[i]);
      pathSeen = true;
    }
  }
  const content = JSON.parse(await readFile(filename, 'utf8'));
  const report = await validateContent(content, { expectedVersion });
  if (json) console.log(JSON.stringify(report, null, 2));
  else {
    console.log(`Contenido ${report.valid ? 'válido' : 'inválido'} · versión ${report.summary.version || 'sin versión'}`);
    console.log(`${report.summary.procesos || 0} procesos · ${report.summary.actividades || 0} actividades · ${report.summary.modulos || 0} módulos · ${report.summary.resultadosInformados || 0} resultados informados`);
    report.errors.forEach(error => console.error(`ERROR: ${error}`));
    report.warnings.forEach(warning => console.warn(`AVISO: ${warning}`));
  }
  if (!report.valid) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
