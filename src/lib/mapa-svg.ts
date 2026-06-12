/**
 * Geometría pura del mapa de metro: convierte la grilla de src/data/mapa.ts
 * a coordenadas SVG. Sin DOM: la usa MapaMetro.astro en build.
 */

export const CELDA = 90;
export const MARGEN = 70;

export interface NodoGrilla {
  id: string;
  x: number;
  y: number;
}

export interface Punto {
  x: number;
  y: number;
}

export function coordenada(nodo: Pick<NodoGrilla, 'x' | 'y'>): Punto {
  return { x: MARGEN + nodo.x * CELDA, y: MARGEN + nodo.y * CELDA };
}

export function dimensiones(
  nodos: readonly Pick<NodoGrilla, 'x' | 'y'>[],
): { ancho: number; alto: number } {
  const maxX = Math.max(...nodos.map((nodo) => nodo.x), 0);
  const maxY = Math.max(...nodos.map((nodo) => nodo.y), 0);
  return { ancho: maxX * CELDA + 2 * MARGEN, alto: maxY * CELDA + 2 * MARGEN };
}

export function puntosPolilinea(
  ruta: readonly string[],
  nodos: readonly NodoGrilla[],
): string {
  const porId = new Map(nodos.map((nodo) => [nodo.id, nodo]));
  return ruta
    .map((id) => {
      const nodo = porId.get(id);
      if (!nodo) throw new Error(`La ruta referencia una estación inexistente: ${id}`);
      const punto = coordenada(nodo);
      return `${punto.x},${punto.y}`;
    })
    .join(' ');
}
