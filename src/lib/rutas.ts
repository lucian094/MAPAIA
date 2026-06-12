/**
 * Une el base path del sitio con un camino interno sin duplicar barras.
 * Pensada para `unirRuta(import.meta.env.BASE_URL, 'glosario/')`.
 */
export function unirRuta(base: string, camino: string): string {
  const baseLimpia = base.endsWith('/') ? base.slice(0, -1) : base;
  const caminoLimpio = camino.startsWith('/') ? camino.slice(1) : camino;
  return `${baseLimpia}/${caminoLimpio}`;
}
