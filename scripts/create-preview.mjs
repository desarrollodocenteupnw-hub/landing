/** Export a navigable review copy with embedded resources and a static first render. */
import {readFile,writeFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(project,'dist');
const output=path.resolve(process.argv[2]||path.join(project,'Portal_Desarrollo_Docente_Vista_Previa.html'));
const fontLicense=await readFile(path.join(project,'public/fonts/OFL-HankenGrotesk.txt'),'utf8');
const pages={};const assets={};
async function walk(directory){
 for(const item of await readdir(directory,{withFileTypes:true})){
  const file=path.join(directory,item.name);
  if(item.isDirectory()){await walk(file);continue;}
  const relative='/'+path.relative(dist,file).split(path.sep).join('/');
  if(relative.endsWith('.html')){
   const route=relative.endsWith('/index.html')?relative.slice(0,-10):relative;
   pages[route]=await readFile(file,'utf8');
  }else{
   const extension=path.extname(relative);
   const mime={'.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'}[extension];
   if(mime)assets[relative]={mime,data:(await readFile(file)).toString('base64')};
  }
 }
}
await walk(dist);
if(!pages['/'])throw new Error('Construye el portal antes de exportar la vista previa.');

// Data resources are readable from sandboxed srcdoc documents. Parent-owned blob URLs are not.
function createAssetResolver(bundle){
 const urls=new Map();
 const decode=value=>Uint8Array.from(atob(value),character=>character.charCodeAt(0));
 const textOf=entry=>new TextDecoder().decode(decode(entry.data));
 const encode=text=>{
  const bytes=new TextEncoder().encode(text);let binary='';
  for(let offset=0;offset<bytes.length;offset+=8192)binary+=String.fromCharCode(...bytes.subarray(offset,offset+8192));
  return btoa(binary);
 };
 function assetUrl(key){
  if(urls.has(key))return urls.get(key);
  const entry=bundle.assets[key];if(!entry)return key;
  let encoded=entry.data;
  if(entry.mime==='text/css'){
   let css=textOf(entry);
   Object.keys(bundle.assets).filter(item=>!item.endsWith('.css')&&!item.endsWith('.js')).forEach(item=>{if(css.includes(item))css=css.split(item).join(assetUrl(item));});
   encoded=encode(css);
  }
  if(entry.mime==='text/javascript'){
   let code=textOf(entry);
   code=code.replace(/(["'\x60])(\.\/[^"'\x60]+\.js)\1/g,(_match,quote,relative)=>quote+assetUrl(new URL(relative,'https://preview.local'+key).pathname)+quote);
   code=code.replace(/\b(?:window\.)?location\.search\b/g,'window.__portalLocation.search').replace(/\b(?:window\.)?location\.hash\b/g,'window.__portalLocation.hash').replace(/\b(?:window\.)?history\.replaceState\b/g,'window.__portalHistory.replaceState');
   encoded=encode(code);
  }
  const result='data:'+entry.mime+';base64,'+encoded;urls.set(key,result);return result;
 }
 return assetUrl;
}

function frameBootstrap(virtual){
 window.__portalLocation=virtual;
 const virtualUrl=()=>new URL(window.__portalLocation.pathname+window.__portalLocation.search+window.__portalLocation.hash,'https://preview.local');
 window.__portalHistory={replaceState:(_state,_title,target)=>{
  const next=new URL(target,virtualUrl());window.__portalLocation={pathname:next.pathname,search:next.search,hash:next.hash};
  parent.postMessage({type:'portal-replace',path:next.pathname+next.search+next.hash},'*');
 }};
 document.addEventListener('click',event=>{
  const anchor=event.target.closest('a');if(!anchor||anchor.hasAttribute('download'))return;
  const href=anchor.getAttribute('href')||'';
  if(href.startsWith('#')){
   event.preventDefault();const target=document.getElementById(decodeURIComponent(href.slice(1)));
   if(target){if(target.tagName==='DETAILS')target.open=true;target.scrollIntoView({behavior:document.documentElement.dataset.motion==='reduced'?'instant':'smooth'});window.__portalLocation.hash=href;dispatchEvent(new HashChangeEvent('hashchange'));}
   return;
  }
  if(href.startsWith('/')){event.preventDefault();parent.postMessage({type:'portal-navigate',path:href},'*');}
 },true);
 addEventListener('message',event=>{
  if(event.source===parent&&event.data?.type==='portal-replay-intro')document.querySelector('[data-intro-replay]')?.click();
  if(event.source===parent&&event.data?.type==='portal-scroll-target'){
   const behavior=document.documentElement.dataset.motion==='reduced'?'instant':'smooth';
   const id=decodeURIComponent((event.data.hash||'').slice(1));const target=id&&document.getElementById(id);
   if(target){if(target.tagName==='DETAILS')target.open=true;target.scrollIntoView({behavior});}else window.scrollTo({top:0,behavior});
  }
 });
 document.addEventListener('DOMContentLoaded',()=>{
  const id=decodeURIComponent(window.__portalLocation.hash.slice(1));const target=id&&document.getElementById(id);
  if(target){if(target.tagName==='DETAILS')target.open=true;requestAnimationFrame(()=>target.scrollIntoView());}
  parent.postMessage({type:'portal-ready',path:window.__portalLocation.pathname},'*');
 });
}

function createPreviewDocument(source,virtual,assetUrl,bootSource,assetKeys){
 let html=source;
 assetKeys.forEach(key=>{if(html.includes(key))html=html.split(key).join(assetUrl(key));});
 const boot='('+bootSource+')('+JSON.stringify(virtual).replace(/</g,'\\u003c')+');';
 return html.replace('<head>','<head><script>'+boot+'<'+ '/script>');
}

const assetKeys=Object.keys(assets).sort((a,b)=>b.length-a.length);
const assetUrl=createAssetResolver({assets});
const initial=createPreviewDocument(pages['/'],{pathname:'/',search:'',hash:''},assetUrl,frameBootstrap.toString(),assetKeys);
const escapeAttribute=value=>value.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const data=JSON.stringify({pages,assets}).replace(/</g,'\\u003c');
const reviewFont=assetUrl('/fonts/hanken-grotesk-latin-variable.woff2');
const html=String.raw`<!doctype html>
<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Vista previa actualizada · Desarrollo Docente Wiener</title>
<script type="text/plain" id="font-license-hanken-grotesk">${fontLicense}</script>
<style>
@font-face{font-family:ReviewHanken;src:url('${reviewFont}') format('woff2');font-weight:100 900;font-display:swap}
*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;background:#f5f7f4}body{display:flex;flex-direction:column;font-family:ReviewHanken,Arial,sans-serif;color:#172021}
.review-bar{display:flex;align-items:center;justify-content:space-between;gap:16px;flex:none;min-height:56px;padding:10px 24px;background:#172021;color:white;border-bottom:3px solid #07c8cc}
.review-label{font-size:12px;line-height:1.3;letter-spacing:.04em}.review-label strong{display:block;font-size:13px;letter-spacing:0}.review-nav{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.review-nav a,.review-nav button{font:600 12px ReviewHanken,Arial,sans-serif;line-height:1.2;padding:9px 12px;color:white;background:transparent;border:1px solid #ffffff40;border-radius:4px;text-decoration:none;cursor:pointer}
.review-nav [data-preview-route="/agenda/#eventos"]{background:#07c8cc;border-color:#07c8cc;color:#172021}.review-nav a:hover,.review-nav button:hover{border-color:white}.review-nav a:focus-visible,.review-nav button:focus-visible{outline:2px solid #fdd758;outline-offset:3px}
#portal-preview{display:block;width:100%;flex:1;min-height:0;border:0;background:#f5f7f4}.review-note{margin:0;padding:8px 24px;background:#fff4cf;font-size:13px}
@media(max-width:760px){.review-bar{align-items:flex-start;flex-direction:column;padding:9px 14px;gap:8px}.review-label strong{display:inline;margin-right:8px}.review-label{font-size:10px}.review-nav{gap:5px}.review-nav a,.review-nav button{font-size:11px;padding:8px}}
</style></head>
<body><header class="review-bar"><div class="review-label"><strong>Desarrollo Docente · Vista previa actualizada</strong>Cinco procesos · Experiencia institucional renovada</div><nav class="review-nav" aria-label="Accesos de revisión"><a href="#/" data-preview-route="/">Portada</a><a href="#/agenda/#eventos" data-preview-route="/agenda/#eventos">Ver eventos</a><button type="button" id="review-intro">Repetir intro</button><a href="#/presentar/" data-preview-route="/presentar/">Presentación</a></nav></header>
<noscript><p class="review-note">El diseño está visible. Para navegar entre páginas y reproducir las animaciones, abre este archivo en un navegador con JavaScript habilitado.</p></noscript>
<iframe id="portal-preview" title="Vista previa navegable de Desarrollo Docente" allow="fullscreen" srcdoc="${escapeAttribute(initial)}"></iframe>
<script type="application/json" id="portal-package">${data}</script>
<script>
(()=>{
const bundle=JSON.parse(document.getElementById('portal-package').textContent);
const frame=document.getElementById('portal-preview');
const assetUrl=(${createAssetResolver.toString()})(bundle);
const buildDocument=(${createPreviewDocument.toString()});
const bootSource=${JSON.stringify(frameBootstrap.toString())};
const assetKeys=Object.keys(bundle.assets).sort((a,b)=>b.length-a.length);
let rendered='/';let replayPending=false;
function syncHistory(current,mode){try{history[mode==='push'?'pushState':'replaceState'](null,'','#'+current);}catch{}}
function render(target,mode='push'){
 const next=new URL(target||'/','https://preview.local');
 const route=next.pathname.endsWith('/')||next.pathname.endsWith('.html')?next.pathname:next.pathname+'/';
 const current=route+next.search+next.hash;
 if(current===rendered){frame.contentWindow.postMessage({type:'portal-scroll-target',hash:next.hash},'*');return;}
 rendered=current;
 const virtual={pathname:route,search:next.search,hash:next.hash};
 frame.srcdoc=buildDocument(bundle.pages[route]||bundle.pages['/404.html'],virtual,assetUrl,bootSource,assetKeys);
 if(mode!=='history')syncHistory(current,mode);
}
document.querySelectorAll('[data-preview-route]').forEach(link=>link.addEventListener('click',event=>{event.preventDefault();render(link.dataset.previewRoute);}));
document.getElementById('review-intro').addEventListener('click',()=>{
 if(new URL(rendered,'https://preview.local').pathname==='/')frame.contentWindow.postMessage({type:'portal-replay-intro'},'*');
 else{replayPending=true;render('/');}
});
addEventListener('message',event=>{
 if(event.source!==frame.contentWindow)return;
 if(event.data?.type==='portal-ready'&&replayPending){replayPending=false;frame.contentWindow.postMessage({type:'portal-replay-intro'},'*');}
 if(typeof event.data?.path!=='string')return;
 if(event.data.type==='portal-navigate')render(event.data.path);
 if(event.data.type==='portal-replace'){rendered=event.data.path;syncHistory(rendered,'replace');}
});
addEventListener('hashchange',()=>render(location.hash.slice(1)||'/','history'));
const initialPath=location.hash.slice(1)||'/';
if(initialPath!=='/')render(initialPath,'replace');else syncHistory('/','replace');
})();
</script></body></html>`;
await writeFile(output,html,'utf8');
console.log(`Vista previa autónoma: ${output} · ${Object.keys(pages).length} páginas · ${Buffer.byteLength(html)} bytes · recursos incrustados y portada inicial`);
