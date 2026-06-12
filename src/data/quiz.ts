import type { Perfil } from '../lib/perfil';

/**
 * Preguntas del test de perfil (/test) y derivación a perfil.
 * ⚠️ Los textos se espejan en 02-pathing/autoevaluacion.md (la versión
 * legible en GitHub): si cambia uno, cambiar el otro. tests/quiz.test.ts
 * valida la sincronía. El orden de opciones es siempre A=inicial,
 * B=experimentado, C=nativo.
 *
 * El perfil explorador no participa de la mayoría: lo decide
 * PREGUNTA_PROGRAMA (filtro previo). Quien no escribe código va directo a
 * explorador; el resto del cuestionario asume que programás.
 */

/** Pregunta de filtro previa. Respuesta "todavía no" → perfil explorador. */
export const PREGUNTA_PROGRAMA = '¿Escribís código, o estás aprendiendo a programar?';

export interface OpcionQuiz {
  perfil: Perfil;
  texto: string;
}

export interface PreguntaQuiz {
  texto: string;
  opciones: OpcionQuiz[];
}

export const PREGUNTAS: PreguntaQuiz[] = [
  {
    texto: '¿Cuál describe mejor tu experiencia programando?',
    opciones: [
      {
        perfil: 'inicial',
        texto:
          'Estoy estudiando o dando mis primeros pasos: todavía no trabajé en proyectos con usuarios reales.',
      },
      {
        perfil: 'experimentado',
        texto: 'Trabajo (o trabajé) años en proyectos reales; el oficio no es el problema.',
      },
      {
        perfil: 'nativo',
        texto: 'Tengo experiencia profesional y la IA ya es parte de mi forma de trabajar.',
      },
    ],
  },
  {
    texto:
      '¿Qué relación tenés hoy con los agentes de IA (Claude Code, Cursor, Copilot y compañía)?',
    opciones: [
      {
        perfil: 'inicial',
        texto: 'Uso IA seguido, pero más como chatbot que como agente, y a veces le creo de más.',
      },
      {
        perfil: 'experimentado',
        texto: 'Poca o ninguna: no me convencen, o no encontré el momento de probarlos en serio.',
      },
      {
        perfil: 'nativo',
        texto: 'Uso uno o varios agentes casi todos los días.',
      },
    ],
  },
  {
    texto: 'Te muestran un diff generado por un agente. ¿Qué te pasa?',
    opciones: [
      {
        perfil: 'inicial',
        texto: 'Me cuesta evaluarlo: si los tests pasan y se ve prolijo, lo doy por bueno.',
      },
      {
        perfil: 'experimentado',
        texto: 'Lo reviso como cualquier código ajeno — con el doble de desconfianza.',
      },
      {
        perfil: 'nativo',
        texto: 'Sé qué buscar: los errores típicos del código generado ya me los conozco.',
      },
    ],
  },
  {
    texto:
      '¿Configuraste alguna vez un archivo de contexto (CLAUDE.md, AGENTS.md, .cursorrules) o conectaste un servidor MCP?',
    opciones: [
      { perfil: 'inicial', texto: 'Todavía no sé bien qué es eso.' },
      { perfil: 'experimentado', texto: 'Sé de qué se trata, pero nunca lo apliqué.' },
      { perfil: 'nativo', texto: 'Sí, es parte de cómo trabajo.' },
    ],
  },
  {
    texto: 'Cuando un agente te dice "listo, ya quedó arreglado", ¿qué hacés?',
    opciones: [
      {
        perfil: 'inicial',
        texto: 'Tiendo a creerle, sobre todo si la explicación suena convincente.',
      },
      {
        perfil: 'experimentado',
        texto: 'No le creo nada hasta verlo correr con mis propios ojos.',
      },
      {
        perfil: 'nativo',
        texto: 'Tengo un hábito armado: diff, tests y verificación antes de aceptar.',
      },
    ],
  },
  {
    texto: '¿Qué venís a buscar a MAPAIA?',
    opciones: [
      {
        perfil: 'inicial',
        texto: 'Aprender a usar la IA bien desde el principio, sin agarrar vicios.',
      },
      {
        perfil: 'experimentado',
        texto:
          'Decidir si esto vale la pena — y si la vale, sumarlo sin perder control ni calidad.',
      },
      {
        perfil: 'nativo',
        texto: 'Sistematizar lo que ya hago: medir, extender y contagiar al equipo.',
      },
    ],
  },
];

/** Perfiles que pueden salir de la mayoría, en orden de desempate. */
const ORDEN_DERIVACION = ['inicial', 'experimentado', 'nativo'] as const satisfies
  readonly Perfil[];

/**
 * La opción más elegida gana. Empate: gana el perfil que aparece primero en
 * ORDEN_DERIVACION (inicial → experimentado → nativo) — ante la duda, la
 * ruta que refuerza más fundamentos. Es la misma regla que documenta
 * 02-pathing/autoevaluacion.md ("la primera en el orden A, B, C"). El
 * explorador no participa: lo decide PREGUNTA_PROGRAMA.
 */
export function derivarPerfil(respuestas: readonly Perfil[]): Perfil {
  const puntos: Record<Perfil, number> = { explorador: 0, inicial: 0, experimentado: 0, nativo: 0 };
  for (const respuesta of respuestas) puntos[respuesta] += 1;
  let ganador: Perfil = ORDEN_DERIVACION[0];
  for (const perfil of ORDEN_DERIVACION) {
    if (puntos[perfil] > puntos[ganador]) ganador = perfil;
  }
  return ganador;
}
