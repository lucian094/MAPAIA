/**
 * Seguimiento de "estaciones visitadas" del mapa de metro.
 * Se guarda en localStorage detrás de guards: en incógnito, con
 * almacenamiento bloqueado o en build/SSR todo degrada a no-op/[] y el
 * sitio funciona igual, solo que sin progreso persistido.
 */

export const CLAVE_VISITADAS = 'mapaia:visitadas';

export interface AlmacenProgreso {
  getItem(clave: string): string | null;
  setItem(clave: string, valor: string): void;
  removeItem(clave: string): void;
}

/** localStorage si está disponible; null en incógnito/bloqueado/SSR. */
function almacenLocal(): AlmacenProgreso | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

/**
 * Lee el array de ids visitados desde el almacén.
 * Si el JSON está corrupto o no es un array de strings, devuelve [].
 * Nunca lanza.
 */
export function leerVisitadas(almacen: AlmacenProgreso | null = almacenLocal()): string[] {
  if (!almacen) return [];
  try {
    const raw = almacen.getItem(CLAVE_VISITADAS);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    if (!parsed.every((item) => typeof item === 'string')) return [];
    return parsed;
  } catch {
    return [];
  }
}

/** Emite el evento de sincronización entre islas (solo en browser). */
function emitirProgreso(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('mapaia:progreso'));
  }
}

/**
 * Agrega el id a las visitadas si no está ya (idempotente).
 * Persiste y emite evento.
 */
export function marcarVisitada(id: string, almacen: AlmacenProgreso | null = almacenLocal()): void {
  if (!almacen) return;
  try {
    const actuales = leerVisitadas(almacen);
    if (!actuales.includes(id)) {
      almacen.setItem(CLAVE_VISITADAS, JSON.stringify([...actuales, id]));
    }
  } catch {
    // Sin almacenamiento no hay persistencia, pero el sitio sigue andando.
  }
  emitirProgreso();
}

/**
 * Quita el id de las visitadas si estaba.
 * Persiste y emite evento.
 */
export function desmarcarVisitada(id: string, almacen: AlmacenProgreso | null = almacenLocal()): void {
  if (!almacen) return;
  try {
    const actuales = leerVisitadas(almacen);
    almacen.setItem(CLAVE_VISITADAS, JSON.stringify(actuales.filter((v) => v !== id)));
  } catch {
    // Ídem marcarVisitada.
  }
  emitirProgreso();
}

/**
 * Alterna la visita: si estaba la quita (devuelve false), si no la agrega (devuelve true).
 * Persiste y emite evento.
 */
export function alternarVisitada(id: string, almacen: AlmacenProgreso | null = almacenLocal()): boolean {
  if (!almacen) return false;
  try {
    const actuales = leerVisitadas(almacen);
    const estaba = actuales.includes(id);
    if (estaba) {
      almacen.setItem(CLAVE_VISITADAS, JSON.stringify(actuales.filter((v) => v !== id)));
    } else {
      almacen.setItem(CLAVE_VISITADAS, JSON.stringify([...actuales, id]));
    }
    emitirProgreso();
    return !estaba;
  } catch {
    return false;
  }
}

/**
 * Calcula cuántas estaciones de `ruta` están en `visitadas`.
 * Función pura, sin almacén.
 */
export function progresoLinea(
  ruta: readonly string[],
  visitadas: readonly string[],
): { hechas: number; total: number } {
  const visitadasSet = new Set(visitadas);
  const hechas = ruta.filter((id) => visitadasSet.has(id)).length;
  return { hechas, total: ruta.length };
}

/**
 * Devuelve true solo si la ruta tiene al menos una estación y todas están visitadas.
 * Función pura, sin almacén.
 */
export function lineaCompleta(ruta: readonly string[], visitadas: readonly string[]): boolean {
  const { hechas, total } = progresoLinea(ruta, visitadas);
  return total > 0 && hechas === total;
}
