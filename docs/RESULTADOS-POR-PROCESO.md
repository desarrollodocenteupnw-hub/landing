# Resultados por proceso y nivel

La sección `Resultados` de cada proceso se alimenta exclusivamente de la pestaña `indicadores` de Google Sheets.

## Nivel académico
Cada fila de `indicadores` incluye:
- `nivel`: Institucional, Pregrado, Segundas Especialidades o Maestrías.
- `visible`: `si` o `no`.

El selector de nivel solo muestra los niveles que tienen al menos una fila `publicado` y `visible=si` para ese proceso. Si solo existe un nivel activo, el selector se oculta para no añadir ruido visual.

Los registros antiguos sin `nivel` se interpretan como `Institucional` y los registros sin `visible` se interpretan como `si`, por compatibilidad.

## Periodo
El selector de periodo se adapta al nivel seleccionado y solo ofrece los periodos existentes para ese nivel. El portal no necesita cambios de HTML cuando se incorpora un periodo nuevo.

## Histórico
Para que un indicador muestre tendencia, se registra una fila por periodo y nivel repitiendo exactamente el mismo texto en `indicador` y cambiando `periodo`, `valor`, `fecha_corte` y `fuente`.

Ejemplo conceptual:
- 2025-I · Pregrado · Docentes en escalas A y B de la dimensión docencia · 34.4
- 2025-II · Pregrado · mismo indicador · 46.7
- 2026-I · Pregrado · mismo indicador · 55.5
- 2026-II · Pregrado · mismo indicador · valor vacío mientras el periodo no cierre

El portal:
- muestra meta y resultado del periodo seleccionado;
- si el periodo está pendiente, muestra el último resultado publicado como referencia;
- dibuja la tendencia hasta el periodo seleccionado cuando existen al menos dos resultados;
- calcula la variación contra el periodo anterior publicado;
- calcula el avance sobre la meta;
- no inventa valores para periodos pendientes.

## Activar u ocultar niveles
No se configura en HTML.

- Para mostrar un nivel, publique al menos una fila de ese nivel con `visible=si`.
- Para ocultar una fila puntual, use `visible=no`.
- Si todas las filas de un nivel quedan en `visible=no`, ese nivel desaparece del selector.
- `estado_publicacion=borrador` permite preparar resultados sin mostrarlos.

## Accesos rápidos
Las tarjetas de acceso rápido de cada proceso solo se renderizan si la fila correspondiente de `contenido` tiene un `url` válido (ancla `#...`, ruta `/...` o URL `https://...`). Si el campo `url` está vacío, la tarjeta no aparece.
