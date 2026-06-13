/**
 * Plugin remark: envuelve la primera aparición de cada término del glosario
 * en un link con tooltip (`<a class="glosario-termino" data-definicion=…>`),
 * en build, sobre cada artículo. NO toca el propio glosario (para no
 * auto-referenciarse). La detección vive en glosario-tooltip.ts (pura); acá
 * solo está el recorrido del árbol Markdown, con tipos estructurales mínimos
 * para no depender de @types/mdast.
 */

import {
  partirTexto,
  prepararTerminos,
  type TerminoGlosario,
  type TerminoPreparado,
} from './glosario-tooltip';

interface Nodo {
  type: string;
  value?: string;
  url?: string;
  children?: Nodo[];
  data?: { hProperties?: Record<string, unknown> };
}

interface Archivo {
  path?: string;
}

interface Opciones {
  terminos: readonly TerminoGlosario[];
  base: string;
}

// Tipos de nodo cuyo contenido NO se debe enlazar (código, links, títulos).
const SALTAR = new Set([
  'code',
  'inlineCode',
  'link',
  'linkReference',
  'definition',
  'heading',
  'html',
]);

export function remarkGlosario(opciones: Opciones) {
  const preparados = prepararTerminos(opciones.terminos);
  const base = opciones.base.endsWith('/') ? opciones.base.slice(0, -1) : opciones.base;

  return (arbol: Nodo, archivo: Archivo): void => {
    const ruta = (archivo.path ?? '').replaceAll('\\', '/');
    if (ruta.endsWith('01-fundamentos/glosario.md')) return;
    recorrer(arbol, preparados, new Set<string>(), base);
  };
}

function recorrer(
  nodo: Nodo,
  terminos: readonly TerminoPreparado[],
  yaEnlazados: Set<string>,
  base: string,
): void {
  if (!nodo.children) return;

  const nuevos: Nodo[] = [];
  for (const hijo of nodo.children) {
    if (hijo.type === 'text' && typeof hijo.value === 'string') {
      const segmentos = partirTexto(hijo.value, terminos, yaEnlazados);
      if (segmentos.length === 1 && segmentos[0]?.tipo === 'texto') {
        nuevos.push(hijo);
        continue;
      }
      for (const seg of segmentos) {
        if (seg.tipo === 'texto') {
          nuevos.push({ type: 'text', value: seg.valor });
        } else {
          nuevos.push({
            type: 'link',
            url: `${base}/01-fundamentos/glosario/#${seg.id}`,
            data: {
              hProperties: {
                className: ['glosario-termino'],
                'data-definicion': seg.definicion,
              },
            },
            children: [{ type: 'text', value: seg.valor }],
          });
        }
      }
    } else {
      if (!SALTAR.has(hijo.type)) recorrer(hijo, terminos, yaEnlazados, base);
      nuevos.push(hijo);
    }
  }
  nodo.children = nuevos;
}
