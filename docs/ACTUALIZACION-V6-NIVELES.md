# Actualización v6 · Resultados por nivel

## Qué cambia
La pestaña `indicadores` incorpora dos columnas editoriales:

- `nivel`: Institucional | Pregrado | Segundas Especialidades | Maestrías
- `visible`: si | no

Los registros antiguos sin esas columnas siguen funcionando como `Institucional` y `visible=si`.

## Actualizar el Apps Script existente
Reemplace en el proyecto de Apps Script los archivos:

- `Code.gs`
- `Schema.gs`
- `Transform.gs`
- `Validation.gs`

Luego ejecute una vez `dgddSetup` / menú **Portal Desarrollo Docente → Preparar integración**.
El setup agrega automáticamente `nivel` y `visible` a la hoja `indicadores` si faltan, sin borrar ni mover datos existentes.

## Cargar resultados
Para un mismo indicador, cree una fila por periodo y nivel.

Ejemplo:
- Evaluación | 2026-I | Institucional | A+B | 55.5 | si
- Evaluación | 2026-I | Pregrado | A+B | ... | si
- Evaluación | 2026-I | Maestrías | A+B | ... | si
- Evaluación | 2026-I | Segundas Especialidades | A+B | ... | no

El selector de nivel solo muestra niveles que tengan filas publicadas y visibles para el proceso.
