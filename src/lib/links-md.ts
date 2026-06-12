/**
 * Reescritura de links relativos a archivos .md hacia rutas del sitio.
 * Devuelve null cuando el link no debe tocarse (externo, ancla, absoluto,
 * o no apunta a un .md).
 */

const ESQUEMA = /^[a-z][a-z0-9+.-]*:/i;

export function reescribirLinkMd(
  url: string,
  dirEntrada: string,
  base: string,
): string | null {
  if (ESQUEMA.test(url) || url.startsWith('#') || url.startsWith('/')) return null;

  const indiceHash = url.indexOf('#');
  const ruta = indiceHash === -1 ? url : url.slice(0, indiceHash);
  const fragmento = indiceHash === -1 ? '' : url.slice(indiceHash);
  if (!ruta.endsWith('.md')) return null;

  const destino = resolver(dirEntrada, ruta.slice(0, -'.md'.length));
  const baseLimpia = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${baseLimpia}/${destino}/${fragmento}`;
}

/** Resuelve `ruta` relativa a `dir` (segmentos posix, maneja `.` y `..`). */
function resolver(dir: string, ruta: string): string {
  const segmentos = dir === '' ? [] : dir.split('/');
  for (const parte of ruta.split('/')) {
    if (parte === '' || parte === '.') continue;
    if (parte === '..') segmentos.pop();
    else segmentos.push(parte);
  }
  return segmentos.join('/');
}
