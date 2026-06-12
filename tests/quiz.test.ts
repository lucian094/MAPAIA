import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PREGUNTA_PROGRAMA, PREGUNTAS, derivarPerfil } from '../src/data/quiz';
import type { Perfil } from '../src/lib/perfil';

describe('derivarPerfil', () => {
  it('gana el perfil con más respuestas', () => {
    expect(
      derivarPerfil(['nativo', 'inicial', 'nativo', 'nativo', 'experimentado', 'nativo']),
    ).toBe('nativo');
  });

  it('empate: gana el que está antes en el orden inicial → experimentado → nativo', () => {
    expect(derivarPerfil(['inicial', 'nativo'])).toBe('inicial');
    expect(derivarPerfil(['experimentado', 'nativo'])).toBe('experimentado');
    expect(
      derivarPerfil(['inicial', 'inicial', 'experimentado', 'experimentado', 'nativo', 'nativo']),
    ).toBe('inicial');
  });

  it('sin respuestas devuelve inicial (la ruta más conservadora)', () => {
    expect(derivarPerfil([])).toBe('inicial');
  });

  it('el explorador nunca sale de la mayoría (lo decide la pregunta de filtro)', () => {
    // Aunque se cuele en las respuestas, la derivación solo considera los
    // perfiles del cuestionario.
    expect(derivarPerfil(['explorador', 'explorador', 'nativo'])).toBe('nativo');
  });
});

describe('PREGUNTAS', () => {
  it('hay entre 5 y 8 preguntas, cada una con una opción por perfil', () => {
    expect(PREGUNTAS.length).toBeGreaterThanOrEqual(5);
    expect(PREGUNTAS.length).toBeLessThanOrEqual(8);
    for (const pregunta of PREGUNTAS) {
      const perfiles = pregunta.opciones.map((opcion) => opcion.perfil);
      expect([...perfiles].sort()).toEqual(['experimentado', 'inicial', 'nativo']);
    }
  });

  it('cada texto del quiz existe en 02-pathing/autoevaluacion.md (sincronía sitio ↔ GitHub)', () => {
    const plano = (texto: string) => texto.replace(/\s+/g, ' ').trim();
    const markdown = plano(
      readFileSync(join(process.cwd(), '02-pathing', 'autoevaluacion.md'), 'utf8'),
    );
    expect(markdown).toContain(plano(PREGUNTA_PROGRAMA));
    for (const pregunta of PREGUNTAS) {
      expect(markdown).toContain(plano(pregunta.texto));
      for (const opcion of pregunta.opciones) {
        expect(markdown).toContain(plano(opcion.texto));
      }
    }
  });

  it('el empate documentado en el .md (A, B, C) coincide con el orden de perfiles', () => {
    // La primera opción de cada pregunta es A=inicial, después B=experimentado, C=nativo.
    for (const pregunta of PREGUNTAS) {
      const orden: Perfil[] = pregunta.opciones.map((opcion) => opcion.perfil);
      expect(orden).toEqual(['inicial', 'experimentado', 'nativo']);
    }
  });
});
