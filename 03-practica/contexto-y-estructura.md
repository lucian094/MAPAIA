# Contexto y estructura

Si trabajaste un rato con un agente, notaste algo: el mismo pedido da
resultados muy distintos según el proyecto. Pedís "agregá un test" y en un
repo salen tests con Jest, en otro con pytest, en un tercero el agente inventa
una librería que no existe. El problema no es el modelo — es que el agente
arrancó sin contexto.

Los archivos de contexto son la solución a ese problema. Son la forma de
escribir el conocimiento implícito de tu proyecto para que el agente lo lea
antes de trabajar, en lugar de tener que repetírselo en cada conversación.

## Qué es un archivo de contexto

Es un archivo Markdown que vivie en la raíz del repo (o en un lugar que la
herramienta lee automáticamente) y que le dice al agente:

- cómo está organizado el proyecto,
- qué comandos usás para desarrollar, testear y deployar,
- qué convenciones no están en el código,
- qué no debe tocar o asumir.

No es documentación para humanos —aunque puede servir de las dos cosas—. Es
una instrucción que el agente procesa en cada sesión antes de hacer nada. La
diferencia práctica: en vez de empezar cada conversación con "ojo que en este
proyecto los tests van en `tests/` y usamos Vitest", lo escribís una vez y
el agente lo sabe siempre.

### Los nombres según la herramienta

Cada herramienta lee un archivo con nombre propio:

| Archivo | Herramienta que lo lee |
|---|---|
| `CLAUDE.md` | Claude Code (Anthropic) |
| `AGENTS.md` | Codex CLI (OpenAI) y otros agentes que adoptaron el estándar |
| `.cursorrules` | Cursor |
| `.github/copilot-instructions.md` | GitHub Copilot (modo agente) |

La buena noticia: el contenido útil es casi el mismo en todos. Si escribís un
buen `CLAUDE.md`, adaptarlo para Cursor o Codex CLI es cuestión de minutos.
Algunos proyectos mantienen los dos o tres archivos con contenido casi idéntico
para no depender de una sola herramienta.

## Por qué importa más de lo que parece

Sin archivo de contexto, el agente trabaja con lo que puede inferir: la
estructura de directorios, los imports, los nombres de las funciones. Eso a
veces alcanza. Pero el conocimiento que *no está en el código* —las decisiones
de diseño, los atajos prohibidos, el estilo de commit, el por qué de esa
estructura rara— se pierde. Y el agente lo va a inventar, con total confianza.

Con archivo de contexto, convertís ese conocimiento tácito en instrucción
explícita. El agente no adivina: lee. Eso se traduce en menos correcciones,
menos iteraciones perdidas y resultados que se parecen a lo que ya existe en
el proyecto en lugar de a lo que el modelo considera razonable por defecto.

## Un ejemplo copiable

Este es un `CLAUDE.md` para una API de tareas ficticia. Está escrito para que
lo copies, lo ajustes y lo tengas en tu repo en diez minutos:

```markdown
# CLAUDE.md

## Qué es este proyecto

API REST de gestión de tareas en Node.js + TypeScript. El backend expone
endpoints CRUD para tareas y usuarios; el frontend (carpeta `web/`) es una
SPA en React que consume esa API. No hay base de datos: los datos se guardan
en memoria durante el proceso (suficiente para desarrollo y tests).

## Comandos

- `npm run dev`   — levanta el servidor con recarga automática (puerto 3000)
- `npm test`      — corre la suite completa (Vitest)
- `npm run build` — compila TypeScript a `dist/`
- `npm run lint`  — ESLint + Prettier en modo check (no modifica archivos)

## Arquitectura

- `src/routes/`   — definiciones de rutas (un archivo por recurso)
- `src/services/` — lógica de negocio; las rutas solo llaman servicios
- `src/models/`   — tipos e interfaces TypeScript
- `tests/`        — tests unitarios e integración (estructura espeja `src/`)

## Convenciones

- TypeScript strict: no usar `any`, salvo que haya un comentario explicando
  por qué.
- Errores: siempre tirar instancias de `AppError` (en `src/lib/errors.ts`),
  nunca strings crudos ni `new Error()` directo.
- Los tests de integración levantan el servidor real en un puerto aleatorio;
  no mockear la capa HTTP salvo excepciones justificadas.
- Commits en inglés, imperativo, sin punto final: `add email validation`,
  `fix null check in task service`.

## Restricciones

- NO modificar `src/lib/auth.ts` sin revisar con el equipo: la lógica de
  tokens tiene dependencias no obvias.
- NO instalar dependencias nuevas sin confirmar primero.
- El archivo `.env.example` documenta las variables requeridas; nunca commitear
  `.env` real.
```

Notás algunas cosas en ese ejemplo:

- **Los comandos son exactos y ejecutables.** No "corré los tests" sino `npm test`.
- **La arquitectura tiene una oración por carpeta.** No un diagrama completo,
  solo lo suficiente para que el agente sepa dónde crear archivos nuevos.
- **Las restricciones son concretas.** "No modificar X sin Y" es accionable;
  "tener cuidado con el código sensible", no.
- **El "por qué" aparece cuando importa.** "La lógica de tokens tiene
  dependencias no obvias" es la diferencia entre una instrucción que se sigue
  y una que se ignora.

## Qué conviene poner

En orden de prioridad:

1. **Comandos de desarrollo y test.** Es lo que el agente necesita en cada
   tarea. Si no sabe cómo correr los tests, va a intentar inferirlo o
   preguntarte.
2. **Convenciones que no están en el código.** El estilo de commit, la
   política de manejo de errores, el patrón que el equipo decidió seguir
   aunque no haya un linter para forzarlo.
3. **Mapa de la arquitectura** (versión mínima). Qué hace cada carpeta
   principal; dónde van los archivos nuevos según su tipo.
4. **Restricciones explícitas.** Archivos que no se tocan, dependencias que
   no se agregan sin consultar, decisiones que no son del agente.
5. **Contexto del proyecto** (dos o tres oraciones). Qué resuelve, en qué
   stack, para quién.

## Qué NO poner

- **Toda la documentación del proyecto.** Un archivo de contexto de 800
  líneas se comporta peor que uno de 80: el modelo le presta menos atención
  a todo cuando hay demasiado.
- **Lo que el agente puede inferir solo.** Si todos tus archivos TypeScript
  tienen extensión `.ts`, no hace falta aclararlo. Si usás ESLint y hay un
  `.eslintrc` en la raíz, el agente lo va a ver.
- **Instrucciones contradictorias.** "Seguí las convenciones del proyecto" y
  a continuación una lista que las contradice. El agente va a elegir una al
  azar.
- **Cosas que cambian muy seguido.** Si ponés versiones exactas de dependencias
  o URLs de entornos de staging, el archivo va a quedar desactualizado en días.

La regla práctica: si el agente no lo puede leer del código ni de la
estructura de archivos, y si equivocarse en ese punto genera retrabajo,
entonces va en el archivo de contexto.

## Buenas prácticas de mantenimiento

**Ubicación:** en la raíz del repo, siempre. Las herramientas lo buscan ahí;
si lo metés en un subdirectorio, puede que no lo encuentren.

**Longitud:** menos de 100 líneas es el objetivo para proyectos medianos. Si
superás 150, revisá qué podés sacar. La legibilidad importa: un archivo de
contexto confuso produce un agente confuso.

**Actualizaciones:** el momento ideal para actualizar el archivo de contexto
es cuando corregís al agente por segunda vez por el mismo motivo. Si le
aclaraste dos veces que los tests van en `tests/unit/` y no en `tests/`, eso
va al archivo. Si no lo escribís ahí, se lo vas a repetir indefinidamente.

**Versionado:** como cualquier archivo del repo. Los cambios en el contexto
tienen impacto en el comportamiento del agente — vale la pena que queden en
el historial de git para entender por qué se cambió algo.

**Equipo:** si trabajás con otras personas, el archivo de contexto es también
un documento de onboarding implícito. Lo que ponés ahí es lo que el equipo
considera que un colaborador nuevo (humano o agente) necesita saber antes de
tocar el código.

## Lo que no hace el archivo de contexto

No reemplaza un prompt bien escrito para la tarea concreta. El archivo de
contexto da el marco permanente del proyecto; el prompt de cada tarea da el
objetivo específico. Los dos trabajan en capas: el archivo de contexto reduce
la fricción de base, el prompt de la tarea define adónde ir. Si una tarea
requiere contexto muy específico que no aplica al proyecto en general, ese
contexto va en el prompt de la tarea, no en el archivo.

Tampoco reemplaza los tests, el linter ni la revisión del diff. El agente puede
leer que "no usar `any`" y aun así usarlo si el compilador no lo frena. El
archivo de contexto cambia las probabilidades; las herramientas de verificación
cambian las garantías.

## Empezar sin parálisis

Si todavía no tenés un archivo de contexto, no hace falta escribirlo completo
de entrada. Un punto de partida suficiente para la primera semana:

1. Los tres o cuatro comandos que más corrés (`dev`, `test`, `build`, `lint`).
2. El nombre de la carpeta de tests y el framework que usás.
3. Una o dos restricciones que el agente ya te rompió en alguna sesión previa.

Eso solo va a eliminar el 80 % de las correcciones repetidas. Lo demás se
agrega con el tiempo, cuando encontrás algo que el agente asumió mal y no
querés volver a explicar.

El archivo de contexto más útil no es el que alguien planificó de cero: es el
que creció junto con el proyecto, una línea por tropiezo.

## Documentar las decisiones: ADRs

El archivo de contexto le dice al agente las reglas activas del proyecto:
qué comandos usar, qué convenciones respetar, qué no tocar. Pero hay una
dimensión que no cubre: el *por qué histórico* de esas reglas. ¿Por qué
la arquitectura tiene esa forma y no otra? ¿Por qué se descartó la opción
que parece obvia? Ese conocimiento tampoco está en el código, y tampoco se
puede inferir. Si no se escribe, desaparece.

Los **ADRs** (Architecture Decision Records) son registros cortos —un
archivo por decisión— que capturan exactamente eso: una decisión puntual,
el contexto que la motivó, la alternativa que se consideró y las
consecuencias esperadas. No son documentación exhaustiva; son bitácoras
de momentos específicos en que el proyecto tomó un camino en vez de otro.

### Por qué importa con agentes

Cuando un agente propone refactorizar algo, migrar a otra biblioteca o
cambiar una estructura, puede estar contradiciendo una decisión que el
equipo ya tomó y evaluó con cuidado. Si esa decisión no está escrita, el
agente no tiene forma de saberlo —y vos terminás explicando la historia
del proyecto en el chat, de nuevo.

Con los ADRs, el agente puede leer el historial antes de proponer. No va
a contradecir una decisión documentada sin razón, igual que no va a
violar una restricción del archivo de contexto. La diferencia es la capa:
el archivo de contexto fija las reglas de hoy; los ADRs explican cómo
se llegó hasta acá.

### Formato mínimo

```markdown
# ADR-0001: Almacenamiento en memoria para el MVP

**Fecha:** 2025-03-10

## Contexto

El MVP necesita persistencia de datos. Las opciones evaluadas fueron
SQLite, PostgreSQL y almacenamiento en memoria durante el proceso.

## Decisión

Usamos almacenamiento en memoria. Para el alcance del MVP (demo + pruebas
con datos ficticios) no se justifica el overhead de configurar una base
de datos real. La decisión se revisará cuando el producto salga de demo.

## Consecuencias

- El servidor arranca sin dependencias externas: fácil de correr en
  cualquier entorno.
- Los datos no persisten entre reinicios: comportamiento esperado y
  documentado para los usuarios del MVP.
- Cuando se migre a persistencia real, los servicios de datos van a
  necesitar una capa de abstracción que hoy no existe.

## Alternativas descartadas

- **SQLite:** viable, pero agrega una dependencia y complejidad de
  migraciones para un MVP con vida útil corta.
- **PostgreSQL:** descartado hasta que haya requisito de persistencia real.
```

### Dónde viven y cómo los usa el agente

La convención habitual es una carpeta `docs/adr/` en la raíz del repo,
con un archivo por decisión nombrado `0001-titulo-breve.md`. El número
garantiza orden cronológico; el título permite leerlos sin abrirlos.

Para que el agente los aproveche, basta con una línea en el archivo de
contexto que le indique dónde están: `"Las decisiones de arquitectura
están en docs/adr/ — leelas antes de proponer cambios estructurales."`.
El agente los va a consultar cuando la tarea lo amerite.

**La distinción que vale la pena recordar:** el archivo de contexto son
las reglas vigentes; los ADRs son la bitácora de por qué esas reglas
existen. Se complementan: uno sin el otro deja un hueco que el agente
—y alguien nuevo en el equipo— van a llenar con suposiciones.

## → Siguiente paso

Ya sabés escribir el contexto que el agente lee. Lo que sigue es usarlo con
cabeza: ese contexto es un recurso finito y cada token cuesta, así que conviene
saber cómo gastarlo bien →
[Economía de contexto y tokens](economia-de-contexto.md).
