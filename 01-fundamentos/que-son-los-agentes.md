# Qué son (y qué no son) los agentes de IA

"Agente" se convirtió en la palabra de moda del desarrollo de software y, como
toda palabra de moda, se usa para vender casi cualquier cosa. Antes de sumar
una de estas herramientas a tu flujo de trabajo conviene tener claro qué hace
de verdad, qué no hace, y por qué a veces falla de maneras en que un programa
tradicional jamás fallaría.

Este archivo pone los cimientos de todo MAPAIA. Si algún término te resulta
nuevo, tenés el [glosario](glosario.md) a un link de distancia.

## Tres herramientas que se confunden seguido

La IA aplicada a programar llega en tres formatos distintos, y confundir sus
alcances es la fuente número uno de frustración (y de opiniones tajantes mal
calibradas).

### El autocompletado con IA

Sugiere código mientras escribís, directamente en el editor: terminás de
tipear la firma de una función y te propone el cuerpo completo. Es la
experiencia clásica de GitHub Copilot en sus comienzos. Vos seguís siendo
quien escribe el programa; la herramienta acelera el tipeo. No conversa, no
planifica, no ejecuta nada.

### El chatbot

Una conversación en una ventana aparte: le pegás un error o un fragmento de
código, te responde con una explicación o una versión corregida, y vos copiás
y pegás de vuelta a tu proyecto. Claude, ChatGPT o Gemini usados desde el
navegador funcionan así. El punto débil es estructural: el chatbot solo ve lo
que vos le mostrás. Si el bug depende de un archivo que no pegaste, la
respuesta va a ser una conjetura dicha con tono seguro.

### El agente

Recibe un objetivo —"agregá validación de email al formulario de registro y
cubrila con tests"— y trabaja para cumplirlo: explora tu proyecto, lee los
archivos que necesita, edita código, ejecuta los tests, lee los errores y
vuelve a intentar. Claude Code, Codex CLI o los modos agente de Cursor y de
Copilot entran en esta categoría. Tu rol cambia: pasás de escribir cada línea
a supervisar el trabajo — definir bien la tarea, revisar lo que hizo y decidir
si está a la altura.

| Característica | Autocompletado | Chatbot | Agente |
|---|---|---|---|
| Dónde actúa | En la línea que escribís | En una ventana de chat | Sobre el proyecto completo |
| Qué contexto ve | El archivo abierto | Lo que vos le pegues | Lo que él decide leer |
| Quién aplica los cambios | Vos | Vos | El agente (con tu permiso) |
| ¿Itera solo? | No | No | Sí, hasta terminar o trabarse |
| Riesgo típico | Aceptar sin leer | Respuesta sin contexto | Cambios sin supervisión |

## Cómo funciona por dentro: percibir, razonar, actuar

Un agente no es una inteligencia de otra categoría: es un modelo de lenguaje
(LLM) metido adentro de un loop, con permiso para usar herramientas. El
esquema completo, en pseudocódigo:

```text
mientras la tarea no esté terminada:
    percibir → leer archivos, salidas de comandos, mensajes de error
    razonar  → decidir el próximo paso usando el modelo de lenguaje
    actuar   → editar un archivo, correr un comando, preguntar al usuario
```

Tres piezas marcan la diferencia con un chatbot:

- **Las herramientas.** El agente puede leer y escribir archivos, ejecutar
  comandos y buscar en el código. Cada acción le devuelve información nueva
  que alimenta la siguiente vuelta del loop.
- **El criterio de fin.** El loop corta cuando la tarea se cumplió (los tests
  pasan, el build compila), cuando se trabó, o cuando necesita una decisión
  que es tuya.
- **La supervisión.** Las herramientas serias piden permiso antes de las
  acciones riesgosas: borrar archivos, ejecutar comandos nuevos, tocar la
  configuración. Ese diseño no es burocracia — es la red de seguridad.

Si entendés este loop, entendés el 80 % del comportamiento de cualquier
agente: por qué lee archivos antes de tocar nada, por qué a veces da vueltas
sin avanzar, y por qué un mensaje de error claro lo ayuda más que mil palabras
tuyas.

## Qué puede hacer bien un agente hoy

- **Tareas con criterio de éxito verificable.** "Que pasen los tests", "que
  compile", "que el linter no se queje". Si el agente puede comprobar por sí
  mismo que terminó, el loop trabaja a su favor.
- **Trabajo mecánico y extenso.** Renombrar un concepto en cuarenta archivos,
  migrar un patrón repetido, escribir tests para código que ya existe.
- **Exploración de código ajeno.** Explicarte qué hace un módulo, rastrear de
  dónde sale un valor, resumir la arquitectura de un repo que acabás de
  clonar.
- **Primeros borradores.** De una función, de un documento técnico, de un
  script de migración. Borrador no es versión final: ahí entrás vos.

## Qué no le podés delegar (todavía)

- **Las decisiones de producto y de diseño.** El agente optimiza lo que le
  pediste, no lo que tu usuario necesita. Decidir *qué* construir sigue
  siendo problema tuyo.
- **Código que no sabés evaluar.** Si no podés distinguir una solución
  correcta de una que solo lo parece, el agente multiplica el riesgo en vez
  de reducirlo. Sobre esto vuelve, con detalle, el perfil inicial del
  pathing.
- **El contexto implícito.** Las convenciones no escritas del equipo, el
  porqué histórico de esa solución rara, lo que se decidió en una reunión:
  nada de eso está en el repo y el agente no lo puede adivinar. La buena
  noticia es que gran parte se puede escribir — lo vemos en la sección de
  práctica.

## Las limitaciones reales

### La ventana de contexto

El modelo solo puede "ver" una cantidad limitada de texto por vez (medida en
tokens). Tu proyecto entero casi nunca entra, así que el agente trabaja con
una vista parcial: los archivos que decidió leer. Y cuando una conversación se
alarga demasiado, lo más viejo se resume o directamente se pierde. Por eso las
tareas acotadas funcionan mejor que los pedidos épicos.

### Las alucinaciones

Un modelo de lenguaje genera texto *probable*, no texto *verificado*. Puede
inventar una función de una librería, citar una opción de configuración que no
existe, o asegurar que el bug quedó arreglado sin haberlo comprobado. La
defensa no es la fe sino la estructura: tests, compilador, linter y tu
revisión. Con agentes, la regla es "confiá, pero verificá" — y automatizá la
verificación todo lo que puedas.

### El costo

Cada vuelta del loop consume tokens, y los tokens cuestan plata (o cuota de tu
plan). Una tarea mal planteada puede quemar muchas iteraciones en dar vueltas
sin avanzar. No es una razón para no usar agentes; es una razón para plantear
tareas claras y cortar a tiempo cuando el agente patina.

### La seguridad

Un agente con permiso para ejecutar comandos es, literalmente, un programa que
ejecuta comandos en tu máquina. Leé lo que estás aprobando. Las herramientas
serias traen modos de permiso configurables: usalos a tu favor en lugar de
aprobar todo en automático para que no moleste.

## Cómo se ve en la práctica

Un ejemplo realista de tarea bien delegada:

> Agregá validación de email en `registro.ts`: rechazar correos sin @ o sin
> dominio. Los tests están en `tests/registro.test.ts` — sumá ahí los casos
> nuevos. Cuando termines, corré la suite completa y mostrame el resultado.

Qué tiene de bueno este pedido:

- **Apunta a archivos concretos.** El agente no tiene que adivinar dónde
  trabajar: menos vueltas de loop, menos costo, menos sorpresas.
- **Define el criterio de éxito.** "Rechazar correos sin @ o sin dominio" es
  verificable; "que la validación sea buena", no.
- **Incluye la verificación.** Correr la suite es parte de la tarea, no un
  favor posterior.

El agente va a leer los archivos, escribir la validación, agregar los tests y
correrlos. Tu trabajo empieza cuando termina el suyo: leer el diff y decidir
si el código está a la altura de tu proyecto. Esa revisión no es opcional —
es la parte del flujo que sigue siendo tuya, y es el tema central de la
sección de práctica.

## La evidencia: la herramienta sola no alcanza

Este es el dato que justifica que MAPAIA exista:

- En el experimento controlado de **Peng et al. (GitHub/MIT, 2023,
  arXiv:2302.06590)**, los desarrolladores con asistencia de IA completaron
  una tarea un **55,8 % más rápido** que el grupo de control.
- **McKinsey (2023)** midió mejoras de hasta el doble de velocidad en tareas
  como documentar o generar código nuevo… con un detalle importante: la
  ganancia caía fuerte en tareas complejas y en manos de desarrolladores con
  poca experiencia.
- **PwC (2025)** documentó el llamado *Junior Penalty*: perfiles junior que
  usaban IA **sin metodología ni guía** rindieron entre un **7 % y un 10 %
  menos** que sin IA.

Las mismas herramientas producen resultados opuestos. La variable que cambia
no es el modelo: es el criterio con que se lo usa. Desarrollar ese criterio
—saber qué delegar, cómo pedirlo y cómo verificar lo que vuelve— es
exactamente el objetivo de este repositorio.

## → Siguiente paso

Ya sabés qué es un agente y qué esperar de él. Lo que sigue es conocer el
terreno: qué herramientas existen, en qué formatos vienen y con qué criterios
elegir la tuya → [El ecosistema de herramientas](ecosistema.md).
