/**
 * Matemática pura del zoom/paneo del mapa: opera sobre el viewBox del SVG.
 * Sin DOM (la isla de MapaMetro.astro la usa). El viewBox preserva siempre
 * el aspecto del contenido para no deformar ni provocar saltos de layout.
 */

export interface ViewBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Limites {
  /** Extensión total del contenido: el viewBox vive dentro de 0..ancho / 0..alto. */
  ancho: number;
  alto: number;
}

/** Máximo acercamiento: el viewBox no baja de `limites / ZOOM_MAX`. */
export const ZOOM_MAX = 5;

function clamp(valor: number, min: number, max: number): number {
  return Math.min(Math.max(valor, min), max);
}

export function viewBoxInicial(limites: Limites): ViewBox {
  return { x: 0, y: 0, w: limites.ancho, h: limites.alto };
}

/**
 * Normaliza un viewBox: tamaño entre `ancho/ZOOM_MAX` y `ancho` (preservando
 * el aspecto del contenido), y posición dentro de 0..ancho / 0..alto.
 */
export function clampViewBox(vb: ViewBox, limites: Limites): ViewBox {
  const aspecto = limites.ancho / limites.alto;
  const w = clamp(vb.w, limites.ancho / ZOOM_MAX, limites.ancho);
  const h = w / aspecto;
  const x = clamp(vb.x, 0, limites.ancho - w);
  const y = clamp(vb.y, 0, limites.alto - h);
  return { x, y, w, h };
}

/**
 * Zoom uniforme por `factor` (>1 acerca: viewBox más chico) manteniendo fijo
 * el punto de contenido (cx, cy) bajo el cursor.
 */
export function zoom(
  vb: ViewBox,
  factor: number,
  cx: number,
  cy: number,
  limites: Limites,
): ViewBox {
  const aspecto = limites.ancho / limites.alto;
  const w = clamp(vb.w / factor, limites.ancho / ZOOM_MAX, limites.ancho);
  const h = w / aspecto;
  const fracX = vb.w === 0 ? 0 : (cx - vb.x) / vb.w;
  const fracY = vb.h === 0 ? 0 : (cy - vb.y) / vb.h;
  return clampViewBox({ x: cx - fracX * w, y: cy - fracY * h, w, h }, limites);
}

/** Desplaza el viewBox (dx, dy en unidades de contenido), clampeado a los bordes. */
export function paneo(vb: ViewBox, dx: number, dy: number, limites: Limites): ViewBox {
  return clampViewBox({ ...vb, x: vb.x + dx, y: vb.y + dy }, limites);
}
