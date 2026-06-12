import type { Perfil } from '../lib/perfil';

/**
 * Fuente única del mapa de metro: líneas (perfiles), estaciones (temas) y
 * rutas de lectura. Agregar un tema al sitio = agregar el .md + una estación
 * acá (o una entrada en SIN_ESTACION); tests/mapa.test.ts valida la
 * consistencia en ambas direcciones.
 *
 * x/y son celdas de una grilla (no píxeles): la conversión a coordenadas SVG
 * vive en src/lib/mapa-svg.ts. Las rutas crecen en las Fases 4 y 5 a medida
 * que se publica el contenido de práctica y extensibilidad.
 */

export interface Estacion {
  /** Id corto, único en el mapa. */
  id: string;
  /** Id de la colección de contenido: ruta del .md sin extensión. */
  articulo: string;
  /** Etiqueta visible en el mapa (corta). */
  nombre: string;
  /** Una línea para el tooltip. */
  resumen: string;
  x: number;
  y: number;
}

export interface Linea {
  perfil: Perfil;
  nombre: string;
  /** Custom property del color en src/styles/theme.css. */
  colorVar: string;
  /** A quién apunta (portada y resultado del test). */
  para: string;
  /** Qué gana quien la recorre. */
  foco: string;
  /** Ids de estaciones en orden de lectura. La primera es la cabecera. */
  ruta: string[];
}

export const ESTACIONES: Estacion[] = [
  {
    id: 'perfil-explorador',
    articulo: '02-pathing/perfil-explorador',
    nombre: 'Perfil explorador',
    resumen: 'Cabecera de la Línea Exploradora: entender los agentes sin escribir código.',
    x: 1,
    y: 1,
  },
  {
    id: 'perfil-inicial',
    articulo: '02-pathing/perfil-inicial',
    nombre: 'Perfil inicial',
    resumen: 'Cabecera de la Línea Inicial: construir criterio desde el día uno.',
    x: 1,
    y: 3,
  },
  {
    id: 'perfil-experimentado',
    articulo: '02-pathing/perfil-experimentado',
    nombre: 'Perfil experimentado',
    resumen: 'Cabecera de la Línea Experimentada: integrar la IA sin perder el control.',
    x: 1,
    y: 5,
  },
  {
    id: 'perfil-nativo',
    articulo: '02-pathing/perfil-nativo',
    nombre: 'Perfil nativo',
    resumen: 'Cabecera de la Línea Nativa: del uso intensivo al uso sistemático.',
    x: 1,
    y: 7,
  },
  {
    id: 'que-son-los-agentes',
    articulo: '01-fundamentos/que-son-los-agentes',
    nombre: 'Qué son los agentes',
    resumen: 'Agente vs. chatbot vs. autocompletado, el loop y las limitaciones reales.',
    x: 3,
    y: 3,
  },
  {
    id: 'ecosistema',
    articulo: '01-fundamentos/ecosistema',
    nombre: 'El ecosistema',
    resumen: 'El mapa de herramientas por categoría y los criterios para elegir la tuya.',
    x: 5,
    y: 4,
  },
];

export const LINEAS: Linea[] = [
  {
    perfil: 'explorador',
    nombre: 'Línea Exploradora',
    colorVar: '--linea-explorador',
    para: 'Todavía no programás, pero los agentes ya te tocan de cerca.',
    foco: 'Entender qué son, qué prometen de verdad y cómo hablar con quienes los usan.',
    ruta: ['perfil-explorador', 'que-son-los-agentes', 'ecosistema'],
  },
  {
    perfil: 'inicial',
    nombre: 'Línea Inicial',
    colorVar: '--linea-inicial',
    para: 'Sabés programar pero todavía no trabajaste en entornos reales.',
    foco: 'Desarrollar criterio y aprender a evaluar lo que el agente produce.',
    ruta: ['perfil-inicial', 'que-son-los-agentes', 'ecosistema'],
  },
  {
    perfil: 'experimentado',
    nombre: 'Línea Experimentada',
    colorVar: '--linea-experimentado',
    para: 'Tenés años de experiencia, pero la IA todavía no entró a tu flujo.',
    foco: 'Integrar agentes sin perder control ni calidad.',
    ruta: ['perfil-experimentado', 'que-son-los-agentes', 'ecosistema'],
  },
  {
    perfil: 'nativo',
    nombre: 'Línea Nativa',
    colorVar: '--linea-nativo',
    para: 'Ya usás agentes todos los días.',
    foco: 'Sistematizar, medir, extender y contagiar al equipo.',
    ruta: ['perfil-nativo', 'ecosistema'],
  },
];

/** .md de contenido que no son estaciones del mapa (exigido por tests/mapa.test.ts). */
export const SIN_ESTACION = [
  '01-fundamentos/glosario',
  '02-pathing/README',
  '02-pathing/autoevaluacion',
];
