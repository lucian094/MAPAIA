import { describe, expect, it } from 'vitest';
import {
  CLAVE_PERFIL,
  esPerfil,
  guardarPerfil,
  leerPerfil,
  limpiarPerfil,
  type AlmacenPerfil,
} from '../src/lib/perfil';

function almacenEnMemoria(): AlmacenPerfil & { datos: Map<string, string> } {
  const datos = new Map<string, string>();
  return {
    datos,
    getItem: (clave) => datos.get(clave) ?? null,
    setItem: (clave, valor) => void datos.set(clave, valor),
    removeItem: (clave) => void datos.delete(clave),
  };
}

const ALMACEN_ROTO: AlmacenPerfil = {
  getItem: () => {
    throw new Error('bloqueado');
  },
  setItem: () => {
    throw new Error('bloqueado');
  },
  removeItem: () => {
    throw new Error('bloqueado');
  },
};

describe('esPerfil', () => {
  it('acepta los cuatro perfiles', () => {
    expect(esPerfil('explorador')).toBe(true);
    expect(esPerfil('inicial')).toBe(true);
    expect(esPerfil('experimentado')).toBe(true);
    expect(esPerfil('nativo')).toBe(true);
  });

  it('rechaza cualquier otro valor', () => {
    expect(esPerfil('turista')).toBe(false);
    expect(esPerfil('')).toBe(false);
    expect(esPerfil(null)).toBe(false);
    expect(esPerfil(42)).toBe(false);
  });
});

describe('guardarPerfil / leerPerfil / limpiarPerfil', () => {
  it('guarda y lee el perfil', () => {
    const almacen = almacenEnMemoria();
    guardarPerfil('nativo', almacen);
    expect(almacen.datos.get(CLAVE_PERFIL)).toBe('nativo');
    expect(leerPerfil(almacen)).toBe('nativo');
  });

  it('limpiarPerfil borra el valor', () => {
    const almacen = almacenEnMemoria();
    guardarPerfil('inicial', almacen);
    limpiarPerfil(almacen);
    expect(leerPerfil(almacen)).toBeNull();
  });

  it('ignora valores corruptos guardados', () => {
    const almacen = almacenEnMemoria();
    almacen.datos.set(CLAVE_PERFIL, 'cualquier-cosa');
    expect(leerPerfil(almacen)).toBeNull();
  });

  it('devuelve null sin almacenamiento disponible', () => {
    expect(leerPerfil(null)).toBeNull();
  });

  it('no explota si el almacenamiento lanza (incógnito/bloqueado)', () => {
    expect(() => guardarPerfil('nativo', ALMACEN_ROTO)).not.toThrow();
    expect(() => limpiarPerfil(ALMACEN_ROTO)).not.toThrow();
    expect(leerPerfil(ALMACEN_ROTO)).toBeNull();
  });
});
