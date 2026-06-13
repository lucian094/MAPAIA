# Patrones de diseño

Los patrones de diseño son soluciones probadas a problemas que aparecen una y
otra vez en el desarrollo de software. No son recetas mágicas ni reglas
grabadas en piedra: son vocabulario compartido y punto de partida. La
diferencia entre alguien que los conoce y alguien que no es, en gran medida,
la velocidad a la que reconoce un problema que ya fue resuelto mil veces.

Los agentes manejan bien los patrones clásicos: los aplican, los detectan y
los explican. Pero también los sobrediseñan si se los dejás. Este artículo
cubre cuáles son los más útiles en el día a día, cómo pedirle al agente que
los use, y —igual de importante— cuándo decirle que no.

Si algún término te resulta nuevo, el
[glosario](../01-fundamentos/glosario.md) tiene las definiciones de base.

## Los cinco patrones más frecuentes

### Factory

Problema: tenés que crear objetos de distintos tipos dependiendo de una
condición, y no querés llenar el código de `if/else` o `switch` cada vez que
necesitás un objeto nuevo. Factory centraliza la creación: un único lugar
decide qué tipo construir y el resto del código solo pide "dame uno de estos".

```typescript
// Sin factory: cada consumidor decide cómo crear
const procesador = tipo === "pdf" ? new ProcesadorPDF() : new ProcesadorCSV();

// Con factory: la decisión queda en un solo lugar
const procesador = ProcessorFactory.crear(tipo); // retorna el tipo correcto
```

### Strategy

Problema: tenés un algoritmo que puede variar —ordenar, exportar, calcular
descuentos— y querés cambiar la implementación en tiempo de ejecución sin
tocar quien la usa. Strategy encapsula cada variante detrás de una interfaz
común, y el contexto elige cuál usar.

```typescript
interface Exportador {
  exportar(datos: Datos[]): string;
}

class ExportadorCSV implements Exportador { /* ... */ }
class ExportadorJSON implements Exportador { /* ... */ }

// El contexto no sabe (ni le importa) qué implementación tiene
function generar(datos: Datos[], exportador: Exportador) {
  return exportador.exportar(datos);
}
```

### Observer

Problema: un objeto cambia de estado y otros objetos necesitan enterarse, pero
no querés que el primero sepa exactamente quiénes son ni cuántos son. Observer
desacopla: el sujeto notifica, los observadores reaccionan. Es la base de los
sistemas de eventos, los data bindings y los feeds en tiempo real.

```python
class SistemaDeNotificaciones:
    def __init__(self):
        self._listeners = []

    def suscribir(self, fn):
        self._listeners.append(fn)

    def emitir(self, evento):
        for fn in self._listeners:
            fn(evento)
```

### Repository

Problema: tu lógica de negocio termina llena de queries SQL o llamadas a la
API de persistencia directamente mezcladas con las reglas del dominio.
Repository introduce una capa de abstracción: la lógica le pide "dame los
pedidos pendientes" y el repository sabe cómo traducir eso a una query real,
sea Postgres, MongoDB o un archivo JSON en tests.

```python
class PedidoRepository:
    def pendientes(self) -> list[Pedido]:
        # La lógica de negocio no sabe (ni necesita saber) qué hay acá
        return db.query("SELECT * FROM pedidos WHERE estado = 'pendiente'")
```

### Adapter

Problema: tenés que integrar dos interfaces que no fueron pensadas para
trabajar juntas —una librería externa, una API de terceros, un sistema
legado— sin reescribir ninguna de las dos. Adapter es el traductor en el
medio: convierte las llamadas de una interfaz a la otra. Aparece mucho cuando
cambiás de proveedor o cuando envolvés código externo para poder testearlo.

```typescript
// La librería externa tiene una interfaz que no coincide con la tuya
class AdaptadorMailgun implements EnviadorEmail {
  private cliente: MailgunClient;

  enviar(dest: string, asunto: string, cuerpo: string): void {
    // Traduce tu interfaz a lo que pide Mailgun
    this.cliente.messages().create({ to: dest, subject: asunto, text: cuerpo });
  }
}
```

## Cómo pedirle al agente que aplique un patrón

El agente conoce los patrones y puede aplicarlos si le das suficiente contexto.
Lo importante es ser explícito: decirle qué patrón, en qué código y con qué
objetivo. Sin eso, puede elegir un patrón distinto al que tenías en mente —y
no necesariamente peor, pero sí diferente.

### Pedido de aplicación

```text
En `src/services/notificaciones.ts` tenemos una función `enviarAlerta(tipo)`
que crece con cada tipo nuevo de alerta (email, push, SMS, webhook). Refactorizá
usando el patrón Strategy: cada tipo de envío es una clase que implementa la
interfaz `EnviadorAlerta`. La función principal elige la estrategia según el
tipo y delega. Los tests actuales en `tests/notificaciones.test.ts` deben
seguir pasando sin cambios.
```

Por qué funciona: nombra el patrón, señala el archivo, describe el problema que
motiva el cambio, y da un criterio de éxito verificable.

### Pedido de detección

El agente también puede analizar código existente y decirte qué patrones ya
están (o deberían estar) ahí. Útil cuando tomaste un proyecto ajeno o querés
una segunda opinión sobre el diseño.

```text
Leé `src/api/usuarios.ts` y `src/api/productos.ts` y decime:
1. Qué patrones de diseño reconocés en el código actual (nombrálos y
   explicá dónde aparecen).
2. Qué problemas ves que podrían resolverse con un patrón conocido.
   Para cada uno: qué problema, qué patrón recomendarías y por qué.
No toques nada todavía, solo el análisis.
```

El "no toques nada" al final no es capricho: sin esa aclaración, algunos
agentes pasan directo al refactor sin pedirte confirmación.

## Cuándo NO aplicar un patrón

Este es el punto que los agentes suelen saltear.

### El sobrediseño

Un patrón agrega abstracción. La abstracción tiene un costo: más archivos, más
indirección, más superficie para entender el sistema. Si la abstracción no
compra nada hoy —y "hoy" puede incluir un futuro razonablemente cercano— es
deuda de complejidad, no inversión.

El ejemplo clásico: aplicar Factory para crear objetos que solo tienen un tipo
posible. O usar Observer cuando hay exactamente un listener que nunca cambia.
O montar Repository para una app que solo tiene una fuente de datos y nunca
va a tener otra.

### El patrón buscando problema

Cuando el agente refactoriza o revisa código, a veces propone patrones porque
puede, no porque el código los necesite. "Este código podría mejorar con un
Builder" puede ser cierto técnicamente y completamente innecesario en la
práctica.

La pregunta que corta el exceso: **¿qué problema concreto resuelve esto ahora
mismo?** Si la respuesta es "ninguno, pero si mañana pasa X…", el criterio
para decidir es tuyo, no del agente. Vos conocés la probabilidad real de ese X.

### La señal de alerta en un prompt

Si le pedís al agente refactorizar algo y la respuesta incluye tres patrones
nuevos que no pediste, cinco clases nuevas y una propuesta de reescribir la
arquitectura, frená antes de aceptar. Preguntá:

```text
De los cambios que propusiste, ¿cuáles son necesarios para el objetivo
original y cuáles son opcionales? Listalos separados.
```

Muchas veces el agente lo sabe y te lo va a decir. La mayoría de los cambios
opcionales en ese contexto son sobrediseño.

## Tabla: cuándo usar cada patrón

| Patrón | Señal de que lo necesitás | Señal de que no lo necesitás |
|---|---|---|
| Factory | Varios tipos con lógica de creación distinta | Un solo tipo, creación trivial |
| Strategy | El algoritmo varía según contexto en runtime | Una sola implementación, nunca cambia |
| Observer | Múltiples reacciones a un mismo evento | Un solo listener que no varía |
| Repository | Lógica de negocio mezclada con queries | Una sola fuente de datos, sin necesidad de mockear |
| Adapter | Integrar interfaces incompatibles | Interfaces ya compatibles o controladas por vos |

## La relación con el contexto de proyecto

Un agente que conoce las convenciones del proyecto aplica patrones de forma
más coherente. Si tu proyecto tiene un Repository base, una convención de
nombres para interfaces, o patrones ya establecidos, documentalos en el
archivo de contexto (CLAUDE.md, AGENTS.md, o el que use tu herramienta). Así
el agente extiende lo que existe en lugar de inventar algo paralelo.

Sin ese contexto, va a hacer lo técnicamente correcto pero posiblemente
inconsistente con el resto del código. Las dos cosas a la vez son un problema:
código que funciona pero que no habla el idioma del proyecto.

## → Siguiente paso

Con los patrones de diseño en la caja de herramientas, terminaste el recorrido
de la sección de práctica: prompts, contexto y ahora diseño.

El territorio que sigue es **extensibilidad**: cómo hacer que el agente vaya
más allá del editor. Arranca en [MCP](../04-extensibilidad/mcp.md) —el
protocolo para darle herramientas y datos externos—, sigue con
[skills](../04-extensibilidad/skills.md) —procedimientos empaquetados— y cierra
con [plugins](../04-extensibilidad/plugins.md) —cómo distribuir todo eso.

Tu primera estación de esa sección: [MCP: Model Context
Protocol](../04-extensibilidad/mcp.md).
