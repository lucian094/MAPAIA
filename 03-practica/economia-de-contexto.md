# Economía de contexto y tokens

Cada vuelta del loop de un agente consume tokens: los que entran (instrucciones,
archivos leídos, historial de la conversación) y los que salen (la respuesta y
las acciones). La [ventana de contexto](../01-fundamentos/que-son-los-agentes.md)
es finita, y cuando se llena, algo se resume o se pierde. Si no sabés qué es
un token ni cómo funciona la ventana, el [glosario](../01-fundamentos/glosario.md)
tiene los dos términos en menos de cinco líneas cada uno.

Eso significa que desperdiciar contexto tiene dos consecuencias que se
refuerzan: gastás plata (o cuota) sin necesidad y, al mismo tiempo, el modelo
presta menos atención a lo que importa porque el ruido ocupa espacio. La buena
noticia es que las prácticas que reducen el gasto casi siempre mejoran la
calidad del resultado.

## El doble beneficio: menos costo, mejor resultado

Hay una intuición equivocada que circula bastante: "darle más contexto al
agente siempre es mejor". En la práctica, no funciona así.

Cuando llenás la ventana con archivos que no son relevantes para la tarea, el
modelo los procesa igual: ocupa atención, tarda más y genera respuestas donde
el razonamiento útil compite con ruido. El contexto justo —ni más ni menos que
lo necesario— produce respuestas más precisas y cuesta menos tokens.

Este es el principio que recorre todo lo que sigue: **gastar bien no es solo
una práctica de ahorro, es una práctica de calidad**.

## Tareas chicas y acotadas

Una tarea enorme ("refactorizá todo el módulo de autenticación") fuerza al
agente a leer decenas de archivos, mantener muchos estados en la ventana al
mismo tiempo y tomar decisiones de diseño que quizás no deberías delegar.
El resultado: muchas vueltas del loop, contexto saturado, y mayor probabilidad
de que el agente pierda el hilo a mitad de camino.

La alternativa es partir el trabajo:

```text
Tarea grande (evitar):
  "Refactorizá todo el módulo de autenticación para que use JWT."

Tareas acotadas (preferir):
  1. "Extraé la validación de contraseña de `auth.ts` a una función separada
     en `src/lib/validators.ts`. No cambies el comportamiento, solo movés."
  2. "Ahora reemplazá las sesiones de cookie en `auth.ts` por JWT usando
     la librería ya instalada (`jsonwebtoken`). Los tests están en
     `tests/auth.test.ts`."
  3. "Corré la suite completa y mostrá el resultado."
```

Cada tarea entra y sale con la ventana limpia. El agente no arrastra el estado
de la iteración anterior y vos podés revisar y aprobar cada paso antes de
continuar.

## Dar el contexto justo, no el repo entero

Si el agente tiene que modificar `src/routes/usuarios.ts`, no necesita leer
`src/lib/email.ts`, los tests de otra ruta ni la documentación de onboarding.
Darle el repo completo para una tarea puntual es como pedirle a alguien que
arregle un enchufe y entregarle el plano completo del edificio.

Algunas herramientas como Claude Code leen los archivos por sí solas según
lo que necesitan. Pero cuando podés, orientalas:

```text
Contexto innecesario (evitar):
  "Mirá el proyecto y arreglá el bug del login."

Contexto justo (preferir):
  "El bug está en `src/services/auth.ts`, función `verificarToken`. El token
  llega como undefined cuando el header Authorization viene en minúscula.
  Los tests relevantes están en `tests/auth.test.ts`."
```

El segundo pedido le ahorra al agente varias vueltas de exploración y mete
en la ventana exactamente lo que importa.

## Sesión nueva para tarea nueva

El historial de una conversación larga ocupa tokens en cada vuelta nueva.
Si trabajaste una hora en el módulo de pagos y ahora querés empezar con el
módulo de notificaciones, ese historial no ayuda: solo agrega ruido y achica
la ventana disponible para la nueva tarea.

La práctica más efectiva y más ignorada: empezar una conversación nueva cuando
cambiás de tarea. El agente arranca con la ventana limpia, lee solo lo que
necesita y trabaja con toda la atención disponible.

Esto no significa que pierdas el contexto del proyecto: ese contexto vive en
el archivo de contexto, no en la conversación.

## Apoyarse en el archivo de contexto

Repetir en cada sesión "en este proyecto usamos Vitest, los tests van en
`tests/`, los tipos en `src/types/`" no es solo tedioso: son tokens que gastás
en información que el agente ya debería tener.

El [archivo de contexto](contexto-y-estructura.md) (`CLAUDE.md`, `AGENTS.md`,
`.cursorrules` o el equivalente de tu herramienta) resuelve exactamente eso:
escribe el conocimiento permanente del proyecto una vez y el agente lo lee
automáticamente al inicio de cada sesión. No tenés que reexplicar nada;
el contexto de la nueva tarea entra limpio y directo al punto.

Si aún no tenés uno, la guía de [contexto y estructura](contexto-y-estructura.md)
tiene un ejemplo copiable listo para adaptar.

## Arquitectura agente-friendly: archivos chicos

Los archivos enormes generan un problema doble: cuando el agente los lee,
ocupan gran parte de la ventana, y cuando los edita, aumenta la probabilidad
de que toque partes que no debería.

Un módulo de 800 líneas que hace cinco cosas distintas obliga al agente a leer
todo para entender una parte. Cinco archivos de 150 líneas cada uno con
responsabilidades claras le permiten leer solo el que corresponde.

La [guía de arquitectura](arquitectura.md) desarrolla esto con más detalle:
separación de responsabilidades, nombres que describen lo que contiene un
archivo, límites de módulo que coincidan con unidades de trabajo sensatas.
El resultado es un proyecto más fácil de mantener para vos y más eficiente
para el agente.

## Elegir el modelo según la tarea

No todas las tareas necesitan el modelo más capaz. Usar el modelo más potente
para renombrar variables o formatear JSON es como llamar a un cirujano para
sacar un clavo.

| Tipo de tarea | Modelo recomendado |
|---|---|
| Búsquedas, resúmenes, reformateo, tests unitarios simples | Modelo rápido y económico (Haiku, Flash, DeepSeek V3) |
| Código nuevo de funcionalidad media, debugging de errores conocidos | Modelo de propósito general (Sonnet, GPT-4o mini) |
| Diseño de arquitectura, debugging difícil, tareas que requieren razonamiento extendido | Modelo más capaz (Opus, o1, GPT-4o, Gemini 1.5 Pro) |

La mayoría de las herramientas (Claude Code, Cursor, Copilot, Cline, Continue)
permiten cambiar el modelo por tarea o por sesión. Aprovecharlo no es solo
ahorro: el modelo ligero en tareas mecánicas suele ser más rápido y da
respuestas más directas.

Si usás razonamiento extendido (modo "thinking" de algunos modelos), reservalo
para tareas donde realmente lo necesitás: cuesta muchos más tokens y tiempo.
Para renombrar un método, el costo extra es dinero tirado.

## Pedir resúmenes en lugar de releer

Si necesitás entender un módulo grande antes de pedir un cambio, no tiene
sentido hacer que el agente lo lea completo cada vez. Es más eficiente pedir
un resumen orientado a lo que necesitás:

```text
Menos eficiente:
  "Leé `src/services/pagos.ts` y modificá la función procesarPago para
  aceptar múltiples métodos de pago."

Más eficiente:
  "Resumime en cinco puntos cómo funciona `procesarPago` en
  `src/services/pagos.ts`, específicamente qué parámetros recibe y qué
  devuelve. Después te voy a pedir un cambio."
```

El resumen ocupa mucho menos espacio en la ventana que el archivo completo,
y cuando llegue el pedido de cambio, el contexto relevante ya está presente
en forma condensada. Esta técnica es especialmente útil cuando trabajás con
código ajeno que acabás de incorporar al proyecto.

## Cortar a tiempo cuando el agente patina

Si el agente lleva tres iteraciones dando el mismo error, no agregues una
cuarta vuelta con "intentá de nuevo" o "revisá mejor". Ese patrón casi siempre
termina igual: más tokens gastados, mismo resultado, más frustración.

Las señales de que conviene cortar y reformular:

- Dos respuestas seguidas que repiten el mismo error o la misma solución que
  ya no funcionó.
- El agente empieza a dar explicaciones largas sin hacer nada concreto.
- La ventana de contexto está casi llena y la tarea no terminó.
- Las sugerencias empiezan a contradecir lo que hizo tres pasos atrás.

La estrategia en esos casos:

```text
1. Cortá la sesión.
2. Abrí una nueva conversación.
3. Describí el problema desde cero, pero más acotado: un archivo, una
   función, un comportamiento específico.
4. Si sabés qué intentó y no funcionó, incluilo en el contexto inicial
   para que no repita el mismo camino.
```

Reformular no es perder lo avanzado: es invertir en una sesión que sí
va a llegar a algún lado. Como dice [qué son los agentes](../01-fundamentos/que-son-los-agentes.md),
el costo de una tarea mal planteada no es solo tiempo — son iteraciones que
queman cuota sin acercarse al objetivo.

## Tabla de síntomas y soluciones

| Síntoma de derroche | Qué hacer |
|---|---|
| El agente lee archivos que no tienen que ver con la tarea | Indicá exactamente qué archivos son relevantes en el pedido |
| Repetís los mismos comandos y convenciones en cada sesión | Escribilos en el archivo de contexto (`CLAUDE.md` o equivalente) |
| Una tarea larga terminó con código desordenado o inconsistente | Partila en pasos más chicos, uno por sesión |
| El agente patina en el mismo error tres veces | Cortá, abrí sesión nueva, reformulá más acotado |
| Usás el modelo más potente para todo, incluso tareas mecánicas | Configurá el modelo según el tipo de tarea |
| La ventana se llena antes de terminar la tarea | La tarea es demasiado grande; dividila |
| Mandás el repo entero como contexto "por las dudas" | Indicá solo los archivos que la tarea necesita |

## Componer estas prácticas

Las prácticas anteriores no funcionan de forma aislada: se potencian juntas.

Un flujo que integra todo:

1. Antes de empezar, verificá que tu archivo de contexto tiene los comandos
   y convenciones del proyecto.
2. Dividí la tarea en pasos que entren en una sola sesión.
3. Para cada paso, indicá los archivos concretos y el criterio de éxito.
4. Elegí el modelo apropiado para ese tipo de trabajo.
5. Si el agente lee algo innecesario o va por el camino equivocado, cortá
   antes de que siga acumulando iteraciones.
6. Cuando terminás un paso, abrí sesión nueva para el siguiente.

Lo que obtenés no es solo menos gasto: es un agente que trabaja con más foco
en cada tarea, produce resultados más predecibles y requiere menos correcciones.
En proyectos donde el contexto está bien administrado, la misma herramienta
que patina en sesiones caóticas produce trabajo sólido y revisable.

La relación entre economía de contexto y calidad es directa: menos ruido en
la ventana equivale a más atención del modelo en lo que importa. No es una
metáfora — es la mecánica de cómo funcionan los modelos de lenguaje.

## → Siguiente paso

Con las prácticas de economía de contexto incorporadas, el paso que sigue es
ver cómo encajan en el ciclo completo de trabajo diario: qué tareas se
delegan, cómo se plantean y cómo se revisa lo que el agente devuelve →
[Flujos de trabajo](flujos-de-trabajo.md).
