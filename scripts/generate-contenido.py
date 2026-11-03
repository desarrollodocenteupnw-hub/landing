import csv, os
out='/mnt/data/portal_sheets_dynamic/docs/sheets/contenido.csv'
rows=[]
def add(id,grupo,pagina,seccion,tipo='texto',titulo='',texto='',url='',imagen='',imagen_alt='',icono='',color='',orden=0,visible='si',estado='publicado'):
    rows.append(dict(id=id,grupo=grupo,pagina=pagina,seccion=seccion,tipo=tipo,titulo=titulo,texto=texto,url=url,imagen=imagen,imagen_alt=imagen_alt,icono=icono,color=color,orden=orden,visible=visible,estado_publicacion=estado))

# GLOBAL / NAV / FOOTER / SEARCH / INTRO
for i,(id_,title,url) in enumerate([
 ('nav.inicio','Inicio','/'),('nav.area','Nuestra Dirección','/el-area/'),('nav.procesos','Procesos','/procesos/'),('nav.recursos','Recursos','/recursos/'),('nav.agenda','Agenda','/agenda/'),('nav.innovacion','Innovación','/innovacion/')],1):
    add(id_,'nav.main','global','navegacion','enlace',titulo=title,url=url,orden=i)
add('global.brand.area','global.copy','global','header',texto='Dirección de Gestión y Desarrollo Docente')
add('global.header.presentar','global.copy','global','header',texto='Presentar')
add('global.footer.eyebrow','global.copy','global','footer',texto='Dirección de Gestión y Desarrollo Docente')
add('global.footer.title','global.copy','global','footer',texto='Sigamos construyendo una docencia de excelencia.')
add('global.footer.body','global.copy','global','footer',texto='Acompañamos a nuestra comunidad docente con información, formación, orientación, evaluación y reconocimiento.')
add('global.footer.cta','global.copy','global','footer',titulo='Conoce al equipo',url='/el-area/#equipo',tipo='enlace')
for i,(id_,title,url) in enumerate([
 ('footer.agenda','Agenda del área','/agenda/'),('footer.recursos','Recursos institucionales','/recursos/'),('footer.resultados','Metas y resultados','/resultados/'),('footer.mide','Medición Integral de Excelencia Docente','/procesos/evaluacion/')],1):
    add(id_,'footer.links','global','footer','enlace',titulo=title,url=url,orden=i)
add('global.footer.links_title','global.copy','global','footer',texto='Accesos útiles')
add('global.footer.sources','global.copy','global','footer',titulo='Fuentes',url='/recursos/#fuentes',tipo='enlace')
add('global.footer.motion','global.copy','global','footer',texto='Reducir movimiento')
add('global.footer.replay','global.copy','global','footer',texto='Repetir intro')
add('global.mobile.title','global.copy','global','mobile',texto='Explora Desarrollo Docente')
add('global.mobile.presentation','global.copy','global','mobile',texto='Modo presentación')
add('global.search.title','global.copy','global','search',texto='¿Qué quieres encontrar?')
add('global.search.placeholder','global.copy','global','search',texto='Procesos, actividades, eventos…')
add('global.search.status','global.copy','global','search',texto='Busca en los cinco procesos de Desarrollo Docente.')
add('global.search.direct','global.copy','global','search',texto='Accesos directos')
for i,(id_,title,url) in enumerate([
 ('search.evaluacion','Evaluación','/procesos/evaluacion/'),('search.cronograma','Cronograma','/agenda/'),('search.formacion','Rutas formativas','/procesos/formacion/')],1):
    add(id_,'search.links','global','search','enlace',titulo=title,url=url,orden=i)
for i,(id_,txt) in enumerate([
 ('intro.1','Conectamos.'),('intro.2','Impulsamos.'),('intro.3','Desarrollo Docente.')],1): add(id_,'intro.words','global','intro',texto=txt,orden=i)
add('intro.skip','global.copy','global','intro',texto='Saltar introducción')

# HOME
add('home.hero.kicker','home.copy','home','hero',texto='Dirección de Gestión y Desarrollo Docente')
add('home.hero.title','home.copy','home','hero',texto='Impulsamos una docencia de excelencia')
add('home.hero.emphasis','home.copy','home','hero',texto='para transformar vidas.')
add('home.hero.body','home.copy','home','hero',texto='Acompañamos tu experiencia docente con orientación, formación, retroalimentación, evaluación y reconocimiento.')
add('home.hero.primary','home.copy','home','hero','enlace',titulo='Conoce nuestros procesos',url='#procesos')
add('home.hero.secondary','home.copy','home','hero','enlace',titulo='Revisa la agenda',url='/agenda/')
add('home.hero.image','home.copy','home','hero','imagen',imagen='/assets/gala-dialogo.webp',imagen_alt='Comunidad docente Wiener')
add('home.norby.title','home.copy','home','hero',texto='Hola, soy Norby.')
add('home.norby.body','home.copy','home','hero',texto='Tu aliado en el desarrollo docente. ¿Por dónde empezamos hoy?')
add('home.norby.image','home.copy','home','hero','imagen',imagen='/assets/norby-welcome.png',imagen_alt='Norby, mascota institucional de la Universidad Norbert Wiener')
add('home.processes.kicker','home.copy','home','procesos',texto='Nuestro recorrido')
add('home.processes.title','home.copy','home','procesos',texto='Cinco procesos para acompañarte en cada etapa de la docencia.')
add('home.processes.body','home.copy','home','procesos',texto='Explora el proceso que necesitas y encuentra información, recursos, fechas y oportunidades para tu desarrollo.')
add('home.resources.kicker','home.copy','home','recursos',texto='Recursos para tu desarrollo')
add('home.resources.title','home.copy','home','recursos',texto='Todo lo que necesitas, más cerca.')
for i,(id_,title,url,icon) in enumerate([
 ('home.res.guia','Guías y manuales','/recursos/','document'),('home.res.plantillas','Plantillas y formatos','/recursos/','document'),('home.res.capacitaciones','Capacitaciones','/procesos/formacion/','play'),('home.res.fechas','Fechas clave','/agenda/','calendar'),('home.res.contacto','Contacto DGDD','/el-area/','people')],1):
    add(id_,'home.resources.links','home','recursos','enlace',titulo=title,url=url,icono=icon,orden=i)
add('home.promo.kicker','home.copy','home','promo',texto='Comunidad Wiener')
add('home.promo.title','home.copy','home','promo',texto='Construimos juntos una docencia de excelencia.')
add('home.promo.cta','home.copy','home','promo','enlace',titulo='Conoce la experiencia')
add('home.promo.image','home.copy','home','promo','imagen',imagen='/assets/eventos/conectados-excelencia-2026.webp',imagen_alt='Docentes reconocidos en Conectados con la Excelencia')
add('home.mide.kicker','home.copy','home','mide',texto='Evaluación que impulsa el desarrollo')
add('home.mide.title','home.copy','home','mide',texto='Medición Integral de Excelencia Docente.')
add('home.mide.body','home.copy','home','mide',texto='Una mirada integral para reconocer fortalezas, identificar oportunidades de mejora y orientar decisiones de desarrollo profesional.')
add('home.mide.primary','home.copy','home','mide','enlace',titulo='Conoce MIDE',url='/procesos/evaluacion/')
add('home.mide.secondary','home.copy','home','mide','enlace',titulo='Metas y resultados',url='/resultados/')
add('home.community.kicker','home.copy','home','comunidad',texto='Experiencias de nuestra comunidad')
add('home.community.title','home.copy','home','comunidad',texto='Compartimos ideas. Reconocemos el talento.')
add('home.community.cta','home.copy','home','comunidad','enlace',titulo='Explora los encuentros',url='/agenda/#eventos')
add('home.agenda.kicker','home.copy','home','agenda',texto='Conecta con lo que viene')
add('home.agenda.title','home.copy','home','agenda',texto='Tu próximo paso empieza aquí.')
add('home.agenda.cta','home.copy','home','agenda','enlace',titulo='Ver agenda completa',url='/agenda/')
add('home.gallery.kicker','home.copy','home','galeria',texto='Somos comunidad Wiener')
add('home.gallery.title','home.copy','home','galeria',texto='El valor de encontrarnos y seguir creciendo.')

# AREA PAGE
add('area.hero.eyebrow','area.copy','area','hero',texto='Dirección de Gestión y Desarrollo Docente')
add('area.hero.title','area.copy','area','hero',texto='Impulsamos la docencia Wiener.')
add('area.hero.body','area.copy','area','hero',texto='Conectamos cinco procesos para acompañar a nuestros docentes, fortalecer su práctica y contribuir a una experiencia educativa de excelencia.')
add('area.hero.image','area.copy','area','hero','imagen',imagen='/assets/gala-dialogo.webp',imagen_alt='Comunidad docente Wiener compartiendo experiencias')
add('area.hero.primary','area.copy','area','hero','enlace',titulo='Conoce nuestro propósito',url='#proposito')
add('area.hero.secondary','area.copy','area','hero','enlace',titulo='Conoce al equipo',url='#equipo')
add('area.purpose.image','area.copy','area','proposito','imagen',imagen='/assets/gala-comunidad.webp',imagen_alt='Encuentro de la comunidad docente Wiener')
add('area.purpose.kicker','area.copy','area','proposito',texto='Nuestro propósito')
add('area.purpose.title','area.copy','area','proposito',texto='Acompañar al docente.\nEnriquecer la experiencia educativa.')
add('area.purpose.body','area.copy','area','proposito',texto='Desde la incorporación a Wiener hasta el reconocimiento de su contribución, articulamos oportunidades de desarrollo, orientación y evaluación para una práctica docente en continua evolución.')
for i,(id_,title,txt) in enumerate([
 ('area.principle.1','Desarrollo continuo','Conectamos los distintos momentos y necesidades de la trayectoria docente.'),
 ('area.principle.2','Decisiones con evidencia','Comprendemos la práctica para orientar la mejora y reconocer sus aportes.'),
 ('area.principle.3','Una comunidad que comparte','Damos espacio al intercambio de experiencias y al valor del trabajo docente.')],1):
    add(id_,'area.principles','area','proposito','item',titulo=title,texto=txt,orden=i)
add('area.work.kicker','area.copy','area','trabajo',texto='Nuestro trabajo')
add('area.work.title','area.copy','area','trabajo',texto='Cinco procesos. Un propósito compartido.')
add('area.work.body','area.copy','area','trabajo',texto='Cada proceso responde a un momento distinto de la experiencia docente y se conecta con los demás.')
add('area.need.kicker','area.copy','area','necesidad',texto='Explora según tu necesidad')
add('area.need.title','area.copy','area','necesidad',texto='Información para tomar acción.')
add('area.need.body','area.copy','area','necesidad',texto='El portal organiza la información para docentes, directores y autoridades académicas.')
for i,(id_,tag,title,txt,url,label) in enumerate([
 ('area.audience.docentes','DOCENTES','Conoce tu recorrido.','Descubre los cinco procesos, las oportunidades de participación y las fechas de cada actividad.','/procesos/','Explora los procesos'),
 ('area.audience.directores','DIRECTORES','Organiza las próximas acciones.','Consulta actividades, responsables y plazos por periodo y modalidad.','/agenda/','Consulta la agenda'),
 ('area.audience.autoridades','AUTORIDADES','Comprende la evaluación.','Explora las dimensiones, metas y etapas de la Medición Integral de Excelencia Docente.','/procesos/evaluacion/','Consulta Evaluación')],1):
    add(id_,'area.audiences','area','necesidad','item',titulo=title,texto=txt,url=url,icono=tag,orden=i)
    add(id_+'.cta','area.audience.cta','area','necesidad','texto',texto=label,orden=i)
add('area.team.kicker','area.copy','area','equipo',texto='Personas que acompañan tu desarrollo')
add('area.team.title','area.copy','area','equipo',texto='Nuestro equipo.')
add('area.team.body','area.copy','area','equipo',texto='Dirección de Gestión y Desarrollo Docente de la Universidad Norbert Wiener.')
add('area.team.note','area.copy','area','equipo',texto='Encuentra al responsable de cada actividad en la agenda del área.')
add('area.banner.title','area.copy','area','banner',texto='El área, en una mirada.')
add('area.banner.body','area.copy','area','banner',texto='Recorre los cinco procesos, sus metas y las próximas fechas en el modo presentación.')
add('area.banner.cta','area.copy','area','banner','enlace',titulo='Inicia la presentación',url='/presentar/')

# PROCESSES INDEX
add('processes.hero.eyebrow','processes.copy','processes','hero',texto='Desarrollo Docente Wiener')
add('processes.hero.title','processes.copy','processes','hero',texto='Cinco procesos. Un propósito compartido.')
add('processes.hero.body','processes.copy','processes','hero',texto='Inducción, Formación, Acompañamiento, Evaluación y Reconocimiento se conectan para acompañar tu desarrollo y fortalecer la experiencia educativa.')
add('processes.hero.image','processes.copy','processes','hero','imagen',imagen='/assets/gala-comunidad.webp',imagen_alt='Comunidad docente Wiener')
add('processes.hero.primary','processes.copy','processes','hero','enlace',titulo='Explora los procesos',url='#procesos')
add('processes.hero.secondary','processes.copy','processes','hero','enlace',titulo='Revisa la agenda',url='/agenda/')
add('processes.overview.kicker','processes.copy','processes','overview',texto='Tu recorrido docente')
add('processes.overview.title','processes.copy','processes','overview',texto='Encuentra el proceso que necesitas hoy.')
add('processes.overview.body','processes.copy','processes','overview',texto='Cada proceso reúne propósito, recorrido, cronograma, recursos y oportunidades específicas.')
for i,(slug,title,txt) in enumerate([
 ('induccion','01 · Inducción','Conectarte con Wiener y comenzar con claridad.'),('formacion','02 · Formación','Desarrollar nuevas capacidades para tu práctica.'),('acompanamiento','03 · Acompañamiento','Convertir la retroalimentación en mejora.'),('evaluacion','04 · Evaluación','Comprender el desempeño y orientar decisiones.'),('reconocimiento','05 · Reconocimiento','Visibilizar la excelencia y la contribución docente.')],1): add(f'processes.journey.{slug}','processes.journey','processes','overview','item',titulo=title,texto=txt,orden=i)
add('processes.banner.title','processes.copy','processes','banner',texto='Tu próximo paso está en la agenda.')
add('processes.banner.body','processes.copy','processes','banner',texto='Encuentra las actividades de cada proceso y consulta sus fechas, modalidades y responsables.')
add('processes.banner.cta','processes.copy','processes','banner','enlace',titulo='Consulta la agenda',url='/agenda/')

# PROCESS DETAIL copy per process
process_defs={
 'induccion':('Conecta','Tu experiencia Wiener empieza aquí.','Integración y cultura Wiener','/assets/campus.jpg',[
  ('Conoce la experiencia Wiener','La reunión de inducción con la DGDD conecta al docente con el modelo educativo, la cultura y los recursos de la universidad.'),('Encuentra tu punto de partida','La reunión académica inicial brinda los lineamientos del periodo y conecta al docente con su programa.'),('Prepárate para enseñar','El curso autoinstructivo reúne contenidos, guías y videotutoriales para conocer las herramientas y responsabilidades de la docencia Wiener.')], [('document','Información institucional'),('people','Acompañamiento inicial'),('laptop','Herramientas para tu docencia'),('calendar','Fechas y recursos')]),
 'formacion':('Evoluciona','Nuevas capacidades para transformar tu práctica.','Aprendizaje y desarrollo profesional','/assets/eventos/buenas-practicas-ia-2025.webp',[
  ('Explora nuevas posibilidades','Ocho líneas abordan capacidades como el diseño de experiencias, la inteligencia artificial, las metodologías activas y la investigación.'),('Avanza con propósito','Cuatro módulos por línea conectan los conceptos fundamentales con capacidades cada vez más especializadas.'),('Haz visible tu aprendizaje','Cada línea contempla una insignia digital o un certificado de reconocimiento, conforme a los lineamientos vigentes.')], [('book','Rutas de formación'),('people','Cursos y talleres'),('award','Reconocimientos formativos'),('laptop','Recursos de aprendizaje')]),
 'acompanamiento':('Fortalece','Un acompañamiento que fortalece tu enseñanza.','Observación y retroalimentación','/assets/gala-dialogo.webp',[
  ('Mira tu práctica de cerca','La observación de clases y la retroalimentación personalizada permiten reconocer fortalezas y oportunidades de mejora.'),('Encuentra orientación','El acompañamiento académico y administrativo articula el apoyo al docente con sus programas académicos.'),('Conecta resultados y mejora','Los resultados de evaluación orientan sugerencias pedagógicas y acciones de acompañamiento según las necesidades identificadas.')], [('people','Acompañamiento pedagógico'),('message','Espacios de diálogo'),('target','Orientación especializada'),('document','Retroalimentación y mejora')]),
 'evaluacion':('Comprende','Evaluar para seguir creciendo.','Medición Integral de Excelencia Docente','/assets/gala-auditorio.webp',[
  ('Escucha distintas miradas','La encuesta estudiantil, la evaluación de la dirección académica y la autoevaluación aportan perspectivas sobre la práctica docente.'),('Reconoce el desempeño integral','MIDE reúne cuatro dimensiones: docencia, investigación, visión global e impacto social.'),('Conecta con la mejora','Los resultados permiten orientar decisiones de formación, acompañamiento y reconocimiento docente.')], [('document','Instrumentos de evaluación'),('chart','Dimensiones MIDE'),('calendar','Cronograma del proceso'),('target','Metas y resultados')]),
 'reconocimiento':('Inspira','La excelencia docente merece ser reconocida.','Excelencia y comunidad','/assets/eventos/conectados-excelencia-2026.webp',[
  ('Valora la docencia','El reconocimiento semestral distingue a los docentes que alcanzan la escala A en la dimensión Docencia.'),('Reconoce el desempeño integral','Los mejores resultados anuales en la Medición Integral de Excelencia Docente reciben reconocimiento institucional.'),('Inspira a la comunidad','Visibilizamos la contribución del profesorado a la enseñanza, la innovación, la investigación y el compromiso social.')], [('award','Categorías de reconocimiento'),('check','Criterios de elegibilidad'),('people','Historias que inspiran'),('calendar','Encuentros y ceremonias')])
}
for slug,(verb,lead,eyebrow,image,steps,features) in process_defs.items():
    teaser={
      'induccion':'Conoce la experiencia Wiener y empieza tu labor con orientación, recursos y herramientas institucionales.',
      'formacion':'Amplía tus capacidades con ocho líneas de formación conectadas con los desafíos de la docencia universitaria.',
      'acompanamiento':'Haz de la observación, el diálogo y la retroalimentación oportunidades para mejorar tu práctica docente.',
      'evaluacion':'Reconoce fortalezas y oportunidades con una mirada integral que orienta el desarrollo profesional docente.',
      'reconocimiento':'Celebra el compromiso, la innovación y el desempeño destacado que contribuyen a nuestra comunidad académica.'
    }[slug]
    add(f'process.{slug}.verb',f'process.{slug}.copy',slug,'hero',texto=verb)
    add(f'process.{slug}.teaser',f'process.{slug}.copy',slug,'hero',texto=teaser)
    add(f'process.{slug}.lead',f'process.{slug}.copy',slug,'hero',texto=lead)
    add(f'process.{slug}.eyebrow',f'process.{slug}.copy',slug,'hero',texto=eyebrow)
    add(f'process.{slug}.image',f'process.{slug}.copy',slug,'hero','imagen',imagen=image,imagen_alt=f'Imagen del proceso {slug}')
    for i,(t,b) in enumerate(steps,1): add(f'process.{slug}.step.{i}',f'process.{slug}.steps',slug,'recorrido','item',titulo=t,texto=b,orden=i)
    for i,(icon,label) in enumerate(features,1): add(f'process.{slug}.feature.{i}',f'process.{slug}.features',slug,'features','item',titulo=label,icono=icon,orden=i)

# Shared process labels
for id_,txt in [
 ('process.label.overview','Visión general'),('process.label.journey','Recorrido del proceso'),('process.label.schedule','Cronograma'),('process.label.resources','Recursos'),('process.label.offer','Oferta formativa'),('process.label.results','Resultados'),('process.label.value','Qué aporta este proceso'),('process.label.audience','A quién está dirigido'),('process.label.participate','Cómo participar'),('process.label.consult','Consulta el proceso'),('process.label.fallback','Encuentra las actividades del periodo, sus fechas y responsables en la agenda de este proceso.'),('process.journey.kicker','Cómo funciona'),('process.journey.title','Un recorrido con propósito.'),('process.journey.evaluation_title','Evaluación que orienta la mejora.'),('process.metrics.kicker','Seguimiento del proceso'),('process.metrics.title','Metas para\nseguir avanzando.'),('process.metrics.cta','Consulta todos los procesos'),('process.metrics.note','Las metas expresan lo que buscamos alcanzar. Los resultados se muestran cuando cuentan con información publicada.'),('process.schedule.kicker','Fechas y actividades'),('process.schedule.cta','Consulta la agenda del área'),('process.cross.kicker','Un área conectada'),('process.cross.title','Explora los cinco procesos.')]: add(id_,'process.shared','global','process',texto=txt)
add('process.hero.primary.default','process.shared','global','process',texto='Conoce el proceso')
add('process.hero.primary.evaluation','process.shared','global','process',texto='Comprende el modelo')
add('process.hero.secondary','process.shared','global','process',texto='Ver fechas y acciones')

# MIDE dimensions and evaluation copy
for i,(id_,name,desc,color) in enumerate([
 ('mide.docencia','Docencia','Planificación, enseñanza y evaluación que favorecen experiencias de aprendizaje de calidad.','#006AB4'),
 ('mide.investigacion','Investigación','Generación y aplicación de conocimiento que vincula la investigación con la docencia.','#FFC000'),
 ('mide.vision','Visión global','Perspectivas y experiencias internacionales que amplían el alcance de la práctica académica.','#7F7F7F'),
 ('mide.impacto','Impacto social','Conocimiento y experiencia docente al servicio de la comunidad y de un desarrollo sostenible.','#07C8CD')],1): add(id_,'mide.dimensions','evaluacion','mide','dimension',titulo=name,texto=desc,color=color,orden=i)
add('mide.section.kicker','mide.copy','evaluacion','mide',texto='Medición Integral de Excelencia Docente')
add('mide.section.title','mide.copy','evaluacion','mide',texto='MIDE.\nCuatro dimensiones.')
add('mide.section.body','mide.copy','evaluacion','mide',texto='Una mirada integral para comprender el desempeño, identificar oportunidades de mejora y reconocer la contribución docente.')
add('mide.section.notice','mide.copy','evaluacion','mide',texto='La evaluación reúne acciones semestrales y anuales. Consulta el periodo y las fechas de aplicación, procesamiento y comunicación de cada actividad.')
add('mide.graph.heading','mide.copy','evaluacion','mide',texto='Una mirada integral')
add('mide.graph.count','mide.copy','evaluacion','mide',texto='04 dimensiones')
add('mide.graph.core','mide.copy','evaluacion','mide',texto='Desempeño docente')
add('mide.graph.caption','mide.copy','evaluacion','mide',texto='Medición Integral de Excelencia Docente')
for i,(key,title,detail) in enumerate([
 ('aplicacion','Aplicación','Participación en los instrumentos de evaluación y autoevaluación.'),('reportes','Reportes e insumos','Información de notas, asistencia, formación y otras evidencias del periodo.'),('procesamiento','Procesamiento','Análisis y consolidación de la información para elaborar los resultados.'),('resultados','Comunicación','Entrega de resultados a los docentes y las direcciones académicas.')],1): add(f'evaluation.stage.{key}','evaluation.stages','evaluacion','etapas','item',titulo=title,texto=detail,icono=key,orden=i)
add('evaluation.stages.kicker','evaluation.copy','evaluacion','etapas',texto='Fechas clave de Evaluación')
add('evaluation.stages.title','evaluation.copy','evaluacion','etapas',texto='Una mirada clara\nde cada etapa.')
add('evaluation.stages.body','evaluation.copy','evaluacion','etapas',texto='Consulta el cronograma por etapa, periodo y modalidad para organizar las próximas acciones.')

# Accompaniment types
for i,(title,desc) in enumerate([
 ('Pedagógico','Observación de clases presenciales o virtuales y retroalimentación individual para fortalecer la planificación, la enseñanza y la evaluación.'),('Académico','Orientación sobre contenidos disciplinares y coherencia curricular, a cargo de la dirección del programa o de quien esta designe.'),('Administrativo','Orientación sobre las responsabilidades docentes: asistencia, puntualidad, desarrollo de sesiones y registro oportuno de calificaciones.'),('Soporte pedagógico a partir de la evaluación','Orientación, retroalimentación y sugerencias por correo electrónico a partir de los resultados de la evaluación del desempeño docente.')],1): add(f'accompaniment.type.{i}','accompaniment.types','acompanamiento','tipos','item',titulo=title,texto=desc,orden=i)
add('accompaniment.types.kicker','accompaniment.copy','acompanamiento','tipos',texto='Tipos de acompañamiento')
add('accompaniment.types.title','accompaniment.copy','acompanamiento','tipos',texto='Distintas formas de\nacompañarte.')
add('accompaniment.types.body','accompaniment.copy','acompanamiento','tipos',texto='Observación, orientación y retroalimentación para fortalecer distintos aspectos de tu práctica docente.')
add('accompaniment.types.summary','accompaniment.copy','acompanamiento','tipos',texto='Conoce los tipos de acompañamiento y su alcance')
add('accompaniment.scope.audience.title','accompaniment.copy','acompanamiento','tipos',texto='¿A quién está dirigido?')
add('accompaniment.scope.audience.body','accompaniment.copy','acompanamiento','tipos',texto='A docentes de pregrado, posgrado y segundas especialidades. El alcance establecido en el plan exceptúa a los docentes que desarrollan sus actividades en campos clínicos.')
add('accompaniment.scope.priority.title','accompaniment.copy','acompanamiento','tipos',texto='¿Cómo se prioriza?')
add('accompaniment.scope.priority.body','accompaniment.copy','acompanamiento','tipos',texto='Se consideran las oportunidades de mejora identificadas en la evaluación del desempeño, la satisfacción estudiantil y los requerimientos de cada programa académico.')
add('accompaniment.scope.source','accompaniment.copy','acompanamiento','tipos',texto='Fuente: Plan de Desarrollo Docente 2026, apartados 6.2 a 6.4.')

# Formation labels
for id_,txt in [
 ('formation.offer.kicker','Oferta formativa 2026–2027'),('formation.offer.title_suffix','Distintas formas de crecer.'),('formation.offer.body_default','Explora los módulos de cada línea y encuentra un camino para seguir desarrollando tu práctica.'),('formation.offer.body_calls','Explora los módulos de cada línea y consulta las convocatorias disponibles.'),('formation.route.recognition','Reconocimiento de la línea'),('formation.route.work','Qué trabajarás'),('formation.route.audience','Dirigido a'),('formation.route.duration','Duración'),('formation.route.modality','Modalidad'),('formation.route.availability','Disponibilidad'),('formation.route.open','Abrir convocatoria'),('formation.module.open','Abrir módulo'),('formation.fact.lines','Líneas de formación'),('formation.fact.modules_per_line','Módulos por línea'),('formation.fact.modules_catalog','Módulos en el catálogo'),('formation.fact.minimum','Actividades mínimas por periodo'),('formation.conditions.summary','¿Cómo se reconoce una línea completada?'),('formation.conditions.body','Al completar satisfactoriamente los cuatro módulos de una línea, el reconocimiento puede otorgarse como insignia digital o certificado, de acuerdo con los lineamientos y recursos vigentes.'),('formation.conditions.1','Cumplir el 80 % de participación en las actividades síncronas o de interacción en la plataforma virtual, en cada módulo.'),('formation.conditions.2','Entregar el producto académico que demuestre lo aprendido, cuando corresponda.'),('formation.conditions.3','Obtener la calificación aprobatoria establecida en los lineamientos de formación docente.'),('formation.conditions.note','Las actividades gestionadas por Formación y Fidelización Docente se reconocen con una nota mínima de 14.'),('formation.conditions.source','Fuente: Plan de Desarrollo Docente 2026, apartados 5.2 y 5.5. Consulta las condiciones específicas en la convocatoria de cada actividad.'),('formation.notice.calls','Consulta la disponibilidad de cada línea y sus enlaces de convocatoria. Encuentra las fechas de las actividades en la agenda.'),('formation.notice.default','Las fechas de las actividades están en la agenda. Consulta la inscripción y disponibilidad en las convocatorias de cada actividad.'),('formation.events.kicker','Experiencias documentadas'),('formation.events.title','Aprendizajes\nque compartimos.'),('formation.events.body','Explora las jornadas y ciclos de formación publicados por la universidad.')]: add(id_,'formation.copy','formacion','oferta',texto=txt)

# Recognition/evaluation event section labels
for id_,txt in [
 ('recognition.events.kicker','Experiencias y comunidad'),('recognition.events.title','Encuentros para reconocer.'),('evaluation.events.kicker','Evaluación y reconocimiento'),('evaluation.events.title','La excelencia\nse hace visible.'),('evaluation.events.body','Encuentros de reconocimiento vinculados a los resultados de la evaluación docente.')]: add(id_,'process.events','global','events',texto=txt)

# AGENDA PAGE
add('agenda.hero.eyebrow','agenda.copy','agenda','hero',texto='Planificación del área')
add('agenda.hero.title','agenda.copy','agenda','hero',texto='Una agenda. Todos los procesos.')
add('agenda.hero.body','agenda.copy','agenda','hero',texto='Consulta las fechas, encuentra tus próximas acciones y explora el cronograma de Desarrollo Docente.')
add('agenda.hero.image','agenda.copy','agenda','hero','imagen',imagen='/assets/gala-auditorio.webp',imagen_alt='Actividad académica de la comunidad Wiener')
add('agenda.hero.primary','agenda.copy','agenda','hero','enlace',titulo='Explorar el cronograma',url='#cronograma')
add('agenda.hero.secondary','agenda.copy','agenda','hero','enlace',titulo='Ver encuentros',url='#eventos')
add('agenda.hero.note','agenda.copy','agenda','hero',texto='Las fechas se muestran por periodo académico. La ejecución se informa por separado cuando está disponible.')
add('agenda.section.kicker','agenda.copy','agenda','cronograma',texto='Cronograma operativo')
add('agenda.section.title','agenda.copy','agenda','cronograma',texto='Organiza las próximas acciones.')
add('agenda.section.body','agenda.copy','agenda','cronograma',texto='Filtra la agenda por proceso, periodo y modalidad sin perder la lectura global del ciclo.')
for i,(title,txt) in enumerate([('Vista','Todos los procesos conectados'),('Lectura','Actividades, responsables y plazos'),('Actualización','Por periodo académico')],1): add(f'agenda.context.{i}','agenda.context','agenda','cronograma','item',titulo=title,texto=txt,orden=i)
add('agenda.events.kicker','agenda.copy','agenda','eventos',texto='Encuentros de la comunidad')
add('agenda.events.title','agenda.copy','agenda','eventos',texto='Ideas, experiencias y reconocimiento.')
add('agenda.events.body','agenda.copy','agenda','eventos',texto='Conoce los eventos programados y vuelve a los momentos que ya compartimos.')
# Agenda component labels
for id_,txt in [
 ('agenda.ui.kicker','Cada proceso, en su momento'),('agenda.ui.intro','Explora las actividades, sus fechas y quiénes las acompañan.'),('agenda.ui.timezone','Hora de Lima'),('agenda.ui.period','Periodo académico'),('agenda.ui.all_periods','Todos los periodos'),('agenda.ui.modality','Modalidad'),('agenda.ui.all_modalities','Todas las modalidades'),('agenda.ui.presential','Presencial · Lima Centro y Norte'),('agenda.ui.distance','A distancia'),('agenda.ui.process','Proceso'),('agenda.ui.all_processes','Todos los procesos'),('agenda.ui.search','Buscar una actividad'),('agenda.ui.reset','Restablecer filtros'),('agenda.ui.responsible','Responsable:'),('agenda.ui.source','Fuente:'),('agenda.ui.empty','No hay actividades registradas para esta selección.'),('agenda.ui.noscript','Puedes consultar todas las actividades de este periodo. Activa JavaScript para filtrar, cambiar de vista o guardar el calendario.'),('agenda.ui.status_note','Los estados describen el plazo programado.'),('agenda.ui.editorial_note','Las etapas de Evaluación son una agrupación editorial para facilitar la consulta.'),('agenda.ui.export','Guardar esta actividad'),('agenda.ui.calendar','Calendario .ics')]: add(id_,'agenda.ui','agenda','component',texto=txt)

# RESOURCES
add('resources.hero.eyebrow','resources.copy','recursos','hero',texto='Recursos institucionales')
add('resources.hero.title','resources.copy','recursos','hero',texto='El marco de nuestro trabajo.')
add('resources.hero.body','resources.copy','recursos','hero',texto='Documentos y referencias que organizan los procesos, la planificación y la evaluación del desarrollo docente.')
add('resources.hero.image','resources.copy','recursos','hero','imagen',imagen='/assets/campus.jpg',imagen_alt='Campus de la Universidad Norbert Wiener')
add('resources.hero.primary','resources.copy','recursos','hero','enlace',titulo='Explorar documentos',url='#fuentes')
add('resources.hero.secondary','resources.copy','recursos','hero','enlace',titulo='Ver agenda',url='/agenda/')
add('resources.section.kicker','resources.copy','recursos','recursos',texto='Documentos de referencia')
add('resources.section.title','resources.copy','recursos','recursos',texto='Fuentes para consultar.')
add('resources.section.body','resources.copy','recursos','recursos',texto='Accede a la documentación institucional que sustenta los procesos y lineamientos del área.')

# RESULTS
add('results.hero.eyebrow','results.copy','resultados','hero',texto='Seguimiento del área')
add('results.hero.title','results.copy','resultados','hero',texto='Lo que buscamos. Lo que medimos.')
add('results.hero.body','results.copy','resultados','hero',texto='Conoce las metas de cada proceso y consulta los resultados disponibles con su periodo de referencia.')
add('results.hero.image','results.copy','resultados','hero','imagen',imagen='/assets/gala-comunidad.webp',imagen_alt='Docentes de la comunidad Wiener')
add('results.hero.primary','results.copy','resultados','hero','enlace',titulo='Ver indicadores',url='#indicadores')
add('results.hero.secondary','results.copy','resultados','hero','enlace',titulo='Conoce MIDE',url='/procesos/evaluacion/')
add('results.section.kicker','results.copy','resultados','indicadores',texto='Lectura ejecutiva')
add('results.section.title','results.copy','resultados','indicadores',texto='Metas y resultados no son lo mismo.')
add('results.section.body','results.copy','resultados','indicadores',texto='Las metas expresan el nivel que buscamos alcanzar. Los resultados se muestran únicamente cuando cuentan con información publicada y periodo de referencia.')

# INNOVATION
add('innovation.hero.eyebrow','innovation.copy','innovacion','hero',texto='Innovación y mejora continua')
add('innovation.hero.title','innovation.copy','innovacion','hero',texto='Innovación desde la práctica docente.')
add('innovation.hero.body','innovation.copy','innovacion','hero',texto='La innovación atraviesa nuestros cinco procesos: conecta experiencias, herramientas y evidencias para seguir mejorando la docencia.')
add('innovation.hero.image','innovation.copy','innovacion','hero','imagen',imagen='/assets/eventos/buenas-practicas-ia-2025.webp',imagen_alt='Experiencia de formación e innovación docente Wiener')
add('innovation.hero.primary','innovation.copy','innovacion','hero','enlace',titulo='Explorar enfoques',url='#enfoques')
add('innovation.hero.secondary','innovation.copy','innovacion','hero','enlace',titulo='Ver experiencias',url='#experiencias')


# Additional resource/results/innovation copy
add('resources.note','resources.copy','recursos','fuentes',texto='Las fechas, metas y actividades del portal proceden de la planificación incluida en estas referencias. El periodo de cada actividad se conserva en la agenda.')
add('resources.banner.title','resources.copy','recursos','banner',texto='Ubica a los responsables de cada actividad.')
add('resources.banner.body','resources.copy','recursos','banner',texto='Abre el detalle en la agenda para consultar responsable, acción del programa y fuente.')
add('resources.banner.cta','resources.copy','recursos','banner','enlace',titulo='Ir a la agenda',url='/agenda/')
add('resources.open','resources.copy','recursos','labels',texto='Abrir documento')
add('resources.pending','resources.copy','recursos','labels',texto='Referencia institucional · enlace pendiente de publicación')
add('results.note.title','results.copy','resultados','intro',texto='Un indicador por proceso.')
add('results.note.body','results.copy','resultados','intro',texto='Esta vista permite revisar los compromisos principales de Inducción, Formación, Acompañamiento, Evaluación y Reconocimiento sin mezclar sus propósitos.')
add('results.filter.all','results.copy','resultados','filters',texto='Todos')
add('results.filter.status','results.copy','resultados','filters',texto='Visión de todos los procesos')
add('results.empty','results.copy','resultados','indicadores',texto='Los resultados de estos indicadores todavía no tienen un valor informado en el contenido publicado. Se incorporarán con su fecha de corte y fuente cuando estén disponibles.')
add('results.process.cta','results.copy','resultados','indicadores',texto='Conoce el proceso')
add('results.transversal','results.copy','resultados','indicadores',texto='Indicador transversal')
add('results.banner.title','results.copy','resultados','banner',texto='Profundiza en la evaluación del desempeño.')
add('results.banner.body','results.copy','resultados','banner',texto='Modelo MIDE, etapas de aplicación, responsables y fechas de comunicación de resultados.')
add('results.banner.cta','results.copy','resultados','banner','enlace',titulo='Consulta Evaluación',url='/procesos/evaluacion/')
add('innovation.section.kicker','innovation.copy','innovacion','enfoques',texto='Una mirada transversal')
add('innovation.section.title','innovation.copy','innovacion','enfoques',texto='Cinco procesos.\nDistintas formas de avanzar.')
add('innovation.section.body','innovation.copy','innovacion','enfoques',texto='Cada proceso aporta una forma de aprender, acompañar y dar sentido a la mejora.')
innov_approaches={
 'induccion':('Conectar desde la bienvenida.','Integrar el Modelo Educativo Wiener, la orientación institucional y la experiencia de cada programa desde el inicio.','Una incorporación acompañada','Reunión con la DGDD, curso de inducción y reunión académica inicial.','Conoce el recorrido y sus fechas.'),
 'formacion':('Explorar nuevas formas de enseñar.','Herramientas digitales, metodologías activas, investigación y docencia clínica forman parte de las líneas de desarrollo docente.','Aprendizaje para una práctica en evolución','Ocho líneas de cuatro módulos. Insignia digital o certificado según los lineamientos y recursos vigentes.','Explora las líneas y sus condiciones de participación.'),
 'acompanamiento':('Aprender de la práctica cotidiana.','Observación, orientación y retroalimentación según las necesidades de docentes y programas académicos.','Cuatro tipos de acompañamiento','Pedagógico, académico, administrativo y soporte a partir de la evaluación.','Conoce su alcance, las prioridades de atención y las fechas.'),
 'evaluacion':('Comprender para orientar la mejora.','MIDE conecta evidencias de docencia, investigación, visión global e impacto social.','Medición Integral de Excelencia Docente','Dimensiones, metas y cronograma para una lectura integral del desempeño.','Consulta el modelo y las etapas de evaluación.'),
 'reconocimiento':('Hacer visible la contribución docente.','El reconocimiento reúne a nuestra comunidad y pone en valor los aportes vinculados con el desempeño docente.','Excelencia y comunidad','Distinciones que responden a los criterios y resultados de cada periodo.','Explora el proceso y los encuentros de reconocimiento.')
}
for i,(slug,(title,body,focus,detail,application)) in enumerate(innov_approaches.items(),1):
    add(f'innovation.{slug}.title',f'innovation.{slug}.copy','innovacion','enfoques',texto=title)
    add(f'innovation.{slug}.body',f'innovation.{slug}.copy','innovacion','enfoques',texto=body)
    add(f'innovation.{slug}.focus',f'innovation.{slug}.copy','innovacion','enfoques',texto=focus)
    add(f'innovation.{slug}.detail',f'innovation.{slug}.copy','innovacion','enfoques',texto=detail)
    add(f'innovation.{slug}.application',f'innovation.{slug}.copy','innovacion','enfoques',texto=application)
add('innovation.process.cta','innovation.copy','innovacion','enfoques',texto='Conoce el proceso')
add('innovation.initiatives.kicker','innovation.copy','innovacion','iniciativas',texto='Iniciativas del área')
add('innovation.initiatives.title','innovation.copy','innovacion','iniciativas',texto='Exploramos nuevas\nposibilidades.')
add('innovation.initiatives.body','innovation.copy','innovacion','iniciativas',texto='Conoce qué busca cada iniciativa, cómo se desarrolla y qué aprendizajes comparte.')
add('innovation.experiences.kicker','innovation.copy','innovacion','experiencias',texto='Experiencias de Formación')
add('innovation.experiences.title','innovation.copy','innovacion','experiencias',texto='Conocimiento\nque se comparte.')
add('innovation.experiences.body','innovation.copy','innovacion','experiencias',texto='Jornadas y ciclos documentados por la universidad, reunidos por tema para explorar sus aportes a la práctica docente.')
add('innovation.banner.title','innovation.copy','innovacion','banner',texto='Sigue explorando la experiencia docente.')
add('innovation.banner.body','innovation.copy','innovacion','banner',texto='Consulta los próximos encuentros y las memorias de actividades del área.')
add('innovation.banner.cta','innovation.copy','innovacion','banner','enlace',titulo='Explora los encuentros',url='/agenda/#eventos')

# PRESENTATION / GALLERY / EVENTS / KPI fallback labels
for id_,txt in [
 ('gallery.cta','Ver el álbum completo'),('gallery.title','Comunidad docente Wiener'),('featured.cta','Conoce el encuentro'),('featured.empty.kicker','Encuentros de la comunidad'),('featured.empty.title','Próximas oportunidades para encontrarnos.'),('featured.empty.body','Los nuevos encuentros aparecerán aquí cuando se publique su información.'),('featured.empty.cta','Consultar los eventos'),('kpi.meta','Meta'),('kpi.result','Resultado'),('kpi.pending','Pendiente de publicación'),('kpi.cutoff','Corte del resultado:'),('kpi.universe','Universo:'),('kpi.source','Fuente:'),('kpi.empty','Aún no hay indicadores publicados para este proceso.'),('process.explorer.top','DESARROLLO DOCENTE WIENER'),('process.explorer.caption','Un recorrido conectado.'),('process.explorer.aria','Explora los cinco procesos')]: add(id_,'global.labels','global','labels',texto=txt)

# UI labels and editable chrome used across components/pages
extra_labels = [
 ('global.skip','Ir al contenido'),('global.search.minchars','Escribe al menos dos caracteres para buscar.'),
 ('global.search.singular','coincidencia'),('global.search.plural','coincidencias'),('global.search.limit','Mostrando las primeras 12.'),
 ('global.search.empty','No encontramos coincidencias. Prueba con otro proceso, fecha o actividad.'),
 ('global.motion.on','Activar animaciones'),('global.motion.off','Reducir movimiento'),('global.motion.hint','Activa las animaciones para repetir la introducción'),
 ('home.upcoming.close','Cierre del plazo'),('home.upcoming.start','Inicio'),('home.upcoming.empty','No hay próximas fechas publicadas. Puedes consultar el calendario y los periodos anteriores.'),('home.upcoming.context','Fechas próximas al'),
 ('gallery.open','Ampliar fotografía:'),('gallery.close','Cerrar fotografía'),('gallery.newtab','(abre en una nueva pestaña)'),
 ('featured.confirm','POR CONFIRMAR'),
 ('process.cards.cta','Explorar proceso'),('process.explorer.cta_prefix','Explora'),
 ('mide.graph.brand','MIDE'),
 ('events.group.agenda.title','En agenda'),('events.group.agenda.body','Próximos encuentros y convocatorias.'),
 ('events.group.memory.title','Memoria del área'),('events.group.memory.body','Experiencias realizadas y fuentes institucionales.'),
 ('events.group.aria','Encuentros del área'),('events.state.memory','Realizado'),('events.cta.memory','Explorar la memoria'),('events.cta.current','Consultar el encuentro'),
 ('events.fact.time','Hora'),('events.fact.modality','Modalidad'),('events.fact.place','Lugar'),('events.image.alt','Comunidad docente durante un encuentro de la Universidad Norbert Wiener'),
 ('event.breadcrumb.home','Inicio'),('event.breadcrumb.events','Eventos'),('event.hero.cta','Conoce el encuentro'),('event.hero.back','Volver a eventos'),
 ('event.memory.kicker','Una experiencia compartida'),('event.about.kicker','Sobre el encuentro'),('event.source.memory','Leer noticia institucional'),('event.source.current','Consultar convocatoria'),
 ('event.process.prefix','Explorar'),('event.related','También se vincula con'),('event.notice.link','El enlace de participación se incorporará cuando se publique la convocatoria.'),
 ('event.notice.memory_date','La noticia documenta este encuentro realizado, pero no precisa su fecha exacta. Se muestra por separado la fecha de publicación.'),
 ('event.notice.current_date','La fecha exacta de este encuentro está por confirmar.'),('event.fact.edition','Edición'),('event.fact.process','Proceso'),('event.fact.status','Estado informado'),('event.fact.published','Noticia publicada'),
 ('event.gallery.kicker','Memoria del encuentro'),('event.gallery.title','La comunidad\nen imágenes.'),('event.gallery.body','Una selección del registro fotográfico del encuentro.'),
 ('innovation.detail.explore','Para explorar'),('innovation.state','Estado'),('innovation.challenge','El desafío'),('innovation.intervention','Qué proponemos'),('innovation.application','Dónde se aplica'),('innovation.evidence','Evidencias disponibles'),('innovation.learning','Qué aprendimos'),('innovation.source','Consulta la fuente'),('innovation.cta','Conocer la iniciativa'),
 ('innovation.story.kicker','Formación / Experiencias compartidas'),('innovation.story.body','Experiencias documentadas en el portal y agrupadas según el tema informado en Google Sheets.'),
 ('process.breadcrumb.home','Inicio'),('process.breadcrumb.processes','Procesos'),('process.label.mide','MIDE'),
 ('formation.offer.count_singular','línea.'),('formation.offer.count_plural','líneas.'),
 ('agenda.ui.title','Cronograma de Gestión y Desarrollo Docente'),('agenda.ui.title_prefix','Agenda ·'),
 ('presentation.header','Desarrollo Docente · Modo presentación'),('presentation.back','Volver al portal'),('presentation.title','Presentación del área'),('presentation.exit','Salir'),('presentation.choose','Elegir diapositiva'),('presentation.no_meta','Sin meta publicada'),('presentation.responsible','Responsable:'),('presentation.slide6.cta','Abrir agenda y cronograma completos'),('presentation.slide7.image_alt','Un grupo de participantes conversa alrededor de una mesa en el encuentro docente'),
 ('presentation.slide1.name','El área'),('presentation.slide1.kicker','Dirección de Gestión y Desarrollo Docente'),('presentation.slide1.title','Desarrollo\nDocente.'),('presentation.slide1.body','Una mirada integral al recorrido docente Wiener.'),('presentation.slide1.meta1','05 procesos'),('presentation.slide1.meta2','Planificación del área'),('presentation.slide1.photo','Comunidad docente Wiener'),
 ('presentation.slide2.name','Cinco procesos'),('presentation.slide2.kicker','El mismo nivel de compromiso'),('presentation.slide2.title','Cinco procesos.\nUn recorrido conectado.'),('presentation.slide2.body','Inducción, Formación, Acompañamiento, Evaluación y Reconocimiento articulan el desarrollo docente.'),
 ('presentation.slide3.name','Metas y contribución'),('presentation.slide3.kicker','Contribución de todos los procesos'),('presentation.slide3.title','Metas que orientan\nnuestro trabajo.'),('presentation.slide3.body_prefix','Una selección de las metas del periodo'),('presentation.slide3.body_suffix','Los resultados se consultan cuando están publicados.'),('presentation.slide3.meta','Meta'),('presentation.slide3.pending','Meta pendiente de publicación'),('presentation.slide3.cta','Consultar los indicadores y resultados'),
 ('presentation.slide4.name','Evaluación MIDE'),('presentation.slide4.kicker','Evaluación / Consulta ejecutiva'),('presentation.slide4.title','Comprender\nel desempeño.\nOrientar la mejora.'),('presentation.slide4.body','La Medición Integral de Excelencia Docente reúne cuatro dimensiones de la labor docente.'),('presentation.slide4.cta1','Explorar MIDE'),('presentation.slide4.cta2','Revisar etapas'),
 ('presentation.slide5.name','Innovación'),('presentation.slide5.kicker','Innovación y mejora'),('presentation.slide5.title','Perspectivas que amplían\nla experiencia docente.'),('presentation.slide5.cta','Explorar los enfoques de los cinco procesos'),
 ('presentation.slide5.card1.symbol','IA↗'),('presentation.slide5.card1.kicker','Capacidades'),('presentation.slide5.card1.title','IA, entornos digitales y metodologías activas.'),('presentation.slide5.card1.body','Exploración a través de rutas y módulos de formación.'),
 ('presentation.slide5.card2.symbol','[ • ]'),('presentation.slide5.card2.kicker','Práctica'),('presentation.slide5.card2.title','Observación y retroalimentación personalizada.'),('presentation.slide5.card2.body','Una conversación cercana sobre lo que ocurre en el aula.'),
 ('presentation.slide5.card3.symbol','+↗'),('presentation.slide5.card3.kicker','Evidencias'),('presentation.slide5.card3.title','Un modelo integral del desempeño docente.'),('presentation.slide5.card3.body','Distintas dimensiones para una lectura más completa.'),
 ('presentation.slide6.name','Próximas fechas'),('presentation.slide6.kicker','Agenda del área'),('presentation.slide6.title','Fechas claras.\nAcciones identificadas.'),('presentation.slide6.body','Una vista ejecutiva de las próximas actividades publicadas.'),
 ('presentation.slide7.name','Comunidad'),('presentation.slide7.kicker','Comunidad docente Wiener'),('presentation.slide7.title','El valor\nde encontrarnos.\nY de reconocer.'),('presentation.slide7.body','Cinco procesos al servicio del desarrollo docente y de la mejora de la experiencia educativa.'),('presentation.slide7.cta','Conoce al equipo'),
 ('presentation.prev','Diapositiva anterior'),('presentation.next','Siguiente diapositiva'),('presentation.fullscreen','Pantalla completa'),('presentation.keyboard','Navega con las flechas del teclado'),
 ('404.processes','Explorar procesos')
]
for id_,txt in extra_labels:
    add(id_,'global.labels','global','labels',texto=txt)

# Agenda interaction labels. These are consumed by the client-side component too.
agenda_labels = [
 ('agenda.ui.today','Hoy'),('agenda.ui.current_date_aria','Fecha actual en Lima'),('agenda.ui.filter_aria','Filtrar actividades'),
 ('agenda.ui.search_placeholder','Nombre, responsable o sigla…'),('agenda.ui.view_aria','Presentación de las actividades'),
 ('agenda.ui.view_agenda','Agenda'),('agenda.ui.view_timeline','Cronograma'),('agenda.ui.save_calendar','Guardar calendario'),
 ('agenda.ui.static_prefix','Actividades de'),('agenda.ui.static_all_periods','todos los periodos'),('agenda.ui.static_suffix','Las fechas corresponden a la programación.'),
 ('agenda.ui.process_label','Proceso:'),('agenda.ui.confirm','Por confirmar'),('agenda.ui.close_detail','Cerrar detalle'),
 ('agenda.ui.activity_singular','actividad'),('agenda.ui.activity_plural','actividades'),('agenda.ui.all_processes_lower','todos los procesos'),('agenda.ui.all_periods_lower','todos los periodos'),
 ('agenda.ui.status_future','Por iniciar'),('agenda.ui.status_current','Dentro del plazo'),('agenda.ui.status_past','Plazo finalizado'),
 ('agenda.ui.empty_title','No encontramos actividades con estos filtros'),('agenda.ui.empty_body','Prueba otro periodo, proceso o término de búsqueda.'),
 ('agenda.ui.date_start','Inicia'),('agenda.ui.date_until','Hasta'),('agenda.ui.date_deadline','Plazo hasta'),('agenda.ui.recurrent','Durante el periodo'),
 ('agenda.ui.showing','de'),('agenda.ui.show_all','Ver todas las actividades'),('agenda.ui.timeline.activity','Actividad'),('agenda.ui.timeline.detail','Selecciona para ver el detalle'),
 ('agenda.ui.timeline.programmed','Periodo programado'),('agenda.ui.timeline.start_close','Inicio y cierre programados'),
 ('agenda.ui.timeline.region','Cronograma completo, desplazable horizontalmente'),('agenda.ui.timeline.caption_prefix','Cronograma de'),('agenda.ui.timeline.caption_suffix','Las barras representan fechas programadas. Los nombres permanecen visibles al desplazarse.'),
 ('agenda.ui.timeline.help','Los nombres permanecen a la izquierda. Desplaza el calendario para explorar todas las fechas.'),('agenda.ui.timeline.view_detail','Ver detalle.'),
 ('agenda.ui.period_confirm','Periodo por confirmar'),('agenda.ui.fact.start','Inicio'),('agenda.ui.fact.end','Cierre'),('agenda.ui.fact.owner','Responsable'),('agenda.ui.fact.modality','Modalidad'),
 ('agenda.ui.fact.stage_editorial','Etapa de consulta'),('agenda.ui.fact.stage','Etapa'),('agenda.ui.fact.origin_group','Grupo de origen'),('agenda.ui.fact.execution','Ejecución reportada'),('agenda.ui.fact.source','Fuente'),('agenda.ui.fact.source_missing','No indicada en el registro'),
 ('agenda.ui.link.resource','Abrir recurso'),('agenda.ui.link.source','Consultar fuente'),('agenda.ui.program_action','Para el programa académico'),('agenda.ui.export.selected_singular','actividad seleccionada'),('agenda.ui.export.selected_plural','actividades seleccionadas'),
 ('agenda.ui.export.prepared','Se preparó un calendario con'),('agenda.ui.expand.announcement','Se muestran las'),('agenda.ui.expand.announcement_suffix','actividades de la selección.'),
 ('agenda.ui.ics.process','Proceso'),('agenda.ui.ics.period','Periodo'),('agenda.ui.ics.owner','Responsable'),('agenda.ui.ics.modality','Modalidad'),('agenda.ui.ics.period_missing','No indicado'),
 ('agenda.ui.ics.recurrent','Este evento representa la ventana programada de una actividad recurrente. Las fechas de las sesiones se comunican por separado.'),
 ('agenda.ui.ics.disclaimer','Fechas programadas. El paso del tiempo no confirma la ejecución de la actividad.'),('agenda.ui.ics.calendar_name','Agenda de Desarrollo Docente'),
 ('agenda.phase.1','Aplicación y recolección'),('agenda.phase.2','Reportes e insumos'),('agenda.phase.3','Procesamiento y consolidación'),('agenda.phase.4','Comunicación y resultados')
]
for id_,txt in agenda_labels:
    add(id_,'agenda.ui','agenda','component',texto=txt)

# Date and search taxonomy labels
for id_,txt in [
 ('date.confirm','Fecha por confirmar'),('date.sessions','Sesiones'),('date.date','Fecha'),('date.publication','Publicación'),('date.memory_missing','No consignada en la fuente'),
 ('search.kind.process','Proceso'),('search.kind.activity','Actividad'),('search.kind.event','Evento'),('search.kind.route','Ruta formativa'),('search.kind.resource','Recurso'),
 ('event.breadcrumb.aria','Migas de pan'),('global.brand.alt','Universidad Norbert Wiener'),('global.brand.home_aria','Desarrollo Docente, inicio'),('global.nav.aria','Navegación principal'),('global.nav.mobile_aria','Navegación móvil'),
 ('global.header.search_aria','Buscar en el portal'),('global.header.menu_aria','Abrir menú'),('global.dialog.menu_close','Cerrar menú'),('global.dialog.search_close','Cerrar búsqueda'),
 ('global.intro.aria','Presentación de Desarrollo Docente')
]:
    add(id_,'global.labels','global','labels',texto=txt)

# Global browser titles / institutional labels
for id_,txt in [
 ('global.brand.university','Universidad Norbert Wiener'),
 ('seo.default.title','Desarrollo Docente'),('seo.default.description','Conoce los procesos, las oportunidades y la agenda de Desarrollo Docente de la Universidad Norbert Wiener.'),
 ('seo.home.title','Desarrollo Docente'),('seo.home.description','Impulsamos el talento docente Wiener. Conoce nuestros cinco procesos, recursos y experiencias para seguir creciendo.'),
 ('seo.area.title','Nuestra Dirección'),('seo.processes.title','Nuestros procesos'),('seo.agenda.title','Agenda y eventos'),
 ('seo.resources.title','Recursos institucionales'),('seo.results.title','Metas y resultados'),('seo.innovation.title','Innovación y mejora docente'),
 ('results.empty.title','Metas del Plan de Desarrollo Docente 2026.')
]:
    add(id_,'global.seo','global','seo',texto=txt)

# 404
add('404.kicker','404.copy','404','main',texto='Página no encontrada')
add('404.title','404.copy','404','main',texto='No encontramos esa ruta.')
add('404.body','404.copy','404','main',texto='Puedes volver al inicio o explorar los procesos de Desarrollo Docente.')
add('404.cta','404.copy','404','main','enlace',titulo='Volver al inicio',url='/')

fields=['id','grupo','pagina','seccion','tipo','titulo','texto','url','imagen','imagen_alt','icono','color','orden','visible','estado_publicacion']
os.makedirs(os.path.dirname(out),exist_ok=True)
with open(out,'w',newline='',encoding='utf-8-sig') as f:
    w=csv.DictWriter(f,fieldnames=fields,quoting=csv.QUOTE_ALL)
    w.writeheader(); w.writerows(rows)
print(out, len(rows))
