# Arquitectura agente-friendly

Hay una creencia implícita en el mundo de los agentes: que el código viejo,
complejo o mal organizado es el problema, y que si le dás un proyecto prolijo
al agente todo va a fluir. La creencia es casi correcta, pero está puesta al
revés. La verdad es más simple y más útil: el código que ayuda al agente es
exactamente el mismo código que ayuda a cualquier humano que llega nuevo. La
pregunta no es "¿cómo organizo esto para el agente?" sino "¿cómo organizaría
esto para que cualquiera pueda entenderlo en veinte minutos?"

Esto no es filosofía. Tiene una explicación mecánica.

## La ventana de contexto manda

Un agente trabaja con lo que puede leer. La ventana de contexto de los
modelos actuales es grande, pero no infinita, y tu proyecto sí puede serlo.
En la práctica, cuando le pedís al agente que trabaje sobre un módulo, él
decide qué archivos leer, los mete en contexto y trabaja con esa vista
parcial. Lo que no cupo, no existe para él.

Un archivo de 800 líneas que mezcla parseo, lógica de negocio y formateo de
salida es una ruleta: el agente va a ver parte y va a adivinar el resto. Un
módulo de 120 líneas con una sola responsabilidad, en cambio, entra completo
y el modelo lo puede razonar sin lagunas.

Esto tiene una consecuencia directa: el tamaño de tus archivos no es una
preferencia estética. Es la diferencia entre un agente que trabaja con
información completa y uno que trabaja con fragmentos.

## Módulos chicos con una sola responsabilidad

La regla de una responsabilidad no es nueva. La traen el SOLID de los noventa,
el Clean Code de los dosmiles, las guías de estilo de cada lenguaje. Lo que
cambia con los agentes es que la penalización por romperla se hace inmediata
y visible.

Mirá estos dos escenarios para el mismo sistema: un procesador de pedidos.

**Estructura problemática:**

```text
src/
└── pedidos.ts          ← 650 líneas: validación, cálculo de precios,
                           descuentos, persistencia en DB, envío de emails,
                           formateo de respuesta HTTP y logs
```

**Estructura agente-friendly:**

```text
src/
├── pedidos/
│   ├── validar.ts      ← reglas de negocio: ¿el pedido es válido?
│   ├── calcular.ts     ← precio final con descuentos
│   ├── persistir.ts    ← escritura en la base de datos
│   ├── notificar.ts    ← envío de emails y notificaciones
│   └── index.ts        ← orquesta: importa y conecta los módulos
└── api/
    └── pedidos.ts      ← maneja la request HTTP, nada más
```

Con la primera estructura, si le pedís "modificá el cálculo de descuentos",
el agente tiene que leer el archivo entero, identificar qué partes son
relevantes, y navegar 650 líneas para hacer un cambio que tal vez requiere
tocar veinte. Con la segunda, lee `calcular.ts` y ya está: sabe exactamente
dónde está la lógica y qué no debe tocar.

El mismo beneficio aplica cuando hay un bug: en la versión plana, el agente
podría "arreglar" el bug con un efecto colateral en el envío de emails porque
ambas cosas comparten la misma función. En la versión separada, ese error
estructural es casi imposible.

## Nombres que dicen lo que son

Un agente que lee `utils.ts`, `helpers.py` o `misc.js` tiene que adivinar.
Esos nombres son agujeros negros: absorben funciones que no saben dónde más
vivir y crecen sin control. Lo mismo pasa con `data`, `service` o `manager`
sin calificador.

Algunos contrastes:

| Nombre vago | Nombre descriptivo |
|---|---|
| `utils.ts` | `formatear-fecha.ts`, `calcular-iva.ts` |
| `helpers/index.py` | `helpers/normalizar-texto.py` |
| `DataManager` | `RepositorioPedidos` |
| `processStuff()` | `aplicarDescuentoVolumen()` |
| `handler.ts` | `rutaCrearPedido.ts` |

La pregunta de control es: ¿podés leer el nombre y saber qué hace sin abrir
el archivo? Si la respuesta es no, el nombre está haciendo trampa.

Para el agente esto es literal: decide si leer un archivo o no basándose en
su nombre y en la lista de imports que lo rodean. Un nombre descriptivo es
un filtro que le ahorra vueltas innecesarias de contexto.

## Separación de responsabilidades en la práctica

La separación no es solo cuestión de archivos. También es cuestión de capas.
Un patrón que aparece en casi todos los proyectos maduros:

```python
# MAL: todo mezclado
def procesar_pedido(datos_request):
    if not datos_request.get("email"):
        return {"error": "email requerido"}, 400
    precio = datos_request["precio"] * 1.21
    if datos_request.get("cupon") == "DESCUENTO10":
        precio = precio * 0.9
    conn = psycopg2.connect(DATABASE_URL)
    conn.execute("INSERT INTO pedidos ...", [precio, datos_request["email"]])
    requests.post(MAIL_URL, json={"to": datos_request["email"]})
    return {"ok": True}, 201
```

```python
# BIEN: capas separadas
def procesar_pedido(datos_request):       # capa: API / entrada
    pedido = validar_pedido(datos_request)
    precio = calcular_precio(pedido)
    guardar_pedido(pedido, precio)         # capa: persistencia
    notificar_confirmacion(pedido)         # capa: efectos externos
    return {"ok": True}, 201
```

En la versión mezclada, si le pedís al agente "agregá lógica de descuento por
volumen", tiene que entender el contexto completo de la función para no romper
la parte de persistencia o de emails. En la versión separada, la respuesta
correcta es casi obvia: la lógica nueva va en `calcular_precio()`, y el resto
no se toca.

Este efecto se potencia con los tests: cuando la lógica está separada, podés
pedirle al agente "cubrí `calcular_precio` con tests" y él puede hacerlo sin
necesidad de mockearse la base de datos ni el servidor de correo.

## Documentación mínima viable

"Documentación" no significa un PDF de 40 páginas. Significa contexto en el
lugar donde quien llega nuevo lo necesita.

Tres piezas, por orden de impacto:

**1. El archivo de contexto del proyecto** (CLAUDE.md, AGENTS.md o similar).
Treinta líneas bien escritas que le digan al agente: cómo correr el proyecto,
dónde vive cada tipo de archivo, qué convenciones tiene el equipo, qué no
debe tocar. Es el documento con mejor retorno de inversión de todo el
ecosistema. Sin este archivo, el agente infiere reglas leyendo el código; con
él, las conoce desde el principio.

**2. El propósito del módulo**, en el encabezado del archivo o en un comentario
breve. No la implementación: el *por qué* existe y qué problema resuelve.

```typescript
/**
 * Calcula el precio final de un pedido aplicando descuentos y tasas.
 * NO maneja persistencia ni efectos externos — solo matemática pura.
 * Tests: tests/calcular-precio.test.ts
 */
export function calcularPrecio(pedido: Pedido, cupon?: string): number {
```

Ese bloque le dice al agente tres cosas en cuatro líneas: qué hace, qué no
hace, y dónde están los tests. Con eso puede razonar sin leer el cuerpo
completo.

**3. El README de sección** para directorios que agrupan subsistemas. Tres
párrafos: qué vive acá, cómo se conecta con el resto, y qué no debe ir ahí.

La documentación excesiva es tan problemática como la ausente: archivos de
docs que se desactualizan, comentarios que mienten sobre lo que hace el
código, READMEs que son marketing interno. El criterio es uno: ¿este texto
reduce ambigüedad o la agrega?

## Los tests como guía de diseño

Hay un indicador sencillo de si la separación de responsabilidades funcionó:
¿podés testear cada módulo sin levantar todo el sistema?

Si para testear `calcular_precio` tenés que conectarte a la base de datos o
mockear el servidor de correo, la función tiene demasiadas dependencias
escondidas. Si podés llamarla con una entrada y comparar la salida, el módulo
está bien aislado.

Para el agente esto tiene consecuencias prácticas concretas. Cuando le pedís
"escribí tests para esta función", el agente puede hacerlo de dos maneras:

- **Módulo bien aislado:** lee la función, entiende las entradas y las salidas
  esperadas, escribe tests que llaman directo a esa función. Es rápido, preciso
  y los tests reflejan la lógica real.
- **Módulo mezclado:** tiene que entender efectos secundarios, mockear
  colaboradores, y adivinar qué parte de la función es lo que querés testear.
  El resultado es tests frágiles que se rompen cuando cambia algo que no
  tiene nada que ver con la lógica que te importa.

El Stack Overflow Developer Survey 2025 muestra que la generación de tests es
una de las tareas de mayor adopción entre desarrolladores que usan agentes —
precisamente porque cuando los módulos están bien delimitados, los agentes son
sorprendentemente buenos en eso. Cuando no lo están, la tasa de reescritura
manual se dispara.

La consecuencia práctica: si encontrás que el agente escribe tests malos o
frágiles en un módulo, es casi siempre una señal de diseño, no de una
limitación del modelo.

## El principio unificador

Todo lo anterior converge en una idea:

> El código agente-friendly es código limpio. No hay un conjunto especial de
> reglas para "preparar" un proyecto para agentes. Hay una sola buena práctica
> de ingeniería, vista con los lentes de un colaborador con ventana de contexto
> limitada.

Lo que cambia cuando trabajás con agentes no son los principios: es la
velocidad con que la deuda técnica te cobra. Un módulo de 800 líneas con
cuatro responsabilidades mezcladas frena a cualquier desarrollador humano que
llega nuevo. Al agente lo frena igual y además le impide completar el contexto
en una sola lectura.

Invertido: cuando un repo tiene módulos chicos, nombres claros y documentación
mínima, el agente puede trabajar bien en él. Pero, como efecto secundario, el
onboarding de personas nuevas también mejora, el mantenimiento se vuelve más
predecible y los reviews de código son más rápidos. No es un trade-off —
es la misma mejora aplicada a colaboradores de tipos distintos.

## El proyecto como interlocutor

Hay una forma de pensar la arquitectura que resulta útil: el proyecto le
habla al agente igual que le hablaría a un colega que llega con buena
voluntad pero sin contexto previo. Si ese colega tiene que leer un archivo de
700 líneas para entender qué hace una función, el proyecto está mal diseñado.
Si puede leer un módulo de 100 líneas, entender su propósito y trabajar sobre
él sin riesgo de romper algo invisible, el proyecto está bien diseñado — para
humanos y para agentes por igual.

El contexto acotado, los archivos enfocados y las interfaces claras no son
optimizaciones para la IA. Son las condiciones básicas del software
mantenible. Los agentes simplemente las hacen más urgentes.

## → Siguiente paso

Una vez que el proyecto tiene estructura favorable, el siguiente problema es
cómo interactuar con el agente de manera que esa estructura rinda fruto:
patrones de pedidos que funcionan, cuándo delegar y cuándo no, cómo dar
contexto sin sobreexplicar → [Patrones de diseño](patrones-de-diseno.md).
