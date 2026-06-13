# Plugins: empaquetar y distribuir

Llegaste con dos piezas en la mano: servidores **MCP**, que le dan herramientas
al agente, y **skills**, que le dan procedimientos. Funcionan. Pero viven
sueltas: una skill en una carpeta, un servidor en un `.mcp.json`, un comando
que copiaste de un repo a otro. Cuando querés que tu equipo use lo mismo que
vos —o cuando querés instalar de un saque lo que armó otra persona— necesitás
una caja que junte todo. Esa caja es el plugin.

## Qué son

Un plugin es una unidad instalable que empaqueta varias extensiones juntas. En
ecosistemas como el de Claude Code, un plugin puede incluir:

- **skills** —los procedimientos del capítulo anterior,
- **comandos** (slash commands) —atajos para acciones frecuentes,
- **servidores MCP** —las herramientas externas, ya configuradas,
- **subagentes** —agentes especializados para tareas concretas,
- **hooks** —scripts que se disparan en ciertos momentos del trabajo.

En lugar de configurar cada cosa a mano, instalás el plugin y todo eso queda
disponible de una vez. Es la diferencia entre pasarle a un compañero cinco
archivos con instrucciones de dónde va cada uno, y pasarle un paquete que se
instala con un comando.

## De dónde salen

Los plugins se distribuyen a través de **marketplaces**: catálogos —muchas
veces un simple repositorio Git— desde los que el agente los descubre e
instala. Agregás un marketplace, mirás qué plugins ofrece, instalás el que te
sirve. Así es como una comunidad comparte flujos de trabajo completos sin que
cada persona los rearme desde cero.

El gesto es deliberadamente parecido al de instalar una dependencia: apuntás a
una fuente, elegís un paquete, lo traés. La diferencia es qué traés —no una
librería de código, sino una forma de trabajar con el agente: sus
herramientas, sus procedimientos y sus atajos, ya armados.

> Acá vale el mismo recaudo que con cualquier dependencia o servidor MCP: un
> plugin trae código que va a correr con tus permisos. Instalá de fuentes que
> puedas auditar o en las que confíes, y revisá qué incluye antes de darle
> lugar en tu flujo.

El detalle de qué plugins y marketplaces concretos existen cambia rápido —y la
información volátil de herramientas y precios vive en el
[ecosistema](../01-fundamentos/ecosistema.md), no acá. Lo que no cambia es el
criterio para decidir.

## Anatomía de un plugin

Un plugin es, en el fondo, una carpeta con una estructura convenida y un
manifiesto que declara qué trae. A grandes rasgos:

```
mi-plugin/
├── plugin.json          # manifiesto: nombre, versión, qué incluye
├── skills/              # las skills del capítulo anterior
│   └── crear-componente/
│       └── SKILL.md
├── commands/            # slash commands del equipo
│   └── deploy.md
└── .mcp.json            # servidores MCP que el plugin configura
```

El manifiesto es lo que convierte un montón de archivos sueltos en algo
instalable:

```json
{
  "name": "flujo-equipo",
  "version": "1.0.0",
  "description": "Skills, comandos y MCP del equipo de plataforma."
}
```

Instalar el plugin registra todo lo que declara: las skills quedan
disponibles, los comandos aparecen, los servidores MCP se configuran solos.
Desinstalarlo lo saca todo junto, sin dejar archivos huérfanos dando vueltas.
Esa atomicidad —entra todo o no entra nada— es media razón de ser del formato.

## Usar uno existente vs. armar el propio

La pregunta no es técnica, es de costo-beneficio:

- **Usá uno existente** cuando alguien ya resolvió tu problema y podés auditar
  lo que trae. No reinventes un plugin de, digamos, integración con tu lenguaje
  favorito si hay uno mantenido y revisable.
- **Armá el propio** cuando lo que necesitás es específico de tu equipo o tu
  proyecto: tus convenciones, tus herramientas internas, tu forma de trabajar.
  Eso no lo va a tener nadie más, y empaquetarlo es lo que te permite
  repartirlo entre tus compañeros sin un instructivo de diez pasos.

La señal de que te conviene armar uno: ya tenés tres o cuatro skills, un par de
comandos y un servidor MCP que todos en el equipo terminan configurando a mano.
Ese trabajo repetido es justo lo que un plugin elimina.

## Errores comunes al empezar

Tres tropiezos que se repiten cuando uno arma su primer plugin:

- **Empaquetar de más, demasiado pronto.** No conviertas en plugin algo que
  todavía estás descubriendo cómo hacer. Primero las skills y comandos sueltos
  prueban su valor en uso; recién cuando se estabilizan vale la pena empacarlos.
- **Una `description` floja en el manifiesto o en las skills.** El plugin se
  instala, pero después nadie —ni el agente— sabe cuándo usar lo que trae. El
  empaquetado no arregla un contenido vago: lo distribuye.
- **Confiar sin auditar.** Un plugin lindo de un marketplace desconocido sigue
  siendo código de un tercero corriendo con tus permisos. Mirá qué incluye.

Para un equipo, el salto natural es un **marketplace propio**: un repositorio
con los plugins de la organización, del que cada integrante instala lo que
necesita. Ahí el flujo deja de vivir en la cabeza de una persona y pasa a ser
infraestructura compartida —que es, otra vez, de lo que se trata sistematizar.

## Cómo encaja todo

Si mirás la sección completa, las tres piezas forman una escalera:

| Pieza | Qué aporta | Analogía |
|---|---|---|
| **MCP** | Herramientas: qué puede *tocar* el agente | Las manos |
| **Skills** | Procedimientos: cómo *conviene* hacer algo | El oficio |
| **Plugins** | Empaquetado: cómo se *distribuye* y se comparte | La caja de herramientas |

No competimos entre ellas: se apilan. Un plugin maduro suele traer un servidor
MCP para las herramientas, varias skills para los procedimientos y unos
comandos para los atajos —las tres capas, en una sola instalación.

Y se puede empezar por cualquier escalón. No hace falta tener un plugin para
escribir tu primera skill, ni un servidor MCP para armar un comando útil. Cada
pieza rinde sola; el empaquetado llega cuando ya tenés varias que valen la pena
compartir. Andá de a una.

## El final del recorrido

Acá termina el mapa. Empezaste preguntándote qué es (y qué no es) un agente, y
llegaste a empaquetar tus propias extensiones para que un equipo entero trabaje
como vos. Entre esos dos puntos está lo que importa de verdad: no la
herramienta, sino el **criterio** para usarla —pedir bien, dar contexto,
verificar siempre, sistematizar lo que funciona.

Las herramientas van a seguir cambiando. El criterio que construiste, no. Esa
fue siempre la apuesta de MAPAIA.

## → Siguiente paso

Cerrá el círculo: [volvé a tu ruta](../02-pathing/README.md) para repasar el
perfil que seguiste con la mirada de quien ya recorrió todo, o pasá por el
[glosario](../01-fundamentos/glosario.md) si quedó algún término por fijar.
Y si algo de esto te sirvió, el mejor siguiente paso es usarlo en tu próximo
proyecto.
