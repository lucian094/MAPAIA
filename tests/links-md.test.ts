import { describe, expect, it } from 'vitest';
import { reescribirLinkMd } from '../src/lib/links-md';

describe('reescribirLinkMd', () => {
  it('reescribe un link .md en la misma carpeta', () => {
    expect(reescribirLinkMd('ecosistema.md', '01-fundamentos', '/MAPAIA')).toBe(
      '/MAPAIA/01-fundamentos/ecosistema/',
    );
  });

  it('resuelve rutas con ../', () => {
    expect(
      reescribirLinkMd('../02-pathing/autoevaluacion.md', '01-fundamentos', '/MAPAIA'),
    ).toBe('/MAPAIA/02-pathing/autoevaluacion/');
  });

  it('conserva el fragmento #ancla', () => {
    expect(reescribirLinkMd('glosario.md#token', '01-fundamentos', '/MAPAIA')).toBe(
      '/MAPAIA/01-fundamentos/glosario/#token',
    );
  });

  it('tolera una base con barra final', () => {
    expect(reescribirLinkMd('glosario.md', '01-fundamentos', '/MAPAIA/')).toBe(
      '/MAPAIA/01-fundamentos/glosario/',
    );
  });

  it('no toca links externos', () => {
    expect(reescribirLinkMd('https://example.com/algo.md', '01-fundamentos', '/MAPAIA')).toBeNull();
  });

  it('no toca anclas internas', () => {
    expect(reescribirLinkMd('#seccion', '01-fundamentos', '/MAPAIA')).toBeNull();
  });

  it('no toca rutas absolutas', () => {
    expect(reescribirLinkMd('/MAPAIA/test/', '01-fundamentos', '/MAPAIA')).toBeNull();
  });

  it('no toca archivos que no son .md', () => {
    expect(reescribirLinkMd('diagrama.png', '01-fundamentos', '/MAPAIA')).toBeNull();
  });
});
