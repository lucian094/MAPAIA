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
Estado: Fase 2 (fundamentos: contenido + render de artículos + glosario) — ver `.dev/plans/` para el plan vigente.
