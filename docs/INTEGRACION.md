# Integración editorial: Google Sheets, Apps Script y Netlify

El equipo administra el portal desde las pestañas editoriales de Google Sheets, incluida `contenido`, que funciona como CMS para textos, botones, imágenes, enlaces, orden y visibilidad. Una publicación validada genera un archivo JSON con una versión única en Drive. Netlify descarga esa versión durante el build y construye el sitio estático. Las visitas al portal leen el sitio publicado; no necesitan acceso al archivo de Sheets ni ejecutan Apps Script.

**No es necesario editar HTML para cambios editoriales.** El HTML/Astro conserva la estructura visual; Sheets controla el contenido que se publica.

La integración está implementada y contiene una publicación inicial utilizable. La conexión con las cuentas institucionales requiere configurar sus valores reales siguiendo esta guía. No se han incluido credenciales ni se ha efectuado un despliegue externo.

## 1. Contenido entregado

`src/content/original.json` conserva la extracción del archivo recibido. `src/content/site.json` incorpora identificadores estables, las fases editoriales de Evaluación y metadatos de publicación, conservando todos los campos y registros originales.

| Contenido | Cantidad inicial | Tratamiento |
|---|---:|---|
| Procesos institucionales | 5 | Misma jerarquía: Inducción, Formación, Acompañamiento, Evaluación y Reconocimiento |
| Actividades | 72 | Se conservan ambos periodos y los detalles originales |
| Actividades de Evaluación | 51 | Clasificadas en cuatro fases para facilitar su lectura |
| Indicadores | 9 | Se conservan sus metas; los nueve resultados siguen vacíos |
| Módulos de formación | 32 | Ocho rutas con cuatro módulos cada una |
| Eventos | 3 | Se mantienen estados y fechas originales, incluida la fecha por confirmar |
| Fotografías | 94 | Se conservan los identificadores de Drive y su relación con el evento |
| Documentos | 3 | Sus enlaces ausentes se conservan vacíos |
| Integrantes del equipo | 2 | Se conserva la información recibida |
| Iniciativas de innovación | 0 | Estructura preparada; requiere casos y evidencias reales |

La meta de Carrera docente se conserva como indicador transversal. No crea un sexto proceso institucional. Los textos de beneficio y público de cada proceso son una propuesta editorial derivada de sus descripciones, revisable en Sheets.

## 2. Poner en marcha Google Sheets

1. Cree un archivo institucional de Google Sheets.
2. Importe todos los CSV de `docs/sheets/` como pestañas separadas, conservando exactamente sus nombres y encabezados. En la importación, desactive la conversión automática de texto a números, fechas y fórmulas para conservar identificadores como `01`. Los números se normalizan al publicar. Si una celda ya es una fecha de Sheets, el script también la convierte correctamente.
3. Revise `docs/sheets/README.md`: explica los campos, las relaciones y los estados de publicación. Mantenga los resultados desconocidos vacíos.
4. Abra **Extensiones → Apps Script** desde ese archivo.
5. Copie los cuatro archivos `apps-script/Code.gs`, `Schema.gs`, `Transform.gs` y `Validation.gs` al mismo proyecto. Elimine el contenido de ejemplo que pueda duplicar funciones.
6. En la configuración del proyecto, muestre el archivo de manifiesto y copie `apps-script/appsscript.json` en `appsscript.json`.
7. Guarde el proyecto y ejecute `dgddSetup` con la cuenta institucional responsable. Autorice los servicios solicitados para leer Sheets, guardar publicaciones en Drive y enviar la solicitud a Netlify.
8. Recargue Sheets. Aparecerá el menú **Portal Desarrollo Docente**. Ejecute **Validar contenido** y resuelva los errores que aparezcan.

`dgddSetup` registra el ID del archivo, fija la zona horaria `America/Lima`, crea una carpeta privada de publicaciones y genera un token de lectura aleatorio. También prepara las pestañas ausentes y los desplegables de publicación. No reemplaza filas existentes ni solicita un build.

Para regenerar las plantillas desde el snapshot local:

```sh
node scripts/seed-sheets.mjs
```

Para generarlas en otra carpeta:

```sh
node scripts/seed-sheets.mjs --out /ruta/de/salida
```

La opción `--initialize --version incluido-v2` vuelve a generar `site.json` desde el archivo original. Está destinada a la preparación inicial: no debe utilizarse para sincronizar cambios posteriores de Sheets porque sustituye el snapshot local por el contenido original.

## 3. Publicar el servicio de Apps Script

En Apps Script, cree una implementación de tipo **Aplicación web** que se ejecute como la cuenta que la implementa. El servicio debe poder atender peticiones sin una sesión interactiva de Google; el manifiesto usa `ANYONE_ANONYMOUS` y `USER_DEPLOYING`. La política del dominio debe permitir esta modalidad. Si la organización la restringe, se necesita acordar otro mecanismo de autenticación antes de activar la conexión; no basta con una URL que devuelve una pantalla de acceso.

El endpoint exige además el token privado generado por el proyecto. La hoja y la carpeta de publicaciones no necesitan compartirse públicamente. Copie la URL real terminada en `/exec`; la URL de prueba `/dev` no sirve para esta integración.

En **Configuración del proyecto → Propiedades del script**, encontrará:

| Propiedad | Origen y finalidad |
|---|---|
| `DGDD_SPREADSHEET_ID` | La establece `dgddSetup`; identifica la hoja editorial |
| `DGDD_PUBLICATIONS_FOLDER_ID` | La establece `dgddSetup`; carpeta de versiones JSON |
| `DGDD_CONTENT_READ_TOKEN` | Token generado; se copia a una variable privada de Netlify |
| `NETLIFY_BUILD_HOOK_URL` | Añadir la URL real del build hook de este sitio |
| `DGDD_LATEST_PUBLICATION` | La administra el publicador; referencia de la última versión editorial |
| `DGDD_LAST_BUILD_REQUEST` | La administra el publicador; último resultado de la solicitud de build |

No coloque estos valores en celdas de Sheets ni en archivos públicos. Quienes editan el proyecto de Apps Script pueden acceder a sus propiedades; limite esa edición al equipo que administra la publicación.

## 4. Conectar Netlify

El proyecto incluye `netlify.toml` con `npm run build`, salida `dist` y Node 24. El script de build ejecuta la sincronización antes de generar el sitio. La sincronización ya realiza la validación completa, por lo que no requiere otro servicio o biblioteca.

Configure estas variables en el entorno de build de Netlify:

| Variable | Valor |
|---|---|
| `APPS_SCRIPT_CONTENT_URL` | URL real `/exec` de la aplicación web |
| `APPS_SCRIPT_CONTENT_TOKEN` | El mismo valor de `DGDD_CONTENT_READ_TOKEN`; tratar como secreto privado de build |
| `CONTENT_VERSION` | Opcional. Dejar sin configurar para publicación habitual; permite fijar una versión concreta en un build manual |

El código no usa variables con prefijo `PUBLIC_` ni incorpora el token al navegador. No copie las variables a `src/` ni a HTML.

Cree un build hook en la configuración de Netlify para la rama de publicación. Copie su URL real a `NETLIFY_BUILD_HOOK_URL` en las propiedades de Apps Script. El hook recibe un cuerpo JSON con la versión exacta que debe construir:

```json
{"version":"identificador-de-la-publicacion"}
```

Netlify proporciona ese cuerpo como `INCOMING_HOOK_BODY`. El sincronizador admite tanto JSON como su representación URL-encoded, descrita por Netlify. Si `CONTENT_VERSION` y el hook solicitan versiones distintas, el build falla para evitar una publicación ambigua. Por ello, no deje una versión manual fijada cuando reactive las publicaciones habituales.

## 5. Flujo de publicación

1. El editor completa y revisa los contenidos en Sheets.
2. Marca como `publicado` las filas que deben aparecer. `borrador` y `archivado` quedan fuera del JSON.
3. Ejecuta **Validar contenido**. Esta operación informa de errores y avisos; no publica.
4. Ejecuta **Publicar y solicitar actualización**. El script vuelve a leer y validar todas las pestañas editoriales y genera una versión única.
5. Guarda `dgdd-VERSION.json` en Drive. Una versión existente no se sobrescribe.
6. Envía esa versión al build hook. El menú informa si la solicitud fue aceptada, rechazada, tuvo un error de conexión o todavía no hay hook configurado.
7. Netlify descarga el JSON de esa versión, valida sus campos y comprueba la coincidencia exacta de `meta.version`.
8. Si todo es válido, se escribe el snapshot local de manera atómica y se construye el sitio. La publicación efectiva debe comprobarse en **Deploys** de Netlify.

**Una solicitud aceptada no confirma el despliegue.** El script no consulta el resultado final de Netlify ni declara el sitio actualizado. Una publicación editorial puede existir en Drive aunque su build todavía no se haya ejecutado o haya fallado.

Si la conexión está configurada y falla, el build termina con error. No utiliza silenciosamente el snapshot incluido. Así, un problema de acceso, datos o versión no se presenta como una actualización correcta. El sitio ya publicado conserva su despliegue anterior mientras no se complete otro despliegue válido.

Sin `APPS_SCRIPT_CONTENT_URL` ni token configurados, el build valida y usa `src/content/site.json`. Esto permite revisar y desplegar el contenido inicial antes de conectar Sheets. Un token sin URL se considera una configuración incompleta y detiene el build.

## 6. Fechas, resultados y ejecución

El contrato separa tres conceptos:

| Campo | Qué significa |
|---|---|
| `meta.generatedAt` | Momento UTC en que se generó este JSON |
| `meta.sourceUpdatedAt` | Última modificación registrada del archivo de Sheets, obtenida de Drive; `null` si no consta. No es una fecha de corte de resultados |
| `kpis[].fecha_corte` | Fecha hasta la que se midió el resultado de ese indicador |

Las fechas editoriales usan `AAAA-MM-DD` y la zona operativa es `America/Lima`. Los campos `inicio` y `fin` describen la programación. Que una fecha final ya haya pasado no significa que la actividad se haya ejecutado.

`estado_ejecucion` empieza vacío: ejecución no informada. Los valores permitidos son `pendiente`, `en_ejecucion`, `completada` y `pausada`. Una actividad marcada `completada` exige `fecha_cumplimiento`; una fecha de cumplimiento exige ese estado. No se publica un porcentaje de avance calculado a partir del paso del tiempo.

Un resultado vacío sigue siendo ausencia de resultado. Un cero es un resultado informado y exige `fecha_corte` y `fuente`, igual que cualquier otro valor. Los porcentajes se escriben como números entre 0 y 100, con `%` en `unidad`.

Las cuatro fases de Evaluación son `aplicacion`, `reportes`, `procesamiento` y `resultados`. La importación inicial las clasificó a partir del tipo y título originales; después deben editarse explícitamente. Cambiar una fase no cambia fechas, metas ni ejecución.

## 7. Recuperación y mantenimiento

Para reintentar un build o reconstruir una publicación anterior, use **Solicitar build de una versión** e indique el identificador guardado. El script verifica que exista y que su contenido sea válido antes de enviar la solicitud. Esta operación no cambia la referencia de última publicación editorial: un build posterior sin versión volverá a pedir la última publicación. Para fijar temporalmente una versión en builds manuales puede usarse `CONTENT_VERSION`, retirándolo antes de volver al flujo habitual.

No edite, duplique ni elimine los JSON de la carpeta de publicaciones si deben seguir disponibles para reconstrucciones. El código rechaza nombres duplicados y versiones internas que no coinciden con el nombre solicitado. La inmutabilidad está implementada en el publicador; las personas con permisos de edición de Drive deben respetar esa política.

Si cambia el código de Apps Script o su contrato, actualice también la implementación web a una nueva versión. Guardar cambios en el editor no garantiza que la URL `/exec` ejecute el código nuevo. Mantenga `Schema.gs`, `Transform.gs` y `Validation.gs` iguales en el proyecto y en Apps Script para que ambos validen las mismas reglas.

Las fotografías conservan sus referencias originales. Su visualización pública depende de los permisos y de la disponibilidad de los archivos de imagen, que son independientes del acceso privado a las publicaciones JSON. Los avisos por enlaces vacíos son información editorial pendiente, no botones que deban inventarse.

## 8. Contrato técnico y comprobaciones

El endpoint admite `GET` con `action=content` o `action=manifest`, `token` y una `version` opcional. Si no se especifica versión, selecciona una referencia estable a la última publicación. Siempre lee un archivo JSON ya guardado en Drive; no reconstruye la hoja en cada petición. `POST` devuelve un error de endpoint de solo lectura. La publicación se realiza desde el menú autenticado de Sheets.

Los errores del servicio son JSON, por ejemplo `{"error":{"code":"UNAUTHORIZED"}}`. El sincronizador los trata como fallo incluso si Content Service entrega HTTP 200. Códigos previstos: `NOT_CONFIGURED`, `UNAUTHORIZED`, `UNKNOWN_ACTION`, `INVALID_VERSION`, `NOT_FOUND`, `DUPLICATE_VERSION`, `SNAPSHOT_INVALID`, `READ_ERROR` y `READ_ONLY_ENDPOINT`.

El JSON conserva las colecciones `config`, `periodos`, `ejes`, `actividades`, `eventos`, `kpis`, `formacion`, `documentos`, `equipo`, `galeria`, `iniciativas` y `contenido`; además incluye `meta`:

```json
{
  "schemaVersion": 2,
  "version": "identificador-de-la-publicacion",
  "generatedAt": "AAAA-MM-DDTHH:mm:ss.sssZ",
  "sourceUpdatedAt": null,
  "timeZone": "America/Lima",
  "source": "google_sheets"
}
```

El fragmento anterior describe los campos de `meta`; las marcas temporales reales se generan automáticamente. La versión es ASCII, comienza con letra o número y solo permite letras, números, punto, guion y guion bajo, con un máximo de 96 caracteres. El endpoint tiene un límite de descarga de 5 MiB y una espera máxima de 45 segundos en el build.

Comandos de comprobación local:

```sh
node scripts/validate-content.mjs
node scripts/validate-content.mjs --expected-version incluido-v2
node scripts/sync-content.mjs
node apps-script/tests/content.test.mjs
```

Las pruebas verifican conservación de los datos, reconstrucción desde las hojas, fechas reales, referencias, estados, metas y resultados, versiones exactas, lectura de Drive, autenticación y fallo del build sin sustitución silenciosa. Usan dobles de los servicios: no despliegan ni acceden a cuentas externas. La comprobación con las cuentas reales se completa después de configurar el servicio y observar un build exitoso de esa versión en Netlify.

### Referencias oficiales

- [Aplicaciones web de Apps Script](https://developers.google.com/apps-script/guides/web): implementación, `doGet`, `doPost` y parámetros.
- [Content Service](https://developers.google.com/apps-script/guides/content): respuestas JSON del servicio.
- [Manifiesto de aplicaciones web](https://developers.google.com/apps-script/manifest/web-app-api-executable): acceso y cuenta de ejecución.
- [Build hooks de Netlify](https://docs.netlify.com/build/configure-builds/build-hooks/): solicitud de builds y `INCOMING_HOOK_BODY`.
