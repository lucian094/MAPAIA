/**
 * Lógica pura sobre las entradas de la colección de contenido.
 * Los .md de la raíz no llevan frontmatter (son Markdown puro legible en
 * GitHub): el título se extrae del primer encabezado `# `.
 */

const NOMBRES_SECCION: Record<string, string> = {
  '01-fundamentos': 'Fundamentos',
  '02-pathing': 'Pathing',
  '03-practica': 'Práctica',
  '04-extensibilidad': 'Extensibilidad',
};

/**
 * Orden de lectura sugerido para el índice de la portada. Incluye también
 * los .md que no tienen estación en el mapa (README, autoevaluación,
 * glosario), por eso no sale de src/data/mapa.ts.
 */
const ORDEN_LECTURA = [
  '01-fundamentos/que-son-los-agentes',
  '01-fundamentos/ecosistema',
  '01-fundamentos/glosario',
  '02-pathing/README',
  '02-pathing/autoevaluacion',
  '02-pathing/perfil-explorador',
  '02-pathing/perfil-inicial',
  '02-pathing/perfil-experimentado',
  '02-pathing/perfil-nativo',
];

export function extraerTitulo(cuerpo: string): string | null {
  for (const linea of cuerpo.split('\n')) {
    const coincidencia = linea.match(/^#\s+(.+)$/);
    if (coincidencia?.[1]) return coincidencia[1].trim();
  }
  return null;
}

export function nombreSeccion(carpeta: string): string {
  return NOMBRES_SECCION[carpeta] ?? carpeta;
}

export function compararPorLectura(a: string, b: string): number {
  const indiceA = ORDEN_LECTURA.indexOf(a);
  const indiceB = ORDEN_LECTURA.indexOf(b);
  if (indiceA !== -1 && indiceB !== -1) return indiceA - indiceB;
  if (indiceA !== -1) return -1;
  if (indiceB !== -1) return 1;
  return a.localeCompare(b, 'es');
}
