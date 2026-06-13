/**
 * Detección de términos del glosario dentro de un texto, para los tooltips
 * que el plugin remark inyecta en build. Lógica pura y testeable, separada
 * del recorrido del árbol Markdown (eso vive en remark-glosario.ts).
 *
 * Reglas: whole-word, sin distinguir mayúsculas ni tildes (vía normalizar),
 * clave de match = el encabezado del glosario sin su paréntesis final
 * (p. ej. "MCP (Model Context Protocol)" se busca como "MCP" pero el id
 * apunta al término completo), plural español opcional, espacios internos
 * flexibles (hard-wrap), y solo la primera aparición de cada término.
 */

import { idTermino, normalizar } from './glosario';

export interface TerminoGlosario {
  termino: string;
  definicion: string;
}

export interface TerminoPreparado {
  termino: string;
  definicion: string;
  id: string;
  clave: string;
}

export type Segmento =
  | { tipo: 'texto'; valor: string }
  | { tipo: 'termino'; valor: string; id: string; definicion: string };

/** Quita un paréntesis final tipo "MCP (Model Context Protocol)" → "MCP". */
function claveDeMatch(termino: string): string {
  const sinParen = termino.replace(/\s*\([^)]*\)\s*$/, '').trim();
  return normalizar(sinParen);
}

export function prepararTerminos(terminos: readonly TerminoGlosario[]): TerminoPreparado[] {
  return terminos
    .map((t) => ({
      termino: t.termino,
      definicion: t.definicion,
      id: idTermino(t.termino),
      clave: claveDeMatch(t.termino),
    }))
    .filter((t) => t.clave.length >= 2)
    // Claves más largas primero: ante un solape, gana la más específica.
    .sort((a, b) => b.clave.length - a.clave.length);
}

function escaparRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Regex de una clave sobre texto NORMALIZADO (minúsculas, sin tildes, ñ conservada). */
function regexClave(clave: string): RegExp {
  const cuerpo = escaparRegex(clave).replace(/\s+/g, '\\s+');
  // Límite de palabra propio (sin \b, que no respeta la ñ); plural es/s opcional.
  return new RegExp(`(?<![a-z0-9ñ])${cuerpo}(?:es|s)?(?![a-z0-9ñ])`);
}

interface MapaNorm {
  norm: string;
  /** map[i] = índice en el texto original del carácter normalizado i. */
  map: number[];
}

function normalizarConMapa(texto: string): MapaNorm {
  let norm = '';
  const map: number[] = [];
  for (let i = 0; i < texto.length; i++) {
    const n = normalizar(texto[i] ?? '');
    for (const ch of n) {
      norm += ch;
      map.push(i);
    }
  }
  map.push(texto.length); // centinela para el fin de match
  return { norm, map };
}

export function partirTexto(
  texto: string,
  terminos: readonly TerminoPreparado[],
  yaEnlazados: Set<string>,
): Segmento[] {
  const { norm, map } = normalizarConMapa(texto);

  // Aparición más temprana entre términos no enlazados (clave más larga desempata).
  let mejor: { ini: number; fin: number; t: TerminoPreparado } | null = null;
  for (const t of terminos) {
    if (yaEnlazados.has(t.id)) continue;
    const m = regexClave(t.clave).exec(norm);
    if (!m) continue;
    const ini = m.index;
    const fin = m.index + m[0].length;
    if (!mejor || ini < mejor.ini || (ini === mejor.ini && t.clave.length > mejor.t.clave.length)) {
      mejor = { ini, fin, t };
    }
  }

  if (!mejor) return [{ tipo: 'texto', valor: texto }];

  const oIni = map[mejor.ini] ?? 0;
  const oFin = map[mejor.fin] ?? texto.length;
  yaEnlazados.add(mejor.t.id);

  const segmentos: Segmento[] = [];
  if (oIni > 0) segmentos.push({ tipo: 'texto', valor: texto.slice(0, oIni) });
  segmentos.push({
    tipo: 'termino',
    valor: texto.slice(oIni, oFin),
    id: mejor.t.id,
    definicion: mejor.t.definicion,
  });
  const cola = texto.slice(oFin);
  if (cola) segmentos.push(...partirTexto(cola, terminos, yaEnlazados));
  return segmentos;
}
