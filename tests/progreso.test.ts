import { describe, expect, it } from 'vitest';
import {
  CLAVE_VISITADAS,
  alternarVisitada,
  desmarcarVisitada,
  leerVisitadas,
  lineaCompleta,
  marcarVisitada,
  progresoLinea,
  type AlmacenProgreso,
} from '../src/lib/progreso';

function almacenEnMemoria(): AlmacenProgreso & { datos: Map<string, string> } {
  const datos = new Map<string, string>();
  return {
    datos,
    getItem: (clave) => datos.get(clave) ?? null,
    setItem: (clave, valor) => void datos.set(clave, valor),
    removeItem: (clave) => void datos.delete(clave),
  };
}

const ALMACEN_ROTO: AlmacenProgreso = {
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

describe('leerVisitadas', () => {
  it('devuelve [] cuando el almacén está vacío', () => {
    const almacen = almacenEnMemoria();
    expect(leerVisitadas(almacen)).toEqual([]);
  });

  it('devuelve [] con almacen null', () => {
    expect(leerVisitadas(null)).toEqual([]);
  });

  it('devuelve [] cuando el almacén lanza', () => {
    expect(leerVisitadas(ALMACEN_ROTO)).toEqual([]);
  });

  it('devuelve [] con JSON corrupto (no-json)', () => {
    const almacen = almacenEnMemoria();
    almacen.datos.set(CLAVE_VISITADAS, 'no-json');
    expect(leerVisitadas(almacen)).toEqual([]);
  });

  it('devuelve [] con JSON que es un objeto (no array)', () => {
    const almacen = almacenEnMemoria();
    almacen.datos.set(CLAVE_VISITADAS, '{"x":1}');
    expect(leerVisitadas(almacen)).toEqual([]);
  });

  it('devuelve [] con JSON que es array de no-strings', () => {
    const almacen = almacenEnMemoria();
    almacen.datos.set(CLAVE_VISITADAS, '[1,2]');
    expect(leerVisitadas(almacen)).toEqual([]);
  });
});

describe('marcarVisitada', () => {
  it('agrega el id y puede leerlo después', () => {
    const almacen = almacenEnMemoria();
    marcarVisitada('estacion-a', almacen);
    expect(leerVisitadas(almacen)).toContain('estacion-a');
  });

  it('marcar dos veces el mismo id deja solo uno (idempotente, sin duplicados)', () => {
    const almacen = almacenEnMemoria();
    marcarVisitada('estacion-a', almacen);
    marcarVisitada('estacion-a', almacen);
    expect(leerVisitadas(almacen)).toEqual(['estacion-a']);
  });

  it('puede marcar varios ids distintos', () => {
    const almacen = almacenEnMemoria();
    marcarVisitada('estacion-a', almacen);
    marcarVisitada('estacion-b', almacen);
    expect(leerVisitadas(almacen)).toEqual(['estacion-a', 'estacion-b']);
  });

  it('no explota con almacen null', () => {
    expect(() => marcarVisitada('estacion-a', null)).not.toThrow();
  });

  it('no explota con almacén que lanza', () => {
    expect(() => marcarVisitada('estacion-a', ALMACEN_ROTO)).not.toThrow();
  });
});

describe('desmarcarVisitada', () => {
  it('quita el id del array', () => {
    const almacen = almacenEnMemoria();
    marcarVisitada('estacion-a', almacen);
    marcarVisitada('estacion-b', almacen);
    desmarcarVisitada('estacion-a', almacen);
    expect(leerVisitadas(almacen)).toEqual(['estacion-b']);
  });

  it('no explota si el id no estaba', () => {
    const almacen = almacenEnMemoria();
    expect(() => desmarcarVisitada('estacion-inexistente', almacen)).not.toThrow();
    expect(leerVisitadas(almacen)).toEqual([]);
  });

  it('no explota con almacen null', () => {
    expect(() => desmarcarVisitada('estacion-a', null)).not.toThrow();
  });

  it('no explota con almacén que lanza', () => {
    expect(() => desmarcarVisitada('estacion-a', ALMACEN_ROTO)).not.toThrow();
  });
});

describe('alternarVisitada', () => {
  it('agrega el id cuando no estaba y devuelve true', () => {
    const almacen = almacenEnMemoria();
    const resultado = alternarVisitada('estacion-a', almacen);
    expect(resultado).toBe(true);
    expect(leerVisitadas(almacen)).toContain('estacion-a');
  });

  it('quita el id cuando estaba y devuelve false', () => {
    const almacen = almacenEnMemoria();
    marcarVisitada('estacion-a', almacen);
    const resultado = alternarVisitada('estacion-a', almacen);
    expect(resultado).toBe(false);
    expect(leerVisitadas(almacen)).not.toContain('estacion-a');
  });

  it('alternar dos veces deja el estado original', () => {
    const almacen = almacenEnMemoria();
    alternarVisitada('estacion-a', almacen);
    alternarVisitada('estacion-a', almacen);
    expect(leerVisitadas(almacen)).toEqual([]);
  });

  it('no explota con almacen null y devuelve false', () => {
    expect(() => alternarVisitada('estacion-a', null)).not.toThrow();
    expect(alternarVisitada('estacion-a', null)).toBe(false);
  });

  it('no explota con almacén que lanza y devuelve false', () => {
    expect(() => alternarVisitada('estacion-a', ALMACEN_ROTO)).not.toThrow();
    expect(alternarVisitada('estacion-a', ALMACEN_ROTO)).toBe(false);
  });
});

describe('progresoLinea', () => {
  it('cuenta correctamente las estaciones hechas', () => {
    expect(progresoLinea(['a', 'b', 'c'], ['b'])).toEqual({ hechas: 1, total: 3 });
  });

  it('devuelve total 0 con ruta vacía', () => {
    expect(progresoLinea([], ['a'])).toEqual({ hechas: 0, total: 0 });
  });

  it('devuelve hechas 0 si no hay visitadas en la ruta', () => {
    expect(progresoLinea(['a', 'b'], ['c'])).toEqual({ hechas: 0, total: 2 });
  });

  it('devuelve hechas igual a total si todas están visitadas', () => {
    expect(progresoLinea(['a', 'b'], ['a', 'b'])).toEqual({ hechas: 2, total: 2 });
  });
});

describe('lineaCompleta', () => {
  it('devuelve true si todas las estaciones de la ruta están visitadas', () => {
    expect(lineaCompleta(['a', 'b'], ['a', 'b'])).toBe(true);
  });

  it('devuelve false si falta alguna estación', () => {
    expect(lineaCompleta(['a', 'b'], ['a'])).toBe(false);
  });

  it('devuelve false si la ruta está vacía (total === 0)', () => {
    expect(lineaCompleta([], [])).toBe(false);
  });

  it('devuelve false con visitadas que incluyen la ruta pero ruta vacía', () => {
    expect(lineaCompleta([], ['a', 'b'])).toBe(false);
  });
});
