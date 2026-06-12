import { describe, expect, it } from 'vitest';
import { extraerTerminos, idTermino, normalizar } from '../src/lib/glosario';

const MARKDOWN_EJEMPLO = `# Glosario

Texto de introducción que no es un término.

<!-- comentario de convención -->

## Agente

Programa que usa un modelo de lenguaje dentro de un loop.
Sigue en una segunda línea.

## Token

La unidad mínima de texto con la que opera un modelo.

## → Siguiente paso

Esto no es un término y no debe aparecer.
`;

describe('extraerTerminos', () => {
  it('extrae los términos con su definición', () => {
    const terminos = extraerTerminos(MARKDOWN_EJEMPLO);
    expect(terminos).toHaveLength(2);
    expect(terminos[0]?.termino).toBe('Agente');
    expect(terminos[1]?.termino).toBe('Token');
  });

  it('une las líneas de la definición en un solo párrafo', () => {
    const terminos = extraerTerminos(MARKDOWN_EJEMPLO);
    expect(terminos[0]?.definicion).toBe(
      'Programa que usa un modelo de lenguaje dentro de un loop. Sigue en una segunda línea.',
    );
  });

  it('ignora la introducción y la sección → Siguiente paso', () => {
    const terminos = extraerTerminos(MARKDOWN_EJEMPLO);
    const textos = terminos.map((t) => `${t.termino} ${t.definicion}`).join(' ');
    expect(textos).not.toContain('introducción');
    expect(textos).not.toContain('Siguiente paso');
  });

  it('devuelve lista vacía si no hay términos', () => {
    expect(extraerTerminos('# Título\n\nSolo intro.')).toEqual([]);
  });
});

describe('normalizar', () => {
  it('pasa a minúsculas y saca tildes', () => {
    expect(normalizar('Alucinación')).toBe('alucinacion');
  });

  it('conserva la ñ como letra distinta de la n', () => {
    expect(normalizar('señal')).not.toBe('senal');
  });
});

describe('idTermino', () => {
  it('genera un id apto para ancla', () => {
    expect(idTermino('Ventana de contexto')).toBe('ventana-de-contexto');
  });

  it('maneja paréntesis y mayúsculas', () => {
    expect(idTermino('MCP (Model Context Protocol)')).toBe('mcp-model-context-protocol');
  });
});
