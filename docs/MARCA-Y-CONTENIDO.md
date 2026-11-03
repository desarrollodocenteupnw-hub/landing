# Marca, fotografía y contenido

## Alcance de la revisión

La versión **`incluido-v4-gantt-2027`** se apoya en el playbook institucional revisado, el Plan de Desarrollo Docente 2026 **UPNW-GAC-PLA-017, versión 01**, los activos y datos originales y la comunicación de la web institucional. Combina N27 Regular y Medium para la introducción, el hero y los H1 con Hanken Grotesk para la interfaz, los textos y los H2–H4. Las decisiones de contenido y sus referencias están en [CONTENIDO-Y-FUENTES.md](CONTENIDO-Y-FUENTES.md).

El manual aporta las reglas de uso de los logos y su reserva. La evolución aplica la diagonal con remate curvo y el turquesa institucional como recursos de composición. Este documento recoge decisiones de aplicación, sin certificar conformidad visual integral. Los colores auxiliares presentes en el HTML de origen se distinguen de las reglas normativas del playbook.

## Sistema visual y tipográfico

| Elemento | Aplicación |
| --- | --- |
| N27 Regular y Medium | Identidad expresiva en introducción, hero y H1, con aplicaciones puntuales en piezas gráficas y el gran cierre del pie de página. Conservar los archivos originales de pesos 400 y 500; no simular pesos inexistentes. |
| Hanken Grotesk | Texto corriente, descripciones, navegación, metadatos, botones y encabezados H2–H4. La fuente variable permite graduar los pesos de lectura y jerarquía sin sustituir la tipografía de identidad. |
| Turquesa `#07C8CC` | Acento principal, paneles breves, elementos de identidad y acciones destacadas. En superficies turquesa, preferir texto oscuro y verificar el contraste de cada combinación. |
| Blanco y neutros claros | Base predominante de la página. Dar profundidad mediante composición, espacios, divisores y cambios sutiles de superficie. |
| Texto oscuro | Lectura y jerarquía. Evitar que el turquesa claro sea el único recurso para textos pequeños o estados importantes. |
| Dorado `#FAC93D` | Acento reducido para detalles que lo justifiquen; no convertirlo en un segundo color dominante. |
| Azul `#00669E` y gris `#D2D3D5` | Colores presentes en el HTML de origen. Su existencia no obliga a usarlos como fondo principal ni como códigos exclusivos de un proceso. |
| Geometría | Diagonal con remate curvo, aplicada en la portada, la introducción y las escenas de los procesos. Conservar esa lógica al crear nuevas piezas y transiciones. |

Las dos familias están autoalojadas en `public/fonts/`. N27 utiliza `n27-regular.woff2` y `n27-medium.woff2`; Hanken Grotesk utiliza `hanken-grotesk-latin-variable.woff2` y `hanken-grotesk-latin-ext-variable.woff2`. Su licencia SIL Open Font License se conserva en `public/fonts/OFL-HankenGrotesk.txt`. La carga tipográfica del portal no depende de una solicitud a Google Fonts. Esta elección combinada responde a la petición actual del usuario y no se presenta como una sustitución de N27 en el manual institucional.

Mantener fondos claros y una presencia consistente del turquesa. Evitar azul oscuro como estética base y degradados multicolores. Los cinco procesos deben tener una estructura y un tratamiento visual de igual jerarquía; la mayor profundidad de Evaluación responde a sus necesidades de consulta y a la información disponible, sin convertir su color o tamaño en una escala de valor institucional.

### Logos y activos existentes

Los archivos `wiener-dark.png`, `wiener-light.png` y `wiener-light-footer.png` se conservan intactos. Elegir la versión con contraste suficiente para cada fondo y mantener su relación de aspecto. No estirar, reconstruir, recolorear, inclinar, separar ni animar las piezas del logo oficial.

El playbook revisado establece un **ancho mínimo digital de 140 px para el logo simple** y de **200 px para la versión con tagline**. La zona de reserva es de **un módulo del isotipo** alrededor del logo; debe medirse con esa referencia gráfica, no reemplazarse por una cantidad arbitraria de píxeles. Estas reglas se aplican también al revisar la cabecera, el pie de página, la introducción y el modo presentación en pantallas pequeñas.

El archivo `campus.jpg` ya incorpora un tratamiento cromático turquesa y azul. Puede funcionar como recurso secundario, pero no se recomienda convertirlo en el fondo dominante del portal. Las fotografías de comunidad ofrecen un punto de entrada más concreto al trabajo del área.

El activo `qs-stars.png` se conserva como archivo de origen. No se usa para afirmar una acreditación o calificación vigente, porque su actualidad no fue verificada. `avanza.png` se conserva sin reconstruir sus letras ni convertir su presencia en autorización para redactar nuevos eslóganes.

## Fotografía real seleccionada

El portal incorpora **ocho fotografías optimizadas**: cuatro seleccionadas del álbum original y cuatro tomadas de las noticias oficiales. Cada grupo mantiene su procedencia y su registro de tratamiento.

La portada **«Impulsamos el talento docente»** utiliza `public/assets/gala-dialogo.webp`, mediante `portada_foto_id = 1ehOjGeOw7WXfxwXa-GFL1bwDLjDvzDoC`. El archivo `gala-hero.webp` conserva su nombre histórico y permanece disponible en la galería; ya no identifica la selección actual de portada.

### Cuatro fotografías del álbum original

Se revisaron visualmente once candidatas del álbum original y se seleccionaron cuatro. Todas pertenecen a la galería etiquetada **Gala de Reconocimiento Docente 2026-I** en los datos recibidos. El registro de evento `EV-01` indica el **14 de octubre de 2026**. La edición del reconocimiento y su fecha de realización se mantienen como dos datos distintos.

Álbum enlazado en la fuente original: [Gala de Reconocimiento Docente](https://drive.google.com/drive/folders/1xxcYUpm2xL3FlDj3kfTql61gpgRfsdLw).

Las fotografías se obtuvieron mediante los enlaces públicos de imagen asociados con los mismos IDs de Drive. No se requirió una sesión ni se asumió acceso a otros archivos. No se identificó por nombre a las personas fotografiadas ni se dedujeron sus cargos, premios o resultados.

### Manifiesto del álbum

| Archivo local | Original y orden de galería | Dimensiones | Peso | ID de Drive |
| --- | --- | --- | --- | --- |
| `public/assets/gala-hero.webp` | `20261014_110014.jpg`, orden 17 | 1200 × 1600 | 212 296 bytes, 207 KiB | `10SI936y_Dz1zl8xIQlWf7_A5kqK1dbqb` |
| `public/assets/gala-dialogo.webp` | `20261014_111847.jpg`, orden 41 | 1200 × 1600 | 222 238 bytes, 217 KiB | `1ehOjGeOw7WXfxwXa-GFL1bwDLjDvzDoC` |
| `public/assets/gala-auditorio.webp` | `20261014_100216.jpg`, orden 9 | 1600 × 901 | 123 316 bytes, 120 KiB | `1S3LWTPDg99rcVfesSWln1b2-DY8E36Kv` |
| `public/assets/gala-comunidad.webp` | `IMG-20261014-WA0032.jpg`, orden 61 | 1600 × 1200 | 158 976 bytes, 155 KiB | `1ZLN3uub_YjK8ScQOzD-qSw2bW8sVYSGH` |

Los cuatro archivos suman 716 826 bytes, aproximadamente 700 KiB. En la página, priorizar la fotografía principal y cargar las imágenes situadas más abajo de forma diferida.

Enlaces exactos utilizados para obtener las imágenes:

- [Participante trabajando con piezas](https://lh3.googleusercontent.com/d/10SI936y_Dz1zl8xIQlWf7_A5kqK1dbqb=w1200).
- [Diálogo, fotografía de portada actual](https://lh3.googleusercontent.com/d/1ehOjGeOw7WXfxwXa-GFL1bwDLjDvzDoC=w1200).
- [Auditorio, vista general](https://lh3.googleusercontent.com/d/1S3LWTPDg99rcVfesSWln1b2-DY8E36Kv=w1600).
- [Comunidad, participantes alrededor de una mesa](https://lh3.googleusercontent.com/d/1ZLN3uub_YjK8ScQOzD-qSw2bW8sVYSGH=w1600).

### Texto alternativo y encuadre

Los valores de `object-position` son puntos de partida para el diseño responsivo, no una instrucción de recorte del archivo original. Verificar cada contenedor en móvil y escritorio.

| Imagen | Texto alternativo propuesto | Encuadre y foco |
| --- | --- | --- |
| Actividad con piezas (`gala-hero.webp`) | Un participante trabaja con piezas de colores durante una actividad de la gala de reconocimiento docente. | Vertical 3:4 o 4:5. `object-position: 50% 50%`. Rostro aproximadamente en 52% / 40%; manos y piezas cerca de 44% / 61%. En formato cuadrado puede ayudar `50% 60%`. Conservar juntos rostro, manos y actividad. |
| Diálogo · portada actual | Dos participantes comparten una actividad con piezas de colores sobre una mesa. | Vertical 3:4 o 4:5. `object-position: 45% 55%`. Rostros aproximadamente en 22% / 45% y 51% / 45%. No recortar el rostro situado a la izquierda. |
| Auditorio | Vista del auditorio con participantes distribuidos en mesas durante la gala de reconocimiento docente. | Horizontal próximo a 16:9. `object-position: 50% 55%`. Las personas se distribuyen por la mitad inferior; evitar una franja tan baja que deje visible principalmente el techo. |
| Comunidad | Participantes de la gala de reconocimiento docente sentados alrededor de una mesa. | Horizontal 4:3 preferente. En 3:2 o 16:9, probar `object-position: 50% 60%`. Mantener las personas de ambos extremos y evitar recortes cuadrados del grupo completo. |

Si una foto se acompaña de un pie, usar una descripción factual o el nombre del evento y la fecha documentada. No presentar la foto como evidencia de una mejora medible, de un premio individual, de satisfacción o de un resultado pedagógico que la fuente no proporciona.

### Procesamiento aplicado al álbum

Se aplicó orientación EXIF y conversión a RGB antes de comprimir a WebP, calidad 86 y método 6. Se preservó la composición completa. No se retocaron rostros, no se añadieron personas u objetos, no se cambiaron colores y no se aplicaron filtros ni imágenes generadas. Los archivos descargados de origen se utilizaron únicamente para producir los activos optimizados.

### Cuatro fotografías de noticias oficiales

Las imágenes se sirven desde `public/assets/eventos/`. El manifiesto [activos-eventos.json](activos-eventos.json) conserva para cada una la URL de la imagen original, la noticia de procedencia, el evento asociado, las dimensiones, los pesos, el texto alternativo y el encuadre sugerido. Se convirtieron a WebP con calidad 88, conservando la composición y las dimensiones completas, sin retoque ni cambios de personas.

| Archivo | Evento asociado | Dimensiones | Texto alternativo |
| --- | --- | --- | --- |
| `conectados-excelencia-2026.webp` | `EV-01` · Conectados con la Excelencia | 1000 × 550 | Docentes reconocidos posan con sus diplomas en el encuentro Conectados con la Excelencia. |
| `conectados-rector-2025.webp` | `EV-04` · Conectados con el Rector | 1001 × 551 | Participantes del encuentro Conectados con el Rector reunidos en el auditorio de la universidad. |
| `buenas-practicas-ia-2025.webp` | `EV-05` · II Jornada de Buenas Prácticas Docentes | 1000 × 550 | Presentación de una experiencia de inteligencia artificial durante la II Jornada de Buenas Prácticas Docentes. |
| `buenas-practicas-2024.webp` | `EV-07` · Jornada de Buenas Prácticas Docentes | 1772 × 1235 | Participantes de la Jornada de Buenas Prácticas Docentes reunidos en el auditorio de la universidad. |

El encuadre sugerido es `50% 50%` para las tres primeras y `50% 100%` para la jornada de 2024. Revisarlo en cada contenedor para preservar rostros y contexto. InnovaIA dispone de una ficha propia; la imagen de la jornada presencial de 2024 no se atribuye al ciclo virtual por compartir noticia.

## Noticias y memorias del área

Las **cuatro noticias institucionales documentan cinco experiencias realizadas**. Junto con el congreso programado (`EV-02`) y la gala futura por confirmar (`EV-03`), procedentes de la planificación original, completan las siete fichas de eventos. Solo esos dos registros futuros carecen todavía de URL externa.

| Ficha | Publicación de la noticia | Realización documentada | Edición o periodo reconocido | Proceso |
| --- | --- | --- | --- | --- |
| `EV-01` · [Conectados con la Excelencia](https://www.uwiener.edu.pe/noticias/docentes-destacados-de-la-universidad-norbert-wiener-recibieron-reconocimiento-por-su-excelente-labor-en-el-periodo-academico-2026-i/) | 14 de octubre de 2026 | 14 de octubre de 2026 según el registro original recibido; la noticia no explicita el día de realización | Reconoce el periodo 2026-I | Reconocimiento, relacionado con Evaluación |
| `EV-04` · [Conectados con el Rector](https://www.uwiener.edu.pe/noticias/docentes-de-la-universidad-norbert-wiener-recibieron-el-reconocimiento-a-su-labor-en-encuentro-de-confraternidad-con-el-rector/) | 31 de octubre de 2025 | Fecha de evento no informada | Reconoce el periodo 2025-I | Reconocimiento, relacionado con Evaluación |
| `EV-05` · [II Jornada de Buenas Prácticas Docentes](https://www.uwiener.edu.pe/noticias/aplicacion-de-la-ia-en-la-ensenanza-universitaria-fue-el-tema-de-la-segunda-jornada-de-buenas-practicas-docentes-organizado-por-la-universidad-norbert-wiener/) | 23 de diciembre de 2025 | Fecha de evento no informada | Segunda edición; tema: IA en la enseñanza | Formación, con contenido de innovación |
| `EV-06` · [InnovaIA: ciclo de formación 2024](https://www.uwiener.edu.pe/noticias/docentes-de-la-universidad-norbert-wiener-participaron-en-jornadas-de-capacitacion/) | 17 de diciembre de 2024 | Tres sesiones: 9, 14 y 17 de octubre de 2024 | Ciclo 2024 | Formación, con contenido de innovación |
| `EV-07` · [Jornada de Buenas Prácticas Docentes](https://www.uwiener.edu.pe/noticias/docentes-de-la-universidad-norbert-wiener-participaron-en-jornadas-de-capacitacion/) | 17 de diciembre de 2024 | Fecha de evento no informada | 2024; la fuente no la numera como primera edición | Formación, con contenido de innovación |

`fecha_publicacion` identifica la noticia; `inicio` y `fin` describen la realización cuando se conoce; `fecha_texto` permite comunicar las tres sesiones de InnovaIA sin presentar el intervalo como actividad continua. La edición o periodo reconocido se conserva por separado. La memoria de un encuentro realizado puede publicarse sin una fecha exacta de evento si su fuente confirma que ocurrió.

La noticia de Conectados con la Excelencia informa **52 docentes reconocidos: 46 de pregrado y 6 de posgrado**, por alcanzar la escala A en la evaluación del periodo 2026-I. Esta cifra describe a quienes recibieron el reconocimiento; no representa la asistencia total ni reemplaza los resultados de los indicadores del portal. Las otras noticias tampoco justifican completar cifras de asistencia o resultados pedagógicos que no proporcionan.

Inicio sitúa **Memoria del área** inmediatamente después del explorador de procesos. Las jornadas y el ciclo documentados permanecen en Formación; Innovación los agrupa en muestras de IA y buenas prácticas, enlazando a las mismas fichas. Evaluación enlaza a los reconocimientos relacionados con sus resultados. Estas fuentes evidencian Formación, Evaluación y Reconocimiento. La igualdad de valor de los cinco procesos se mantiene mediante la estructura, la navegación y la presentación común, sin reclasificar noticias como Inducción o Acompañamiento.

Las nueve metas siguen sin resultados informados. La evidencia de que una actividad se realizó permite enriquecer su memoria, pero no permite afirmar por sí sola mejoras medibles, satisfacción, cobertura o impacto educativo.

## Movimiento y respuesta de la interfaz

La sensación de cuidado debe provenir de la composición y de las respuestas claras a las acciones. El movimiento acompaña esa lectura.

- Introducción con una **secuencia principal de 2,65 segundos** y una breve transición de salida; puede omitirse y repetirse. La reproducción automática se limita a una vez por sesión.
- Explorador de cinco procesos con pestañas identificadas, estado seleccionado y navegación mediante flechas, Inicio y Fin. Mantener el foco visible cuando cambia la vista.
- Entrada tipográfica, geometría diagonal con remate curvo y revelado de contenidos al desplazarse. La sección MIDE representa sus cuatro dimensiones mediante una composición diagramática. Mantener el logo oficial completo y sin animar sus piezas.
- Sin audio automático, desplazamiento de página controlado por animación, parallax intenso ni bucles decorativos permanentes.
- Sin contadores animados que sugieran ejecución o progreso inexistente. Mostrar inmediatamente el valor real y su contexto.
- Respetar `prefers-reduced-motion: reduce`: contenido visible desde el inicio, desplazamiento instantáneo y eliminación de animaciones decorativas. Ninguna información depende de terminar una animación.

## Criterios editoriales

1. Presentar el área y sus cinco procesos con descripciones claras, una estructura común y acciones equivalentes. La cantidad de registros no determina la importancia visual de un proceso.
2. Mantener Evaluación fácil de localizar y con el detalle requerido por las autoridades. Usar la denominación **Medición Integral de Excelencia Docente (MIDE)** y vincular sus resultados y fechas con la fuente, el periodo y la fecha de corte correspondientes.
3. Separar fecha programada, fecha de realización, fecha de publicación de la noticia, edición o periodo reconocido y estado de ejecución. Una actividad cuya fecha terminó no pasa automáticamente a “Realizada”, y la fecha de una noticia no se convierte en fecha de evento.
4. No redactar eslóganes institucionales, resultados, testimonios, porcentajes o premios que no estén respaldados por los datos recibidos.
5. Distinguir “sin información publicada” de cero, “por confirmar” de cancelado y “en agenda” de ejecutado.
6. Las fotografías son parte de la memoria del área. Acompañan el contenido sin adjudicar a las personas identidades, cargos o resultados no documentados.
7. Conservar las precisiones del plan: Inducción incluye nuevos y reingresantes; su meta de satisfacción es 95 % de satisfechos o muy satisfechos. El alcance de Acompañamiento y las condiciones de insignia o certificado se explican en el detalle de sus procesos, según [Contenido y fuentes](CONTENIDO-Y-FUENTES.md).


### Agenda en esta versión

Los fondos salvia se sustituyeron por blanco y neutros. Las barras comparten tinta institucional; el turquesa identifica acciones y el día actual. Los estados conservan etiquetas explícitas y tratamientos diferenciados de opacidad y fondo. No se cambiaron fechas, cálculos ni interacciones del cronograma.
