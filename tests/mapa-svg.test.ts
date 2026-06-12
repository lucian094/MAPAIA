import { describe, expect, it } from 'vitest';
import {
  CELDA,
  MARGEN,
  coordenada,
  dimensiones,
  puntosPolilinea,
} from '../src/lib/mapa-svg';

describe('coordenada', () => {
  it('convierte la celda de grilla a píxeles con margen', () => {
    expect(coordenada({ x: 0, y: 0 })).toEqual({ x: MARGEN, y: MARGEN });
    expect(coordenada({ x: 2, y: 1 })).toEqual({ x: MARGEN + 2 * CELDA, y: MARGEN + CELDA });
  });
});

describe('dimensiones', () => {
  it('calcula el viewBox a partir de la celda máxima', () => {
    const nodos = [
      { x: 1, y: 1 },
      { x: 5, y: 3 },
    ];
    expect(dimensiones(nodos)).toEqual({
      ancho: 5 * CELDA + 2 * MARGEN,
      alto: 3 * CELDA + 2 * MARGEN,
    });
  });
});

describe('puntosPolilinea', () => {
  const nodos = [
    { id: 'a', x: 0, y: 0 },
    { id: 'b', x: 2, y: 1 },
  ];

  it('arma los puntos de la ruta en orden', () => {
    expect(puntosPolilinea(['a', 'b'], nodos)).toBe(
      `${MARGEN},${MARGEN} ${MARGEN + 2 * CELDA},${MARGEN + CELDA}`,
    );
  });

  it('lanza si la ruta referencia un nodo inexistente', () => {
    expect(() => puntosPolilinea(['a', 'zeta'], nodos)).toThrow(/zeta/);
  });
});
