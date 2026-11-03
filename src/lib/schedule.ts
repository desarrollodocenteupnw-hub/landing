export interface DatedActivity { id:string; inicio:string; fin:string; estado_ejecucion?:string; [key:string]:unknown }
const normalize=(value:string)=>value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
export function upcomingActivities<T extends DatedActivity>(rows:T[],today:string,limit=3):T[]{
  return rows.filter(a=>a.fin>=today&&!/^(completad[ao]|finalizad[ao]|realizad[ao]|cancelad[ao]|cumplid[ao])$/.test(normalize(a.estado_ejecucion||'')))
    .sort((a,b)=>(a.inicio<=today?a.fin:a.inicio).localeCompare(b.inicio<=today?b.fin:b.inicio)).slice(0,limit);
}
export function reportedExecution(row:DatedActivity):string {
  const labels:Record<string,string>={en_ejecucion:'en ejecución',pausada:'pausada',pendiente:'pendiente',completada:'completada'};
  const raw=row.estado_ejecucion?.trim()||'';
  const value=labels[raw]||raw;
  return value?` · Ejecución: ${value}`:'';
}
