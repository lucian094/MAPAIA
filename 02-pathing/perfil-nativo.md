# Perfil nativo: del uso intensivo al uso sistemático

Usás agentes todos los días. Formulás pedidos con soltura, sabés cuándo
interrumpir, tenés tus trucos. Es probable que seas la persona a la que tu
equipo le pregunta "¿cómo le pediste eso?" — y también es probable que tu
respuesta sea "no sé, me salió".

Ahí está exactamente el techo de esta etapa. Esta línea existe para
rompértelo — y para que lo que construyas al otro lado no dependa de vos
para sostenerse.

## El techo del autodidacta

El uso intensivo construye intuición, y la intuición tiene tres problemas:

1. **No se mide.** ¿La IA te hace más rápido? Seguro que en algunas tareas
   sí y en otras te hace perder el tiempo con elegancia. ¿Sabés en cuáles?
   ¿O lo sentís, nomás?
2. **No se escala.** Tus mejores prácticas viven en tu memoria de trabajo.
   Cada proyecto nuevo arranca de cero; cada prompt bueno se reescribe de
   memoria.
3. **No se transfiere.** Si mañana te vas de vacaciones dos semanas, el
   "nivel de IA" de tu equipo se va con vos. Eso no es seniority: es un bus
   factor.

La diferencia entre un usuario avanzado y un adoptante maduro no es cuánto
usa la herramienta: es cuánto de su práctica sobrevive sin él.

## Un riesgo propio de tu perfil: la confianza acumulada

Mención aparte para un fenómeno silencioso: cuanto mejor te responde el
agente, menos verificás. Mil respuestas buenas construyen una confianza que
la respuesta mil uno no merece — el modelo no se ganó tu confianza: te
acostumbró. Los perfiles nuevos fallan por no saber evaluar; el tuyo falla
por dejar de hacerlo. La defensa es la misma que le pedirías a un junior:
proceso de verificación, no sensación de seguridad.

## Los cuatro frentes de esta línea

### 1. Sistematizar

Todo lo que repetís merece estar escrito. Las convenciones del proyecto van
en archivos de contexto (CLAUDE.md, AGENTS.md, .cursorrules) que el agente
lee solo; los procedimientos repetibles se convierten en skills o comandos;
los prompts heroicos que solo vos sabés formular son deuda técnica con otro
nombre. La prueba ácida: ¿un compañero con tu misma herramienta consigue
resultados parecidos a los tuyos en tu repo? Si la respuesta es no, lo que
funciona no es tu sistema — sos vos a mano.

### 2. Medir

Tu benchmark real no es ningún leaderboard: es tu proyecto. Empezá simple,
una nota por semana alcanza: en qué tareas el agente te ahorró tiempo de
verdad, en cuáles terminaste rehaciendo, cuántas vueltas de corrección
necesitó. Con un mes de datos vas a tener algo que casi nadie tiene:
evidencia propia para decidir qué delegar y qué no — y para responder con
números cuando el equipo pregunte si esto vale la pena.

### 3. Extender

Acá es donde tu perfil se separa del resto: los agentes son plataformas.
MCP conecta tu agente con tus sistemas (la base de datos, el navegador, las
APIs internas); las skills empaquetan procedimientos que el agente carga
cuando los necesita; los plugins distribuyen todo eso al equipo. La sección
de extensibilidad de MAPAIA — el corazón de tu ruta — cubre los tres.

### 4. Transferir

El multiplicador más grande no es tu productividad: es la del equipo.
Documentar cómo trabajás, revisar los flujos de los demás como revisarías
su código, sentarte media hora con quien recién empieza — con la guía
adecuada, evitás que repita el camino de prueba y error que a vos te costó
meses. El [perfil inicial](perfil-inicial.md) y el
[experimentado](perfil-experimentado.md) te sirven de mapa de qué necesita
cada quien: el primero requiere reglas que protejan su criterio en
formación; el segundo, evidencia y respeto por un flujo que ya funciona.
Evangelizar con entusiasmo y sin método produce el efecto contrario al
buscado.

## Auditá tu flujo actual

Antes de seguir leyendo, un diagnóstico honesto. Marcá lo que ya tenés:

- [ ] Mis proyectos activos tienen archivo de contexto, actualizado.
- [ ] Mis prompts y procedimientos repetidos están escritos en algún lado
      (no en mi memoria).
- [ ] Sé — con datos, no con sensaciones — en qué tareas la IA me ahorra
      tiempo y en cuáles me lo quema.
- [ ] Alguien más de mi equipo puede reproducir mi flujo sin preguntarme.
- [ ] Verifico el trabajo del agente con un proceso (diff, tests, casos
      borde), no con confianza acumulada.

Cinco marcas: esta línea te va a servir igual, pero como checklist de
mantenimiento. Tres o menos: estás exactamente donde esta línea ayuda.

## Tu ruta de lectura

En el sitio, esta es tu 🟣 línea en el mapa. En orden:

1. **[El ecosistema de herramientas](../01-fundamentos/ecosistema.md)** — sí,
   ya lo conocés; leelo igual, con ojo de auditor. Es el único archivo de
   MAPAIA con fecha de actualización, y en este ecosistema seis meses son una
   era geológica. Vos sos quien tiene que tener el mapa fresco, porque tu
   equipo te va a preguntar a vos.
2. Los [fundamentos](../01-fundamentos/que-son-los-agentes.md) como repaso
   en diagonal, si hace falta — en particular el vocabulario del
   [glosario](../01-fundamentos/glosario.md), que es el que usa todo MAPAIA.

Las siguientes estaciones de tu línea llegan con las secciones de práctica y
de extensibilidad (en construcción): los archivos de contexto y los flujos
de trabajo con ojo de sistematizador, y después MCP, skills y plugins — el
tramo central de tu ruta. Se anuncian acá mismo cuando estén publicadas.

## Mientras tanto: tres movidas de esta semana

No hace falta esperar al contenido para arrancar los cuatro frentes:

1. **Escribí el archivo de contexto de tu proyecto principal.** Treinta
   minutos: convenciones, comandos, restricciones. Es la pieza con mejor
   relación costo-beneficio de todo el ecosistema.
2. **Convertí tu mejor prompt recurrente en texto versionado.** El que
   reescribís de memoria cada vez. Guardalo en el repo, mejoralo con uso.
3. **Arrancá el registro de mediciones.** Una línea por día: tarea, ¿ahorró
   tiempo neto?, ¿cuántas correcciones? En un mes tenés tu benchmark.

## Señales de que la sistematización está funcionando

Esta es la última línea del mapa, así que las señales no son de "pase a la
siguiente" sino de madurez — la tuya y la de tu entorno:

- Un compañero resolvió una tarea con tu flujo, leyendo tus archivos de
  contexto y tus procedimientos, **sin preguntarte nada**.
- Defendiste (o descartaste) una herramienta ante el equipo **con tus
  mediciones**, no con entusiasmo ni con artículos ajenos.
- Tu proyecto principal mejora cuando vos no estás: alguien más le agregó
  una convención al archivo de contexto o afinó una skill.
- Detectaste y cortaste a tiempo tu propia confianza acumulada: una
  respuesta del agente te sonó perfecta, la verificaste igual, y estaba
  mal.
- Tu onboarding de IA para gente nueva cabe en un documento y un par de
  horas de pairing — no en seis meses de osmosis.

Cuando la mayoría de estas señales estén encendidas, vas a estar haciendo
algo más valioso que usar bien una herramienta: vas a estar construyendo la
capacidad de tu equipo. De eso se trataba sistematizar.

## → Siguiente paso

Tu primera estación: [el ecosistema de
herramientas](../01-fundamentos/ecosistema.md), esta vez con ojo de auditor.
