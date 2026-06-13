import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import { extraerTerminos } from './src/lib/glosario';
import { remarkGlosario } from './src/lib/remark-glosario';
import { remarkLinksMd } from './src/lib/remark-links-md';

// GitHub Pages sirve el sitio bajo /MAPAIA/ (nombre del repo).
const base = '/MAPAIA';

// Términos del glosario, leídos una vez en build para los tooltips.
const terminos = extraerTerminos(readFileSync('./01-fundamentos/glosario.md', 'utf8'));

export default defineConfig({
  site: 'https://lucian094.github.io',
  base,
  markdown: {
    remarkPlugins: [
      // Los .md se linkean entre sí en relativo (legible en GitHub); en build
      // esos links se reescriben a rutas del sitio.
      [remarkLinksMd, { base }],
      // La 1ª aparición de cada término del glosario se vuelve link con tooltip.
      [remarkGlosario, { terminos, base }],
    ],
  },
});
