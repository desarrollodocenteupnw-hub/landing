import {upcomingActivities,reportedExecution} from '../lib/schedule';

const shell=document.querySelector<HTMLElement>('#presentation-shell');
const slides=[...document.querySelectorAll<HTMLElement>('[data-slide]')];
const previous=document.querySelector<HTMLButtonElement>('#slide-prev');
const next=document.querySelector<HTMLButtonElement>('#slide-next');
const counter=document.querySelector<HTMLElement>('#slide-counter');
const dots=[...document.querySelectorAll<HTMLButtonElement>('[data-go-slide]')];
let current=Math.max(0,Math.min(slides.length-1,Number(location.hash.slice(1))-1||0));
function show(index:number){
  current=Math.max(0,Math.min(slides.length-1,index));
  slides.forEach((slide,i)=>{slide.hidden=i!==current;});
  if(previous)previous.disabled=current===0;
  if(next)next.disabled=current===slides.length-1;
  dots.forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===current)));
  if(counter)counter.textContent=`${String(current+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
  history.replaceState(null,'',`#${current+1}`);
  document.title=`${slides[current].dataset.slideName} · Presentación de Desarrollo Docente`;
}
if(shell){shell.classList.add('presentation-ready');show(current);}
previous?.addEventListener('click',()=>show(current-1));
next?.addEventListener('click',()=>show(current+1));
dots.forEach(dot=>dot.addEventListener('click',()=>show(Number(dot.dataset.goSlide))));
document.addEventListener('keydown',event=>{
  if((event.target as HTMLElement).closest('input,textarea,select,dialog'))return;
  if(event.key==='ArrowRight'||event.key==='PageDown'){event.preventDefault();show(current+1);}
  if(event.key==='ArrowLeft'||event.key==='PageUp'){event.preventDefault();show(current-1);}
  if(event.key==='Home'){event.preventDefault();show(0);}
  if(event.key==='End'){event.preventDefault();show(slides.length-1);}
});
const fullscreen=document.querySelector<HTMLButtonElement>('#presentation-fullscreen');
if(fullscreen&&!document.fullscreenEnabled){fullscreen.hidden=true;}
fullscreen?.addEventListener('click',async()=>{
  try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}
  catch{fullscreen.title='La pantalla completa no está disponible en este navegador.';}
});
document.addEventListener('fullscreenchange',()=>{fullscreen?.setAttribute('aria-label',document.fullscreenElement?'Salir de pantalla completa':'Pantalla completa');});
const agenda=document.querySelector<HTMLElement>('[data-presenter-agenda]');
if(agenda){
  let rows:any[]=[];try{rows=JSON.parse(document.querySelector('#presentation-data')?.textContent||'[]')}catch{}
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Lima',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const upcoming=upcomingActivities(rows,today,4);
  agenda.replaceChildren();
  if(!upcoming.length){const p=document.createElement('p');p.textContent='No hay próximas actividades publicadas. Consulta el calendario completo para revisar los periodos anteriores.';agenda.append(p);}
  upcoming.forEach(a=>{
    const link=document.createElement('a');link.href=`/agenda/?actividad=${encodeURIComponent(a.id)}&periodo=${encodeURIComponent(a.periodo)}`;
    const label=document.createElement('span');label.className='eyebrow';label.textContent=`${a.eje} / ${a.periodo}`;
    const h=document.createElement('h3');h.textContent=a.titulo_claro||a.actividad;
    const p=document.createElement('p');const fmt=(s:string)=>new Date(s+'T12:00:00Z').toLocaleDateString('es-PE',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});p.textContent=`${fmt(a.inicio)} — ${fmt(a.fin)}`;
    const owner=document.createElement('span');owner.className='micro';owner.textContent=`Responsable: ${a.responsable}${reportedExecution(a)}`;
    link.append(label,h,p,owner);agenda.append(link);
  });
}
export {};
