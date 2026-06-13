import { describe, expect, it } from 'vitest';
import {
  ZOOM_MAX,
  clampViewBox,
  paneo,
  viewBoxInicial,
  zoom,
  type Limites,
} from '../src/lib/zoom-svg';

const LIM: Limites = { ancho: 200, alto: 100 };

describe('viewBoxInicial', () => {
  it('devuelve el viewBox que muestra todo el contenido', () => {
    expect(viewBoxInicial(LIM)).toEqual({ x: 0, y: 0, w: 200, h: 100 });
  });
});

describe('zoom', () => {
  it('acerca x2 alrededor del centro y queda centrado', () => {
    expect(zoom(viewBoxInicial(LIM), 2, 100, 50, LIM)).toEqual({ x: 50, y: 25, w: 100, h: 50 });
  });

  it('mantiene fijo el punto bajo el cursor (esquina)', () => {
    expect(zoom({ x: 0, y: 0, w: 200, h: 100 }, 2, 0, 0, LIM)).toEqual({
      x: 0,
      y: 0,
      w: 100,
      h: 50,
    });
  });

  it('no acerca más allá de ZOOM_MAX (w mínimo = ancho/ZOOM_MAX)', () => {
    const vb = zoom(viewBoxInicial(LIM), 1000, 100, 50, LIM);
    expect(vb.w).toBeCloseTo(LIM.ancho / ZOOM_MAX);
    expect(vb.h).toBeCloseTo(LIM.alto / ZOOM_MAX);
  });

  it('al alejar no agranda más allá del contenido completo', () => {
    expect(zoom(viewBoxInicial(LIM), 0.5, 100, 50, LIM)).toEqual({ x: 0, y: 0, w: 200, h: 100 });
  });

  it('preserva el aspecto del contenido (sin deformar)', () => {
    const vb = zoom(viewBoxInicial(LIM), 1.7, 120, 40, LIM);
    expect(vb.w / vb.h).toBeCloseTo(LIM.ancho / LIM.alto);
  });
});

describe('paneo', () => {
  it('no deja desplazar fuera del borde izquierdo/superior', () => {
    expect(paneo({ x: 0, y: 0, w: 100, h: 50 }, -50, -30, LIM)).toEqual({
      x: 0,
      y: 0,
      w: 100,
      h: 50,
    });
  });

  it('no deja desplazar fuera del borde derecho', () => {
    expect(paneo({ x: 0, y: 0, w: 100, h: 50 }, 1000, 0, LIM)).toEqual({
      x: 100,
      y: 0,
      w: 100,
      h: 50,
    });
  });

  it('desplaza dentro de los límites', () => {
    expect(paneo({ x: 0, y: 0, w: 100, h: 50 }, 30, 20, LIM)).toEqual({
      x: 30,
      y: 20,
      w: 100,
      h: 50,
    });
  });
});

describe('clampViewBox', () => {
  it('recorta un viewBox más grande que el contenido', () => {
    const vb = clampViewBox({ x: -10, y: -10, w: 500, h: 250 }, LIM);
    expect(vb.w).toBe(200);
    expect(vb.x).toBe(0);
  });
});
