import {upcomingActivities,reportedExecution} from '../lib/schedule';

const $ = <T extends Element>(selector:string,root:ParentNode=document) => root.querySelector<T>(selector);
const $$ = <T extends Element>(selector:string,root:ParentNode=document) => [...root.querySelectorAll<T>(selector)];
const reduced=()=>document.documentElement.dataset.motion==='reduced';
document.documentElement.classList.add('js-ready');
const uiLabels = (()=>{ try{return JSON.parse(document.querySelector('#ui-labels')?.textContent||'{}')}catch{return {}} })() as Record<string,string>;
const ui=(key:string,fallback:string)=>uiLabels[key]||fallback;

// Motion is progressive enhancement. Content is visible before this script runs.
const revealObserver = new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);
}),{threshold:.08,rootMargin:'0px 0px -30px 0px'});
$$<HTMLElement>('[data-reveal]').forEach((node,index)=>{
  if(reduced()||node.getBoundingClientRect().top<window.innerHeight*.92)return;
  node.classList.add('reveal-ready');
  if(node.parentElement?.classList.contains('process-grid'))node.style.setProperty('--reveal-delay',`${(index%5)*60}ms`);
  revealObserver.observe(node);
});

const header=$<HTMLElement>('#header');
const progress=$<HTMLElement>('.reading-progress span');
const heroImage=$<HTMLElement>('[data-hero-parallax]');
let scrollPending=false;
function renderScroll(){
  const y=window.scrollY;
  header?.classList.toggle('is-scrolled',y>20);
  const max=document.documentElement.scrollHeight-innerHeight;
  if(progress)progress.style.transform=`scaleX(${max>0?Math.min(1,y/max):0})`;
  if(!reduced()&&heroImage&&y<1000)heroImage.style.transform=`scale(1.035) translateY(${Math.min(y*.012,8)}px)`;
  scrollPending=false;
}
addEventListener('scroll',()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(renderScroll)}},{passive:true});
renderScroll();

const intro=$<HTMLElement>('#brand-intro');let introTimer:ReturnType<typeof setTimeout>;let introCloseTimer:ReturnType<typeof setTimeout>;
let introReturnFocus:HTMLElement|null=null;
const releaseHero=()=>document.documentElement.classList.add('hero-ready');
function closeIntro(){releaseHero();if(!intro)return;clearTimeout(introTimer);clearTimeout(introCloseTimer);intro.classList.add('intro-ending');introCloseTimer=setTimeout(()=>{intro.hidden=true;intro.classList.remove('intro-ending','is-playing');(introReturnFocus?.isConnected?introReturnFocus:$<HTMLElement>('#contenido'))?.focus({preventScroll:true});introReturnFocus=null;},340);}
function playIntro(){if(!intro||reduced()){releaseHero();return;}clearTimeout(introTimer);clearTimeout(introCloseTimer);const active=document.activeElement;introReturnFocus=active instanceof HTMLElement&&active!==document.body&&!intro.contains(active)?active:null;document.documentElement.classList.remove('hero-ready');intro.hidden=false;intro.classList.remove('is-playing','intro-ending');void intro.offsetWidth;intro.classList.add('is-playing');intro.querySelector<HTMLButtonElement>('[data-intro-skip]')?.focus({preventScroll:true});introTimer=setTimeout(closeIntro,2650);}
if(intro){let visited=false;try{visited=sessionStorage.getItem('wiener-intro')==='seen';sessionStorage.setItem('wiener-intro','seen')}catch{}if(!visited&&!reduced())playIntro();else releaseHero();}else releaseHero();
$$<HTMLButtonElement>('[data-intro-skip]').forEach(button=>button.addEventListener('click',closeIntro));
$$<HTMLButtonElement>('[data-intro-replay]').forEach(button=>button.addEventListener('click',playIntro));
intro?.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();closeIntro();}else if(event.key==='Tab'){event.preventDefault();intro.querySelector<HTMLButtonElement>('[data-intro-skip]')?.focus();}});
function updateMotionControls(){
  $$<HTMLButtonElement>('[data-motion-toggle]').forEach(button=>{button.textContent=reduced()?ui('motionOn','Activar animaciones'):ui('motionOff','Reducir movimiento');button.setAttribute('aria-pressed',String(reduced()));});
  $$<HTMLButtonElement>('[data-intro-replay]').forEach(button=>{button.disabled=reduced();button.title=reduced()?ui('motionHint','Activa las animaciones para repetir la introducción'):'';});
}
$$<HTMLButtonElement>('[data-motion-toggle]').forEach(button=>button.addEventListener('click',()=>{
  document.documentElement.dataset.motion=reduced()?'full':'reduced';
  try{localStorage.setItem('wiener-motion',document.documentElement.dataset.motion)}catch{}
  if(reduced()){clearTimeout(introTimer);clearTimeout(introCloseTimer);if(intro)intro.hidden=true;if(heroImage)heroImage.style.transform='none';releaseHero();}
  updateMotionControls();
}));
updateMotionControls();
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',event=>{let custom=false;try{custom=!!localStorage.getItem('wiener-motion')}catch{}if(!custom){document.documentElement.dataset.motion=event.matches?'reduced':'full';updateMotionControls();}});

const graphicObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  entry.target.classList.add('mide-is-active');graphicObserver.unobserve(entry.target);
}),{threshold:.3});
$$<HTMLElement>('[data-mide-motion]').forEach(graphic=>{if(!reduced()){graphic.classList.add('mide-sequence-ready');graphicObserver.observe(graphic);}});

const menu=$<HTMLDialogElement>('#navigation-dialog');
$$<HTMLButtonElement>('[data-menu-open]').forEach(button=>button.addEventListener('click',()=>menu?.showModal()));
$$<HTMLButtonElement>('[data-dialog-close]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog')?.close()));
$$<HTMLDialogElement>('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}}));

type SearchItem={title:string;description:string;kind:string;url:string};
const search=$<HTMLDialogElement>('#search-dialog');
const searchField=$<HTMLInputElement>('#site-search');
const searchResults=$<HTMLElement>('#search-results');
const searchStatus=$<HTMLElement>('#search-status');
const normalize=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
let searchItems:SearchItem[]=[];
try{searchItems=JSON.parse($('#search-index')?.textContent||'[]')}catch{}
function openSearch(){search?.showModal();setTimeout(()=>searchField?.focus(),30);}
$$<HTMLButtonElement>('[data-search-open]').forEach(button=>button.addEventListener('click',openSearch));
searchField?.addEventListener('input',()=>{
  const query=normalize(searchField.value.trim());
  if(!searchResults||!searchStatus)return;
  searchResults.replaceChildren();
  if(query.length<2){searchStatus.textContent=ui('searchMin','Escribe al menos dos caracteres para buscar.');return;}
  const terms=query.split(/\s+/);
  const hits=searchItems.filter(item=>terms.every(term=>normalize(`${item.title} ${item.description} ${item.kind}`).includes(term)));
  searchStatus.textContent=hits.length?`${hits.length} ${hits.length===1?ui('searchSingular','coincidencia'):ui('searchPlural','coincidencias')}. ${hits.length>12?ui('searchLimit','Mostrando las primeras 12.'):''}`:ui('searchEmpty','No encontramos coincidencias. Prueba con otro proceso, fecha o actividad.');
  hits.slice(0,12).forEach(item=>{const link=document.createElement('a');link.className='search-result';link.href=item.url;const text=document.createElement('div');const title=document.createElement('strong');title.textContent=item.title;const desc=document.createElement('small');desc.textContent=item.description;const kind=document.createElement('span');kind.textContent=item.kind;text.append(title,desc);link.append(text,kind);searchResults.append(link);});
});
document.addEventListener('keydown',event=>{
  const target=event.target as HTMLElement;
  if(event.key==='Escape'&&intro&&!intro.hidden)closeIntro();
  if((event.key==='k'&&(event.metaKey||event.ctrlKey))||(event.key==='/'&&!target.closest('input,textarea,select,[contenteditable]'))){event.preventDefault();if(!search?.open)openSearch();}
});

// Home dates are calculated from the published snapshot, in Lima time.
const upcomingHost=$<HTMLElement>('[data-upcoming-list]');
if(upcomingHost){
  let rows:any[]=[];try{rows=JSON.parse($('#upcoming-data')?.textContent||'[]')}catch{}
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Lima',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const current=upcomingActivities(rows,today,3);
  if(current.length){upcomingHost.replaceChildren();current.forEach(a=>{
    const active=a.inicio<=today;const when=active?a.fin:a.inicio;const d=new Date(when+'T12:00:00Z');
    const link=document.createElement('a');link.className='upcoming-item';link.href=`/agenda/?actividad=${encodeURIComponent(a.id)}&periodo=${encodeURIComponent(a.periodo)}`;
    const date=document.createElement('span');date.className='upcoming-date';date.textContent=String(d.getUTCDate()).padStart(2,'0');const month=document.createElement('small');month.textContent=d.toLocaleDateString('es-PE',{month:'short',timeZone:'UTC'}).replace('.','');date.append(month);
    const copy=document.createElement('div');const label=document.createElement('span');label.className='eyebrow';label.textContent=a.eje;const heading=document.createElement('h3');heading.textContent=a.titulo_claro||a.actividad;const info=document.createElement('p');info.textContent=`${active?ui('upcomingClose','Cierre del plazo'):ui('upcomingStart','Inicio')} · ${a.periodo}${reportedExecution(a)}`;copy.append(label,heading,info);
    const arrow=document.createElement('span');arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');link.append(date,copy,arrow);upcomingHost.append(link);
  });}else{upcomingHost.replaceChildren();const p=document.createElement('p');p.className='notice';p.textContent=ui('upcomingEmpty','No hay próximas fechas publicadas. Puedes consultar el calendario y los periodos anteriores.');upcomingHost.append(p);}
  const context=$<HTMLElement>('[data-date-context]');if(context)context.textContent=`${ui('upcomingContext','Fechas próximas al')} ${new Intl.DateTimeFormat('es-PE',{day:'numeric',month:'long',year:'numeric',timeZone:'America/Lima'}).format(new Date())}.`;
}

// Native dialog gives the gallery keyboard focus containment and Escape behavior.
const gallery=$<HTMLDialogElement>('#gallery-dialog');
$$<HTMLButtonElement>('[data-gallery-open]').forEach(button=>button.addEventListener('click',()=>{
  if(!gallery)return;const img=$<HTMLImageElement>('img',gallery);if(img){img.src=button.dataset.gallerySrc||'';img.alt=button.dataset.galleryAlt||'';}
  const caption=$<HTMLElement>('.gallery-caption',gallery);if(caption)caption.textContent=button.dataset.galleryAlt||'';
  gallery.showModal();
}));

$$<HTMLButtonElement>('[data-result-filter]').forEach(button=>button.addEventListener('click',()=>{
  const target=button.dataset.resultFilter;
  $$<HTMLButtonElement>('[data-result-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  $$<HTMLElement>('[data-result-group]').forEach(group=>group.hidden=target!=='Todos'&&group.dataset.resultGroup!==target);
  const count=$<HTMLElement>('[data-result-status]');if(count)count.textContent=target==='Todos'?'Visión de todos los procesos':`Indicadores de ${target}`;
}));

function revealRoute(){const id=decodeURIComponent(location.hash.slice(1));if(!id)return;const target=document.getElementById(id);if(target instanceof HTMLDetailsElement)target.open=true;}
revealRoute();addEventListener('hashchange',revealRoute);

export {};
