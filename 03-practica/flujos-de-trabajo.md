# Flujos de trabajo

El agente puede generar código a gran velocidad. Eso es exactamente el
problema: sin un flujo que ordene el trabajo, la velocidad acumula deuda
técnica más rápido de lo que la podés pagar.

Esta sección documenta cinco flujos concretos — feature nueva, debugging,
refactor, documentación y revisión de código — con el paso a paso y prompts
de ejemplo donde ayudan. No son los únicos flujos posibles; son los que
aparecen con más frecuencia y donde el orden de los pasos marca la diferencia
entre una sesión productiva y una hora perdida.

## Feature nueva: planificá antes de codificar

El error más común al trabajar con agentes es pedirle todo de una. "Armame el
módulo de autenticación completo" suena eficiente hasta que, después de
doscientas líneas, descubrís que interpretó la mitad diferente de lo que
pensabas. Corregir sobre una base grande es más caro que arrancar bien.

El patrón que funciona: planificar primero, dividir en fases, revisar entre
fases.

### Paso a paso

1. **Describí el objetivo, no la implementación.** Qué tiene que hacer la
   feature, quién la usa, qué restricciones existen. Dejá que el agente
   proponga cómo encararlo.

2. **Pedile un plan antes de cualquier código.** Si el plan tiene sentido,
   lo aprobás y avanzás. Si no, corregís ahí, cuando no hay nada que
   deshacer.

3. **Dividí en fases chicas con criterio de éxito claro.** Cada fase tiene
   que tener una condición verificable: que compile, que pasen los tests, que
   el endpoint responda.

4. **Revisá entre fases (stop gate).** Leé el diff, corré los tests, chequeá
   que el diseño sigue siendo el que acordaron. Solo después pasás a la
   siguiente fase.

5. **Cerrá cada fase con los archivos que cambiaron.** Si el agente perdió
   hilo, el contexto de la fase anterior está en el historial.

### Prompt de ejemplo — fase de planificación

```text
Necesito agregar autenticación con JWT a esta API REST. El stack es
Node.js + Express, los tests están en Vitest.

Antes de escribir código: armame un plan con las fases de implementación,
los archivos que vas a tocar en cada una y el criterio de éxito de cada
fase. No arranques hasta que yo apruebe el plan.
```

Una vez aprobado el plan, el pedido de la primera fase:

```text
Arrancamos con la fase 1 del plan. Solo eso — no avancemos a la 2 hasta
que yo revise el resultado. Cuando termines, corré los tests existentes y
mostrame el output.
```

El "no avancemos hasta que yo revise" no es burocracia: es el stop gate que
te permite corregir el rumbo antes de que el agente construya sobre una base
equivocada.

## Debugging: diagnosticá antes de tocar código

El instinto cuando hay un bug es pedirle al agente que lo arregle. El
problema es que el agente tiene tanto apuro como vos por ver código corregido,
y eso lleva a hipótesis apresuradas: aplica un fix para el síntoma visible,
el test más obvio vuelve a pasar, y la causa raíz sigue ahí esperando el
peor momento.

La regla del debugging con agentes: **diagnosticá primero, no toques código**.

### Paso a paso

1. **Describí el comportamiento incorrecto con precisión.** Qué esperabas,
   qué obtenés, cómo reproducirlo. Si tenés stack trace o logs, incluílos.

2. **Pedile diagnóstico explícitamente, no fix.** Que liste hipótesis
   ordenadas de más a menos probable, con qué verificaría cada una.

3. **Evaluá las hipótesis vos mismo.** ¿Alguna te resulta obvia? ¿Hay una
   que el agente descartó demasiado rápido? Tu criterio sobre el sistema es
   más valioso que la velocidad del agente.

4. **Pedí el fix recién cuando acordaron la causa.** Y que incluya un test
   que reproduzca el bug para que no vuelva.

5. **Verificá que el fix no rompió nada más.** Corré la suite completa, no
   solo el caso nuevo.

### Prompt de ejemplo — sesión de diagnóstico

```text
Tengo un bug que no logro reproducir de manera consistente.

Comportamiento esperado: el cálculo de descuento devuelve 0 si el carrito
está vacío.
Comportamiento actual: a veces devuelve NaN.
Stack: Node 20, sin framework. El cálculo está en src/carrito/descuento.ts.

Antes de proponer ningún fix: leé el archivo, listá las hipótesis posibles
en orden de probabilidad y decime cómo verificarías cada una. Esperá mi
respuesta antes de modificar nada.
```

Este flujo es deliberadamente más lento al principio. El ahorro está al
final: no terminás con tres "fixes" encadenados, cada uno tapando el error
del anterior.

## Refactor seguro: la red de seguridad primero

Un refactor sin tests es una apuesta. Con agente, esa apuesta se resuelve
más rápido — pero sigue siendo una apuesta. El ritmo correcto es el inverso
al intuitivo: primero la red de seguridad, después los cambios.

### Paso a paso

1. **Antes de refactorizar, asegurate de tener tests que cubran el
   comportamiento existente.** Si no los tenés, pedile al agente que los
   escriba antes de cualquier otro cambio. Los tests describen el contrato
   que el refactor tiene que preservar.

2. **Definí el alcance del refactor con precisión.** Qué cambia, qué no
   cambia, qué archivos están en scope. Fuera de scope, explícito.

3. **Pedí cambios chicos e incrementales, no una reescritura.** Un método a
   la vez, un patrón a la vez. Después de cada paso: correr los tests.

4. **Si los tests fallan después de un cambio, revertí ese cambio antes de
   avanzar.** No apilés cambios sobre un estado roto.

5. **Revisá el diff con atención.** Los refactors son el lugar favorito de
   los cambios de comportamiento accidentales: una condición invertida, un
   valor de retorno diferente, un efecto secundario removido.

### Prompt de ejemplo — refactor por fases

```text
Necesito refactorizar el módulo src/pagos/procesador.ts. El objetivo es
separar la lógica de validación de la lógica de cobro (hoy están mezcladas
en procesarPago).

Paso 1: antes de cualquier cambio, escribí tests que documenten el
comportamiento actual de procesarPago. Cobertura de los casos principales
y los bordes obvios.

No toques el código de producción todavía. Cuando los tests estén, corrélos
para confirmar que pasan en verde y mostrá el output.
```

Una vez que los tests están en verde:

```text
Los tests pasan. Ahora sí: extraé la lógica de validación a una función
separada validarPago. Solo ese cambio. Después de hacerlo, corré los tests
y mostrame el resultado.
```

## Documentación: de lo que existe a lo que se entiende

La documentación es el trabajo que todos saben que hay que hacer y nadie
quiere hacer. Es también uno de los mejores puntos de entrada para trabajar
con agentes: el riesgo de error es bajo, el resultado es fácil de revisar y
el valor es inmediato.

### Paso a paso

1. **Elegí el scope.** Un módulo, un archivo, una función. No "documenta el
   proyecto entero": eso produce documentación genérica que no sirve a nadie.

2. **Pedile que lea el código antes de escribir.** Que entienda qué hace
   realmente, no qué dice el nombre de la función.

3. **Especificá el formato.** JSDoc, docstrings, un README de módulo,
   comentarios en línea, un ADR. Cada uno tiene su convención y su lugar.

4. **Revisá con criterio de precisión, no de estilo.** Lo importante es que
   describe el comportamiento real. Un comentario bonito pero incorrecto es
   peor que ningún comentario.

5. **Si encontrás que el agente documentó algo que el código hace diferente,**
   ese es un bug o una inconsistencia que vale la pena resolver.

### Prompt de ejemplo — documentación de módulo

```text
Leé el archivo src/lib/auth/tokens.ts completo. Luego escribí:

1. Un comentario de módulo al inicio (qué hace, qué no hace, dependencias
   principales).
2. JSDoc para cada función exportada: parámetros, retorno, excepciones que
   puede lanzar, un ejemplo de uso si el comportamiento no es obvio.

No cambies el código, solo agregá documentación. Si encontrás algo que el
código hace de manera poco clara o inconsistente con el nombre, anotalo
como comentario aparte para que yo lo revise.
```

## Revisión de código generado: qué buscar en el diff

Todo lo que el agente escribió pasa por tus ojos antes de quedarse en el
proyecto. No como trámite — como control de calidad real. La velocidad del
agente no vale nada si lo que produce necesita más horas de corrección que
las que ahorró.

### Qué buscar

**Lógica de bordes y manejo de errores.** El agente tiende a modelar el caso
feliz con precisión y a tratar los bordes como un trámite. Buscá: ¿qué pasa
si el input llega vacío, nulo o inesperado? ¿Las excepciones se manejan o se
tragan en silencio?

**Seguridad.** Inputs del usuario que llegan sin sanitizar, queries con
interpolación de strings, secretos hardcodeados o logueados, permisos más
amplios de los necesarios. Son los errores que aparecen en los reportes de
seguridad, no en los tests unitarios.

**Consistencia con el resto del proyecto.** ¿Usa las mismas convenciones de
nombres? ¿Los mismos patrones de error? ¿Las mismas abstracciones que ya
existen? El agente conoce el código que leyó; puede no conocer el que no
leyó.

**Código que solo parece funcionar.** Tests que verifican la implementación
en vez del comportamiento, mocks que hacen que el test pase aunque el código
real falle, condiciones que nunca se cumplen en el entorno de test pero sí
en producción.

**Dependencias nuevas.** ¿Agregó un paquete que no estaba? ¿Es necesario,
actualizado, con licencia compatible?

### Cómo revisar con criterio, no con fe

```text
Revisá el diff de esta sesión con criterio de revisión de PR. Buscá:
errores de lógica (especialmente en bordes y manejo de errores), problemas
de seguridad, inconsistencias con el estilo del proyecto y código que solo
parece funcionar.

Para cada hallazgo: el archivo y línea, el problema concreto y tu sugerencia.
Si no encontrás nada importante, decilo explícitamente.
```

Usá este prompt sobre el propio agente como segunda pasada. El agente que
generó el código y el agente que lo revisa no son el mismo estado de la
conversación: el revisor no tiene el mismo sesgo de confirmación que el
generador.

Y la regla de cierre: si algo en el diff no te cierra y no podés explicar
por qué funciona, no lo aceptes todavía. "No lo entiendo bien pero parece
estar bien" es exactamente el estado mental que produce bugs de producción
meses después.

## Errores típicos en cualquier flujo

| Error | Síntoma | Corrección |
|---|---|---|
| Pedir todo de una | El resultado es grande y difícil de revisar | Dividir en fases con stop gate |
| Seguir sin revisar | Los errores se apilan | Revisar el diff en cada fase |
| No definir el criterio de éxito | El agente "termina" sin terminar | Especificar la condición verificable |
| Ignorar los bordes en la revisión | Bugs en producción | Revisar explícitamente los casos de error |
| Refactorizar sin tests | No sabés si rompiste algo | Tests primero, siempre |

## → Siguiente paso

Estos flujos aplican, sin nombrarlas, dos disciplinas que conviene volver
explícitas: definir el contrato antes de codear y verificar con tests antes
de confiar. El próximo artículo las pone sobre la mesa →
[Método: spec-first y TDD](metodo-spec-first-y-tdd.md).
