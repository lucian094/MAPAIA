# MCP: Model Context Protocol

Hasta acá, tu agente trabajó con lo que tenía a mano: tu código, tu terminal,
los archivos del proyecto. Pero el trabajo real casi nunca vive en un solo
lugar. Está también en una base de datos, en un sistema de tickets, en una
API interna, en la documentación de una herramienta. La pregunta natural es:
¿cómo le doy al agente acceso a *eso*, sin escribirle un integrador a medida
cada vez?

Esa es exactamente la pregunta que responde MCP — **Model Context Protocol**.
Es un estándar abierto, publicado por Anthropic a fines de 2024 y adoptado
después por buena parte del ecosistema, que define una forma común de conectar
un agente con herramientas y datos externos. La analogía que mejor funciona:
es el puerto USB-C de las herramientas de IA. Antes, cada conexión era un cable
propietario; con MCP, una sola forma de enchufar muchas cosas distintas.

## El problema que resuelve

Sin un estándar, cada integración es un trabajo aparte. Querés que el agente
lea de tu base de datos: le escribís un puente. Querés que consulte tu sistema
de tickets: otro puente, con otra forma de autenticar, otro formato de
respuesta. Cada herramienta nueva multiplica el trabajo, y nada se reutiliza
entre agentes distintos.

MCP corta ese nudo con una idea simple: si tanto el agente como la herramienta
hablan el mismo protocolo, cualquier agente compatible puede usar cualquier
herramienta compatible. El servidor MCP que alguien escribió para Postgres
sirve igual en Claude Code, en Claude Desktop o en cualquier otro cliente que
implemente el estándar. Se escribe una vez, se usa en todos lados.

## La arquitectura: cliente y servidor

MCP es un protocolo cliente-servidor con tres roles:

- **Host:** la aplicación con la que interactuás (Claude Code, Claude Desktop,
  un IDE). Es quien orquesta todo.
- **Cliente:** vive dentro del host y mantiene una conexión uno-a-uno con cada
  servidor. No lo ves; es plomería.
- **Servidor:** un proceso, propio o de terceros, que expone capacidades. Un
  servidor puede ofrecer tres cosas:
  - **tools** (herramientas): acciones que el agente puede ejecutar —consultar
    una base, llamar una API, crear un archivo.
  - **resources** (recursos): datos que el agente puede leer —el contenido de
    un archivo, una fila de una tabla.
  - **prompts**: plantillas de interacción que el servidor sugiere.

El host descubre qué ofrece cada servidor y se lo presenta al modelo. Cuando
el agente decide usar una tool, el cliente le pasa el pedido al servidor, el
servidor la ejecuta y devuelve el resultado. El modelo nunca toca el sistema
externo directo: siempre pasa por el servidor, que es quien pone los límites.

### Cómo viaja la comunicación

A bajo nivel, MCP usa mensajes JSON-RPC. No necesitás conocer el detalle, pero
sí saber que hay dos transportes principales:

- **stdio:** el servidor corre como un subproceso local y se comunica por
  entrada/salida estándar. Es lo más común para servidores que viven en tu
  máquina (acceso a archivos, a una base local, a tu terminal).
- **HTTP:** el servidor corre como un servicio remoto y el cliente se conecta
  por red. Es lo que usás para servidores compartidos o alojados por un
  tercero.

Para la mayoría de los casos del día a día, stdio alcanza y sobra.

## Para qué sirve, en concreto

Algunos usos que aparecen seguido:

- **Archivos y sistemas de versiones:** dar al agente acceso controlado a un
  directorio o a un repositorio Git.
- **Bases de datos:** que pueda consultar (y, si lo permitís, modificar) datos
  reales sin que vos copies y pegues filas.
- **APIs y servicios:** clima, búsqueda, un CRM, un sistema interno de tu
  equipo expuesto detrás de un servidor MCP.
- **Herramientas de tu organización:** el servidor MCP es la puerta por la que
  el agente toca lo que tu equipo ya tiene, con los permisos que vos definís.

La clave es esa última frase: vos definís los permisos. Un servidor MCP es
también un punto de control. Expone solo las tools que querés exponer, y cada
ejecución pasa —en las herramientas serias— por tu aprobación.

## Conectar un servidor que ya existe

Lo más probable es que tu primer contacto con MCP sea usar un servidor que
otra persona ya escribió. La conexión se declara en la configuración del
cliente. En Claude Code, por ejemplo, los servidores se listan en un archivo
`.mcp.json` (a nivel de proyecto) o en la config del usuario:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "./datos"]
    }
  }
}
```

Eso le dice al cliente: "para el servidor `filesystem`, ejecutá este comando y
hablale por stdio". Al arrancar, el agente descubre las tools que el servidor
expone (leer archivo, listar directorio, etc.) y ya puede usarlas. No hay
código que escribir de tu lado: configurás y listo.

Para un servidor remoto por HTTP, la forma cambia apenas:

```json
{
  "mcpServers": {
    "interno": {
      "url": "https://mcp.ejemplo.com/sse"
    }
  }
}
```

> Antes de conectar un servidor de terceros, miralo con el mismo ojo con el que
> mirás cualquier dependencia: qué permisos pide, quién lo mantiene, qué hace
> con tus datos. Un servidor MCP corre con el acceso que le das.

## Tu primer servidor propio

Cuando ningún servidor existente cubre tu caso, escribir uno es más fácil de lo
que parece, gracias a los SDKs oficiales. Este es un servidor mínimo en
TypeScript con una sola tool que suma dos números —el "hola mundo" de MCP—,
usando `@modelcontextprotocol/sdk`:

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({ name: 'calculadora', version: '1.0.0' });

// Una tool: nombre, esquema de entrada y la función que la implementa.
server.tool(
  'sumar',
  { a: z.number(), b: z.number() },
  async ({ a, b }) => ({
    content: [{ type: 'text', text: String(a + b) }],
  }),
);

// stdio: el host lo arranca como subproceso y le habla por entrada/salida.
await server.connect(new StdioServerTransport());
```

Tres piezas y nada más: creás el servidor, declarás una tool (con su esquema de
entrada, que el agente usa para saber qué mandarle) y la conectás por stdio. La
versión en Python con el SDK `mcp` es igual de corta. A partir de ese
esqueleto, "sumar" se convierte en "consultá esta base" o "llamá esta API", y
el patrón es el mismo: declarás la tool, validás la entrada, devolvés el
resultado.

## Qué te llevás

MCP no es magia: es un acuerdo. Acordar un protocolo común convierte cada
integración en algo reutilizable y cada servidor en un punto de control
explícito. Para tu agente, es la diferencia entre vivir encerrado en el editor
y poder tocar —con permiso— el resto de tu mundo de trabajo.

## → Siguiente paso

MCP le da al agente **herramientas**: cosas que puede hacer. Lo que sigue le da
**procedimientos**: formas de trabajar que empaquetás y reutilizás. Esas son
las [skills](skills.md) — cómo escribir una capacidad que el agente carga
justo cuando hace falta.
