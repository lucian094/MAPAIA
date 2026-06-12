/**
 * El perfil del lector (resultado del test o elección manual en el mapa).
 * Se guarda en localStorage detrás de guards: en incógnito, con
 * almacenamiento bloqueado o en build/SSR todo degrada a null/no-op y el
 * sitio funciona igual, solo que sin línea resaltada.
 */

export const PERFILES = ['explorador', 'inicial', 'experimentado', 'nativo'] as const;

export type Perfil = (typeof PERFILES)[number];

export const CLAVE_PERFIL = 'mapaia:perfil';

export interface AlmacenPerfil {
  getItem(clave: string): string | null;
  setItem(clave: string, valor: string): void;
  removeItem(clave: string): void;
}

export function esPerfil(valor: unknown): valor is Perfil {
  return typeof valor === 'string' && (PERFILES as readonly string[]).includes(valor);
}

/** localStorage si está disponible; null en incógnito/bloqueado/SSR. */
function almacenLocal(): AlmacenPerfil | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function leerPerfil(almacen: AlmacenPerfil | null = almacenLocal()): Perfil | null {
  if (!almacen) return null;
  try {
    const valor = almacen.getItem(CLAVE_PERFIL);
    return esPerfil(valor) ? valor : null;
  } catch {
    return null;
  }
}

export function guardarPerfil(
  perfil: Perfil,
  almacen: AlmacenPerfil | null = almacenLocal(),
): void {
  if (!almacen) return;
  try {
    almacen.setItem(CLAVE_PERFIL, perfil);
  } catch {
    // Sin almacenamiento no hay persistencia, pero el sitio sigue andando.
  }
}

export function limpiarPerfil(almacen: AlmacenPerfil | null = almacenLocal()): void {
  if (!almacen) return;
  try {
    almacen.removeItem(CLAVE_PERFIL);
  } catch {
    // Ídem guardarPerfil.
  }
}
