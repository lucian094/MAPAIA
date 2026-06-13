import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { ESTACIONES, LINEAS, SIN_ESTACION } from '../src/data/mapa';

const RAIZ = process.cwd();
const CARPETAS_CONTENIDO = [
  '01-fundamentos',
  '02-pathing',
  '03-practica',
  '04-extensibilidad',
];

/** Ids de colección ('02-pathing/perfil-inicial') de todos los .md en disco. */
function articulosEnDisco(): string[] {
  return CARPETAS_CONTENIDO.filter((carpeta) => existsSync(join(RAIZ, carpeta))).flatMap(
    (carpeta) =>
      readdirSync(join(RAIZ, carpeta), { recursive: true, encoding: 'utf8' })
        .filter((archivo) => archivo.endsWith('.md'))
        .map((archivo) => `${carpeta}/${archivo.replaceAll('\\', '/').slice(0, -'.md'.length)}`),
  );
}

describe('consistencia mapa ↔ contenido', () => {
  it('cada estación apunta a un .md que existe', () => {
    for (const estacion of ESTACIONES) {
      expect(existsSync(join(RAIZ, `${estacion.articulo}.md`)), estacion.articulo).toBe(true);
    }
  });

  it('cada .md de contenido tiene estación o figura en SIN_ESTACION', () => {
    const conEstacion = new Set(ESTACIONES.map((estacion) => estacion.articulo));
    const excepciones = new Set(SIN_ESTACION);
    for (const articulo of articulosEnDisco()) {
      expect(
        conEstacion.has(articulo) || excepciones.has(articulo),
        `${articulo} no tiene estación en mapa.ts ni figura en SIN_ESTACION`,
      ).toBe(true);
    }
  });

  it('SIN_ESTACION no tiene entradas obsoletas (todas existen en disco)', () => {
    for (const articulo of SIN_ESTACION) {
      expect(existsSync(join(RAIZ, `${articulo}.md`)), articulo).toBe(true);
    }
  });
});

describe('integridad interna del mapa', () => {
  it('los ids de estación son únicos', () => {
    const ids = ESTACIONES.map((estacion) => estacion.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('las rutas solo referencian estaciones existentes', () => {
    const ids = new Set(ESTACIONES.map((estacion) => estacion.id));
    for (const linea of LINEAS) {
      for (const id of linea.ruta) {
        expect(ids.has(id), `${linea.perfil}: estación desconocida ${id}`).toBe(true);
      }
    }
  });

  it('toda estación pertenece a al menos una línea', () => {
    const enRutas = new Set(LINEAS.flatMap((linea) => linea.ruta));
    for (const estacion of ESTACIONES) {
      expect(enRutas.has(estacion.id), estacion.id).toBe(true);
    }
  });

  it('hay una línea por perfil, cabecera en su perfil-*.md y colores del tema', () => {
    expect(LINEAS.map((linea) => linea.perfil)).toEqual([
      'explorador',
      'inicial',
      'experimentado',
      'nativo',
    ]);
    const porId = new Map(ESTACIONES.map((estacion) => [estacion.id, estacion]));
    for (const linea of LINEAS) {
      expect(linea.colorVar).toBe(`--linea-${linea.perfil}`);
      const cabecera = porId.get(linea.ruta[0] ?? '');
      expect(cabecera?.articulo).toBe(`02-pathing/perfil-${linea.perfil}`);
    }
  });
});

describe('diferenciación de líneas', () => {
  const ruta = (perfil: string) => LINEAS.find((l) => l.perfil === perfil)?.ruta ?? [];

  it('la exploradora llega hasta el final del contenido (como la inicial)', () => {
    // No es una vía muerta: un no-programador puede recorrer todo el curso.
    expect(ruta('explorador')).toContain('patrones-de-diseno');
    expect(ruta('explorador')).toContain('ingenieria-de-prompts');
  });

  it('la inicial recorre toda la práctica', () => {
    expect(ruta('inicial')).toContain('ingenieria-de-prompts');
    expect(ruta('inicial')).toContain('patrones-de-diseno');
  });

  it('la experimentada saltea prompts y el oficio de software, conserva qué-son', () => {
    expect(ruta('experimentado')).not.toContain('ingenieria-de-prompts');
    expect(ruta('experimentado')).not.toContain('arquitectura');
    expect(ruta('experimentado')).not.toContain('patrones-de-diseno');
    expect(ruta('experimentado')).toContain('que-son-los-agentes');
  });

  it('la nativa saltea qué-son, prompts y el oficio de software', () => {
    expect(ruta('nativo')).not.toContain('que-son-los-agentes');
    expect(ruta('nativo')).not.toContain('ingenieria-de-prompts');
    expect(ruta('nativo')).not.toContain('arquitectura');
    expect(ruta('nativo')).not.toContain('patrones-de-diseno');
  });

  it('cada línea técnica tiene un conjunto de estaciones distinto', () => {
    const firmas = ['inicial', 'experimentado', 'nativo'].map((p) =>
      [...ruta(p)].sort().join('|'),
    );
    expect(new Set(firmas).size).toBe(3);
  });

  it('las cuatro líneas suman la sección de extensibilidad', () => {
    for (const perfil of ['explorador', 'inicial', 'experimentado', 'nativo']) {
      expect(ruta(perfil)).toContain('mcp');
      expect(ruta(perfil)).toContain('skills');
      expect(ruta(perfil)).toContain('plugins');
    }
  });
});
