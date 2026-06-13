import { describe, expect, it } from 'vitest';
import { compararPorLectura, extraerTitulo, nombreSeccion } from '../src/lib/contenido';

describe('extraerTitulo', () => {
  it('devuelve el texto del primer encabezado de nivel 1', () => {
    expect(extraerTitulo('# Qué son los agentes\n\nTexto.')).toBe('Qué son los agentes');
  });

  it('ignora líneas previas al encabezado', () => {
    expect(extraerTitulo('\n> nota\n\n# El ecosistema\n')).toBe('El ecosistema');
  });

  it('no confunde encabezados de nivel 2', () => {
    expect(extraerTitulo('## Subtítulo\n\ntexto')).toBeNull();
  });

  it('devuelve null si no hay encabezado', () => {
    expect(extraerTitulo('solo texto plano')).toBeNull();
  });
});

describe('nombreSeccion', () => {
  it('traduce las carpetas conocidas', () => {
    expect(nombreSeccion('01-fundamentos')).toBe('Fundamentos');
    expect(nombreSeccion('02-pathing')).toBe('Pathing');
    expect(nombreSeccion('03-practica')).toBe('Práctica');
    expect(nombreSeccion('04-extensibilidad')).toBe('Extensibilidad');
  });

  it('devuelve la carpeta tal cual si no la conoce', () => {
    expect(nombreSeccion('99-otra')).toBe('99-otra');
  });
});

describe('compararPorLectura', () => {
  it('ordena los fundamentos en orden pedagógico, no alfabético', () => {
    const ids = [
      '01-fundamentos/ecosistema',
      '01-fundamentos/glosario',
      '01-fundamentos/que-son-los-agentes',
    ];
    expect([...ids].sort(compararPorLectura)).toEqual([
      '01-fundamentos/que-son-los-agentes',
      '01-fundamentos/ecosistema',
      '01-fundamentos/glosario',
    ]);
  });

  it('ordena 02-pathing después de fundamentos y en orden de recorrido', () => {
    const ids = [
      '02-pathing/perfil-nativo',
      '02-pathing/autoevaluacion',
      '01-fundamentos/glosario',
      '02-pathing/perfil-experimentado',
      '02-pathing/perfil-explorador',
      '02-pathing/README',
      '02-pathing/perfil-inicial',
    ];
    expect([...ids].sort(compararPorLectura)).toEqual([
      '01-fundamentos/glosario',
      '02-pathing/README',
      '02-pathing/autoevaluacion',
      '02-pathing/perfil-explorador',
      '02-pathing/perfil-inicial',
      '02-pathing/perfil-experimentado',
      '02-pathing/perfil-nativo',
    ]);
  });

  it('ordena 03-practica después del pathing, en orden pedagógico', () => {
    const ids = [
      '03-practica/patrones-de-diseno',
      '02-pathing/perfil-nativo',
      '03-practica/ingenieria-de-prompts',
      '03-practica/metodo-spec-first-y-tdd',
      '03-practica/economia-de-contexto',
      '03-practica/flujos-de-trabajo',
    ];
    expect([...ids].sort(compararPorLectura)).toEqual([
      '02-pathing/perfil-nativo',
      '03-practica/ingenieria-de-prompts',
      '03-practica/economia-de-contexto',
      '03-practica/flujos-de-trabajo',
      '03-practica/metodo-spec-first-y-tdd',
      '03-practica/patrones-de-diseno',
    ]);
  });

  it('los ids desconocidos van después, en orden alfabético', () => {
    const ids = ['02-pathing/zeta', '02-pathing/alfa', '01-fundamentos/glosario'];
    expect([...ids].sort(compararPorLectura)).toEqual([
      '01-fundamentos/glosario',
      '02-pathing/alfa',
      '02-pathing/zeta',
    ]);
  });
});
