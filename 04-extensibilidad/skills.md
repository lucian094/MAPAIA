# Skills: capacidades empaquetadas

Si MCP le da herramientas al agente, las skills le dan algo distinto:
**procedimientos**. Una skill es un instructivo empaquetado que el agente
carga cuando la situación lo pide, y que le dice no qué *puede* hacer sino cómo
*conviene* hacer algo en particular.

Pensá en esa cosa que le explicás al agente cada vez: "para crear un componente
en este proyecto, primero el test, después el archivo en `src/components/`, el
estilo va en un `.module.css` al lado, y registralo en el índice". Se lo
repetís en cada conversación. Una skill es esa explicación escrita una vez,
guardada, y disponible para siempre —para vos y para quien trabaje en el repo.

## Qué es exactamente

Una skill es una carpeta con un archivo `SKILL.md` adentro (y, opcionalmente,
recursos auxiliares). El `SKILL.md` tiene dos partes:

- un **frontmatter** YAML con metadatos —sobre todo un `name` y una
  `description`,
- un **cuerpo** en Markdown con las instrucciones propiamente dichas.

La pieza que hace que todo funcione es la `description`. El agente no carga
todas las skills todo el tiempo —sería un derroche de contexto. Lee solo los
metadatos de cada una y, cuando tu pedido coincide con lo que describe una
skill, recién ahí carga el cuerpo completo. La `description` es el disparador:
si está bien escrita, la skill aparece justo cuando hace falta; si está vaga,
no se activa nunca o se activa de más.

## Anatomía de una skill

Así se ve una skill mínima. La carpeta:

```
crear-componente/
└── SKILL.md
```

Y el `SKILL.md`:

```markdown
---
name: crear-componente
description: Usar cuando se crea un componente nuevo de React en este proyecto, para seguir la convención de test-primero, ubicación y registro.
---

# Crear un componente

Cuando te pidan un componente nuevo, seguí este orden:

1. Escribí primero el test en `src/components/<Nombre>/<Nombre>.test.tsx`.
2. Creá el componente en `src/components/<Nombre>/<Nombre>.tsx`.
3. Los estilos van en `<Nombre>.module.css` en la misma carpeta.
4. Registralo en `src/components/index.ts`.
5. Corré `npm test` y verificá que el test nuevo pasa.

No uses estilos inline ni librerías de UI externas: el proyecto usa CSS
modules y nada más.
```

Eso es todo lo que se necesita para una skill funcional. El frontmatter dice
cuándo usarla; el cuerpo, qué hacer. Cuando la skill crece —porque necesita un
template, un script o una tabla de referencia larga— esos archivos se suman a
la carpeta y el `SKILL.md` los menciona, en lugar de inflarse hasta volverse
imposible de leer.

```
crear-componente/
├── SKILL.md
├── plantilla.tsx        # esqueleto que el agente copia
└── convenciones.md      # referencia larga, se lee solo si hace falta
```

## Crear una de cero

El proceso es directo:

1. **Elegí UNA cosa que repetís.** Una skill resuelve un problema acotado. Si
   te encontrás escribiendo "y además…" tres veces, probablemente sean tres
   skills.
2. **Creá la carpeta y el `SKILL.md`.** Empezá por el frontmatter: ¿cómo
   describirías, en una frase, *cuándo* se usa esto?
3. **Escribí el cuerpo como se lo explicarías a alguien nuevo.** Pasos
   concretos, en imperativo, sin rodeos. El agente sigue instrucciones
   accionables mucho mejor que descripciones genéricas.
4. **Probala.** Pedí algo que debería activarla y mirá si aparece y si el
   resultado mejora. Si no se activó, la `description` necesita trabajo.

## Editar una existente

Las skills no se escriben perfectas de una. Se afinan con uso. Cuando una skill
no se activa cuando debería, el sospechoso casi siempre es la `description`:
hacela más específica sobre el *cuándo*. Cuando se activa pero el resultado
sigue saliendo flojo, el problema está en el cuerpo: faltan pasos, sobran
ambigüedades, o hay una instrucción que se contradice con otra.

Una regla práctica al editar: no rompas el contrato. Si otras skills, comandos
o personas dependen de que esta skill se llame de cierta forma o haga cierta
cosa, cambiá el interior sin cambiar lo que se ve desde afuera.

## Buenas prácticas de redacción

Lo que separa una skill que rinde de una que estorba:

- **La `description` dispara, no resume.** "Convierte código" es inútil. "Usar
  cuando se traduce un componente de Vue a React, para preservar props y
  estado" se activa en el momento justo.
- **Una responsabilidad por skill.** Acotada se mantiene fácil, se prueba fácil
  y se activa con precisión. Si hace de todo, no se activa para nada.
- **Instrucciones accionables.** Imperativo y pasos concretos le ganan siempre
  a la prosa explicativa. El agente ejecuta mejor "corré `npm test`" que "es
  importante testear".
- **Lo largo, afuera.** Referencias extensas, plantillas y scripts van en
  archivos aparte que el cuerpo menciona; así el `SKILL.md` queda corto y el
  contenido pesado se carga solo cuando de verdad hace falta.
- **Escribí para alguien sin tu contexto.** La skill la va a leer un agente que
  no estuvo en la conversación de ayer. Todo lo que asumís, escribilo.

Y una ventaja que se nota recién con el tiempo: como la skill es un archivo, va
versionada en el repo. Cambia con el proyecto, se revisa en un pull request
como cualquier código, y el equipo entero hereda la mejora cuando hace `git
pull`. El criterio deja de vivir en tu cabeza y pasa a estar en el repositorio.

## Skill o archivo de contexto: cuándo cada uno

Si leíste [contexto y estructura](../03-practica/contexto-y-estructura.md),
puede aparecerte la duda: ¿esto no es lo mismo que un `CLAUDE.md`? No, y la
diferencia es útil tenerla clara.

El archivo de contexto es lo que el agente lee **siempre**, en cada sesión:
las reglas generales del proyecto, válidas para todo lo que hagas. Una skill
se carga **solo cuando aplica**: el procedimiento puntual para una tarea
específica. Meter todo en el contexto lo infla y hace que el agente lea
instrucciones que casi nunca usa; meter las reglas generales en una skill hace
que a veces no se activen cuando deberían.

La regla práctica: lo que vale para *cualquier* tarea del proyecto va en el
archivo de contexto; lo que vale para *un tipo* de tarea va en una skill. "Los
tests usan Vitest" es contexto. "Cómo migrar una tabla de la base" es skill.

## Qué te llevás

Una skill es conocimiento operativo que dejás de repetir. Bien acotada y con
una buena `description`, es criterio tuyo que el agente aplica sin que vos
estés presente para dictarlo —y que tu equipo hereda con solo abrir el repo.

## → Siguiente paso

Una skill es una pieza suelta. Cuando querés agrupar varias —junto con
comandos, servidores MCP y configuración— y distribuir todo como una unidad
instalable, eso son los [plugins](plugins.md): el empaquetado que cierra la
sección de extensibilidad.
