import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {spawn} from 'node:child_process';

const require=createRequire(import.meta.url);
const packageFile=require.resolve('astro/package.json');
const pkg=JSON.parse(readFileSync(packageFile,'utf8'));
const bin=typeof pkg.bin==='string'?pkg.bin:pkg.bin.astro;
const child=spawn(process.execPath,[resolve(dirname(packageFile),bin),...process.argv.slice(2)],{
  stdio:'inherit',
  env:{...process.env,ASTRO_TELEMETRY_DISABLED:'1'}
});
child.on('error',error=>{console.error(`No se pudo iniciar Astro: ${error.message}`);process.exitCode=1;});
child.on('exit',(code,signal)=>{process.exitCode=code??(signal?1:0);});
