import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

// Una sola colección para todo el contenido Markdown de la raíz del repo
// (01-fundamentos/ … 04-extensibilidad/). Sin schema: los .md son Markdown
// puro sin frontmatter (legibles en GitHub); el título se extrae del primer
// encabezado con src/lib/contenido.ts.
const contenido = defineCollection({
  loader: glob({
    pattern: '0[1-4]-*/**/*.md',
    base: '.',
    // El id por defecto slugifica (README → "readme"); acá el id debe ser la
    // ruta real del .md sin extensión, porque los links relativos entre
    // artículos se reescriben a esas rutas y Pages es case-sensitive.
    generateId: ({ entry }) => entry.replace(/\\/g, '/').replace(/\.md$/, ''),
  }),
});

export const collections = { contenido };
