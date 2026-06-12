import { reescribirLinkMd } from './links-md';

interface NodoMarkdown {
  type: string;
  url?: string;
  children?: NodoMarkdown[];
}

interface ArchivoMarkdown {
  path?: string;
  cwd?: string;
}

interface Opciones {
  base: string;
}

/**
 * Plugin remark: reescribe los links relativos a .md de cada artículo como
 * rutas del sitio (los .md se linkean entre sí en relativo para GitHub).
 */
export function remarkLinksMd(opciones: Opciones) {
  return (arbol: NodoMarkdown, archivo: ArchivoMarkdown): void => {
    const dir = dirRelativa(archivo);
    if (dir === null) return;
    recorrer(arbol, dir, opciones.base);
  };
}

function recorrer(nodo: NodoMarkdown, dir: string, base: string): void {
  if (nodo.type === 'link' && typeof nodo.url === 'string') {
    const nueva = reescribirLinkMd(nodo.url, dir, base);
    if (nueva !== null) nodo.url = nueva;
  }
  for (const hijo of nodo.children ?? []) recorrer(hijo, dir, base);
}

/** Carpeta del archivo .md relativa a la raíz del proyecto, con barras /. */
function dirRelativa(archivo: ArchivoMarkdown): string | null {
  if (!archivo.path) return null;
  const ruta = archivo.path.replaceAll('\\', '/');
  const raiz = (archivo.cwd ?? '').replaceAll('\\', '/');
  const relativa = ruta.startsWith(`${raiz}/`) ? ruta.slice(raiz.length + 1) : ruta;
  return relativa.split('/').slice(0, -1).join('/');
}
