import { describe, expect, it } from 'vitest';
import { partirTexto, prepararTerminos, type Segmento } from '../src/lib/glosario-tooltip';

const TERMINOS = prepararTerminos([
  { termino: 'Agente', definicion: 'Programa que usa un modelo en un loop.' },
  { termino: 'Token', definicion: 'Unidad mínima de texto.' },
  { termino: 'MCP (Model Context Protocol)', definicion: 'Protocolo abierto.' },
  { termino: 'Ventana de contexto', definicion: 'Máximo de tokens a la vez.' },
  { termino: 'Contexto', definicion: 'Texto disponible al generar.' },
]);

function enlazados(texto: string, ya = new Set<string>()): string[] {
  return partirTexto(texto, TERMINOS, ya)
    .filter((s): s is Extract<Segmento, { tipo: 'termino' }> => s.tipo === 'termino')
    .map((s) => s.id);
}

describe('prepararTerminos', () => {
  it('calcula id y clave de match (sin paréntesis)', () => {
    const mcp = TERMINOS.find((t) => t.id === 'mcp-model-context-protocol');
    expect(mcp?.clave).toBe('mcp');
  });
});

describe('partirTexto', () => {
  it('enlaza un término simple, una sola vez', () => {
    expect(enlazados('Un agente y otro agente más')).toEqual(['agente']);
  });

  it('es insensible a mayúsculas y tildes', () => {
    expect(enlazados('El Token y el TOKEN')).toEqual(['token']);
  });

  it('tolera el plural español', () => {
    expect(enlazados('varios tokens sueltos')).toEqual(['token']);
  });

  it('matchea la clave sin paréntesis (MCP) y apunta al id completo', () => {
    expect(enlazados('Conectamos por MCP al sistema')).toEqual(['mcp-model-context-protocol']);
  });

  it('prefiere el término más específico (ventana de contexto sobre contexto)', () => {
    expect(enlazados('La ventana de contexto se llena')).toEqual(['ventana-de-contexto']);
  });

  it('no matchea dentro de otra palabra', () => {
    expect(enlazados('tokenizar no cuenta')).toEqual([]);
  });

  it('respeta yaEnlazados (no repite entre nodos)', () => {
    const ya = new Set<string>(['agente']);
    const segs = partirTexto('otro agente', TERMINOS, ya);
    expect(segs.every((s) => s.tipo === 'texto')).toBe(true);
  });

  it('preserva el texto original en el segmento (casing/acentos)', () => {
    const segs = partirTexto('El Agente trabaja', TERMINOS, new Set());
    const term = segs.find((s) => s.tipo === 'termino') as Extract<Segmento, { tipo: 'termino' }>;
    expect(term.valor).toBe('Agente');
  });

  it('devuelve un único segmento de texto cuando no hay términos', () => {
    const segs = partirTexto('frase sin nada relevante', TERMINOS, new Set());
    expect(segs).toEqual([{ tipo: 'texto', valor: 'frase sin nada relevante' }]);
  });

  it('parte correctamente texto-término-texto', () => {
    const segs = partirTexto('antes agente después', TERMINOS, new Set());
    expect(segs.map((s) => s.tipo)).toEqual(['texto', 'termino', 'texto']);
    expect((segs[0] as { valor: string }).valor).toBe('antes ');
    expect((segs[2] as { valor: string }).valor).toBe(' después');
  });

  it('tolera espacios flexibles en términos multipalabra (salto de línea)', () => {
    expect(enlazados('la ventana de\ncontexto importa')).toEqual(['ventana-de-contexto']);
  });
});
