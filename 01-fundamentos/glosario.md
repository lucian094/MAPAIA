# Glosario

Los términos que se usan en todo MAPAIA, en orden alfabético. Las definiciones
son cortas y pragmáticas: lo justo para leer el resto del contenido sin
tropezar, no un paper. En el sitio, este mismo archivo alimenta la página de
glosario con búsqueda.

<!--
Convención de formato (NO romper): cada término es un encabezado `## ` seguido
de UN párrafo de texto plano, sin links ni código inline. El sitio parsea este
archivo para la búsqueda (/glosario) y para los tooltips. La sección final
"## → Siguiente paso" es la única que no es un término.
-->

## Agente

Programa que usa un modelo de lenguaje dentro de un loop de percibir, razonar
y actuar: lee archivos, ejecuta comandos, edita código y evalúa los resultados
para decidir el próximo paso, todo bajo supervisión humana. Se diferencia del
chatbot en que actúa sobre tu proyecto en lugar de solo conversar.

## Alucinación

Salida de un modelo que suena segura pero es falsa: una función que no existe
en esa librería, una opción de configuración inventada, una afirmación sin
sustento. No es un bug ocasional sino una consecuencia de cómo generan texto
los modelos; se mitiga con verificación (tests, compilador, revisión), no con
confianza.

## API key

Credencial secreta que identifica tus llamadas a la API de un proveedor de
modelos y permite cobrarlas. La piden las herramientas "bring your own key"
como Cline o Continue. Tratala como una contraseña: nunca se commitea al
repositorio.

## Archivo de contexto

Archivo del repositorio (CLAUDE.md, AGENTS.md, .cursorrules, según la
herramienta) con instrucciones que el agente lee antes de trabajar:
convenciones del proyecto, comandos, restricciones. Es la forma estándar de
convertir el conocimiento implícito del equipo en algo que el agente pueda
usar.

## Autocompletado con IA

Sugerencias de código generadas mientras escribís, directamente en el editor:
proponen la próxima línea o el cuerpo de una función y vos las aceptás o las
ignorás. Es la forma más básica de asistencia; no conversa, no planifica ni
ejecuta nada.

## Chatbot

Interfaz conversacional con un modelo de lenguaje: vos escribís, el modelo
responde, y mover información entre el chat y tu proyecto corre por tu cuenta.
Solo ve lo que le pegás, que es a la vez su límite principal y la causa de
muchas respuestas equivocadas con tono seguro.

## Contexto

Todo el texto que el modelo tiene disponible al momento de generar una
respuesta: la conversación previa, los archivos que leyó, las instrucciones de
sistema, los resultados de comandos. Es el recurso más escaso al trabajar con
agentes; administrarlo bien es una de las habilidades centrales que enseña
MAPAIA.

## Embedding

Representación numérica (un vector) de un texto, que captura su significado de
forma que textos parecidos queden cerca entre sí. Es la pieza que hace posible
la búsqueda semántica y los sistemas RAG.

## Fine-tuning

Reentrenamiento parcial de un modelo existente con datos propios para
especializarlo en un dominio o estilo. Es costoso y rara vez necesario para
adoptar agentes: casi siempre alcanza con buen contexto y buenos prompts.

## Inferencia

La ejecución de un modelo ya entrenado para producir una salida. Cada
respuesta que recibís de un modelo es una inferencia, y es lo que las API
cobran, medido en tokens de entrada y de salida.

## Ingeniería de prompts

La práctica de escribir instrucciones efectivas para un modelo: ser
específico, dar contexto y ejemplos, definir el formato esperado, iterar.
Menos pomposa de lo que suena y más importante de lo que parece; tiene su
propio archivo en la sección de práctica.

## LLM (modelo de lenguaje grande)

Red neuronal entrenada sobre cantidades enormes de texto, que genera salidas
prediciendo el token más probable que sigue. Es el motor de todas las
herramientas de este repositorio: el autocompletado, los chatbots y los
agentes son distintas formas de envolver un LLM.

## MCP (Model Context Protocol)

Protocolo abierto que estandariza cómo un agente se conecta con herramientas y
fuentes de datos externas: bases de datos, navegadores, APIs, sistemas
internos. Funciona como un enchufe universal: cualquier cliente MCP puede usar
cualquier servidor MCP. Tiene su propio archivo en la sección de
extensibilidad.

## Modelo open weights

Modelo cuyos pesos se publican para descargar y ejecutar en infraestructura
propia, sin depender de una API externa. Las familias Llama, Qwen o DeepSeek
son ejemplos. La opción cuando los datos no pueden salir de tu máquina o el
presupuesto es cero.

## Plugin

Paquete que extiende una herramienta de IA con capacidades nuevas: comandos,
agentes preconfigurados, integraciones. La frontera con skill y con servidor
MCP varía según la herramienta; el criterio práctico es que el plugin extiende
la herramienta, mientras que MCP la conecta con el mundo exterior.

## Prompt

El texto que le das al modelo para pedirle algo: la pregunta, la instrucción,
la tarea. Su calidad determina buena parte de la calidad de la respuesta, y
por eso escribirlos bien es una habilidad en sí misma.

## RAG (generación aumentada por recuperación)

Técnica que, antes de generar una respuesta, busca información relevante en
una base de conocimiento (documentos, código, wikis) y la inyecta en el
contexto del modelo. Así el modelo responde sobre datos que no estaban en su
entrenamiento, como la documentación interna de tu empresa.

## Razonamiento extendido

Modo en el que el modelo "piensa" antes de responder: genera un razonamiento
intermedio que mejora los resultados en problemas complejos, a cambio de más
tiempo y más tokens. Útil para planificar o depurar; innecesario para tareas
mecánicas.

## Sandbox

Entorno aislado donde el agente puede ejecutar comandos sin riesgo para el
resto del sistema. Es el mecanismo que permite darle autonomía sin entregarle
la máquina: lo que rompe, lo rompe adentro.

## Skill

Paquete de instrucciones y recursos que le enseña a un agente a ejecutar una
tarea específica de forma repetible: cómo revisar un PR, cómo armar un
reporte, cómo desplegar. Se escribe una vez y el agente la carga cuando la
necesita. Tiene su propio archivo en la sección de extensibilidad.

## Subagente

Agente que otro agente lanza para delegarle una subtarea (explorar el código,
revisar un cambio) con su propio contexto limpio. Patrón común en flujos
avanzados para no agotar la ventana de contexto del agente principal.

## System prompt

Las instrucciones que el modelo recibe antes de la conversación y que definen
su comportamiento general: qué rol cumple, qué reglas sigue, qué tiene
permitido hacer. En las herramientas de desarrollo viene dado, pero los
archivos de contexto del proyecto se le suman en la práctica.

## Token

La unidad mínima de texto con la que opera un modelo: una palabra corta, un
pedazo de palabra, un signo. Como referencia gruesa, en español una palabra
promedia entre uno y dos tokens. Importa porque todo se mide y se cobra en
tokens: el contexto disponible, el costo por consulta, los límites de uso.

## Ventana de contexto

La cantidad máxima de tokens que un modelo puede tener presente a la vez,
sumando instrucciones, conversación, archivos y respuesta. Cuando se llena,
algo se resume o se pierde. Es la razón por la que las tareas acotadas
funcionan mejor que los pedidos gigantes.

## Vibe coding

Estilo de desarrollo que consiste en pedirle todo al agente y aceptar lo que
salga sin revisar el código. Funciona para prototipos descartables; aplicado a
software que alguien va a mantener, es la receta del Junior Penalty que MAPAIA
intenta evitar.

## → Siguiente paso

Con el vocabulario a mano, lo que sigue es encontrar tu ruta: la
autoevaluación y los perfiles de `02-pathing/` (en construcción — llegan en la
próxima fase). Si caíste acá directo, arrancá por
[qué son los agentes](que-son-los-agentes.md).
