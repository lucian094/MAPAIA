# El ecosistema de herramientas

> **Última actualización:** junio de 2026
>
> Este es el único archivo de MAPAIA con información volátil: nombres,
> productos y modalidades cambian seguido. Si encontrás algo desactualizado,
> [contribuir es bienvenido](https://github.com/lucian094/MAPAIA/blob/main/CONTRIBUTING.md).

Elegir herramienta paraliza más de lo que debería. La buena noticia: la
categoría importa más que la marca, y los conceptos que vas a aprender en
MAPAIA (contexto, prompts, verificación) se transfieren de una herramienta a
otra casi sin pérdida. Este archivo te da el mapa para ubicarte y un criterio
para arrancar.

## Cómo leer este mapa

Las herramientas se agrupan por **formato**, es decir, por dónde y cómo las
usás. Eso define la experiencia mucho más que el modelo que tengan abajo:

1. **Agentes de línea de comandos (CLI)** — viven en la terminal.
2. **Extensiones para tu editor** — se suman al editor que ya usás.
3. **IDEs con IA nativa** — editores diseñados alrededor de la IA.
4. **Opciones gratuitas y open source** — para presupuesto cero o control total.

Casi todas las opciones comerciales tienen prueba gratuita o un tier gratis
limitado. Los precios cambian demasiado seguido para listarlos acá: consultá
las páginas oficiales.

## Agentes de línea de comandos (CLI)

Corren en la terminal, operan sobre la carpeta del proyecto y son el formato
más "agéntico" de todos: leen archivos, ejecutan comandos y editan código con
tu supervisión. También son los más fáciles de automatizar (scripts, CI).

- **Claude Code** (Anthropic). El agente CLI de referencia. Fuerte en tareas
  largas con supervisión, sistema de permisos granular, extensible con skills
  y MCP. Funciona también como extensión de VS Code y JetBrains.
- **Codex CLI** (OpenAI). El equivalente del lado de OpenAI, open source.
  Integración natural con el ecosistema de ChatGPT.
- **Gemini CLI** (Google). Open source y con un tier gratuito generoso, lo
  que lo vuelve un buen punto de entrada sin tarjeta de crédito.

**Elegí CLI si:** vivís en la terminal, querés automatizar tareas con agentes
o trabajás en proyectos donde el editor es lo de menos.

## Extensiones para tu editor

Si ya tenés tu editor configurado a gusto, una extensión suma IA sin mudanza.
Todas las de esta lista hoy incluyen un modo agente además del autocompletado
clásico.

- **GitHub Copilot** (GitHub/Microsoft). La más extendida. Autocompletado,
  chat y modo agente dentro de VS Code, JetBrains y otros editores. Si tu
  equipo ya paga GitHub, suele ser el primer paso natural.
- **Cline**. Open source. Un agente completo dentro de VS Code, con la
  particularidad de que vos ponés la API key del modelo que quieras (Claude,
  GPT, Gemini, DeepSeek o un modelo local).
- **Continue**. Open source. Asistente configurable para VS Code y JetBrains,
  también con modelo a elección. Popular para armar setups a medida.

**Elegí extensión si:** tu editor actual no se negocia, o querés probar IA
con el mínimo cambio de hábitos posible.

## IDEs con IA nativa

Editores construidos (o reconstruidos) alrededor de la IA. La integración es
más profunda que la de una extensión: el contexto del proyecto, el chat y las
ediciones multiarchivo se sienten parte del editor y no un agregado.

- **Cursor**. Un fork de VS Code rediseñado alrededor de la IA. El más
  conocido de la categoría; si venís de VS Code, la transición es corta.
- **Windsurf**. Apuesta similar, con foco en flujos agénticos dentro del
  editor.
- **Antigravity** (Google). El entorno agéntico de Google: orientado a
  supervisar agentes trabajando, más que a escribir cada línea.

**Elegí IDE con IA si:** querés la experiencia más integrada y no te pesa
cambiar de editor.

## Opciones gratuitas y open source

Presupuesto cero no te deja afuera; te cambia el menú.

- **Ollama**. Ejecuta modelos open weights en tu máquina: nada sale de tu
  computadora, costo cero por token. Necesitás hardware decente y aceptar
  que los modelos locales rinden por debajo de los comerciales grandes.
- **Modelos open weights** (las familias Llama, Qwen, DeepSeek y compañía).
  Son los modelos que herramientas como Ollama, Cline o Continue te dejan
  enchufar. La brecha con los modelos comerciales se achica cada año.
- **DeepSeek**. Modelos potentes con API de costo muy bajo y versiones open
  weights: la opción frecuente para experimentar con presupuesto mínimo.
- **OpenClaw**. Asistente agéntico open source que se conecta al modelo que
  elijas. Más experimental, pero buen ejemplo de hacia dónde va el software
  de agentes fuera de las empresas grandes.
- Los **tiers gratuitos** de las herramientas comerciales (Gemini CLI es el
  más generoso al cierre de esta edición) alcanzan de sobra para aprender.

**Elegí esta vía si:** el presupuesto es cero, tus datos no pueden salir de
tu máquina, o simplemente querés entender el stack hasta abajo.

## ¿Y los chatbots de propósito general?

Claude, ChatGPT y Gemini en sus versiones web no son herramientas de
desarrollo, pero siguen teniendo un lugar en el flujo: pensar un diseño en
borrador, entender un concepto nuevo, discutir alternativas antes de escribir
una línea. La regla práctica es simple: **el chat para conversar ideas, el
agente para trabajar sobre el repo**. Lo que no conviene es usarlos como
editor de código a fuerza de copiar y pegar — para eso ya existen las
categorías de arriba, que ven tu proyecto de verdad.

## Criterios para elegir (en este orden)

1. **Presupuesto.** ¿Hay plata para una suscripción? Si no, arrancá por los
   tiers gratuitos u open source. Aprender no requiere pagar.
2. **Privacidad.** ¿Tu código puede viajar a una API externa? Si la respuesta
   es no (regulación, contratos), tu camino son los modelos locales.
3. **Tu flujo actual.** ¿Terminal o editor? ¿VS Code o JetBrains? La mejor
   herramienta es la que se mete en tu flujo sin pelearlo.
4. **El equipo.** Si tu equipo ya estandarizó una herramienta, empezá por esa:
   el conocimiento compartido vale más que una feature extra.

| Tu situación | Punto de partida razonable |
|---|---|
| Ya tenés GitHub Copilot por tu cuenta o por tu equipo | Activá su modo agente y exprimilo |
| Vivís en la terminal | Un agente CLI (Claude Code, Codex CLI, Gemini CLI) |
| Presupuesto cero, sin restricciones de datos | Gemini CLI gratis, o Cline + DeepSeek |
| Tus datos no pueden salir de tu máquina | Ollama + un modelo open weights |
| Querés la experiencia integrada máxima | Cursor, Windsurf o Antigravity |

## Lo que no importa tanto

- **La marca exacta.** Las categorías son estables; los líderes de cada una
  rotan. Lo que aprendas en una herramienta se transfiere a la siguiente.
- **Los benchmarks de marketing.** Cada lanzamiento "supera a todos los
  anteriores". Tu benchmark real es tu proyecto y tu flujo de trabajo.
- **Cambiar de herramienta cada semana.** El costo de aprender bien una
  supera la ganancia marginal de la novedad. Elegí una, usala un mes en
  serio, recién después evaluá.

El resto de MAPAIA es deliberadamente agnóstico de herramienta: todo lo que
sigue aplica a cualquiera de las opciones de este archivo.

## Cómo probar una herramienta (sin perder la semana)

Bajar algo y "ver qué onda" durante quince minutos no es una evaluación. Una
prueba que sí te dice algo:

1. **Elegí un proyecto real**, no un TODO list de juguete: una herramienta
   brilla u opaca según el contexto que tiene que manejar.
2. **Dale tres tareas de dificultad creciente**: un bug acotado, un test para
   código existente, una feature chica de punta a punta.
3. **Medí lo que te importa**: ¿el resultado era correcto? ¿cuánto tuviste
   que retocar? ¿entendiste lo que hizo y por qué?
4. **Sostenelo una semana** antes de opinar: las primeras horas con cualquier
   agente son las peores, porque todavía no sabés pedir.

Y anotá lo que encuentres — qué pedidos funcionaron, dónde tropezó, qué
tuviste que aclarar dos veces. Ese registro es el embrión de los archivos de
contexto que vas a ver en la sección de práctica.

## → Siguiente paso

Antes de meterte en las rutas por perfil, asegurate el vocabulario: el
[glosario](glosario.md) junta todos los términos que MAPAIA usa de acá en
adelante.
