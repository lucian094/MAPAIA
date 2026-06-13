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
  // Sección de práctica: transbordos de las tres líneas técnicas.
  // Zigzag alrededor de y=4 para que las etiquetas no se pisen; el mapa quedó
  // ancho a propósito (el zoom/paneo del SVG es la forma de leerlo de cerca).
  {
    id: 'ingenieria-de-prompts',
    articulo: '03-practica/ingenieria-de-prompts',
    nombre: 'Prompts',
    resumen: 'Cómo escribir instrucciones efectivas: especificidad, contexto, ejemplos, iteración.',
    x: 7,
    y: 3,
  },
  {
    id: 'contexto-y-estructura',
    articulo: '03-practica/contexto-y-estructura',
    nombre: 'Contexto',
    resumen: 'Archivos de contexto (CLAUDE.md, AGENTS.md) y ADRs para configurar el agente.',
    x: 9,
    y: 5,
  },
  {
    id: 'economia-de-contexto',
    articulo: '03-practica/economia-de-contexto',
    nombre: 'Tokens',
    resumen: 'Cómo desarrollar gastando menos tokens y aprovechando mejor la ventana de contexto.',
    x: 11,
    y: 3,
  },
  {
    id: 'flujos-de-trabajo',
    articulo: '03-practica/flujos-de-trabajo',
    nombre: 'Flujos',
    resumen: 'Workflows por tipo de tarea: feature, debugging, refactor, docs, revisión.',
    x: 13,
    y: 5,
  },
  {
    id: 'metodo-spec-first-y-tdd',
    articulo: '03-practica/metodo-spec-first-y-tdd',
    nombre: 'Spec + TDD',
    resumen: 'Spec-first y TDD: definir el contrato y verificar con tests antes de confiar.',
    x: 15,
    y: 3,
  },
  {
    id: 'arquitectura',
    articulo: '03-practica/arquitectura',
    nombre: 'Arquitectura',
    resumen: 'Código agente-friendly = código limpio: módulos chicos, nombres claros, doc mínima.',
    x: 17,
    y: 5,
  },
  {
    id: 'patrones-de-diseno',
    articulo: '03-practica/patrones-de-diseno',
    nombre: 'Patrones',
    resumen: 'Patrones comunes, cómo pedir que se apliquen o detecten, y cuándo NO usarlos.',
    x: 19,
    y: 3,
  },
  // Sección de extensibilidad (Fase 5): continúa el zigzag a la derecha.
  {
    id: 'mcp',
    articulo: '04-extensibilidad/mcp',
    nombre: 'MCP',
    resumen: 'Model Context Protocol: conectar agentes a herramientas y datos externos.',
    x: 21,
    y: 5,
  },
  {
    id: 'skills',
    articulo: '04-extensibilidad/skills',
    nombre: 'Skills',
    resumen: 'Capacidades empaquetadas y reutilizables: anatomía, creación y buenas prácticas.',
    x: 23,
    y: 3,
  },
  {
    id: 'plugins',
    articulo: '04-extensibilidad/plugins',
    nombre: 'Plugins',
    resumen: 'Extensiones del ecosistema: qué existe y cuándo crear uno propio.',
    x: 25,
    y: 5,
  },
];

// Estaciones de práctica agrupadas en tiers (ver spec de rebalanceo):
//  - Tier A (onboarding): ingenieria-de-prompts → lo saltea quien ya usa agentes.
//  - Tier B (oficio):     arquitectura, patrones-de-diseno → lo domina el dev con años.
//  - Tier C (palanca):    el resto → lo necesita cualquiera que USE agentes en serio.
// Exploradora e inicial recorren todo (arrancan de cero); las avanzadas se
// quedan solo con el núcleo (Tier C), para que cada línea sea un recorrido
// visiblemente distinto.
const PRACTICA = [
  'ingenieria-de-prompts',
  'contexto-y-estructura',
  'economia-de-contexto',
  'flujos-de-trabajo',
  'metodo-spec-first-y-tdd',
  'arquitectura',
  'patrones-de-diseno',
];

// Núcleo de práctica (Tier C, sin ecosistema que ya va como fundamento en la
// ruta): lo recorren todas las líneas técnicas; las avanzadas, solo esto.
const PRACTICA_NUCLEO = [
  'contexto-y-estructura',
  'economia-de-contexto',
  'flujos-de-trabajo',
  'metodo-spec-first-y-tdd',
];

// Sección de extensibilidad (Fase 5): la suman las cuatro líneas. Es la cima
// técnica del recorrido; el nativo es quien más la aprovecha.
const EXTENSIBILIDAD = ['mcp', 'skills', 'plugins'];

export const LINEAS: Linea[] = [
  {
    perfil: 'explorador',
    nombre: 'Línea Exploradora',
    colorVar: '--linea-explorador',
    para: 'Todavía no programás, pero querés usar agentes en tu PYME o proyectos.',
    foco: 'Entender qué son y, si te entusiasma, recorrer todo el camino para aplicarlos.',
    // El curso completo queda abierto: arranca conceptual y, para quien quiera
    // ir más allá, llega hasta el final como la inicial.
    ruta: ['perfil-explorador', 'que-son-los-agentes', 'ecosistema', ...PRACTICA, ...EXTENSIBILIDAD],
  },
  {
    perfil: 'inicial',
    nombre: 'Línea Inicial',
    colorVar: '--linea-inicial',
    para: 'Sabés programar pero todavía no trabajaste en entornos reales.',
    foco: 'Desarrollar criterio y aprender a evaluar lo que el agente produce.',
    ruta: ['perfil-inicial', 'que-son-los-agentes', 'ecosistema', ...PRACTICA, ...EXTENSIBILIDAD],
  },
  {
    perfil: 'experimentado',
    nombre: 'Línea Experimentada',
    colorVar: '--linea-experimentado',
    para: 'Tenés años de experiencia, pero la IA todavía no entró a tu flujo.',
    foco: 'Integrar agentes sin perder control ni calidad.',
    // Saltea el oficio de software (arquitectura, patrones) y la intro de
    // prompts: ya los domina. Conserva qué-son por la evidencia/limitaciones.
    ruta: ['perfil-experimentado', 'que-son-los-agentes', 'ecosistema', ...PRACTICA_NUCLEO, ...EXTENSIBILIDAD],
  },
  {
    perfil: 'nativo',
    nombre: 'Línea Nativa',
    colorVar: '--linea-nativo',
    para: 'Ya usás agentes todos los días.',
    foco: 'Sistematizar, medir, extender y contagiar al equipo.',
    // El recorrido más corto: ya domina onboarding (qué-son, prompts) y oficio
    // (arquitectura, patrones). Solo el núcleo agéntico.
    ruta: ['perfil-nativo', 'ecosistema', ...PRACTICA_NUCLEO, ...EXTENSIBILIDAD],
  },
];

/** .md de contenido que no son estaciones del mapa (exigido por tests/mapa.test.ts). */
export const SIN_ESTACION = [
  '01-fundamentos/glosario',
  '02-pathing/README',
  '02-pathing/autoevaluacion',
];
