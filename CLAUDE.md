# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Qué es este proyecto

MAPAIA — Modelo de Adopción Progresiva de Agentes de Inteligencia Artificial.
Contenido Markdown (en `01-fundamentos/` … `04-extensibilidad/`, legible
directo en GitHub) + sitio estático Astro que lo renderiza como un mapa de
metro interactivo, publicado en GitHub Pages
(https://lucian094.github.io/MAPAIA/).

Los documentos de diseño y planes viven en `.dev/` (gitignored, solo local).
El design doc principal: `.dev/specs/2026-06-12-mapaia-sitio-interactivo-design.md`.

## Reglas de trabajo

- **Commits manuales:** NO hacer commits automáticos. Todos los commits los
  hace el autor de forma manual. Dejar los cambios en el working tree (sin
  `git add`/`git commit`) y avisar qué archivos cambiaron.

## Comandos

- `npm run dev` — server de desarrollo (http://localhost:4321/MAPAIA/ — ojo con el base path)
- `npm run build` — build a `dist/`
- `npm run check` — chequeo de tipos (astro check)
- `npm test` — tests de la lógica pura (Vitest, archivos en `tests/`)

Nota Windows: al final de `astro build` puede aparecer `Assertion failed:
!(handle->flags & UV_HANDLE_CLOSING)` (bug de libuv al cerrar el proceso). Si
el log dice `Complete!`, el build fue exitoso aunque el exit code no sea 0.

## Arquitectura

- **Astro 5 + TypeScript strict, sin framework de UI.** La interactividad se
  hace con islas de vanilla TS.
- **El contenido vive en la raíz** (`01-fundamentos/`, `02-pathing/`,
  `03-practica/`, `04-extensibilidad/`) como Markdown puro — una sola fuente
  para GitHub y para el sitio.
- **`src/styles/theme.css`** es la única fuente de colores (tema "metro
  nocturno"): nunca hardcodear colores en componentes, usar las custom
  properties (`--linea-inicial`, `--accent`, etc.).
- **`src/layouts/Base.astro`** es el layout de todas las páginas (importa el
  theme.css global en su frontmatter). `src/layouts/Articulo.astro` envuelve
  los artículos de contenido (migas + estilos de prosa).
- **La lógica pura vive en `src/lib/`** (parsing del glosario, títulos,
  reescritura de links) separada del DOM, con tests en `tests/`. Los `.md` de
  contenido NO llevan frontmatter: el título sale del primer `# encabezado`
  (colección `contenido` en `src/content.config.ts`, glob loader sobre la raíz).
- **Links internos entre `.md`:** se escriben relativos (p. ej.
  `[glosario](glosario.md)`) para que funcionen en GitHub; el plugin remark
  `src/lib/remark-links-md.ts` los reescribe a rutas del sitio en build.
- **`01-fundamentos/glosario.md` tiene formato fijo** (cada término es `## ` +
  UN párrafo de texto plano): lo parsea `src/lib/glosario.ts` para `/glosario`.
- **`src/data/mapa.ts` es la fuente única del mapa de metro** (líneas,
  estaciones, rutas, posiciones de grilla). Agregar un `.md` de contenido
  exige una estación ahí o una entrada en `SIN_ESTACION` — lo valida
  `tests/mapa.test.ts` contra el filesystem. El SVG lo arma
  `src/components/MapaMetro.astro` con la geometría pura de
  `src/lib/mapa-svg.ts`.
- **`src/data/quiz.ts`** tiene las preguntas del test (`/test`) y
  `derivarPerfil` (función pura). **Las preguntas se espejan en
  `02-pathing/autoevaluacion.md`**: si cambia una, cambiar la otra
  (`tests/quiz.test.ts` valida la sincronía con espacios normalizados).
- **El perfil del lector vive en localStorage** detrás de
  `src/lib/perfil.ts` (guards: sin almacenamiento el sitio funciona igual,
  solo que sin línea resaltada). Lo escriben el test y la leyenda del mapa.
- **El progreso (estaciones visitadas) vive en localStorage** detrás de
  `src/lib/progreso.ts` (mismo patrón de guards que `perfil.ts`; la parte de
  avance/logro por línea es pura y testeada). Lo escribe el botón
  `src/components/ProgresoArticulo.astro` (en cada artículo con estación) y
  lo lee la isla de `MapaMetro.astro` para pintar visitadas, el conteo por
  línea y el banner de logro. Las mutaciones emiten un evento `mapaia:progreso`
  para sincronizar mapa y artículo en la misma pestaña.
- **El mapa tiene zoom + paneo** (`src/lib/zoom-svg.ts`, lógica pura testeada;
  isla en `MapaMetro.astro`): botones +/−/reajustar, rueda y arrastre, sobre el
  `viewBox` del SVG. `03-practica/` tiene 7 temas (se sumaron economía de
  contexto/tokens y método spec-first/TDD; los ADRs viven en
  `contexto-y-estructura.md`), por eso el plano quedó ancho.
- **Tooltips de glosario en build:** `src/lib/remark-glosario.ts` (plugin
  remark registrado en `astro.config.ts`) envuelve la primera aparición de
  cada término del glosario, en cada artículo, en un link con tooltip; la
  detección pura (whole-word, sin tildes, claves sin paréntesis, plurales)
  vive en `src/lib/glosario-tooltip.ts`. No toca el propio `glosario.md`.
- **Los ids de la colección conservan la ruta real del `.md`** (sin
  slugificar: `02-pathing/README`, con mayúsculas) vía `generateId` en
  `src/content.config.ts` — los links reescritos dependen de eso y Pages es
  case-sensitive.
- Deploy automático a GitHub Pages en cada push a `main`
  (`.github/workflows/deploy.yml`). `base: /MAPAIA` está configurado en
  `astro.config.ts`: los links internos deben usar `import.meta.env.BASE_URL`
  (helper `unirRuta` en `src/lib/rutas.ts`; recordar que las URLs de Pages son
  case-sensitive).

## Reglas de contenido (OBLIGATORIAS)

- **NO mencionar** organizaciones privadas, clientes, proyectos privados ni
  datos de terceros en ningún archivo.
- Sí se pueden mencionar: Anthropic, OpenAI, Google, Microsoft, GitHub,
  JetBrains, herramientas públicas (Claude Code, Copilot, Cursor, etc.) y
  estudios públicos con fuente.
- **Idioma:** español es-AR, voseo moderado, tono cercano y profesional.
- **Archivos de contenido:** 150-400 líneas, terminan con sección
  "→ Siguiente paso", código con lenguaje declarado.
- `01-fundamentos/ecosistema.md` lleva fecha de última actualización al inicio.

## Construcción por fases

El proyecto avanza en 6 fases con stop gates (revisión del autor entre fases).
Estado: Fase 5 completada (extensibilidad: `04-extensibilidad/` con MCP, skills
y plugins, sumados al mapa como estaciones en las cuatro líneas). Próxima: Fase
6 (cierre y verificación global) — ver `.dev/plans/` para los planes.
