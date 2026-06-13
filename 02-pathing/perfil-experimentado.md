# Perfil experimentado: integrar sin perder el control

Tenés años de oficio. Sabés lo que cuesta mantener un sistema en producción,
lo que vale un test bien escrito y lo que duele un refactor apurado. Y la IA,
hasta ahora, no entró en serio a tu flujo: no te convence, no encontraste el
momento, o la probaste hace tiempo y no estuvo a la altura.

Esta línea no viene a convertirte. Viene a que tomes la decisión con datos, y
a que — si decidís adoptar — lo hagas sin resignar el control que con razón
no querés soltar. Spoiler de cómo termina: con vos revisando todo igual que
siempre, pero eligiendo mejor en qué gastar tus horas de atención.

## Tu escepticismo es un activo

Empecemos por lo que no te van a decir los demos: tu desconfianza es la
habilidad más valiosa de toda esta historia. Revisar código ajeno asumiendo
que puede estar mal, detectar la solución que "funciona de casualidad",
oler el caso borde sin probarlo: eso es exactamente lo que el trabajo con
agentes exige y lo que a los perfiles más nuevos les falta.

Dicho de otro modo: no necesitás aprender a desconfiar del código generado.
Ya sabés. Lo que te falta es solo el hábito de la herramienta — y eso se
adquiere rápido cuando el criterio ya está.

Hay un matiz, eso sí: el escepticismo sirve mientras sea un filtro y no una
pared. El filtro evalúa evidencia y deja pasar lo que funciona; la pared
rebota todo sin mirar. Esta línea te propone exactamente eso: convertir tu
desconfianza en proceso de evaluación, con vos como juez y tus datos como
prueba.

## La fricción inicial es real (y se pasa)

Seamos honestos con la curva: las primeras semanas con un agente se sienten
más lentas que tu flujo de siempre. Tenés que aprender a formular pedidos, a
calibrar cuánto contexto dar, a interrumpir a tiempo. Tu flujo actual lleva
años de optimización; el nuevo, días. Comparar los dos en la semana uno es
hacer trampa en tu contra.

La evidencia pública, con sus matices, es consistente:

- **Peng et al. (GitHub/MIT, 2023)**: 55,8 % más rápido en una tarea de
  implementación con asistencia de IA, en un experimento controlado.
- **McKinsey (2023)**: hasta el doble de velocidad en documentar y generar
  código nuevo — pero la ganancia cae fuerte en tareas de alta complejidad.
  Traducción: el agente no te reemplaza en lo difícil; te libera de lo
  repetitivo para que te concentres en lo difícil.
- **Stack Overflow Developer Survey (2025)**: la mayoría de los
  desarrolladores profesionales ya usa herramientas de IA en su trabajo
  semanal. La adopción dejó de ser experimental.

## Las objeciones de siempre, tomadas en serio

Porque las escuchaste (o las dijiste), y porque ninguna es tonta:

- **"El código generado es malo."** A veces. Igual que el de cualquier
  colega nuevo: el punto no es si puede fallar sino si tu proceso de
  revisión lo atrapa. El tuyo, después de años de PRs ajenos, lo atrapa.
- **"Más rápido en escribir, más lento en debuggear."** Cierto cuando se
  acepta sin leer — que es exactamente lo que esta línea te propone no
  hacer. Con revisión, el balance neto da positivo en las tareas correctas.
- **"Es una moda."** Las cifras de adopción dicen otra cosa. Podés
  legítimamente decidir que no es para vos; conviene que esa decisión sea
  informada y revisable, no inercial.
- **"No quiero mandar mi código a una API externa."** Objeción totalmente
  válida y con respuesta concreta: modelos locales. El
  [ecosistema](../01-fundamentos/ecosistema.md) cubre esa vía.

## Cómo arrancar sin apostar el proyecto

La estrategia de esta línea es simple: empezar donde el costo de un error es
bajo y tu capacidad de evaluación es alta.

1. **Tests para código existente.** El agente escribe los tests, vos
   conocés el código. Si el test está mal, lo ves al instante. Es el terreno
   de práctica perfecto.
2. **Exploración de código ajeno.** "¿Qué hace este módulo?", "¿de dónde
   sale este valor?". Riesgo cero: no modifica nada y te ahorra horas de
   arqueología.
3. **Documentación y scripts puntuales.** Trabajo necesario, mecánico y
   fácil de revisar.
4. **Recién después, features y fixes** — con diffs chicos, revisados como
   revisarías el PR de alguien nuevo en el equipo: con atención y sin fe.

Tres reglas te mantienen al mando:

- **Mantené tu flujo.** Elegí la herramienta que se mete en tu terminal o tu
  editor actual, no la que te obliga a mudarte. El
  [ecosistema](../01-fundamentos/ecosistema.md) tiene el mapa por formato.
- **Usá los permisos a tu favor.** Las herramientas serias piden aprobación
  antes de ejecutar comandos o tocar archivos. Configuralas para que el
  agente proponga y vos dispongas.
- **Tu code review no se negocia.** Todo lo que firme tu nombre pasa por tus
  ojos, lo haya escrito un humano, un agente o vos mismo un viernes a las
  19.

## Tu ruta de lectura

En el sitio, esta es tu 🔵 línea en el mapa. En orden:

1. **[Qué son los agentes](../01-fundamentos/que-son-los-agentes.md)** — no
   por los conceptos básicos (los vas a leer en diagonal) sino por las
   limitaciones y la evidencia: ahí está la información que necesitás para
   decidir con fundamento.
2. **[El ecosistema de herramientas](../01-fundamentos/ecosistema.md)** —
   los criterios de elección pensados para tu caso: presupuesto, privacidad
   y, sobre todo, encaje con el flujo que ya tenés.
3. **[Contexto y estructura](../03-practica/contexto-y-estructura.md)** — la
   palanca más grande para tu perfil: convertir las convenciones de tu
   proyecto en instrucciones que el agente respete. Incluye los ADRs, para
   registrar el porqué de las decisiones. Ahí tu experiencia se vuelve
   ventaja competitiva.
4. **[Economía de contexto y tokens](../03-practica/economia-de-contexto.md)**
   — cómo darle el contexto justo y elegir el modelo según la tarea; eficiencia
   que ya intuís, ahora explícita.
5. **[Flujos de trabajo](../03-practica/flujos-de-trabajo.md)** — cómo
   integrar el agente a los workflows que ya tenés aceitados, empezando por
   las tareas de bajo riesgo.
6. **[Método: spec-first y TDD](../03-practica/metodo-spec-first-y-tdd.md)** —
   probablemente ya trabajás así; acá está nombrado y aplicado al agente, listo
   para defenderlo ante el equipo.

(Tres temas quedan fuera de tu ruta porque ya los dominás, pero ahí los tenés
si querés: la intro de [ingeniería de prompts](../03-practica/ingenieria-de-prompts.md)
—ya sabés pedir—, y [arquitectura](../03-practica/arquitectura.md) y
[patrones de diseño](../03-practica/patrones-de-diseno.md), con el porqué a mano
para defenderlos ante el equipo.)

Y ahora sí, la sección de extensibilidad ya está publicada y cierra tu ruta:
**[MCP](../04-extensibilidad/mcp.md)** para enchufar el agente a tus
herramientas internas, **[skills](../04-extensibilidad/skills.md)** para
escribir tus procedimientos una vez, y
**[plugins](../04-extensibilidad/plugins.md)** para empaquetarlos y repartirlos
al equipo. Es donde tu experiencia configurando entornos rinde directo.

## Proponete una prueba piloto (con fecha de fin)

Lo que mata la adopción en este perfil no es el fracaso: es la prueba
eterna que nunca se evalúa. Mejor un experimento corto y honesto:

1. **Elegí un mes y una herramienta.** Una sola. Cambiar de herramienta cada
   semana garantiza no aprender ninguna.
2. **Definí las tareas del piloto por adelantado.** Las cuatro de arriba
   (tests, exploración, documentación, fixes chicos) son un buen menú.
3. **Anotá lo mínimo.** Por tarea: ¿el resultado pasó tu revisión?, ¿te
   ahorró tiempo neto, contando la revisión? Una línea por día alcanza.
4. **Al final del mes, decidí con tus datos.** Adoptar donde rindió,
   descartar donde no, repetir el piloto más adelante si el veredicto fue
   "todavía no". Cualquiera de las tres es una conclusión digna — la única
   indigna es "ni lo probé, pero opino".

Bonus: ese registro de un mes te va a servir de nuevo cuando alguien del
equipo (o de arriba) pregunte si "hay que meter IA". Vas a ser la única
persona de la sala respondiendo con evidencia propia.

## Señales de que la integración está funcionando

- Delegaste una tarea completa (tests, refactor chico, script) y el
  resultado pasó tu revisión sin retoques mayores.
- Detectaste un error en código generado *antes* de correrlo — confirmación
  de que tu criterio sigue al mando.
- Dejaste de sentir que "le hacés un favor a la herramienta" y empezaste a
  notar el tiempo que te devuelve.
- Te descubriste explicándole a alguien del equipo cómo pedirle algo al
  agente. Cuando eso pase seguido, pegale una mirada al
  [perfil nativo](perfil-nativo.md): la sistematización es tu próximo nivel.

## → Siguiente paso

Tu primera estación: [qué son (y qué no son) los agentes de
IA](../01-fundamentos/que-son-los-agentes.md) — directo a las secciones de
limitaciones y evidencia.
