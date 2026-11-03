import source from '../content/site.json';

export const content = source;
export const slugify = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const processes = [...content.ejes].sort((a,b) => Number(a.orden)-Number(b.orden)).map((process) => ({ ...process, slug: process.slug || process.id || slugify(process.eje) }));
export const config = Object.fromEntries(content.config.map(item => [item.clave, item.valor]));
export const safeLink = (url?: string) => Boolean(url && /^https?:\/\//i.test(url));
export const todayLima = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
export const formatDate = (value: string, options: Intl.DateTimeFormatOptions = {day:'numeric', month:'long', year:'numeric'}) => value ? new Intl.DateTimeFormat('es-PE',{timeZone:'UTC',...options}).format(new Date(value+'T12:00:00Z')) : cmsText('date.confirm','Fecha por confirmar');
export const dateRange = (start: string, end?: string) => !start ? cmsText('date.confirm','Fecha por confirmar') : !end || start===end ? formatDate(start) : `${formatDate(start,{day:'numeric',month:'short'})} — ${formatDate(end)}`;

export type CmsRow = {
  id:string; grupo:string; pagina:string; seccion:string; tipo:string; titulo:string; texto:string;
  url:string; imagen:string; imagen_alt:string; icono:string; color:string; orden:number|string; visible:string;
};
const cmsRows = ((content as any).contenido || []) as CmsRow[];
const cmsIndex = new Map(cmsRows.map(row => [row.id,row]));
const rowVisible = (row?:CmsRow) => !!row && !/^(no|false|0)$/i.test(String(row.visible || 'si').trim());
export const cmsItem = (id:string) => cmsIndex.get(id);
export const cmsField = (id:string, field:keyof CmsRow='texto', fallback='') => {
  const row = cmsIndex.get(id);
  if (!row) return fallback;
  if (!rowVisible(row)) return '';
  const value = row[field];
  return value === undefined || value === null ? '' : String(value);
};
export const cmsText = (id:string, fallback='') => cmsField(id,'texto',fallback);
export const cmsTitle = (id:string, fallback='') => cmsField(id,'titulo',fallback);
export const cmsUrl = (id:string, fallback='') => cmsField(id,'url',fallback);
export const cmsImage = (id:string, fallback='') => cmsField(id,'imagen',fallback);
export const cmsAlt = (id:string, fallback='') => cmsField(id,'imagen_alt',fallback);
export const cmsGroup = (group:string) => cmsRows.filter(row => row.grupo===group && rowVisible(row)).sort((a,b)=>Number(a.orden||0)-Number(b.orden||0));

export type PortalEvent = {
  id:string; nombre:string; edicion:string; inicio:string; fin:string; eje:string;
  descripcion:string; estado:string; url:string; slug?:string; fecha_publicacion?:string;
  fecha_texto?:string; hora?:string; lugar?:string; modalidad?:string; tema?:string;
  imagen?:string; imagen_alt?:string; fuente?:string; procesos_relacionados?:string;
  cifra_1?:string; cifra_1_texto?:string; cifra_2?:string; cifra_2_texto?:string;
};
export const eventSlug = (event: {id:string,nombre:string,edicion:string,slug?:string}) => event.slug?.trim() || `${slugify(event.nombre)}-${slugify(event.edicion)}`;
export const isEventMemory = (event: Pick<PortalEvent,'estado'>) => /^(realizado|finalizado)$/i.test(event.estado.trim());
export const eventDateInfo = (event: PortalEvent) => {
  if(event.fecha_texto?.trim()) return {label:cmsText('date.sessions','Sesiones'),value:event.fecha_texto.trim()};
  if(event.inicio) return {label:cmsText('date.date','Fecha'),value:dateRange(event.inicio,event.fin)};
  if(isEventMemory(event)&&event.fecha_publicacion) return {label:cmsText('date.publication','Publicación'),value:formatDate(event.fecha_publicacion)};
  return {label:cmsText('date.date','Fecha'),value:isEventMemory(event)?cmsText('date.memory_missing','No consignada en la fuente'):cmsText('agenda.ui.confirm','Por confirmar')};
};
export const eventOrderDate = (event: PortalEvent) => event.inicio || event.fecha_publicacion || '';
export const eventRelatedProcesses = (event: PortalEvent) => (event.procesos_relacionados || '').split(/[,;]/).map(item=>item.trim()).filter(Boolean);
export const eventMatchesProcess = (event: PortalEvent, process: string) => !process || [event.eje,...eventRelatedProcesses(event)].some(item=>slugify(item)===slugify(process));
export const eventImage = (event: PortalEvent) => event.imagen?.startsWith('/assets/') || safeLink(event.imagen) ? event.imagen : event.id==='EV-01' ? '/assets/gala-dialogo.webp' : '';
export const currentPeriod = content.periodos.find(p=>p.inicio<=todayLima() && p.fin>=todayLima())?.periodo || content.periodos.at(-1)?.periodo || '';
export const processIconIndex=(slug:string)=>['induccion','formacion','acompanamiento','evaluacion','reconocimiento'].indexOf(slug);

const fallbackProcessCopy: Record<string, {verb:string; teaser:string; lead:string; benefit:string; audience:string; eyebrow:string; steps:{title:string;body:string}[]}> = {
  induccion: {verb:'Conecta',teaser:'Conoce la experiencia Wiener y empieza tu labor con orientación, recursos y herramientas institucionales.',lead:'Tu experiencia Wiener empieza aquí.',benefit:'Conocer el modelo educativo, la cultura y las herramientas para comenzar con confianza.',audience:'Docentes nuevos y quienes reingresan después de más de un año de inactividad.',eyebrow:'Integración y cultura Wiener',steps:[]},
  formacion: {verb:'Evoluciona',teaser:'Amplía tus capacidades con ocho líneas de formación conectadas con los desafíos de la docencia universitaria.',lead:'Nuevas capacidades para transformar tu práctica.',benefit:'Fortalecer tu enseñanza con formación progresiva en pedagogía, tecnología e investigación.',audience:'Docentes de pregrado, posgrado y segundas especialidades, en sus diferentes modalidades.',eyebrow:'Aprendizaje y desarrollo profesional',steps:[]},
  acompanamiento: {verb:'Fortalece',teaser:'Haz de la observación, el diálogo y la retroalimentación oportunidades para mejorar tu práctica docente.',lead:'Un acompañamiento que fortalece tu enseñanza.',benefit:'Convertir la observación, la orientación y la retroalimentación en acciones para mejorar tu práctica.',audience:'Docentes y programas priorizados para el acompañamiento.',eyebrow:'Observación y retroalimentación',steps:[]},
  evaluacion: {verb:'Comprende',teaser:'Reconoce fortalezas y oportunidades con una mirada integral que orienta el desarrollo profesional docente.',lead:'Evaluar para seguir creciendo.',benefit:'Comprender el desempeño para orientar la formación, el acompañamiento y la mejora continua.',audience:'Docentes Wiener y responsables académicos.',eyebrow:'Medición Integral de Excelencia Docente',steps:[]},
  reconocimiento: {verb:'Inspira',teaser:'Celebra el compromiso, la innovación y el desempeño destacado que contribuyen a nuestra comunidad académica.',lead:'La excelencia docente merece ser reconocida.',benefit:'Hacer visible la contribución docente y fortalecer una cultura de excelencia.',audience:'Docentes elegibles de acuerdo con las categorías de reconocimiento.',eyebrow:'Excelencia y comunidad',steps:[]}
};

export const processCopy: Record<string, {verb:string; teaser:string; lead:string; benefit:string; audience:string; eyebrow:string; steps:{title:string;body:string}[]}> = Object.fromEntries(
  processes.map(process => {
    const slug=process.slug;
    const base=fallbackProcessCopy[slug] || {verb:process.eje,teaser:process.descripcion,lead:process.eje,benefit:process.beneficio,audience:process.publico,eyebrow:process.eje,steps:[]};
    const steps=cmsGroup(`process.${slug}.steps`).map(row=>({title:row.titulo,body:row.texto}));
    return [slug,{
      verb:cmsText(`process.${slug}.verb`,base.verb),
      teaser:cmsText(`process.${slug}.teaser`,base.teaser || process.descripcion),
      lead:cmsText(`process.${slug}.lead`,base.lead),
      benefit:String(process.beneficio || base.benefit),
      audience:String(process.publico || base.audience),
      eyebrow:cmsText(`process.${slug}.eyebrow`,base.eyebrow),
      steps:steps.length?steps:base.steps
    }];
  })
);

export const dimensions = cmsGroup('mide.dimensions').map((row,index)=>({
  number:String(index+1).padStart(2,'0'), name:row.titulo, description:row.texto, color:row.color
}));

export const navItems = cmsGroup('nav.main').map(row=>({id:row.id,label:row.titulo,url:row.url,key:row.id.replace(/^nav\./,'')}));
export const footerLinks = cmsGroup('footer.links').map(row=>({label:row.titulo,url:row.url}));
export const searchLinks = cmsGroup('search.links').map(row=>({label:row.titulo,url:row.url}));

export const searchItems = [
  ...processes.map(p=>({title:p.eje,description:p.descripcion,kind:cmsText('search.kind.process','Proceso'),url:`/procesos/${p.slug}/`})),
  ...content.actividades.map(a=>({title:a.titulo_claro || a.actividad,description:`${a.eje} · ${a.periodo} · ${dateRange(a.inicio,a.fin)}`,kind:cmsText('search.kind.activity','Actividad'),url:`/agenda/?actividad=${encodeURIComponent(a.id)}&periodo=${encodeURIComponent(a.periodo)}`})),
  ...content.eventos.map(e=>({title:e.nombre,description:`${e.edicion} · ${eventDateInfo(e).label}: ${eventDateInfo(e).value}`,kind:cmsText('search.kind.event','Evento'),url:`/eventos/${eventSlug(e)}/`})),
  ...[...new Map(content.formacion.map(f=>[f.linea,f])).values()].map(f=>({title:f.nombre,description:f.insignia,kind:cmsText('search.kind.route','Ruta formativa'),url:`/procesos/formacion/#ruta-${f.linea}`})),
  ...content.documentos.map(d=>({title:d.nombre,description:`${d.codigo} · ${d.version}`,kind:cmsText('search.kind.resource','Recurso'),url:'/recursos/'}))
];
