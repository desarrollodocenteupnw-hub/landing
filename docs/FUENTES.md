# Sistema tipográfico del portal

## Familias y funciones

El portal combina dos familias con funciones distintas:

| Familia | Aplicación | Pesos utilizados |
| --- | --- | --- |
| **N27** | Introducción, título principal de la portada, encabezados H1 de páginas y piezas de expresión gráfica. | Regular 400 y Medium 500, según los archivos originales. |
| **Hanken Grotesk** | Texto, navegación, formularios, botones, metadatos y encabezados funcionales. | 400 para lectura, 600 para navegación y etiquetas, 700 para énfasis y enlaces, 800 para acciones principales y 900 para titulares funcionales. |

Las variables `--font-ui` y `--font-display`, declaradas en `src/styles/global.css`, permiten mantener esta separación. Los componentes pueden aplicarlas sin volver a escribir la pila de fuentes.

N27 Medium se declara únicamente como peso 500. El archivo es estático; no contiene los pesos 600–900. Hanken Grotesk sí es variable y dispone de un eje real `wght` de 100 a 900.

## Archivos incluidos

- `public/fonts/n27-regular.woff2`: archivo original del portal, peso 400.
- `public/fonts/n27-medium.woff2`: archivo original del portal, peso 500.
- `public/fonts/hanken-grotesk-latin-variable.woff2`: subconjunto latino de Hanken Grotesk, 34 704 bytes. Incluye los caracteres del español.
- `public/fonts/hanken-grotesk-latin-ext-variable.woff2`: subconjunto latino extendido, 19 588 bytes.
- `public/fonts/OFL-HankenGrotesk.txt`: licencia íntegra y atribución de Hanken Grotesk.

Las fuentes se sirven desde el propio sitio. No hay solicitudes a Google Fonts durante la navegación. Se precargan Hanken Grotesk latino y N27 Medium; el subconjunto latino extendido y N27 Regular se solicitan cuando el texto los necesita. La vista previa autónoma incorpora los archivos tipográficos y conserva la licencia de Hanken Grotesk.

## Origen de Hanken Grotesk

La familia se identificó en la hoja de estilos de la web institucional. Los archivos incluidos se descargaron de los proveedores oficiales, sin modificar sus contornos ni sus tablas:

- [Hoja de Google Fonts observada](https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;600;700;900&display=swap).
- [WOFF2 latino de Google Fonts](https://fonts.gstatic.com/s/hankengrotesk/v12/ieVn2YZDLWuGJpnzaiwFXS9tYtpd59A.woff2).
- [WOFF2 latino extendido de Google Fonts](https://fonts.gstatic.com/s/hankengrotesk/v12/ieVn2YZDLWuGJpnzaiwFXS9tYtpT59CjCQ.woff2).
- [Fuente de referencia y documentación en Google Fonts](https://github.com/google/fonts/tree/main/ofl/hankengrotesk).
- [Licencia oficial OFL](https://raw.githubusercontent.com/google/fonts/main/ofl/hankengrotesk/OFL.txt).

**Atribución:** Copyright 2021 The Hanken Grotesk Project Authors (https://github.com/marcologous/hanken-grotesk).

**Licencia:** SIL Open Font License, versión 1.1. El texto íntegro debe acompañar a las copias redistribuidas. La licencia no se extiende a N27; los archivos N27 conservan su procedencia original y sus condiciones propias.

## Comprobaciones realizadas

Se leyeron con fontTools las tablas de los cuatro archivos WOFF2 incluidos:

- Hanken Grotesk latino y latino extendido: familia `Hanken Grotesk`, versión 3.013, eje `wght` 100–900 y peso predeterminado 400.
- El subconjunto latino contiene `áéíóúñüÁÉÍÓÚÑÜ¿¡`.
- N27 Regular: estática, peso 400, versión 1.000.
- N27 Medium: estática, peso 500, versión 1.000.

La reproducción digital de los logotipos simples se mantiene en un mínimo de 140 px, incluido el modo presentación y los tamaños móviles, siguiendo la página 8 del playbook.
