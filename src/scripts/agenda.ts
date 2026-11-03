type SourceRow = Record<string, unknown>;
type TemporalState = 'future' | 'current' | 'past';
type View = 'agenda' | 'timeline';
type Content = { actividades?: SourceRow[]; periodos?: SourceRow[]; ejes?: SourceRow[] };
type Selection = { period: string; modality: string; process: string; search: string };

export interface Activity {
  id: string;
  title: string;
  originalTitle: string;
  process: string;
  period: string;
  group: string;
  phase: string;
  editorialPhase: boolean;
  start: number;
  end: number;
  owner: string;
  modality: string;
  type: string;
  source: string;
  note: string;
  action: string;
  execution: string;
  url: string;
  sourceUrl: string;
}

const DAY = 86_400_000;
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic'];
const PHASES = ['Aplicación y recolección', 'Reportes e insumos', 'Procesamiento y consolidación', 'Comunicación y resultados'];
const STATUS: Record<TemporalState, string> = { future: 'Por iniciar', current: 'Dentro del plazo', past: 'Plazo finalizado' };
const ICON_ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5"/></svg>';
const ICON_CHEVRON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg>';
const asText = (value: unknown) => typeof value === 'string' || typeof value === 'number' ? String(value).trim() : '';
const norm = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const esc = (value: string | number) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char] || char));
const plural = (count: number, singular: string, multiple: string) => `${count} ${count === 1 ? singular : multiple}`;
const slug = (value: string) => norm(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function parseDay(value: unknown): number | null {
  const raw = asText(value);
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month || date.getUTCDate() !== day) return null;
  return Math.floor(date.getTime() / DAY);
}

export function limaToday(date = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Lima', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  const part = (name: string) => parts.find((entry) => entry.type === name)?.value || '';
  return parseDay(`${part('year')}-${part('month')}-${part('day')}`) as number;
}

function isoDay(day: number): string { return new Date(day * DAY).toISOString().slice(0, 10); }
function formatDay(day: number, year = false): string {
  const date = new Date(day * DAY);
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}${year ? ` ${date.getUTCFullYear()}` : ''}`;
}
function formatRange(start: number, end: number, year = false): string {
  if (start === end) return formatDay(start, year);
  const a = new Date(start * DAY), b = new Date(end * DAY);
  if (a.getUTCFullYear() !== b.getUTCFullYear()) return `${formatDay(start, true)} — ${formatDay(end, true)}`;
  if (a.getUTCMonth() === b.getUTCMonth()) return `${a.getUTCDate()}–${formatDay(end, year)}`;
  return `${formatDay(start)} — ${formatDay(end, year)}`;
}

export function temporalState(activity: Pick<Activity, 'start' | 'end'>, today: number): TemporalState {
  return activity.start > today ? 'future' : activity.end < today ? 'past' : 'current';
}

export function inferEvaluationPhase(row: SourceRow): { phase: string; editorial: boolean } {
  const explicit = asText(row.fase);
  if (explicit) {
    const key = slug(explicit);
    const aliases = [
      ['aplicacion', slug(PHASES[0])],
      ['reportes', slug(PHASES[1]), 'reportes-y-insumos'],
      ['procesamiento', slug(PHASES[2])],
      ['resultados', 'comunicacion', slug(PHASES[3])],
    ];
    const index = aliases.findIndex((values) => values.includes(key));
    const origin = norm(asText(row.fase_origen));
    // Imported snapshots use these four editorial categories without a per-row
    // origin. A declared origin can distinguish later institutional phases.
    const editorial = /infer|migr|editorial|archivo.?original/.test(origin) || (!origin && index >= 0);
    return { phase: index >= 0 ? PHASES[index] : explicit, editorial };
  }
  const activity = norm(asText(row.actividad));
  const type = norm(asText(row.tipo));
  if (type === 'procesamiento' || activity.startsWith('procesamiento')) return { phase: PHASES[2], editorial: true };
  if (/comunicacion|publicacion|emision del informe/.test(activity)) return { phase: PHASES[3], editorial: true };
  if (type === 'reporte' || /reporte|insumo/.test(activity)) return { phase: PHASES[1], editorial: true };
  return { phase: PHASES[0], editorial: true };
}

export function normalizeActivities(rows: SourceRow[]): Activity[] {
  const activities: Activity[] = [];
  const identifiers = new Set<string>();
  rows.forEach((row, index) => {
    const start = parseDay(row.inicio), end = parseDay(row.fin);
    const originalTitle = asText(row.actividad);
    if (start === null || end === null || end < start || !originalTitle) return;
    const process = asText(row.eje) || 'Otros procesos';
    const inference = process === 'Evaluación' ? inferEvaluationPhase(row) : { phase: '', editorial: false };
    let id = asText(row.id) || `actividad-${index + 1}`;
    if (identifiers.has(id)) id = `${id}-${index + 1}`;
    identifiers.add(id);
    activities.push({
      id, title: asText(row.titulo_claro) || originalTitle, originalTitle,
      process, period: asText(row.periodo), group: asText(row.grupo), phase: inference.phase, editorialPhase: inference.editorial,
      start, end, owner: asText(row.responsable), modality: asText(row.modalidad) || 'Todas', type: asText(row.tipo),
      source: asText(row.fuente), note: asText(row.nota), action: asText(row.accion_programa), execution: asText(row.estado_ejecucion),
      url: asText(row.url) || asText(row.enlace), sourceUrl: asText(row.fuente_url),
    });
  });
  return activities;
}

export function matchesModality(activity: Activity, modality: string): boolean {
  if (modality === 'Todas') return true;
  const value = norm(activity.modality);
  const common = !value || /^(todas?|ambas?|general)(\s|$)/.test(value);
  if (common) return true;
  const presential = /presencial|lima centro|lima norte/.test(value);
  const remote = /distancia|online|virtual/.test(value);
  if (modality === 'presencial') return presential;
  if (modality === 'distancia') return remote;
  return value === norm(modality);
}

export function filterActivities(activities: Activity[], selection: Selection): Activity[] {
  const terms = norm(selection.search).split(/\s+/).filter(Boolean);
  return activities.filter((activity) => {
    if (selection.period !== 'Todos' && activity.period !== selection.period) return false;
    if (selection.process !== 'Todos' && activity.process !== selection.process) return false;
    if (!matchesModality(activity, selection.modality)) return false;
    const text = norm([activity.title, activity.originalTitle, activity.owner, activity.process, activity.group, activity.phase, activity.period].join(' '));
    return terms.every((term) => text.includes(term));
  });
}

export function resolveAgendaLink(activities: Activity[], defaults: Selection, search: string, periods: string[] = []): { selection: Selection; activity: Activity | null } {
  const selection = { ...defaults };
  const params = new URLSearchParams(search);
  const period = params.get('periodo')?.trim();
  if (period && (period === 'Todos' || periods.includes(period) || activities.some((activity) => activity.period === period))) selection.period = period;
  const process = params.get('proceso')?.trim();
  if (process) {
    const match = [...new Set(activities.map((activity) => activity.process))].find((name) => slug(name) === slug(process));
    if (slug(process) === 'todos') selection.process = 'Todos';
    else if (match) selection.process = match;
  }
  const id = params.get('actividad')?.trim();
  const activity = id ? activities.find((item) => item.id === id) || null : null;
  if (activity) {
    // A shared activity always opens in its own recorded period and process.
    selection.period = activity.period || 'Todos';
    selection.process = activity.process;
    selection.modality = 'Todas';
    selection.search = '';
  }
  return { selection, activity };
}

function phaseGroups(activities: Activity[]): Array<{ phase: string; items: Activity[] }> {
  const names = [...new Set(activities.map((activity) => activity.phase))].sort((a, b) => {
    const ai = PHASES.indexOf(a), bi = PHASES.indexOf(b);
    return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi) || a.localeCompare(b, 'es');
  });
  return names.map((phase) => ({ phase, items: activities.filter((activity) => activity.phase === phase).sort((a, b) => a.start - b.start || a.end - b.end) }));
}

function processClass(process: string): string {
  return ({ 'Inducción': 'ind', 'Formación': 'for', 'Acompañamiento': 'aco', 'Evaluación': 'eva', 'Reconocimiento': 'rec' } as Record<string, string>)[process] || 'other';
}

function safeUrl(raw: string): string | null {
  if (!raw || (!/^https?:\/\//i.test(raw) && !/^\/(?!\/)/.test(raw))) return null;
  try {
    const parsed = new URL(raw, window.location.origin);
    return ['https:', 'http:'].includes(parsed.protocol) ? parsed.href : null;
  } catch { return null; }
}

function escapeICS(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
}

function foldICS(line: string): string {
  const encoder = new TextEncoder();
  const pieces: string[] = [];
  let piece = '', bytes = 0;
  for (const char of line) {
    const size = encoder.encode(char).length;
    if (bytes + size > 75) { pieces.push(piece); piece = ' '; bytes = 1; }
    piece += char; bytes += size;
  }
  pieces.push(piece);
  return pieces.join('\r\n');
}

export function createCalendar(activities: Activity[], now = new Date(), labels: Record<string,string> = {}): string {
  const L=(key:string,fallback:string)=>labels[key]||fallback;
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wiener//Agenda Desarrollo Docente//ES', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', `X-WR-CALNAME:${L('icsCalendarName','Agenda de Desarrollo Docente')}`, 'X-WR-TIMEZONE:America/Lima'];
  activities.forEach((activity) => {
    const description = [
      `${L('icsProcess','Proceso')}: ${activity.process}`, `${L('icsPeriod','Periodo')}: ${activity.period || L('icsPeriodMissing','No indicado')}`,
      `${L('icsOwner','Responsable')}: ${activity.owner || L('confirm','Por confirmar')}`, `${L('icsModality','Modalidad')}: ${activity.modality}`,
      activity.action, activity.note, activity.source ? `${L('factSource','Fuente')}: ${activity.source}` : '',
      norm(activity.type) === 'recurrente' ? L('icsRecurrent','Este evento representa la ventana programada de una actividad recurrente. Las fechas de las sesiones se comunican por separado.') : '',
      L('icsDisclaimer','Fechas programadas. El paso del tiempo no confirma la ejecución de la actividad.'),
    ].filter(Boolean).join('\n');
    lines.push('BEGIN:VEVENT', `UID:dgdd-${slug(activity.id)}-${isoDay(activity.start)}@agenda-wiener`, `DTSTAMP:${stamp}`, `DTSTART;VALUE=DATE:${isoDay(activity.start).replace(/-/g, '')}`, `DTEND;VALUE=DATE:${isoDay(activity.end + 1).replace(/-/g, '')}`, `SUMMARY:${escapeICS(activity.title)}`, `DESCRIPTION:${escapeICS(description)}`, `CATEGORIES:${escapeICS(activity.process)}`, 'TRANSP:TRANSPARENT', 'END:VEVENT');
  });
  lines.push('END:VCALENDAR');
  return `${lines.map(foldICS).join('\r\n')}\r\n`;
}

class AgendaController {
  private root: HTMLElement;
  private activities: Activity[];
  private processOrder: string[];
  private today: number;
  private selection: Selection;
  private defaults: Selection;
  private view: View = 'agenda';
  private compact: boolean;
  private expanded = false;
  private filtered: Activity[] = [];
  private collapsed = new Set<string>();
  private dialog: HTMLDialogElement;
  private dialogActivity: Activity | null = null;
  private opener: HTMLElement | null = null;
  private searchTimer: ReturnType<typeof setTimeout> | null = null;
  private labels: Record<string,string> = {};
  private l(key:string,fallback:string):string{return this.labels[key]||fallback;}
  private status(state:TemporalState):string{return state==='future'?this.l('statusFuture','Por iniciar'):state==='current'?this.l('statusCurrent','Dentro del plazo'):this.l('statusPast','Plazo finalizado');}

  constructor(root: HTMLElement, data: Content) {
    this.root = root;
    try{this.labels=JSON.parse(root.querySelector('[data-agenda-labels]')?.textContent||'{}')}catch{this.labels={};}
    this.activities = normalizeActivities(data.actividades || []);
    this.processOrder = [...(data.ejes || [])].sort((a, b) => Number(a.orden || 9) - Number(b.orden || 9)).map((row) => asText(row.eje)).filter(Boolean);
    this.activities.forEach((activity) => { if (!this.processOrder.includes(activity.process)) this.processOrder.push(activity.process); });
    this.today = limaToday();
    this.compact = root.dataset.compact === 'true';
    const periods = [...(data.periodos || [])].sort((a, b) => (parseDay(a.inicio) || 0) - (parseDay(b.inicio) || 0));
    const current = periods.find((row) => (parseDay(row.inicio) ?? Infinity) <= this.today && (parseDay(row.fin) ?? -Infinity) >= this.today)
      || [...periods].reverse().find((row) => (parseDay(row.inicio) ?? Infinity) <= this.today) || periods[0];
    this.defaults = { period: current ? asText(current.periodo) : 'Todos', modality: 'Todas', process: root.dataset.initialProcess || 'Todos', search: '' };
    const deepLink = root === document.querySelector('[data-agenda-root]')
      ? resolveAgendaLink(this.activities, this.defaults, window.location.search, periods.map((row) => asText(row.periodo)))
      : { selection: { ...this.defaults }, activity: null };
    this.selection = deepLink.selection;
    this.expanded = Boolean(deepLink.activity);
    this.dialog = this.get<HTMLDialogElement>('[data-agenda-dialog]');
    this.completeOptions();
    this.bind();
    this.syncControls();
    this.get<HTMLElement>('[data-agenda-today]').textContent = `${this.l('today','Hoy')}, ${formatDay(this.today, true)}`;
    root.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLButtonElement>('.agenda-filters :disabled, .agenda-toolbar :disabled').forEach((element) => { element.disabled = false; });
    this.render();
    this.get<HTMLElement>('[data-agenda-live]').hidden = false;
    this.get<HTMLElement>('[data-agenda-selection]').hidden = false;
    root.dataset.agendaReady = 'true';
    if (deepLink.activity) {
      const opener = this.root.querySelector<HTMLElement>(`[data-agenda-detail="${CSS.escape(deepLink.activity.id)}"]`) || this.get<HTMLElement>('[data-agenda-view="agenda"]');
      this.openDetail(deepLink.activity, opener);
    }
  }

  private get<T extends Element>(selector: string): T {
    const element = this.root.querySelector<T>(selector);
    if (!element) throw new Error(`Agenda: falta ${selector}`);
    return element;
  }

  private completeOptions(): void {
    const periodSelect = this.get<HTMLSelectElement>('[data-agenda-period]');
    const periods = [...new Set(this.activities.map((activity) => activity.period).filter(Boolean))];
    periods.forEach((period) => { if (![...periodSelect.options].some((option) => option.value === period)) periodSelect.add(new Option(period, period)); });
    const processSelect = this.get<HTMLSelectElement>('[data-agenda-process]');
    this.processOrder.forEach((process) => { if (![...processSelect.options].some((option) => option.value === process)) processSelect.add(new Option(process, process)); });
    if (this.selection.process !== 'Todos' && !this.processOrder.includes(this.selection.process)) {
      processSelect.add(new Option(this.selection.process, this.selection.process));
    }
    const modalitySelect = this.get<HTMLSelectElement>('[data-agenda-modality]');
    [...new Set(this.activities.map((activity) => activity.modality))].filter((modality) => !/todas|ambas|general|presencial|lima centro|lima norte|distancia|online|virtual/.test(norm(modality))).forEach((modality) => modalitySelect.add(new Option(modality, modality)));
  }

  private syncControls(): void {
    this.get<HTMLSelectElement>('[data-agenda-period]').value = this.selection.period;
    this.get<HTMLSelectElement>('[data-agenda-modality]').value = this.selection.modality;
    this.get<HTMLSelectElement>('[data-agenda-process]').value = this.selection.process;
    this.get<HTMLInputElement>('[data-agenda-search]').value = this.selection.search;
  }

  private bind(): void {
    this.get<HTMLFormElement>('[data-agenda-filters]').addEventListener('submit', (event) => event.preventDefault());
    const controls: Array<[string, keyof Selection]> = [['[data-agenda-period]', 'period'], ['[data-agenda-modality]', 'modality'], ['[data-agenda-process]', 'process']];
    controls.forEach(([selector, key]) => this.get<HTMLSelectElement>(selector).addEventListener('change', (event) => {
      this.selection[key] = (event.target as HTMLSelectElement).value;
      this.expanded = false;
      this.collapsed.clear();
      this.render();
    }));
    this.get<HTMLInputElement>('[data-agenda-search]').addEventListener('input', (event) => {
      this.selection.search = (event.target as HTMLInputElement).value;
      this.expanded = false;
      if (this.searchTimer) clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => this.render(), 140);
    });
    this.root.querySelectorAll<HTMLButtonElement>('[data-agenda-view]').forEach((button) => {
      button.addEventListener('click', () => { this.view = button.dataset.agendaView as View; this.render(); });
      button.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        this.view = event.key === 'Home' ? 'agenda' : event.key === 'End' ? 'timeline' : this.view === 'agenda' ? 'timeline' : 'agenda';
        this.render();
        this.get<HTMLButtonElement>(`[data-agenda-view="${this.view}"]`).focus();
      });
    });
    this.get<HTMLButtonElement>('[data-agenda-reset]').addEventListener('click', () => {
      this.selection = { ...this.defaults }; this.expanded = false; this.collapsed.clear(); this.syncControls(); this.render();
    });
    this.get<HTMLButtonElement>('[data-agenda-export]').addEventListener('click', () => {
      if (this.searchTimer) clearTimeout(this.searchTimer);
      this.render();
      this.download(this.filtered);
    });
    this.get<HTMLButtonElement>('[data-agenda-export-one]').addEventListener('click', () => { if (this.dialogActivity) this.download([this.dialogActivity]); });
    this.root.addEventListener('click', (event) => {
      const target = event.target as Element;
      const detail = target.closest<HTMLElement>('[data-agenda-detail]');
      if (detail && this.root.contains(detail)) {
        const activity = this.activities.find((item) => item.id === detail.dataset.agendaDetail);
        if (activity) this.openDetail(activity, detail);
      }
      const expand = target.closest('[data-agenda-expand]');
      if (expand) { this.expanded = true; this.render(); this.announce(`${this.l('expandAnnouncement','Se muestran las')} ${this.filtered.length} ${this.l('expandAnnouncementSuffix','actividades de la selección.')}`); }
      const group = target.closest<HTMLElement>('[data-agenda-collapse]');
      if (group) {
        const key = group.dataset.agendaCollapse || '';
        this.collapsed.has(key) ? this.collapsed.delete(key) : this.collapsed.add(key);
        this.render();
        this.root.querySelector<HTMLButtonElement>(`[data-agenda-collapse="${CSS.escape(key)}"]`)?.focus();
      }
      const reset = target.closest('[data-agenda-empty-reset]');
      if (reset) this.get<HTMLButtonElement>('[data-agenda-reset]').click();
    });
    this.dialog.addEventListener('click', (event) => {
      if (event.target !== this.dialog) return;
      const box = this.dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) this.dialog.close();
    });
    this.dialog.addEventListener('close', () => { this.opener?.focus({ preventScroll: true }); this.dialogActivity = null; });
  }

  private announce(message: string): void { this.get<HTMLElement>('[data-agenda-announcement]').textContent = message; }

  private render(): void {
    this.today = limaToday();
    this.get<HTMLElement>('[data-agenda-today]').textContent = `${this.l('today','Hoy')}, ${formatDay(this.today, true)}`;
    this.get<HTMLHeadingElement>('.agenda-header h2').textContent = this.selection.process === 'Todos' ? this.l('title','Cronograma de Gestión y Desarrollo Docente') : `${this.l('titlePrefix','Agenda ·')} ${this.selection.process}`;
    this.filtered = filterActivities(this.activities, this.selection);
    const label = this.selection.process === 'Todos' ? this.l('allProcesses','todos los procesos') : this.selection.process;
    this.get<HTMLElement>('[data-agenda-count]').innerHTML = `<strong>${plural(this.filtered.length, this.l('activitySingular','actividad'), this.l('activityPlural','actividades'))}</strong><span>${esc(label)} · ${esc(this.selection.period === 'Todos' ? this.l('allPeriods','todos los periodos') : this.selection.period)}</span>`;
    const counts: Record<TemporalState, number> = { current: 0, future: 0, past: 0 };
    this.filtered.forEach((activity) => counts[temporalState(activity, this.today)]++);
    this.get<HTMLElement>('[data-agenda-status-counts]').innerHTML = (['current', 'future', 'past'] as TemporalState[]).map((state) => `<span class="agenda-count-pill agenda-count-pill--${state}"><i aria-hidden="true"></i>${this.status(state)} <b>${counts[state]}</b></span>`).join('');
    const exportButton = this.get<HTMLButtonElement>('[data-agenda-export]');
    exportButton.disabled = this.filtered.length === 0;
    exportButton.title = `${this.l('saveCalendar','Guardar calendario')}: ${plural(this.filtered.length, this.l('exportSelectedSingular','actividad seleccionada'), this.l('exportSelectedPlural','actividades seleccionadas'))}`;
    this.get<HTMLElement>('[data-agenda-editorial]').hidden = !this.filtered.some((activity) => activity.editorialPhase);
    this.root.querySelectorAll<HTMLButtonElement>('[data-agenda-view]').forEach((button) => {
      const selected = button.dataset.agendaView === this.view;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    const list = this.get<HTMLElement>('[data-agenda-list]'), timeline = this.get<HTMLElement>('[data-agenda-timeline]');
    list.hidden = this.view !== 'agenda'; timeline.hidden = this.view !== 'timeline';
    const panel = this.view === 'agenda' ? list : timeline;
    if (!this.filtered.length) {
      panel.innerHTML = `<div class="agenda-empty"><span class="agenda-empty-mark" aria-hidden="true">↗</span><h3>${esc(this.l('emptyTitle','No encontramos actividades con estos filtros'))}</h3><p>${esc(this.l('emptyBody','Prueba otro periodo, proceso o término de búsqueda.'))}</p><button type="button" data-agenda-empty-reset>${esc(this.l('reset','Restablecer filtros'))}</button></div>`;
      return;
    }
    panel.innerHTML = this.view === 'agenda' ? this.renderList() : this.renderTimeline();
  }

  private prioritySort(items: Activity[]): Activity[] {
    const order: Record<TemporalState, number> = { current: 0, future: 1, past: 2 };
    return [...items].sort((a, b) => {
      const ast = temporalState(a, this.today), bst = temporalState(b, this.today);
      return order[ast] - order[bst] || (ast === 'future' ? a.start - b.start : ast === 'past' ? b.end - a.end : a.end - b.end);
    });
  }

  private listRow(activity: Activity): string {
    const state = temporalState(activity, this.today);
    const date = state === 'future' ? activity.start : activity.end;
    const recurrent = norm(activity.type) === 'recurrente';
    return `<li class="agenda-list-row agenda-process-${processClass(activity.process)}"><button type="button" class="agenda-list-button" data-agenda-detail="${esc(activity.id)}"><span class="agenda-row-date"><small>${state === 'future' ? this.l('dateStart','Inicia') : state === 'current' ? this.l('dateUntil','Hasta') : this.l('dateDeadline','Plazo hasta')}</small><strong>${formatDay(date)}</strong>${new Date(date * DAY).getUTCFullYear() !== new Date(this.today * DAY).getUTCFullYear() ? `<small>${new Date(date * DAY).getUTCFullYear()}</small>` : ''}</span><span class="agenda-row-main"><span class="agenda-row-title">${esc(activity.title)}</span><span class="agenda-row-meta"><i class="agenda-process-dot" aria-hidden="true"></i>${esc(activity.process)}<span aria-hidden="true">·</span>${esc(formatRange(activity.start, activity.end))}${this.selection.period === 'Todos' ? `<span aria-hidden="true">·</span>${esc(activity.period)}` : ''}${recurrent ? `<span class="agenda-recurrent">${esc(this.l('recurrent','Durante el periodo'))}</span>` : ''}</span></span><span class="agenda-status agenda-status--${state}">${this.status(state)}</span><span class="agenda-row-arrow">${ICON_ARROW}</span></button></li>`;
  }

  private renderList(): string {
    if (this.compact && !this.expanded) {
      const visible = this.prioritySort(this.filtered).slice(0, 6);
      return `<ol class="agenda-list agenda-list--compact">${visible.map((activity) => this.listRow(activity)).join('')}</ol>${this.filtered.length > visible.length ? `<div class="agenda-show-all"><span>${visible.length} de ${this.filtered.length} actividades</span><button type="button" data-agenda-expand>${esc(this.l('showAll','Ver todas las actividades'))} ${ICON_ARROW}</button></div>` : ''}`;
    }
    return this.processOrder.filter((process) => this.filtered.some((activity) => activity.process === process)).map((process) => {
      const items = this.filtered.filter((activity) => activity.process === process);
      const key = `list-${slug(process)}`, expanded = !this.collapsed.has(key);
      const groupId = `${this.root.id}-${key}`;
      const groups = process === 'Evaluación' ? phaseGroups(items) : [{ phase: '', items: this.prioritySort(items) }];
      return `<section class="agenda-process-section agenda-process-${processClass(process)}"><h3><button type="button" class="agenda-group-toggle" data-agenda-collapse="${key}" aria-expanded="${expanded}" aria-controls="${groupId}"><span><i class="agenda-process-dot" aria-hidden="true"></i>${esc(process)}<small>${plural(items.length, this.l('activitySingular','actividad'), this.l('activityPlural','actividades'))}</small></span>${ICON_CHEVRON}</button></h3><div id="${groupId}"${expanded ? '' : ' hidden'}>${groups.map((group) => `${group.phase ? `<h4 class="agenda-phase-heading">${esc(group.phase)}<span>${group.items.length}</span></h4>` : ''}<ol class="agenda-list">${(process === 'Evaluación' ? this.prioritySort(group.items) : group.items).map((activity) => this.listRow(activity)).join('')}</ol>`).join('')}</div></section>`;
    }).join('');
  }

  private renderTimeline(): string {
    const earliest = Math.min(...this.filtered.map((activity) => activity.start));
    const latest = Math.max(...this.filtered.map((activity) => activity.end));
    const a = new Date(earliest * DAY), b = new Date(latest * DAY);
    const first = Date.UTC(a.getUTCFullYear(), a.getUTCMonth(), 1) / DAY;
    const last = Date.UTC(b.getUTCFullYear(), b.getUTCMonth() + 1, 1) / DAY;
    const span = last - first;
    const months: Array<{ label: string; start: number; end: number }> = [];
    for (let date = new Date(first * DAY); date.getTime() / DAY < last; date = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1))) {
      const end = Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1) / DAY;
      months.push({ label: `${MONTHS[date.getUTCMonth()]} ${String(date.getUTCFullYear()).slice(2)}`, start: date.getTime() / DAY, end });
    }
    const position = (day: number) => (day - first) / span * 100;
    const labelWidth = parseFloat(getComputedStyle(this.root).getPropertyValue('--agenda-label-width')) || 340;
    const width = Math.max(630, months.length * 104, Math.floor(this.root.clientWidth - labelWidth));
    const now = this.today >= first && this.today < last;
    const todayPos = position(this.today + 0.5);
    const grid = months.slice(1).map((month) => `<i class="agenda-month-line" style="left:${position(month.start)}%" aria-hidden="true"></i>`).join('');
    const header = `<thead><tr><th scope="col" class="agenda-timeline-label"><span>${esc(this.l('timelineActivity','Actividad'))}</span><small>${esc(this.l('timelineDetail','Selecciona para ver el detalle'))}</small></th><th scope="col" class="agenda-timeline-head"><span class="agenda-sr-only">${esc(this.l('timelineProgrammed','Periodo programado'))}</span><div class="agenda-months" style="width:${width}px">${months.map((month) => `<span style="left:${position(month.start)}%;width:${position(month.end) - position(month.start)}%">${month.label}</span>`).join('')}${now ? `<b class="agenda-today-marker" style="left:${Math.min(94, Math.max(6, todayPos))}%">${esc(this.l('today','Hoy'))}, ${formatDay(this.today)}</b>` : ''}</div></th></tr></thead>`;
    const row = (activity: Activity) => {
      const state = temporalState(activity, this.today);
      const left = position(activity.start), barWidth = (activity.end - activity.start + 1) / span * 100;
      return `<tr class="agenda-timeline-row agenda-process-${processClass(activity.process)}"><th scope="row" class="agenda-timeline-label"><button type="button" data-agenda-detail="${esc(activity.id)}"><span>${esc(activity.title)}</span><small>${this.selection.period === 'Todos' ? `${esc(activity.period)} <i aria-hidden="true">·</i> ` : ''}${esc(formatRange(activity.start, activity.end))} <i aria-hidden="true">·</i> ${this.status(state)}</small></button></th><td class="agenda-timeline-cell"><button type="button" class="agenda-track" style="width:${width}px" data-agenda-detail="${esc(activity.id)}" tabindex="-1" aria-label="${esc(activity.title)}: ${esc(formatRange(activity.start, activity.end, true))}. ${esc(this.l('timelineViewDetail','Ver detalle.'))}">${grid}${now ? `<i class="agenda-track-today" style="left:${todayPos}%" aria-hidden="true"></i>` : ''}<span class="agenda-time-bar agenda-time-bar--${state}${activity.start === activity.end ? ' agenda-time-bar--milestone' : ''}" style="left:${left}%;width:${barWidth}%" aria-hidden="true"></span></button></td></tr>`;
    };
    const bodies = this.processOrder.filter((process) => this.filtered.some((activity) => activity.process === process)).map((process) => {
      const items = this.filtered.filter((activity) => activity.process === process);
      const key = `timeline-${slug(process)}`, expanded = !this.collapsed.has(key);
      const bodyId = `${this.root.id}-${key}`;
      const groups = process === 'Evaluación' ? phaseGroups(items) : [{ phase: '', items: [...items].sort((x, y) => x.start - y.start || x.end - y.end) }];
      return `<tbody class="agenda-timeline-group agenda-process-${processClass(process)}"><tr><th colspan="2" class="agenda-timeline-process"><button type="button" data-agenda-collapse="${key}" aria-expanded="${expanded}" aria-controls="${bodyId}"><span><i class="agenda-process-dot" aria-hidden="true"></i>${esc(process)}<small>${plural(items.length, this.l('activitySingular','actividad'), this.l('activityPlural','actividades'))}</small></span>${ICON_CHEVRON}</button></th></tr></tbody><tbody id="${bodyId}"${expanded ? '' : ' hidden'}>${groups.map((group) => `${group.phase ? `<tr class="agenda-timeline-phase"><th colspan="2"><span>${esc(group.phase)}</span><small>${group.items.length}</small></th></tr>` : ''}${group.items.map(row).join('')}`).join('')}</tbody>`;
    }).join('');
    return `<div class="agenda-timeline-summary"><span>${esc(formatRange(earliest, latest, true))}</span><span><i aria-hidden="true"></i>${esc(this.l('timelineStartClose','Inicio y cierre programados'))}</span></div><div class="agenda-timeline-scroll" role="region" aria-label="${esc(this.l('timelineRegion','Cronograma completo, desplazable horizontalmente'))}" tabindex="0"><table class="agenda-timeline-table" style="--agenda-axis-width:${width}px"><caption class="agenda-sr-only">${esc(this.l('timelineCaptionPrefix','Cronograma de'))} ${plural(this.filtered.length, this.l('activitySingular','actividad'), this.l('activityPlural','actividades'))}. ${esc(this.l('timelineCaptionSuffix','Las barras representan fechas programadas. Los nombres permanecen visibles al desplazarse.'))}</caption>${header}${bodies}</table></div><p class="agenda-timeline-help">${esc(this.l('timelineHelp','Los nombres permanecen a la izquierda. Desplaza el calendario para explorar todas las fechas.'))}</p>`;
  }

  private openDetail(activity: Activity, opener: HTMLElement): void {
    this.dialogActivity = activity; this.opener = opener;
    const state = temporalState(activity, this.today);
    this.get<HTMLElement>('[data-agenda-dialog-process]').textContent = `${activity.process} · ${activity.period || this.l('periodConfirm','Periodo por confirmar')}`;
    this.get<HTMLElement>('[data-agenda-dialog-title]').textContent = activity.title;
    const original = this.get<HTMLElement>('[data-agenda-dialog-original]');
    original.hidden = activity.originalTitle === activity.title;
    original.textContent = activity.originalTitle;
    const status = this.get<HTMLElement>('[data-agenda-dialog-status]');
    status.className = `agenda-status agenda-status--${state}`; status.textContent = this.status(state);
    const facts: Array<[string, string]> = [[this.l('factStart','Inicio'), formatDay(activity.start, true)], [this.l('factEnd','Cierre'), formatDay(activity.end, true)], [this.l('factOwner','Responsable'), activity.owner || this.l('confirm','Por confirmar')], [this.l('factModality','Modalidad'), activity.modality]];
    if (activity.phase) facts.push([activity.editorialPhase ? this.l('factStageEditorial','Etapa de consulta') : this.l('factStage','Etapa'), activity.phase]);
    if (activity.group && activity.group !== activity.process) facts.push([this.l('factOriginGroup','Grupo de origen'), activity.group]);
    if (activity.execution) facts.push([this.l('factExecution','Ejecución reportada'), activity.execution]);
    facts.push([this.l('factSource','Fuente'), activity.source || this.l('factSourceMissing','No indicada en el registro')]);
    this.get<HTMLElement>('[data-agenda-dialog-facts]').innerHTML = facts.map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('');
    const action = this.get<HTMLElement>('[data-agenda-dialog-action]');
    action.hidden = !activity.action;
    action.innerHTML = activity.action ? `<strong>${esc(this.l('programAction','Para el programa académico'))}</strong><p>${esc(activity.action)}</p>` : '';
    const note = this.get<HTMLElement>('[data-agenda-dialog-note]');
    note.hidden = !activity.note; note.textContent = activity.note;
    const activityUrl = safeUrl(activity.url), sourceUrl = safeUrl(activity.sourceUrl);
    this.get<HTMLElement>('[data-agenda-dialog-links]').innerHTML = `${activityUrl ? `<a href="${esc(activityUrl)}" target="_blank" rel="noopener noreferrer">${esc(this.l('resource','Abrir recurso'))} ${ICON_ARROW}</a>` : ''}${sourceUrl && sourceUrl !== activityUrl ? `<a href="${esc(sourceUrl)}" target="_blank" rel="noopener noreferrer">${esc(this.l('source','Consultar fuente'))} ${ICON_ARROW}</a>` : ''}`;
    this.dialog.showModal();
  }

  private download(activities: Activity[]): void {
    if (!activities.length) return;
    const calendar = createCalendar(activities,new Date(),this.labels);
    const blob = new Blob([calendar], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `agenda-desarrollo-docente-${slug(this.selection.period)}${activities.length === 1 ? `-${slug(activities[0].id)}` : this.selection.process !== 'Todos' ? `-${slug(this.selection.process)}` : ''}.ics`;
    document.body.append(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    this.announce(`${this.l('exportPrepared','Se preparó un calendario con')} ${plural(activities.length, this.l('activitySingular','actividad'), this.l('activityPlural','actividades'))}.`);
  }
}

function initAgendas(): void {
  document.querySelectorAll<HTMLElement>('[data-agenda-root]').forEach((root) => {
    if (root.dataset.agendaReady === 'true') return;
    const data = root.querySelector('[data-agenda-data]')?.textContent;
    if (!data) return;
    try { new AgendaController(root, JSON.parse(data) as Content); }
    catch (error) {
      // The server-rendered activity list remains available if enhancement fails.
      console.error('No fue posible activar los filtros de la agenda.', error);
    }
  });
}

if (typeof document !== 'undefined') {
  initAgendas();
  document.addEventListener('astro:page-load', initAgendas);
}
