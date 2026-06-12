/**
 * Parsing y búsqueda del glosario. Fuente: 01-fundamentos/glosario.md, cuyo
 * formato es fijo: cada término es un `## Encabezado` seguido de UN párrafo
 * de texto plano. La sección `## → Siguiente paso` no es un término.
 */

export interface Termino {
  termino: string;
  definicion: string;
}

export function extraerTerminos(markdown: string): Termino[] {
  const terminos: Termino[] = [];
  let actual: { termino: string; lineas: string[] } | null = null;

  const cerrar = () => {
    if (actual) {
      terminos.push({
        termino: actual.termino,
        definicion: actual.lineas.join(' ').trim(),
      });
      actual = null;
    }
  };

  for (const lineaCruda of markdown.split('\n')) {
    const linea = lineaCruda.trim();
    const encabezado = linea.match(/^##\s+(.+)$/);
    if (encabezado?.[1]) {
      cerrar();
      const titulo = encabezado[1].trim();
      // Las secciones que empiezan con → (p. ej. "→ Siguiente paso") no son términos.
      if (!titulo.startsWith('→')) {
        actual = { termino: titulo, lineas: [] };
      }
      continue;
    }
    if (actual && linea !== '' && !linea.startsWith('<!--') && !linea.startsWith('-->')) {
      actual.lineas.push(linea);
    }
  }
  cerrar();
  return terminos;
}

// Diacríticos combinantes (U+0300 a U+036F) que quedan sueltos tras NFD.
// Construidos con fromCharCode para que este archivo sea 100 % ASCII acá.
const DIACRITICOS = new RegExp(
  '[' + String.fromCharCode(0x0300) + '-' + String.fromCharCode(0x036f) + ']',
  'g',
);
// La ñ se preserva con un centinela (U+0001) para que la limpieza de
// diacríticos no la convierta en n.
const CENTINELA_ENIE = String.fromCharCode(1);

/** Minúsculas y sin tildes (la ñ se conserva), para búsqueda tolerante. */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .replaceAll('ñ', CENTINELA_ENIE)
    .normalize('NFD')
    .replace(DIACRITICOS, '')
    .replaceAll(CENTINELA_ENIE, 'ñ');
}

/** Id apto para ancla HTML: minúsculas, sin tildes, separado con guiones. */
export function idTermino(termino: string): string {
  return normalizar(termino)
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
