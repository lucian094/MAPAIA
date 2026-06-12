import { defineConfig } from 'astro/config';
import { remarkLinksMd } from './src/lib/remark-links-md';

// GitHub Pages sirve el sitio bajo /MAPAIA/ (nombre del repo).
const base = '/MAPAIA';

export default defineConfig({
  site: 'https://lucian094.github.io',
  base,
  markdown: {
    // Los .md de contenido se linkean entre sí en relativo (legible en
    // GitHub); en build esos links se reescriben a rutas del sitio.
    remarkPlugins: [[remarkLinksMd, { base }]],
  },
});
