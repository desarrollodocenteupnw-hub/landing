import {content,config,safeLink,formatDate} from './content';
type Photo = {id:string;evento_id?:string;evento:string;pie?:string;url?:string;orden:number|string;destacada?:string};
export const curatedPhotos: Record<string,{src:string;alt:string}>={
 '10SI936y_Dz1zl8xIQlWf7_A5kqK1dbqb':{src:'/assets/gala-hero.webp',alt:'Un participante trabaja con piezas de colores durante una actividad del encuentro docente.'},
 '1ehOjGeOw7WXfxwXa-GFL1bwDLjDvzDoC':{src:'/assets/gala-dialogo.webp',alt:'Dos participantes comparten una actividad con piezas de colores sobre una mesa.'},
 '1S3LWTPDg99rcVfesSWln1b2-DY8E36Kv':{src:'/assets/gala-auditorio.webp',alt:'Vista del auditorio con participantes distribuidos en mesas durante el encuentro docente.'},
 '1ZLN3uub_YjK8ScQOzD-qSw2bW8sVYSGH':{src:'/assets/gala-comunidad.webp',alt:'Participantes de la comunidad docente reunidos alrededor de una mesa de trabajo.'}
};
export function photoSource(photo:Photo){return safeLink(photo.url)?photo.url!:curatedPhotos[photo.id]?.src||`https://lh3.googleusercontent.com/d/${encodeURIComponent(photo.id)}=w1200`;}
export function photoAlt(photo:Photo){return photo.pie?.trim()||curatedPhotos[photo.id]?.alt||`Registro fotográfico de ${photo.evento}`;}
export const communityEvent=content.eventos.find(e=>e.id==='EV-01')||content.eventos.filter(e=>content.galeria.some(photo=>photo.evento_id===e.id)).sort((a,b)=>b.inicio.localeCompare(a.inicio))[0];
const availablePhotos=communityEvent?content.galeria.filter(photo=>photo.evento_id===communityEvent.id):[];
const editorialIds=String(config.galeria_destacados||'1ZLN3uub_YjK8ScQOzD-qSw2bW8sVYSGH,1ehOjGeOw7WXfxwXa-GFL1bwDLjDvzDoC,10SI936y_Dz1zl8xIQlWf7_A5kqK1dbqb,1S3LWTPDg99rcVfesSWln1b2-DY8E36Kv').split(',').map(s=>s.trim());
const selected=editorialIds.map(id=>availablePhotos.find(p=>p.id===id)).filter(Boolean) as Photo[];
const remainder=[...availablePhotos].filter(p=>!selected.some(s=>s.id===p.id)).sort((a,b)=>Number(/s[ií]|true|1/i.test(b.destacada||''))-Number(/s[ií]|true|1/i.test(a.destacada||''))||Number(a.orden)-Number(b.orden));
export const galleryPhotos=[...selected,...remainder].slice(0,8).map(p=>({...p,src:photoSource(p),alt:photoAlt(p)}));
const heroRow=content.galeria.find(p=>p.id===config.portada_foto_id)||content.galeria.find(p=>p.id==='10SI936y_Dz1zl8xIQlWf7_A5kqK1dbqb');
export const heroPhoto=heroRow?{src:photoSource(heroRow),alt:photoAlt(heroRow)}:{src:'/assets/campus.jpg',alt:'Campus de la Universidad Norbert Wiener'};
export const communityCaption=communityEvent?`${communityEvent.nombre} · Edición ${communityEvent.edicion} · ${formatDate(communityEvent.inicio)}`:'';
