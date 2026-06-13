# Método: spec-first y TDD

Los agentes pueden escribir código a gran velocidad. El problema no es la
velocidad: es que esa velocidad amplifica lo que ocurre cuando el punto de
partida está mal definido. Si la tarea no está clara, el agente produce más
código incorrecto más rápido. Si no hay tests, ese código incorrecto llega más
lejos antes de que lo detectes.

Este artículo documenta tres pilares metodológicos que, combinados, convierten
ese riesgo en un proceso controlable: **spec-first**, **TDD** y **revisión
sistemática**. No son inventos de esta guía — son prácticas de ingeniería de
software que preexisten a los agentes. Pero con agentes se vuelven más
necesarias, no menos.

Si buscás el paso a paso concreto de cómo aplicar estos principios en
sesiones reales de desarrollo, eso ya está documentado en
[Flujos de trabajo](flujos-de-trabajo.md). Acá se explica el método en sí:
por qué funciona, cómo se estructura, qué problema resuelve en cada capa.

---

## Spec-first: definir el contrato antes del código

### El problema que resuelve

Cuando le pedís a un agente "agregá autenticación con JWT", el agente empieza
a escribir código de inmediato. Eso parece eficiente. El problema es que
"autenticación con JWT" puede significar docenas de cosas distintas: tokens
en cookie o en header, refresh tokens o no, expiración configurable o fija,
un endpoint de logout o dejar eso para después. El agente elige. Y cuando
termina, descubrís que eligió diferente de lo que tenías en la cabeza.

Con un desarrollador humano, esa ambigüedad se resuelve en la conversación
natural: "¿Querés que el refresh sea automático?", "¿El logout invalida el
token o solo en el cliente?". Con un agente, la conversación es unidireccional:
vos le pedís, él ejecuta. Si la especificación era ambigua, el trabajo de
corrección lo hacés vos después, sobre código ya escrito.

Spec-first es la práctica de escribir el contrato antes de que el agente
toque el código. No es un documento formal de requerimientos — es una nota
lo suficientemente precisa como para que no quede ninguna decisión importante
librada a la interpretación del modelo.

### Por qué pesa más con agentes

Con código escrito a mano, una especificación vaga te cuesta el tiempo de la
reescritura. Con un agente, ese costo se multiplica: el agente puede generar
en diez minutos lo que te llevaría dos horas escribir, pero también puede
generar en diez minutos lo que te llevaría dos horas corregir. La asimetría
de velocidad hace que el costo de arrancar mal sea proporcionalmente mayor.

Hay otro factor: el agente ejecuta lo que entendió, no lo que quisiste decir.
No tiene forma de saber que esa "validación simple" que pediste tiene que
cumplir también con la restricción de seguridad que está implícita en vos.
Una spec clara externaliza ese conocimiento implícito y lo pone donde el
agente pueda leerlo.

### Cómo se ve una spec mínima

Una spec mínima no es larga. Tiene tres partes: qué construir, los criterios
de aceptación, y qué queda explícitamente fuera de alcance.

```markdown
## Spec: validación de email en registro

### Qué construir
Función `validarEmail(input: string): boolean` en `src/lib/validacion.ts`.
Devuelve `true` si el string tiene exactamente un `@`, con al menos un
carácter antes y al menos un punto en el dominio.

### Criterios de aceptación
- `validarEmail("usuario@dominio.com")` → `true`
- `validarEmail("usuario@dominio")` → `false` (sin punto en dominio)
- `validarEmail("@dominio.com")` → `false` (sin usuario)
- `validarEmail("usuario@")` → `false` (sin dominio)
- `validarEmail("")` → `false` (vacío)
- `validarEmail("dos@@dominio.com")` → `false` (doble arroba)

### Fuera de alcance
- No valida si el dominio existe (sin DNS lookup)
- No maneja internacionalización de dominios (IDN)
- No valida longitud máxima (eso es otra función)
```

Esta spec tiene quince líneas. No es burocracia — es el mínimo que necesitás
para que el agente no tome decisiones que son tuyas. Cada criterio de
aceptación es un test que podés escribir. El "fuera de alcance" es tan
importante como el "qué construir": previene que el agente haga más de lo
que acordaron y termines revisando código que no pediste.

### El encadenado spec → plan → fases

Una spec mínima no reemplaza el plan de implementación. El orden es:

1. **Spec**: qué construir y qué no. Lo escribís vos.
2. **Plan**: cómo construirlo, en qué fases, qué archivos toca cada una.
   Lo propone el agente, vos lo aprobás.
3. **Fases**: implementación incremental con criterio de éxito verificable
   en cada parada.

Ese encadenado está documentado en detalle, con prompts de ejemplo, en
[Flujos de trabajo](flujos-de-trabajo.md) — sección "Feature nueva: planificá
antes de codificar". La spec es el insumo que hace que ese flujo funcione.
Sin spec, el plan que propone el agente puede estar bien estructurado pero
apuntar en la dirección equivocada.

---

## TDD: el ciclo rojo-verde-refactor

### El ciclo en tres pasos

TDD (Test-Driven Development) es una disciplina de escritura de código que
invierte el orden habitual: primero escribís el test, después el código que
lo hace pasar, después limpiás lo que quedó.

El ciclo tiene tres momentos, cada uno con nombre propio:

**Rojo**: escribís un test que describe el comportamiento que querés. El test
falla porque el código todavía no existe. Eso no es un error — es el punto
de partida intencional. Un test que falla antes de que escribas el código
confirma dos cosas: que el test está probando algo real, y que el código que
vas a escribir efectivamente hace falta.

**Verde**: escribís el código mínimo que hace pasar ese test. Solo eso. No
anticipés la siguiente funcionalidad, no generalices todavía, no optimices.
El objetivo en esta etapa es pasar de rojo a verde con el cambio más pequeño
posible.

**Refactor**: con los tests en verde, podés limpiar con confianza. Renombrás,
reorganizás, eliminás duplicaciones. Los tests son la red que te permite
cambiar la estructura sin miedo: si algo se rompe, el test te lo dice de
inmediato.

El ciclo se repite para cada comportamiento nuevo. Con el tiempo, los tests
acumulados forman una especificación ejecutable del sistema: un documento que
no solo describe lo que hace el código sino que lo verifica cada vez que lo
corrés.

### Por qué es la red de seguridad con agentes

Con un desarrollador humano, TDD es una práctica recomendada. Con un agente,
es la diferencia entre "confiar" y "verificar".

El agente puede generar código que funciona en los casos que probó pero que
falla en bordes que no consideró. Puede escribir una función que pasa su
propio test manual pero que no cubre el comportamiento que vos necesitás.
Puede refactorizar de manera que parece correcta y no lo es. Sin tests que
definan el comportamiento esperado, no tenés manera de saber cuál de esas
cosas pasó.

Con tests escritos antes de la implementación:
- El agente tiene un criterio objetivo de éxito (el mismo que vos definiste).
- Cada test que falla es información precisa sobre qué falta implementar.
- Cada refactor del agente queda contenido por los tests existentes.
- Tu revisión del diff tiene un punto de apoyo: ¿los tests pasan? ¿Los tests
  cubren los casos que importan?

El dato de **Peng et al. (2023, arXiv:2302.06590)** sobre el 55,8 % de mejora
de velocidad con asistencia de IA no dice nada sobre la calidad del código
producido — mide velocidad de completado de tarea. La calidad la da la
metodología, no la herramienta.

### TDD con agentes: el test primero, siempre

Cuando trabajás con un agente, el ciclo TDD tiene que ser explícito en los
prompts. El comportamiento por defecto del agente es escribir implementación
y tests juntos, o la implementación primero y los tests después. Ese orden
produce tests que verifican la implementación en lugar de verificar el
comportamiento — el agente tiende a escribir tests que pasan porque los
escribió para pasar, no porque cubran los bordes.

Para revertir ese orden, el prompt tiene que ser explícito:

```text
Necesito implementar la función `calcularDescuento(precio: number,
porcentaje: number): number` en src/lib/precios.ts.

Paso 1 — SOLO esto: escribí los tests en tests/precios.test.ts que
definan el comportamiento esperado. Incluí casos normales, bordes
(descuento cero, descuento completo) y entradas inválidas (negativo,
mayor a 100). No escribas la implementación todavía.

Cuando los tests estén escritos, corrélos. Tienen que fallar (la función
no existe). Mostrame el output de la ejecución fallida.
```

Una vez confirmado el rojo:

```text
Los tests están en rojo. Ahora escribí la implementación mínima de
`calcularDescuento` que haga pasar esos tests. Solo lo necesario para
pasar — no anticipes casos que los tests no cubren.

Cuando termines, corré los tests y mostrame el resultado.
```

El output del segundo prompt es el criterio de éxito: todos los tests en
verde. Si alguno falla, el agente tiene información precisa sobre qué
corregir. Si todos pasan, podés pasar al refactor con confianza.

### TDD para código nuevo vs. "tests primero en refactor"

Hay una diferencia importante entre este método y lo que se documenta en el
flujo de refactor seguro de [Flujos de trabajo](flujos-de-trabajo.md).

En el refactor seguro, los tests se escriben **antes del refactor** para
documentar el comportamiento *existente* del código. Son una red de seguridad
que atrapa cambios de comportamiento accidentales. El código ya existe y el
objetivo es preservarlo.

En TDD para código nuevo, los tests se escriben **antes de la implementación**
para definir el comportamiento *deseado*. No hay código que preservar — los
tests son la especificación ejecutable de lo que vas a construir. El ciclo
empieza en rojo por diseño.

| Situación | Cuándo escribís los tests | Para qué sirven |
|---|---|---|
| Código nuevo (TDD) | Antes de la implementación | Definir el comportamiento deseado |
| Refactor seguro | Antes del refactor | Documentar el comportamiento existente |

Los dos son "tests primero". Lo que cambia es qué describen esos tests y cuál
es el punto de partida del trabajo.

---

## Revisión sistemática: el tercer pilar

Spec y TDD cubren dos preguntas: *qué construir* y *que el código ande*. Hay
una tercera pregunta que ninguna de las dos responde: *cómo quedó*.

Un código puede pasar todos los tests y aun así tener problemas de seguridad,
inconsistencias con el resto del proyecto, dependencias innecesarias o lógica
de bordes frágil. Los tests verifican el comportamiento que vos anticipaste.
No verifican lo que no se te ocurrió poner en la spec.

La revisión del diff cierra ese círculo. Y para que cierre de verdad, tiene
que ser sistemática: el mismo conjunto de preguntas, en el mismo orden, cada
vez.

### Los tres pilares en secuencia

Spec → TDD → revisión no son tres opciones alternativas. Son tres capas:

- **Spec define QUÉ**: el contrato que el código tiene que cumplir.
- **TDD verifica QUE ANDE**: los tests confirman que el contrato se cumple.
- **Revisión audita CÓMO QUEDÓ**: la lectura del diff detecta lo que los
  tests no atrapan.

Saltear cualquiera de las tres crea un punto ciego. Saltear la spec produce
código que anda pero no hace lo que necesitabas. Saltear TDD produce código
que hace lo que pediste pero sin red de seguridad. Saltear la revisión
produce código que pasa los tests pero llega a producción con problemas que
ningún test cubría.

### Un checklist de revisión reutilizable

La revisión del diff no debería ser un proceso distinto cada vez. Un checklist
fijo convierte la auditoría en algo repetible y menos dependiente del estado
de atención del momento:

```markdown
## Checklist de revisión de código generado

### Lógica
- [ ] ¿Los casos de borde están cubiertos (vacío, nulo, fuera de rango)?
- [ ] ¿Los errores se manejan o se tragan en silencio?
- [ ] ¿Hay condiciones que nunca se cumplen en test pero sí en producción?

### Seguridad
- [ ] ¿Hay inputs del usuario que llegan sin sanitizar?
- [ ] ¿Hay secretos hardcodeados o logueados?
- [ ] ¿Los permisos son los mínimos necesarios?

### Consistencia
- [ ] ¿Usa las mismas convenciones de nombres del proyecto?
- [ ] ¿Reutiliza abstracciones que ya existen?
- [ ] ¿Los tests verifican comportamiento o solo implementación?

### Dependencias
- [ ] ¿Se agregó alguna dependencia nueva?
- [ ] ¿Era necesaria, o hay algo en el proyecto que ya lo hacía?
```

Este checklist no reemplaza el criterio — lo estructura. Los ítems son fijos;
la profundidad con que revisás cada uno depende del riesgo del cambio.

El prompt de revisión que ya está documentado en la sección
["Revisión de código generado"](flujos-de-trabajo.md) de Flujos de trabajo
es la versión conversacional de este checklist: le pedís al propio agente
que revise su diff con ese criterio, como segunda pasada independiente.

### Auditoría como hábito, no como corrección

La diferencia entre un equipo que escala bien con agentes y uno que no, no
está en las herramientas que usa. Está en si la revisión es un hábito
sistemático o una corrección de emergencia.

Cuando la revisión es sistemática, cada sesión de trabajo agrega valor
controlado al proyecto. Cuando es reactiva, cada sesión crea deuda que se
acumula hasta que revisar se vuelve prohibitivo.

El Stack Overflow Survey 2025 muestra que la adopción de herramientas de IA
en desarrollo creció sostenidamente, pero la satisfacción con los resultados
es más heterogénea. La variable que separa los resultados positivos de los
negativos no es el modelo — es el proceso alrededor del modelo.

Formalizar esa auditoría — convertir el checklist en un comando propio, en
un hook del flujo, en una skill del agente — es el paso siguiente a
consolidar el método manual. Ese camino llega en la sección de extensibilidad.

---

## Los tres pilares juntos

El método completo, en una sola vista:

| Pilar | Pregunta que responde | Cuándo se aplica | Qué produce |
|---|---|---|---|
| Spec-first | ¿Qué construir? | Antes de cualquier código | Contrato explícito para el agente |
| TDD | ¿Anda lo que construiste? | Antes de la implementación | Tests como especificación ejecutable |
| Revisión sistemática | ¿Cómo quedó? | Después de cada sesión | Auditoría repetible del diff |

No son etapas opcionales de un flujo ideal. Son la estructura mínima que hace
que trabajar con agentes sea sostenible más allá de la primera semana. Sin
spec, el agente optimiza hacia el objetivo equivocado. Sin TDD, no tenés red.
Sin revisión, el proyecto acumula deuda hasta que la revisión se vuelve
prohibitiva.

Con los tres en su lugar, el rol que tomás frente al agente es el que
funciona: definir con precisión, verificar con rigor, auditar con criterio.

---

## → Siguiente paso

Desde acá, los caminos se separan de nuevo según tu experiencia:

- Si estás siguiendo la **Línea Exploradora** o la **Línea Inicial**, lo que sigue es ver cómo el trabajo se organiza en el proyecto: estructura de archivos, convenciones escritas y contexto de inicio. Eso es la arquitectura del proyecto con agentes: → [Arquitectura](arquitectura.md).
- Si venís por la **Línea Experimentada** o la **Línea Nativa**, tu flujo base ya está sólido. El próximo nivel es darle brazos a tu agente conectándolo con tus bases de datos y herramientas externas usando el protocolo estándar de la industria: → [Model Context Protocol (MCP)](../04-extensibilidad/mcp.md).
