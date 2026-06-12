# Cómo contribuir a MAPAIA

¡Gracias por querer aportar! Este repo es contenido abierto y las
contribuciones son bienvenidas. Acá va lo que necesitás saber.

## Qué tipo de aportes se aceptan

- **Correcciones**: typos, links rotos, errores técnicos o conceptuales.
- **Actualizaciones de `01-fundamentos/ecosistema.md`**: es el único archivo
  con información volátil (herramientas, precios). Si algo quedó viejo,
  actualizalo y cambiá la fecha de "última actualización" del inicio.
- **Mejoras de ejemplos**: prompts, archivos de contexto o código que ilustren
  mejor un concepto existente.
- **Mejoras del sitio**: accesibilidad, rendimiento, bugs del mapa interactivo.

Para **secciones o temas nuevos**, abrí primero una issue para discutirlo
antes de escribir — el alcance del repo está definido y preferimos conversar
antes que rechazar trabajo hecho.

## Estilo e idioma

- **Idioma:** español neutro rioplatense (es-AR), tuteo/voseo moderado.
- **Tono:** cercano y directo, como un colega con experiencia explicándole a
  otro. Sin solemnidad académica ni lenguaje de marketing. Humor sutil, bienvenido.
- **Extensión:** entre 150 y 400 líneas por archivo. Mejor varios archivos
  enfocados que uno enciclopédico.
- **Formato:** títulos con `#`/`##`, código en bloques con lenguaje declarado,
  tablas solo para comparar, listas con moderación. Cada archivo de contenido
  termina con una sección "→ Siguiente paso".
- **Ejemplos de código:** Python o TypeScript/JavaScript, funcionales o
  claramente marcados como pseudocódigo.

## Reglas de contenido (no negociables)

- No mencionar empresas privadas, clientes, proyectos privados ni datos de
  terceros.
- Sí se pueden citar: empresas tecnológicas públicas (Anthropic, OpenAI,
  Google, Microsoft, GitHub, JetBrains), herramientas públicas y estudios
  citables con fuente.
- Toda afirmación cuantitativa lleva su fuente.

## Proceso de PR

1. Hacé fork y creá una rama descriptiva (`fix/link-roto-glosario`).
2. Si tocás el sitio, verificá que `npm run build` y `npm run check` pasen.
3. Abrí el PR explicando el *por qué*, no solo el *qué*.
4. Un PR = un tema. PRs chicos se revisan rápido; los gigantes, nunca.
