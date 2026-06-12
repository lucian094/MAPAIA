import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

// Una sola colección para todo el contenido Markdown de la raíz del repo
// (01-fundamentos/ … 04-extensibilidad/). Sin schema: los .md son Markdown
// puro sin frontmatter (legibles en GitHub); el título se extrae del primer
// encabezado con src/lib/contenido.ts.
const contenido = defineCollection({
  loader: glob({ pattern: '0[1-4]-*/**/*.md', base: '.' }),
});

export const collections = { contenido };
