import { describe, expect, it } from 'vitest';
import { unirRuta } from '../src/lib/rutas';

describe('unirRuta', () => {
  it('une base y camino con una sola barra', () => {
    expect(unirRuta('/MAPAIA', 'glosario/')).toBe('/MAPAIA/glosario/');
  });

  it('no duplica la barra si la base termina en /', () => {
    expect(unirRuta('/MAPAIA/', 'glosario/')).toBe('/MAPAIA/glosario/');
  });

  it('no duplica la barra si el camino empieza con /', () => {
    expect(unirRuta('/MAPAIA', '/glosario/')).toBe('/MAPAIA/glosario/');
  });

  it('funciona con base raíz', () => {
    expect(unirRuta('/', '01-fundamentos/ecosistema/')).toBe('/01-fundamentos/ecosistema/');
  });
});
