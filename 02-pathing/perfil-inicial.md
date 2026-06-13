# Perfil inicial: construir criterio desde el día uno

Sabés programar. Capaz estás estudiando, saliendo de un bootcamp o en tus
primeros trabajos. Lo que todavía no acumulaste son años de proyectos reales:
usuarios que se quejan, deadlines que aprietan, código heredado que nadie
quiere tocar. Y a diferencia de las generaciones anteriores, la IA estuvo ahí
desde tu primer "hola mundo".

Eso te da una ventaja enorme y un riesgo igual de grande. Esta línea existe
para que te quedes con la ventaja.

## El riesgo que esta línea ataca: la dependencia ciega

El dato más incómodo de toda la evidencia pública sobre IA y productividad te
apunta a vos: PwC (2025) documentó que los perfiles junior que usan IA **sin
metodología ni guía** rinden entre un **7 % y un 10 % peor** que sin IA. No
es que la herramienta no funcione: es que usada sin criterio, te saca más de
lo que te da.

El mecanismo es fácil de reconocer y difícil de admitir:

1. El agente genera código que *parece* correcto.
2. No tenés todavía el ojo para distinguir "parece correcto" de "es
   correcto", así que aceptás.
3. Funciona (por ahora), entonces repetís. Cada aceptación sin entender es
   una oportunidad de aprendizaje que no ocurrió.
4. Seis meses después, sos más rápido para producir código que no podés
   explicar, debuggear ni defender en una entrevista.

La salida no es dejar de usar IA — sería desperdiciar la mejor herramienta de
aprendizaje que existió nunca. La salida es usarla con reglas.

## Lo que esta línea te va a dar

- **Un modelo mental correcto** de qué es un agente, qué hace bien y dónde
  falla — para que tu confianza tenga base y no inercia.
- **Criterio de evaluación**: cómo revisar código generado, qué errores
  típicos buscar, cuándo sospechar.
- **El hábito de verificar**: tests, compilador y lectura crítica como
  reflejo, no como trámite.
- **Una herramienta elegida con cabeza** (y gratis si hace falta), en lugar
  de la que estaba de moda esta semana.

## Las reglas de oro mientras recorrés esta línea

1. **No aceptes código que no puedas explicar.** Es LA regla. Si no podés
   contar qué hace línea por línea, pedile al agente que te lo explique antes
   de integrarlo — explicar es algo que los modelos hacen muy bien.
2. **Usá el agente para entender, no solo para producir.** "¿Por qué elegiste
   este enfoque?", "¿qué alternativas había?", "¿dónde puede fallar esto?"
   valen más que el código mismo.
3. **Escribí vos primero, de vez en cuando.** Resolvé el problema a mano y
   después comparalo con lo que propone el agente. La diferencia entre las
   dos versiones es tu mejor material de estudio.
4. **La verificación no es opcional.** Corré los tests, leé el diff completo,
   probá el caso borde. Un agente que dice "listo" no es evidencia de nada.
5. **Tareas chicas.** Pedidos acotados con criterio de éxito claro. Los
   pedidos épicos fallan para todo el mundo, pero a vos además te impiden
   seguir el hilo de lo que pasó.

## Errores típicos de esta etapa (y cómo esquivarlos)

Todos los cometimos; vos podés cometerlos menos tiempo:

- **El copy-paste en cadena.** El agente propone, vos pegás, falla, le pegás
  el error, propone de nuevo, pegás… Si la rueda dio tres vueltas y no
  entendés más que al principio, frená: pedile el diagnóstico del problema,
  no otra solución.
- **Confundir fluidez con corrección.** El texto seguro y bien redactado del
  agente *suena* a verdad. La seguridad del tono es un rasgo del modelo, no
  una señal de calidad — calibrá tu confianza con lo que verificaste, no con
  lo que leíste.
- **Pedir demasiado de una.** "Haceme la app completa" produce demos
  impresionantes y aprendizajes nulos. Una función, un test, un bug por vez:
  así podés seguir el razonamiento y discutirlo.
- **No leer el diff.** Si aceptás cambios sin mirarlos, el repo deja de ser
  tuyo en un sentido muy literal: ya no sabés qué hay adentro.

## Tu ruta de lectura

En el sitio, esta es tu 🟢 línea en el mapa. En orden:

1. **[Qué son los agentes](../01-fundamentos/que-son-los-agentes.md)** — el
   modelo mental: qué puede hacer un agente, qué no, y por qué falla como
   falla. La sección de limitaciones es tu vacuna contra la fe ciega.
2. **[El ecosistema de herramientas](../01-fundamentos/ecosistema.md)** —
   elegí UNA herramienta y comprometete un mes con ella. Las opciones
   gratuitas alcanzan de sobra para esta etapa.
3. **El [glosario](../01-fundamentos/glosario.md), a mano** — no hace falta
   leerlo de corrido: tenelo cerca y consultalo cuando un término te frene.
4. **[Ingeniería de prompts](../03-practica/ingenieria-de-prompts.md)** — la
   habilidad que más rinde al principio: pedir bien es la mitad del trabajo.
5. **[Contexto y estructura](../03-practica/contexto-y-estructura.md)** —
   cómo dejarle al agente, por escrito, las reglas del proyecto.
6. **[Economía de contexto y tokens](../03-practica/economia-de-contexto.md)**
   — el hábito de tareas chicas y contexto justo; barato para tu bolsillo y
   mejor para tu aprendizaje (seguís el hilo de lo que pasa).
7. **[Flujos de trabajo](../03-practica/flujos-de-trabajo.md)** — el paso a
   paso por tipo de tarea; mirá con lupa "revisión de código generado", que
   es tu músculo en formación.
8. **[Método: spec-first y TDD](../03-practica/metodo-spec-first-y-tdd.md)** —
   el andamio que evita que dependas del agente: definí qué querés y verificá
   con tests, no con fe.
9. **[Arquitectura](../03-practica/arquitectura.md)** — por qué el código que
   le sirve al agente es el mismo que te conviene aprender a escribir.
10. **[Patrones de diseño](../03-practica/patrones-de-diseno.md)** — el
    vocabulario de soluciones probadas, y cuándo NO usarlas.

11. **[MCP](../04-extensibilidad/mcp.md)** — darle al agente herramientas y
    datos más allá del editor: el protocolo estándar para conectarlo a tu
    mundo de trabajo.
12. **[Skills](../04-extensibilidad/skills.md)** — empaquetar procedimientos
    que el agente carga cuando aplican; criterio tuyo, escrito y reutilizable.
13. **[Plugins](../04-extensibilidad/plugins.md)** — juntar todo lo anterior y
    distribuirlo. Te va a servir el día que trabajes en equipo.

## Mientras tanto: un ejercicio que vale por un curso

Tomá un ejercicio que ya hayas resuelto a mano (uno de la facultad, del
bootcamp, de un side project). Pedile al agente que lo resuelva de cero y
después compará las dos versiones con tres preguntas:

1. ¿Qué hizo distinto, y por qué?
2. ¿Cuál de las dos versiones falla primero ante un caso borde?
3. ¿Podrías defender la versión del agente en un code review, línea por
   línea?

Si la respuesta a la tercera es no, ahí tenés tu material de estudio de la
semana. Repetí el ejercicio cada tanto: el día que detectes un error del
agente antes de correrlo, brindá — el criterio está apareciendo.

## La pregunta del millón: ¿y esto no me deja sin trabajo?

La pregunta es legítima y merece una respuesta sin humo. Lo que muestra la
evidencia disponible no es que los agentes reemplacen desarrolladores: es
que **cambian qué parte del trabajo vale más**. Producir código se abarató;
saber qué código hace falta, evaluarlo y hacerse responsable de él, no.

Eso redibuja tu estrategia de carrera en esta etapa:

- Si tu única habilidad es traducir un enunciado claro a código que
  funciona, competís contra el agente — y el agente cobra por token.
- Si tu habilidad es entender el problema, dividirlo, supervisar la
  ejecución y garantizar la calidad del resultado, el agente trabaja *para*
  vos. Esa es exactamente la habilidad que esta línea entrena.

Dicho brutalmente: la dependencia ciega no solo te hace peor dev hoy — te
deja sin diferencial mañana. El criterio es tu plan de carrera.

## Señales de que ya estás para la línea experimentada

No hay examen de egreso, pero estas señales son bastante fiables:

- Rechazaste código generado porque viste el problema antes de correrlo.
- Podés predecir, con razonable acierto, en qué tareas el agente va a andar
  bien y en cuáles va a patinar.
- Tu primer instinto ante un "listo, ya quedó" es verificar, no agradecer.
- Trabajaste (o estás trabajando) en un proyecto real, con usuarios y código
  que no escribiste vos.

Cuando eso pase, la [línea experimentada](perfil-experimentado.md) te va a
quedar más cómoda: asume el criterio que ya construiste. Y si además ya
tenés el hábito diario y querés sistematizarlo, pegale una mirada al
[perfil nativo](perfil-nativo.md) — no hay escalas obligatorias en este
metro.

## → Siguiente paso

Tu primera estación: [qué son (y qué no son) los agentes de
IA](../01-fundamentos/que-son-los-agentes.md).
